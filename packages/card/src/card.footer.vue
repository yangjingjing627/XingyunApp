<template>
  <div class="bq-card-footer">
    <slot></slot>
  </div>
</template>
<script>
  export default {
    name: 'bq-card-footer'
  }
</script>
<style lang="scss">
  @import 'scss/variables.scss';
  @import 'scss/mixin.scss';
  .bq-card-footer {
    height: $card-footer-height;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    @include border-top;
    padding: 0 20px;
    z-index: 3;
    .mint-button {
      height: 30px;
      line-height: 30px;
      margin-left: 10px;
      z-index: 4px;
      .mint-button-text {
        @include font-dpr(14px);
      }
    }
  }
</style>
