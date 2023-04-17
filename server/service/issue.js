const {
  createIssue,
  deleteIssue,
  updateIssue,
  selectOneIssue,
  selectIssueByPage,
} = require('../dao/sql/issue');

// 添加问答
async function addIssue(issueInfo) {
  return await createIssue({
    ...issueInfo,
    createDate: Date.now(),
  });
}

// 删除问答
async function removeIssue(id) {
  return await deleteIssue(id);
}

// 修改问答
async function modifyIssue(id, issueInfo) {
  return await updateIssue(id, issueInfo);
}

// 获取单个问答
async function getOneIssue(id) {
  const result = await selectOneIssue(id);
  return result;
}

// 分页获取问答
async function getIssueByPage(pageInfo) {
  const { count, rows } = await selectIssueByPage(pageInfo);
  return {
    total: count,
    issueList: rows,
  };
}



module.exports = {
  addIssue,
  removeIssue,
  modifyIssue,
  getOneIssue,
  getIssueByPage,
};
