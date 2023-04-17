const { DataTypes } = require('sequelize');
const sequelize = require('../dbConnect');

const User = sequelize.define(
  'user',
  {
    // 昵称
    nickname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // 账号
    loginId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // 密码
    loginPwd: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // 头像
    avatar: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '/static/avatar/default.png',
    },
    // 积分
    integral: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    // 文章数量
    selfEssayCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    // 问答数量
    selfIssueCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    // 动态数量
    selfLifeCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    // qq二维码图片
    qq: {
      type: DataTypes.STRING,
    },
    // 微信二维码图片
    wechat: {
      type: DataTypes.STRING,
    },
    // github地址
    github: {
      type: DataTypes.STRING,
    },
    // 自我介绍
    selfIntroduction: {
      type: DataTypes.STRING,
    },
    // 职业
    profession: {
      type: DataTypes.STRING,
    },
    // 注册（加入）时间
    registerDate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // 是否官方发布 0:普通用户 1:管理员
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    // 这是其他模型参数
    createdAt: false,
    updatedAt: false,
    freezeTableName: true, // 配置生成的表名 不为默认的复数形式
  }
);

module.exports = User;
