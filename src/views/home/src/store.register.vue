<template>
  <bq-page class="bq-page-login">
    <bq-header title="注册"></bq-header>
    <bq-content style="margin-top:11px;">
      <bq-card>
        <bq-card-input padding type="text" v-model="login.authIphone" placeholder="请输入手机号" :disable-clear="true" :maxlength="11">
          手机号
        </bq-card-input>
        <bq-card-input padding type="text" v-model="login.registercode" :maxlength="4" placeholder="请输入验证码">
          验证码
          <bq-button slot="button" class="bq-code" @click.native="onSendCode()" :disabled="code.isSendCode">
            <!-- 获取验证码 -->
            <span v-if="!code.isSendCode">{{ code.isGet ? '重新获取' : '获取验证码' }}</span>
            <span :style="{ color: code.isSendCode ? '#999999' : '#505050' }" v-else>已发送({{ code.s }}s)</span>
          </bq-button>
        </bq-card-input>
        <bq-card-input padding type="password" v-model="login.password" placeholder="请输入密码" :disable-clear="true" >
          密码
        </bq-card-input>
        <bq-card-input padding type="password" v-model="login.rePassword" placeholder="请输入确认密码" :disable-clear="true" >
          确认密码
        </bq-card-input>
        <bq-card-input padding type="text" v-model="login.invitationCode" placeholder="选填" :disable-clear="true" :maxlength="11">
          邀请码
        </bq-card-input>
      </bq-card>
    <bq-card class="bq-bg-agree">
      <bq-card-item padding>
        <bq-checkbox v-model="agree" id="agree" val="我已阅读并同意"></bq-checkbox>
        <span for="agree">&nbsp;我已阅读并同意</span>
        <span for="ckVal1" class="bq-agree"><a :href="'/store/model/register'">《云采平台服务协议》</a></span>
      </bq-card-item>
    </bq-card>
    <bq-button type="primary" size="large" :disabled="isLogin" class="bq-btn-login" @click="doLogin">注册并登录</bq-button>
  </bq-content>
  </bq-page>
</template>
<script>
import HomeService from '@/services/home.service'
export default {
  data() {
    return {
      login: {
        authIphone: '',
        registercode: '',
        invitationCode: '',
        rePassword: '',
        password: ''
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
    this.HomeService = new HomeService()
  },
  computed: {
    isLogin() {
      return this.login.authIphone.length <= 0 && this.login.registercode.length <= 0 && this.login.password.length <= 0 && this.login.rePassword.length <= 0
    }
  },
  beforeDestroy() {
    this.time && clearInterval(this.time)
    this.$messagebox.close()
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
      await this.HomeService.sendCode({
        phone: this.login.authIphone,
        type: 1
      })
    },
    validation() {
      if (!this.$bqUtils.isPhoneNumber(this.login.authIphone)) {
        this.$toast('请输入有效的手机号')
        return false
      }
      return true
    },
    // 登录
    async doLogin() {
      if (this.login.authIphone.length <= 0) {
        this.$toast('手机号不能为空')
        return
      }
      if (!this.$bqUtils.isPhoneNumber(this.login.authIphone)) {
        this.$toast('请输入有效的手机号')
        return
      }
      if (this.login.registercode.length <= 0) {
        this.$toast('验证码不能为空')
        return
      }
      if (this.login.password.length <= 0) {
        this.$toast('密码不能为空')
        return
      }
      if (!this.$bqUtils.enAndZn(this.login.password)) {
        this.$toast('密码必须是6~20位的字母与数字组合')
        return
      }
      if (this.login.rePassword.length <= 0) {
        this.$toast('确认密码不能为空')
        return
      }
      if (this.login.password !== this.login.rePassword) {
        this.$toast('两次密码输入不一致请重新输入')
        return
      }
      if (this.login.invitationCode) {
        if (!this.$bqUtils.isInteger(this.login.invitationCode)) {
          this.$toast('邀请码必须为数字')
          return
        }
        if (!this.$bqUtils.isPhoneNumber(this.login.invitationCode)) {
          this.$toast('邀请码必须为有效手机号')
          return
        }
      }
      if (!this.agree) {
        this.$toast('您必须同意云采平台服务协议才能操作！')
        return
      }
      let param = {
        phone: this.login.authIphone,
        code: this.login.registercode,
        invitationCode: this.login.invitationCode,
        rePassword: this.login.rePassword,
        password: this.login.password,
        type: 1
      }
      try {
        let res = await this.HomeService.volideCode(param)
        let url = '/store/upload/' + res.phone
        this.$router.replace(url)
        this.$toast('注册成功')
        this.$cookie.set('uid', res.uid, {
          path: '/',
          expires: 90
        })
      } catch (e) {
        this.$indicator.close()
        // this.$messagebox.alert('注册失败,请稍后重试', '')
      }
    }
  }
}
</script>
<style lang="scss">
  @import 'scss/variables.scss';
  @import 'scss/mixin';
  .bq-page-login {
    text-align: center;
    background: #FBF9F1;
    @include font-dpr(14px);
    line-height: 16px;
    padding: 0 20px;
    box-sizing:border-box;
    .bq-input-wrapper[padding]{
      padding: 10px 20px;
      border-left: 0;
      margin:0;
    }
    .bq-input-wrapper .bq-input-label{
      padding-top: 5px;
      padding-right: 16px;
      color: $font-color;
    }
    .bq-code{
      cursor: pointer;
      .mint-button-text{
        @include font-dpr(14px);
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
        @include font-dpr(12px);
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
      @include font-dpr(16px);
      color: $font-color;
    }
    .bq-warn{
      padding: 0 20px;
      padding: 14px;
      @include font-dpr(12px);
      color: #999999;
      text-align: left;
      line-height:17px;
    }
  }
</style>
