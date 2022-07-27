<template>
  <div class="cart">
    <h4>全部商品</h4>
    <div class="cart-main">
      <div class="cart-th">
        <div class="cart-th1">全部</div>
        <div class="cart-th2">商品</div>
        <div class="cart-th3">单价（元）</div>
        <div class="cart-th4">数量</div>
        <div class="cart-th5">小计（元）</div>
        <div class="cart-th6">操作</div>
      </div>

      <div class="cart-body">
        <!-- 底下的ul表示一个商品栏 -->
        <ul class="cart-list" v-for="(good,index) in cartInfoList" :key="good.id">
          <li class="cart-list-con1">
            <input
              type="checkbox"
              name="chk_list"
              :checked="good.isChecked==1"
              @change="updateChecked(good,$event)"
            />
          </li>
          <li class="cart-list-con2">
            <img :src="good.imgUrl" />
            <div class="item-msg">{{good.skuName}}</div>
          </li>

          <li class="cart-list-con4">
            <span class="price">{{good.skuPrice}}</span>
          </li>
          <li class="cart-list-con5">
            <a class="mins" @click="handler('mins',-1,good)">-</a>
            <input
              autocomplete="off"
              type="text"
              :value="good.skuNum"
              minnum="1"
              class="itxt"
              @change="handler('input',$event.target.value*1,good)"
            />
            <a href="javascript:void(0)" class="plus" @click="handler('add',1,good)">+</a>
          </li>
          <li class="cart-list-con6">
            <span class="sum">{{good.skuNum*good.skuPrice}}</span>
          </li>
          <li class="cart-list-con7">
            <a class="sindelet" @click="deleteCartById(good)">删除</a>
            <br />
            <a href="#none">移到收藏</a>
          </li>
        </ul>
      </div>
    </div>

    <div class="cart-tool">
      <div class="select-all">
        <input
          class="chooseAll"
          type="checkbox"
          :checked="isAllChecked"
          @change="updateAllCartChecked($event.target.checked)"
        />
        <span>全选</span>
      </div>
      <div class="option">
        <a @click="deleteAllCheckedCart()">删除选中的商品</a>
        <a href="#none">移到我的关注</a>
        <a href="#none">清除下柜商品</a>
      </div>
      <div class="money-box">
        <div class="chosed">
          已选择
          <span>0</span>件商品
        </div>
        <div class="sumprice">
          <em>总价（不含运费） ：</em>
          <i class="summoney">{{totalPrice}}</i>
        </div>
        <div class="sumbtn">
          <a class="sum-btn" @click="$router.push('/trade')">结算</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import throttle from 'lodash/throttle'
export default {
  name: 'ShopCart',
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.$store.dispatch('getCartList')
    },

    // 数量变化时触发的函数
    handler: throttle(async function (type, disNum, good) {
      /*解析：
         type：三个功能的哪一个被执行了(区分哪个功能要发送请求)
         disNum: 要传递的数量
         good：哪一个商品
        最终带给服务器数字的变化
      */
      switch (type) {
        case 'mins':
          disNum = good.skuNum > 1 ? -1 : 0
          break
        case 'add':
          //判断个数是否小于1
          disNum = 1
          break
        case 'input':
          if (isNaN(disNum) || disNum < 1) {
            disNum = 0
          } else {
            //如果是小数
            disNum = parseInt(disNum) - good.skuNum
          }
          break
      }
      // console.log(`触发了${type}`)
      /*  派发action 向服务器发送数量变动请求，【注意】 这里要带上获取购物车列表的请求
          这里也要先判断请求是否成功
      */
      try {
        await this.$store.dispatch('addShopCart', { skuId: good.skuId, skuNum: disNum })
        this.getData()
      } catch (error) {
        alert(error.message)
      }
    }, 500),

    // 删除商品
    async deleteCartById(good) {
      try {
        await this.$store.dispatch('deleteCartById', good.skuId)
        this.getData()
      } catch (error) {
        alert(error.message)
      }
    },

    //更新商品状态
    async updateChecked(good, e) {
      // console.log($event.target.checked)  要带给服务器的数据不是布尔值，而是 0 | 1

      try {
        // 如果修改数据成功，还需要修改购物车的数据
        let checked = e.target.checked ? '1' : '0'
        await this.$store.dispatch('updateCheckedById', { skuId: good.skuId, isChecked: checked })
        this.getData()
      } catch (error) {
        alert(errro.message)
      }
    },

    //  删除选中商品
    async deleteAllCheckedCart() {
      try {
        await this.$store.dispatch('deleteAllCheckedCart')
        this.getData()
      } catch (error) {
        alert(error.message)
      }
    },

    //全选按钮的控制
    async updateAllCartChecked(Checked) {
      try {
        await this.$store.dispatch('updateAllCartChecked', Checked)
        this.getData()
      } catch (error) {
        alert(error.message)
      }
    }
  },

  computed: {
    ...mapGetters(['cartlist', 'cartInfoList']),
    cartInfoList() {
      return this.cartlist.cartInfoList || []
    },
    totalPrice() {
      let summoney = 0
      this.cartInfoList.forEach(element => {
        summoney += element.skuPrice * element.skuNum
      })
      return summoney
    },
    isAllChecked() {
      return this.cartInfoList.every(item => item.isChecked == 1)
    }
  }
}
</script>

