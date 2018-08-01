<!-- 原价划线加判断显示 -->
<template>
  <i class="yc-origin-price" v-if="goodsInfo.originalPrice && goodsInfo.originalPrice>goodsInfo.price">
  <!-- <i class="yc-origin-price"> -->
    <slot></slot>
  </i>
</template>
<script>
  export default {
    name: 'yc-origin-price',
    data() {
      return {
      }
    },
    props: {
      goodsInfo: {
        type: Object,
        default: {
          originalPrice: 0,
          price: 0
        }
      }
    }
  }
</script>
<style lang="scss">
  .yc-origin-price {
    text-decoration:line-through;
    color: #999;
    padding-left: 10px;
    display: inline-block;
  }
</style>
