import Vue from 'vue'

//vue的插件必须定义成对象且要有install方法
let myPlugins = {}
// 此函数会被注入一个默认参数，是一个vue函数，可以打印看下；第二个参数使我们在用这个插件时传进来的
myPlugins.install = function (vue, options) {
  /*
    Vue.prototype.$bus  任何组件都可以使用
    Vue.filter
    Vue.commponent
    ...
  */
  //自定义全局指令  下面element也是一个默认参数，当你的项目中有dom元素使用v-upper时，这个参数会传进来，表示此DOM元素
  //                还有一个默认参数   打印出来里面是插件的一些参数，⭐里面的modifiers存的是指令的修饰符
  Vue.directive(options.name, (element, params) => {
    //这里在home组件中测试了一下
    // console.log(element, params)
    //操纵DOM元素
    // element.innerHTML = params.value.toUpperCase()
  })
}

export default myPlugins
