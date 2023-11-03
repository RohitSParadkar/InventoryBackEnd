const express = require('express')
const app = express()
require('./db/mongo')

const userRouter = require('./Routes/user')
const PORT = process.env.PORT || 8000

app.use(express.json())

app.use('/api/user',userRouter)
app.listen(PORT,()=>{
    console.log("server is running")
})


