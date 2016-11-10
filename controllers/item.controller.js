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

    .get('/:itemId', (req, res) => {
        // show item here
    })

    .put('/:itemId', (req, res) => {
        // update item here
    })

    .delete('/:itemId', (req, res) => {
        // delete item here
    })



// module.exports = ItemController
