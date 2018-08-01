<template>
  <section class="bq-collapse">
    <slot></slot>
  </section>
</template>
<script>
export default {
  name: 'bq-collapse',
  data() {
    return {
      isActive: false
    }
  }
}
</script>
<style lang="scss">
  .bq-collapse {
    display: flex;
    flex-direction: column;
    .price{
      color: #ff8113;
    }
  }
</style>
