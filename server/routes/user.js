const express = require('express');
const router = express.Router();
const posts = require('../models/post');
const users = require('../models/user');
const requireLogin = require('../middlewares/stopLogin');


router.get("/userprofile/:id",requireLogin,(req,res)=>{
    userId  = req.params.id;
    users.findOne({_id:userId}).select('-password').then((user)=>{
        posts.find({postedBy:userId}).populate('postedBy').exec((error,postsResult)=>{
            if(error){
                res.json({error})
            }
            else{
            
res.json({postsResult,user})
            }
        })
    }).catch((error)=>{
        res.json({error})
    })

})

router.post("/follow", requireLogin, (req, res) => {
    const followUserId = req.body.followerId;
    console.log(followUserId)
    users.findByIdAndUpdate(followUserId, {
        $push: { followers: req.user._id},
        
    }, {
        new: true
    }).exec((err, result) => {
        if (err) {
            res.json({ err })
        }
        else {
            users.findByIdAndUpdate(req.user._id, {
                $push: { following: followUserId},
                
            }, {
                new: true
            }).exec((err, result) => {
                if (err) {
                    res.json({ err })
                }
                else {
                    res.json({ result })
                }
            })
           
        }
    })
})
router.post("/unfollow", requireLogin, (req, res) => {
    const followUserId = req.body.followerId;
    users.findByIdAndUpdate(followUserId, {
        $pull: { followers: req.user._id},
        
    }, {
        new: true
    }).exec((err, result) => {
        if (err) {
            res.json({ err })
        }
        else {
            users.findByIdAndUpdate(req.user._id, {
                $pull: { following:followUserId},
                
            }, {
                new: true
            }).exec((err, result) => {
                if (err) {
                    res.json({ err })
                }
                else {
                    res.json({ result })
                }
            })
           
        }
    })
})
router.post("/searchuser", requireLogin, (req, res) => {
    const searchText = req.body.search;
    let userPattern  = new RegExp("^"+searchText);  // "i" can also be use on the right side of search text to get all data include in search value
    users.find({email:{$regex:userPattern}}).select('_id email').then((user)=>{
        res.json({user})
    }).catch((error)=>{
        res.json({error})
    })
    
})

module.exports = router;