<template>
  <div>
    <!-- 三级菜单 -->
    <TypeNav />
    <div class="main">
      <div class="py-container">
        <!--bread：   一个标签带个×-->
        <div class="bread">
          <ul class="fl sui-breadcrumb">
            <li>
              <a href="#">全部结果</a>
            </li>
          </ul>
          <ul class="fl sui-tag">
            <!-- 菜单的面包屑 -->
            <li class="with-x" v-if="searchParams.categoryName">
              {{searchParams.categoryName}}
              <i @click="removeCategoryName">×</i>
            </li>
            <!-- 输入框内容的面包屑 -->
            <li class="with-x" v-if="searchParams.keyword">
              {{searchParams.keyword}}
              <i @click="removeKeyword">×</i>
            </li>
            <!-- 品牌的面包屑   运用split分割id和名称   返回值是一个数组 -->
            <li class="with-x" v-if="searchParams.trademark">
              {{searchParams.trademark.split(':')[1]}}
              <i @click="removeTrademark">×</i>
            </li>
            <li class="with-x" v-for="(item,index) in searchParams.props" :key="index">
              {{item.split(':')[2]}}
              <i @click="removeAtrr(index)">×</i>
            </li>
          </ul>
        </div>

        <!--selector  search子组件   品牌、...、更多筛选项-->
        <!-- 通过自定义事件传参 -->
        <SearchSelector @trademarkInfo="trademarkInfo" @atrrValue="atrrValue" />

        <!--details-->
        <div class="details clearfix">
          <div class="sui-navbar">
            <!-- 排序 -->
            <div class="navbar-inner filter">
              <ul class="sui-nav">
                <!-- 简化代码：将this.searchParams.order.indexOf('1')!=-1写成一个bool函数 -->
                <li :class="{active:isOne()}" @click="changeOrder('1')">
                  <a>
                    综合
                    <span
                      v-show="isOne()"
                      class="iconfont"
                      :class="{'icon-jiantou_xiangxia':isDesc(),'icon-jiantou_xiangshang':isAsc()}"
                    ></span>
                  </a>
                </li>
                <li :class="{active:isTwo()}" @click="changeOrder('2')">
                  <a>
                    价格
                    <span
                      v-show="isTwo()"
                      class="iconfont"
                      :class="{'icon-jiantou_xiangxia':isDesc(),'icon-jiantou_xiangshang':isAsc()}"
                    ></span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div class="goods-list">
            <ul class="yui3-g">
              <!-- 商品 -->
              <li class="yui3-u-1-5" v-for="(item,index) in goodsList" :key="item.id">
                <div class="list-wrap">
                  <div class="p-img">
                    <!-- ⭐这里要传递参数，所以to前加： -->
                    <router-link :to="`/detail/${item.id}`">
                      <img v-lazy="item.defaultImg" />
                    </router-link>
                  </div>
                  <div class="price">
                    <strong>
                      <em>¥</em>&nbsp;
                      <i>{{item.price}}.00</i>
                    </strong>
                  </div>
                  <div class="attr">
                    <a
                      target="_blank"
                      href="item.html"
                      title="促销信息，下单即赠送三个月CIBN视频会员卡！【小米电视新品4A 58 火爆预约中】"
                    >{{item.title}}</a>
                  </div>
                  <div class="commit">
                    <i class="command">
                      已有
                      <span>2000</span>人评价
                    </i>
                  </div>
                  <div class="operate">
                    <router-link
                      class="sui-btn btn-bordered btn-danger"
                      :to="`/detail/${item.id}`"
                    >查看详情</router-link>
                    <a href="javascript:void(0);" class="sui-btn btn-bordered">收藏</a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <!-- 页码 -->
          <pagination
            :pageNo="searchParams.pageNo"
            :total="total"
            :pageSize="searchParams.pageSize"
            :continues="5"
            @GetpageNo="GetpageNo"
          ></pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SearchSelector from './SearchSelector/SearchSelector'
