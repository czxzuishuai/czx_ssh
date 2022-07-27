import requests from './request.js'

// 导入mock请求
import mockajax from './mockAjax'

//关键字return和大括号省略了
export const reqCategroyList = () => requests({ url: '/product/getBaseCategoryList', method: 'get' })
//请求方式变了
export const reqGetBannerlist = () => mockajax.get('/banner')
//  请求floor层级数据,存放在home组件的仓库中
export const reqGetFloorlist = () => mockajax.get('/floor')
//请求search中的数据
//参数为search组件中的searchParams
//要用这个接口至少要穿第一个空对象，不能啥也不传，所以要写一个参数
export const reqGetSearchlist = params =>
  requests({
    method: 'post',
    url: '/list',
    //data是携带的参数
    data: params
  })

export const reqGoodsInfo = skuid =>
  requests({
    //不用专门在写一栏参数了，放到url中就行了
    url: `/item/${skuid}`,
    method: 'get'
  })

//点击加入购物车时发送的请求
//   /api/cart/addToCart/{ skuId }/{ skuNum }
export const reqaddShopCart = (skuId, skuNum) =>
  requests({
    url: `/cart/addToCart/${skuId}/${skuNum}`,
    method: 'post'
  })

//购物车的请求     箭头函数的大括号也可以省略
export const reqCartList = () =>
  requests({
    url: '/cart/cartList',
    method: 'get'
  })

//删除商品的接口
export const reqDeleteCartById = skuId =>
  requests({
    url: `/cart/deleteCart/${skuId}`,
    method: 'delete'
  })

//修改商品状态
export const reqUpdateCheckedById = (skuId, isChecked) =>
  requests({
    url: `/cart/checkCart/${skuId}/${isChecked}`,
    method: 'get'
  })

//获取验证码
export const reqGetCode = phone =>
  requests({
    url: `/user/passport/sendCode/${phone}`,
    method: 'get'
  })

//完成注册时发送的请求
export const reqUserRegister = data =>
  requests({
    url: '/user/passport/register',
    data: {
      phone: data.phone,
      code: data.code,
      password: data.password
    },
    method: 'post'
  })

//登录api
export const reqUserLogin = data =>
  requests({
    url: '/user/passport/login',
    data,
    method: 'post'
  })

//获取用户信息的接口  /api/user/passport/auth/getUserInfo
export const reqUserInfo = () => requests({ url: '/user/passport/auth/getUserInfo', method: 'get' })

//退出登录
export const reqLogout = () => requests({ url: '/user/passport/logout', method: 'get' })

//获取用户地址信息(trade页面)
export const reqAddressInfo = () => requests({ url: '/order/auth/trade', method: 'get' })

//提交订单的请求
export const reqSubmitOrder = (tradeNo, data) =>
  requests({
    url: `/order/auth/submitOrder?tradeNo=${tradeNo}`,
    method: 'post',
    data
  })

//支付页面获取支付信息请求
export const reqPayInfo = orderId => requests({ url: `/payment/weixin/createNative/${orderId}`, method: 'get' })

//获取订单支付状态
export const reqPayState = orderId => requests({ url: `/payment/weixin/queryPayStatus/${orderId}`, method: 'get' })

//获取我的订单的数据
export const reqMyOrder = (page, limit) => requests({ url: `/order/auth/${page}/${limit}`, method: 'get' })
