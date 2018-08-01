<template>
  <div class="bq-card-content">
    <slot></slot>
  </div>
</template>
<script>
  export default {
    name: 'bq-card-content'
  }
</script>
<style lang="scss">
  @import 'scss/variables.scss';
  .bq-card-content{
    padding: 10px 15px;
    color: $font-color;
  }
</style>
