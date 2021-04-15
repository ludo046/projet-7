//imports
const express = require('express');

const usersCtrl = require('./routes/usersCtrl')
const messagesCtrl = require('./routes/messagesCtrl')
const likesCtrl = require('./routes/likesCtrl')

exports.router = (function(){ 

    const apiRouter = express.Router();

    apiRouter.route('/users/register/').post(usersCtrl.register);
    apiRouter.route('/users/login/').post(usersCtrl.login);
    apiRouter.route('/users/me/').get(usersCtrl.getUserProfile)
    apiRouter.route('/users/me/').put(usersCtrl.updateUserProfile)

    apiRouter.route('/message/new/').post(messagesCtrl.createMessage)
    apiRouter.route('/message/').get(messagesCtrl.listMessage)

    apiRouter.route('/message/:messageId/vote/like').post(likesCtrl.likePost);
    apiRouter.route('/message/:messageId/vote/dislike').post(likesCtrl.dislikePost);

    return apiRouter
})();
