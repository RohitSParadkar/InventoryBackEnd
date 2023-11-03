const router = require('express').Router()
const { createUser } = require('../controller/user')


router.post('/create',createUser)

module.exports = router