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
  db.insert('settings', [ 'name', 'value' ], [ 'numberOfParkingSpots', '50' ])
  db.insert('settings', [ 'name', 'value' ], [ 'deadlineHour', '18:00' ])
  db.insert('settings', [ 'name', 'value' ], [ 'cancelHour', '07:00' ])
  db.insert('settings', [ 'name', 'value' ], [ 'daysForCalculation', '90' ])
  db.insert('settings', [ 'name', 'value' ], [ 'daysForRequests', '30' ])

  return null;
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
