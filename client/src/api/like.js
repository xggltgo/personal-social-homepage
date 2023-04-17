import request from './request';

export async function toggleLike(data) {
  return await request.post('/api/like', data);
}

export async function likeExist(data) {
  return await request.get('/api/like/exist', {
    params: {
      ...data,
    },
  });
}
