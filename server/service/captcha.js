const svgCaptcha = require('svg-captcha');
function createCaptcha() {
  return svgCaptcha.create({
    size: 6,
    ignoreChars: '0o1i',
    color: true,
    noise: 6,
  });
}

module.exports = {
  createCaptcha,
};
