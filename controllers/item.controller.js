const express = require('express')
const ItemController = express.Router()
const Item = require('../models/item')

module.exports = ItemController

    // GET /items
    .get('/', (req, res) => {
        Item.getItems(10, (err, response) => {
            if (err) {
                return res.json({
                  responseCode: 1,
                  error: err
                })
            }
            res.json(response)
        })
    })

    // POST /items
    .post('/', (req, res) => {
        Item.createItem(req.body, (err, response) => {
            if (err) {
                return res.json({
                    responseCode: 1,
                    error: err
                })
            }
            res.json(response)
        })
    })

// module.exports = ItemController
