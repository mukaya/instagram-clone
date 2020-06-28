const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Post = require('../models/post')
const requireLogin = require('../middleware/requireLogin')
const User = require('../models/user')

router.get("/user/:userid",requireLogin, async(request, response, next)=>{
    await User.findOne({_id: request.params.userid})
    .select("-password")
    .then(user=>{
        Post.find({postedBy: request.params.userid})
        .populate("postedBy", "_id name email")
        .exec((error, posts)=>{
            if(error){
                return response.status(422).json({error: error})
            }
            return response.json({user,posts})
        })
    })
    .catch(error=>{
        return response.status(422).json({error: "User not found"})
        console.log(error)
    })
})

router.put('/follow', requireLogin, async(request, response, next)=>{
    User.findByIdAndUpdate(request.body.followId,{
        $push: {followers: request.user._id}
    },{
        new: true
    },(error, result)=>{
        if(error){
            return response.status(422).json({error: error})
        }
        User.findByIdAndUpdate(request.user._id,{
            $push:{following: request.body.followId}
        },{
            new: true
        })
        .select("-password")
        .then(result=>{
            return response.json(result)
        })
        .catch(error=>{
            return response.status(422).json({error: error})
        })
    })
})

router.put('/unfollow', requireLogin, async(request, response, next)=>{
    User.findByIdAndUpdate(request.body.unfollowId,{
        $pull: {followers: request.user._id}
    },{
        new: true
    },(error, result)=>{
        if(error){
            return response.status(422).json({error: error})
        }
        User.findByIdAndUpdate(request.user._id,{
            $pull:{following: request.body.unfollowId}
        },{
            new: true
        })
        .select("-password")
        .then(result=>{
            return response.json(result)
        })
        .catch(error=>{
            return response.status(422).json({error: error})
        })
    })
})
router.put("/updatepic", requireLogin, async(request, response, next)=>{
    await User.findByIdAndUpdate(request.user._id,{
        $set:{pic:request.body.pic}
    },{
        new: true
    },(error, result)=>{
        if(error) return response.status(422).json({error:"can not post"})
        return response.json(result)
    })
})
module.exports = router