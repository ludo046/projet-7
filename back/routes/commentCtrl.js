const models   = require('../models');
const asyncLib = require('async');
const jwtUtils = require('../utils/jwt.utils');
const messagesCtrl = require('./messagesCtrl');

const CONTENT_LIMIT = 1000;


module.exports = {
    commentPost: function(req, res){
    let headerAuth  = req.headers['authorization'];
    let userId = jwtUtils.getUserId(headerAuth);
    
    console.log(headerAuth);
    console.log(userId);

    let content = req.body.content;
    let messageId = parseInt(req.params.messageId);
    let attachment;
    if(req.file){
      attachment = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } else {
      attachment = ''
    }

    console.log(content);
    console.log(attachment);
    if (messageId == null) {
        returnres.status(400).json({ 'error': 'missing messageId' })
    }
    if (content == null) {
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
          models.Comment.create({
            content: content,
            attachment: attachment,
            likes  : 0,
            UserId : userFound.id,
            MessageId: messageId
          })
          
          .then(function(newComment) {
            done(newComment);
          });
        } else {
          res.status(404).json({ 'error': 'user not found' });
        }
      },
    ], function(newComment) {
      if (newComment) {
        return res.status(201).json(newComment);
      } else {
        return res.status(500).json({ 'error': 'cannot post message' });
      }
    });
  },
  listComment: function(req, res) {
    let fields  = req.query.fields;
    let order   = req.query.order;

    models.Comment.findAll({
      order: [(order != null) ? order.split(':') : ['id','DESC']],
      attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
      include: [{
        model: models.User,
        attributes: [ 'firstName','lastName','picture'],
      }],
    }).then(function(comment) {
      if (comment) {
        res.status(200).json(comment);
      } else {
        res.status(404).json({ "error": "no comment found" });
      }
    }).catch(function(err) {
      console.log(err);
      res.status(500).json({ "error": "invalid fields" });
    });
}
}