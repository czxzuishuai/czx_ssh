// 需要在main入口文件中注册
import Vue from 'vue'
import Vuex from 'vuex'

import home from './home'
import search from './search'
import detail from './detail'
import shopcart from './ShopCart'
import user from './user'
import trade from './trade'

Vue.use(Vuex)
//   向外共享的是Vuex的实例而不是vue的实例
export default new Vuex.Store({
  modules: {
    home,
    search,
    detail,
    shopcart,
    user,
    trade
  }
})
