import axios from '@/libs/api.request'
import qs from 'qs'

export function getSvg (sid) {
  return axios.request({
    url: '/svgcap',
    params: {
      sid
    },
    method: 'get'
  })
}

export function getLists (page, limit) {
  return axios.get('/get_lists', {
    params: {
      page,
      limit
    }
  })
}

export function updatePost (data) {
  return axios.post('/content/update_post', data)
}

export function getUserList (params) {
  console.log(' %c 🐱‍🏍 qs.stringify(params): ', 'font-size:20px;background-color: #42b983;color:#fff;', '/user/user_list?' + qs.stringify(params))
  return axios.get('/user/user_list?' + qs.stringify(params))
}

export function addUser (data) {
  return axios.post('admin/add_user', data)
}

export function deleteUser (data) {
  return axios.post('admin/delete_user', data)
}
/**
 * 菜单增删改查
 * */
export function getMenu () {
  return axios.get('admin/get_menu')
}

export function addMenu (data) {
  return axios.post('admin/add_menu', data)
}

export function updateMenu (data) {
  return axios.post('admin/update_menu', data)
}

export function deleteMenu (data) {
  return axios.post('admin/delete_menu', data)
}

export  function getRoles () {
  return axios.get('admin/get_roles')
}

export function addRole (data) {
  return axios.post('admin/add_role', data)
}

export function updateRole (data) {
  return axios.post('admin/update_role', data)
}

export function deleteRole (data) {
  return axios.post('admin/delete_role', data)
}

export function getRolesTitle () {
  return axios.get('admin/get_roles_title')
}

// export const getRouterReq = (access) => {
//   return axios.request({
//     url: 'get_router',
//     params: {
//       access
//     },
//     method: 'get'
//   })
// }
