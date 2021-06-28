// imports
const models   = require('../models');
const jwtUtils = require('../utils/jwt.utils');
const asyncLib = require('async');

// Constantes
const DISLIKED = 0;
const LIKED    = 1;

module.exports = {
  //fonction de like des commentaire
  likePost: function(req, res) {
    // recupère le header et decode le token
    let headerAuth  = req.headers['authorization'];
    let userId      = jwtUtils.getUserId(headerAuth);

    //recupère le id du commentaire dans les paramètres d'url
    let messageId = parseInt(req.params.messageId);

    //verifie que le messageId ne soit pas null
    if (messageId <= 0) {
      return res.status(400).json({ 'error': 'invalid parameters' });
    }

    //exécute un tableau de fonction en série , passant chacune ses resultats à la suivante.
    //cependant, ci l'une des fonction transmet une erreur ne sera pas éxécutée
    asyncLib.waterfall([
      function(done) {
        //cherche le post à liker
        models.Messages.findOne({
          where: { id: messageId }
        })
        .then(function(messageFound) {
          done(null, messageFound);
        })
        .catch(function(err) {
          return res.status(500).json({ 'error': 'unable to verify message' });
        });
      },
      function(messageFound, done) {
        if(messageFound) {
          //cherche le l'utilisateur qui like le post
          models.User.findOne({
            where: { id: userId }
          })
          .then(function(userFound) {
            done(null, messageFound, userFound);
          })
          .catch(function(err) {
            return res.status(500).json({ 'error': 'unable to verify user' });
          });
        } else {
          res.status(404).json({ 'error': 'post already liked' });
        }
      },
      function(messageFound, userFound, done) {
        if(userFound) {
          //si l'utilisateur est trouvé on cherche le like dans la table like
          const messageAlreadyLiked = models.Likes.findOne({
            where: {
              userId: userId,
              messageId: messageId
            }
          });
          //si le like n'existe pas on le créé
          if (Object.keys(messageAlreadyLiked).length === 0) {
            (function(userAlreadyLikedFound){
              done(null, messageFound, userFound, userAlreadyLikedFound);
              if (messageAlreadyLiked !== LIKED){
                models.Likes.create({
                  userId: userId,
                  messageId: messageId,
                  isLike: LIKED
                })
              } 
            })();
          } else {
            return res.status(500).json({ 'error': 'unable to verify is user already liked' });
          }
        } else {
          res.status(404).json({ 'error': 'user not exist' });
        }
      },
      function(messageFound, userFound, userAlreadyLikedFound,  done) {
        if (!userAlreadyLikedFound){
        messageFound.update({
          likes: messageFound.likes + 1,
        }).then(function() {
          done(messageFound);
        }).catch(function(err) {
          res.status(500).json({ 'error': 'cannot update message like counter' });
        });}
      },
    ], function(messageFound) {
      if (messageFound) {
        return res.status(201).json(messageFound);
      } else {
        return res.status(500).json({ 'error': 'cannot update message' });
      }
    });
  },


  //fontion de dislike des post
  // ce reférer au commentaires de la fontion like
  dislikePost: function(req, res) {

    const headerAuth  = req.headers['authorization'];
    const userId      = jwtUtils.getUserId(headerAuth);

    const messageId = parseInt(req.params.messageId);

    if (messageId <= 0) {
      return res.status(400).json({ 'error': 'invalid parameters' });
    }

    asyncLib.waterfall([
      function(done) {
        models.Messages.findOne({
          where: { id: messageId }
        })
        .then(function(messageFound) {
          done(null, messageFound);
        })
        .catch(function(err) {
          return res.status(500).json({ 'error': 'unable to verify message' });
        });
      },
      function(messageFound, done) {
        if(messageFound) {
          models.User.findOne({
            where: { id: userId }
          })
          .then(function(userFound) {
            done(null, messageFound, userFound);
          })
          .catch(function(err) {
            return res.status(500).json({ 'error': 'unable to verify user' });
          });
        } else {
          res.status(404).json({ 'error': 'post already liked' });
        }
      },
      function(messageFound, userFound, done) {
        if(userFound) {
          const messageAlreadyLiked = models.Likes.findOne({
            where: {
              userId: userId,
              messageId: messageId
            }
          });
          if (messageAlreadyLiked) {
            (function(userAlreadyLikedFound){
              done(null, messageFound, userFound, userAlreadyLikedFound);
                models.Likes.destroy({
                  where: {
                      userId: userId,
                      messageId: messageId
                  }
                })
            })();
          } else {
            return res.status(500).json({ 'error': 'unable to verify is user already liked' });
          }
        } else {
          res.status(404).json({ 'error': 'user not exist' });
        }
      },
      function(messageFound, userFound, userAlreadyLikedFound,  done) {
        if (!userAlreadyLikedFound){
        messageFound.update({
          likes: messageFound.likes - 1,
        }).then(function() {
          done(messageFound);
        }).catch(function(err) {
          res.status(500).json({ 'error': 'cannot update message like counter' });
        });}
      },
    ], function(messageFound) {
      if (messageFound) {
        return res.status(201).json(messageFound);
      } else {
        return res.status(500).json({ 'error': 'cannot update message' });
      }
    });
  },

  getLike: function(req, res){
    const headerAuth  = req.headers['authorization'];
    const userId      = jwtUtils.getUserId(headerAuth);
    const messageId = parseInt(req.params.messageId);
    
    models.Likes.findAll(),
    
    models.Likes.findOne({
      where: {
        userId : userId,
        messageId: messageId
      }
    })
    .then(function(likes) {
      if (likes) {
        res.status(200).json(true);
      } else {
        res.status(200).json(false);
      }
    }).catch(function(err) {
      console.log(err);
      res.status(500).json({ "error": "invalid fields" });
    });
  }
}