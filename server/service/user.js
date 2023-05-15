const jwt = require('jsonwebtoken');
const {
  insertUser,
  loginDao,
  updateUser,
  selectUserByLoginId,
  selectUserById,
  selectUserByPage
} = require('../dao/sql/user');
const { selectEssayByUserid } = require('../dao/sql/essay');
const { selectIssueByUserid } = require('../dao/sql/issue');
const { selectLifeByUserid } = require('../dao/sql/life');

/**
 * 处理用户注册相关逻辑
 * @param {Object} userInfo 用户信息
 */
async function register(userInfo) {
  const user = await insertUser({
    ...userInfo,
    registerDate: Date.now() + '',
  });
  const { loginPwd, ...rest } = user;
  return rest;
}

/**
 * 处理用户登录相关逻辑
 * @param {Object} userInfo 用户信息
 */
async function login(userInfo) {
  // token的过期时间 默认为1天
  const maxAge = userInfo.remember ? userInfo.remember * 3600 * 24 : 3600 * 24;
  // 查询用户是否存在
  const user = await loginDao(userInfo);
  if (user) {
    const payload = {
      id: user.id,
      nickname: user.nickname,
      loginId: user.loginId,
      avatar: user.avatar,
      isAdmin: user.isAdmin,
      integral: user.integral,
      selfEssayCount: user.selfEssayCount,
      selfIssueCount: user.selfIssueCount,
      selfLifeCount: user.selfLifeCount,
    };
    // 生成 token
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: maxAge,
    });
    return {
      user: payload,
      token,
    };
  }
  return user;
}

/**
 * 更新用户相关信息
 * @param {Number} id 用户id
 * @param {Object} newUserInfo 新的用户信息
 */
async function update(id, newUserInfo) {
  await updateUser(id,newUserInfo);
  const result = await selectUserById(id);
  if (result) {
    const _result = result;
    delete _result.loginPwd;
    return _result;
  }
  return result;
}

async function getUserByLoginId(loginId) {
  return await selectUserByLoginId(loginId);
}

async function getUserAllInfoById(userid) {
  // 获取用户信息
  const userInfo = await selectUserById(userid);
  const rest = {
    ...userInfo,
  };
  delete rest.loginPwd;
  // 获取用户对应的文章信息
  const essayList = await selectEssayByUserid(userid);
  const issueList = await selectIssueByUserid(userid);
  const lifeList = await selectLifeByUserid(userid);
  return {
    userInfo: rest,
    essayList,
    issueList,
    lifeList,
  };
}

// 分页获取用户信息
async function getUserByPage(pageInfo) {
  const { count, rows } = await selectUserByPage(pageInfo);
  return {
    total: count,
    userList: rows,
  };
}

module.exports = {
  register,
  login,
  update,
  getUserByLoginId,
  getUserAllInfoById,
  getUserByPage
};
