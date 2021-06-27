//imports
const bcrypt = require('bcrypt');
const jwtUtils = require ('../utils/jwt.utils')
const models = require('../models')
const asyncLib = require('async');
const fs = require('fs')
const {invalid} = require('joi');
const registerSchema  = require('../utils/joi/registerSchema');
const loginSchema = require('../utils/joi/loginShema');
const updateUserSchema = require('../utils/joi/updateUserSchema')


module.exports={ 
    //fonction de création de compte 
    register: async function (req, res) {
        try{
            //sécurité verifie le schéma joi
            const valid = await registerSchema.validateAsync(req.body);
            //si le schema est valide la fonction s'éxécute 
            if(valid){
                const firstName = req.body.firstName;
                const lastName = req.body.lastName; 
                const password = req.body.password;
                const email = req.body.email;
                const dateBirth =  null;
                const picture =  null;
                
                //verifie que les chams de sont pas null 
                if (firstName == null || lastName == null || password == null || email == null) {
                    return res.status(400).json({ 'error': 'missing parameters' })
                }
                //verifie que le mail n''existe pas dans la base de données 
                models.User.findOne({
                    attibutes: ['email'],
                    where: {email: email}
                })
                .then(function(userFound){
                    //si le user n'est pas trouver donc que le mail n'existe pas on créé le compte 
                    if (!userFound){
                        //crypte le mot de passe 
                        bcrypt.hash(password, 10, function(err, bcryptedPassword){
                            const newUser = models.User.create({
                                firstname: firstName,
                                lastname: lastName,
                                password: bcryptedPassword,
                                email: email,
                                datebirth: dateBirth || null,
                                picture: picture || null,
                                isAdmin:0
                            })
                            .then(function (newUser){
                                return res.status(201).json({
                                    //une fois le user créé on retourne le user id et un token associer a ce user
                                    'userId': newUser.id,
                                    token: jwtUtils.generateTokenForUser(newUser)
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
            } else{
                throw error(invalid)
            }
        } catch (error){
            res.status(400).json({error})
        }
    },

    //fontion de connection 
    login: async function(req, res) {
        try{
            //sécurité verifie le schéma joi
            const valid = await loginSchema.validateAsync(req.body);
             //si le schema est valide la fonction s'éxécute
            if(valid){
                const email = req.body.email;
                const password = req.body.password;
            
            //verifie que les champs ne sont pas vide 
            if (email == null || password == null){ 
                return res.status(400).json({ 'error': 'missing parameters'})
                };
            //cherche le User 
            models.User.findOne({
                where: {email: email}
             })
            .then(function(userFound){
                if (userFound){
                    //si le user est trouver comparer sont mot de passe avec le mot de passe hacher de la base de données
                     bcrypt.compare(password, userFound.password, function(errBycrypt, resBycrypt){
                    if (resBycrypt){
                        //si les deux mot de passe correspondent on retourne le userId, si il est admin ou non et sont token de session 
                        return res.status(200).json({
                            'userId': userFound.id,
                            'isAdmin': userFound.isAdmin,
                            token: jwtUtils.generateTokenForUser(userFound)
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
        } else {
            throw error(invalid)
        } 
    }catch (error){
        res.status(400).json({error});
    }
    },

    getUserProfile: function(req, res){
        // recupère le header et decode le token
        const headerAuth = req.headers['authorization'];
        const userId = jwtUtils.getUserId(headerAuth);
        //verifie que le userId n'est pas null 
        if (userId < 0)
        return res.status(400).json({ 'error': 'wrong token' })

        //cherche le User 
        models.User.findOne({
            //ressort les colonne demander 
            attributes: ['firstname', 'lastname', 'password', 'email', 'datebirth', 'picture'],
            where: {id: userId}
        }).then(function(user){
            if (user) {
                //si le user est trouver retourner le user 
                res.status(201).json([user]);
            } else {
                res.status(404).json({ 'error': 'user not found' })
            }
        }).catch(function(err){
            res.status(500).json({ 'error': 'cannot fetch user' })
        })
    },

    //fonction modification de profil 
   updateUserProfile: async function(req, res) {
       try{
           //sécurité verifie le schéma joi
           const valid = await updateUserSchema.validateAsync(req.body)
           
           //si le schema est valide la fonction s'éxécute
           if(valid){
            let headerAuth = req.headers['authorization'];
            let userId = jwtUtils.getUserId(headerAuth)
    
            const firstname = req.body.firstname;
            const lastname = req.body.lastname;
            const email = req.body.email;
            const datebirth = req.body.datebirth;
            const picture = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
             
            //exécute un tableau de fonction en série , passant chacune ses resultats à la suivante.
        //cependant, ci l'une des fonction transmet une erreur ne sera pas éxécutée
            asyncLib.waterfall([
                function(done){
                    //cherche le user 
                    models.User.findOne({
                        //ressort les colonne demander 
                        attributes: ['id', 'firstname', 'lastname', 'email', 'datebirth', 'picture'],
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
                        //si le user est trouvé mais a jour la base de données
                        userFound.update({
                            //si un firstname existe le remplacer par le nouveau ...
                            firstname: (firstname ? firstname : userFound.firstname),
                            lastname: (lastname ? lastname : userFound.lastname),
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

           } else {
               throw error(invalid)
           }
       }catch (error){
        res.status(400).json({error});
    }
    }, 

    //fonction suppression d'utilisateur 
    deleteUser: function(req, res){
        let headerAuth = req.headers['authorization'];
        let userId = jwtUtils.getUserId(headerAuth)
        
        //verifie que le userId n'est pas null 
        if (userId <= 0){
          return res.status(400).json({ 'error': 'wrong token' })
        };
        
        //cherche le user 
        models.User.findOne({
          where: {
            id: userId,
          }
        }).then(function(user){
            //si le user est trouvé un recuperer le nom de sa photo de profil pour la supprimer du dossier 
          const filename = user.picture.split('/images/')[1]
          fs.unlink(`images/${filename}`,() => {
              //on supprimer tous les likes de l'utilisateur 
            models.Likes.destroy({
              where: {
                  userId: userId
              }
          }),
          //on supprime tous les commentaires de l'utilisateur 
          models.Comments.destroy({
              where:{
                userId: userId
              }
          }),
          //on supprime tous les posts de l'utilisateur 
          models.Messages.destroy({
              where: {
                userId: userId,
              }
          }),
          //on supprime l'utilisateur 
          models.User.destroy({
              where: {
                id: userId
              }
          })
          .then(function(){
            res.status(201).json({ 'ok': 'post delete' })
          }).catch(function(err){
            res.status(400).json({ 'error': 'post not delete' })
          })
        })
        }).catch(function(err){
          res.status(500).json({ 'error': 'post not delete' })
        })
    },

//fonction de recupérétion de tous les utilisateurs
getAllUser: function(req, res) {
    let fields  = req.query.fields;
    let order   = req.query.order;

    //cherche tous les utilisateur 
    models.User.findAll({
        //tri les utilisateur pas id 
      order: [(order != null) ? order.split(':') : ['id']],
      attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
    }).then(function(user) {
      if (user) {
        //retourne la liste de tous les utilisateurs 
        res.status(200).json(user);
      } else {
        res.status(404).json({ "error": "no messages found" });
      }
    }).catch(function(err) {
      res.status(500).json({ "error": "invalid fields" });
    });
}
}
