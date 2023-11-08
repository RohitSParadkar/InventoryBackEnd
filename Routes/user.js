const router = require('express').Router()
const { createUser, signin, emailVarification,forgotPassword} = require('../controller/user')
const { validateUser, validate } = require('../middlerwares/validator')


router.post('/create',
validateUser,
validate,
createUser)

router.post('/signin',
signin
)

router.post('/varifyEmail',
emailVarification
)

router.post('/forgotPassword',
forgotPassword
)

module.exports = router