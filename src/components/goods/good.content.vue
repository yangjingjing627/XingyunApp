<template>
  <ul class="bq-list-content">
    <slot></slot>
  </ul>
</template>
<script>
  export default {
    name: 'bq-good-content'
  }
</script>
<style lang="scss">
  .bq-list-content {
    display: block;
    width: 100%;
    background: #FBF9F1;
  }
</style>
