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
  db.addColumn('user', 'firstName', { type: 'string', notNull: true })
  db.addColumn('user', 'lastName', { type: 'string', notNull: true })
  db.addColumn('user', 'plate', { type: 'string', notNull: true })
  db.addColumn('user', 'phone', { type: 'int' })
  return null;
};

exports.down = function(db) {
  db.removeColumn('user', 'firstName')
  db.removeColumn('user', 'lastName')
  db.removeColumn('user', 'plate')
  db.removeColumn('user', 'phone')
  return null;
};

exports._meta = {
  "version": 1
};
