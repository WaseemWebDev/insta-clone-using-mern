const express = require("express");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const crypto = require("crypto");
const router = express.Router();
const Users = require("../models/user");
var nodemailer = require("nodemailer");
var transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: "uk3296681@gmail.com",
    pass: "umairkhan123",
    tls: {
      rejectUnauthorized: false
  }
  },
});

router.post("/signup", (req, res) => {
  const { name, email, password ,photo } = req.body;
  if (!email || !name || !password || !photo) {
    res.json({ error: "please add all the fields" }); // 422 means server has understood the message but can not request it
  } else {
    const checkEmail = Users.findOne({ email })
      .then((emailResult) => {
        if (emailResult) {
          res.json({ error: "user already exist with this email" });
        } else {
        
                bcrypt.hash(password, 12, function (err, hashpassword) {
                  const userDetails = new Users({
                    name: name,
                    email: email,
                    password: hashpassword,
                    photo,
                  });
                  userDetails.save(function (error) {
                    if (error) {
                      console.log(error);
                    } else {
                      res.json({ message: "data succesfully inserted" });
                    }
                  });
                }); 
            }
      })
      .catch((err) => {
        console.log(err.message);
      });
  }
})

router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(422).json({ error: "please provide all fields" });
  } else {
    Users.findOne({ email }).then((checkUser) => {
      if (checkUser) {
        bcrypt
          .compare(password, checkUser.password)
          .then((doMatch) => {
            if (doMatch) {
              const token = jwt.sign(
                {
                  _id: checkUser._id,
                },
                process.env.JWT,
                { expiresIn: "7d" }
              );
              req.user = checkUser;
              res.json({ token: token, user: req.user });
            } else {
              res.json({ error: "invalid credentials" });
            }
          })
          .catch((err) => {
            console.log(err.message);
          });
      } else {
        res.json({ error: "invalid credentials" });
      }
    });
  }
});

router.post("/resetpassword", (req, res) => {
  crypto.randomBytes(60, (err, buffer) => {
    if (err) {
      console.log(err);
    } else {
      const token = buffer.toString("hex");
      Users.findOne({ email: req.body.email }).then((user) => {
        if (!user) {
          res.json({ error: "user doesnot exist with this email" });
        } else {
            user.resetToken = token;
            user.expireToken = Date.now() + 3600000;
            user.save().then((result) => {
              if(result){
                transporter.sendMail(
                    {
                      from: "noreply@gmail.com",
                      to: req.body.email,
                      subject: "Reset password ",
                      text: `click on the <a href="https://instaclone34.herokuapp.com/save-password/${token}">link</a> to reset your password`,
                    },
                    function (error, info) {
                      if (error) {
                        console.log(error);
                      } else {
                        res.json({message:"email successfully send"})
                      }
                    }
                  );
              }
            
          });
        }
      });
    }
  });
});

router.post('/savepassword',(req,res)=>{
    const newPassword = req.body.password;
    const token = req.body.token;
    Users.findOne({resetToken:token,expireToken:{$gt:Date.now()}})
    .then((user)=>{
    
        if(!user){
            res.json({error:"session expired reset password again"})
        }
        else{
        
            bcrypt.hash(newPassword, 12, function (err, hashpassword) {
               user.password = hashpassword;
               user.resetToken=undefined
               user.expireToken=undefined
               user.save().then((updatedPassword)=>{
                res.json({message:"Password has been reset successfully"})
               })
              
              });
        }
    })
    .catch((err)=>{
        console.log(err)
    })
})

module.exports = router;
