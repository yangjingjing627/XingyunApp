<template>
  <div class="bq-card-header bq-f-size-14"> {{ title }}
    <slot></slot>
  </div>
</template>
<script>
  export default {
    name: 'bq-card-header',
    props: {
      title: {
        type: String,
        require: true
      }
    }
  }
</script>
<style lang="scss">
  @import 'scss/variables.scss';
  @import 'scss/mixin.scss';
  .bq-card-header {
    height: $card-header-height;
    line-height: $card-header-height;
    color: $card-header-color;
    border-top-left-radius: $card-radius;
    border-top-right-radius: $card-radius;
    letter-spacing: 0;
    padding-left: 15px;
    @include border-bottom;
  }
</style>
