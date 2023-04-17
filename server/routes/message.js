const express = require('express');
const {
  addMessage,
  modifyMessage,
  removeMessage,
  getOneMessage,
  getMessageByPage,
} = require('../service/message.js');
const router = express.Router();

const { formatResponse } = require('../utils/tools.js');
// 添加留言
router.post('/', async function (req, res, next) {
  const result = await addMessage(req.body);
  res.send(formatResponse(0, '', result));
});

// 删除留言
router.delete('/:id', async function (req, res, next) {
  await removeMessage(req.params.id);
  res.send(formatResponse(0, '', true));
});

// 修改留言
router.put('/:id', async function (req, res, next) {
  const result = await modifyMessage(req.params.id, req.body);
  res.send(formatResponse(0, '', result));
});

// 获取单个留言
router.get('/:id', async function (req, res, next) {
  const result = await getOneMessage(req.params.id);
  res.send(formatResponse(0, '', result));
});

// 分页获取留言
router.get('/', async function (req, res, next) {
  const result = await getMessageByPage(req.query);
  res.send(formatResponse(0, '', result));
});

module.exports = router;