<style lang="less" scoped>
.cart {
  width: 1200px;
  margin: 0 auto;

  h4 {
    margin: 9px 0;
    font-size: 14px;
    line-height: 21px;
  }

  .cart-main {
    .cart-th {
      background: #f5f5f5;
      border: 1px solid #ddd;
      padding: 10px;
      overflow: hidden;

      & > div {
        float: left;
      }

      .cart-th1 {
        width: 25%;

        input {
          vertical-align: middle;
        }

        span {
          vertical-align: middle;
        }
      }

      .cart-th2 {
        width: 25%;
      }

      .cart-th3,
      .cart-th4,
      .cart-th5,
      .cart-th6 {
        width: 12.5%;
      }
    }

    .cart-body {
      margin: 15px 0;
      border: 1px solid #ddd;

      .cart-list {
        padding: 10px;
        border-bottom: 1px solid #ddd;
        overflow: hidden;

        & > li {
          float: left;
        }

        .cart-list-con1 {
          width: 15%;
        }

        .cart-list-con2 {
          width: 35%;

          img {
            width: 82px;
            height: 82px;
            float: left;
          }

          .item-msg {
            float: left;
            width: 150px;
            margin: 0 10px;
            line-height: 18px;
          }
        }

        // .cart-list-con3 {
        //   width: 20.8333%;

        //   .item-txt {
        //     text-align: center;
        //   }
        // }

        .cart-list-con4 {
          width: 10%;
        }

        .cart-list-con5 {
          width: 15%;

          .mins {
            border: 1px solid #ddd;
            border-right: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }

          input {
            border: 1px solid #ddd;
            width: 40px;
            height: 33px;
            float: left;
            text-align: center;
            font-size: 14px;
          }

          .plus {
            border: 1px solid #ddd;
            border-left: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }
        }

        .cart-list-con6 {
          width: 12%;

          .sum {
            font-size: 16px;
          }
        }

        .cart-list-con7 {
          width: 13%;

          a {
            color: #666;
          }
        }
      }
    }
  }

  .cart-tool {
    overflow: hidden;
    border: 1px solid #ddd;

    .select-all {
      padding: 10px;
      overflow: hidden;
      float: left;

      span {
        vertical-align: middle;
      }

      input {
        vertical-align: middle;
      }
    }

    .option {
      padding: 10px;
      overflow: hidden;
      float: left;

      a {
        float: left;
        padding: 0 10px;
        color: #666;
      }
    }

    .money-box {
      float: right;

      .chosed {
        line-height: 26px;
        float: left;
        padding: 0 10px;
      }

      .sumprice {
        width: 200px;
        line-height: 22px;
        float: left;
        padding: 0 10px;

        .summoney {
          color: #c81623;
          font-size: 16px;
        }
      }

      .sumbtn {
        float: right;

        a {
          display: block;
          position: relative;
          width: 96px;
          height: 52px;
          line-height: 52px;
          color: #fff;
          text-align: center;
          font-size: 18px;
          font-family: 'Microsoft YaHei';
          background: #e1251b;
          overflow: hidden;
        }
      }
    }
  }
}
</style>