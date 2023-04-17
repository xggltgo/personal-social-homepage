const { DataTypes } = require('sequelize');
const sequelize = require('../dbConnect');

const Essay = sequelize.define(
  'essay',
  {
    // 文章标题
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // 文章描述
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // 文章内容
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    // 文章目录
    catalogue: {
      type: DataTypes.TEXT,
    },
    // 文章封面
    cover: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // 浏览量
    scanCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    // 评论量
    commentCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    // 收藏量
    // collectCount: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   defaultValue: 0,
    // },
    // 点赞量
    likeCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    // 文章发布时间
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

module.exports = Essay;
