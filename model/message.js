const sequelize = require('../database');
const { DataTypes, Model } = require('sequelize');

class Message extends Model {}

Message.init({
  author: {
    type: DataTypes.STRING,
    allowNull: false
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Message',
  tableName: 'Messages'
});

module.exports = Message;