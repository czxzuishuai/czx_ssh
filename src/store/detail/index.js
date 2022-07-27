import Vue from 'vue'
import Vuex from 'vuex'
import { reqGoodsInfo, reqaddShopCart } from '@/api'
import { getUUID } from '@/utils/uuid_token.js'

Vue.use(Vuex)

const state = {
  goodinfo: {},
  uuid_token: getUUID()
}
const mutations = {
  GETGOODSINFO(state, goodinfo) {
    state.goodinfo = goodinfo
  }
}
const actions = {
  // 过去单个产品的详细信息
  async GetGoodsInfo({ commit }, skuid) {
    let result = await reqGoodsInfo(skuid)
    if (result.code == 200) {
      commit('GETGOODSINFO', result.data)
    }
  },
  //有asyns说明返回值是一个promise     在这里用解构赋值
  async addShopCart({ commit }, { skuId, skuNum }) {
    let result = await reqaddShopCart(skuId, skuNum)

    if (result.code == 200) {
      return 'ok'
    } else {
      //失败
      return Promise.reject(new Error('faile'))
    }
  }
}

//拆分goodinfo
const getters = {
  categoryView(state) {
    //  ||{}：在goodinfo没有数据时也不会报错
    return state.goodinfo.categoryView || {}
  },
  skuInfo(state) {
    return state.goodinfo.skuInfo || {}
  },
  spuSaleAttrList(state) {
    return state.goodinfo.spuSaleAttrList || []
  }
}
export default {
  state,
  mutations,
  actions,
  getters
}
