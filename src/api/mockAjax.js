import axios from 'axios'
import nprogress from 'nprogress'
// start 进度条开始   done  进度条结束
import 'nprogress/nprogress.css'

const requests = axios.create({
  //配置基础路径：    改为mock地址
  baseURL: '/mock',
  //请求超时时间：
  timeout: 5000
})

requests.interceptors.request.use(config => {
  //设置进度条：
  nprogress.start()
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
    return Promise.reject(new Error('faile')) //终止promise链
  }
)

export default requests
