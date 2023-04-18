const express = require('express');
const {
  addLife,
  modifyLife,
  removeLife,
  getOneLife,
  getLifeByPage,
} = require('../service/life.js');
const router = express.Router();

const { formatResponse } = require('../utils/tools.js');
// 添加动态
router.post('/', async function (req, res, next) {
  const result = await addLife(req.body);
  res.send(formatResponse(0, '', result));
});

// 删除动态
router.delete('/:id', async function (req, res, next) {
  await removeLife(req.params.id);
  res.send(formatResponse(0, '', true));
});

// 修改动态
router.put('/:id', async function (req, res, next) {
  const result = await modifyLife(req.params.id, req.body);
  res.send(formatResponse(0, '', result));
});

// 获取单个动态
router.get('/:id', async function (req, res, next) {
  const result = await getOneLife(req.params.id);
  res.send(formatResponse(0, '', result));
});

// 分页获取动态
router.get('/', async function (req, res, next) {
  const result = await getLifeByPage(req.query);
  res.send(formatResponse(0, '', result));
});

module.exports = router;
