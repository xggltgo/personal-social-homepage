const Like = require('../model/like');
const User = require('../model/user');
const Essay = require('../model/essay');
const Issue = require('../model/issue');
const Life = require('../model/life');
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
 * 根据issueid从数据库批量删除赞
 * @param {Number} issueid
 */
async function deleteLikeByIssueid(issueid) {
  await Like.destroy({
    where: {
      issueid,
    },
  });
}
/**
 * 根据lifeid从数据库批量删除赞
 * @param {Number} lifeid
 */
async function deleteLikeByLifeid(lifeid) {
  await Like.destroy({
    where: {
      lifeid,
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

async function selectLikeByUseridAndIssueid(userid, issueid) {
  const result = await Like.findOne({
    where: {
      userid,
      issueid,
    },
  });
  if (result) {
    return result.toJSON();
  }
  return null;
}

async function selectLikeByUseridAndLifeid(userid, lifeid) {
  const result = await Like.findOne({
    where: {
      userid,
      lifeid,
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
  limit = 10000,
  essayid,
  issueid,
  lifeid,
  userid,
  keyword = '',
}) {
  const where = {};
  if (+essayid) {
    where.essayid = essayid;
  }
  if (+issueid) {
    where.issueid = issueid;
  }
  if (+lifeid) {
    where.lifeid = lifeid;
  }
  if (+userid) {
    where.userid = userid;
  }
  const searchConfig = keyword ? { name: { [Op.like]: `%${keyword}%` } } : {};
  const result = await Like.findAndCountAll({
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
      {
        model: Essay,
        as: 'essay',
      },
      {
        model: Issue,
        as: 'issue',
      },
      {
        model: Life,
        as: 'life',
      },
    ],
    attributes: {
      // 不需要的字段
      exclude: ['userid'],
    },
  });

  return JSON.parse(JSON.stringify(result));
}

/**
 * 根据用户id查询该用户点赞的所有动态
 * @param {Number} userid 用户id
 */
async function selectLifeLikesByUserid(userid) {
  const result = await Like.findAll({
    where: {
      userid,
      lifeid: {
        [Op.not]: null,
      },
    },
  });

  return JSON.parse(JSON.stringify(result));
}

/**
 * 根据用户id查询该用户点赞的所有文章
 * @param {Number} userid 用户id
 */
async function selectLifeEssayByUserid(userid) {
  const result = await Like.findAll({
    where: {
      userid,
      essayid: {
        [Op.not]: null,
      },
    },
  });

  return JSON.parse(JSON.stringify(result));
}

/**
 * 根据用户id查询该用户点赞的所有问答
 * @param {Number} userid 用户id
 */
async function selectLifeIssueByUserid(userid) {
  const result = await Like.findAll({
    where: {
      userid,
      issueid: {
        [Op.not]: null,
      },
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
  selectLikeByUseridAndLifeid,
  selectLikeByUseridAndIssueid,
  selectLifeIssueByUserid,
  selectLifeEssayByUserid,
  selectLifeLikesByUserid,
  deleteLikeByEssayid,
  deleteLikeByLifeid,
  deleteLikeByIssueid,
};
