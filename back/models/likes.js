'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Likes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Likes.belongsTo(models.User, {
        through: models.Like,
        foreignKey: 'userId',
        otherKey: 'messageId'
    }),
      models.Likes.belongsTo(models.Messages, {
        through: models.Likes,
        foreignKey: 'messageId',
        otherKey: 'userId'
      }),

      models.Likes.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      }),
  
      models.Likes.belongsTo(models.Messages, {
        foreignKey: 'messageId',
        as: 'message',
      });
    }
  };
  Likes.init({
    messageId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Message',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    isLike: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Likes',
  });
  return Likes;
};