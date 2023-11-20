const router = require('express').Router()
const {createProducts,getProductsByName,inventoryList,inventoryByProductid,createTransactions,transactionsList} = require("../controller/Inventory")
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
router.post('/createProducts',
createProducts
)
router.post('/getProductsByName',
getProductsByName
)
router.post('/inventoryList',
inventoryList
)
router.post('/inventoryByProductid',
inventoryByProductid
)
router.post('/createTransactions',
createTransactions
)
router.post('/transactionsList',
transactionsList
)


module.exports = router