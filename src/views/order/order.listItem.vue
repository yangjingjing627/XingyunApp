<template>
  <bq-card class="item-wrap" @click.native="goDetail(orderType,orderItem)">
    <bq-card-content padding v-if="orderType=='order' && orderItem.orderCode">
      <p>{{orderItem.orderCode}}<div class="btn">{{orderItem.status_str}}</div></p>
      <p>商品数量：{{orderItem.buyCount}}</p>
      <p>下单时间：{{orderItem.addTime}}</p>
      <p>订单金额：¥{{$bqUtils.moneyFixed(orderItem.orderPrice)}}（{{orderItem.payStatusDesc}}）</p>
    </bq-card-content>
    <bq-card-content padding  v-if="orderType=='return' && orderItem.returnOrderCode">
      <p>{{orderItem.returnOrderCode}}<div class="btn">{{orderItem.status_str}}</div></p>
      <p>退货数量：{{orderItem.returnNum}}</p>
      <p>退货时间：{{orderItem.returnTime}}</p>
      <p>退货金额：¥{{$bqUtils.moneyFixed(orderItem.returnPrice)}}</p>
    </bq-card-content>
    <bq-card-footer v-if="orderType=='order' && orderItem.status!=1 && orderItem.status!=2 && orderItem.status!=6">
      <bq-button size="small" type="primary" class="bq-btn" v-if="orderItem.status==0" @click.stop="orderCancle(orderItem)">取消订单</bq-button>
      <bq-button size="small" type="primary" class="bq-btn" v-if="orderItem.status==0" @click.stop="$router.push(`/order/pays/${orderItem.orderId}/1`)">去支付</bq-button>
      <bq-button size="small" type="primary" class="bq-btn" v-if="orderItem.status==3" @click.stop="$router.push(`/order/confirm/${orderItem.orderId}`)">确认收货</bq-button>
      <bq-button size="small" type="primary" class="bq-btn" v-if="orderItem.diff" @click.stop="$router.push(`/order/diffdetail/${orderItem.orderId}/order`)">差异查看</bq-button>
      <bq-button size="small" type="primary" class="bq-btn" v-if="orderItem.status==4 || orderItem.status==5" @click.stop="$router.push(`/order/returnselect/${orderItem.orderId}`)">退货</bq-button>
    </bq-card-footer>
    <bq-card-footer v-if="orderType=='return' && orderItem.status == 0">
      <bq-button size="small" type="primary" class="bq-btn" @click.stop="orderCancle(orderItem)">取消退货</bq-button>
    </bq-card-footer>
  </bq-card>
</template>
<script>
import OrderService from '@/services/order.service.js'
export default {
  data () {
    return {
      orderItem: this.orderitem,
      orderType: this.ordertype
    }
  },
  props: {
    orderitem: Object,
    ordertype: String
  },
  created () {
    this.OrderService = new OrderService()
    if (this.orderType === 'order') {
      // 设置状态信息
      switch (this.orderItem.status) {
        case 0:
          this.orderItem.status_str = '待付款'
          break
        case 1:
          this.orderItem.status_str = '待确认'
          break
        case 2:
        case 3:
          this.orderItem.status_str = '待收货'
          break
        case 4:
        case 5:
          this.orderItem.status_str = '已完成'
          break
        case 6:
        case 9:
          this.orderItem.status_str = '已取消'
          break
        case 10:
          this.orderItem.status_str = '待卖家差异审核'
          break
        case 20:
          this.orderItem.status_str = '待平台差异审核'
          break
      }
    } else {
      // 设置退货状态信息
      switch (this.orderItem.status) {
        case 0:
          this.orderItem.status_str = '退货待审核'
          break
        case 1:
          this.orderItem.status_str = '待收货确认'
          break
        case 2:
          this.orderItem.status_str = '退货成功'
          break
        case 3:
          this.orderItem.status_str = '退货失败'
          break
      }
    }
  },
  methods: {
    // 删除订单信息
    async orderCancle (orderItem) {
      let warnStr = '此订单'
      if (this.orderType !== 'order') {
        warnStr = '退货'
      }
      await this.$messagebox.confirm(`您确定要取消${warnStr}吗?`, ``)
      let res = null
      if (this.orderType === 'order') {
        res = await this.OrderService.orderCancle(orderItem.orderId)
      } else {
        res = await this.OrderService.returnCancle(orderItem.returnOrderId)
      }
      if (res === true) {
        await this.$messagebox.alert(`订单已取消`)
        if (this.orderType === 'order') {
          orderItem.status = 6
          orderItem.status_str = '已取消'
        } else {
          orderItem.status = 3
          orderItem.status_str = '退货失败'
        }
      }
    },
    // 页面跳转到详情或退货详情
    goDetail (type, orderItem) {
      if (type === 'order') {
        this.$router.push(`/order/detail/${orderItem.orderId}`)
      }
      if (type === 'return') {
        this.$router.push(`/order/returndetail/${orderItem.returnOrderId}`)
      }
    }
  }
}
</script>
<style lang="scss">
@import 'scss/variables.scss';
@import 'scss/mixin.scss';
.order-list {
  .item-wrap {
    margin-top: 11px;
    @include font-dpr(14px);
    color: $font-color;
    &:first-child {
      margin-top: 9px;
    }
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
}
</style>
