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
  db.createTable('roles', {
    name: { type: 'string' },
    id: { type: 'int', primaryKey: true, autoIncrement: true },
  })

  // db.changeColumn('user', 'roles', );
  db.removeColumn('user', 'roles');
  db.addColumn('user', 'rolesId',
  {
    type: 'int',
    // unsigned: true,
    // length: 10,
    // notNull: true,
    foreignKey: {
      name: 'user_roles_id_fk',
      table: 'roles',
      rules: {
        onDelete: 'CASCADE',
        onUpdate: 'RESTRICT'
      },
      mapping: 'id'
    }}
  );
  return null;
};

exports.down = function(db) {
  db.dropTable('roles');
  db.removeColumn('user', 'rolesId');
  db.addColumn('user', 'roles', { type: 'string' })
  return null;
};


exports._meta = {
  "version": 1
};
