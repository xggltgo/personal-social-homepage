const Category = require('../model/category');

/**
 * 添加一个分类到数据库
 * @param {Object} categoryInfo 分类信息
 */
async function createCategory(categoryInfo) {
  const result = await Category.create(categoryInfo);
  return result.toJSON();
}

/**
 * 从数据库删除一个分类
 * @param {Number} id 分类id
 */
async function deleteCategory(id) {
  const { count } = await selectOneCategory(id);
  await Category.destroy({
    where: {
      id,
    },
  });
  return count;
}
/**
 * 从数据库修改一个分类
 * @param {Number} id 分类id
 * @param {Object} categoryInfo 分类信息
 */
async function updateCategory(id, categoryInfo) {
  await Category.update(categoryInfo, {
    where: {
      id,
    },
  });
  return await selectOneCategory(id);
}

/**
 * 从数据库查询一个分类
 * @param {Number} id 分类id
 */
async function selectOneCategory(id) {
  const result = await Category.findByPk(id);
  return result.toJSON();
}

/**
 * 从数据库查询所有分类
 */
async function selectAllCategory() {
  const result = await Category.findAll({
    order: [['order']],
  });
  return JSON.parse(JSON.stringify(result));
}

/**
 * 用于新增或删除商品时，同步对应分类的count数量+1或-1
 * @param {Number} id 分类id
 * @param {Number} val 新增商品：1 删除商品：-1
 */
async function updateCategoryCount(id, val) {
  const { count } = await selectOneCategory(id);
  await updateCategory(id, { count: count + val });
}

module.exports = {
  createCategory,
  deleteCategory,
  updateCategory,
  selectOneCategory,
  selectAllCategory,
  updateCategoryCount,
};
