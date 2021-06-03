'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Comments.hasMany(models.LikeComments)

      models.Comments.belongsTo(models.User, {
        through: models.Likes,
        foreignKey: 'userId',
        otherKey: 'messageId'
    }),
      models.Comments.belongsTo(models.Messages, {
        through: models.Likes,
        foreignKey: 'messageId',
        otherKey: 'userId'
      }),

      models.Comments.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      }),
  
      models.Comments.belongsTo(models.Messages, {
        foreignKey: 'messageId',
        as: 'message',
      });

      models.LikeComments.belongsTo(models.User, {
        through: models.LikeComments,
        foreignKey: 'userId',
        otherKey: 'messageId'
    }),
      models.LikeComments.belongsTo(models.Comments, {
        through: models.LikeComments,
        foreignKey: 'messageId',
        otherKey: 'userId'
      })

    }
  };
  Comments.init({
    messageId: DataTypes.INTEGER,
    content: DataTypes.STRING,
    attachment: DataTypes.STRING,
    movie: DataTypes.STRING,
    likes: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Comments',
  });
  return Comments;
};