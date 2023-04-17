const express = require('express');
const router = express.Router();

const { createCaptcha } = require('../service/captcha');

router.get('/', async function (req, res, next) {
  // 生成验证码，放入session，并返回svg给客户端
  const captcha = createCaptcha();
  req.session.captcha = captcha.text;
  res.setHeader("Content-Type","image/svg+xml");
  res.send(captcha.data);
});

module.exports = router;
