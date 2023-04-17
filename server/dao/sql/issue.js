const Issue = require('../model/issue');
const { Op } = require('sequelize');

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
  const result = await Issue.findByPk(id);
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
  categoryid = -1,
  keyword = '',
  status,
}) {
  const where = {};
  if (+categoryid !== -1) {
    where.categoryid = categoryid;
  }
  if (+status) {
    where.status = +status;
  }
  const searchConfig = keyword ? { name: { [Op.like]: `%${keyword}%` } } : {};
  const result = await Issue.findAndCountAll({
    where: {
      ...where,
      ...searchConfig,
    },
    offset: (+page - 1) * +limit,
    limit: +limit,
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

module.exports = {
  createIssue,
  deleteIssue,
  updateIssue,
  selectOneIssue,
  selectIssueByPage,
  selectIssueByUserid
};
