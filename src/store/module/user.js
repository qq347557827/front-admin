import {
  login,
  getUserInfo, getRoutes
  // logout,
  // getMessage,
  // getContentByMsgId,
  // hasRead,
  // removeReaded,
  // restoreTrash,
  // getUnreadCount
} from '@/api/user'
import app from './app'

import { setToken, getToken, getRouteComs, getMenuByRouter, setTagNavListInLocalstorage } from '@/libs/util'
import router from '@/router'
import community from '@/router/community'
import { forEach } from '@/libs/tools'
import routers from '@/router/routers'

export default {
  state: {
    userName: '',
    userId: '',
    avatarImgPath: '',
    token: getToken(),
    access: '',
    hasGetInfo: false,
    unreadCount: 0,
    messageUnreadList: [],
    messageReadedList: [],
    messageTrashList: [],
    messageContentStore: {}
  },
  mutations: {
    setAvatar (state, avatarPath) {
      state.avatarImgPath = avatarPath
    },
    setUserId (state, id) {
      state.userId = id
    },
    setUserName (state, name) {
      state.userName = name
    },
    setAccess (state, access) {
      state.access = access
    },
    setToken (state, token) {
      state.token = token
      setToken(token)
    },
    setHasGetInfo (state, status) {
      state.hasGetInfo = status
    },
    setRoutes (state, status) {
      state.routes = getRouteComs(status)
      // state.routes = status
      router.addRoutes(state.routes)

      // router.addRoutes(community)
      // router.replace(router.currentRoute.value.fullPath)
      // app.state.tagNavList = getMenuByRouter(router, state.access)
      // state.routes.forEach(item => {
      //   router.addRoute(item.name, item)
      // })
      // router.replace(router.currentRoute.value.fullPath)
      console.log(' %c ๐ฑโ๐user.js-> state.routes: ', 'font-size:20px;background-color: #42b983;color:#fff;', state.routes)
    },
    setMessageCount (state, count) {
      state.unreadCount = count
    },
    setMessageUnreadList (state, list) {
      state.messageUnreadList = list
    },
    setMessageReadedList (state, list) {
      state.messageReadedList = list
    },
    setMessageTrashList (state, list) {
      state.messageTrashList = list
    },
    updateMessageContentStore (state, {
      msg_id,
      content
    }) {
      state.messageContentStore[msg_id] = content
    },
    moveMsg (state, {
      from,
      to,
      msg_id
    }) {
      const index = state[from].findIndex(_ => _.msg_id === msg_id)
      const msgItem = state[from].splice(index, 1)[0]
      msgItem.loading = false
      state[to].unshift(msgItem)
    }
  },
  getters: {
    messageUnreadCount: state => state.messageUnreadList.length,
    messageReadedCount: state => state.messageReadedList.length,
    messageTrashCount: state => state.messageTrashList.length
  },
  actions: {
    // ็ปๅฝ
    handleLogin ({ commit }, {
      userName,
      password,
      code,
      sid
    }) {
      const username = userName.trim()
      return new Promise((resolve, reject) => {
        login({
          username,
          password,
          code,
          sid
        }).then(res => {
          if (res.data.code === 200) {
            const data = res.data
            console.log('data: ', data)
            commit('setToken', data.token)
            commit('setAvatar', data.data.pic)
            commit('setUserName', data.data.name)
            commit('setUserId', data.data._id)
            commit('setRoutes', data.routes)
            commit('setAccess', data.data.roles)
            commit('setHasGetInfo', true)
          }
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // ้ๅบ็ปๅฝ
    handleLogOut ({
      state,
      commit
    }) {
      return new Promise((resolve, reject) => {
        commit('setToken', '') //  ๅฐๆฌๅฐไฟๅญ็tokenไธบ็ฉบ
        commit('setAccess', []) // ๅฐๆฌๅฐ็ๆ้ๅ่กจไธบ็ฉบ
        setTagNavListInLocalstorage([])
        resolve()
        // ๅฆๆไฝ?็้ๅบ็ปๅฝๆ?้่ฏทๆฑๆฅๅฃ๏ผๅๅฏไปฅ็ดๆฅไฝฟ็จไธ้ขไธ่กไปฃ็?่ๆ?้ไฝฟ็จlogout่ฐ็จๆฅๅฃ
        // commit('setToken', '')
        // commit('setAccess', [])
        // resolve()
      })
    },
    // ่ทๅ็จๆท็ธๅณไฟกๆฏ
    getUserInfo ({
      state,
      commit
    }) {
      return new Promise((resolve, reject) => {
        try {
          getUserInfo(state.token).then(res => {
            const data = res.data
            console.log('getUserInfodata: ', data)
            commit('setRoutes', data.routes)
            commit('setAvatar', data.data.pic)
            commit('setUserName', data.data.name)
            commit('setUserId', data.data._id)
            commit('setAccess', data.data.roles)
            commit('setHasGetInfo', true)
            resolve(data)
          }).catch(err => {
            reject(err)
          })
          // getRoutes(state.token).then(res => {
          //   const data = res.data.data
          //   console.log(' %c ๐ฑโ๐ data: ', 'font-size:20px;background-color: #42b983;color:#fff;', data)
          //   commit('setRoutes', data)
          // }).catch(err => {
          //   reject(err)
          // })
        } catch (error) {
          reject(error)
        }
      })
    }
  }
}
