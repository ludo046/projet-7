const models   = require('../models');
const asyncLib = require('async');
const jwtUtils = require('../utils/jwt.utils');
const messagesCtrl = require('./messagesCtrl');
const fs = require('fs')

const CONTENT_LIMIT = 1000;


module.exports = {
    commentPost: function(req, res){
    let headerAuth  = req.headers['authorization'];
    let userId = jwtUtils.getUserId(headerAuth);
    
    console.log(headerAuth);
    console.log(userId);

    let content = null;
    let messageId = parseInt(req.params.messageId);
    let attachment = null;
    let movie = null;
    if(req.file){
      let media = req.file.filename
      if (media.includes('mp4')) {
        movie = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        console.log('truc');
      } else {
        attachment = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      } 
    }

    console.log(attachment);
    if (messageId == null) {
        returnres.status(400).json({ 'error': 'missing messageId' })
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
          models.Comments.create({
            content: content,
            attachment: attachment,
            movie: movie,
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

    models.Comments.findAll({
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
},

deleteComment: function(req, res){
  let headerAuth = req.headers['authorization'];
  let userId = jwtUtils.getUserId(headerAuth)

  if (userId <= 0){
    return res.status(400).json({ 'error': 'wrong token' })
  };

  let commentId = parseInt(req.params.commentId);

  if (commentId <= 0) {
    return res.status(400).json({ 'error': 'invalid parameters' });
  }
  models.Comments.findOne({
    where: {
      userId: userId,
      id: commentId
    }
  }).then(function(comment){
    console.log(comment);
    if(comment.attachment){
      const filename = comment.attachment.split('/images/')[1]
    fs.unlink(`images/${filename}`,() => {
      models.LikeComments.destroy({
        where: {
          userId: userId,
          commentId: commentId
        }
    }),
    models.Comments.destroy({
        where: {
          userId: userId,
          id: commentId
        }
    }).then(function(){
      res.status(201).json({ 'ok': 'comment delete' })
    }).catch(function(err){
      res.status(400).json({ 'error': 'comment not delete' })
    })
  })
    } else if (comment.movie){
      const filemoviename = comment.movie.split('/images/')[1]
      fs.unlink(`images/${filemoviename}`,() => {
        models.LikeComments.destroy({
          where: {
            userId: userId,
            commentId: commentId
          }
      }),
      models.Comments.destroy({
          where: {
            userId: userId,
            id: commentId
          }
      }).then(function(){
        res.status(201).json({ 'ok': 'comment delete' })
      }).catch(function(err){
        res.status(400).json({ 'error': 'comment not delete' })
      })
    })
    } else {
        models.LikeComments.destroy({
          where: {
            userId: userId,
            commentId: commentId
          }
      }),
      models.Comments.destroy({
          where: {
            userId: userId,
            id: commentId
          }
      }).then(function(){
        res.status(201).json({ 'ok': 'comment delete' })
      }).catch(function(err){
        res.status(400).json({ 'error': 'comment not delete' })
      })
    }
  }).catch(function(err){
    res.status(500).json({ 'error': 'comment not delete' })
  })
},

modifyComment: function(req, res) {
  let headerAuth = req.headers['authorization'];
  let userId = jwtUtils.getUserId(headerAuth)
  const commentId = req.params.commentId

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
  console.log(commentId);
  console.log(content);

  models.Comments.findOne({
    where: {
      id: commentId
    }
  }).then(function(modifyComment){
    if(modifyComment.attachment && content){
      const filename = modifyComment.attachment.split('/images/')[1]
      console.log(filename);
      fs.unlink(`images/${filename}`,() => {
        modifyComment.update({
          content: (content ? content : modifyComment.content),
          attachment: (attachment ? attachment : modifyComment.attachment),
          movie: (movie ? movie : modifyComment.movie)
        })
      })
    }else if(modifyComment.movie && content){
      const filemoviename = modifyComment.movie.split('/images/')[1]
      fs.unlink(`images/${filemoviename}`,() => {
          modifyComment.update({
          content: (content ? content : modifyComment.content),
          attachment: (attachment ? attachment : modifyComment.attachment),
          movie: (movie ? movie : modifyComment.movie)
        })
      })
    }else{
      modifyComment.update({
        content: (content ? content : modifyComment.content),
        attachment: (attachment ? attachment : modifyComment.attachment),
        movie: (movie ? movie : modifyComment.movie)
    })
  }
  }).catch(function(err){
    res.status(500).json({'error': 'post not modify'})
  })
},

getOneComment: function(req,res){
  let headerAuth = req.headers['authorization'];
  let userId = jwtUtils.getUserId(headerAuth)
  const commentId = req.params.commentId

  if(userId <= 0){
    return res.status(400).json({ 'message': 'wrong token' })
  }

  models.Comments.findOne({
    where: {
      id: commentId
    }
  }).then(function(comment){
    return res.status(200).json([comment])
  }).catch(function(err){
    return req.status(400).json({'message': 'comment not found'})
  })
}
}