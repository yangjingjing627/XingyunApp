<template>
  <div class="bq-collapse-content" >
    <slot v-if="isActive"></slot>
  </div>
</template>
<script>
export default {
  name: 'bq-collapse-content',
  data() {
    return {
      isActive: this.$parent.isActive
    }
  },
  watch: {
    '$parent.isActive'(val) {
      this.isActive = val
    }
  }
}
</script>
<style lang="scss">
  .bq-collapse-content {
    background-color: #fff;
    // padding: 0 10px;
  }
</style>
