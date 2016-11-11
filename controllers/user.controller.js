const express = require('express')
const UserController = express.Router()
const User = require('../models/user')

module.exports = UserController
    .post('/', (req, res) => {
      User.createUser(req.body, (err, response) => {
        handleResponse(err, response, res)
      })
    })

const handleResponse = (err, response, res) => {
  if (err) {
    return res.json({
      responseCode: 1,
      error: err
    })
  }
  res.json({
    responseCode: 0,
    response
  })
}
