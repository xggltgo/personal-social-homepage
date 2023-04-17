const express = require('express');
const {
  addEssay,
  modifyEssay,
  removeEssay,
  getOneEssay,
  getEssayByPage,
} = require('../service/essay.js');
const router = express.Router();

const { formatResponse } = require('../utils/tools.js');
// 添加文章
router.post('/', async function (req, res, next) {
  const result = await addEssay(req.body);
  res.send(formatResponse(0, '', result));
});

// 删除文章
router.delete('/:id', async function (req, res, next) {
  await removeEssay(req.params.id);
  res.send(formatResponse(0, '', true));
});

// 修改文章
router.put('/:id', async function (req, res, next) {
  const result = await modifyEssay(req.params.id, req.body);
  res.send(formatResponse(0, '', result));
});

// 获取单个文章
router.get('/:id', async function (req, res, next) {
  const result = await getOneEssay(req.params.id);
  res.send(formatResponse(0, '', result));
});

// 分页获取文章
router.get('/', async function (req, res, next) {
  const result = await getEssayByPage(req.query);
  res.send(formatResponse(0, '', result));
});

module.exports = router;
