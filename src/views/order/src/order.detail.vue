<template>
  <bq-page class="bq-orddetail">
    <bq-header title="订货单详情">
    </bq-header>
    <bq-content :class="{'show-footer': show_footer}">
      <bq-card class="bq-orddetail-state">
        <bq-card-content padding>
          <p>订单状态：<span class="dangercol">{{infoStatusStr}}</span></p>
          <p>卖家姓名：{{info.sellerStoreName}}</p>
          <p>订货单号：{{info.orderCode}}</p>
          <p v-if="info.thirdOrderCode">京东订单号：{{info.thirdOrderCode}}</p>
          <p>下单时间：{{info.addTimeStr}}</p>
        </bq-card-content>
      </bq-card>
      <bq-card class="bq-orddetail-money">
        <bq-card-content padding>
          <p>商品总价格：<span>¥{{$bqUtils.moneyFixed(info.totalPrice)}}</span></p>
          <p v-if="info.carriageMoney">配送费用：<span><i>+ ¥</i>{{ $bqUtils.moneyFixed(info.carriageMoney) }}</span></p>
          <p v-if="info.couponMoney">优惠券：<span><i>- ¥</i>{{ $bqUtils.moneyFixed(info.couponMoney) }}</span></p>
          <p v-if="info.fullCutMoney">
            满减优惠：
            <span class="dangercol">¥{{$bqUtils.moneyFixed(info.fullCutMoney)}}</span>
          </p>
          <p v-if="info.discountMoney">
            促销优惠：<span class="dangercol">¥{{$bqUtils.moneyFixed(info.discountMoney)}}</span>
          </p>
          <p v-if="info.fullCountMoney">
            满件优惠：<span class="dangercol">¥{{$bqUtils.moneyFixed(info.fullCountMoney)}}</span>
          </p>
          <p v-if="info.groupCountMoney">
            组合优惠：<span class="dangercol">¥{{$bqUtils.moneyFixed(info.groupCountMoney)}}</span>
          </p>
          <p v-if="info.singleCountMoney">
            直降优惠：<span class="dangercol">¥{{$bqUtils.moneyFixed(info.singleCountMoney)}}</span>
          </p>
          <p>应付款：<span class="dangercol">¥{{$bqUtils.moneyFixed(info.payPrice)}}</span>（{{info.payStatusDesc}}）</p>
        </bq-card-content>
      </bq-card>
      <bq-card class="bq-orddetail-goods">
        <bq-card-header title="进货列表"></bq-card-header>
          <bq-card-item padding :icon="true" @click.native="isProductList=true">
            <span slot="right" class="bq-f-size-12">共{{info.goodsKindNum }}种,总数{{info.goodsCount}}</span>
              <item-img :getGoodImg= "info.goodsList" :isDetail="true"></item-img>
          </bq-card-item>
      </bq-card>
      <bq-card>
        <bq-card-header title="收货信息"></bq-card-header>
        <bq-card-content padding class="good-info">
          <span>收货人：{{info.storeName}}</span>&nbsp;&nbsp;&nbsp;&nbsp;
          <span>{{info.storePhone}}</span>
          <p>收货地址：{{info.storeAddress}}</p>
        </bq-card-content>
      </bq-card>
      <bq-card>
        <bq-card-header title="备注信息"></bq-card-header>
        <bq-card-item class="givetime">
          期望送达时间：{{info.sendTime}}
        </bq-card-item>
        <bq-card-content  padding>
          {{info.remark}}
        </bq-card-content>
      </bq-card>
    </bq-content>
    <bq-footer>
      <button  v-if="info.status==0" class="canselbtn" @click="cancelOrder">取消订单</button><button v-if="info.status==0" class="gopaybtn" @click.stop="$router.push(`/order/pays/${orderid}/2`)">去支付（剩余{{payTime}}）</button>
      <bq-button v-if="info.status==3" type="primary" size="large" @click="$router.push(`/order/confirm/${orderid}`)">确认收货</bq-button>
      <bq-button v-if="info.status==4 || info.status==5" type="primary" size="large" @click="$router.push(`/order/returnselect/${orderid}`)">退货</bq-button>
    </bq-footer>
     <order-confirm-list :getGoodImg="info.goodsList" v-model="isProductList"></order-confirm-list>
  </bq-page>
