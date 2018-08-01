<template>
  <div class="modify">
    <div class="ding" @click="onOpenDing(propertyStocks)" :class="{'no': propertyStocks === 0}">订</div>
  </div>
</template>
<script>
  export default {
    props: {
      // sku
      sku: String,
      // 卖家id
      sellerId: Number,
      propertyStocks: Number,
      type: {}
    },

    methods: {
      onOpenDing(propertyStocks) {
        if (propertyStocks === 0) {
          return
        }
        this.$ding({
          sku: this.sku,
          sellerId: this.sellerId,
          type: this.type
        })
      }
    }
  }
</script>
<style lang="scss">
  @import './modify.scss';
</style>
