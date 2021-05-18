//imports
const express = require('express');
const multer = require('./utils/multer-config')

const usersCtrl = require('./routes/usersCtrl')
const messagesCtrl = require('./routes/messagesCtrl')
const likesCtrl = require('./routes/likesCtrl')

exports.router = (function(){ 

    const apiRouter = express.Router();

    apiRouter.route('/users/register/').post(usersCtrl.register);
    apiRouter.route('/users/login/').post(usersCtrl.login);
    apiRouter.route('/users/me/').get(usersCtrl.getUserProfile);
    apiRouter.route('/users/me/').put(multer,usersCtrl.updateUserProfile);
    apiRouter.route('/users/delete').delete(usersCtrl.deleteUser);

    apiRouter.route('/message/new/').post(multer,messagesCtrl.createMessage);
    apiRouter.route('/message/').get(messagesCtrl.listMessage);

    apiRouter.route('/message/:messageId/like').post(likesCtrl.likePost);
    apiRouter.route('/message/:messageId/dislike').post(likesCtrl.dislikePost);

    return apiRouter
})();
