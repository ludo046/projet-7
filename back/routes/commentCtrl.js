//import
const models = require("../models");
const asyncLib = require("async");
const jwtUtils = require("../utils/jwt.utils");
const fs = require("fs");
const { invalid } = require("joi");
const sendCommentSchema = require("../utils/joi/sendPost");

const CONTENT_LIMIT = 1200; //limitation des caractères

module.exports = {
  //fonction envoie de commentaires
  commentPost: async function (req, res) {
    try {
      const valid = await sendCommentSchema.validateAsync(req.body); //securité input verifie le schema joi
      if (valid) {
        // si schema valide effectue la fontion
        let headerAuth = req.headers["authorization"];
        let userId = jwtUtils.getUserId(headerAuth); // decode le token pour recuperer le userId grace au middleware

        let content = null;
        let messageId = parseInt(req.params.messageId);
        let attachment = null;
        let movie = null;
        if (req.file) {
          //verifie si un file est attaché au commentaire et tri les images et les video pous les mettre dans la bonne colonne
          let media = req.file.filename;
          if (media.includes("mp4")) {
            // verifie si 'mp4' existe dans le nom du file
            movie = `${req.protocol}://${req.get("host")}/images/${
              req.file.filename
            }`;
          } else {
            attachment = `${req.protocol}://${req.get("host")}/images/${
              req.file.filename
            }`;
          }
        }
        if (messageId == null) {
          //verifie si le messageId est null
          return res.status(400).json({ error: "missing messageId" });
        }

        if (req.body.content) {
          content = req.body.content;
          if (content.length > CONTENT_LIMIT) {
            //verifie si un texte est present et check le nombre de caractère qui est limité à 1200
            return res.status(400).json({ error: "invalid parameters" });
          }
        }

        if (content === null && attachment === null && movie === null) {
          return res.status(400).json({ error: "missing parameters" });
        } //verifie que tous les champs ne soit pas vide pour evité les commentaires vide

        //exécute un tableau de fonction en série , passant chacune ses resultats à la suivante.
        //cependant, ci l'une des fonction transmet une erreur ne sera pas éxécutée
        asyncLib.waterfall(
          [
            function (done) {
              models.User.findOne({
                where: { id: userId },
              })
                .then(function (userFound) {
                  done(null, userFound);
                })
                .catch(function (err) {
                  return res
                    .status(500)
                    .json({ error: "unable to verify user" });
                });
            },

            function (userFound, done) {
              if (userFound) {
                models.Comments.create({
                  content: content,
                  attachment: attachment,
                  movie: movie,
                  likes: 0,
                  UserId: userFound.id,
                  MessageId: messageId,
                }).then(function (newComment) {
                  done(newComment);
                });
              } else {
                res.status(404).json({ error: "user not found" });
              }
            },
          ],
          function (newComment) {
            if (newComment) {
              return res.status(201).json(newComment);
            } else {
              return res.status(500).json({ error: "cannot post message" });
            }
          }
        );
      } else {
        throw error(invalid);
      }
    } catch (error) {
      res.status(400).json({ error });
    }
  },
  //fonction de recupération de tous les commentaires
  listComment: function (req, res) {
    let fields = req.query.fields;
    let order = req.query.order;

    models.Comments.findAll({
      order: [order != null ? order.split(":") : ["id", "DESC"]], //tri les commentaire par ordre du plus recent au plus vieux
      attributes: fields !== "*" && fields != null ? fields.split(",") : null,
      include: [
        {
          // inclus au commentaire le nom le prenom et la photo de profil de celui qui a publier le commentaire
          model: models.User,
          attributes: ["firstName", "lastName", "picture"],
        },
      ],
    })
      .then(function (comment) {
        if (comment) {
          res.status(200).json(comment);
        } else {
          res.status(404).json({ error: "no comment found" });
        }
      })
      .catch(function (err) {
        console.log(err);
        res.status(500).json({ error: "invalid fields" });
      });
  },

  //fonction de suppretion d'un commentaire
  deleteComment: function (req, res) {
    let headerAuth = req.headers["authorization"];
    let userId = jwtUtils.getUserId(headerAuth);

    if (userId <= 0) {
      return res.status(400).json({ error: "wrong token" });
    } //verifie que le userId n'est pas null ou 0

    let commentId = parseInt(req.params.commentId);
    //recupére le id commentaire dans les paramètres d'url

    if (commentId <= 0) {
      return res.status(400).json({ error: "invalid parameters" });
    } // verifie que l'id du commentaine n'est pas null ou égal à 0
    models.Comments.findOne({
      //cherche le commentaire a supprimer en fonction de son id de l'id de l'auteur
      where: {
        userId: userId,
        id: commentId,
      },
    })
      .then(function (comment) {
        if (comment.attachment) {
          //verifie ci une photo est attachée au commentaire pour la supprimer de dossier images
          const filename = comment.attachment.split("/images/")[1]; // recupere le nom de l'image
          fs.unlink(`images/${filename}`, () => {
            models.LikeComments.destroy({
              // supprime les likes du commentaire
              where: {
                userId: userId,
                commentId: commentId,
              },
            }),
              models.Comments.destroy({
                //supprime le commentaires
                where: {
                  userId: userId,
                  id: commentId,
                },
              })
                .then(function () {
                  res.status(201).json({ ok: "comment delete" });
                })
                .catch(function (err) {
                  res.status(400).json({ error: "comment not delete" });
                });
          });
        } else if (comment.movie) {
          // verifie si un video est attachée au commentaire pour la supprimer du dossier
          const filemoviename = comment.movie.split("/images/")[1];
          fs.unlink(`images/${filemoviename}`, () => {
            models.LikeComments.destroy({
              where: {
                userId: userId,
                commentId: commentId,
              },
            }),
              models.Comments.destroy({
                where: {
                  userId: userId,
                  id: commentId,
                },
              })
                .then(function () {
                  res.status(201).json({ ok: "comment delete" });
                })
                .catch(function (err) {
                  res.status(400).json({ error: "comment not delete" });
                });
          });
        } else {
          // si aucune photo ou vidéo n'est attacher ce code s'execute
          models.LikeComments.destroy({
            where: {
              userId: userId,
              commentId: commentId,
            },
          }),
            models.Comments.destroy({
              where: {
                userId: userId,
                id: commentId,
              },
            })
              .then(function () {
                res.status(201).json({ ok: "comment delete" });
              })
              .catch(function (err) {
                res.status(400).json({ error: "comment not delete" });
              });
        }
      })
      .catch(function (err) {
        res.status(500).json({ error: "comment not delete" });
      });
  },

  //fonction de modification des commentaires
  modifyComment: async function (req, res) {
    try {
      const valid = await sendCommentSchema.validateAsync(req.body);
      //securité verifie le schema joi
      if (valid) {
        // si le schema est bon la fonction s'éxécute
        let headerAuth = req.headers["authorization"];
        let userId = jwtUtils.getUserId(headerAuth); //decode le token grace au middleware
        const commentId = req.params.commentId; // recupere le id su commentaire dans les paramètres d'url

        let movie = null;
        let attachment = null;
        let content = req.body.content;
        if (req.file) {
          //verifie ci une photo ou vidéo est attachée à la modification et les tri pour la mettre dans la bonne colonne
          let media = req.file.filename;
          if (media.includes("mp4")) {
            //verifie si mp4 ce trouve dans le nom du fichier
            movie = `${req.protocol}://${req.get("host")}/images/${
              req.file.filename
            }`;
          } else {
            attachment = `${req.protocol}://${req.get("host")}/images/${
              req.file.filename
            }`;
          }
        }
        models.Comments.findOne({
          where: {
            //cherche le commentaire
            id: commentId,
            userId: userId,
          },
        })
          .then(function (modifyComment) {
            if (modifyComment.attachment && content) {
              //s'éxécute si une photo est attachée à la modification
              const filename = modifyComment.attachment.split("/images/")[1];
              fs.unlink(`images/${filename}`, () => {
                modifyComment.update({
                  //met a jours la base de donnéés
                  content: content ? content : modifyComment.content, // si un content existe le remplacer par le nouveau
                  attachment: attachment
                    ? attachment
                    : modifyComment.attachment,
                  movie: movie ? movie : modifyComment.movie,
                });
              });
            } else if (modifyComment.movie && content) {
              //s'exécute si une vidéo est attachée à la modification
              const filemoviename = modifyComment.movie.split("/images/")[1];
              fs.unlink(`images/${filemoviename}`, () => {
                modifyComment.update({
                  content: content ? content : modifyComment.content,
                  attachment: attachment
                    ? attachment
                    : modifyComment.attachment,
                  movie: movie ? movie : modifyComment.movie,
                });
              });
            } else {
              //s'exécute si il n'y a pas de photo ou de vidéo attachées
              modifyComment.update({
                content: content ? content : modifyComment.content,
                attachment: attachment ? attachment : modifyComment.attachment,
                movie: movie ? movie : modifyComment.movie,
              });
            }
          })
          .catch(function (err) {
            res.status(500).json({ error: "post not modify" });
          });
      } else {
        throw error(invalid);
      }
    } catch (error) {
      res.status(400).json({ error });
    }
  },

  //fonction de recupérations d'un seul commentaire
  getOneComment: function (req, res) {
    let headerAuth = req.headers["authorization"];
    let userId = jwtUtils.getUserId(headerAuth); //decode le token
    const commentId = req.params.commentId; //recupere le id du commentaire dans les paramètre d'url

    if (userId <= 0) {
      return res.status(400).json({ message: "wrong token" });
    } //verifie si le userId n'est pas null

    models.Comments.findOne({
      where: {
        id: commentId,
      }, //cherche le commentaire
    })
      .then(function (comment) {
        return res.status(200).json(comment); // retourne le commentaire
      })
      .catch(function (err) {
        return req.status(400).json({ message: "comment not found" });
      });
  },
};
