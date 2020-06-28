const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Post = require('../models/post')
const requireLogin = require('../middleware/requireLogin')

router.get('/allposts', requireLogin, async(request, response, next)=>{
    await Post.find()
    .populate('postedBy', "_id name email")
    .populate('comments.postedBy',"_id name email")
    .exec()
    .then((posts)=>{
        return response.json({allpost:posts})
    })
    .catch((error)=>{
       return response.json({error: error})
    })
})

router.get('/getsubpost', requireLogin, async(request, response, next)=>{
    //if postedby my folling
    await Post.find({postedBy:{$in:request.user.following}})
    .populate('postedBy', "_id name email")
    .populate('comments.postedBy',"_id name email")
    .exec()
    .then((posts)=>{
        return response.json({allpost:posts})
    })
    .catch((error)=>{
       return response.json({error: error})
    })
})

router.post('/createpost',requireLogin ,async (request, response, next)=>{
    console.log(request.body)
    const { title, body, pic } = request.body
    if(!title || !body || !pic){
        return response.status(422).json({error:"please add all the fields"})
    }
    request.user.password = undefined
    const post = new Post({
        title,
        body,
        photo: pic,
        postedBy: request.user
    })
    await post.save()
    .then((result)=>{
        return response.json({message:"saved succeessfuly"})
    })
    .catch((error)=>{
        return response.json({error: error})
    })
})

router.get('/myposts', requireLogin, async (request, response, next)=>{
    await Post.find({postedBy: request.user._id})
    .populate('postedBy', "_id name email")
    .exec()
    .then((myposts)=>{
        if(myposts){
            return response.json({myposts: myposts})
        }else{
            return response.json({message: `Tu n'as pas encore créer des posts`})
        }
    })
    .catch((error)=>{
        return response.json({error: error})
    })
})

router.put('/like', requireLogin, async(request, response, next)=>{
    await Post.findByIdAndUpdate(request.body.postId,{
        $push: {likes: request.user._id}
    },{
        new : true
    }).exec((error, result)=>{
        if(error){
            return response.status(422).json({error: error})
        }else{
            return response.json(result)
        }
    })
})

router.put('/unlike', requireLogin, async(request, response, next)=>{
    await Post.findByIdAndUpdate(request.body.postId,{
        $pull: {likes: request.user._id}
    },{
        new : true
    }).exec((error, result)=>{
        if(error){
            return response.status(422).json({error: error})
        }else{
            return response.json(result)
        }
    })
})

router.put('/comment', requireLogin, async(request, response, next)=>{
    const comment = {
        text: request.body.text,
        postedBy: request.user._id
    }
    await Post.findByIdAndUpdate(request.body.postId,{
        $push: {comments: comment}
    },{
        new : true
    })
    .populate("comments.postedBy", "_id name email")
    .populate("postedBy","_id name email")
    .exec((error, result)=>{
        if(error){
            return response.status(422).json({error: error})
        }else{
            return response.json(result)
        }
    })
})

router.delete("/deletepost/:postId",requireLogin, async(request, response, next)=>{
    await Post.findOne({_id: request.params.postId})
    .populate("postedBy","_id")
    .exec((error, post)=>{
        if(error || !post){
            return response.status(422).json({error:error})
        }
        if(post.postedBy._id.toString() === request.user._id.toString()){
            post.remove()
            .then(result=>{
                return response.json(result)
            })
            .catch(error=>{
                console.log(error)
            })
        }
    })
})
module.exports = router

