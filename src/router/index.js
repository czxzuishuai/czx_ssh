import Vue from 'vue'
import router from 'vue-router'
import routes from '@/router/routes.js'
import store from '@/store'

Vue.use(router)

//⭐⭐⭐
//在搜索框中空白搜索会报错，原因：
//push函数返回一个promise，这个函数需要成功或失败的回调函数来捕获错误，所以我们给他传入回调，下面的改写就会让他无论在什么时候都有回调函数
//重写push函数：(大文档中的2.6.5)
//   1、现将push方法备份，因为后面要用到：(push不加括号)
let orignpush = router.prototype.push
let orignreplace = router.prototype.replace
//   2、改写push,  首先考虑传递的参数，laction表示地址，然后还有两个回调
;(router.prototype.push = function (laction, resolve, reject) {
  //要进行判断，看是否有错误
  if (resolve && reject) {
    //  复习一下apply和call的区别
    //  这里要改变orignpush里的this指向，因为他在这里指向的是window，要把它指向调用它的那个路由组件的$route
    //  后边两个是回调函数
    orignpush.call(this, laction, resolve, reject)
    // 回调函数不全有
  } else {
    orignpush.call(
      this,
      laction,
      () => {},
      () => {}
    )
  }
}),
  (router.prototype.replace = function (laction, resolve, reject) {
    if (resolve && reject) {
      orignreplace.call(this, laction, resolve, reject)
    } else {
      orignreplace.call(
        this,
        laction,
        () => {},
        () => {}
      )
    }
  })

let vueRouter = new router({
  //将路由规则放到一个新的js文件中，好整理
  // 属性名属性值相同，简写
  routes,
  //切换路由是让新路由在顶部
  scrollBehavior(to, from, savedPosition) {
    // 始终滚动到顶部
    //⭐  这里是y而不是top
    return { y: 0 }
  }
})

//全局前置守卫----在路由跳转前判断能不能跳
vueRouter.beforeEach(async (to, from, next) => {
  /*
    to：可以获取到你的目标路由的信息
    from：获取到源路由的信息
    next:放行函数     next(path)---放行到指定路由 
  */

  //有token表示登陆了   ⭐引入store
  let token = store.state.user.token
  //声明以下这个变量是为了判断是否有用户信息，因为userinfo是对象，不管他是否为空，返回的布尔值都是true，所以用userinfo.name来判断
  let name = store.state.user.userinfo.name
  //   实现登录后不能跳转到登录页面
  if (token) {
    if (to.path == '/login') {
      //登录之后不让再去登录页
      next('/home')
    } else {
      // 登录了但是去的不是login
      if (name) {
        // 如果用户信息还在
        next()
      } else {
        //如果用户信息不在了，再次派发action   先把home中的派发删掉，这样第一次进主页就不会出现报错了
        try {
          // 🚩找最近的函数写async
          await store.dispatch('getUserInfo')
          // 获取用户信息后放行
          next()
        } catch (error) {
          //  token失效-----清空数据，让用户重新登录， 之前写了个userLogout的action,表示清除数据，可以派发这个
          await store.dispatch('userLogout')
          next('/login')
        }
      }
    }
  } else {
    //未登录时  不能去交易相关的页面 pay paysuccess center trade
    // 不去这些地方放行   to.path可以知道去哪
    let topath = to.path
    if (topath.indexOf('/center') != -1 || topath.indexOf('/pay') != -1 || topath.indexOf('/paysuccess') != -1 || topath.indexOf('/trade') != -1) {
      next('/login?redirect=' + topath)
      //现在还有一个问题就是如果我在没登录的时候点了我的订单，之后跳到了登录页面，我登录成功后还是跳到首页而不是我的订单页面
      /*
        解决方法：
          在放行时添加redirect参数，之后在登录页面路由跳转的时候进行判断，如果有redirect参数，则跳转至另一个路由中
          这个参数中的信息是  未登录时想去而没有去成的路由
      */
    } else {
      next()
    }
  }
})

export default vueRouter
