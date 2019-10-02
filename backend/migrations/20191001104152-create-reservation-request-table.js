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
        name: 'reservation_request_user_id_fk',
        table: 'user',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      }
    },
    status: { type: 'string', notNull: true },
    date: { type: 'datetime', notNull: true },
    parkingSpotId: { 
      type: 'int',
      foreignKey: {
        name: 'reservation_request_parking_spot_id_fk',
        table: 'parkingspot',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
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

