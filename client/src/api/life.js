import request from './request';

export async function addLife(data) {
  return await request.post('/api/life', data);
}

export async function getLifeByPage({
  page = 1,
  limit = 10,
  userid,
  liked,
  keyword,
}) {
  return await request.get('/api/life', {
    params: {
      page,
      limit,
      userid,
      liked,
      keyword,
    },
  });
}

export async function getLife(id) {
  return await request.get(`/api/life/${id}`);
}
export async function deleteLife(id) {
  return await request.delete(`/api/life/${id}`);
}

export async function upadteLife(id, data) {
  return await request.put(`/api/life/${id}`, data);
}
