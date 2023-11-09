'use strict';

const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const Users_bcrypt = require('./users_bcrypt');
const Tourlist = require('./tourlist');
const Board = require('./board');

const db = {};
const sequelize = new Sequelize(
  config.database, config.username, config.password, config,
)

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.Users_bcrypt = Users_bcrypt;
db.Tourlist = Tourlist;
db.Board = Board;

Users_bcrypt.init(sequelize);
Tourlist.init(sequelize);
Board.init(sequelize);


Users_bcrypt.associate(db);
Tourlist.associate(db);
Board.associate(db);


module.exports = db;