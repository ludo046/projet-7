'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LikeComment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.LikeComment.belongsTo(models.User, {
        through: models.LikeComment,
        foreignKey: 'userId',
        otherKey: 'commentId'
    }),
      models.LikeComment.belongsTo(models.LikeComment, {
        through: models.LikeComment,
        foreignKey: 'commentId',
        otherKey: 'userId'
      }),

      models.LikeComment.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      }),
  
      models.LikeComment.belongsTo(models.LikeComment, {
        foreignKey: 'commentId',
        as: 'comment',
      });
    }
  };
  LikeComment.init({
    commentId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'comment',
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
    modelName: 'LikeComment',
  });
  return LikeComment;
};