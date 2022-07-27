import Home from '@/views/Home/Home.vue'
import Search from '@/views/Search'
import Login from '@/views/Login'
import Register from '@/views/Register'
import Detail from '@/views/Detail'
import AddCartSuccess from '@/views/AddCartSuccess'
import ShopCart from '@/views/ShopCart'
import Trade from '@/views/Trade'
import Pay from '@/views/Pay'
import PaySuccess from '@/views/PaySuccess'
import Center from '@/views/Center'
import myOrder from '@/views/Center/myOrder'
import groupOrder from '@/views/Center/groupOrder'

export default [
  { path: '*', redirect: '/home' },
  { path: '/home', component: Home, meta: { showFooter: true } },
  //  下面keyword后面的问号表示params参数可传可不传,⭐不写问好的话，不传params参数跳转url会出问题
  { path: '/search/:keyword?', name: 'search', component: Search, meta: { showFooter: true } },
  { path: '/login', component: Login, meta: { showFooter: false } },
  { path: '/register', component: Register, meta: { showFooter: false } },
  { path: '/detail/:skuid', component: Detail },
  { path: '/addcartsuccess', name: 'addcartsuccess', component: AddCartSuccess, meta: { showFooter: true } },
  { path: '/shopcart', name: 'shopcart', component: ShopCart, meta: { showFooter: true } },
  {
    path: '/trade',
    name: 'Trade',
    component: Trade,
    meta: { showFooter: true },
    beforeEnter: (to, from, next) => {
      //只有购物车页面才能跳到trade页面
      if (from.path.indexOf('/shopcart') != -1) {
        next()
      } else {
        next(false)
      }
    }
  },
  {
    path: '/pay',
    name: 'Pay',
    component: Pay,
    meta: { showFooter: true },
    beforeEnter: (to, from, next) => {
      //只让交易页面跳
      if (from.path.indexOf('/trade') != -1) {
        next()
      } else {
        next(false)
      }
    }
  },
  { path: '/paysuccess', namr: 'paysuccess', component: PaySuccess, meta: { showFooter: true } },
  {
    path: '/center',
    namr: 'center',
    component: Center,
    meta: { showFooter: true },
    children: [
      //子路由格式：要写/的话就要把父路由路径也写上，简写的话就不用写/了
      { path: 'myorder', component: myOrder, meta: { showFooter: true } },
      { path: 'grouporder', component: groupOrder, meta: { showFooter: true } },
      //路由重定向
      { path: '/center', redirect: '/center/myorder' }
    ]
  }
]
