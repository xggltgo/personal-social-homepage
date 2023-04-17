const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { UploadError } = require('../utils/errors');
const { formatResponse } = require('../utils/tools');

// 配置存储引擎
const storage = multer.diskStorage({
  destination: function (req, file, cb) { //存储路径
    cb(null, path.resolve(__dirname, '../public/static/upload'));
  },
  filename: function (req, file, cb) { //存储文件名的格式
    const timeStamp = Date.now();
    const ramdomStr = Math.random().toString(36).substring(2, 8);
    const ext = path.extname(file.originalname);
    const filename = `${ramdomStr}-${timeStamp}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({
  storage,
  limits: { // 配置图片限制
    fileSize: 1024 * 1024,
  },
}).single('file');

router.post('/', async function (req, res, next) {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      next(new UploadError(`${err.message}, maxSize: 1 MB`));
    } else {
      const path = '/static/upload/' + req.file.filename;
      res.send(formatResponse(0, '', path));
    }
  });
});

module.exports = router;
