const jwt = require('jsonwebtoken');

/**
 * 规范响应格式
 * @param {Number} code 响应码
 * @param {String} msg 错误消息
 * @param {Object} data 数据
 * @returns
 */
function formatResponse(code, msg, data) {
  return {
    code,
    msg,
    data,
  };
}

/**
 * 解析JWT字符串
 * @param {String} token JWT字符串
 */
function verifyToken(token) {
  return jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
}

module.exports = {
  formatResponse,
  verifyToken,
};
