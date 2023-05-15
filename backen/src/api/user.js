import request from './request';

// 注册
export async function register(data) {
  return await request.post('/api/user/register', data);
}

// 登录
export async function login(data) {
  return await request.post('/api/user/login', { ...data, isAdmin: true });
}

// 恢复登录状态
export async function whoAmI() {
  return await request.get('/api/user/whoami');
}

// 更新用户信息
export async function updateUserInfo(id, data) {
  return await request.put(`/api/user/${id}`, data);
}

// 判断账号是否存在
export async function exist(loginId) {
  return await request.get('/api/user', {
    params: {
      loginId,
    },
  });
}

export async function getUserByPage({ page = 1, limit = 10, keyword }) {
  return await request.get('/api/user', {
    params: {
      page,
      limit,
      keyword,
    },
  });
}

// 根据用户id查询用户信息
export async function getUserInfoById(id) {
  return await request.get(`/api/user/detail/${id}`);
}
