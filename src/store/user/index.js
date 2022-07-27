//存放用户数据的仓库
import { reqGetCode, reqLogout, reqUserInfo, reqUserLogin, reqUserRegister } from '@/api'
//import { reqUserRegister } from '@/api'
import { setToken, getToken, removeToken } from '@/utils/token'

const state = {
  cdoe: '',
  // token: localStorage.getItem('TOKEN'),
  token: getToken(),
  userinfo: {}
}
const mutations = {
  GETCODE(state, code) {
    state.code = code
  },

  USERLOGIN(state, token) {
    state.token = token
  },

  GETUSERINFO(state, userinfo) {
    state.userinfo = userinfo
  },

  //清除用户数据
  CLEAT(state) {
    state.token = ''
    state.userinfo = {}
    //清除本地储存的token的函数，在token.js中
    removeToken()
  }
}
const actions = {
  //获取验证码
  async getCode({ commit }, phone) {
    let result = await reqGetCode(phone)
    console.log(result)
    if (result.code == 200) {
      commit('GETCODE', result.data)
      return 'ok'
    } else {
      return Promise.reject(new Error('falie'))
    }
  },

  //用户注册
  //  【*⭐*】  actions中的函数有默认参数，如果你只写一个user为参数，那么这个user表示context,与参数顺序无关，只要参数名称对就行
  async userRegister({ commit }, user) {
    let result = await reqUserRegister(user)
    if (result.code == 200) {
      return 'ok'
    } else {
      return Promise.reject(new Error(result.message + '，请重新注册'))
    }
  },

  //登录业务
  async userLogin({ commit }, data) {
    let result = await reqUserLogin(data)
    //前台需要持久化储存这个token，之后每次请求都要带着这个token
    if (result.code == 200) {
      commit('USERLOGIN', result.data.token)
      setToken(result.data.token)
      return 'ok'
    } else {
      return Promise.reject(new Error(result.message + '，请重新登陆'))
    }
  },

  // 获取用户信息   在首页加载时派发
  async getUserInfo({ commit }) {
    let result = await reqUserInfo()
    if (result.code == 200) {
      //存用户信息
      commit('GETUSERINFO', result.data)
      return 'ok'
    } else {
      return Promise.reject(new Error('获取用户信息失败'))
    }
    /*  
       【注意】 如果写上这段代码的话，第一次未登录，code不等于200，会报错
    else {
      return Promise.reject(new Error(result.message))
    }
    */
  },

  //退出登录
  async userLogout({ commit }) {
    let result = await reqLogout()
    if (result.code == 200) {
      commit('CLEAT')
      return 'ok'
    } else {
      return Promise.reject(new Error(result.message + ',退出登录失败'))
    }
  }
}
const getters = {}

export default {
  state,
  mutations,
  actions,
  getters
}
