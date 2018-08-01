<template>
  <bq-page class="set-pwd">
    <bq-header title="手机验证"></bq-header>
    <bq-content>
        <p>验证码将发送到{{ mobile }}手机号</p>
        <bq-card>
          <bq-card-input padding fixed v-model="payCode" :maxlength="4">
            <bq-button slot="button" @click="sendCode" :disabled="isGet">
              {{ code_value }}
            </bq-button>
          </bq-card-input>
        </bq-card>
      <div class="wrap">
        <bq-button type="primary" size="large" class="bq-btn-next" :disabled="nextDisabled" @click.native="verifyCodePay">支付</bq-button>
      </div>
    </bq-content>
  </bq-page>
</template>
<script>
import OrderConfirmService from '../order.confirm.service'
export default {
  data() {
    return {
      payCode: '',
      mobile: this.$route.params.mobile,
      orderId: this.$route.params.orderId,
      code_value: '获取验证码',
      isGet: false,
      time: '',
      code: ''
    }
  },
  computed: {
    nextDisabled() {
      return this.payCode.length === 0
    }
  },
  beforeDestroy() {
    this.$messagebox.close()
    this.timer && clearTimeout(this.time)
  },
  mounted() {
    this.OrderConfirmService = new OrderConfirmService()
  },
  methods: {
    async verifyCodePay() {
      if (this.payCode.length <= 0) {
        this.$toast('请输入验证码')
        return
      }
      if (this.payCode.length > 4) {
        this.$toast('验证码长度不能超过4位')
        return
      }
      let params = {
        orderId: this.$route.params.orderId,
        payCode: this.payCode
      }
      try {
        let res = await this.OrderConfirmService.SureOrder(params)
        this.$router.push('/order/pay/success/' + res.orderCode + '/' + res.orderId)
      } catch (e) {
        this.$messagebox.alert(e.message)
      }
    },
    sendCode() {
      let params = {
        mobile: this.$route.params.mobile,
        orderCode: this.$route.params.orderCode
      }
      this.OrderConfirmService.getPayCode(params).then(() => {
        this.code_value = 60
        this.isGet = true
        this.time = setInterval(() => {
          if (this.code_value === 0) {
            this.code_value = '重新发送'
            this.isGet = false
            this.time && clearInterval(this.time)
            return
          }
          this.code_value = this.code_value - 1
        }, 1000)
      })
    }
  }
}
</script>
<style lang="scss">
  @import 'scss/variables.scss';
  @import 'scss/mixin.scss';
  .set-pwd {
    p {
      padding: 0 15px;
      @include font-dpr(14px);
      color: #505050;
      margin-top: 30px;
      margin-bottom: 15px;
    }
    .bq-content .scroller .bq-card{
      margin: 0 15px;
      .bq-input-label{
        display: none;
      }
      .bq-input-wrapper {
        overflow: hidden;
        padding: 0;
        margin-right: 0;
        .mint-button {
          width: 100px;
          height: 45px;
          @include font-dpr(14px);;
          border-left: 1px solid $light-border-color;
          border-top: 1px solid $light-border-color;
          .mint-button-text{
            @include font-dpr(14px);
            color: $danger;
          }
        }
      }
    }
    .btn {
      padding: 0 15px;
      margin-top: 70px;
    }
    .wrap {
      background: transparent;
      border: none;
      padding: 0 20px;
      color:#999;
      @include font-dpr(12px);
      line-height:12px;
      img {
        margin-right:3px;
        width: 14px;
        height: 12px;
      }
      .bq-btn-next {
        margin: 25px 0 10px;
      }
      p {
        line-height:18px;
      }
    }
  }
</style>
