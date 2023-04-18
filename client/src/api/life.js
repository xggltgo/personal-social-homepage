import request from './request';

export async function addLife(data) {
  return await request.post('/api/life', data);
}

export async function getLifeByPage({
  page = 1,
  limit = 10,
  userid,
}) {
  return await request.get('/api/life', {
    params: {
      page,
      limit,
      userid,
      
    },
  });
}

export async function getEssay(id) {
  return await request.get(`/api/essay/${id}`);
}

export async function deleteEssay(id) {
  return await request.delete(`/api/essay/${id}`);
}

export async function upadteEssay(id, data) {
  return await request.put(`/api/essay/${id}`, data);
}
