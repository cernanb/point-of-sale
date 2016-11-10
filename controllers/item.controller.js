const express = require('express')
const ItemController = express.Router()
const Item = require('../models/item')

module.exports = ItemController

    // GET /items
    .get('/', (req, res) => {
        Item.getItems(10, (err, response) => {
            handleResponse(err, response, res)
        })
    })

    // POST /items
    .post('/', (req, res) => {
        Item.createItem(req.body, (err, response) => {
            handleResponse(err, response, res)
        })
    })

    .get('/:itemId', (req, res) => {
        Item.getItem(req.params.itemId, (err, response) => {
            handleResponse(err, response, res)
        })
    })

    .put('/:itemId', (req, res) => {
        Item.updateItem(req.params.itemId, req.body, (err, response) => {
            handleResponse(err, response, res)
        })
    })

    .delete('/:itemId', (req, res) => {
        Item.deleteItem(req.params.itemId, (err, response) => {
            handleResponse(err, response, res)
        })
    })

// END OF CONTROLLER

// HELPER FUNCTIONS

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
