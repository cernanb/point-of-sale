const r = require('rethinkdb')
const dbConfig = require('../dbConfig')
const assert = require('assert')

module.exports.getItems = (max_results, callback) => {
    onConnect((err, connection) => {
        r.db(dbConfig.db).table('items').orderBy(r.desc('timestamp')).limit(max_results).run(connection, (err, cursor) => {
            logAndClose(err, connection, '', callback, cursor)
        })
    })
}

module.exports.getItem = (itemId, callback) => {
    onConnect((err, connection) => {
        r.db(dbConfig.db).table('items').get(itemId).run(connection, (err, result) => {
            logAndClose(err, connection, result, callback)
        })
    })
}

module.exports.createItem = (itemInfo, callback) => {
    const item = Object.assign({}, itemInfo, { createdAt: r.now(), updatedAt: r.now() })
    onConnect((err, connection) => {
        r.db(dbConfig.db).table('items').insert(item).run(connection, (err, result) => {
            if (err) {
                logerror("[ERROR][%s] %s:%s\n%s", connection['_id'], err.name, err.msg, err.message);
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
            logAndClose(err, connection, result, callback)
        })
    })
}

module.exports.deleteItem = (itemId, callback) => {
    onConnect((err, connection) => {
        r.db(dbConfig.db).table('items').get(itemId).delete().run(connection, (err, result) => {
            logAndClose(err, connection, result, callback)
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

const logAndClose = (err, connection, result, callback, cursor = null) => {
    if (cursor) {
        if (err) {
            logerror("[ERROR][%s] %s:%s\n%s", connection['_id'], err.name, err.msg, err.message);
            callback(null, [])
        } else {
            cursor.toArray((err, result) => {
                if (err) {
                    logerror("[ERROR][%s] %s:%s\n%s", connection['_id'], err.name, err.msg, err.message)
                    callback(null, [])
                } else {
                    callback(null, result)
                }
            })
        }
    } else {
        if (err) {
            logerror("[ERROR][%s] %s:%s\n%s", connection['_id'], err.name, err.msg, err.message)
            callback(null, {})
        } else {
            callback(null, result)
        }
    }
    connection.close()
}