import { mapGetters, mapState } from 'vuex'
import Pagination from '@/components/Pagination'
export default {
  name: 'Search',
  data() {
    return {
      //发送请求时，可能携带的参数
      searchParams: {
        c1Id: '',
        c2Id: '',
        c3Id: '',
        categoryName: '',
        // header搜索框中输入的内容
        keyword: '',
        order: '1:asc',
        //当前是第几页
        pageNo: 1,
        //每一页数据的条数
        pageSize: 3,
        //平台售卖商品的属性，如：内存等等
        props: [],
        trademark: ''
      }
    }
  },
  components: {
    SearchSelector,
    Pagination
  },
  methods: {
    // remove  移除面包屑
    removeCategoryName() {
      //将数据定义为undefined就不会提交数据了
      this.searchParams.categoryName = undefined
      this.searchParams.c1Id = undefined
      this.searchParams.c2Id = undefined
      this.searchParams.c3Id = undefined
      this.getData()
      // 以上的操作地址栏里的参数还没有删除，这里需要调整地址栏中的参数
      //  ⭐⭐⭐ 通过路由跳转来改变地址栏中的参数
      //  考虑到params参数，所以用一个if来判断

      this.$router.push({ name: 'search', params: this.$route.params })
    },
    removeKeyword() {
      this.searchParams.keyword = undefined

      this.getData()
      this.$bus.$emit('clearKayword')
      //将地址栏中的params参数去掉，但不去掉query参数
      this.$router.push({ name: 'search', query: this.$route.query })
    },
    getData() {
      //⭐要携带参数
      this.$store.dispatch('getSearchlist', this.searchParams)
    },
    // 向参数中添加品牌
    trademarkInfo(trademark) {
      //参照那个api文件看参数格式，将传过来的参数给searchParams：id：商品名
      this.searchParams.trademark = `${trademark.tmId}:${trademark.tmName}`
      //再次获取参数
      this.getData()
    },

    removeTrademark() {
      this.searchParams.trademark = undefined
      this.getData()
    },
    //  向发送的参数中添加售卖属性
    atrrValue(item, attrValue) {
      //运用push向props数组中添加
      let props = `${item.attrId}:${item.attrName}:${attrValue}`
      // console.log(props)
      //  ⭐数组去重
      if (this.searchParams.props.indexOf(props) == -1) this.searchParams.props.push(props)

      this.getData()
    },
    removeAtrr(index) {
      this.searchParams.props.splice(index, 1)
      this.getData()
    },
    isOne() {
      return this.searchParams.order.indexOf('1') != -1
    },
    isTwo() {
      return this.searchParams.order.indexOf('2') != -1
    },
    isAsc() {
      return this.searchParams.order.indexOf('asc') != -1
    },
    isDesc() {
      return this.searchParams.order.indexOf('desc') != -1
    },
    changeOrder(flag) {
      let originFlag = this.searchParams.order.split(':')[0]
      let originSort = this.searchParams.order.split(':')[1]
      // console.log(originOrder, originFlag, originSort)
      let newOrder = ''
      //  下面的if是加载完网页没点时候的操作
      if (flag == originFlag) {
        //整理参数
        //  下面的双等号的意思是   整个originSort == 'desc' 是三元表达式的判断式
        //  ${} 里面可以变量，仅仅是变量  不能赋值
        newOrder = `${flag}:${originSort == 'desc' ? 'asc' : 'desc'}`

        //下面的else是 当你点的不是 综合 标签的时候
      } else {
        newOrder = `${flag}:${originSort}`
      }
      this.searchParams.order = newOrder
      this.getData()
    },
    GetpageNo(val) {
      this.searchParams.pageNo = val
      this.getData()
    }
  },
  beforeMount() {
    // 将地址栏中的参数做总的整理
    Object.assign(this.searchParams, this.$route.params, this.$route.query)
  },
  mounted() {
    //将this.$store.dispatch('getSearchlist')改写为方法，方便复用
    this.getData()
  },
  //   ...mapState({
  //     //记得加上仓库名，不然拿不上数据,因为这里的state指的是大仓库里的state
  //     searchList: state => state.search.searchList
  //   })
  // }
  //  ⭐不像上边那样写了，因为容易出错，用小仓库中的getters先把要用的数据整理好，转去getters看
  // 因为getters不划分模块，所以写成数组形式
  computed: {
    ...mapGetters(['goodsList', 'attrsList', 'trademarkList']),
    ...mapState({
      //⭐记得套仓库名
      total: state => state.search.searchList.total
    })
  },
  //$route和data中的数据平级，所以可以监听他
  watch: {
    $route(newValue, oldValue) {
      //现在存在一个bug：当你先点击了一级标题再点其他一级标题下的二或三级标题，数据中的c1Id还是一级标题的id
      //⭐每次请求完都将数据中的标题id清空：
      //⭐⭐⭐⭐ 将空字符串换成undefined不仅表示空，而且不会提交空数据
      this.searchParams.c1Id = undefined
      this.searchParams.c2Id = undefined
      this.searchParams.c3Id = undefined
      //每当数据发生一次变化时，就得整合一次参数，并发送请求
      Object.assign(this.searchParams, this.$route.params, this.$route.query)
      this.getData()
    }
  }
}
</script>

