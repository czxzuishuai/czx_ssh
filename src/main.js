import Vue from 'vue'
import App from './App.vue'
import router from '@/router/index.js'

import store from '@/store'
import TypeNav from '@/components/TypeNav/typenav.vue'
import Carousel from '@/components/Carousel'
import Pagination from '@/components/Pagination'
import '@/mock/mockServer.js'
import 'swiper/css/swiper.css'
//统一引入api文件夹中的所有请求函数
import * as API from '@/api'
import { MessageBox } from 'element-ui'
//console.log(API)

//引入懒加载插件   需要用1.3.3版本
import VueLazyload from 'vue-lazyload'
//引入默认图片
// import lazy from '@/assets/1.png'
const loadimage = require('./assets/1.png')

//引入自定义组件
import myPlugins from '@/plugins/myPlugins'

//引入表单检验执行
import '@/plugins/validate.js'

//注册懒加载插件     他之所以能够挂载到组件中是因为有一个全局指令v-lazy
Vue.use(VueLazyload, {
  loading: loadimage //懒加载是默认的图片去，后边填路径
}),
  //注册自定义插件     ⭐传进去的参数是自定义插件中的第二个参数
  Vue.use(myPlugins, {
    name: 'upper'
  })

Vue.config.productionTip = false
Vue.component(TypeNav.name, TypeNav)
Vue.component(Carousel.name, Carousel)
Vue.component(Pagination.name, Pagination)
//第二种注册element-ui组件的方式
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert

new Vue({
  render: h => h(App),
  //引入全局事件总线
  beforeCreate() {
    //【⭐】Vue.prototype是所有vue组件的原型(就相当于是他的构造函数)
    //只有先安装了这个全局事件总线，才能够使用$on  $emit
    Vue.prototype.$bus = this
    //console.log(this)   这个this是一个vue对象
    // 这样以后在不用vuex发送请求之后，每个组件再发送请求就不用引入了
    Vue.prototype.$API = API
  },
  router,
  //注册
  store
}).$mount('#app')
