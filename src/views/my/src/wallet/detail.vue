<template>
  <bq-page >
    <bq-header title="交易详情"></bq-header>
    <bq-content class="bq-page-detail">
      <h1>{{info.moneyType==2?'-':info.moneyType==1?'+':''}}{{ $bqUtils.moneyFixed(info.transactionMoney) }}</h1>
      <ul>
        <li>交易类型：<div>{{ info.transactionType }}</div></li>
        <li>{{info.typeDesc}}：<div>{{info.orderCode}}</div></li>
        <li>交易时间：<div>{{info.transactionTime}}</div></li>
        <li v-if="info.orderType === 3">支付方式：<div>{{info.payType}}</div></li>
        <li v-if="info.orderType === 3">第三方流水单号：<div>{{info.payCode}}</div></li>
      </ul>
      <bq-button v-if="info.orderType === 5" type="primary" size="large" class="btn" @click="goLookDiff">查看差异商品明细</bq-button>
    </bq-content>
  </bq-page>
</template>
<script>
import MyService from '@/services/my.service'
export default {
  data() {
    return {
      info: {}
    }
  },
  methods: {
    goLookDiff() {
      this.$router.push(`/order/diffdetail/${this.info.orderCode}/trans`)
    }
  },
  async mounted() {
    this.MyService = new MyService()
    let id = this.$route.params.id
    this.info = await this.MyService.getTransactionDetail({transactionId: id})
  }
}
</script>
<style lang="scss">
  @import 'scss/variables.scss';
  .bq-page-detail {
    color: $font-color;
    font-size: 14px;
    h1 {
      font-size: 24px;
      line-height: 33px;
      margin:20px auto;
      text-align: center;
    }
    li {
      padding:0 15px;
      line-height: 24px;
      div {
        display: inline-block;
        float: right;
      }
    }
    .btn {
      margin:30px 20px;
      width: calc(100% - 40px);
    }
  }
</style>
