const express = require('express')
const app = express()
const User = require('./model/user')
require('./db/mongo')
const PORT = process.env.PORT || 8000

app.use(express.json())

app.post('/api/user/create',(req,res)=>{
    const {name,email,password} =req.body
    const newUser = new User({
       name,
       email,
       password
    })
    res.send(newUser)
})
app.listen(PORT,()=>{
    console.log("server is running")
})


