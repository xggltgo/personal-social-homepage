const {
  createLike,
  deleteLike,
  updateLike,
  selectOneLike,
  selectLikeByPage,
  selectLikeByUseridAndEssayid,
} = require('../dao/sql/like');

const { updateEssay, updateEssayCount } = require('../dao/sql/essay');

// 添加赞
async function addLike(likeInfo) {
  // 更新对应文章或问答或动态的赞量
  const { essayid, issueid, lifeid, userid } = likeInfo;
  if (essayid) {
    // 点赞或取消点赞文章
    // 1.判断用户是否已经点赞过该文章
    const result = await selectLikeByUseridAndEssayid(userid, essayid);
    if (result) {
      // 取消点赞
      updateEssayCount(essayid, 'like', -1);
      await deleteLike(result.id);
      return null;
    } else {
      updateEssayCount(essayid, 'like');
    }
  } else if (issueid) {
  } else if (lifeid) {
  }
  return await createLike({
    ...likeInfo,
    createDate: Date.now(),
  });
}

// 删除赞
async function removeLike(id) {
  return await deleteLike(id);
}

// 修改赞
async function modifyLike(id, likeInfo) {
  return await updateLike(id, likeInfo);
}

// 获取单个赞
async function getOneLike(likeInfo) {
  const { essayid, issueid, lifeid, userid } = likeInfo;
  if (essayid) {
    return await selectLikeByUseridAndEssayid(userid, essayid);
  }
}

// 分页获取赞
async function getLikeByPage(pageInfo) {
  const { count, rows } = await selectLikeByPage(pageInfo);
  return {
    total: count,
    likeList: rows,
  };
}

module.exports = {
  addLike,
  removeLike,
  modifyLike,
  getOneLike,
  getLikeByPage,
};
