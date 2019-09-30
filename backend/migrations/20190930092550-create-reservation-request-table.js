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
  db.createTable('reservationRequest', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    userId: { 
      type: 'int', 
      notNull: true,
      foreignKey: {
        name: 'userId',
        table: 'user',
        rules: {
          onDelete: 'CASCADE',
        }

      } 
    },
    status: { types: 'string', notNull: true },
    date: { type: 'date', notNull: true },
    parkingSpotId: { 
      types: 'int',
      foreignKey: {
        name: 'parkingSpotId',
        table: 'parkingspot',
        rules: {
          onDelete: 'CASCADE'
        }
      }
    }
  })
  return null;
};

exports.down = function(db) {
  db.dropTable('reservationRequest')
  return null;
};

exports._meta = {
  "version": 1
};
