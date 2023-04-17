// 建立数据库连接
const sequelize = require('./dbConnect');
const User = require('./model/user');
const Category = require('./model/category');
const Essay = require('./model/essay');
const Issue = require('./model/issue');
const Life = require('./model/life');
const Message = require('./model/message');
const Comment = require('./model/comment');
const Like = require('./model/like');
const { insertUser } = require('./sql/user');
(async () => {
  connect(); // 处理表间关系
  await sequelize.sync({ alter: true }); // 同步所有模型
  await init(); // 初始化数据库数据
  console.log('Database done...');
})();

// 初始化数据库数据
async function init() {
  // 初始化管理员数据
  const userCount = await User.count();
  if (userCount === 0) {
    // 数据库需要初始化数据
    await insertUser({
      nickname: '超级管理员',
      loginId: 'xgglt',
      loginPwd: '123456',
      isAdmin: true,
    });
    console.log('初始化管理员数据完毕...');
  }
}

// 处理表间关系
function connect() {
  // 文章类型与文章的 一对多关系
  Category.hasMany(Essay, {
    foreignKey: 'categoryid',
  });
  Essay.belongsTo(Category, {
    foreignKey: 'categoryid',
  });

  // 用户与文章的 一对多关系
  User.hasMany(Essay, {
    foreignKey: 'userid',
  });
  Essay.belongsTo(User, {
    foreignKey: 'userid',
  });

  // 用户与问答的 一对多关系
  User.hasMany(Issue, {
    foreignKey: 'userid',
  });
  Issue.belongsTo(User, {
    foreignKey: 'userid',
  });

  // 用户与动态的 一对多关系
  User.hasMany(Life, {
    foreignKey: 'userid',
  });
  Life.belongsTo(User, {
    foreignKey: 'userid',
  });

  // 用户与留言的 一对多关系
  User.hasMany(Message, {
    foreignKey: 'userid',
  });
  Message.belongsTo(User, {
    foreignKey: 'userid',
  });

  // 用户与评论的 一对多关系
  User.hasMany(Comment, {
    foreignKey: 'userid',
  });
  Comment.belongsTo(User, {
    foreignKey: 'userid',
  });

  // 文章与评论的 一对多关系
  Essay.hasMany(Comment, {
    foreignKey: 'essayid',
  });
  Comment.belongsTo(Essay, {
    foreignKey: 'essayid',
  });

  // 问答与评论的 一对多关系
  Issue.hasMany(Comment, {
    foreignKey: 'issueid',
  });
  Comment.belongsTo(Issue, {
    foreignKey: 'issueid',
  });

  // 动态与评论的 一对多关系
  Life.hasMany(Comment, {
    foreignKey: 'lifeid',
  });
  Comment.belongsTo(Life, {
    foreignKey: 'lifeid',
  });


  // 用户与点赞的 一对多关系
  User.hasMany(Like, {
    foreignKey: 'userid',
  });
  Like.belongsTo(User, {
    foreignKey: 'userid',
  });

  // 文章与点赞的 一对多关系
  Essay.hasMany(Like, {
    foreignKey: 'essayid',
  });
  Like.belongsTo(Essay, {
    foreignKey: 'essayid',
  });

  // 问答与点赞的 一对多关系
  Issue.hasMany(Like, {
    foreignKey: 'issueid',
  });
  Like.belongsTo(Issue, {
    foreignKey: 'issueid',
  });

  // 动态与点赞的 一对多关系
  Life.hasMany(Like, {
    foreignKey: 'lifeid',
  });
  Like.belongsTo(Life, {
    foreignKey: 'lifeid',
  });
}
