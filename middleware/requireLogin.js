const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/keys')
const User = require('../models/user')

module.exports = (request, response, next)=>{
    const { authorization } = request.headers
    if(!authorization){
        return response.status(401).json({error: "You must be login in"})
    }
    const token = authorization.replace("Bearer ","")
    jwt.verify(token, JWT_SECRET, (error, payload)=>{
        if(error){
            return response.status(401).json({error: "You must be login in"})
        }
        const { _id } = payload
        User.findById(_id)
        .then((userData)=>{
            request.user = userData
            next()
        }).catch((error)=>{
            console.log(error)
        })
    })
}