import request from './request';

export async function getCommentByPage({
  page = 1,
  limit = 100,
  essayid = null,
}) {
  return await request.get('/api/comment', {
    params: {
      page,
      limit,
      essayid,
    },
  });
}

export async function addComment(data) {
  return await request.post('/api/comment', data);
}
