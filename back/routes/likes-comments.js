// imports
const models = require("../models");
const jwtUtils = require("../utils/jwt.utils");
const asyncLib = require("async");

// constantes
const LIKED = 1;

module.exports = {
  //fonction de like des commentaire
  likeCommentPost: function (req, res) {
    // recupère le header et decode le token
    let headerAuth = req.headers["authorization"];
    let userId = jwtUtils.getUserId(headerAuth);

    //recupère le id du commentaire dans les paramètres d'url
    let messageId = parseInt(req.params.commentId);

    //verifie que le messageId ne soit pas null
    if (messageId <= 0) {
      return res.status(400).json({ error: "invalid parameters" });
    }

    //exécute un tableau de fonction en série , passant chacune ses resultats à la suivante.
    //cependant, ci l'une des fonction transmet une erreur ne sera pas éxécutée
    asyncLib.waterfall(
      [
        function (done) {
          //cherche le commentaire à liker
          models.Comments.findOne({
            where: { id: messageId },
          })
            .then(function (commentFound) {
              done(null, commentFound);
            })
            .catch(function (err) {
              return res
                .status(500)
                .json({ error: "unable to verify message" });
            });
        },
        function (commentFound, done) {
          if (commentFound) {
            //cherche le l'utilisateur qui like le commentaire
            models.User.findOne({
              where: { id: userId },
            })
              .then(function (userFound) {
                done(null, commentFound, userFound);
              })
              .catch(function (err) {
                return res.status(500).json({ error: "unable to verify user" });
              });
          } else {
            res.status(404).json({ error: "post already liked" });
          }
        },
        function (commentFound, userFound, done) {
          if (userFound) {
            //si l'utilisateur est trouvé on cherche le like dans la table like
            const messageAlreadyLiked = models.LikeComments.findOne({
              where: {
                userId: userId,
                commentId: messageId,
              },
            });
            //si le like n'existe pas on le créé
            if (Object.keys(messageAlreadyLiked).length === 0) {
              (function (userAlreadyLikedFound) {
                done(null, commentFound, userFound, userAlreadyLikedFound);
                if (messageAlreadyLiked !== LIKED) {
                  models.LikeComments.create({
                    userId: userId,
                    commentId: messageId,
                    isLike: LIKED,
                  });
                }
              })();
            } else {
              return res
                .status(500)
                .json({ error: "unable to verify is user already liked" });
            }
          } else {
            res.status(404).json({ error: "user not exist" });
          }
        },
        function (commentFound, userFound, userAlreadyLikedFound, done) {
          if (!userAlreadyLikedFound) {
            commentFound
              .update({
                likes: commentFound.likes + 1,
              })
              .then(function () {
                done(commentFound);
              })
              .catch(function (err) {
                res
                  .status(500)
                  .json({ error: "cannot update message like counter" });
              });
          }
        },
      ],
      function (commentFound) {
        if (commentFound) {
          return res.status(201).json(commentFound);
        } else {
          return res.status(500).json({ error: "cannot update message" });
        }
      }
    );
  },

  //fontion de dislike des commentaires
  // ce reférer au commentaires de la fontion like
  dislikeCommentPost: function (req, res) {
    
    const headerAuth = req.headers["authorization"];
    const userId = jwtUtils.getUserId(headerAuth);

    const messageId = parseInt(req.params.commentId);

    if (messageId <= 0) {
      return res.status(400).json({ error: "invalid parameters" });
    }

    asyncLib.waterfall(
      [
        function (done) {
          models.Comments.findOne({
            where: { id: messageId },
          })
            .then(function (commentFound) {
              done(null, commentFound);
            })
            .catch(function (err) {
              return res
                .status(500)
                .json({ error: "unable to verify message" });
            });
        },
        function (commentFound, done) {
          if (commentFound) {
            models.User.findOne({
              where: { id: userId },
            })
              .then(function (userFound) {
                done(null, commentFound, userFound);
              })
              .catch(function (err) {
                return res.status(500).json({ error: "unable to verify user" });
              });
          } else {
            res.status(404).json({ error: "post already liked" });
          }
        },
        function (commentFound, userFound, done) {
          if (userFound) {
            const messageAlreadyLiked = models.LikeComments.findOne({
              where: {
                userId: userId,
                commentId: messageId,
              },
            });
            if (messageAlreadyLiked) {
              (function (userAlreadyLikedFound) {
                done(null, commentFound, userFound, userAlreadyLikedFound);
                models.LikeComments.destroy({
                  where: {
                    userId: userId,
                    commentId: messageId,
                  },
                });
              })();
            } else {
              return res
                .status(500)
                .json({ error: "unable to verify is user already liked" });
            }
          } else {
            res.status(404).json({ error: "user not exist" });
          }
        },
        function (commentFound, userFound, userAlreadyLikedFound, done) {
          if (!userAlreadyLikedFound) {
            commentFound
              .update({
                likes: commentFound.likes - 1,
              })
              .then(function () {
                done(commentFound);
              })
              .catch(function (err) {
                res
                  .status(500)
                  .json({ error: "cannot update message like counter" });
              });
          }
        },
      ],
      function (commentFound) {
        if (commentFound) {
          return res.status(201).json(commentFound);
        } else {
          return res.status(500).json({ error: "cannot update message" });
        }
      }
    );
  },

  getLikeComment: function (req, res) {
    const headerAuth = req.headers["authorization"];
    const userId = jwtUtils.getUserId(headerAuth);
    const messageId = req.params.commentId;
    models.LikeComments.findAll(),
      models.LikeComments.findOne({
        where: {
          userId: userId,
          commentId: messageId,
        },
      })
        .then(function (likesComment) {
          if (likesComment) {
            res.status(200).json(true);
          } else {
            res.status(200).json(false);
          }
        })
        .catch(function (err) {
          console.log(err);
          res.status(500).json({ error: "invalid fields" });
        });
  },
};
