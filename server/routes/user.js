const express = require('express');
const router = express.Router();

const {
  register,
  login,
  update,
  getUserByLoginId,
  getUserAllInfoById,
  getUserByPage,
} = require('../service/user');
const { formatResponse, verifyToken } = require('../utils/tools');
const { ValidationError } = require('../utils/errors');

// 注册
router.post('/register', async function (req, res, next) {
  // 向数据库添加一条数据并返回
  const user = await register(req.body);
  res.send(formatResponse(0, '', user));
});

// 登录
router.post('/login', async function (req, res, next) {
  // 用户认证流程
  const result = await login(req.body);
  if (result) {
    // 登录成功
    res.setHeader('Authorization', result.token);
    res.send(formatResponse(0, '', result.user));
  } else {
    // 账号密码错误处理
    throw new ValidationError('账号或密码错误');
  }
});

// 判断账号是否存在
router.get('/exist', async function (req, res, next) {
  const result = await getUserByLoginId(req.query.loginId);
  res.send(formatResponse(0, '', !!result));
});

// 获取单个用户信息及其文章、问答、动态
router.get('/detail/:id', async function (req, res, next) {
  const result = await getUserAllInfoById(req.params.id);
  res.send(formatResponse(0, '', result));
});

// 恢复登录状态
router.get('/whoami', async function (req, res, next) {
  // 解析token，并将解析后的结果返回给客户端
  const { loginId } = verifyToken(req.get('authorization'));
  const result = await getUserByLoginId(loginId);
  res.send(formatResponse(0, '', result));
});

// 修改用户信息
router.put('/:id', async function (req, res, next) {
  const result = await update(req.params.id, req.body);
  res.send(formatResponse(0, '', result));
});

// 分页获取用户信息
router.get('/', async function (req, res, next) {
  const result = await getUserByPage(req.query);
  res.send(formatResponse(0, '', result));
});

module.exports = router;
