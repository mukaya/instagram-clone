const express = require('express')
const app = express()
const cors = require('cors')
const PORT = process.env.PORT || 5000
const mongoose = require('mongoose')
const {MONGOURI} = require('./config/keys')

mongoose.connect(MONGOURI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
},(error)=>{
    if(!error){
        console.log(`connected in mongodb`)
    }else{
        console.log(`connected in mongodb error: ${error}`)
    }
})

app.use(cors())
app.use(express.json())

app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))

if(process.env.NODE_ENV == "production"){
    app.use(express.static("frontend/build/"))
    const path = require("path")
    app.get("*",(request, response)=>{
        response.sendFile(path.resolve(__dirname,"frontend","bluid","index.html"))
    })
}

app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`);
});