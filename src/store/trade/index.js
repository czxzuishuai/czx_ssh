import { reqAddressInfo } from '@/api'

const state = {
  tradeInfo: {}
}

const mutations = {
  GETUSERADDRESS(state, tradeInfo) {
    state.tradeInfo = tradeInfo
  }
}

const actions = {
  //获取用户地址信息
  async getUserAddress({ commit }) {
    let result = await reqAddressInfo()
    if (result.code == 200) {
      commit('GETUSERADDRESS', result.data)
    }
  }
}

const getters = {
  userAddressList() {
    return state.tradeInfo.userAddressList || []
  },
  detailArrayList() {
    return state.tradeInfo.detailArrayList || []
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
