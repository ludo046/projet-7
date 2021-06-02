const models   = require('../models');
const asyncLib = require('async');
const jwtUtils = require('../utils/jwt.utils');

const CONTENT_LIMIT = 1000;


module.exports = {
  createMessage: function(req, res) {
    let headerAuth  = req.headers['authorization'];
    let userId = jwtUtils.getUserId(headerAuth);
    let content = req.body.content;
    let attachment;
    if(req.file){
      attachment = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } else {
      attachment = ''
    }
    console.log(content);
    console.log(attachment);

    if (content === '' && attachment ===  '' ) {
      return res.status(400).json({ 'error': 'missing parameters' });
    }

    if (content.length > CONTENT_LIMIT) {
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
        attributes: [ 'firstName','lastName','picture'],
      },
      {
        model: models.Comment,
        attributes: ['content','messageId']
      }
    ],
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

  deletePost: function(req, res){
    let headerAuth = req.headers['authorization'];
    let userId = jwtUtils.getUserId(headerAuth)

    if (userId <= 0){
      return res.status(400).json({ 'error': 'wrong token' })
    };

    let messageId = parseInt(req.params.messageId);
    console.log(messageId);

    if (messageId <= 0) {
      return res.status(400).json({ 'error': 'invalid parameters' });
    }

    models.Like.destroy({
        where: {
          userId: userId,
          messageId: messageId
        }
    }),
    models.Message.destroy({
        where: {
          userId: userId,
          id: messageId
        }
    }).then (function(){
       ( res.status(201).json({'ok' :'post deleted'})) 
    }).catch (function(err){
        (res.status(400).json({ 'error': 'user not found' }))
    })
},

  modifyPost: function(req, res) {
    let headerAuth = req.headers['authorization'];
    let userId = jwtUtils.getUserId(headerAuth)
    const messageId = req.params.messageId

    const content = req.body.content;
    // let attachment;
    // if(req.file){
    //   attachment = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    // } else {
    //   attachment = ''
    // }

    console.log(userId);
    console.log(messageId);
    console.log(content);

     
    asyncLib.waterfall([
        function(done){
            models.Message.findOne({
                where: {id : messageId}
            }).then(function(messageFound){
                done(null,messageFound);
            })
            .catch(function(err){
                return res.status(500).json({ 'error': 'unable to verify' })
            })
        },
        function(messageFound, done){
            if (messageFound){
                messageFound.update({
                  content: content,
                }).then(function(){
                    done(messageFound);
                }).catch(function(err){
                    res.status(500).json({ 'error': 'cannot update post' })
                });
            } else { 
                res.status(404).json({ 'error': 'post not found' })
            }
        },
    ],function(messageFound){
        if (messageFound){
            return res.status(201).json(messageFound);
        } else {
            return res.status(500).json({ 'error': 'post not update' })
        }
    })
}
}