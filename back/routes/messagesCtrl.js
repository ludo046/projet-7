const models   = require('../models');
const asyncLib = require('async');
const jwtUtils = require('../utils/jwt.utils');


const CONTENT_LIMIT = 4;


module.exports = {
  createMessage: function(req, res) {
    // Getting auth header
    var headerAuth  = req.headers['authorization'];
    var userId = jwtUtils.getUserId(headerAuth);
    console.log(headerAuth);
    // Params
    var content = req.body.content;
    console.log(content);

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
      //attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
      include: [{
        model: models.User,
        attributes: [ 'firstName','lastName' ]
      }]
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
  }
}