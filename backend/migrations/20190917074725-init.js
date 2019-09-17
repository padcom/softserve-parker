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

exports.up = function(db) {
  db.createTable('user', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    email: { type: 'string', notNull: true },
    password: { type: 'string', notNull: true },
    rank: { type: 'float', defaultValue: 0 },
    enabled: { type: 'boolean', defaultValue: true },
    created: { type: 'timestamp', defaultValue: 'CURRENT_TIMESTAMP' }
  })

  db.createTable('parkingspot', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    reserved: { type: 'boolean', defaultValue: false },
    created: { type: 'timestamp', defaultValue: 'CURRENT_TIMESTAMP' }
  })

  return null;
};

exports.down = function(db) {
  db.dropTable('user')
  db.dropTable('parkingspot')

  return null;
};

exports._meta = {
  "version": 1
};
