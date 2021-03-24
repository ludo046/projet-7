//imports
const bcrypt = require('bcrypt');
const jwtUtils = require ('../utils/jwt.utils')
const models = require('../models')
const asyncLib = require('async');
const User = require('../models/user');

const emailRegexp  = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const passwordRegexp = /^(?=.*\d).{4,8}$/;


module.exports={ 
    register: function(req, res) {

        const firstName = req.body.firstName;
        const lastName = req.body.lastName; 
        const password = req.body.password;
        const email = req.body.email;
        const dateBirth = req.body.dateBirth;
        const picture = req.body.picture;

        if (firstName == null || lastName == null || password == null || email == null || dateBirth == null ) {
            return res.status(400).json({ 'error': 'missing parameters' })
        }
        models.User.findOne({
            attibutes: ['email'],
            where: {email: email}
        })
        .then(function(userFound){
            if (!userFound){
                bcrypt.hash(password, 10, function(err, bcryptedPassword){
                    const newUser = models.User.create({
                        firstname: firstName,
                        lastname: lastName,
                        password: bcryptedPassword,
                        email: email,
                        datebirth: dateBirth,
                        picture: picture,
                        isAdmin:0
                    })
                    .then(function(newUser){
                        return res.status(201).json({
                            'userId': newUser.id
                        })
                    })
                    .catch(function(err){
                        return res.status(500).json({ 'error': 'cannot add user' })
                    })
                })
            } else {
                return res.status(409).json({ 'error': 'user already exist' })
            }
        })
    },


    login: function(req, res) {
        const email = req.body.email;
        const password = req.body.password;

        if (email == null || password == null){ 
        return res.status(400).json({ 'error': 'missing parameters'})
    };
    models.User.findOne({
        where: {email: email}
    })
    .then(function(userFound){
        if (userFound){
            bcrypt.compare(password, userFound.password, function(errBycrypt, resBycrypt){
                if (resBycrypt){
                    return res.status(200).json({
                        'userId': userFound.id,
                        'token': jwtUtils.generateTokenForUser(userFound)
                    })
                } else {
                    return res.status(403).json({ 'error': 'invalid password' })
                }
            })
        } else {
            return res.status(404).json({ 'error': 'user not exist in DB' })
        }
    })
    .catch(function(err){
        return res.status(500).json({ 'error': 'unable to verify user' });
    })
    },

    getUserProfile: function(req, res){
        const headerAuth = req.headers['authorization'];
        const userId = jwtUtils.getUserId(headerAuth);
        console.log(userId);
        if (userId < 0)
        return res.status(400).json({ 'error': 'wrong token' })

        models.User.findOne({
            attributes: ['firstname', 'lastname', 'password', 'email', 'datebirth', 'picture'],
            where: {id: userId}
        }).then(function(user){
            if (user) {
                res.status(201).json(user);
            } else {
                res.status(404).json({ 'error': 'user not found' })
            }
        }).catch(function(err){
            res.status(500).json({ 'error': 'cannot fetch user' })
        })
    },

    updateUserProfile: function(req, res) {
        let headerAuth = req.headers['authorization'];
        let userId = jwtUtils.getUserId(headerAuth)

        const firstname = req.body.firstname;
        const lastname = req.body.lastname;
        const password = req.body.password;
        const email = req.body.password;
        const datebirth = req.body.datebirth;
        const picture = req.body.picture;
         
        asyncLib.waterfall([
            function(done){
                models.User.findOne({
                    attributes: ['id', 'firstname', 'lastname', 'password', 'email', 'datebirth', 'picture'],
                    where: {id : userId}
                }).then(function(userFound){
                    done(null,userFound);
                })
                .catch(function(err){
                    return res.status(500).json({ 'error': 'unable to verify' })
                })
            },
            function(userFound, done){
                if (userFound){
                    userFound.update({
                        firstname: (firstname ? firstname : userFound.firstname),
                        lastname: (lastname ? lastname : userFound.lastname),
                        password: (password ? password : userFound.password),
                        email: (email ? email : userFound.email),
                        datebirth: (datebirth ? datebirth : userFound.datebirth),
                        picture: (picture ? picture : userFound.picture)
                    }).then(function(){
                        done(userFound);
                    }).catch(function(err){
                        res.status(500).json({ 'error': 'cannot update user' })
                    });
                } else { 
                    res.status(404).json({ 'error': 'user not found' })
                }
            },
        ],function(userFound){
            if (userFound){
                return res.status(201).json(userFound);
            } else {
                return res.status(500).json({ 'error': 'connot update user profile' })
            }
        })
    }
}