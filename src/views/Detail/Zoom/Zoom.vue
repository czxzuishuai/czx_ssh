<template>
  <div class="spec-preview">
    <img :src="imgObj.imgUrl" />
    <!-- ⭐这里的event是为了添加一个鼠标移动事件 -->
    <div class="event" @mousemove="handler"></div>
    <div class="big">
      <img :src="imgObj.imgUrl" ref="big" />
    </div>
    <div class="mask" ref="mask"></div>
  </div>
</template>

<script>
export default {
  name: 'Zoom',
  props: ['skuImageList'],
  data() {
    return {
      currentIndex: 0
    }
  },

  computed: {
    //防止出现没有数据时，undefined的错误
    imgObj() {
      return this.skuImageList[this.currentIndex] || {}
    }
  },
  mounted() {
    this.$bus.$on('getIndex', val => {
      this.currentIndex = val
    })
  },
  methods: {
    // 这里的e可以省略
    handler(e) {
      let mask = this.$refs.mask
      let big = this.$refs.big
      let top = e.offsetY - mask.offsetHeight / 2
      let left = e.offsetX - mask.offsetWidth / 2
      if (top < 0) top = 0
      if (top > mask.offsetHeight) top = mask.offsetHeight
      if (left < 0) left = 0
      if (left > mask.offsetWidth) left = mask.offsetWidth
      // ⭐⭐ px一定不要忘了加
      mask.style.top = top + 'px'
      mask.style.left = left + 'px'
      big.style.top = -top * 2 + 'px'
      big.style.left = -left * 2 + 'px'
    }
  }
}
</script>

<style lang="less">
.spec-preview {
  position: relative;
  width: 400px;
  height: 400px;
  border: 1px solid #ccc;

  img {
    width: 100%;
    height: 100%;
  }

  .event {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 998;
  }

  .mask {
    width: 50%;
    height: 50%;
    background-color: rgba(0, 255, 0, 0.3);
    position: absolute;
    left: 0;
    top: 0;
    display: none;
  }

  .big {
    width: 100%;
    height: 100%;
    position: absolute;
    top: -1px;
    left: 100%;
    border: 1px solid #aaa;
    overflow: hidden;
    z-index: 998;
    display: none;
    background: white;

    img {
      width: 200%;
      max-width: 200%;
      height: 200%;
      position: absolute;
      left: 0;
      top: 0;
    }
  }

  .event:hover ~ .mask,
  .event:hover ~ .big {
    display: block;
  }
}
</style>