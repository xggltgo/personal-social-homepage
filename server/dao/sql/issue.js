const Issue = require('../model/issue');
const { Op } = require('sequelize');
const User = require('../model/user');
const { selectLifeIssueByUserid } = require('./like');

/**
 * 添加一个问答到数据库
 * @param {Object} issueInfo 问答信息
 */
async function createIssue(issueInfo) {
  const result = await Issue.create(issueInfo);
  return result.toJSON();
}

/**
 * 从数据库删除一个问答
 * @param {Number} id 问答id
 */
async function deleteIssue(id) {
  await Issue.destroy({
    where: {
      id,
    },
  });
}
/**
 * 从数据库修改一个问答
 * @param {Number} id 问答id
 * @param {Object} issueInfo 问答信息
 */
async function updateIssue(id, issueInfo) {
  await Issue.update(issueInfo, {
    where: {
      id,
    },
  });
  return await selectOneIssue(id);
}

/**
 * 从数据库查询一个问答
 * @param {Number} id 问答id
 */
async function selectOneIssue(id) {
  const result = await Issue.findByPk(id, {
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
  });
  if (result) {
    return result.toJSON();
  }
  return null;
}

/**
 * 从数据库查询所有问答
 */
async function selectIssueByPage({
  page = 1,
  limit = 20,
  // categoryid = -1,
  keyword = '',
  userid,
  liked,
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
    const result = await selectLifeIssueByUserid(userid);
    ids = result.map((item) => item.issueid);
    where.id = {
      [Op.in]: ids,
    };
  } else {
    if (+userid) {
      where.userid = +userid;
    }
  }
  const searchConfig = keyword ? { title: { [Op.like]: `%${keyword}%` } } : {};
  const result = await Issue.findAndCountAll({
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
 * 根据用户id获取其所有问答
 * @param {Number} userid 用户id
 */
async function selectIssueByUserid(userid) {
  const result = await Issue.findAll({
    where: {
      userid,
    },
    order: [['createDate', 'DESC']],
  });
  return JSON.parse(JSON.stringify(result));
}

/**
 * 更新问答对应的评论或浏览或点赞量
 * @param {Number} id 问答id
 * @param {String} countType count类型
 * @param {Number} n +1 或 -1
 */
async function updateIssueCount(id, countType, n = 1) {
  const { scanCount, commentCount, likeCount } = await Issue.findByPk(id);
  if (countType === 'scan') {
    await Issue.update(
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
    await Issue.update(
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
    await Issue.update(
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
  createIssue,
  deleteIssue,
  updateIssue,
  selectOneIssue,
  selectIssueByPage,
  selectIssueByUserid,
  updateIssueCount,
};
