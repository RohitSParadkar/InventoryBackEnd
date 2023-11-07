const router = require('express').Router()
const { createUser, signin } = require('../controller/user')
const { validateUser, validate } = require('../middlerwares/validator')


router.post('/create',
validateUser,
validate,
createUser)
router.post('/signin',
signin
)

module.exports = router