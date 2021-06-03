'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LikeComments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.LikeComments.belongsTo(models.User, {
        through: models.LikeComments,
        foreignKey: 'userId',
        otherKey: 'commentId'
    }),
      models.LikeComments.belongsTo(models.LikeComments, {
        through: models.LikeComments,
        foreignKey: 'commentId',
        otherKey: 'userId'
      }),

      models.LikeComments.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      }),
  
      models.LikeComments.belongsTo(models.LikeComments, {
        foreignKey: 'commentId',
        as: 'comment',
      });
    }
  };
  LikeComments.init({
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
    modelName: 'LikeComments',
  });
  return LikeComments;
};