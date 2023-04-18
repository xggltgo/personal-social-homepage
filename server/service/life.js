const { selectCommentByPage } = require('../dao/sql/comment');
const {
  createLife,
  deleteLife,
  updateLife,
  selectOneLife,
  selectLifeByPage,
} = require('../dao/sql/life');
const { selectLikeByPage } = require('../dao/sql/like');
const { updateUserSelfLifeCount } = require('../dao/sql/user');

// 添加动态
async function addLife(lifeInfo) {
  // 对应用户 selfLifeCount 数量 +1
  updateUserSelfLifeCount(lifeInfo.userid, 1);
  return await createLife({
    ...lifeInfo,
    images: JSON.stringify(lifeInfo.images),
    createDate: Date.now() + '',
  });
}

// 删除动态
async function removeLife(id) {
  const { userid } = await selectOneLife(id);
  // 更新用户对应的动态数量
  updateUserSelfLifeCount(userid, -1);
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
  let lifeList = rows
    .map((item) => {
      item.images = JSON.parse(item.images);
      return item;
    })
    .map(async (item) => {
      // 获取动态对应的所有评论
      const { rows } = await selectCommentByPage({
        page: 1,
        limit: 1000,
        lifeid: item.id,
      });
      item.lifeComment = rows;
      const result = await selectLikeByPage({
        page: 1,
        limit: 1000,
        lifeid: item.id,
      });
      item.lifeLike = result.rows;
      return item;
    });

  lifeList = await Promise.all(lifeList);

  return {
    total: count,
    lifeList,
  };
}

module.exports = {
  addLife,
  removeLife,
  modifyLife,
  getOneLife,
  getLifeByPage,
};
