<template>
  <bq-page class="bq-page-order-search-result">
  <bq-header :title="title"></bq-header>
  <bq-content>
    <order-list :listinfo="listinfo"></order-list>
  </bq-content>
  </bq-page>
</template>
<script>
import orderList from '@/views/order/order.list.vue'
import {mapGetters} from 'vuex'
export default {
  data() {
    return {
      listinfo: {},
      typeData: {},
      isOrder: true
    }
  },
  computed: {
    ...mapGetters({
      params: 'getOrderSearchParams'
    }),
    title() {
      let typeString = this.isOrder === 'true' ? '订' : '退货'
      return `${typeString}单查询结果`
    }
  },
  beforeMount() {
    this.isOrder = this.$route.params.isOrder
    let searchObj = this.params
    this.listinfo = {searchObj, orderType: this.isOrder === 'true' ? 'order' : 'return'}
  },
  components: {
    orderList
  }
}
</script>
<style lang="scss">
  @import 'scss/variables.scss';
  .bq-page-order-search-result {
    .item-wrap[margin-top] {
      margin-top: 11px;
      position: relative;
      font-size: 14px;
      line-height: 21px;
    }
    .btn {
      color: $danger;
      position: absolute;
      top: 9.5px;
      right: 20px;
    }
    .bq-btn {
      width: 100px;
      margin-left: 20px;
      &:first-child {
        margin-left: 0;
      }
    }
    .no-data-msg {
      margin: 50px auto;
      text-align: center;
    }
  }
</style>
