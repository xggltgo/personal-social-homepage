const {
  createCategory,
  deleteCategory,
  updateCategory,
  selectOneCategory,
  selectAllCategory,
} = require('../dao/sql/category');

// 添加分类
async function addCategory(categoryInfo) {
  return await createCategory(categoryInfo);
}

// 删除分类
async function removeCategory(id) {
  // 分类下的所有商品
  return await deleteCategory(id);
}

// 修改分类
async function modifyCategory(id, categoryInfo) {
  return await updateCategory(id, categoryInfo);
}

// 获取单个分类
async function getOneCategory(id) {
  return await selectOneCategory(id);
}

// 获取所有分类
async function getAllCategory() {
  return await selectAllCategory();
}

module.exports = {
  addCategory,
  removeCategory,
  modifyCategory,
  getOneCategory,
  getAllCategory,
};
