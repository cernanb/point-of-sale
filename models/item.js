const r = require('rethinkdb')
const dbConfig = require('../dbConfig')
const assert = require('assert')

module.exports.getItems = (max_results, callback) => {
    onConnect((err, connection) => {
        r.db(dbConfig.db).table('items').orderBy(r.desc('timestamp')).limit(max_results).run(connection, (err, cursor) => {
            if (err) {
                logerror("[ERROR][%s][getItems] %s:%s\n%s", connection['_id'], err.name, err.msg, err.message);
                callback(null, [])
                connection.close()
            } else {
                cursor.toArray((err, result) => {
                    if (err) {
                        logerror("[ERROR][%s][getItems][toArray] %s:%s\n%s", connection['_id'], err.name, err.msg, err.message);
                        callback(null, [])
                    } else {
                        callback(null, result)
                    }
                    connection.close()
                })
            }
        })
    })
}

module.exports.getItem = (itemId, callback) => {
    onConnect((err, connection) => {
        r.db(dbConfig.db).table('items').get(itemId).run(connection, (err, result) => {
            if (err) {
                logerror("[ERROR][%s][getItem][toObject] %s:%s\n%s", connection['_id'], err.name, err.msg, err.message)
                callback(null, {})
            } else {
                callback(null, result)
            }
            connection.close()
        })
    })
}

module.exports.createItem = (itemInfo, callback) => {
    const item = Object.assign({}, itemInfo, { createdAt: r.now(), updatedAt: r.now() })
    onConnect((err, connection) => {
        r.db(dbConfig.db).table('items').insert(item).run(connection, (err, result) => {
            if (err) {
                logerror("[ERROR][%s][createItem] %s:%s\n%s", connection['_id'], err.name, err.msg, err.message);
                callback(err)
            } else {
                if (result.inserted === 1) {
                    callback(null, true)
                } else {
                    callback(null, false)
                }
            }
            connection.close()
        })
    })
}

module.exports.updateItem = (itemId, itemInfo, callback) => {
    const item = Object.assign({}, itemInfo, { updatedAt: r.now() })
    onConnect((err, connection) => {
        r.db(dbConfig.db).table('items').get(itemId).update({ name: item.name, updatedAt: item.updatedAt }).run(connection, (err, result) => {
            if (err) {
                logerror("[ERROR][%s][updateItem][toObject] %s:%s\n%s", connection['_id'], err.name, err.msg, err.message)
                callback(null, {})
            } else {
                callback(null, result)
            }
            connection.close()
        })
    })
}

module.exports.deleteItem = (itemId, callback) => {
    onConnect((err, connection) => {
        r.db(dbConfig.db).table('items').get(itemId).delete().run(connection, (err, result) => {
            if (err) {
                logerror("[ERROR][%s][deleteItem][toObject] %s:%s\n%s", connection['_id'], err.name, err.msg, err.message)
                callback(null, {})
            } else {
                callback(null, result)
            }
            connection.close()
        })
    })
}

const onConnect = (callback) => {
    r.connect({host: dbConfig.host, port: dbConfig.port }, (err, connection) => {
        assert.ok(err === null, err);
        connection['_id'] = Math.floor(Math.random()*10001);
        callback(err, connection);
    });
}
