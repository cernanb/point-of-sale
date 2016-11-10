const r = require('rethinkdb')
const dbConfig = require('../dbConfig')
const assert = require('assert')
const logdebug = require('debug')('rdb:debug')
const logerror = require('debug')('rdb:error')

module.exports.setup = () => {
    r.connect({
        host: dbConfig.host,
        port: dbConfig.port
    }, (err, connection) => {
        assert.ok(err === null, err)
        r.dbCreate(dbConfig.db).run(connection, (err, result) => {
            if (err) {
                logdebug("[DEBUG] RethinkDB database '%s' already exists (%s:%s)\n%s", dbConfig.db, err.name, err.msg, err.message);
            } else {
                logdebug("[INFO ] RethinkDB database '%s' created", dbConfig.db);
            }

            for (var table in dbConfig.tables) {
                ((tableName) => {
                    r.db(dbConfig.db).tableCreate(tableName, { primaryKey: dbConfig.tables[table] }).run(connection, (err, result) => {
                        if (err) {
                            logdebug("[DEBUG] RethinkDB table '%s' already exists (%s:%s)\n%s", tableName, err.name, err.msg, err.message);
                        } else {
                            logdebug("[INFO ] RethinkDB table '%s' created", tableName);
                        }
                    })
                })(table)
            }
        })
    })
}
