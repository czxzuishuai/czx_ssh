import Vue from 'vue'
import Vuex from 'vuex'
import { reqCartList } from '@/api'
import { reqDeleteCartById } from '@/api'
import { reqUpdateCheckedById } from '@/api'
//封装游客身份模块

//注册
Vue.use(Vuex)

const state = {
  cartlist: []
}
const mutations = {
  GETCARTLIST(state, cartlist) {
    state.cartlist = cartlist
  }
}
const actions = {
  //获取购物车列表
  async getCartList({ commit }) {
    let result = await reqCartList()
    // console.log(result)
    if (result.code == 200) {
      commit('GETCARTLIST', result.data)
    }
  },
  // 删除商品
  async deleteCartById({ commit }, skuId) {
    let result = await reqDeleteCartById(skuId)
    if (result.code == 200) {
      //成功返回ok
      return 'ok'
    } else {
      return Promise.reject(new Error('faile'))
    }
  },

  //修改状态   ⭐🚩注意这里参数的解构赋值   dispatch传递多个参数要用对象形式
  async updateCheckedById({ commit }, { skuId, isChecked }) {
    let result = await reqUpdateCheckedById(skuId, isChecked)
    if (result.code == 200) {
      //成功返回ok
      return 'ok'
    } else {
      return Promise.reject(new Error('faile'))
    }
  },

  //删除所选中的商品    这里context也可以和上面的commit一样进行解构赋值
  deleteAllCheckedCart(context) {
    let PromiseAll = []
    context.state.cartlist[0].cartInfoList.forEach(item => {
      let promise = item.isChecked == 1 ? context.dispatch('deleteCartById', item.skuId) : ''
      PromiseAll.push(promise)
    })
    return Promise.all(PromiseAll)
  },

  //修改全选按钮的状态   进行解构赋值    这里的isChecked是布尔型，要将它转为0、1
  updateAllCartChecked({ getters, dispatch }, Checked) {
    let checked = Checked ? 1 : 0
    let PromiseAll = []
    state.cartlist[0].cartInfoList.forEach(item => {
      let promise = dispatch('updateCheckedById', { skuId: item.skuId, isChecked: checked })
      PromiseAll.push(promise)
    })
    return Promise.all(PromiseAll)
  }
}

const getters = {
  cartlist(state) {
    return state.cartlist[0] || {}
  }
  //【注意：这里的cartInfoList在vue组件中有计算属性了，这里就不用了，如果加上下面的代码会报错，因为cartlist是[]的话，[0]就不存在会报错】
  // cartInfoList(state) {
  //   return state.cartlist[0].cartInfoList || []
  // }
}

export default {
  state,
  mutations,
  actions,
  getters
}
