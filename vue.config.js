const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})

module.exports = {
  //是否使用map
  //productionSourceMap:false,
  lintOnSave: false,
  // 配饰代理服务器
  devServer: {
    proxy: {
      '/api': {
        target: 'http://gmall-h5-api.atguigu.cn' //这里写你要跨域请求数据的网址
      }
    }
  }
}
