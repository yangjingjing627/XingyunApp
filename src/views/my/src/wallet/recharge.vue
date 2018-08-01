<template>
  <bq-page class="bq-recharge">
    <bq-header title="充值">
    </bq-header>
    <bq-content>
      <p class="bq-recharge-title">充值金额：</p>
      <section class="bq-recharge-selmoeny">
        <div v-for="(item, index) in payMoneyArray" :key="'a'+index" :isseize="item==-1" :sel="item==selMoney" @click="selPayMoney(item)">
          <span v-if="item!=-1&&item!=-2">{{item}}元</span>
          <input v-if="item==-2" type="number" placeholder="其他金额" v-model="inputMoney" >
          <span v-if="item==-1"></span>
        </div>
      </section>
      <p class="bq-recharge-title">支付方式：</p>
      <bq-radios :options="payTypeList" align="right" v-model="selPayType" class="bq-recharge-paytype">
      </bq-radios>
      <p class="bq-recharge-payexplain">支付成功后，余额将直接充入您的账号金额的可使用余额中！</p>
      <p class="bq-recharge-payexplain" minmargintop>我已阅读并同意<u @click="$router.push('/me/wallet/rule')">用户协议</u></p>
      <section class="bq-recharge-fotbtn">
        <bq-button type="primary" size="large" @click="goPay">去支付</bq-button>
      </section>
    </bq-content>
  </bq-page>
</template>
<script>
import MyService from '@/services/my.service'
import WxService from '@/services/wx.service'
import WeiXinPay from '@/mixins/weixin.pay'
export default {
  mixins: [ WeiXinPay ],
  data () {
    return {
      selMoney: undefined,
      inputMoney: '',
      selPayType: 1,
      payMoneyArray: [],
      payTypeList: [
        {value: 1, text: '微信支付'}]// 1＝余额付款 2=支付宝支付 1＝微信支付
    }
  },
  async created () {
    this.MyService = new MyService()
    this.WxService = new WxService()
    let res = await this.MyService.getRechargeInfo()
    this.payMoneyArray = res.rechargeMoney
    this.payMoneyArray.push(-2)
    let ys = 3 - (this.payMoneyArray.length % 3)
    for (let j = 0; j < ys; ++j) {
      this.payMoneyArray.push(-1)
    }
    this.getOpenId()
    // console.log(this.$route.query)
  },
  methods: {
    selPayMoney(value) {
      if (value === -1) {
        return
      }
      this.selMoney = value
    },
    async getOpenId() {
      let {code} = this.$route.query
      if (code) {
        let {openid} = await this.WxService.getOpenId(code)
        this.openid = openid
        this.$messagebox.alert(openid)
      }
    },
    async goPay() {
      let payMony = 0
      if (!this.selMoney) {
        this.$messagebox.alert('请选择充值金额')
        return
      }
      if ((this.selMoney * 1) === -2) {
        if (!this.inputMoney) {
          this.$messagebox.alert('请输入大于零的充值金额')
          return
        }
        if ((this.inputMoney * 1) < 1) {
          this.$messagebox.alert('请输入大于1元的充值金额')
          return
        }
        payMony = (this.inputMoney * 1)
      } else {
        payMony = (this.selMoney * 1)
      }

      let params = {
        price: payMony,
        payType: this.selPayType,
        device: 'wechat_sub'
      }
      let openId = this.$cookie.get('openid')
      if (!openId) {
        this.$messagebox.alert('充值失败，请从“我的钱包”进入充值页面进行充值！')
        return
      }
      params.openId = openId

      let {wechatPayment, payType} = await this.MyService.payBalance(params)
      if ((this.selPayType * 1) !== (payType * 1)) {
        if ((this.selPayType * 1) === 1) {
          this.$messagebox.alert('请选择微信支付')
        }
        return false
      }
      // this.chooseWXPay(wechatPayment)
      this.getBrandWCPayRequest(wechatPayment)

      // 下面是掌柜云支付代码
      // let {path} = this.$route.query
      // if (path) {
      //   params.frontUrl = window.location.origin + path
      // } else {
      //   params.frontUrl = window.location.origin + '/me/wallet'
      // }
      // let {codeUrl, payType} = await this.MyService.payBalanceNew(params)
      // // 接口返回的支付方式是否和请求的支付方式相同
      // if ((this.selPayType * 1) !== (payType * 1)) {
      //   if ((this.selPayType * 1) === 1) {
      //     this.$messagebox.alert('请选择微信支付')
      //   }
      //   return false
      // }
      // window.location.href = codeUrl
    }
  }
}
</script>
<style lang="scss">
@import 'scss/variables.scss';
@import 'scss/mixin.scss';
.bq-recharge {
  &-title {
    padding: 0 15px;
    font-family: $font-family-base;
    @include font-dpr(14px);
    color: $font-color;
    margin-top: 20px;
  }
  &-selmoeny {
    margin-left: 15px;
    margin-right: 15px;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    > div {
      width: 100px;
      height: 45px;
      background-color: #fff;
      border: 1px solid #999999;
      margin-top: 10px;
      margin-bottom: 10px;
      font-family: $font-family-base;
      @include font-dpr(14px);
      color: $font-color;
      line-height: 45px;
      text-align: center;
      > input {
        border: 0px;
        width: 100%;
        height: 100%;
        text-align: center;
        background-color: rgba(0, 0, 0, 0);
      }
      &[sel=true] {
        background-color: $primary;

      }
      &[isseize=true] {
        border: 0;
        background-color: initial;
      }
    }
    > div:nth-of-type(3n-1) {
      margin-left: 18.5px;
      margin-right: 18.5px;
    }
  }
  &-paytype {
    margin-top: 10px;
    .bq-card-item {
      @include font-dpr(14px);
      color: $font-color;
    }
    .bq-checkbox-right {
      color: $danger;
      margin-right: 10px;
    }
  }
  &-payexplain {
    padding: 0 15px;
    margin-top: 20px;
    font-family: $font-family-base;
    @include font-dpr(14px);
    color: $font-color;
    &[minmargintop] {
      margin-top: 15px;
    }
    > u {
      color: $danger
    }
  }
  &-fotbtn {
    margin: 30px 0;
    padding: 0 15px;
  }
}
.bq-recharge .bq-radios .is-right .bq-checkbox-wrapper .bq-checkbox-label {
  margin-left: 0px;
}
</style>
