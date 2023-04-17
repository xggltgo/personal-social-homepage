const Essay = require('../model/essay');
const Category = require('../model/category');
const User = require('../model/user');
const { Op } = require('sequelize');

/**
 * 添加一篇文章到数据库
 * @param {Object} essayInfo 文章信息
 */
async function createEssay(essayInfo) {
  const result = await Essay.create(essayInfo);
  return result.toJSON();
}

/**
 * 从数据库删除一篇文章
 * @param {Number} id 文章id
 */
async function deleteEssay(id) {
  await Essay.destroy({
    where: {
      id,
    },
  });
}
/**
 * 从数据库修改一篇文章
 * @param {Number} id 文章id
 * @param {Object} essayInfo 文章信息
 */
async function updateEssay(id, essayInfo) {
  await Essay.update(essayInfo, {
    where: {
      id,
    },
  });
  return await selectOneEssay(id);
}

/**
 * 从数据库查询一篇文章
 * @param {Number} id 文章id
 */
async function selectOneEssay(id) {
  const result = await Essay.findByPk(id, {
    // 联表查询
    include: [
      {
        model: Category,
        as: 'category',
      },
      {
        model: User,
        as: 'user',
      },
    ],
    attributes: {
      // 不需要的字段
      exclude: ['categoryid'],
    },
  });
  if (result) {
    return result.toJSON();
  }
  return null;
}

/**
 * 从数据库查询所有文章
 */
async function selectEssayByPage({
  page = 1,
  limit = 20,
  categoryid = -1,
  userid,
  keyword = '',
}) {
  const where = {};
  if (userid) {
    where.userid = userid;
  }
  if (+categoryid !== -1) {
    where.categoryid = categoryid;
  }
  const searchConfig = keyword ? { name: { [Op.like]: `%${keyword}%` } } : {};
  const result = await Essay.findAndCountAll({
    where: {
      ...where,
      ...searchConfig,
    },
    offset: (+page - 1) * +limit,
    limit: +limit,
    attributes: {
      exclude: ['content', 'catalogue', 'categoryid', 'userid'],
    },
    include: [
      {
        model: Category,
        as: 'category',
      },
      {
        model: User,
        as: 'user',
      },
    ],
  });

  return JSON.parse(JSON.stringify(result));
}

/**
 * 根据用户id获取其所有文章
 * @param {Number} userid 用户id
 */
async function selectEssayByUserid(userid) {
  const result = await Essay.findAll({
    where: {
      userid,
    },
    include: {
      model: Category,
      as: 'category',
    },
    attributes: {
      // 不需要的字段
      exclude: ['categoryid'],
    },
    order: [['createDate', 'DESC']],
  });
  return JSON.parse(JSON.stringify(result));
}

/**
 * 更新文章对应的评论或浏览或点赞量
 * @param {Number} id 文章id
 * @param {String} countType count类型
 * @param {Number} n +1 或 -1
 */
async function updateEssayCount(id, countType, n = 1) {
  const { scanCount, commentCount, likeCount } = await Essay.findByPk(id);
  if (countType === 'scan') {
    await Essay.update(
      {
        scanCount: scanCount + n,
      },
      {
        where: {
          id,
        },
      }
    );
  } else if (countType === 'comment') {
    await Essay.update(
      {
        commentCount: commentCount + n,
      },
      {
        where: {
          id,
        },
      }
    );
  } else if (countType === 'like') {
    await Essay.update(
      {
        likeCount: likeCount + n,
      },
      {
        where: {
          id,
        },
      }
    );
  }
}

module.exports = {
  createEssay,
  deleteEssay,
  updateEssay,
  updateEssayCount,
  selectOneEssay,
  selectEssayByPage,
  selectEssayByUserid,
};
