import axios from 'axios'
import nprogress from 'nprogress'
// start 进度条开始   done  进度条结束
import 'nprogress/nprogress.css'
//从仓库中获取游客id
import store from '@/store'
import { getToken } from '@/utils/token'

const requests = axios.create({
  //配置基础路径：
  baseURL: '/api',
  //请求超时时间：
  timeout: 5000
})

//以下两个都是拦截器   第一个是请求拦截器，但是还没有配置token   第二个是响应拦截器

requests.interceptors.request.use(config => {
  //设置进度条：
  nprogress.start()
  if (store.state.detail.uuid_token) {
    //⭐往请求头中添加一个字段(userTempId)，这个字段是和后台老师商量好的
    config.headers.userTempId = store.state.detail.uuid_token
  }
  //携带token    ⭐这里的token如果在仓库中就不是持久化的，刷新一下就没了，并且他只有点击了那个登录按钮之后才会获取到
  //               用户的token
  if (store.state.user.token) {
    config.headers.token = store.state.user.token
  }

  //config:配置对象，里面包含很重要的请求头
  return config
})

requests.interceptors.response.use(
  res => {
    //成功的回调函数
    //进度条结束：
    nprogress.done()
    return res.data
  },
  error => {
    // 这里配置了错误的信息，就是error.message 是faile; 响应拦截器中出错了会在这里终止
    return Promise.reject(new Error('响应拦截器中出错')) //终止promise链
  }
)

export default requests
