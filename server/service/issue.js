const toc = require('markdown-toc');
const {
  createIssue,
  deleteIssue,
  updateIssue,
  selectOneIssue,
  selectIssueByPage,
} = require('../dao/sql/issue');
const { updateUserSelfIssueCount } = require('../dao/sql/user');
const { deleteCommentByIssueid } = require('../dao/sql/comment');
const { deleteLikeByIssueid } = require('../dao/sql/like');

// 添加问答
async function addIssue(issueInfo) {
  const { markdown, content: originContent, ...rest } = issueInfo;
  // const catalogue = getCatalogue(markdown);
  const content = initAnchor(markdown, originContent);
  // 对应用户 selfEssayCount 数量 +1
  updateUserSelfIssueCount(issueInfo.userid, 1);
  return await createIssue({
    ...rest,
    content,
    createDate: Date.now() + '',
  });
}

// 删除问答
async function removeIssue(id) {
  const {
    user: { id: userid },
  } = await selectOneIssue(id);
  // 更新用户对应的文章数量
  updateUserSelfIssueCount(userid, -1);
  // 属于该文章的评论和点赞一并删除
  deleteCommentByIssueid(id);
  deleteLikeByIssueid(id);
  return await deleteIssue(id);
}

// 修改问答
async function modifyIssue(id, issueInfo) {
  return await updateIssue(id, issueInfo);
}

// 获取单个问答
async function getOneIssue(id) {
  const result = await selectOneIssue(id);
  updateIssue(id, {
    scanCount: result.scanCount + 1,
  });
  result.scanCount += 1;
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

function getCatalogue(markdown) {
  const initialToc = toc(markdown).json;
  // initialToc 格式：
  // content: 标题的文本内容
  // slug: 标题的锚点（用于跳转至目标位置）
  // lvl: 标题的级别（1 为最高级标题）
  // i: 标题在文档中的顺序（从 0 开始）
  // seen: 标题是否已经在目录中出现过（0 表示未出现，1 表示已出现）
  // [
  //   { content: 'AAA', slug: 'aaa', lvl: 1, i: 0, seen: 0 },
  //   { content: 'BBB', slug: 'bbb', lvl: 2, i: 1, seen: 0 },
  //   { content: 'CCC', slug: 'ccc', lvl: 3, i: 2, seen: 0 }
  // ]
  return toCatalogue(initialToc);

  // 转换为我们想要的格式
  function toCatalogue(initialToc) {
    let tree = [];
    let parentMap = new Map();
    let minLevel = 6;

    for (let item of initialToc) {
      let node = {
        name: item.content,
        anchor: item.slug,
        children: [],
      };
      parentMap.set(item.lvl, node);

      if (item.lvl < minLevel) {
        minLevel = item.lvl;
      }

      if (item.lvl === minLevel) {
        tree.push(node);
      } else {
        let parentLevel = item.lvl - 1;
        while (!parentMap.has(parentLevel)) {
          parentLevel--;
        }
        let parent = parentMap.get(parentLevel);
        parent.children.push(node);
      }
    }
    return JSON.stringify(tree);
  }
}

function initAnchor(markdown, content) {
  const initialToc = toc(markdown).json;
  for (const item of initialToc) {
    switch (item.lvl) {
      case 1: {
        const newStr = `<h1 id="${item.slug}">`;
        content = content.replace('<h1>', newStr);
        break;
      }
      case 2: {
        const newStr = `<h2 id="${item.slug}">`;
        content = content.replace('<h2>', newStr);
        break;
      }
      case 3: {
        const newStr = `<h3 id="${item.slug}">`;
        content = content.replace('<h3>', newStr);
        break;
      }
      case 4: {
        const newStr = `<h4 id="${item.slug}">`;
        content = content.replace('<h4>', newStr);
        break;
      }
      case 5: {
        const newStr = `<h5 id="${item.slug}">`;
        content = content.replace('<h5>', newStr);
        break;
      }
      case 6: {
        const newStr = `<h6 id="${item.slug}">`;
        content = content.replace('<h6>', newStr);
        break;
      }
    }
  }
  return content;
}

module.exports = {
  addIssue,
  removeIssue,
  modifyIssue,
  getOneIssue,
  getIssueByPage,
};
