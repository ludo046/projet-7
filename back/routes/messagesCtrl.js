//impots
const models = require("../models");
const asyncLib = require("async");
const jwtUtils = require("../utils/jwt.utils");
const fs = require("fs");
const { invalid } = require("joi");
const sendPostSchema = require("../utils/joi/sendPost");

//constante
const CONTENT_LIMIT = 1200;

module.exports = {
  //fonnction de création de post
  createMessage: async function (req, res) {
    try {
      //securité vérifie le schéma joi
      const valid = await sendPostSchema.validateAsync(req.body);
      if (valid) {
        // si le schéma est valide la fonction s'éxécute
        // recupère et decode le token
        let headerAuth = req.headers["authorization"];
        let userId = jwtUtils.getUserId(headerAuth);

        let content = null;
        let attachment = null;
        let movie = null;
        if (req.file) {
          // verifie si un file est attaché
          let media = req.file.filename;
          if (media.includes("mp4")) {
            //vérifie si mp4 ce trouve dans le nom du file attaché
            movie = `${req.protocol}://${req.get("host")}/images/${
              req.file.filename
            }`;
          } else {
            attachment = `${req.protocol}://${req.get("host")}/images/${
              req.file.filename
            }`;
          }
        }

        if (req.body.content) {
          //verifie si un texte est présent
          content = req.body.content;
          if (content.length > CONTENT_LIMIT) {
            // si oui verifie que le nombre de caractères n'est pas supperieur à 1200
            return res.status(400).json({ error: "invalid parameters" });
          }
        }

        //verifie que tous les champs de ne sont pas null pour evité les post vides
        if (content === null && attachment === null && movie === null) {
          return res.status(400).json({ error: "missing parameters" });
        }

        //exécute un tableau de fonction en série , passant chacune ses resultats à la suivante.
        //cependant, ci l'une des fonction transmet une erreur ne sera pas éxécutée
        asyncLib.waterfall(
          [
            function (done) {
              //cherche l'utilisateur qui post le post
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
              //si l'utilisateur est trouvé on créé le post
              if (userFound) {
                models.Messages.create({
                  content: content,
                  attachment: attachment,
                  movie: movie,
                  likes: 0,
                  UserId: userFound.id,
                }).then(function (newMessage) {
                  done(newMessage);
                });
              } else {
                //si l'utilisateur n'est pas trouvé on retourne une erreur
                res.status(404).json({ error: "user not found" });
              }
            },
          ],
          function (newMessage) {
            if (newMessage) {
              //et si ne nouveau post est bien créé un retourne le nouveau message
              return res.status(201).json(newMessage);
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

  //foncrion de recupération de tous les posts
  listMessage: function (req, res) {
    let fields = req.query.fields;
    let order = req.query.order;

    models.Messages.findAll({
      //tri les posts par ordre du plus recent au plus vieux
      order: [order != null ? order.split(":") : ["id", "DESC"]],
      attributes: fields !== "*" && fields != null ? fields.split(",") : null,
      //inclus au post le prénom le nom et la photo de profil de l'utilisateur
      include: [
        {
          model: models.User,
          attributes: ["firstName", "lastName", "picture"],
        },
        {
          //inclus au post le texte de ses commentaire et le messageId
          model: models.Comments,
          attributes: ["content", "messageId"],
        },
      ],
    })
      .then(function (messages) {
        if (messages) {
          res.status(200).json(messages);
        } else {
          res.status(404).json({ error: "no messages found" });
        }
      })
      .catch(function (err) {
        console.log(err);
        res.status(500).json({ error: "invalid fields" });
      });
  },

  //fonction de suppresion des posts
  deletePost: function (req, res) {
    // recupère le header et decode le token
    let headerAuth = req.headers["authorization"];
    let userId = jwtUtils.getUserId(headerAuth);

    //verifie que le userId ne soit pas null
    if (userId <= 0) {
      return res.status(400).json({ error: "wrong token" });
    }

    //recupére le messageId dans les parametres d'url
    let messageId = parseInt(req.params.messageId);

    //verifie que le messageId ne soit pas null
    if (messageId <= 0) {
      return res.status(400).json({ error: "invalid parameters" });
    }
    //cherche le post
    models.Messages.findOne({
      where: {
        userId: userId,
        id: messageId,
      },
    })
      .then(function (post) {
        //si le post est trouver verifie si une photo lui est attaché pour la supprimer du dossier
        if (post.attachment) {
          const filename = post.attachment.split("/images/")[1];
          fs.unlink(`images/${filename}`, () => {
            //supprime les like du post
            models.Likes.destroy({
              where: {
                userId: userId,
                messageId: messageId,
              },
            }),
              //supprime le post
              models.Messages.destroy({
                where: {
                  userId: userId,
                  id: messageId,
                },
              })
                .then(function () {
                  res.status(201).json({ ok: "post delete" });
                })
                .catch(function (err) {
                  res.status(400).json({ error: "post not delete" });
                });
          });
          //si le post est trouver verifie si une video lui est attaché pour la supprimer du dossier
        } else if (post.movie) {
          const filemoviename = post.movie.split("/images/")[1];
          fs.unlink(`images/${filemoviename}`, () => {
            models.Likes.destroy({
              where: {
                userId: userId,
                messageId: messageId,
              },
            }),
              models.Messages.destroy({
                where: {
                  userId: userId,
                  id: messageId,
                },
              })
                .then(function () {
                  res.status(201).json({ ok: "post delete" });
                })
                .catch(function (err) {
                  res.status(400).json({ error: "post not delete" });
                });
          });
        } else {
          //si aucune photo ou vidéo n'est presente ce code s'éxécute
          models.Likes.destroy({
            where: {
              userId: userId,
              messageId: messageId,
            },
          }),
            models.Messages.destroy({
              where: {
                userId: userId,
                id: messageId,
              },
            })
              .then(function () {
                res.status(201).json({ ok: "post delete" });
              })
              .catch(function (err) {
                res.status(400).json({ error: "post not delete" });
              });
        }
      })
      .catch(function (err) {
        res.status(500).json({ error: "post not delete" });
      });
  },

  //fontion de modification des post
  modifyPost: async function (req, res) {
    try {
      //sécurité vérifie le schéma joi
      const valid = await sendPostSchema.validateAsync(req.body);
      if (valid) {
        //si le schéma est valide la fonction s'éxécute
        //recupére et decode le token
        let headerAuth = req.headers["authorization"];
        let userId = jwtUtils.getUserId(headerAuth);
        //recupére le id du message dans les parametres d'url
        const messageId = req.params.messageId;

        let movie = null;
        let attachment = null;
        let content = req.body.content;
        //verifie si un file est présent 
        if (req.file) {
          let media = req.file.filename;
          //verifie si mp4 est present dans le nom du file et tri les photo et video pour les mettre dans la
          //bonne colonne 
          if (media.includes("mp4")) {
            movie = `${req.protocol}://${req.get("host")}/images/${
              req.file.filename
            }`;
          } else {
            attachment = `${req.protocol}://${req.get("host")}/images/${
              req.file.filename
            }`;
          }
        }
        //cherche le post à modifier 
        models.Messages.findOne({
          where: {
            id: messageId,
          },
        })
          .then(function (modifyMessage) {
            //si le post est trouvé avec une photo et un texte ce code s'éxécute
            if (modifyMessage.attachment && content) {
              //recupére le nom du fichier pour le supprimer du dossier 
              const filename = modifyMessage.attachment.split("/images/")[1];
              fs.unlink(`images/${filename}`, () => {
                //met a jour la base de données avec les modification 
                modifyMessage.update({
                  //si un content est deja present dans la base de donnéé le remplacer par le nouveau ...
                  content: content ? content : modifyMessage.content,
                  attachment: attachment? attachment : modifyMessage.attachment,
                  movie: movie ? movie : modifyMessage.movie,
                });
              });
            } else if (modifyMessage.movie && content) {
              //si le post est trouvé avec une video et un texte ce code s'éxécute
              const filemoviename = modifyMessage.movie.split("/images/")[1];
              fs.unlink(`images/${filemoviename}`, () => {
                modifyMessage.update({
                  content: content ? content : modifyMessage.content,
                  attachment: attachment
                    ? attachment
                    : modifyMessage.attachment,
                  movie: movie ? movie : modifyMessage.movie,
                });
              });
            } else {
              //si aucun ficher n'est attaché ce code s'éxécute 
              modifyMessage.update({
                content: content ? content : modifyMessage.content,
                attachment: attachment ? attachment : modifyMessage.attachment,
                movie: movie ? movie : modifyMessage.movie,
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

  //fontion de recupération d'un seul post 
  getOnePost: function (req, res) {
    // recupère le header et decode le token
    let headerAuth = req.headers["authorization"];
    let userId = jwtUtils.getUserId(headerAuth);
    const messageId = req.params.messageId;

    //verifie que le userId ne soit pas null 
    if (userId <= 0) {
      return res.status(400).json({ message: "wrong token" });
    }

    //cherche le post 
    models.Messages.findOne({
      where: {
        id: messageId,
      },
    })
      .then(function (post) {
        // si le post est trouvé on retourne le post 
        return res.status(200).json(post);
      })
      .catch(function (err) {
        return req.status(400).json({ message: "message not found" });
      });
  },
};
