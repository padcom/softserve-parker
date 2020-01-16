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
  db.addColumn('user', 'temp', { type: 'string' }, (err1) => {
    if (!err1) {
      console.log('Temp column added - updating it with temp value')
      db.runSql('UPDATE user SET temp=phone', (err2) => {
        if (!err2) {
          console.log('Temp column updated - removing phone column')
          db.removeColumn('user', 'phone', (err3) => {
            if (!err3) {
              console.log('Phone column removed - adding new phone column')
              db.addColumn('user', 'phone', { type: 'string' }, (err4) => {
                if (!err4) {
                  console.log('Phone column added - updating with temp column value')
                  db.runSql('UPDATE user SET phone=temp', (err5) => {
                    if (!err5) {
                      console.log('Phone column updated - removing temp column')
                      db.removeColumn('user', 'temp', (err6) => {
                        if (!err6) {
                          console.log('Temp column removed. Done')
                          callback(null)
                        } else {
                          console.log('ERROR6', err6)
                          callback(err6)
                        }
                      })
                    } else {
                      console.log('ERROR5', err5)
                      callback(err5)
                    }
                  })
                } else {
                  console.log('ERROR4', err4)
                  callback(err4)
                }
              })
            } else {
              console.log('ERROR3', err3)
              callback(err3)
            }
          })
        } else {
          console.log('ERROR2', err2)
          callback(err2)
        }
      })
    } else {
      console.log('ERROR', err1)
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
