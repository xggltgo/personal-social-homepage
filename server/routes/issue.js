const express = require('express');
const {
  addIssue,
  modifyIssue,
  removeIssue,
  getOneIssue,
  getIssueByPage,
} = require('../service/issue.js');
const router = express.Router();

const { formatResponse } = require('../utils/tools.js');
// 添加问答
router.post('/', async function (req, res, next) {
  const result = await addIssue(req.body);
  res.send(formatResponse(0, '', result));
});

// 删除问答
router.delete('/:id', async function (req, res, next) {
  await removeIssue(req.params.id);
  res.send(formatResponse(0, '', true));
});

// 修改问答
router.put('/:id', async function (req, res, next) {
  const result = await modifyIssue(req.params.id, req.body);
  res.send(formatResponse(0, '', result));
});

// 获取单个问答
router.get('/:id', async function (req, res, next) {
  const result = await getOneIssue(req.params.id);
  res.send(formatResponse(0, '', result));
});

// 分页获取问答
router.get('/', async function (req, res, next) {
  const result = await getIssueByPage(req.query);
  res.send(formatResponse(0, '', result));
});

module.exports = router;
