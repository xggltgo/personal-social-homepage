const { DataTypes } = require('sequelize');
const sequelize = require('../dbConnect');

const Life = sequelize.define(
  'life',
  {
    // 动态内容
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    // 图片数组
    images: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    // 点赞量
    likeCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    // 动态发布时间
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

module.exports = Life;
