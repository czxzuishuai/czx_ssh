<template>
  <div class="order-right">
    <div class="order-content">
      <div class="title">
        <h3>我的订单</h3>
      </div>
      <div class="chosetype">
        <table>
          <thead>
            <tr>
              <th width="29%">商品</th>
              <th width="31%">订单详情</th>
              <th width="13%">收货人</th>
              <th>金额</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
        </table>
      </div>
      <div class="orders">
        <!-- 循环记录 -->
        <table class="order-item" v-for="(order,index) in myOrder.records" :key="order.id">
          <thead>
            <tr>
              <th colspan="5">
                <span class="ordertitle">
                  {{order.createTime}} 订单编号：{{order.outTradeNo}}
                  <span class="pull-right delete">
                    <img src="../images/delete.png" />
                  </span>
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            <!-- tr: 每次购物所买的一件商品 -->
            <tr v-for="(good,index) in order.orderDetailList" :key="good.id">
              <td width="60%">
                <div class="typographic">
                  <img :src="good.imgUrl" style="width:100px;height:100px" />
                  <a href="#" class="block-text">{{good.skuName}}</a>
                  <span>x{{good.skuNum}}</span>
                  <a href="#" class="service">售后申请</a>
                </div>
              </td>
              <!-- rowspan的性质是合并几个单元格 -->
              <!-- 【⭐🚩⭐】  这里的tr循环了好多次，应该有很多姓名，所以要处理下，让她只剩下一个姓名  *****用v-if 只显示第一次循环的-->
              <td
                :rowspan="order.orderDetailList.length"
                v-if="index==0"
                width="8%"
                class="center"
              >{{order.consignee}}</td>
              <td
                :rowspan="order.orderDetailList.length"
                v-if="index==0"
                width="13%"
                class="center"
              >
                <ul class="unstyled">
                  <li>总金额¥{{order.totalAmount}}.00</li>
                  <li>在线支付</li>
                </ul>
              </td>
              <td :rowspan="order.orderDetailList.length" v-if="index==0" width="8%" class="center">
                <a href="#" class="btn">{{order.orderStatusName}}</a>
              </td>
              <td
                :rowspan="order.orderDetailList.length"
                v-if="index==0"
                width="13%"
                class="center"
              >
                <ul class="unstyled">
                  <li>
                    <a href="mycomment.html" target="_blank">评价|晒单</a>
                  </li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="choose-order">
        <!-- 分页   用咱们自己之前写的 -->
        <pagination
          :pageNo="page"
          :pageSize="limit"
          :total="myOrder.total"
          :continues="5"
          @GetpageNo="GetpageNo"
        ></pagination>
      </div>
    </div>
    <!--猜你喜欢-->
    <div class="like">
      <h4 class="kt">猜你喜欢</h4>
      <ul class="like-list">
        <li class="likeItem">
          <div class="p-img">
            <img src="../images/itemlike01.png" />
          </div>
          <div class="attr">
            <em>DELL戴尔Ins 15MR-7528SS 15英寸 银色 笔记本</em>
          </div>
          <div class="price">
            <em>¥</em>
            <i>3699.00</i>
          </div>
          <div class="commit">已有6人评价</div>
        </li>
        <li class="likeItem">
          <div class="p-img">
            <img src="../images/itemlike02.png" />
          </div>
          <div class="attr">Apple苹果iPhone 6s/6s Plus 16G 64G 128G</div>
          <div class="price">
            <em>¥</em>
            <i>4388.00</i>
          </div>
          <div class="commit">已有700人评价</div>
        </li>
        <li class="likeItem">
          <div class="p-img">
            <img src="../images/itemlike03.png" />
          </div>
          <div class="attr">DELL戴尔Ins 15MR-7528SS 15英寸 银色 笔记本</div>
          <div class="price">
            <em>¥</em>
            <i>4088.00</i>
          </div>
          <div class="commit">已有700人评价</div>
        </li>
        <li class="likeItem">
          <div class="p-img">
            <img src="../images/itemlike04.png" />
          </div>
          <div class="attr">DELL戴尔Ins 15MR-7528SS 15英寸 银色 笔记本</div>
          <div class="price">
            <em>¥</em>
            <i>4088.00</i>
          </div>
          <div class="commit">已有700人评价</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      //初始化参数值
      page: 1,
      limit: 3,
      myOrder: {}
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    // 成功了就储存到data中使用
    async getData() {
      //解构参数
      const { page, limit } = this
      let result = await this.$API.reqMyOrder(page, limit)
      if (result.code == 200) {
        this.myOrder = result.data
      }
    },
    //改变页码的自定义事件 在那个分页器组件中有传过来的点击的页码值
    GetpageNo(page) {
      //修改本组件中的page
      this.page = page
      this.getData()
    }
  }
}
</script>

<style lang="less" scoped>
</style>