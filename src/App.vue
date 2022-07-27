<template>
  <div>
    <Header></Header>
    <!-- 这里看url是啥就跳转到哪 -->
    <router-view></router-view>
    <Footer v-show="$route.meta.showFooter"></Footer>
  </div>
</template>

<script>
import Header from '@/components/Header/header.vue'
import Footer from '@/components/Footer/footer.vue'
export default {
  name: 'App',
  components: {
    Header,
    Footer
  },
  mounted() {
    //  ⭐将三级菜单的数据请求从typenav组件移到这里  不能放到入口文件中，因为那时候还没有this
    this.$store.dispatch('categroyList')
    //this.$store.dispatch('getUserInfo')
  }
}
</script>

<style lang="less" scoped>
</style>
