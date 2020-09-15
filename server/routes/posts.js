const express = require('express');
const router = express.Router();
const posts = require('../models/post');
const User = require('../models/user');
const requireLogin = require('../middlewares/stopLogin');
router.get("/allposts", requireLogin, (req, res) => {

    posts.find().populate('postedBy', "_id name").populate('comments.postedBy', 'id name').sort({ 'createdAt': -1 }).then((data) => {
        res.json({ data: data })
    })
        .catch((err) => {
            console.log(err.message);
        })
})

router.post("/createpost", requireLogin, (req, res) => {
    const { title, body ,photo} = req.body;
    if (!title || !body || !photo) {
        res.json({ error: "please provide all fields" });
    }
    else {
                const newPosts = new posts({
                    title,
                    body,
                    photo:photo,
                    postedBy: req.user._id
                })
                newPosts.save().then((data) => {
                    res.json({ message: "post has been created successfully" });
                }).catch((err) => {
                    console.log(err.message)
                })
               
        }
})
router.get('/mypost', requireLogin, (req, res) => {
     
    posts.find({ postedBy: req.user._id }).populate("postedBy", "_id followers following photo").exec((err,myPost) => {
        if(err){
           console.log(err)
        }
        else{
            User.findOne({_id:req.user._id}).then((user)=>{
                res.json({ myPost,user})
            }).catch((err)=>{
                console.log(err)
            })
            
           
        }
       
    })
})

router.post("/likes", requireLogin, (req, res) => {
  
    posts.findByIdAndUpdate(req.body.postId, {
        $push: { likes: req.user._id }
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
})
router.post("/unlikes", requireLogin, (req, res) => {
    posts.findByIdAndUpdate(req.body.postId, {
        $pull: { likes: req.user._id }
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
})
router.post("/comment", requireLogin, (req, res) => {
    const comments = {
        postedBy: req.user._id,
        text: req.body.comment
    }
    posts.findByIdAndUpdate(req.body.postId, {
        $push: { comments: comments }
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
})
router.post("/deletepost", requireLogin, (req, res) => {
    console.log(req.body._postId)
    posts.findByIdAndDelete(req.body.postId, function (err) {
        if (err) {
            res.json({ err })
        }
        else {
            res.json({ message: "post successfully deleted" })
        }

    });
})
router.get("/followersposts", requireLogin, (req, res) => {

    posts.find({ postedBy: { $in: req.user.following } }).populate('postedBy', "_id name").populate('comments.postedBy', 'id name').sort({ 'createdAt': -1 }).then((data) => {
        res.json({ data: data })
    })
        .catch((err) => {
            console.log(err.message);
        })
})

module.exports = router;