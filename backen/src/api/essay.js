import request from './request';

export async function addEssay(data) {
  return await request.post('/api/essay', data);
}

export async function getEssayByPage({
  page = 1,
  limit = 10,
  categoryid = -1,
  userid,
  keyword,
  liked
}) {
  return await request.get('/api/essay', {
    params: {
      page,
      limit,
      categoryid,
      liked,
      userid,
      keyword
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
