const {
  createComment,
  deleteComment,
  updateComment,
  selectOneComment,
  selectCommentByPage,
} = require('../dao/sql/comment');

const { updateEssay, updateEssayCount } = require('../dao/sql/essay');
const { updateIssueCount } = require('../dao/sql/issue');

// 添加评论
async function addComment(commentInfo) {
  // 更新对应文章或问答或动态的评论量
  const { essayid, issueid, lifeid } = commentInfo;
  if (essayid) {
    updateEssayCount(essayid, 'comment');
  } else if (issueid) {
    updateIssueCount(issueid, 'comment');
  }
  return await createComment({
    ...commentInfo,
    createDate: Date.now(),
  });
}

// 删除评论
async function removeComment(id) {
  return await deleteComment(id);
}

// 修改评论
async function modifyComment(id, commentInfo) {
  return await updateComment(id, commentInfo);
}

// 获取单个评论
async function getOneComment(id) {
  const result = await selectOneComment(id);
  result.images = JSON.parse(result.images);
  return result;
}

// 分页获取评论
async function getCommentByPage(pageInfo) {
  const { count, rows } = await selectCommentByPage(pageInfo);
  return {
    total: count,
    commentList: rows,
  };
}

module.exports = {
  addComment,
  removeComment,
  modifyComment,
  getOneComment,
  getCommentByPage,
};
