const Life = require('../model/life');
const { Op } = require('sequelize');
const User = require('../model/user');
const { selectLifeLikesByUserid } = require('./like');

/**
 * 添加一个动态到数据库
 * @param {Object} lifeInfo 动态信息
 */
async function createLife(lifeInfo) {
  const result = await Life.create(lifeInfo);
  return result.toJSON();
}

/**
 * 从数据库删除一个动态
 * @param {Number} id 动态id
 */
async function deleteLife(id) {
  await Life.destroy({
    where: {
      id,
    },
  });
}
/**
 * 从数据库修改一个动态
 * @param {Number} id 动态id
 * @param {Object} lifeInfo 动态信息
 */
async function updateLife(id, lifeInfo) {
  await Life.update(lifeInfo, {
    where: {
      id,
    },
  });
  return await selectOneLife(id);
}

/**
 * 从数据库查询一个动态
 * @param {Number} id 动态id
 */
async function selectOneLife(id) {
  const result = await Life.findByPk(id);
  if (result) {
    return result.toJSON();
  }
  return null;
}

/**
 * 从数据库查询所有动态
 */
async function selectLifeByPage({
  page = 1,
  limit = 20,
  // categoryid = -1,
  liked = false,
  userid,
  keyword = '',
  // status,
}) {
  let ids;
  const where = {};
  // if (+categoryid !== -1) {
  //   where.categoryid = categoryid;
  // }
  // if (+status) {
  //   where.status = +status;
  // }
  if (liked === 'true') {
    // 获取当前用户点赞过的lifeid
    const result = await selectLifeLikesByUserid(userid);
    ids = result.map((item) => item.lifeid);
    where.id = {
      [Op.in]: ids,
    };
  } else {
    if (+userid) {
      where.userid = +userid;
    }
  }
  const searchConfig = keyword
    ? { content: { [Op.like]: `%${keyword}%` } }
    : {};
  const result = await Life.findAndCountAll({
    where: {
      ...where,
      ...searchConfig,
    },
    offset: (+page - 1) * +limit,
    limit: +limit,
    include: [
      {
        model: User,
        as: 'user',
      },
    ],
    attributes: {
      // 不需要的字段
      exclude: ['userid'],
    },
    order: [
      ['createDate', 'DESC'], // 按照 createDate 字段降序排序
    ],
  });
  return JSON.parse(JSON.stringify(result));
}

/**
 * 根据一个id数组，查询对应的动态
 * @param {Array} ids id数组
 */
async function selectLifeByIds(ids) {
  const result = await Life.findAll({
    where: {
      id: {
        [Op.in]: ids,
      },
    },
  });
  return JSON.parse(JSON.stringify(result));
}

/**
 * 根据用户id获取其所有动态
 * @param {Number} userid 用户id
 */
async function selectLifeByUserid(userid) {
  const result = await Life.findAll({
    where: {
      userid,
    },
    order: [['createDate', 'DESC']],
  });
  return JSON.parse(JSON.stringify(result));
}

/**
 * 更新动态对应的点赞用户数组
 * @param {Number} lifeid lifeid
 * @param {Number} userid userid
 */
async function updateLikeUsers(lifeid, userid) {
  let { likeUsers } = await Life.findByPk(lifeid);
  likeUsers = JSON.parse(likeUsers);
  if (likeUsers.includes(userid)) {
    likeUsers = likeUsers.filter((item) => item !== userid);
  } else {
    likeUsers.push(userid);
  }
  await Life.update(
    {
      likeUsers: JSON.stringify(likeUsers),
    },
    {
      where: {
        id: lifeid,
      },
    }
  );
}

module.exports = {
  createLife,
  deleteLife,
  updateLife,
  selectOneLife,
  selectLifeByPage,
  selectLifeByUserid,
  updateLikeUsers,
};
