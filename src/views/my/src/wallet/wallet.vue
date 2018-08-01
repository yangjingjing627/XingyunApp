<template>
  <bq-page class="bq-wallet">
    <bq-header title="我的钱包">
      <router-link to="/me/wallet/paymentdetial" slot="right" class="bq-wallet-headright">
        收支明细
      </router-link>
    </bq-header>
    <bq-content>
      <section class="bq-wallet-total">
        <span>我的金额(元)</span>
        <span class="money"><i>¥</i>{{$bqUtils.moneyFixed(info.balance)}}</span>
      </section>
      <section class="bq-wallet-detail">
        <p>
          <span>{{$bqUtils.moneyFixed(info.canUseBalance)}}</span>
          <label>可使用</label>
        </p>
        <p class="bq-wallet__detailinterval">
          <span>{{$bqUtils.moneyFixed(info.shouldReceiveBalance)}}</span>
          <label>应收</label>
        </p>
        <p>
          <span>{{$bqUtils.moneyFixed(info.cashingBalance)}}</span>
          <label>提现中</label>
        </p>
      </section>
      <section class="bq-wallet-fotbtn">
        <bq-button type="primary" size="large" @click="goWallet">充值</bq-button>
      </section>
      <a class="bq-wallet-draw" v-if="info.storeType === 1" @click="withdraw">我要提现</a>
    </bq-content>
  </bq-page>
</template>
<script>
import MyService from '@/services/my.service.js'
import WxService from '@/services/wx.service'
export default {
  data () {
    return {
      info: { balance: 0, canUseBalance: 0, shouldReceiveBalance: 0, cashingBalance: 0, storeType: '' }
    }
  },
  async created () {
    this.MyService = new MyService()
    this.WxService = new WxService()
    let res = await this.MyService.getWalletInfo()
    this.info = res
  },
  methods: {
    async goWallet() {
      // 如果没有 openId
      if (!this.$cookie.get('openid')) {
        let res = await this.WxService.getOauthUrl('/me/wallet/recharge')
        window.location.replace(res)
        return
      }
      // this.$router.push('/me/wallet/recharge')
      window.location.href = '/me/wallet/recharge'
    },
    onBack () {
      console.log()
    },
    withdraw () {
      this.$router.push('/me/withdraw/go')
    }
  }
}
</script>
<style lang="scss">
@import 'scss/variables.scss';
@import 'scss/mixin.scss';
.bq-wallet {
  .mint-header-button {
    .bq-wallet-headright {
      color: $font-color;
      @include font-dpr(12px);
    }
  }
  &-total {
    height: 112px;
    display: flex;
    justify-content: center;
    flex-direction:column;
    background-color: #FEF3CC;
    font-family: $font-family-base;
    @include font-dpr(16px);
    border-bottom: 1px solid $border-color;
    color: $font-color;
    text-align: center;
    .money {
      @include font-dpr(36px);
      color: $danger;
      font-weight: 200;
      line-height: 36px;
      > i {
        @include font-dpr(20px);
      }
    }
  }
  &__detailinterval {
    @include border($border-color,0px);
    &:after {
      border-top: 0px;
      border-bottom: 0px;
    }
  }
  &-detail {
    height: 50px;
    display: flex;
    justify-content: center;
    margin-top: 10px;
    p {
      width: 33%;
      text-align: center;
      display: flex;
      justify-content: center;
      flex-direction:column;
      @include font-dpr(16px);
      color: $font-color;
      font-weight: 200;
      > label {
        @include font-dpr(12px);
        color: #666666;
      }
    }
  }
  &-fotbtn {
    margin: 30px 0;
    padding: 0 15px;
  }
  &-draw{
    display: inline-block;
    width: 20%;
    height: 50px;
    line-height: 50px;
    text-align: center;
    font-size: 16px;
    color: #FF8113;
    margin: 0 40%;
    font-weight: 200;
    text-decoration:underline;
  }
}
</style>
