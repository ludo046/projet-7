//imports
const express = require('express');
const multer = require('./utils/multer-config');

const usersCtrl = require('./routes/usersCtrl');
const messagesCtrl = require('./routes/messagesCtrl');
const likesCtrl = require('./routes/likesCtrl');
const commentCtrl = require('./routes/commentCtrl');
const likeComment = require('./routes/likes-comments');
const limiter = require('express-rate-limit')

//limiteur de requettes 
const createAccountLimiter = limiter({
    windowMs: 60 * 60 * 1000,//fenetre d'une heure
    max: 2000, //deux creation de compte par heure 
    message: "Trop de compte créés a partir de cette adresse IP"
});
const loginAccountLimiter = limiter({
    windowMs: 60 * 60 * 1000,
    max: 10000, 
    message: "Trop de tentative de connection a partir de cette adresse IP"
})

exports.router = (function(){ 

    const apiRouter = express.Router();

    apiRouter.route('/users/register/').post(createAccountLimiter, usersCtrl.register);
    apiRouter.route('/users/login/').post(loginAccountLimiter, usersCtrl.login);
    apiRouter.route('/users/me/').get(usersCtrl.getUserProfile);
    apiRouter.route('/users/me/').put(multer,usersCtrl.updateUserProfile);
    apiRouter.route('/users/delete/').delete(usersCtrl.deleteUser);
    apiRouter.route('/users/all/').get(usersCtrl.getAllUser);

    apiRouter.route('/message/new/').post(multer,messagesCtrl.createMessage);
    apiRouter.route('/message/').get(messagesCtrl.listMessage);
    apiRouter.route('/message/:messageId/delete/').delete(messagesCtrl.deletePost);
    apiRouter.route('/message/:messageId/modify/').put(multer, messagesCtrl.modifyPost);
    apiRouter.route('/message/:messageId/like/').post(likesCtrl.likePost);
    apiRouter.route('/message/:messageId/dislike/').post(likesCtrl.dislikePost);
    apiRouter.route('/message/:messageId/').get(messagesCtrl.getOnePost);

    apiRouter.route('/comment/:messageId/comment/new/').post(multer, commentCtrl.commentPost);
    apiRouter.route('/comment/').get(commentCtrl.listComment);
    apiRouter.route('/comment/:commentId/like/').post(likeComment.likeCommentPost);
    apiRouter.route('/comment/:commentId/dislike').post(likeComment.dislikeCommentPost);
    apiRouter.route('/comment/:commentId/delete').delete(commentCtrl.deleteComment);
    apiRouter.route('/comment/:commentId/modify').put(multer, commentCtrl.modifyComment);
    apiRouter.route('/comment/:commentId').get(commentCtrl.getOneComment);

    apiRouter.route('/like/:messageId').get(likesCtrl.getLike);
    apiRouter.route('/likeComment/:commentId').get(likeComment.getLikeComment);

    return apiRouter
})();
