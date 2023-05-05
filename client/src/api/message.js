import request from './request';

export async function getAllMessages() {
  return await request.get('/api/message', {
    page: 1,
    limit: 1000,
  });
}



export async function addMessage(data) {
  return await request.post('/api/message',data);
}
