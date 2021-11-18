import axios from '@/libs/api.request'

export const login = ({ username, password, code, sid }) => {
  const data = {
    username,
    password,
    code,
    sid
  }
  return axios.request({
    url: 'submitLogin',
    data,
    method: 'post'
  })
}

export const getUserInfo = (token) => {
  return axios.request({
    url: '/userInfo',
    headers: {
      Authorization: `Bearer ${token}`
    },
    method: 'get'
  })
}

export const getRoutes = (token) => {
  return axios.request({
    url: '/admin/get_routes',
    headers: {
      Authorization: `Bearer ${token}`
    },
    method: 'get'
  })
}
