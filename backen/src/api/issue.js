import request from './request';

export async function addIssue(data) {
  return await request.post('/api/issue', data);
}

export async function getIssueByPage({
  page = 1,
  limit = 10,
  userid,
  liked,
  keyword,
}) {
  return await request.get('/api/issue', {
    params: {
      page,
      limit,
      userid,
      liked,
      keyword,
    },
  });
}

export async function getIssue(id) {
  return await request.get(`/api/issue/${id}`);
}

export async function deleteIssue(id) {
  return await request.delete(`/api/issue/${id}`);
}

export async function upadteIssue(id, data) {
  return await request.put(`/api/issue/${id}`, data);
}
