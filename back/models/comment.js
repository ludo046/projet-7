'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Comment.hasMany(models.Like)

      models.Comment.belongsTo(models.User, {
        through: models.Like,
        foreignKey: 'userId',
        otherKey: 'messageId'
    }),
      models.Comment.belongsTo(models.Message, {
        through: models.Like,
        foreignKey: 'messageId',
        otherKey: 'userId'
      }),

      models.Comment.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      }),
  
      models.Comment.belongsTo(models.Message, {
        foreignKey: 'messageId',
        as: 'message',
      });
    }
  };
  Comment.init({
    messageId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    content: DataTypes.STRING,
    attachment: DataTypes.STRING,
    likes: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};