</template>
<script>
import OrderService from '@/services/order.service'
export default {
  data () {
    return {
      orderid: '',
      info: {goodsList: []},
      payTimeInterval: null,
      payTime: '',
      isProductList: false,
      show_footer: false
    }
  },
  computed: {
    infoStatusStr () {
      let statusStr = ''
      switch (this.info.status) {
        case 0:
          statusStr = '待付款'
          break
        case 1:
          statusStr = '待确认'
          break
        case 2:
        case 3:
          statusStr = '待收货'
          break
        case 4:
        case 5:
          statusStr = '已完成'
          break
        case 6:
        case 9:
          statusStr = '已取消'
          break
        default:
          this.info.statusStr = ''
          break
      }
      return statusStr
    }
  },
  async mounted () {
    this.orderid = this.$route.params.orderId
    this.OrderService = new OrderService()
    let res = await this.OrderService.getOrderDetail({orderId: this.$route.params.orderId})
    this.info = res
    if (this.info.status === 0 || this.info.status === 3 || this.info.status === 4 || this.info.status === 5) {
      this.show_footer = true
    }
    this.payTime = this.countDown()
    this.payTimeInterval = setInterval(() => {
      this.payTime = this.countDown()
    }, 1000)
    // 对下单日期进行更改
    let date = new Date(this.info.addTime * 1000)
    this.info.addTimeStr = this.$bqUtils.date2str(date) + ' ' + this.$bqUtils.time2str(date)
    // 对支付方式进行改变
    switch (this.info.payType) {
      case 3:
        this.info.payTypeStr = '余额支付'
        break
      case 4:
        this.info.payTypeStr = '货到付款'
        break
      default:
        this.info.payTypeStr = '未知'
        break
    }
  },
  methods: {
    countDown() {  // 计算支付剩余时间
      this.payTimeInterval = null
      let payremain = this.$bqUtils.getPayRemain(this.info.addTime)
      if (payremain === false) {
        this.payTimeInterval && clearInterval(this.payTimeInterval)
        return '支付超时'
      } else {
        return payremain
      }
    },
    // 取消订单
    async cancelOrder() {
      await this.$messagebox.confirm(`您确定要取消此订单吗?`, ``)
      let res = await this.OrderService.orderCancle(this.$route.params.orderId)
      if (res === true) {
        await this.$messagebox.alert(`订单已取消`)
        this.info.status = 6
      }
    }
  }
}
</script>
<style lang="scss">
@import 'scss/variables';
@import 'scss/mixin.scss';
.bq-orddetail {
  .show-footer {
    margin-bottom: 57px;
  }
  .bq-card {
    @include font-dpr(14px);
    color: $font-color;
    margin-top: 7px;
    &:first-child {
      margin-top:0px
    }
  }
  .dangercol {
    color: $danger
  }
  &-state {
    &:after {
      border-top: 0px;
    }
    span {
      position: absolute;
      right: 20px;
    }
  }
  &-money {
    margin-top: 7px;
  }
  &-goods {
    margin-top: 7px;
    .item-img {
      height: auto;
      line-height: initial;
    }
  }
  .good-info {
    span {
      // padding-right: 40px;
    }
  }
  .givetime {
    margin-top: 5px;
    margin-bottom: 5px;
  }

  .bq-card-item {
    &:after {
      width: 0;
      height: 0;
    }
    .bq-card-item__right {
      flex: none;
    }
  }

  .canselbtn {
    height: 52px;
    color: #fff;
    width: 30%;
    border: 0px;
    background-color: #ccc;
    @include font-dpr(16px);
  }

  .gopaybtn {
    height: 52px;
    color: $font-color;
    width: 70%;
    border: 0px;
    background-color: $primary;
    @include font-dpr(16px);
  }

}

.bq-card.bq-orddetail-state {
  &:after {
    border-top: none;
  }
}
</style>
