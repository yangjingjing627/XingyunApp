<template>
  <bq-card class="search-bar">
    <scan @scan="onScan">
      <i class="scan"></i>
    </scan>
    <bq-card-input v-model="currentVal" padding fixed placeholder="输入商品名称／条码">
      <i class="search"></i>
    </bq-card-input>
  </bq-card>
</template>
<script>
export default {
  name: 'search-bar',
  data() {
    return {
      currentVal: this.value
    }
  },
  props: {
    value: {}
  },
  watch: {
    value(val) {
      this.currentVal = val
    },
    currentVal(val) {
      this.$emit('input', val)
    }
  },
  methods: {
    onScan(val) {
      this.$emit('scan', val)
    }
  }
}
</script>
<style lang="scss">
@import 'scss/variables';
@import 'scss/mixin.scss';
.search-bar {
  width: 100%;
  height: 44px;
  background-color: #fff;
  border-bottom: 1px solid $light-border-color;
  .scan {
    width: 25px;
    height: 25px;
    display: block;
    background: url(../../assets/img/classify/scan.png) no-repeat;
    background-size: 25px;
    position: absolute;
    left: 18px;
    top: 9px;
    z-index: 3;
  }
  .bq-input-wrapper{
    width: 70%;
    padding: 8px 0;
    margin: 0 auto;
    .bq-input{
      .text-input {
        margin: 0;
        padding: 0;
        height: 25px;
        color: #888888;
        @include font-dpr(15px);
        padding: 0px 35px;
        padding-right: 0;
        background: #FFF9DE;
        border: 1px solid $light-border-color;
      }
    }
    .bq-input-label {
      position: absolute;
      .search {
        width: 16px;
        height: 16px;
        display: block;
        background: url(../../assets/img/classify/search.png) no-repeat;
        background-size: 16px;
        position: absolute;
        left: 10px;
        top: 5px;
      }
    }
  }
}
</style>
