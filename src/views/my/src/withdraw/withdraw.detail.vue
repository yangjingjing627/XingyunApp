<template>
  <bq-page class="bq-page-withdraw">
    <bq-header title="提现详情"></bq-header>
    <bq-content class="bq-page-detail">
      <h2>提现金额</h2>
      <h1>{{ $bqUtils.moneyFixed(info.withDrawMoney) }}</h1>
      <h4 :class="{'red': info.status === 3, 'green': info.status === 2 }">{{ info.statusDesc }}</h4>
      <ul>
        <li>交易时间<div>{{info.withDrawTime}}</div></li>
        <li>提现单号<div>{{ info.widthDrawNo }}</div></li>
        <li>提现原因<div class="text">{{info.reason}}</div></li>
        <li><div class="line"><span>提现收款银行账户信息</span></div></li>
        <li>收款人姓名<div>{{info.payee}}</div></li>
        <li>开户行<div>{{info.bank}}</div></li>
        <li>银行卡账号<div>{{info.cardNumber}}</div></li>
        <li><div v-if='info.status === 3' class="line"><span>提现失败原因</span></div></li>
        <li v-if='info.status === 3'>
          {{ info.result }}
        </li>
        <li><div v-if='info.status === 2' class="line"><span>财务返款凭证</span></div></li>
        <li v-if='info.status === 2' @click="bigImg(imgs)">
          <img v-if="info.result" class="img" :src="info.result" alt="">
          特别提醒：若显示提现成功，您的收款账户一直未收到金额请内心等待，银行转账到账可能需要3-5个工作日。如有疑问请联系客服。
        </li>
      </ul>
    </bq-content>
    <img-big v-if="imgShow" :imgUrl="imgUrls"  @closeDialog="closeDialog"></img-big>
  </bq-page>
</template>
<script>
import MyService from '@/services/my.service'
export default {
  data() {
    return {
      info: {},
      imgUrls: '',
      imgShow: false,
      imgs: ''
    }
  },
  methods: {
    bigImg (imgUrl) { // 点击图片查看大图
      this.imgShow = true
      this.imgUrls = imgUrl
    },
    closeDialog () {
      this.imgShow = false
    }
  },
  async mounted() {
    this.MyService = new MyService()
    let id = this.$route.params.id
    this.info = await this.MyService.getWithDrawDetail({recordId: id})
  }
}
</script>
<style lang="scss">
  @import 'scss/variables.scss';
  .bq-page{
    position: relative;
    z-index: 1000;
  }
  .bq-page-detail {
    color: $font-color;
    background: #fff;
    font-size: 14px;
    font-family: PingFangSC-Regular;
    h1 {
      font-size: 34px;
      line-height: 33px;
      margin:20px auto;
      text-align: center;
      color: #000;
    }
    h2 {
      line-height: 33px;
      margin:20px auto;
      text-align: center;
      font-size: 16px;
      color: #333333;
    }
    h4 {
      line-height: 33px;
      margin:10px auto;
      text-align: center;
      font-size: 15px;
      color: #999999;
    }
    ul{
      li {
        padding: 0px 20px;
        margin: 20px auto;
        font-size: 15px;
        color: #999999;
        div {
          display: inline-block;
          margin-left: 20px;
          color: #333;
        }
      }
    }
    .line{
        width: 100%;
        height: 1px;
        border-top: 1px solid #D8D8D8;
        text-align: center;
        margin: 40px auto 20px auto;
        font-size: 14px;
        color: #999999;
        span{
          position: relative;
          top: -12px;
          background: #fff;
          padding: 0 20px;
        }
      }
    .btn {
      margin:30px 20px;
      width: calc(100% - 40px);
    }
    .red{
      color: red;
    }
    .green{
      color: green;
    }
    .img{
      width: 100%;
      height: 150px;
      margin: 10px auto;
    }
  }
</style>
