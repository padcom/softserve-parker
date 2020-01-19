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
  db.createTable('sut', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    email: { type: 'string', notNull: true },
    token: { type: 'string', notNull: true },
    state: { type: 'string', notNull: true, defaultValue: '' },
    created: { type: 'timestamp', defaultValue: 'CURRENT_TIMESTAMP' },
    updated: { type: 'timestamp', defaultValue: 'CURRENT_TIMESTAMP' },
  })

  return null;
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
