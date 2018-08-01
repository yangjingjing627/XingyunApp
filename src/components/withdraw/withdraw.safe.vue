<template>
  <div class="user-withdraw">
    <div class="dialog-content">
      <p class="bq-f-size-16">提现安全校验</p>
      <span>请用当前绑定手机号:{{mobile}}</span>
        <button class="getpas" :class="{'active': isNum(code_value)}" slot="button" @click="sendCode" :disabled="isGet">
          <i v-if='!isNum(code_value)'>{{ code_value }}</i>
          <i v-if='isNum(code_value)'>{{ code_value }}s</i>
        </button>
        <bq-code class="pay-pwd" v-model="codeVer" ></bq-code>
        <div class="btn-all">
          <button  class="btn bq-f-size-16" @click="cancel">取消</button>
          <button  class="btn bq-f-size-16" :class="{'disabled': !codeVer}" :disabled="!codeVer" @click="sure">确定</button>
        </div>
    </div>
  </div>
</template>
<script>
import bqCode from './code.vue'
import MyService from '@/services/my.service'
export default {
  name: 'withdraw-safe',
  data() {
    return {
      code_value: '获取验证码',
      isGet: false,
      time: '',
      code: '',
      codeVer: '',
      mobile: '',
      isDo: false
    }
  },
  props: {
    info: {},
    type: '',
    tagShow: {}
  },
  watch: {
    'codeVer'(val) {
      // if (val.length === 4) {
      //   this.onBlur()
      // }
      console.log(val)
    }
  },
  mounted () {
    this.MyService = new MyService()
    this.getPhone()
  },
  methods: {
    isNum (val) {
      let re = /^[0-9]+.?[0-9]*$/
      return re.test(val)
    },
    getPhone() {
      let params = {}
      this.MyService.getSendCodePhone(params).then(res => {
        this.mobile = res
      })
    },
    sendCode() {
      let params = {
        phone: this.mobile
      }
      this.MyService.getWithDrawCode(params).then(() => {
        this.isDo = true
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
    },
    cancel () {
      this.$emit('closeDialog')
    },
    sure () {
      if (!this.codeVer || !this.isDo) {
        this.$toast({
          message: '请获取验证码',
          duration: 1000
        })
        return
      }
      if (this.codeVer.length !== 4 || !this.$bqUtils.isInteger(this.codeVer)) {
        this.$toast({
          message: '请输入正确验证码',
          duration: 1000
        })
        return
      }
      let params = this.info
      params.code = this.codeVer
      params.phone = this.mobile
      this.MyService.getWithDrawSure(params).then(() => {
        // this.$router.replace('/me/wallet')
        this.$router.replace('/me/withdraw/record')
        this.$toast({
          message: '提现申请提交成功',
          duration: 1000
        })
      })
    }
  },
  beforeDestroy() {
    this.$messagebox.close()
    this.timer && clearTimeout(this.time)
  },
  components: {
    bqCode
  }
}
</script>
<style lang="scss" scoped>
@import 'scss/variables';
@import 'scss/mixin';
.user-withdraw {
  font-family: PingFangSC-Regular;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(0,0,0,0.60);
  z-index: 10000;
  .dialog-content {
    width: 320px;
    height: 280px;
    background: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -140px;
    margin-left: -160px;
    p{
      width: 100%;
      height: 44px;
      text-align: center;
      line-height: 44px;
      color: #333;
      border-bottom: 1px solid #D8D8D8;
      font-family: PingFangSC-Regular;
    }
    span{
      display: inline-block;
      width: 100%;
      height: 44px;
      font-size: 16px;
      text-align: center;
      line-height: 44px;
      color: #505050;
      margin: 20px auto 10px auto;
    }
    .getpas {
      width: 100%;
      border-top: none;
      font-size: 16px;
      color: #FF8113;
      text-decoration: underline;
      font-family: PingFangSC-Regular;
    }
    .active{
      text-decoration: none;
      color: #CCCCCC;
    }
  }
  .mint-button-text {
    color: #FF8113!important;
  }
  .pay-pwd {
    margin: 0 9px;
  }
  .btn-all{
    width: 100%;
    height: 50px;
    margin-top: 33px;
    border-top: 1px solid #d8d8d8;
    .btn{
      height: 100%;
      background: #FFD520;
      border-radius: 1px;
      line-height: 50px;
      padding: 0;
      margin-bottom: 0;
      font-size: 14px;
      color: #505050;
    }
    .disabled{
      background: #FFD520;
      opacity: 0.7;
    }
    .btn:nth-child(1) {
      background: #fff;
      width: 49.1%;
    }
    .btn:nth-child(2) {
      width: 49.6%;
    }
  }
}
</style>
