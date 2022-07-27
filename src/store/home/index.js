import Vue from 'vue'
import Vuex from 'vuex'
import { reqCategroyList, reqGetBannerlist, reqGetFloorlist } from '@/api/index.js'

// 需要在main入口文件中注册

Vue.use(Vuex)

// state 储存数据的仓库
const state = {
  categroyList: [],
  //因为服务器返回来的是个数组，所以这里设成数组,
  // 定义成数组还是对象看服务器返回的数据是什么
  bannerList: [],
  // floor的数据
  floorList: []
}
// mutations  修改state的唯一手段
const mutations = {
  CATEGROYLIST(state, categroyList) {
    state.categroyList = categroyList
  },
  // 轮播图的
  GETBANNERLIST(state, bannerList) {
    state.bannerList = bannerList
  },

  GETFLOORLIST(state, floorList) {
    state.floorList = floorList
  }
}
// action  处理action，可以书写自己的业务，写异步任务的地方
const actions = {
  // ⭐这里commit外边的括号可以理解为解构赋值，将context里的commit赋值给commit        commit:commit
  async categroyList({ commit }) {
    let result = await reqCategroyList()
    if (result.code == 200) {
      commit('CATEGROYLIST', result.data)
    }
  },
  // 获取轮播图数据
  async getBannerlist({ commit }) {
    let result = await reqGetBannerlist()
    // console.log(result)
    if (result.code == 200) {
      commit('GETBANNERLIST', result.data)
    }
  },
  //获取轮播图数据，这个请求不能在floor中发，要在home组件中发，因为要用v-for循环floor
  async getFloorlist({ commit }) {
    let result = await reqGetFloorlist()
    // console.log(result)
    if (result.code == 200) {
      commit('GETFLOORLIST', result.data)
    }
  }
}
// getters   理解为计算属性，方便获取数据
const getters = {}

//  ⭐⭐⭐⭐⭐⭐⭐⭐⭐外共享的不是vue实例，而是变量！！！！
export default {
  state,
  mutations,
  actions,
  getters
}
