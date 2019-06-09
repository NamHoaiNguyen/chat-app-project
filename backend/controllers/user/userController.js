const db = require("../../models");
const socket = require("../../server.js");

const { Op } = db.Sequelize;
const bcrypt = require("bcrypt");

const generateHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

module.exports = {
  info: (req, res) => {
    db.User.findByPk(req.params.id).then(user => {
      if (user) {
        res.json({
          ...user.get({ plain: true }),
        });
      } else {
        res.json({ error: "user not found" });
      }
    });
  },

  update: (req,res) =>{
    db.User.findByPk(req.params.id).then(updateUser =>{
      if(updateUser){

           db.User.update(
             {
               gender : req.body.gender,
               age : req.body.age,
               city : req.body.city
             },
             {where :{id : req.params.id}}
           ).then(newUpdate => {
             if(newUpdate){
                res.status(200).json({
                    message : "Update Successfully"
                });
             }
             else{
               res.status(422).json({
                 message : "Failed"
               });
             }
           });
      }
      else{
        res.status(422).json({
          message: "Update Failed"
        });
      }
     });
  },

  change : (req, res) =>{
    db.User.findByPk(req.params.id).then(change =>{
      if(change){
         bcrypt.compare(req.body.password, change.password).then(result =>{
           if(result){
             db.User.update({
               password : generateHash(req.body.newpassword),
             },
             {where : {id : req.params.id}}
           ).then(newpass =>{
              if(newpass){
                res.status(200).json({
                  message : "Change successfuly"
                });
              }
          else{
             res.status(422).json({
               message : "Can't update!!!"
             });
           }
         });
       }else{
         res.status(422).json({
           message : "Enter wrong password!!!"
         });
       }
         }).catch(err =>{
           res.status(401).json({
             message : "Auth failed"
           });
         });
      }else{
        res.status(422).json({
          message : "Not this person"
        });
      }
    });
  },

  addContact : (req, res) =>{
    db.User.findByPk(req.params.id).then(contact => {
      if(contact){
        db.ListContact.findOne({where : {
          userId : req.userData.userId,
          friendId : req.params.id
        } }).then(added => {
          if(added){
            res.json({message : "You have added this person."});
          }
          else{
            db.ListContact.create({
              userId : req.userData.userId,
              friendId : req.params.id
            });

            db.ListContact.create({
              userId : req.params.id,
              friendId : req.userData.userId
            });
            res.status(200).json({
              message : "Added!!!"
            });
          }
        });
      }
    else{
      res.status(422).json({
        message : "Auth failed"
      });
    }
    });
  },

  getContact : (req, res) => {
    db.User.findByPk(req.userData.userId).then(user =>{
      if(user){
        db.ListContact.findAll({
          where : {userId : req.userData.userId}
        }).then(listContact =>{
           if(listContact.length){
             db.User.findAll({
               where: {
                 id:  listContact.map(list => list.friendId) ,
               },
               order: [["createdAt", "ASC"]],
             }).then(data => res.json(data.map(userData => ({ ...userData.get({ plain: true }) }))));
           }else{
             res.status(200).json({
               message : "You dont have any friends!!!"
             });
           }
        });
      }else{
        res.status(422).json({
          message : "Don't have account"
        });
      }
    });
  }
};
