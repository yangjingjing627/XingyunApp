<template>
  <bq-page class="set-pwd">
    <bq-header title="登录密码重置"></bq-header>
    <bq-content>
      <p>请用当前登录账号所绑定的手机号：{{ mobile }}</p>
      <bq-card>
        <bq-card-input padding fixed v-model="code" :maxlength="4">
          <bq-button class="getpas" slot="button" @click="sendCode" :disabled="isGet">
            {{ code_value }}
          </bq-button>
        </bq-card-input>
      </bq-card>
      <div class="btn">
        <bq-button class="but" type="primary" size="large" @click="checkCode" :disabled="!code">下一步</bq-button>
          友情提示：如果您当的登录账号所绑定的手机号丢失或者已经更换无法获取验证码，请联系运营人员为您绑定新的手机号！
      </div>
    </bq-content>
  </bq-page>
</template>
<script>
import MyService from '@/services/my.service'
export default {
  data() {
    return {
      mobile: '',
      infoIphone: '',
      code_value: '获取验证码',
      isGet: false,
      time: '',
      code: ''
    }
  },
  beforeDestroy() {
    this.$messagebox.close()
    this.timer && clearTimeout(this.time)
  },
  mounted () {
    this.MyService = new MyService()
    this.getPhone()
  },
  methods: {
    getPhone() {
      let params = {}
      this.MyService.getSendCodePhone(params).then(res => {
        this.infoIphone = res
        if (this.infoIphone) {
          this.mobile = this.infoIphone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
        }
      })
    },
    sendCode() {
      let params = {
        source: 1,
        phone: this.infoIphone,
        type: 1
      }
      this.MyService.sendCodeReset(params).then(() => {
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
    async checkCode() {
      let params = {
        phone: this.infoIphone,
        type: 1,
        code: this.code
      }
      try {
        let res = await this.MyService.checkCodeSet(params)
        if (res === true) {
          this.$router.push('/me/resetpassword/set')
        } else {
          this.$messagebox.alert('验证码输入错误,请重新输入！')
        }
      } catch (e) {
        this.$messagebox.alert(e.message)
      }
    }
  }
}
</script>
<style lang="scss">
@import 'scss/variables';
@import 'scss/mixin';

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
      padding: 1px;
      margin-right: 0;
      .mint-button {
        width: 100px;
        height: 45px;
        @include font-dpr(14px);
        border-left: 1px solid $light-border-color;
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
    .but{
      margin-bottom: 15px;
    }
    color: #999999;
  }
}
.getpas {
  .mint-button-text {
    margin: 0 auto;
  }
}
</style>
