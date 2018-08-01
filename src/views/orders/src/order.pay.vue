<template>
  <bq-page class="bq-order-pay">
  <bq-header title="余额支付" ></bq-header>
   <bq-content has-footer>
     <div class="order-pay-content">
       <div class="bq-countdown">支付剩余时间：{{ addtime1 || '支付超时'}}</div>
       <div class="bq-amount">支付金额：<p class="price">￥<span>{{ orderInfo.payPrice }}</span></p></div>
       <div class="bq-balance">可用账户余额：¥{{ orderInfo.balance }}</div>
     </div>
    </bq-content>
    <bq-footer v-if="enable_pay">
        <bq-button v-if="orderInfo.moneyStatus" type="primary" size="large"   @click.native="goPay()">确认支付</bq-button>
        <bq-button v-if="!orderInfo.moneyStatus" type="primary" size="large"  @click.native="goRecharge()">可使用余额不足，点此充值</bq-button>
    </bq-footer>
  </bq-page>
</template>
<script>
import OrderConfirmService from '../order.confirm.service'
import WxService from '@/services/wx.service'
export default {
  data() {
    return {
      addtime: '',
      addtime1: '',
      enable_pay: false,
      time: null,
      orderInfo: {},
      passWord: '',
      flaginfo: '',
      flagpwd: '',
      payShow: false,
      mobile: '',
      orderCode: '',
      orderId: ''
    }
  },
  mounted() {
    this.OrderConfirmService = new OrderConfirmService()
    this.WxService = new WxService()
    this.getSureOrderInfo()
  },
  methods: {
    goCart() {
      if (this.$route.params.payflag === '1' || this.$route.params.payflag === '2') {
        window.history.go(-1)
      }
      window.history.go(-2)
    },
    async getSureOrderInfo() {
      let params = {
        orderId: this.$route.params.sellerId,
        type: 'confirmPayment'
      }
      try {
        let res = await this.OrderConfirmService.getSureOrder(params)
        this.orderInfo = res
        this.flaginfo = res.flag
        this.flagpwd = res.pwd
        this.addtime = res.addTime
        this.mobile = res.mobile
        this.orderCode = res.orderCode
        this.orderId = res.orderId
        // window.clearInterval(this.time)
        let payremain = this.$bqUtils.getPayRemain(this.addtime)
        this.enable_pay = true
        if (payremain === false) {
          this.enable_pay = false
        } else {
          this.addtime1 = this.$bqUtils.getPayRemain(this.addtime)
        }
        this.time = setInterval(() => {
          this.countDown()
        }, 1000)
      } catch (e) {
        this.$messagebox.alert(e.message)
      }
    },
    async goPay() { // 确认支付
      if (this.flaginfo === true) {
        if (this.flagpwd === true) {
          this.$pay().then(val => {
            if (val.value.length !== 6) {
              this.$messagebox.alert('输入的支付密码不正确')
              return
            }
            this.SureOrder(val.value)
          })
        } else {
          this.$messagebox.alert('您还未设置支付密码<br/>请去先设置支付密码再支付', '', {
            confirmButtonText: '去设置'
          }).then(() => {
            this.$router.push('/me/passwordset/getcode/0') // 设置密码
          })
        }
      } else {
        this.$router.push('/order/iphone/paypawd/' + this.mobile + '/' + this.orderCode + '/' + this.orderId)
      }
    },
    // 提交订单 payPwd 支付密码
    async SureOrder(payPwd) {
      let params = {
        orderId: this.$route.params.sellerId,
        payCode: payPwd,
        source: 'payPassword'
      }
      try {
        let res = await this.OrderConfirmService.SureOrder(params)
        this.orderInfo = res
        this.addtime = res.addTime
        this.time = setInterval(() => {
          this.countDown()
        }, 1000)
        this.$router.replace('/order/pay/success/' + res.orderCode + '/' + res.orderId)
      } catch (e) {
        if (e.data) {
          if (e.data.diffStatus === 2) {
            this.$messagebox.confirm(e.message, '', {
              confirmButtonClass: 'bq-msg-confirm-ok',
              confirmButtonText: '继续支付',
              cancelButtonClass: 'bq-msg-confirm-cancel',
              cancelButtonText: '取消'
            }).then(() => {
              let par = {
                receiveChangePrice: 1,
                orderId: this.$route.params.sellerId,
                payCode: payPwd,
                source: 'payPassword'
              }
              let res = this.OrderConfirmService.SureOrder(par)
              this.$router.replace('/order/pay/success/' + res.orderCode + '/' + res.orderId)
            }, err => {
              this.$messagebox.confirm(err, '操作提示')
            })
          } else if (e.data.diffStatus === 1 || e.data.diffStatus === 3 || e.data.diffStatus === 4) {
            this.$messagebox.alert(e.message, '', {
              confirmButtonText: '重新选购'
            }).then(() => {
              this.$router.push('/home')
            })
          }
        } else {
          this.$messagebox.alert(e.message)
        }
      }
    },
    countDown() {  // 计算支付剩余时间
      this.time = null
      let payremain = this.$bqUtils.getPayRemain(this.addtime)
      if (payremain === false) {
        this.time && clearInterval(this.time)
        this.enable_pay = false
        return '支付超时'
      } else {
        this.addtime1 = this.$bqUtils.getPayRemain(this.addtime)
        return payremain
      }
    },
    async goRecharge () {
      // 如果没有 openId
      let path = window.location.pathname
      if (!this.$cookie.get('openid')) {
        let res = await this.WxService.getOauthUrl('/me/wallet/recharge?path=' + path)
        window.location.replace(res)
        return
      }
      // this.$router.push('/me/wallet/recharge?path=' + path)
      window.location.href = '/me/wallet/recharge?path=' + path
    }
  },
  beforeDestroy() {
    this.$messagebox.close()
  }
}
</script>
<style lang="scss">
@import 'scss/variables.scss';
@import 'scss/mixin.scss';
.bq-order-pay{
.bq-icon-i{
  position: absolute;
  top: 12px;
  left: 14px;
  display: block;
  width: 20px;
  height: 20px;
  background: url('../../../assets/img/icon/return_black.png') no-repeat;
  background-size: 100%;
  z-index: 99999;
}
  .order-pay-content{
    width: 100%;
    height: auto;
    .bq-countdown{
      width: 100%;
      height: 40px;
      background: #FEF3CC;
      @include font-dpr(14px);
      color: $danger;
      line-height: 40px;
      text-align: center;
    }
    .bq-amount{
      @include font-dpr(16px);
      color: $font-color;
      width: 100%;
      // height: 142px;
      text-align: center;
      margin: 40px auto;
      .price{
        color: $danger;
        padding: 5px 15px;
        @include font-dpr(20px);
        span{
          @include font-dpr(36px);
          }
        }
    }
    .bq-balance{
      width: 100%;
      height: 40px;
      background: #FEF3CC;
      @include font-dpr(14px);
      color: $font-color;
      line-height: 40px;
      text-align: center;
    }
  }
}
</style>
