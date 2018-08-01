<template>
  <bq-page class="bq-page-login">
    <bq-content padding>
      <img class="logo" src="../../../assets/img/login/logo.png">
      社区零售店一站式订货平台!
      <bq-card class="bq-form-card">
        <bq-card-input padding no-margin placeholder="请输入用户名/手机号/邮箱号" v-model="login.name" :disable-clear="true" >
        </bq-card-input>
        <bq-card-input type="password" padding no-margin placeholder="密码" v-model="login.password" :disable-clear="true" >
        </bq-card-input>
      </bq-card>
      <p class="bq-btn-clear" @click="goPhoneValidate">忘记密码</p>
      <!-- <p class="bq-btn-clear register" @click="goRegister">注册</p> -->
      <bq-button type="primary" size="large" :disabled="isLogin" class="bq-btn-login" @click="doLogin">登录</bq-button>
    </bq-content>
  </bq-page>
</template>
<script>
  import LoginMixin from '@/mixins/login.mixin'
  import UserService from '@/services/user.service'
  export default {
    mixins: [ LoginMixin ],
    data() {
      return {
        login: {
          name: '',
          password: ''
        },
        isT: false
      }
    },
    created() {
      let isLoggedIn = !this.$cookie.get('uid') || !this.$cookie.get('token')
      if (this.$route.query.isNewLogin === 'isScan') {
        this.$router.replace('/login')
      } else {
        if (!isLoggedIn) {
          this.$router.replace('/home')
          return
        }
      }
      this.UserService = new UserService()
    },
    computed: {
      isLogin() {
        return this.login.name.length <= 0 && this.login.password.length <= 0
      }
    },
    methods: {
      goPhoneValidate() {
        this.$router.push('/login/phone/validata')
      },
      goRegister() {
        this.$router.push('/store/register')
      },
      // 登录
      async doLogin() {
        if (this.login.name.length <= 0) {
          this.$toast('请输入用户名')
          return
        }
        if (this.login.password.length <= 0) {
          this.$toast('请输入密码')
          return
        }
        // 微信 open id
        let openid = this.$cookie.get('openid')
        if (openid) {
          this.login.openId = openid
        }
        let res = await this.UserService.doLogin(this.login)
        if (res.flag === false) {
          let url = '/store/upload/' + res.phone
          this.$router.replace(url)
          this.$cookie.set('uid', res.uid, {
            path: '/',
            expires: 90
          })
          return
        }
        this.$toast('登录成功')
        this.setLoginCookie(res)
        let { redirect } = this.$route.query
        if (redirect) {
          // 兼容分享的充值页面 因为路由的原因 调起微信支付失败的问题
          if (redirect.indexOf('me/wallet/recharge') !== -1) {
            window.location.href = redirect
            return
          }
          this.$router.replace({
            path: redirect
          })
        } else {
          this.$router.replace('/home')
        }
      }
    },
    mounted() {
      let {name, origin} = this.$route.params
      if (name !== undefined && origin === 'setSuccess') {
        this.login.name = name
      }
    }
  }
</script>
<style lang="scss">
  @import 'scss/variables.scss';
  .bq-page-login {
    text-align: center;
    background: #fff;
    color: $font-color;
    font-size: 14px;
    line-height: 16px;
    padding: 0 20px;
    box-sizing:border-box;
    .logo {
      width: 106px;
      height: 50px;
      margin: 59px auto 15px;
      display: block;
    }
    .bq-form-card {
      margin: 41px -20px 0;
      background-color: #fafafa;
      &>div[padding] {
        align-items: center;
      }
      .mint-button--default {
        background: none;
      }
    }
    .bq-btn-clear {
      font-size: 12px;
      line-height: 12px;
      float: right;
      margin: 9.5px 0 22.5px 0;
      border: none;
      cursor: pointer;
      &:nth-last-child {
        margin-top:10.5px;
      }
    }
    .register{
    margin-right: 15px;
    }
  }
</style>
