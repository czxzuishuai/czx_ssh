import Vue from 'vue'
import Vuex from 'vuex'
import { reqGetSearchlist } from '@/api'

// 需要在main入口文件中注册

Vue.use(Vuex)

// state 储存数据的仓库
const state = {
  searchList: {}
}
// mutations  修改state的唯一手段
const mutations = {
  GETSEARCHLIST(state, searchList) {
    state.searchList = searchList
  }
}
// action  处理action，可以书写自己的业务，写异步任务的地方
const actions = {
  async getSearchlist({ commit }, params) {
    //⭐params={}表示如果没有传入参数就是空对象
    let result = await reqGetSearchlist((params = {}))
    // console.log(result)
    if (result.code == 200) {
      commit('GETSEARCHLIST', result.data)
    }
  }
}
// getters   理解为计算属性，方便获取数据
//  化简数据
// getters里的函数中的参数里的默认参数是小仓库里的state，但是如果不开启命名空间，外面的组件在调用getters里的属性时，不会区分仓库
const getters = {
  goodsList() {
    //  ⭐这里的||[]的意思是： 假如没有网，这里的goodList将会是undefine，在组件遍历的时候会报错，加上这个之后没有网，他不会是undefine而是一个空数组，不会报错
    // 如果没有网，searchList将会是空，没有goodlist等属性
    return state.searchList.goodsList || []
  },
  attrsList() {
    return state.searchList.attrsList || []
  },
  trademarkList() {
    return state.searchList.trademarkList || []
  }
}

//   向外共享的是Vuex的实例而不是vue的实例
export default {
  state,
  mutations,
  actions,
  getters
}
