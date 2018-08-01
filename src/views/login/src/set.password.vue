<template>
  <bq-page class="bq-page-set-password">
   <bq-header title="设置新密码"></bq-header>
    <bq-content>
      <bq-card class="form">
        <bq-card-input type="password" padding no-margin placeholder="请输入密码" :disable-clear="true" v-model="reset.password">
        </bq-card-input>
        <bq-card-input type="password" padding no-margin placeholder="请再次输入密码" :disable-clear="true" v-model="reset.passwordConfirm">
        </bq-card-input>
      </bq-card>
      <div class="wrap">
        特别说明：密码必须为6位以上的数字与英文字母组合
        <bq-button type="primary" size="large" class="btn-next" :disabled="nextDisabled" @click="modifyNext">下一步</bq-button>
      </div>
    </bq-content>
  </bq-page>
</template>
<script>
import UserService from '@/services/user.service'
export default {
  data() {
    return {
      reset: {
        password: '',
        passwordConfirm: '',
        type: ''
      },
      passwordReg: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,}$/
    }
  },
  created() {
    this.UserService = new UserService()
  },
  computed: {
    passwordIsMatch() {
      return this.passwordReg.test(this.reset.password)
    },
    nextDisabled() {
      return this.reset.password.length === 0 || this.reset.passwordConfirm.length === 0
    }
  },
  methods: {
    async modifyNext() {
      if (this.reset.password.length === 0 || this.reset.passwordConfirm.length === 0) {
        this.$toast('请输入密码')
        return
      }
      if (this.passwordReg.test(this.reset.password) === false) {
        this.$toast('密码必须是数字与字母的组合，且密码长度不得少于6位')
        return
      }
      if (this.reset.password !== this.reset.passwordConfirm) {
        this.$toast('两次密码输入不一致')
        return
      }
      this.reset.type = this.$route.params.type
      let params = {}
      if (this.reset.type === 1) {
        this.reset.phone = this.$route.params.phone
        params.phone = this.$route.params.phone
      } else if (this.reset.type === 2) {
        this.reset.email = this.$route.params.email
        params.email = this.$route.params.email
      }
      await this.UserService.resetPassword(this.reset)
      this.$router.push({name: 'setSuccess', params: params})
    }
  }
}
</script>
<style lang="scss">
  @import 'scss/variables.scss';
  .bq-page-set-password {
    color: $font-color;
    line-height: 12px;
    .form {
      margin: 21px 0 10.5px;
    }
    .wrap {
      padding:0 20px;
    }
    .btn-next {
      margin-top: 40px;
    }
  }
</style>
