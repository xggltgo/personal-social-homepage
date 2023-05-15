var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var { expressjwt: jwt } = require('express-jwt');
require('express-async-errors');
var session = require('express-session');

const {
  ForbiddenError,
  ServiceError,
  UnknownError,
} = require('./utils/errors');

// 注入env配置
require('dotenv').config();
// 初始化数据库
require('./dao/init');

// 导入路由
var userRouter = require('./routes/user');
var captchaRouter = require('./routes/captcha');
var uploadRouter = require('./routes/upload');
var categoryRouter = require('./routes/category');
var essayRouter = require('./routes/essay');
var issueRouter = require('./routes/issue');
var lifeRouter = require('./routes/life');
var messageRouter = require('./routes/message');
var commentRouter = require('./routes/comment');
var likeRouter = require('./routes/like');

var app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// JWT认证中间件 (使用路由中间件前，优先验证token有效性)
app.use(
  jwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
  }).unless({
    path: [
      // 配置无需token验证的路径
      '/api/user/login',
      '/api/user/register',
      '/api/user/exist',
      { url: '/api/user', method: 'GET' },
      { url: /^\/api\/user\/detail\/\d+$/, method: 'GET' },
      '/res/captcha',
      '/api/category',
      { url: /^\/api\/essay\/\d+$/, method: 'GET' },
      { url: '/api/essay', method: 'GET' },
      { url: /^\/api\/issue\/\d+$/, method: 'GET' },
      { url: '/api/issue', method: 'GET' },
      { url: /^\/api\/life\/\d+$/, method: 'GET' },
      { url: '/api/life', method: 'GET' },
      { url: '/api/message', method: 'GET' },
      { url: '/api/comment', method: 'GET' },
      { url: '/api/like', method: 'GET' },
      { url: '/api/like/exist', method: 'GET' },
    ],
  })
);

// 使用路由中间件
app.use('/api/user', userRouter);
app.use('/res/captcha', captchaRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/category', categoryRouter);
app.use('/api/essay', essayRouter);
app.use('/api/issue', issueRouter);
app.use('/api/life', lifeRouter);
app.use('/api/message', messageRouter);
app.use('/api/comment', commentRouter);
app.use('/api/like', likeRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  console.log('err-name', err.name);
  console.log('err-message', err.message);

  if (err.name === 'UnauthorizedError') {
    // 说明是 token 验证错误，接下来我们来抛出我们自定义的错误
    res.send(new ForbiddenError('未登录，或者登录已经过期').toResponseJSON());
  } else if (err instanceof ServiceError) {
    // 其他错误对应的响应
    res.send(err.toResponseJSON());
  } else {
    // 响应未知错误
    res.send(new UnknownError().toResponseJSON());
  }
});

module.exports = app;
