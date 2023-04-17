const Comment = require('../model/comment');
const User = require('../model/user');
const { Op } = require('sequelize');

/**
 * 添加一条评论到数据库
 * @param {Object} commentInfo 评论信息
 */
async function createComment(commentInfo) {
  const result = await Comment.create(commentInfo);
  return result.toJSON();
}

/**
 * 从数据库删除一条评论
 * @param {Number} id 评论id
 */
async function deleteComment(id) {
  await Comment.destroy({
    where: {
      id,
    },
  });
}

/**
 * 根据essayid从数据库批量删除评论
 * @param {Number} essayid
 */
async function deleteCommentByEssayid(essayid) {
  await Comment.destroy({
    where: {
      essayid,
    },
  });
}

/**
 * 从数据库修改一条评论
 * @param {Number} id 评论id
 * @param {Object} commentInfo 评论信息
 */
async function updateComment(id, commentInfo) {
  await Comment.update(commentInfo, {
    where: {
      id,
    },
  });
  return await selectOneComment(id);
}

/**
 * 从数据库查询一条评论
 * @param {Number} id 评论id
 */
async function selectOneComment(id) {
  const result = await Comment.findByPk(id);
  if (result) {
    return result.toJSON();
  }
  return null;
}

/**
 * 从数据库查询所有评论
 */
async function selectCommentByPage({
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
  const result = await Comment.findAndCountAll({
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
  createComment,
  deleteComment,
  updateComment,
  selectOneComment,
  selectCommentByPage,
  deleteCommentByEssayid
};
