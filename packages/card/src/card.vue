<template>
  <div class="bq-card">
    <slot></slot>
  </div>
</template>
<script>
  export default {
    name: 'bq-card'
  }
</script>
<style lang="scss" >
  @import 'scss/variables.scss';
  @import 'scss/mixin.scss';
  .bq-card {
    // background-color: #fff;
    border-radius: $card-radius;
    @include border-zero-5 {
      border-radius: $card-radius * 2;
      width: 199.7%;
    };
    &[margin] {
      margin: 0 10px;
    }
    &[margin-top] {
      margin-top: 5px;
    }
  }
</style>
