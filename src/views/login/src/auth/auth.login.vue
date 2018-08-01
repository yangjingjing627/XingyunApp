<template>
  <bq-page class="bq-page-login">
    <bq-header title="好升益店铺绑定云采" :isLeftButton="false"></bq-header>
    <bq-content style="margin-top:11px;">
      <bq-card>
        <bq-card-input padding type="number" v-model="login.authIphone" placeholder="请输入云采账号手机号" :disable-clear="true" ></bq-card-input>
        <bq-card-input padding type="text" v-model="login.registercode" :maxlength="4" placeholder="请输入验证码">
          <bq-button slot="button" class="bq-code" @click.native="onSendCode()" :disabled="code.isSendCode">
            <!-- 获取验证码 -->
            <span v-if="!code.isSendCode">{{ code.isGet ? '重新获取' : '获取验证码' }}</span>
            <span :style="{ color: code.isSendCode ? '#999999' : '#505050' }" v-else>已发送({{ code.s }}s)</span>
          </bq-button>
        </bq-card-input>
      </bq-card>
    <bq-card class="bq-bg-agree">
      <bq-card-item padding>
        <bq-checkbox v-model="agree" id="agree" val="我已阅读并同意"></bq-checkbox>
        <span for="agree">&nbsp;我已阅读并同意</span>
        <span for="ckVal1" class="bq-agree"><a href="/auth/register">《云采平台服务协议》</a></span>
      </bq-card-item>
    </bq-card>
    <bq-button type="primary" size="large" :disabled="isLogin" class="bq-btn-login" @click="doLogin">确认并登录</bq-button>
    <div class="bq-warn">
      <h4>友情提示</h4>
      <p>1. 如果手机号丢失或者已经更换无法获取验证码，请联系运营人员绑定新的手机号；</p>
      <p>2. 如果你已有云采账号，手机号忘记或者已经更换无法获取验证码请联系云采产品运营进行修改。</p>
    </div>
  </bq-content>
  </bq-page>
</template>
<script>
import LoginMixin from '@/mixins/login.mixin'
import { isPhoneNumber } from '@/utils/utils'
import AuthService from '@/services/auth.service'
import CouponService from '@/services/coupon.service'
export default {
  mixins: [ LoginMixin ],
  data() {
    return {
      login: {
        authIphone: '',
        registercode: ''
      },
      agree: true,
      code: {
        isSendCode: false,
        s: 60,
        // 在此获取时 文本 变为重新获取
        isGet: false
      }
    }
  },
  created() {
    this.AuthService = new AuthService()
    this.CouponService = new CouponService()
  },
  computed: {
    isLogin() {
      return this.login.authIphone.length <= 0 && this.login.registercode.length <= 0
    }
  },
  beforeDestroy() {
    clearInterval(this.time)
  },
  methods: {
    // 获取验证码
    async onSendCode() {
      if (!this.validation() || this.code.isSendCode) {
        return
      }
      this.code.isSendCode = true
      this.time = setInterval(() => {
        if (this.code.s === 0) {
          this.code.isSendCode = false
          this.code.s = 60
          this.code.isGet = true
          this.time && clearInterval(this.time)
          return
        }
        this.code.s = this.code.s - 1
      }, 1000)
      await this.AuthService.authCode({
        mobile: this.login.authIphone
      })
    },
    validation() {
      if (!isPhoneNumber(this.login.authIphone)) {
        this.$toast('请输入有效的手机号', '')
        return false
      }
      return true
    },
    async doLogin() {
      if (this.login.authIphone.length <= 0) {
        this.$toast('手机号不能为空')
        return
      }
      if (!isPhoneNumber(this.login.authIphone)) {
        this.$toast('请输入有效的手机号', '')
        return
      }
      if (this.login.registercode.length <= 0) {
        this.$toast('验证码不能为空')
        return
      }
      if (this.login.registercode.length > 4) {
        this.$toast('输入4位验证码')
        return
      }
      if (!this.agree) {
        this.$toast('同意云采平台服务协议才可以继续')
        return
      }
      let param = {
        hsyStoreId: this.$route.params.hsyStoreId,
        mobile: this.login.authIphone,
        verifycode: this.login.registercode
      }
      this.$indicator.open()
      try {
        let res = await this.AuthService.getAuthLogin(param)
        this.$toast('登录成功')
        this.setLoginCookie(res)
        // 授权登录送优惠券礼包
        let params = {
          uid: res.uid
        }
        let self = this
        this.CouponService.orderAddCoupon(params).then(res => {
          let info = res
          self.$store.commit('GET_NEW_USER_GIFTS', info)
          this.$router.replace('/home')
        })
        // this.$router.replace('/home')
      } catch (e) {
        this.$messagebox.alert('登录失败,请稍后重试', '')
      } finally {
        this.$indicator.close()
      }
    }
  }
}
</script>
<style lang="scss">
  @import 'scss/variables.scss';
  .bq-page-login {
    text-align: center;
    background: #FBF9F1;
    font-size: 14px;
    line-height: 16px;
    padding: 0 20px;
    box-sizing:border-box;
    .bq-input-wrapper[padding]{
      padding: 10px 20px;
      border-left: 0;
      margin:0;
    }
    .bq-code{
      cursor: pointer;
      .mint-button-text{
        font-size: 14px;
        color: $danger!important;
        padding-left: 10px;
        text-align: center;
      }
      width: 105px;
      height: 23px;
      border-left: 1px solid #D8D8D8;
    }
    .bq-radios{
      width: 40px;
      border-right: 1px solid #fff;
      float: left;
      .bq-checkbox-wrapper{
        float: left;
      }
    }
    .bq-card-item__info{
      display: flex;
      flex: none;
    }
    .bq-bg-agree{
      background: $bg-color;
      border: none;
      .bq-checkbox-core{
        width: 12px;
        height: 12px;
      }
      span{
        font-size: 12px;
        color: #999;
        line-height: 19px;
      }
    }
    .bq-bg-agree:after{
      border-bottom: none;
    }
  .bq-checkbox-wrapper .bq-checkbox-core::after{
    position: absolute;
    top: -0px;
    left: 3px;
  }
    .bq-agree{
      a{
        width: 150px;
        color: $danger!important;
        cursor: pointer;
      }
    }
    .bq-btn-login{
      display: inline-block;
      width: 90%;
      margin: 0px auto;
      margin-top: 50px;
      font-size: 16px;
      color: $font-color;
    }
    .bq-warn{
      padding: 0 20px;
      padding: 14px;
      font-size: 12px;
      color: #999999;
      text-align: left;
      line-height:17px;
    }
  }
</style>
