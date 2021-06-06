//imports
const express = require('express');
const multer = require('./utils/multer-config');
const multerMovie = require('./utils/multer-config-movie')

const usersCtrl = require('./routes/usersCtrl');
const messagesCtrl = require('./routes/messagesCtrl');
const likesCtrl = require('./routes/likesCtrl');
const commentCtrl = require('./routes/commentCtrl');
const likeComment = require('./routes/likes-comments');

exports.router = (function(){ 

    const apiRouter = express.Router();

    apiRouter.route('/users/register/').post(usersCtrl.register);
    apiRouter.route('/users/login/').post(usersCtrl.login);
    apiRouter.route('/users/me/').get(usersCtrl.getUserProfile);
    apiRouter.route('/users/me/').put(multer,usersCtrl.updateUserProfile);
    apiRouter.route('/users/delete/').delete(usersCtrl.deleteUser);

    apiRouter.route('/message/new/').post(multer,messagesCtrl.createMessage);
    apiRouter.route('/message/').get(messagesCtrl.listMessage);
    apiRouter.route('/message/:messageId/delete/').delete(messagesCtrl.deletePost);
    apiRouter.route('/message/:messageId/modify/').put(multer, messagesCtrl.modifyPost);
    apiRouter.route('/message/:messageId/like/').post(likesCtrl.likePost);
    apiRouter.route('/message/:messageId/dislike/').post(likesCtrl.dislikePost);

    apiRouter.route('/comment/:messageId/comment/new/').post(multer, commentCtrl.commentPost);
    apiRouter.route('/comment/').get(commentCtrl.listComment);
    apiRouter.route('/comment/:commentId/like/').post(likeComment.likeCommentPost);
    apiRouter.route('/comment/:commentId/dislike').post(likeComment.dislikeCommentPost);
    apiRouter.route('/comment/:commentId/delete').delete(commentCtrl.deleteComment);
    apiRouter.route('/comment/:commentId/modify').put(multer, commentCtrl.modifyComment);

    apiRouter.route('/like/:messageId').get(likesCtrl.getLike);
    apiRouter.route('/likeComment').get(likeComment.getLikeComment);

    return apiRouter
})();
