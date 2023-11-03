const router = require('express').Router()
const { createUser } = require('../controller/user')
const { validateUser, validate } = require('../middlerwares/validator')


router.post('/create',
validateUser,
validate,
createUser)

module.exports = router