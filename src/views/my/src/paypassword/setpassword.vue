<template>
  <bq-page class="set-pwd">
    <bq-header title="设置支付密码"></bq-header>
    <bq-content class="pass-word-box">
      <div v-show="passWord.pwOld.length < 6">
        <div class="pass-word-tilte-h">设置6位支付密码</div>
        <bq-pay-pwd class="pay-pwd" v-model="passWord.pwOld" ></bq-pay-pwd>
      </div>
      <div v-show="passWord.pwOld.length === 6">
        <div class="pass-word-tilte-h">再次输入以确认</div>
        <bq-pay-pwd class="pay-pwd" v-model="passWord.pwNew"></bq-pay-pwd>
      </div>
    </bq-content>
  </bq-page>
</template>
<script>
import bqPayPwd from './pwd.vue'
import MyService from '@/services/my.service'
export default {
  data: function() {
    return {
      passWord: {
        pwOld: '',
        pwNew: ''
      }
    }
  },
  mounted () {
    this.MyService = new MyService()
  },
  watch: {
    'passWord.pwNew'(val) {
      if (val.length === 6) {
        this.onBlur()
      }
    }
  },
  methods: {
    onBlur() {
      if (this.passWord.pwOld !== this.passWord.pwNew) {
        this.$messagebox.alert('两次密码不一致,请重新输入')
        this.passWord.pwOld = ''
        this.passWord.pwNew = ''
      } else {
        let params = {
          payPassword: this.passWord.pwOld,
          repayPassword: this.passWord.pwNew
        }
        this.MyService.passwordSet(params).then(res => {
          // 支付密码设置成功
          if (res.length === 0) {
            if (this.$route.params.stu2 === '1') {
              this.$router.push('/me')
            } else {
              this.$router.push('/order')
            }
            this.$toast({
              message: '支付密码设置成功',
              duration: 1000
            })
          }
        })
      }
    }
  },
  components: {
    bqPayPwd
  }
}
</script>
<style lang="scss" scoped>
@import 'scss/variables';
@import 'scss/mixin';
.pass-word-box {
  .pass-word-tilte-h{
    @include font-dpr(14px);
    text-align: center;
    margin-top: 51px;
    margin-bottom: 25px;
  }
  .pay-pwd {
    margin: 0 10px;
  }
}
</style>
