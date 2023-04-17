const {
  createMessage,
  deleteMessage,
  updateMessage,
  selectOneMessage,
  selectMessageByPage,
} = require('../dao/sql/message');

// 添加留言
async function addMessage(messageInfo) {
  return await createMessage({
    ...messageInfo,
    images: JSON.stringify(messageInfo.images),
    createDate: Date.now(),
  });
}

// 删除留言
async function removeMessage(id) {
  return await deleteMessage(id);
}

// 修改留言
async function modifyMessage(id, messageInfo) {
  return await updateMessage(id, messageInfo);
}

// 获取单个留言
async function getOneMessage(id) {
  const result = await selectOneMessage(id);
  result.images = JSON.parse(result.images);
  return result;
}

// 分页获取留言
async function getMessageByPage(pageInfo) {
  const { count, rows } = await selectMessageByPage(pageInfo);
  return {
    total: count,
    messageList: rows,
  };
}

module.exports = {
  addMessage,
  removeMessage,
  modifyMessage,
  getOneMessage,
  getMessageByPage,
};
