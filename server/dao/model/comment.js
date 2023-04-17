const { DataTypes } = require('sequelize');
const sequelize = require('../dbConnect');

const Comment = sequelize.define(
  'comment',
  {
    // 评论内容
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    // 评论时间
    createDate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    // 这是其他模型参数
    createdAt: false,
    updatedAt: false,
    freezeTableName: true, // 配置生成的表名 不为默认的复数形式
  }
);

module.exports = Comment;
