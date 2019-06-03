const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(
  config.database, config.username, config.password, config,
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.User = require('./user')(sequelize, Sequelize);
db.Room = require('./room')(sequelize, Sequelize);
db.Chat = require('./chat')(sequelize, Sequelize);

// db.Room.hasOne(db.Chat, {foreignKey: 'room_id', sourceKey: 'id'});
// db.Chat.belongsTo(db.Room, {foreignKey: 'room_id', targetKey: 'id'});


module.exports = db;
