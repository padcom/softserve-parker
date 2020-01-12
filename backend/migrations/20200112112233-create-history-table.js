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
  db.createTable('history', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    date: { type: 'timestamp', notNull: true },
    state: { type: 'string', notNull: true, defaultValue: 'used' },
    userId: { type: 'int', notNull: true, foreignKey: {
      name: 'history_user_fk',
      table: 'user',
      mapping: 'id',
      rules: {
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
      },
    } },
  })

  return null;
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
