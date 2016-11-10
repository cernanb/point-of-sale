const express = require('express')
const router = express.Router()
const home = require('./home')
const ItemController = require('./item.controller')


// Static route to handle html files
router.use('/', home)
// API route to hanlde API calls
router.use('/items', ItemController)

module.exports = router
