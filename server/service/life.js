const {
  createLife,
  deleteLife,
  updateLife,
  selectOneLife,
  selectLifeByPage,
} = require('../dao/sql/life');

// 添加动态
async function addLife(lifeInfo) {
  return await createLife({
    ...lifeInfo,
    images: JSON.stringify(lifeInfo.images),
    createDate: Date.now(),
  });
}

// 删除动态
async function removeLife(id) {
  return await deleteLife(id);
}

// 修改动态
async function modifyLife(id, lifeInfo) {
  return await updateLife(id, lifeInfo);
}

// 获取单个动态
async function getOneLife(id) {
  const result = await selectOneLife(id);
  result.images = JSON.parse(result.images);
  return result;
}

// 分页获取动态
async function getLifeByPage(pageInfo) {
  const { count, rows } = await selectLifeByPage(pageInfo);
  return {
    total: count,
    lifeList: rows,
  };
}

module.exports = {
  addLife,
  removeLife,
  modifyLife,
  getOneLife,
  getLifeByPage,
};
