'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db, callback) {
  console.log('Here')
  db.runSql(`UPDATE user SET description='' WHERE description IS NULL`, (err1) => {
    if (!err1) {
      db.runSql(`UPDATE user SET phone='' WHERE phone IS NULL`, (err2) => {
        if (!err2) {
          db.runSql(`UPDATE user SET roles='user' WHERE roles IS NULL`, callback)
        } else {
          console.log('ERROR2', err2)
          callback(err2)
        }
      })
    } else {
      console.log('ERROR1', err1)
      callback(err1)
    }
  })
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