<style lang="less" scoped>
.main {
  margin: 10px 0;

  .py-container {
    width: 1200px;
    margin: 0 auto;

    .bread {
      margin-bottom: 5px;
      overflow: hidden;

      .sui-breadcrumb {
        padding: 3px 15px;
        margin: 0;
        font-weight: 400;
        border-radius: 3px;
        float: left;

        li {
          display: inline-block;
          line-height: 18px;

          a {
            color: #666;
            text-decoration: none;

            &:hover {
              color: #4cb9fc;
            }
          }
        }
      }

      .sui-tag {
        margin-top: -5px;
        list-style: none;
        font-size: 0;
        line-height: 0;
        padding: 5px 0 0;
        margin-bottom: 18px;
        float: left;

        .with-x {
          font-size: 12px;
          margin: 0 5px 5px 0;
          display: inline-block;
          overflow: hidden;
          color: #000;
          background: #f7f7f7;
          padding: 0 7px;
          height: 20px;
          line-height: 20px;
          border: 1px solid #dedede;
          white-space: nowrap;
          transition: color 400ms;
          cursor: pointer;

          i {
            margin-left: 10px;
            cursor: pointer;
            font: 400 14px tahoma;
            display: inline-block;
            height: 100%;
            vertical-align: middle;
          }

          &:hover {
            color: #28a3ef;
          }
        }
      }
    }

    .details {
      margin-bottom: 5px;

      .sui-navbar {
        overflow: visible;
        margin-bottom: 0;

        .filter {
          min-height: 40px;
          padding-right: 20px;
          background: #fbfbfb;
          border: 1px solid #e2e2e2;
          padding-left: 0;
          border-radius: 0;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.065);

          .sui-nav {
            position: relative;
            left: 0;
            display: block;
            float: left;
            margin: 0 10px 0 0;

            li {
              float: left;
              line-height: 18px;

              a {
                display: block;
                cursor: pointer;
                padding: 11px 15px;
                color: #777;
                text-decoration: none;
              }

              &.active {
                a {
                  background: #e1251b;
                  color: #fff;
                  .icon-jiantou_xiangxia,
                  .icon-jiantou_xiangshang {
                    vertical-align: middle;
                  }
                }
              }
            }
          }
        }
      }

      .goods-list {
        margin: 20px 0;

        ul {
          display: flex;
          flex-wrap: wrap;

          li {
            height: 100%;
            width: 20%;
            margin-top: 10px;
            line-height: 28px;

            .list-wrap {
              .p-img {
                padding-left: 15px;
                width: 215px;
                height: 255px;

                a {
                  color: #666;

                  img {
                    max-width: 100%;
                    height: auto;
                    vertical-align: middle;
                  }
                }
              }

              .price {
                padding-left: 15px;
                font-size: 18px;
                color: #c81623;

                strong {
                  font-weight: 700;

                  i {
                    margin-left: -5px;
                  }
                }
              }

              .attr {
                padding-left: 15px;
                width: 85%;
                overflow: hidden;
                margin-bottom: 8px;
                min-height: 38px;
                cursor: pointer;
                line-height: 1.8;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;

                a {
                  color: #333;
                  text-decoration: none;
                }
              }

              .commit {
                padding-left: 15px;
                height: 22px;
                font-size: 13px;
                color: #a7a7a7;

                span {
                  font-weight: 700;
                  color: #646fb0;
                }
              }

              .operate {
                padding: 12px 15px;

                .sui-btn {
                  display: inline-block;
                  padding: 2px 14px;
                  box-sizing: border-box;
                  margin-bottom: 0;
                  font-size: 12px;
                  line-height: 18px;
                  text-align: center;
                  vertical-align: middle;
                  cursor: pointer;
                  border-radius: 0;
                  background-color: transparent;
                  margin-right: 15px;
                }

                .btn-bordered {
                  min-width: 85px;
                  background-color: transparent;
                  border: 1px solid #8c8c8c;
                  color: #8c8c8c;

                  &:hover {
                    border: 1px solid #666;
                    color: #fff !important;
                    background-color: #666;
                    text-decoration: none;
                  }
                }

                .btn-danger {
                  border: 1px solid #e1251b;
                  color: #e1251b;

                  &:hover {
                    border: 1px solid #e1251b;
                    background-color: #e1251b;
                    color: white !important;
                    text-decoration: none;
                  }
                }
              }
            }
          }
        }
      }

      .page {
        width: 733px;
        height: 66px;
        overflow: hidden;
        float: right;

        .sui-pagination {
          margin: 18px 0;

          ul {
            margin-left: 0;
            margin-bottom: 0;
            vertical-align: middle;
            width: 490px;
            float: left;

            li {
              line-height: 18px;
              display: inline-block;

              a {
                position: relative;
                float: left;
                line-height: 18px;
                text-decoration: none;
                background-color: #fff;
                border: 1px solid #e0e9ee;
                margin-left: -1px;
                font-size: 14px;
                padding: 9px 18px;
                color: #333;
              }

              &.active {
                a {
                  background-color: #fff;
                  color: #e1251b;
                  border-color: #fff;
                  cursor: default;
                }
              }

              &.prev {
                a {
                  background-color: #fafafa;
                }
              }

              &.disabled {
                a {
                  color: #999;
                  cursor: default;
                }
              }

              &.dotted {
                span {
                  margin-left: -1px;
                  position: relative;
                  float: left;
                  line-height: 18px;
                  text-decoration: none;
                  background-color: #fff;
                  font-size: 14px;
                  border: 0;
                  padding: 9px 18px;
                  color: #333;
                }
              }

              &.next {
                a {
                  background-color: #fafafa;
                }
              }
            }
          }

          div {
            color: #333;
            font-size: 14px;
            float: right;
            width: 241px;
          }
        }
      }
    }
  }
}
</style>