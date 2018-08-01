<template>
  <bq-page class="bq-page-phone-validate">
    <bq-header :title="title"></bq-header>
    <bq-content>
      <bq-card class="form">
        <bq-card-input v-if="type==1" type="tel" padding no-margin placeholder="请输入手机号" :disable-clear="true" v-model="phone">
        </bq-card-input>
        <bq-card-input v-if="type==2" type="email" padding no-margin placeholder="请输入邮箱号" :disable-clear="true" v-model="email">
        </bq-card-input>
        <bq-card-input type="text" padding no-margin placeholder="请输入验证码" v-model="code" :maxlength="4">
          <bq-button size="small" type="primary" class="bq-btn-clear" @click="sendCode" :disabled="sendDisabled" >{{codeText}}</bq-button>
        </bq-card-input>
      </bq-card>
      <div class="wrap">
        <span @click="changeType"><img v-if="type==1" src="../../../assets/img/login/youxiang.png"></img>通过{{type===2?'手机':'邮箱'}}找回密码</span>
        <bq-button type="primary" size="large" class="bq-btn-next" :disabled="nextDisabled" @click="verifyCode">下一步</bq-button>
        <p>友情提示：如果手机号丢失或者已经更换无法获取验证码，请联系运营人员绑定新的手机号！</p>
      </div>
    </bq-content>
  </bq-page>
</template>
<script>
import UserService from '@/services/user.service'
export default {
  data() {
    return {
      email: '',
      phone: '',
      code: '',
      codeText: '获取验证码',
      emailReg: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/,
      phoneReg: /^1[34578]\d{9}$/,
      type: 1,
      isSend: false,
      time: null
    }
  },
  computed: {
    title() {
      return (this.type === 1 ? '手机' : '邮箱') + '验证'
    },
    sendDisabled() {
      if (this.isSend) {
        return true
      }
      return this.phoneOrEmailisOk()
    },
    nextDisabled() {
      return this.phoneOrEmailisOk() || this.code.length === 0
    }
  },
  methods: {
    phoneOrEmailisOk() {
      if (this.type === 1) {
        return this.phoneReg.test(this.phone) !== true
      } else if (this.type === 2) {
        return this.emailReg.test(this.email) !== true
      }
    },
    changeType() {
      if (this.type === 1) {
        this.type = 2
      } else if (this.type === 2) {
        this.type = 1
      }
      window.clearInterval(this.time)
      this.codeText = '获取验证码'
      this.isSend = false
      this.email = ''
      this.phone = ''
      this.code = ''
    },
    getParams() {
      let params = {type: this.type}
      if (this.type === 1) {
        params.phone = this.phone
      } else if (this.type === 2) {
        params.email = this.email
      }
      return params
    },
    async sendCode() {
      if (this.type === 1) {
        if (this.phone.length <= 0) {
          this.$toast('请输入手机号')
          return
        }
        if (this.phoneReg.test(this.phone) !== true) {
          this.$toast('手机号有误请重新输入')
          return
        }
      } else if (this.type === 2) {
        if (this.email.length <= 0) {
          this.$toast('请输入邮箱号')
          return
        }
        if (this.emailReg.test(this.email) !== true) {
          this.$toast('邮箱号有误请重新输入')
          return
        }
      }
      let params = this.getParams()
      await this.UserService.sendCode(params)
      this.codeText = 60
      this.isSend = true
      this.time = window.setInterval(() => {
        this.codeText--
        if (this.codeText < 0) {
          this.isSend = false
          window.clearInterval(this.time)
          this.codeText = '获取验证码'
        }
      }, 1000)
    },
    async verifyCode() {
      let params = this.getParams()
      params.code = this.code
      let res = await this.UserService.verifyCode(params)
      if (!res) {
        this.$messagebox.alert('验证码错误，请重新输入')
        return
      }
      this.$router.push({name: 'setPassword', params: params})
    }
  },
  created() {
    this.UserService = new UserService()
  }
}
</script>
<style lang="scss">
  @import 'scss/variables.scss';
  @import 'scss/mixin.scss';
  .bq-page-phone-validate {
    .form {
      margin: 21px 0 10.5px;
      &>div[padding] {
        align-items: center;
      }
      .bq-btn-clear {
        border-left: 1px solid #dbdbdb;
        padding-left: 20px;
        background: none;
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
        label {
          color: $danger;
          font-size:14px;
          line-height: 14px;
        }
      }
    }
    .wrap {
      background: transparent;
      border: none;
      padding: 0 20px;
      color:#999;
      font-size:12px;
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
