<!-- 折扣 -->
<template>
  <span class="yc-mkt-discount">
    <slot></slot>
  </span>
</template>
<script>
  export default {
    name: 'yc-mkt-discount'
  }
</script>
<style lang="scss">
  .yc-mkt-discount {
    min-width: 32px;
    position: absolute;
    top: 0;
    left: 0;
    height: 16px;/*no*/
    line-height: 16px;/*no*/
    text-align: center;
    background-color: #50B24B;
    color: #fff;
    font-size: 10px;/*no*/
    background-clip: padding-box;
    box-sizing: border-box;
    z-index: 3;
  }
  .bq-android {
    .yc-mkt-discount {
      line-height: 17px;/*no*/
    }
  }
</style>
