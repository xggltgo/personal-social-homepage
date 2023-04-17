const Message = require('../model/message');
const User = require('../model/user');
const { Op } = require('sequelize');

/**
 * 添加一条留言到数据库
 * @param {Object} messageInfo 留言信息
 */
async function createMessage(messageInfo) {
  const result = await Message.create(messageInfo);
  return result.toJSON();
}

/**
 * 从数据库删除一条留言
 * @param {Number} id 留言id
 */
async function deleteMessage(id) {
  await Message.destroy({
    where: {
      id,
    },
  });
}
/**
 * 从数据库修改一条留言
 * @param {Number} id 留言id
 * @param {Object} messageInfo 留言信息
 */
async function updateMessage(id, messageInfo) {
  await Message.update(messageInfo, {
    where: {
      id,
    },
  });
  return await selectOneMessage(id);
}

/**
 * 从数据库查询一条留言
 * @param {Number} id 留言id
 */
async function selectOneMessage(id) {
  const result = await Message.findByPk(id);
  if (result) {
    return result.toJSON();
  }
  return null;
}

/**
 * 从数据库查询所有留言
 */
async function selectMessageByPage({
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
  const result = await Message.findAndCountAll({
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
  createMessage,
  deleteMessage,
  updateMessage,
  selectOneMessage,
  selectMessageByPage,
};
