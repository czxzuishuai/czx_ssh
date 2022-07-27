<template>
  <div>
    <h1 v-upper="msg"></h1>
    <type-nav></type-nav>
    <list-container></list-container>
    <today-recommend></today-recommend>
    <rank></rank>
    <like></like>
    <Floor v-for="(floor,index) in floorList" :key="floor.id" :list="floor"></Floor>
    <brand></brand>
  </div>
</template>

<script>
import Like from './Like/like.vue'
import ListContainer from './ListContainer/ListContainer.vue'
import Rank from './Rank/rank.vue'
import TodayRecommend from './TodayRecommend/TodayRecommend.vue'
import Floor from './Floor/Floor.vue'
import Brand from './Brand/Brand.vue'
import { mapState } from 'vuex'
export default {
  components: { ListContainer, TodayRecommend, Rank, Like, Floor, Brand },
  name: 'Home',
  data() {
    return {
      msg: 'yeyeyey'
    }
  },
  mounted() {
    this.$store.dispatch('getFloorlist')
    // 获取用户信息，在首页展示
    //this.$store.dispatch('getUserInfo')
  },
  computed: {
    ...mapState({
      floorList: state => state.home.floorList
    })
  }
}
</script>

<style lang="less" scoped>
</style>