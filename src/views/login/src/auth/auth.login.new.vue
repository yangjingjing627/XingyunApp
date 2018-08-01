<template>
  <bq-page class="bq-page-login">
    <bq-header title="" :isLeftButton="false"></bq-header>
    <bq-content style="margin-top:11px;">
      <div class="bq-warn">
        <h4>好升益店铺授权登录云采</h4>
        <p>当前好升益店铺ID：{{ list.hsyStoreId }}</p>
        <p v-if="!list.phone">未绑定云采账号，请联系产品运营绑定！</p>
        <p v-if="list.phone">已绑定云采的手机号：{{ list.phone }} </p>
      </div>
      <bq-card class="input-bq" v-if="list.phone">
        <bq-card-input padding type="password" v-model="login.password" placeholder="请输入云采登录密码" :disable-clear="true" ></bq-card-input>
      </bq-card>
      <p v-if="list.phone" class="bq-btn-clear" @click="goPhoneValidate">忘记密码</p>
    <bq-button v-if="list.phone" type="primary" size="large" :disabled="isLogin" class="bq-btn-login" @click="doLogin">登录</bq-button>
    <p v-if="list.phone" class="bq-btn-clear" @click="goLogin">云采账号登录</p>
  </bq-content>
  </bq-page>
</template>
<script>
import LoginMixin from '@/mixins/login.mixin'
import AuthService from '@/services/auth.service'
import CouponService from '@/services/coupon.service'
export default {
  mixins: [ LoginMixin ],
  data() {
    return {
      login: {
        password: ''
      },
      list: {}
    }
  },
  created() {
    this.AuthService = new AuthService()
    this.CouponService = new CouponService()
    this.getAuthInfo()
  },
  computed: {
    isLogin() {
      return this.login.password.length <= 0
    }
  },
  methods: {
    goPhoneValidate() {
      this.$router.push('/login/phone/validata')
    },
    goLogin () {
      // this.$router.push('/login')
      this.$router.push({name: 'login', query: {isNewLogin: 'isScan'}})
    },
    async getAuthInfo() {
      let param = {
        hsyStoreId: this.$route.params.hsyStoreId
      }
      let res = await this.AuthService.gethsyStorePhone(param)
      this.list = res
    },
    async doLogin() {
      if (this.login.password.length <= 0) {
        this.$toast('请输入登录密码！')
        return
      }
      let param = {
        hsyStoreId: this.$route.params.hsyStoreId,
        phone: this.list.phone,
        password: this.login.password
      }
      this.$indicator.open()
      try {
        let res = await this.AuthService.getAuthNewLogin(param)
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
    .bq-warn{
      margin-top: 40px;
      h4{
        font-size: 20px;
        color: #333333;
        margin-bottom: 20px;
      }
      p{
        font-size: 15px;
        color: #666666;
        line-height: 40px;
      }
    }
    .bq-btn-clear {
      font-size: 12px;
      line-height: 12px;
      float: right;
      margin: 9.5px 22.5px 22.5px 0;
      border: none;
      cursor: pointer;
      color: #505050;
      &:nth-last-child {
        margin-top:10.5px;
      }
    }
    .input-bq{
      margin-top: 20px;
    }
    .bq-btn-login{
      display: inline-block;
      width: 90%;
      margin: 0px auto;
      margin-top: 30px;
      font-size: 16px;
      color: $font-color;
    }
  }
</style>
