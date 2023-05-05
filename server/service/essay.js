const toc = require('markdown-toc');
const {
  createEssay,
  deleteEssay,
  updateEssay,
  selectOneEssay,
  selectEssayByPage,
} = require('../dao/sql/essay');
const { updateCategoryCount } = require('../dao/sql/category');
const { updateUserSelfEssayCount } = require('../dao/sql/user');
const { deleteCommentByEssayid } = require('../dao/sql/comment');
const { deleteLikeByEssayid } = require('../dao/sql/like');

// 添加文章
async function addEssay(essayInfo) {
  const { markdown, content: originContent, ...rest } = essayInfo;
  const catalogue = getCatalogue(markdown);
  const content = initAnchor(markdown, originContent);

  // 对应分类 count 数量+1
  await updateCategoryCount(essayInfo.categoryid, 1);
  // 对应用户 selfEssayCount 数量 +1
  await updateUserSelfEssayCount(essayInfo.userid, 1);
  return await createEssay({
    ...rest,
    catalogue,
    content,
    createDate: Date.now() + '',
  });
}

// 删除文章
async function removeEssay(id) {
  const {
    category,
    user: { id: userid },
  } = await selectOneEssay(id);

  // 更新分类下的文章数量
  if (category) {
    updateCategoryCount(category.id, -1);
  }
  // 更新用户对应的文章数量
  updateUserSelfEssayCount(userid, -1);
  // 属于该文章的评论和点赞一并删除
  deleteCommentByEssayid(id);
  deleteLikeByEssayid(id);
  return await deleteEssay(id);
}

// 修改文章
async function modifyEssay(id, essayInfo) {
  // 如果修改了文章的分类，则文章原分类count-1，文章新分类count+1
  const {
    category: { id: originCategoryid },
  } = await selectOneEssay(id);
  if (originCategoryid !== essayInfo.categoryid && originCategoryid) {
    await updateCategoryCount(originCategoryid, -1);
    await updateCategoryCount(essayInfo.categoryid, 1);
  }
  return await updateEssay(id, essayInfo);
}

// 获取单个文章
async function getOneEssay(id) {
  const result = await selectOneEssay(id);
  // 对应文章的浏览量 +1
  updateEssay(id, {
    scanCount: result.scanCount + 1,
  });
  result.catalogue = JSON.parse(result.catalogue);
  result.scanCount += 1;
  return result;
}

// 分页获取文章
async function getEssayByPage(pageInfo) {
  const { count, rows } = await selectEssayByPage(pageInfo);
  return {
    total: count,
    essayList: rows,
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
  addEssay,
  removeEssay,
  modifyEssay,
  getOneEssay,
  getEssayByPage,
};
