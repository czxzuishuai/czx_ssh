<template>
  <header class="header">
    <!-- 头部的第一行 -->
    <div class="top">
      <div class="container">
        <div class="loginList">
          <p>尚品汇欢迎您！</p>
          <!-- 未登录 -->
          <p v-if="!userName">
            <span>请</span>
            <router-link to="/login">登录</router-link>
            <router-link class="register" to="/register">免费注册</router-link>
          </p>
          <!-- 已登录 -->
          <p v-else>
            <a>{{userName}}</a>
            <a class="register" @click="logout">退出登录</a>
          </p>
        </div>
        <div class="typeList">
          <router-link to="/center">我的订单</router-link>
          <router-link to="/shopcart">我的购物车</router-link>

          <a href="###">我的尚品汇</a>
          <a href="###">尚品汇会员</a>
          <a href="###">企业采购</a>
          <a href="###">关注尚品汇</a>
          <a href="###">合作招商</a>
          <a href="###">商家后台</a>
        </div>
      </div>
    </div>
    <!--头部第二行 搜索区域-->
    <div class="bottom">
      <h1 class="logoArea">
        <a class="logo" title="尚品汇" href="###" target="_blank">
          <img src="./images/logo.png" alt />
        </a>
      </h1>
      <div class="searchArea">
        <form action="###" class="searchForm">
          <input type="text" id="autocomplete" class="input-error input-xxlarge" v-model="keyword" />
          <button class="sui-btn btn-xlarge btn-danger" type="button" @click="goSearch">搜索</button>
        </form>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'Header',
  data() {
    return {
      keyword: ''
    }
  },
  methods: {
    // 点击事件跳转到搜索页面
    goSearch() {
      // this.$router.push(
      //   { name: 'search', params: { keyword: this.keyword || undefined }, query: this.$route.query }
      //问题：当搜索框中没有内容时，你再次搜索会报错
      //   //表面上修改，给push的返回值传入回调函数，要从根本上解决需要重写push函数
      //   // () => {},
      //   // () => {}
      // )

      //合并两个参数
      /*
          【注意❗🐖】 下面的 ||undefined 一定要写上，不然的话当你params参数没有的时候，路由进行跳转url中会没有search，导致一刷新就回到了home页
                        并且在路由跳转时用对象的写法不能写path要写name
                        params参数不能为空，为空的话要用undefined代替
      */
      let location = { name: 'search', params: { keyword: this.keyword || undefined } }
      location.query = this.$route.query
      this.$router.push(location)
    },

    //退出登录
    logout() {
      //要做两件事
      try {
        this.$store.dispatch('userLogout')
        this.$router.push('/home')
      } catch (error) {
        alert(error.message)
      }
    }
  },
  mounted() {
    // 注册时间清空keyword
    this.$bus.$on('clearKayword', () => {
      this.keyword = ''
    })
  },
  computed: {
    userName() {
      return this.$store.state.user.userinfo.name
    }
  }
}
</script>

<style lang="less" scoped>
.header {
  & > .top {
    background-color: #eaeaea;
    height: 30px;
    line-height: 30px;

    .container {
      width: 1200px;
      margin: 0 auto;
      overflow: hidden;

      .loginList {
        float: left;

        p {
          float: left;
          margin-right: 10px;

          .register {
            border-left: 1px solid #b3aeae;
            padding: 0 5px;
            margin-left: 5px;
          }
        }
      }

      .typeList {
        float: right;

        a {
          padding: 0 10px;

          & + a {
            border-left: 1px solid #b3aeae;
          }
        }
      }
    }
  }

  & > .bottom {
    width: 1200px;
    margin: 0 auto;
    overflow: hidden;

    .logoArea {
      float: left;

      .logo {
        img {
          width: 175px;
          margin: 25px 45px;
        }
      }
    }

    .searchArea {
      float: right;
      margin-top: 35px;

      .searchForm {
        overflow: hidden;

        input {
          box-sizing: border-box;
          width: 490px;
          height: 32px;
          padding: 0px 4px;
          border: 2px solid #ea4a36;
          float: left;

          &:focus {
            outline: none;
          }
        }

        button {
          height: 32px;
          width: 68px;
          background-color: #ea4a36;
          border: none;
          color: #fff;
          float: left;
          cursor: pointer;

          &:focus {
            outline: none;
          }
        }
      }
    }
  }
}
</style>