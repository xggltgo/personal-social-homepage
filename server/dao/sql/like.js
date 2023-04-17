const Like = require('../model/like');
const User = require('../model/user');
const { Op } = require('sequelize');

/**
 * 添加一个赞到数据库
 * @param {Object} likeInfo 赞信息
 */
async function createLike(likeInfo) {
  const result = await Like.create(likeInfo);
  return result.toJSON();
}

/**
 * 从数据库删除一个赞
 * @param {Number} id 赞id
 */
async function deleteLike(id) {
  await Like.destroy({
    where: {
      id,
    },
  });
}

/**
 * 根据essayid从数据库批量删除赞
 * @param {Number} essayid
 */
async function deleteLikeByEssayid(essayid) {
  await Like.destroy({
    where: {
      essayid,
    },
  });
}


/**
 * 从数据库修改一个赞
 * @param {Number} id 赞id
 * @param {Object} likeInfo 赞信息
 */
async function updateLike(id, likeInfo) {
  await Like.update(likeInfo, {
    where: {
      id,
    },
  });
  return await selectOneLike(id);
}

/**
 * 从数据库查询一个赞
 * @param {Number} id 赞id
 */
async function selectOneLike(id) {
  const result = await Like.findByPk(id);
  if (result) {
    return result.toJSON();
  }
  return null;
}

async function selectLikeByUseridAndEssayid(userid, essayid) {
  const result = await Like.findOne({
    where: {
      userid,
      essayid,
    },
  });
  if (result) {
    return result.toJSON();
  }
  return null;
}

/**
 * 从数据库查询所有赞
 */
async function selectLikeByPage({
  page = 1,
  limit = 20,
  essayid,
  keyword = '',
  status,
}) {
  const where = {};
  if (+essayid) {
    where.essayid = essayid;
  }
  if (+status) {
    where.status = +status;
  }
  const searchConfig = keyword ? { name: { [Op.like]: `%${keyword}%` } } : {};
  const result = await Like.findAndCountAll({
    where: {
      ...where,
      ...searchConfig,
    },
    offset: (+page - 1) * +limit,
    limit: +limit,
    include: {
      model: User,
      as: 'user',
    },
    attributes: {
      // 不需要的字段
      exclude: ['userid'],
    },
  });

  return JSON.parse(JSON.stringify(result));
}

module.exports = {
  createLike,
  deleteLike,
  updateLike,
  selectOneLike,
  selectLikeByPage,
  selectLikeByUseridAndEssayid,
  deleteLikeByEssayid
};
