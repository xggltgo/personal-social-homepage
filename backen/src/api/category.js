import request from './request';

export async function getAllCategories() {
  return await request.get('/api/category');
}

export async function addCategory(data) {
  return await request.post('/api/category', data);
}

export async function deleteCategory(id) {
  return await request.delete(`/api/category/${id}`);
}

export async function getCategory(id) {
  return await request.get(`/api/category/${id}`);
}

export async function updateCategory(id, data) {
  return await request.put(`/api/category/${id}`, data);
}
