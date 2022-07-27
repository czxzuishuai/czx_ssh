<template>
  <div class="type-nav">
    <div class="container">
      <!-- 这里的div是为了将两个平级的标签包裹起来完成鼠标移入移出效果 -->
      <div @mouseleave="leavemouse" @mouseenter="entershow">
        <h2 class="all">全部商品分类</h2>
        <transition name="sort">
          <div class="sort" v-show="show">
            <!-- 利用事件委派添加事件 -->
            <div class="all-sort-list2" @click="goSearch">
              <div
                class="item"
                v-for="(c1,index) in categroyList"
                :key="c1.categoryId"
                :class="{current:activeIndex===index}"
              >
                <h3 @mouseenter="changeIndex(index)">
                  <a
                    :data-categoryName="c1.categoryName"
                    :data-category1Id="c1.categoryId"
                  >{{c1.categoryName}}</a>
                </h3>
                <div
                  class="item-list clearfix"
                  :style="{display:activeIndex===index?'block':'none'}"
                >
                  <div class="subitem" v-for="(c2,index) in c1.categoryChild" :key="c2.categoryId">
                    <dl class="fore">
                      <dt>
                        <a
                          :data-categoryName="c2.categoryName"
                          :data-category2Id="c2.categoryId"
                        >{{c2.categoryName}}</a>
                      </dt>
                      <dd>
                        <em v-for="(c3,index) in c2.categoryChild" :key="c3.categoryId">
                          <a
                            :data-categoryName="c3.categoryName"
                            :data-category3Id="c3.categoryId"
                          >{{c3.categoryName}}</a>
                        </em>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>

      <nav class="nav">
        <a href="###">服装城</a>
        <a href="###">美妆馆</a>
        <a href="###">尚品汇超市</a>
        <a href="###">全球购</a>
        <a href="###">闪购</a>
        <a href="###">团购</a>
        <a href="###">有趣</a>
        <a href="###">秒杀</a>
      </nav>
    </div>
  </div>
</template>
这个组件是全部商品的那个三级联动的，因为用的多，所以后边要注册成全局组件,在main.js中注册
<script>
import { mapState } from 'vuex'
import throttle from 'lodash/throttle'

export default {
  name: 'TypeNav',
  data() {
    return {
      activeIndex: -1,
      show: true
    }
  },
  mounted() {
    if (this.$route.path != '/home') {
      this.show = false
    }
  },
  computed: {
    ...mapState({
      categroyList: state => state.home.categroyList
    })
  },
  methods: {
    // changeIndex(index) {
    //   this.activeIndex = index
    // },
    //如果不加节流的话，在操作的快了达不到操作的效果(二级菜单的背景颜色效果)
    //加上节流：     (这按需引入了throttle，前面就不用加_.了)
    changeIndex: throttle(function (index) {
      this.activeIndex = index
    }, 50),
    leavemouse() {
      this.activeIndex = -1
      //非home页面的判断,防止home页面出现非必要效果
      if (this.$route.path != '/home') {
        this.show = false
      }
    },
    // 非home页面的三级列表的展示
    entershow() {
      this.show = true
    },
    // 进行路由的跳转
    // 最好的解决方案是 编程式导航+事件委派
    // 事件委派时存在的一些问题：1.如何确定你点击的是a标签    2.如何传递点击的相应的参数(如何区分是哪一级的a标签)
    // 解决：  1.为a标签添加自定义属性data-categoryName，其余子节点没有，就可以确定你点击的是a标签，
    //        2.也是通过添加自定义属性来确定是哪一级标签   一级：category1Id   二级：category2Id。。。。。。
    goSearch(e) {
      //dataset可以获取到我们为节点设置的自定义属性
      let { categoryname, category1id, category2id, category3id } = e.target.dataset

      //1.判断是否是a标签
      if (categoryname) {
        // 整理路由跳转的参数
        let location = { name: 'search' }
        let query = { categoryName: categoryname } //这个就是将query赋值为一个json对象
        //2.判断是几级的a标签
        if (category1id) {
          query.c1Id = category1id
        } else if (category2id) {
          query.c2Id = category2id
        } else {
          query.c3Id = category3id
        }
        //将两个参数合并
        location.query = query
        //把params参数也加上

        location.params = this.$route.params

        // location.params = params

        this.$router.push(location)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.type-nav {
  border-bottom: 2px solid #e1251b;

  .container {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    position: relative;

    .all {
      width: 210px;
      height: 45px;
      background-color: #e1251b;
      line-height: 45px;
      text-align: center;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }

    .nav {
      a {
        height: 45px;
        margin: 0 22px;
        line-height: 45px;
        font-size: 16px;
        color: #333;
      }
    }

    .sort {
      position: absolute;
      left: 0;
      top: 45px;
      width: 210px;
      height: 461px;
      position: absolute;
      background: #fafafa;
      z-index: 999;

      .all-sort-list2 {
        .item {
          h3 {
            line-height: 27px;
            font-size: 14px;
            font-weight: 400;
            overflow: hidden;
            padding: 0 20px;
            margin: 0;

            a {
              color: #333;
            }
          }

          .item-list {
            display: none;
            position: absolute;
            width: 734px;
            min-height: 460px;
            background: #f7f7f7;
            left: 210px;
            border: 1px solid #ddd;
            top: 0;
            z-index: 9999 !important;

            .subitem {
              float: left;
              width: 650px;
              padding: 0 4px 0 8px;

              dl {
                border-top: 1px solid #eee;
                padding: 6px 0;
                overflow: hidden;
                zoom: 1;

                &.fore {
                  border-top: 0;
                }

                dt {
                  float: left;
                  width: 54px;
                  line-height: 22px;
                  text-align: right;
                  padding: 3px 6px 0 0;
                  font-weight: 700;
                }

                dd {
                  float: left;
                  width: 415px;
                  padding: 3px 0 0;
                  overflow: hidden;

                  em {
                    float: left;
                    height: 14px;
                    line-height: 14px;
                    padding: 0 8px;
                    margin-top: 5px;
                    border-left: 1px solid #ccc;
                  }
                }
              }
            }
          }
          // 父类选择器&
          // &:hover {
          //   .item-list {
          //     display: block;
          //   }
          // }
        }
        .current {
          background-color: rgb(149, 147, 147);
        }
      }
    }
    // ⭐过渡动画样式
    // vue动画中相关的命名(标签中已经设置了name属性)
    //  进入动画
    .sort-enter {
      height: 0;
    }
    // 进入完成时
    .sort-enter-to {
      height: 461px;
    }
    .sort-enter-active {
      transition: all 0.2s linear;
    }
  }
}
</style>