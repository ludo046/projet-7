const models   = require('../models');
const asyncLib = require('async');
const jwtUtils = require('../utils/jwt.utils');


const CONTENT_LIMIT = 4;


module.exports = {
  createMessage: function(req, res) {
    // Getting auth header
    let headerAuth  = req.headers['authorization'];
    let userId = jwtUtils.getUserId(headerAuth);
    
    console.log(headerAuth);
    console.log(userId);
    // Params
    let content = req.body.content;
    console.log(req.file);
    let attachment = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`

    console.log(content);
    console.log(attachment);

    if (content == null) {
      return res.status(400).json({ 'error': 'missing parameters' });
    }

    if (content.length <= CONTENT_LIMIT) {
      return res.status(400).json({ 'error': 'invalid parameters' });
    }
   
    asyncLib.waterfall([
      function(done) {
        models.User.findOne({
          where: { id: userId }
        })
        .then(function(userFound) {
          done(null, userFound);
        })
        .catch(function(err) {
          return res.status(500).json({ 'error': 'unable to verify user' });
        });
      },
      function(userFound, done) {
        if(userFound) {
          models.Message.create({
            content: content,
            attachment: attachment,
            likes  : 0,
            UserId : userFound.id
            
          })
          
          .then(function(newMessage) {
            done(newMessage);
          });
        } else {
          res.status(404).json({ 'error': 'user not found' });
        }
      },
    ], function(newMessage) {
      if (newMessage) {
        return res.status(201).json(newMessage);
      } else {
        return res.status(500).json({ 'error': 'cannot post message' });
      }
    });
  },

  listMessage: function(req, res) {
    let fields  = req.query.fields;
    let order   = req.query.order;

    models.Message.findAll({
      order: [(order != null) ? order.split(':') : ['id','DESC']],
      attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
      include: [{
        model: models.User,
        attributes: [ 'firstName','lastName' ],
      }],
    }).then(function(messages) {
      if (messages) {
        res.status(200).json(messages);
      } else {
        res.status(404).json({ "error": "no messages found" });
      }
    }).catch(function(err) {
      console.log(err);
      res.status(500).json({ "error": "invalid fields" });
    });
  },

//   deletePost: function(req, res){
//     let headerAuth = req.headers['authorization'];
//     let userId = jwtUtils.getUserId(headerAuth)

//     if (userId < 0)
//     return res.status(400).json({ 'error': 'wrong token' })

//     models.Like.destroy({
//         where: {userId: userId}
//     }),
//     models.Message.destroy({
//         where: {userId: userId}
//     }).then (function(){
//        ( res.status(201).json({'ok' :'user deleted'})) 
//     }).catch (function(err){
//         (res.status(400).json({ 'error': 'user not found' }))
//     })
    
// }
deletePost: function(req, res) {
  // Getting auth header
  let headerAuth  = req.headers['authorization'];
  let userId      = jwtUtils.getUserId(headerAuth);
  console.log(userId);
  console.log(headerAuth);

  // Params
  let messageId = parseInt(req.params.messageId);

  if (messageId <= 0) {
    return res.status(400).json({ 'error': 'invalid parameters' });
  }

  asyncLib.waterfall([
    function(done) {
      models.Message.findOne({
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
        const messageAlreadyLiked = models.Like.findOne({
          where: {
            userId: userId,
            messageId: messageId
          }
        });
        if (Object.keys(messageAlreadyLiked).length === 0) {
          (function(userAlreadyLikedFound){
            done(null, messageFound, userFound, userAlreadyLikedFound);
            if (messageAlreadyLiked !== LIKED){
              models.Like.create({
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

}