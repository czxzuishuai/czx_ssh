// 因为main.js中的东西太多了，所以在main文件中只需要引入执行就可以，在main.js中只需要引入一次就可以了
import Vue from 'vue'
import VeeValidate from 'vee-validate'
// 引入中文插件
import zh_CN from 'vee-validate/dist/locale/zh_CN'

//注册
Vue.use(VeeValidate)

//表单验证     cv的  人家的Day14
/*
    观察参数    locallize的第一个参数表示中文
*/
VeeValidate.Validator.localize('zh_CN', {
  messages: {
    ...zh_CN.messages, // 这里需要引入中文插件
    is: field => `${field}必须与密码相同` //修改内置规则的message，让确认密码和密码相同
  },
  attributes: {
    phone: '手机号',
    code: '验证码',
    password: '密码',
    password1: '确认密码',
    isCheck: '协议',
    agree: '同意'
  }
})

//自定义校验规则
VeeValidate.Validator.extend('agree', {
  validate: value => {
    return value
  },
  getMessage: field => field + '必须同意'
})
