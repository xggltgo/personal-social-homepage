const {
  createLike,
  deleteLike,
  updateLike,
  selectOneLike,
  selectLikeByPage,
  selectLikeByUseridAndEssayid,
  selectLikeByUseridAndLifeid,
  selectLikeByUseridAndIssueid,
} = require('../dao/sql/like');

const { updateEssay, updateEssayCount } = require('../dao/sql/essay');
const { updateIssueCount } = require('../dao/sql/issue');

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
    // 点赞或取消点赞问答
    // 1.判断用户是否已经点赞过该问答
    const result = await selectLikeByUseridAndIssueid(userid, issueid);
    if (result) {
      // 取消点赞
      updateIssueCount(issueid, 'like', -1);
      await deleteLike(result.id);
      return null;
    } else {
      updateIssueCount(issueid, 'like');
    }
  } else if (lifeid) {
    // 点赞或取消点赞动态
    // 1.判断用户是否已经点赞过该动态
    const result = await selectLikeByUseridAndLifeid(userid, lifeid);
    if (result) {
      // 取消点赞
      // 从对应动态的likeUsers中移除用户
      deleteLike(result.id);
      return null;
    }
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
  } else if (issueid) {
    return await selectLikeByUseridAndIssueid(userid, issueid);
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
