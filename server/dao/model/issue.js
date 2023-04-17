const { DataTypes } = require('sequelize');
const sequelize = require('../dbConnect');

const Issue = sequelize.define(
  'issue',
  {
    // 问答标题
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // 问答内容
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    // -1:审核未通过 0：审核中 1：审核通过
    status:{
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
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
    // 问答发布时间
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

module.exports = Issue;
