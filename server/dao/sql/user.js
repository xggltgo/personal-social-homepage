const md5 = require('md5');
const User = require('../model/user');

/**
 * 向数据库添加一个用户
 * @param {Object} userInfo 用户信息
 */
async function insertUser(userInfo) {
  const user = await User.create({
    ...userInfo,
    loginPwd: md5(userInfo.loginPwd), // 密码进行md5加密
  });
  return user.toJSON();
}

/**
 * 通过账号密码查找用户
 * @param {Object} userInfo 用户信息
 * @returns
 */
async function loginDao({ loginId, loginPwd }) {
  const user = await User.findOne({
    where: {
      loginId,
      loginPwd: md5(loginPwd),
    },
  });
  if (user) {
    return user.toJSON();
  }
  return user;
}

/**
 * 根据账号查询用户信息
 * @param {String} loginId 账号
 * @returns
 */
async function selectUserByLoginId(loginId) {
  const user = await User.findOne({
    where: {
      loginId,
    },
    attributes: {
      exclude: ['loginPwd'],
    },
  });
  if (user) {
    return user.toJSON();
  }
  return user;
}

/**
 * 修改用户信息
 * @param {Object} newUserInfo 新的用户信息
 */
async function updateUser(id, newUserInfo) {
  const result = await User.update(newUserInfo, {
    where: {
      id,
    },
  });

  return result;
}

/**
 * 更新用户的 selfEssayCount
 * @param {Number} id 用户id
 * @param {Number} val 变化的量 +1 -1
 */
async function updateUserSelfEssayCount(id, val) {
  const { selfEssayCount } = await User.findByPk(id);
  const result = await User.update(
    {
      selfEssayCount: selfEssayCount + val,
    },
    {
      where: {
        id,
      },
    }
  );
  return result;
}
/**
 * 更新用户的 selfLifeCount
 * @param {Number} id 用户id
 * @param {Number} val 变化的量 +1 -1
 */
async function updateUserSelfLifeCount(id, val) {
  const { selfLifeCount } = await User.findByPk(id);
  const result = await User.update(
    {
      selfLifeCount: selfLifeCount + val,
    },
    {
      where: {
        id,
      },
    }
  );
  return result;
}

/**
 * 根据用户id查询对应用户信息
 * @param {Number} id 用户id
 */
async function selectUserById(id) {
  const result = await User.findByPk(id);
  if (result) {
    return result.toJSON();
  }
  return result;
}

module.exports = {
  insertUser,
  loginDao,
  updateUser,
  selectUserById,
  selectUserByLoginId,
  updateUserSelfEssayCount,
  updateUserSelfLifeCount,
};
