// Imports
const models   = require('../models');
const jwtUtils = require('../utils/jwt.utils');
const asyncLib = require('async');

// Constants
const DISLIKED = 0;
const LIKED    = 1;

// Routes
module.exports = {
  likePost: function(req, res) {
    // Getting auth header
    let headerAuth  = req.headers['authorization'];
    let userId      = jwtUtils.getUserId(headerAuth);

    // Params
    let messageId = parseInt(req.params.messageId);

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


  
  dislikePost: function(req, res) {
        // Getting auth header
    const headerAuth  = req.headers['authorization'];
    const userId      = jwtUtils.getUserId(headerAuth);

    // Params
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
    const messageId = req.params.messageId
    models.Likes.findAll()
    .then(function(likes) {
      if (likes) {
        res.status(200).json(likes);
      } else {
        res.status(404).json({ "error": "no likes found" });
      }
    }).catch(function(err) {
      console.log(err);
      res.status(500).json({ "error": "invalid fields" });
    });
  }
}