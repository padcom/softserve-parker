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
  db.addColumn('user', 'state', { type: 'string' }, err1 => {
    if (!err1) {
      db.runSql(`UPDATE user SET state='active' WHERE enabled=1`, err2 => {
        if (!err2) {
          db.runSql(`UPDATE user SET state='inactive' WHERE enabled=0`, callback)
        } else {
          console.log('err', err2)
          callback()
        }
      })
    } else {
      console.log('err', err1)
      callback()
    }
  })

  return null;
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
