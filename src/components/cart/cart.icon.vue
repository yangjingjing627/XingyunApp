<template>
  <div class="yc-card-icon" >
    <a class="yc-card-icon-content"  @click="$router.push('/cart')" href="javascript:void(0);">
      <i class="bq-icon-cart-max"></i>
      <cart-count></cart-count>
    </a>
  </div>
</template>
<script>

export default {
  name: 'yc-card-icon'
}
</script>
<style lang="scss">
  .yc-card-icon {
    position: fixed;
    z-index: 1200;
    right: 16px;
    bottom: 56px;
    &-content {
      width: 50px;
      height: 50px;
      position: relative;
      .badge {
        position: absolute;
        top: -12px;
        right: 2px;
      }
    }
  }
</style>
