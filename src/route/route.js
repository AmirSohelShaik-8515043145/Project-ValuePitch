const express = require("express")
const router = express.Router()
const { createUser, getUserProfile }=require("../controller/controller")
const { login } = require("../controller/login")
const { authentication } = require("../middleware/middleware")

router.post('/createUser', createUser)
router.post('/login', login)

router.get('/getDetails/:id',authentication , getUserProfile)

module.exports = router