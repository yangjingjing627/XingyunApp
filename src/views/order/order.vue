<template>
  <div class="bq-order">
    <bq-header title="订单列表" :isLeftIcon="true">
      <router-link to="/order/search" slot="right" class="bq-order-headright">
        订单查询
      </router-link>
    </bq-header>
    <bq-tabs v-model="selId" class="bq-order-tabs">
      <bq-tab v-for="item in tabList" :key="item.code" :id="item.code">{{item.name}}</bq-tab>
    </bq-tabs>
    <bq-content has-footer class="bq-order-content">
      <order-list :listinfo="listInfo">
      </order-list>
    </bq-content>
  </div>
</template>
<script>
import orderList from './order.list.vue'
export default {
  data () {
    return {
      tabList: [
        {name: '全部', code: '1'},
        {name: '待付款', code: '2'},
        {name: '待收货', code: '3'},
        {name: '已完成', code: '4'},
        {name: '已关闭', code: '5'},
        {name: '退货', code: '100'}
      ],
      selId: '1',
      listInfo: {searchObj: {type: 1}, orderType: 'order'}
    }
  },
  beforeMount() {
    let {type} = this.$route.params
    if (type) {
      this.selId = type
    }
  },
  watch: {
    selId(val) {
      if (this.selId === '100') {
        this.listInfo.orderType = 'return'
        this.listInfo.searchObj.type = 1
        return
      }
      this.listInfo.orderType = 'order'
      this.listInfo.searchObj.type = val
    }
  },
  components: {
    orderList
  }
}
</script>
<style lang="scss">
@import 'scss/variables.scss';
@import 'scss/mixin.scss';
.bq-order {
  .mint-header-button {
    .bq-order-headright {
      color: $font-color;
      @include font-dpr(14px);
    }
  }
  &-tabs {
    position: absolute;
    top: 44px;
  }
  &-content {
    top: 88px;
  }
}
</style>
