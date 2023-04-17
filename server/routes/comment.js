const express = require('express');
const {
  addComment,
  modifyComment,
  removeComment,
  getOneComment,
  getCommentByPage,
} = require('../service/comment.js');
const router = express.Router();

const { formatResponse } = require('../utils/tools.js');
// 添加评论
router.post('/', async function (req, res, next) {
  const result = await addComment(req.body);
  res.send(formatResponse(0, '', result));
});

// 删除评论
router.delete('/:id', async function (req, res, next) {
  await removeComment(req.params.id);
  res.send(formatResponse(0, '', true));
});

// 修改评论
router.put('/:id', async function (req, res, next) {
  const result = await modifyComment(req.params.id, req.body);
  res.send(formatResponse(0, '', result));
});

// 获取单个评论
router.get('/:id', async function (req, res, next) {
  const result = await getOneComment(req.params.id);
  res.send(formatResponse(0, '', result));
});

// 分页获取评论
router.get('/', async function (req, res, next) {
  const result = await getCommentByPage(req.query);
  res.send(formatResponse(0, '', result));
});

module.exports = router;
