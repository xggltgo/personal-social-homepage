const { DataTypes } = require('sequelize');
const sequelize = require('../dbConnect');

const Category = sequelize.define(
  'category',
  {
    // 分类名称
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // 分类下的文章数量
    count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    // 类别排序
    order: {
      type: DataTypes.INTEGER,
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

module.exports = Category;
