import request from './request';

export async function getAllCategories() {
  return await request.get('/api/category');
}
