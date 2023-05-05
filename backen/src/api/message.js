import request from './request';

export async function getMessageByPage({ page = 1, limit = 10 }) {
  return await request.get('/api/message', {
    params: {
      page,
      limit,
    },
  });
}

export async function deleteMessage(id) {
  return await request.delete(`/api/message/${id}`);
}

export async function addMessage(data) {
  return await request.post('/api/message', data);
}
