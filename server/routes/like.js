const express = require('express');
const {
  addLike,
  modifyLike,
  removeLike,
  getOneLike,
  getLikeByPage,
} = require('../service/like.js');
const router = express.Router();

const { formatResponse } = require('../utils/tools.js');
// 添加赞
router.post('/', async function (req, res, next) {
  const result = await addLike(req.body);
  res.send(formatResponse(0, '', result));
});

// // 删除赞
// router.delete('/:id', async function (req, res, next) {
//   await removeLike(req.params.id);
//   res.send(formatResponse(0, '', true));
// });

// // 修改赞
// router.put('/:id', async function (req, res, next) {
//   const result = await modifyLike(req.params.id, req.body);
//   res.send(formatResponse(0, '', result));
// });

// 根据userid和essayid[issueid,likeid]获取单个赞
router.get('/exist', async function (req, res, next) {
  const result = await getOneLike(req.query);
  res.send(formatResponse(0, '', result));
});

// 分页获取赞
router.get('/', async function (req, res, next) {
  const result = await getLikeByPage(req.query);
  res.send(formatResponse(0, '', result));
});

module.exports = router;
