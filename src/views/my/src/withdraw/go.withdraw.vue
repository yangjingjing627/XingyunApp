<template>
  <bq-page class="withdraw-set">
    <bq-header title="我要提现">
      <router-link to="/me/withdraw/record" slot="right" class="bq-wallet-headright">
        提现记录
      </router-link>
    </bq-header>
    <bq-content>
      <bq-card padding class="remark-box">
        <bq-card-input padding class="tip1"  stacked v-model="param.withDrawMoney" placeholder="输入提现金额" >
          可提现金额<span class="text_red">*</span>：
        </bq-card-input>
        <div class="tip3 tip4">特别提醒：目前只有门店闭店不合作了才允许提现，否则您提交的提现申请将会被驳回</div>
        <bq-card-header class="areatext-header" title="提现原因">
          <span class="text_red">*</span>
          <!-- <span class="remark-tip">（不允许输入表情符号和特殊字符）</span> -->
        </bq-card-header>
        <bq-card-input  class="areatext" padding type="textarea" :maxlength="maxRemarkLength" placeholder="简明填写提现原因可能会快速收到提现金额" v-model="param.reason">
        </bq-card-input>
        <span class="remark-count" :class="{full: param.reason.length == maxRemarkLength}">{{param.reason.length}}/{{maxRemarkLength}}</span>
      </bq-card>
      <div class="tip2">- 提现收款银行账户信息 -</div>
      <bq-card padding>
        <bq-card-input padding margin stacked placeholder="请与收款银行卡开户姓名保持一致" v-model="param.payee" :maxlength="maxName">
          收款人姓名<span class="text_red">*</span>：
        </bq-card-input>
        <bq-card-input padding margin stacked placeholder="请详细填写到具体开户行所在支行" v-model="param.bank" :maxlength="maxBank" >
          开户行<span class="text_red">*</span>：
        </bq-card-input>
        <div class="tip3">示例：农业银行济南国际会展中心支行</div>
        <bq-card-input padding margin stacked placeholder="请正确填写银行卡账号" v-model="param.cardNumber" :maxlength="maxCard">
          银行卡账号<span class="text_red">*</span>：
        </bq-card-input>
      </bq-card>
      <div class="btn">
        <bq-button type="primary" slot="button" size="large" :disabled="isShow" @click="postInfo">确认并提交</bq-button>
      </div>
    </bq-content>
    <withdraw-safe v-if="showDiag" :info="safeInfo"  @closeDialog="closeGiftsDialog"></withdraw-safe>
  </bq-page>
</template>
<script>
import MyService from '@/services/my.service'
export default {
  data() {
    return {
      param: {
        withDrawMoney: '',
        reason: '',
        payee: '',
        bank: '',
        cardNumber: ''
      },
      maxRemarkLength: 200,
      limit: '',
      maxName: 20,
      maxBank: 50,
      maxCard: 30,
      showDiag: false,
      safeInfo: {}
    }
  },
  async mounted () {
    this.MyService = new MyService()
    this.getMoneyInfo() // 获取当前提现金额
  },
  computed: {
    isShow() {
      return this.param.withDrawMoney.length <= 0 || this.param.reason.length <= 0 || this.param.payee.length <= 0 || this.param.bank.length <= 0 || this.param.cardNumber.length <= 0
    }
  },
  methods: {
    closeGiftsDialog() {
      this.safeInfo = {}
      this.showDiag = false
    },
    async getMoneyInfo() {
      let res = await this.MyService.getWalletInfo()
      this.param.withDrawMoney = res.canUseBalance
      this.limit = res.canUseBalance
    },
    postInfo() {
      if (!this.param.reason || !this.param.payee || !this.param.bank || !this.param.cardNumber) {
        this.$messagebox.alert('请将信息填写完整')
        return
      }
      if (!this.$bqUtils.posMoney(parseFloat(this.param.withDrawMoney)) || parseFloat(this.param.withDrawMoney) <= 0) {
        this.$messagebox.alert('请输入正确的可提现金额')
        return
      }
      if (parseFloat(this.param.withDrawMoney) > parseFloat(this.limit)) {
        this.$messagebox.alert('您当前最大可提现金额为' + this.limit)
        return
      }
      if (!this.param.reason) {
        this.$messagebox.alert('请输入提现原因')
        return
      }
      // if (!this.$bqUtils.isNorString(this.param.reason)) {
      //   this.$messagebox.alert('提现原因仅限输入汉字、数字、字母，标点符号')
      //   return
      // }
      if (!this.$bqUtils.vRegister(this.param.payee)) {
        this.$messagebox.alert('收款人姓名仅限输入汉字、数字、字母')
        return
      }
      if (!this.$bqUtils.vRegister(this.param.bank)) {
        this.$messagebox.alert('开户行仅限输入汉字、数字、字母')
        return
      }
      if (!this.$bqUtils.posinteger(this.param.cardNumber) || this.param.cardNumber.length < 6) {
        this.$messagebox.alert('银行卡账号仅限输入6~30位数字')
        return
      }
      delete this.param.storeId
      this.showDiag = true
      this.safeInfo = this.param
    },
    record () {
      this.$router.replace('/me/withdraw/record')
    }
  }
}
</script>
<style lang="scss">
@import 'scss/variables';
@import 'scss/mixin';
  .withdraw-set {
    .mint-header-button {
      .bq-wallet-headright {
        color: $font-color;
        @include font-dpr(12px);
      }
    }
    .bq-card:after {
      border-top: none;
      border-left: none;
      border-right: none;
    }
    input {
      @include font-dpr(14px);
      color: #505050;
    }
    input::-webkit-input-placeholder {
      /* WebKit browsers */
      color: #fff;
   }
   input:-moz-placeholder {
     /* Mozilla Firefox 4 to 18 */
     color: #fff;
   }
   input::-moz-placeholder {
     /* Mozilla Firefox 19+ */
     color: #fff;
   }
   input::-ms-input-placeholder {
     /* Internet Explorer 10+ */
     color: #fff;
   }
   .bq-content{
     font-family: PingFangSC-Regular;
   }
   .bq-footer{
     margin-top: 20px;
   }
   .btn {
     padding: 31px 15px 0 15px;
   }
    .bq-card {
      &.remark-box {
        padding-bottom: 20px;
        .bq-input-wrapper:after {
          background: none;
        }
        .bq-input-wrapper{
          padding-top: 10px;
          padding-bottom: 0;
        }
      }
    }
    .areatext{
      padding: 10px 19px;
      height: 127px;
      @include font-dpr(14px);
      border: 1px solid $light-border-color;
      margin-bottom: 10px;
      &:after {
        content: none;
      }
    }
    .areatext-header:after {
      border-bottom: none;
    }
    .text_red{
      font-size: 15px;
      color: #FF4E13;
      line-height: 14px;
    }
    .remark-tip{
      color: #666;
      @include font-dpr(12px);
    }
    .remark-count {
      float: right;
      margin-right: 15px;
      margin-bottom: 20px;
      @include font-dpr(14px);
      &.full {
        color: #FF4E13;
      }
    }
    .tip1{
      border-bottom: 1px solid #D8D8D8;
      .text-input {
        font-size: 20px!important;
        color: #333333;
      }
    }
    .tip2{
      width: 60%;
      text-align: center;
      margin: 0 20%;
      height: 44px;
      line-height: 44px;
      font-size: 14px;
      color: #666666!important;
      font-family: PingFangSC-Regular;
    }
    .tip3{
      padding-top: 7px;
      font-size: 14px;
      color: #CCCCCC;
      padding-left: 15px;
    }
    .tip4{
      color: red;
    }
  }
</style>
