const models   = require('../models');
const asyncLib = require('async');
const jwtUtils = require('../utils/jwt.utils');
const fs = require('fs')

const CONTENT_LIMIT = 1000;


module.exports = {
  createMessage: function(req, res) {
    let headerAuth  = req.headers['authorization'];
    let userId = jwtUtils.getUserId(headerAuth);
    let content = null;
    let attachment = null;
    let movie = null;
    console.log(req);
    if(req.file){
      let media = req.file.filename
      if (media.includes('mp4')) {
        movie = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        console.log('truc');
      } else {
        attachment = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      } 
    }

    if(req.body.content){
      content = req.body.content
      if (content.length > CONTENT_LIMIT) {
        return res.status(400).json({ 'error': 'invalid parameters' });
      }
    }

    if (content === null && attachment === null  && movie === null ) {
      return res.status(400).json({ 'error': 'missing parameters' });
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
          models.Messages.create({
            content: content,
            attachment: attachment,
            movie: movie,
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

    models.Messages.findAll({
      order: [(order != null) ? order.split(':') : ['id','DESC']],
      attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
      include: [{
        model: models.User,
        attributes: [ 'firstName','lastName','picture'],
      },
      {
        model: models.Comments,
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

    if (messageId <= 0) {
      return res.status(400).json({ 'error': 'invalid parameters' });
    }
    models.Messages.findOne({
      where: {
        userId: userId,
        id: messageId
      }
    }).then(function(post){
      console.log(post);
      if(post.attachment){
        const filename = post.attachment.split('/images/')[1]
      fs.unlink(`images/${filename}`,() => {
        models.Likes.destroy({
          where: {
            userId: userId,
            messageId: messageId
          }
      }),
      models.Messages.destroy({
          where: {
            userId: userId,
            id: messageId
          }
      }).then(function(){
        res.status(201).json({ 'ok': 'post delete' })
      }).catch(function(err){
        res.status(400).json({ 'error': 'post not delete' })
      })
    })
      } else if (post.movie){
        const filemoviename = post.movie.split('/images/')[1]
        fs.unlink(`images/${filemoviename}`,() => {
          models.Likes.destroy({
            where: {
              userId: userId,
              messageId: messageId
            }
        }),
        models.Messages.destroy({
            where: {
              userId: userId,
              id: messageId
            }
        }).then(function(){
          res.status(201).json({ 'ok': 'post delete' })
        }).catch(function(err){
          res.status(400).json({ 'error': 'post not delete' })
        })
      })
      } else {
        models.Likes.destroy({
          where: {
            userId: userId,
            messageId: messageId
          }
      }),
      models.Messages.destroy({
          where: {
            userId: userId,
            id: messageId
          }
      }).then(function(){
        res.status(201).json({ 'ok': 'post delete' })
      }).catch(function(err){
        res.status(400).json({ 'error': 'post not delete' })
      })
      }
      
    }).catch(function(err){
      res.status(500).json({ 'error': 'post not delete' })
    })
},

modifyPost: function(req, res) {
  let headerAuth = req.headers['authorization'];
  let userId = jwtUtils.getUserId(headerAuth)
  const messageId = req.params.messageId

  let movie = null ;
  let attachment = null 
  let content = req.body.content;
  if(req.file){
    let media = req.file.filename
    if (media.includes('mp4')) {
      movie = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      console.log('truc');
    } else {
      attachment = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } 
  }

  console.log(userId);
  console.log(messageId);
  console.log(content);

  models.Messages.findOne({
    where: {
      id: messageId
    }
  }).then(function(modifyMessage){
    if(modifyMessage.attachment && content){
      const filename = modifyMessage.attachment.split('/images/')[1]
      console.log(filename);
      fs.unlink(`images/${filename}`,() => {
        modifyMessage.update({
          content: (content ? content : modifyMessage.content),
          attachment: (attachment ? attachment : modifyMessage.attachment),
          movie: (movie ? movie : modifyMessage.movie)
        })
      })
    }else if(modifyMessage.movie && content){
      const filemoviename = modifyMessage.movie.split('/images/')[1]
      fs.unlink(`images/${filemoviename}`,() => {
          modifyMessage.update({
          content: (content ? content : modifyMessage.content),
          attachment: (attachment ? attachment : modifyMessage.attachment),
          movie: (movie ? movie : modifyMessage.movie)
        })
      })
    }else{
      modifyMessage.update({
        content: (content ? content : modifyMessage.content),
        attachment: (attachment ? attachment : modifyMessage.attachment),
        movie: (movie ? movie : modifyMessage.movie)
      })
    }
  }).catch(function(err){
    res.status(500).json({'error': 'post not modify'})
  })
},

getOnePost: function(req,res){
  let headerAuth = req.headers['authorization'];
  let userId = jwtUtils.getUserId(headerAuth)
  const messageId = req.params.messageId

  if(userId <= 0){
    return res.status(400).json({ 'message': 'wrong token' })
  }

  models.Messages.findOne({
    where: {
      id: messageId
    }
  }).then(function(post){
    return res.status(200).json([post])
  }).catch(function(err){
    return req.status(400).json({'message': 'message not found'})
  })
}

}