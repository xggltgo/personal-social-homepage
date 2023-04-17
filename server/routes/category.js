const express = require('express');
const router = express.Router();
const {
  addCategory,
  removeCategory,
  modifyCategory,
  getOneCategory,
  getAllCategory,
} = require('../service/category');
const { formatResponse } = require('../utils/tools.js');
// 添加分类
router.post('/', async function (req, res, next) {
  const result = await addCategory(req.body);
  res.send(formatResponse(0, '', result));
});

// 删除分类
router.delete('/:id', async function (req, res, next) {
  const result = await removeCategory(req.params.id);
  res.send(formatResponse(0, '', result));
});

// 修改分类
router.put('/:id', async function (req, res, next) {
  const result = await modifyCategory(req.params.id, req.body);
  res.send(formatResponse(0, '', result));
});

// 获取单个分类
router.get('/:id', async function (req, res, next) {
  const result = await getOneCategory(req.params.id);
  res.send(formatResponse(0, '', result));
});

// 获取所有分类
router.get('/', async function (req, res, next) {
  const result = await getAllCategory();
  res.send(formatResponse(0, '', result));
});

module.exports = router;
