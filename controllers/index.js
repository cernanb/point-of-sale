const express = require('express')
const router = express.Router()
const home = require('./home')
const ItemController = require('./item.controller')
const UserController = require('./user.controller')


// Static route to handle html files
router.use('/', home)
// API route to hanlde API calls
router.use('/items', ItemController)
router.use('/users', UserController)

module.exports = router
