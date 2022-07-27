<template>
  <div class="trade-container">
    <h3 class="title">填写并核对订单信息</h3>
    <div class="content">
      <h5 class="receive">收件人信息</h5>
      <div class="address clearFix" v-for="(item,index) in userAddressList" :key="item.id">
        <!-- 🚩下面的selected类为是否为默认地址，只有是默认地址是才会有此类名 -->
        <span class="username" :class="{selected:item.isDefault==1}">{{item.consignee}}</span>
        <p @click="changeDefault(item,userAddressList)">
          <span class="s1">{{item.fullAddress}}</span>
          <span class="s2">{{item.phoneNum}}</span>
          <span class="s3" v-show="item.isDefault==1">默认地址</span>
        </p>
      </div>

      <div class="line"></div>
      <h5 class="pay">支付方式</h5>
      <div class="address clearFix">
        <span class="username selected">在线支付</span>
        <span class="username" style="margin-left:5px;">货到付款</span>
      </div>
      <div class="line"></div>
      <h5 class="pay">送货清单</h5>
      <div class="way">
        <h5>配送方式</h5>
        <div class="info clearFix">
          <span class="s1">天天快递</span>
          <p>配送时间：预计8月10日（周三）09:00-15:00送达</p>
        </div>
      </div>
      <div class="detail">
        <h5>商品清单</h5>
        <ul
          class="list clearFix"
          v-for="(tradegood,index) in detailArrayList"
          :key="tradegood.skuId"
        >
          <li>
            <img :src="tradegood.imgUrl" alt style="width:100px;height:100px" />
          </li>
          <li>
            <p>{{tradegood.skuName}}</p>
            <h4>7天无理由退货</h4>
          </li>
          <li>
            <h3>￥{{tradegood.orderPrice}}</h3>
          </li>
          <li>X{{tradegood.skuNum}}</li>
          <li>有货</li>
        </ul>
      </div>
      <div class="bbs">
        <h5>买家留言：</h5>
        <textarea
          placeholder="建议留言前先与商家沟通确认"
          class="remarks-cont"
          v-model="msg"
          style="padding:0 10px"
        ></textarea>
      </div>
      <div class="line"></div>
      <div class="bill">
        <h5>发票信息：</h5>
        <div>普通发票（电子） 个人 明细</div>
        <h5>使用优惠/抵用</h5>
      </div>
    </div>
    <div class="money clearFix">
      <ul>
        <li>
          <b>
            <i>{{tradeinfo.totalNum}}</i>件商品，总商品金额
          </b>
          <span>¥{{tradeinfo.totalAmount}}</span>
        </li>
        <li>
          <b>返现：</b>
          <span>0.00</span>
        </li>
        <li>
          <b>运费：</b>
          <span>0.00</span>
        </li>
      </ul>
    </div>
    <div class="trade">
      <div class="price">
        应付金额:
        <span>¥{{tradeinfo.totalAmount}}</span>
      </div>
      <div class="receiveInfo">
        寄送至:
        <span>{{userDefaultAddress.fullAddress}}</span>
        收货人：
        <span>{{userDefaultAddress.consignee}}</span>
        <span>{{userDefaultAddress.phoneNum}}</span>
      </div>
    </div>
    <div class="sub clearFix">
      <a class="subBtn" @click="submitOrder">提交订单</a>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'Trade',
  data() {
    return {
      //买家留言
      msg: '',
      orderId: ''
    }
  },
  mounted() {
    this.$store.dispatch('getUserAddress')
  },
  computed: {
    //别忘了还有函数的写法
    ...mapGetters(['userAddressList', 'detailArrayList']),
    ...mapState({
      tradeinfo: state => state.trade.tradeInfo
    }),
    userDefaultAddress() {
      return this.userAddressList.find(element => element.isDefault == 1) || {}
    }
  },
  methods: {
    //实现选择要用的地址的功能---排他思想
    changeDefault(item, userAddressList) {
      userAddressList.forEach(element => {
        element.isDefault = 0
      })
      item.isDefault = 1
    },
    //提交订单
    async submitOrder() {
      let { tradeNo } = this.tradeinfo
      //其余的六个参数   现将参数格式从api文档中复制过来，在慢慢填充
      let data = {
        consignee: this.userDefaultAddress.consignee,
        consigneeTel: this.userDefaultAddress.phoneNum,
        deliveryAddress: this.userDefaultAddress.fullAddress,
        paymentWay: 'ONLINE', //支付方式
        orderComment: this.msg,
        orderDetailList: this.detailArrayList
      }
      //需要知道返回的结果，里面有个订单号
      let result = await this.$API.reqSubmitOrder(tradeNo, data)
      console.log(result)
      if (result.code == 200) {
        this.orderId = result.data
        this.$router.push('/pay?orderId=' + this.orderId)
      } else {
        alert(result.message)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.trade-container {
  .title {
    width: 1200px;
    margin: 0 auto;
    font-size: 14px;
    line-height: 21px;
  }

  .content {
    width: 1200px;
    margin: 10px auto 0;
    border: 1px solid rgb(221, 221, 221);
    padding: 25px;
    box-sizing: border-box;

    .receive,
    .pay {
      line-height: 36px;
      margin: 18px 0;
    }

    .address {
      padding-left: 20px;
      margin-bottom: 15px;

      .username {
        float: left;
        width: 100px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        border: 1px solid #ddd;
        position: relative;
      }

      .username::after {
        content: '';
        display: none;
        width: 13px;
        height: 13px;
        position: absolute;
        right: 0;
        bottom: 0;
        background: url(./images/choosed.png) no-repeat;
      }

      .username.selected {
        border-color: #e1251b;
      }

      .username.selected::after {
        display: block;
      }

      p {
        width: 610px;
        float: left;
        line-height: 30px;
        margin-left: 10px;
        padding-left: 5px;
        cursor: pointer;

        .s1 {
          float: left;
        }

        .s2 {
          float: left;
          margin: 0 5px;
        }

        .s3 {
          float: left;
          width: 56px;
          height: 24px;
          line-height: 24px;
          margin-left: 10px;
          background-color: #878787;
          color: #fff;
          margin-top: 3px;
          text-align: center;
        }
      }

      p:hover {
        background-color: #ddd;
      }
    }

    .line {
      height: 1px;
      background-color: #ddd;
    }

    .way {
      width: 1080px;
      height: 110px;
      background: #f4f4f4;
      padding: 15px;
      margin: 0 auto;

      h5 {
        line-height: 50px;
      }

      .info {
        margin-top: 20px;

        .s1 {
          float: left;
          border: 1px solid #ddd;
          width: 120px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          margin-right: 10px;
        }

        p {
          line-height: 30px;
        }
      }
    }

    .detail {
      width: 1080px;

      background: #feedef;
      padding: 15px;
      margin: 2px auto 0;

      h5 {
        line-height: 50px;
      }

      .list {
        display: flex;
        justify-content: space-between;

        li {
          line-height: 30px;

          p {
            margin-bottom: 20px;
          }

          h4 {
            color: #c81623;
            font-weight: 400;
          }

          h3 {
            color: #e12228;
          }
        }
      }
      ul {
        padding-top: 10px;
        border-bottom: #c0bfbf 1px solid;
      }
    }

    .bbs {
      margin-bottom: 15px;

      h5 {
        line-height: 50px;
      }

      textarea {
        width: 100%;
        border-color: #e4e2e2;
        line-height: 1.8;
        outline: none;
        resize: none;
      }
    }

    .bill {
      h5 {
        line-height: 50px;
      }

      div {
        padding-left: 15px;
      }
    }
  }

  .money {
    width: 1200px;
    margin: 20px auto;

    ul {
      width: 220px;
      float: right;

      li {
        line-height: 30px;
        display: flex;
        justify-content: space-between;

        i {
          color: red;
        }
      }
    }
  }

  .trade {
    box-sizing: border-box;
    width: 1200px;
    padding: 10px;
    margin: 10px auto;
    text-align: right;
    background-color: #f4f4f4;
    border: 1px solid #ddd;

    div {
      line-height: 30px;
    }

    .price span {
      color: #e12228;
      font-weight: 700;
      font-size: 14px;
    }

    .receiveInfo {
      color: #999;
    }
  }

  .sub {
    width: 1200px;
    margin: 0 auto 10px;

    .subBtn {
      float: right;
      width: 164px;
      height: 56px;
      font: 700 18px '微软雅黑';
      line-height: 56px;
      text-align: center;
      color: #fff;
      background-color: #e1251b;
    }
  }
}

a {
  cursor: pointer;
}
</style>