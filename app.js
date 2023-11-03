const express = require('express')
const app = express()
require('./db/mongo')


const PORT = process.env.PORT || 8000

app.use(express.json())

app.listen(PORT,()=>{
    console.log("server is running")
})


