<template>
  <div class="pagination">
    <button :disabled="pageNo==1" @click="$emit('GetpageNo',pageNo-1)">上一页</button>
    <!-- 此处1应该出现的条件 -->
    <button
      v-if="startAndendPage.start>1"
      @click="$emit('GetpageNo',1)"
      :class="{active:pageNo==1}"
    >1</button>
    <!-- ...应该出现的条件 -->
    <button v-if="startAndendPage.start>2">···</button>
    <!-- 注意：此处v-for遍历的对象并不是totalPage，因为只是遍历连续的页数 -->
    <button
      :class="{'active':pageNo==page}"
      v-for="(page,index) in startAndendPage.end"
      :key="index"
      v-if="page>=startAndendPage.start"
      @click="$emit('GetpageNo',page)"
    >{{page}}</button>

    <button v-if="startAndendPage.end<totalPage-1">···</button>

    <button
      v-if="startAndendPage.end<totalPage"
      @click="$emit('GetpageNo',totalPage)"
    >{{this.totalPage}}</button>
    <button :disabled="pageNo==totalPage" @click="$emit('GetpageNo',pageNo+1)">下一页</button>

    <button style="margin-left: 30px">共 {{this.total}} 条</button>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: ['pageNo', 'pageSize', 'total', 'continues'],
  computed: {
    // 总页数
    totalPage() {
      return Math.ceil(this.total / this.pageSize)
    },
    // 起始和结束的页码---------以对象形式返回
    startAndendPage() {
      //简化this：再用带下面解构赋值中的参数的时候就不用加this.了
      const { pageNo, continues, totalPage } = this
      let start = 0
      let end = 0
      if (totalPage < continues) {
        start = 1
        end = totalPage
      } else {
        //正常的中间情况下：
        start = pageNo - Math.trunc(continues / 2)
        end = pageNo + Math.trunc(continues / 2)
        //非正常情况
        if (start < 1) {
          start = 1
          end = continues
        }
        if (end > totalPage) {
          start = totalPage - continues + 1
          end = totalPage
        }
      }
      return { start, end }
    }
  }
}
</script>

<style lang="less" scoped>
.pagination {
  text-align: center;

  button {
    margin: 0 5px;
    background-color: #f4f4f5;
    color: #606266;
    outline: none;
    border-radius: 2px;
    padding: 0 4px;
    vertical-align: top;
    display: inline-block;
    font-size: 13px;
    min-width: 35.5px;
    height: 28px;
    line-height: 28px;
    cursor: pointer;
    box-sizing: border-box;
    text-align: center;
    border: 0;

    &[disabled] {
      color: #c0c4cc;
      cursor: not-allowed;
    }
  }
}
//记得加到权重
.active {
  background-color: #409eff !important;
  color: #fff !important;
}
</style>
