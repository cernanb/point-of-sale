const r = require('rethinkdb')
const dbConfig = require('../dbConfig')
const assert = require('assert')
const bcrypt = require('bcrypt')

module.exports.createUser = (userInfo, callback) => {
  const user = Object.assign({}, userInfo, {createdAt: r.now(), updatedAt: r.now()})

  onConnect((err, connection) => {
    r.db(dbConfig.db).table('users').insert(user).run(connection, (err, result) => {
      if (err) {
        logerror("[ERROR][%s] %s:%s\n%s", connection['_id'], err.name, err.msg, err.message)
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

const onConnect = (callback) => {
    r.connect({host: dbConfig.host, port: dbConfig.port }, (err, connection) => {
        assert.ok(err === null, err);
        connection['_id'] = Math.floor(Math.random()*10001);
        callback(err, connection);
    });
}
