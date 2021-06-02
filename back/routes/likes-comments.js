// Imports
const models   = require('../models');
const jwtUtils = require('../utils/jwt.utils');
const asyncLib = require('async');

// Constants
const DISLIKED = 0;
const LIKED    = 1;

// Routes
module.exports = {
  likeCommentPost: function(req, res) {
    // Getting auth header
    let headerAuth  = req.headers['authorization'];
    let userId      = jwtUtils.getUserId(headerAuth);

    // Params
    let messageId = parseInt(req.params.commentId);
    console.log(messageId);

    if (messageId <= 0) {
      return res.status(400).json({ 'error': 'invalid parameters' });
    }

    asyncLib.waterfall([
      function(done) {
        models.Comment.findOne({
          where: { id: messageId }
        })
        .then(function(commentFound) {
          done(null, commentFound);
        })
        .catch(function(err) {
          return res.status(500).json({ 'error': 'unable to verify message' });
        });
      },
      function(commentFound, done) {
        if(commentFound) {
          console.log(commentFound);
          models.User.findOne({
            where: { id: userId }
          })
          .then(function(userFound) {
            done(null, commentFound, userFound);
          })
          .catch(function(err) {
            return res.status(500).json({ 'error': 'unable to verify user' });
          });
        } else {
          res.status(404).json({ 'error': 'post already liked' });
        }
      },
      function(commentFound, userFound, done) {
        if(userFound) {
          const messageAlreadyLiked = models.LikeComment.findOne({
            where: {
              userId: userId,
              commentId: messageId
            }
          });
          if (Object.keys(messageAlreadyLiked).length === 0) {
            (function(userAlreadyLikedFound){
              done(null, commentFound, userFound, userAlreadyLikedFound);
              if (messageAlreadyLiked !== LIKED){
                models.LikeComment.create({
                  userId: userId,
                  commentId: messageId,
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
      function(commentFound, userFound, userAlreadyLikedFound,  done) {
        if (!userAlreadyLikedFound){
        commentFound.update({
          likes: commentFound.likes + 1,
        }).then(function() {
          done(commentFound);
        }).catch(function(err) {
          res.status(500).json({ 'error': 'cannot update message like counter' });
        });}
      },
    ], function(commentFound) {
      if (commentFound) {
        return res.status(201).json(commentFound);
      } else {
        return res.status(500).json({ 'error': 'cannot update message' });
      }
    });
  },


  
  dislikeCommentPost: function(req, res) {
        // Getting auth header
    const headerAuth  = req.headers['authorization'];
    const userId      = jwtUtils.getUserId(headerAuth);

    // Params
    const messageId = parseInt(req.params.commentId);

    if (messageId <= 0) {
      return res.status(400).json({ 'error': 'invalid parameters' });
    }

    asyncLib.waterfall([
      function(done) {
        models.Comment.findOne({
          where: { id: messageId }
        })
        .then(function(commentFound) {
          done(null, commentFound);
        })
        .catch(function(err) {
          return res.status(500).json({ 'error': 'unable to verify message' });
        });
      },
      function(commentFound, done) {
        if(commentFound) {
          models.User.findOne({
            where: { id: userId }
          })
          .then(function(userFound) {
            done(null, commentFound, userFound);
          })
          .catch(function(err) {
            return res.status(500).json({ 'error': 'unable to verify user' });
          });
        } else {
          res.status(404).json({ 'error': 'post already liked' });
        }
      },
      function(commentFound, userFound, done) {
        if(userFound) {
          const messageAlreadyLiked = models.LikeComment.findOne({
            where: {
              userId: userId,
              commentId: messageId
            }
          });
          if (messageAlreadyLiked) {
            (function(userAlreadyLikedFound){
              done(null, commentFound, userFound, userAlreadyLikedFound);
                models.LikeComment.destroy({
                  where: {
                      userId: userId,
                      commentId: messageId
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
      function(commentFound, userFound, userAlreadyLikedFound,  done) {
        if (!userAlreadyLikedFound){
        commentFound.update({
          likes: commentFound.likes - 1,
        }).then(function() {
          done(commentFound);
        }).catch(function(err) {
          res.status(500).json({ 'error': 'cannot update message like counter' });
        });}
      },
    ], function(commentFound) {
      if (commentFound) {
        return res.status(201).json(commentFound);
      } else {
        return res.status(500).json({ 'error': 'cannot update message' });
      }
    });
  },
  
  getLikeComment: function(req, res){
    const headerAuth  = req.headers['authorization'];
    const userId      = jwtUtils.getUserId(headerAuth);
    const messageId = req.params.messageId
    models.LikeComment.findAll()
    .then(function(likesComment) {
      if (likesComment) {
        res.status(200).json(likesComment);
      } else {
        res.status(404).json({ "error": "no likes found" });
      }
    }).catch(function(err) {
      console.log(err);
      res.status(500).json({ "error": "invalid fields" });
    });
  }
}