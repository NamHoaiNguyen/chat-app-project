const db = require("../../models");
const socket = require("../../server.js");

const { Op } = db.Sequelize;
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator/check");

const generateHash = password => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

const jwt = require("jsonwebtoken");
const secretkey =
  "u4AOqGP4pgSP2z1hsG6ZCkrkEIE7ayEsf9nbbFQlBbTCNXWJmn5NE1CUauxQgYD";

module.exports = {
  login: (req, res) => {
    console.log("-----------------------------------");
    console.log("Login request:");
    console.log("username/email:", req.body.username);
    console.log("password:", req.body.password);
    console.log("-----------------------------------");

    db.User.findOne({
      where: {
        [Op.or]: [{ username: req.body.username }, { email: req.body.username }]
      }
    }).then(user => {
      if (user == null) {
        res.status(422).json({
          message: "User does not exist"
        });
        console.log("User does not exist!");
      } else {
        bcrypt.compare(req.body.password, user.password, (err, result) => {
          if (err) {
            res.status(422).json({
              message: "Auth failed!"
            });
          } else if (result) {
            jwt.sign(
              {
                username: user.username,
                userID: user.id
              },
              secretkey,
              { expiresIn: "500h" },
              (err, token) => {
                if (err) {
                  res.status(422).json({
                    message: "Failed to create token"
                  });
                } else {
                  res.status(200).json({
                    message: "Logged in successfully",
                    token: token,
                    userID: user.id
                  });
                }
              }
            );
          } else {
            res.status(422).json({
              message: "Wrong password!"
            });
          }
        });
      }
    });
  },

  register: (req, res) => {
    console.log("-----------------------------------");
    console.log("Register request:");
    console.log("username:", req.body.username);
    console.log("password:", req.body.password);
    console.log("-----------------------------------");

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Invalid password!");
      return res.status(422).json({ errors: errors.array() });
    }

    const newUser = db.User.build({
      username: req.body.username,
      email: req.body.email,
      password: generateHash(req.body.password)
    });
    db.User.findOne({
      where: { email: req.body.email }
    }).then(user => {
      if (user != null) {
        console.log("Email already exists!");
        res.status(422).json({
          message: "Email already exists"
        });
      }
    });
    db.User.findOne({
      where: { username: req.body.username }
    }).then(user => {
      if (user == null) {
        newUser.save();
        res.status(200).json({
          message: "Registered successfully"
        });
      } else {
        console.log("User already exists!");
        res.status(422).json({
          message: "User already exists"
        });
      }
    });
  },

  change: (req, res) => {
    db.User.findByPk(req.params.id).then(change => {
      if (change) {
        bcrypt
          .compare(req.body.password, change.password)
          .then(result => {
            if (result) {
              db.User.update(
                {
                  password: generateHash(req.body.newpassword)
                },
                { where: { id: req.params.id } }
              ).then(newpass => {
                if (newpass) {
                  res.status(200).json({
                    message: "Change successfuly"
                  });
                } else {
                  res.status(422).json({
                    message: "Can't update!!!"
                  });
                }
              });
            } else {
              res.status(422).json({
                message: "Enter wrong password!!!"
              });
            }
          })
          .catch(err => {
            res.status(401).json({
              message: "Auth failed"
            });
          });
      } else {
        res.status(422).json({
          message: "Not this person"
        });
      }
    });
  }
};
