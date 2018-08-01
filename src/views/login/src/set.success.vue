<template>
  <bq-page class="bq-page-set-pwd-success">
    <img src="../../../assets/img/login/chengong.png"/>
    密码重置成功!
    <bq-button type="primary" size="large" class="btn-login" @click="toIndexPage">立即登录</bq-button>
  </bq-page>
</template>
<script>
export default {
  methods: {
    toIndexPage() {
      this.$router.push({name: 'login', params: {name: this.$route.params.phone || this.$route.params.email, origin: 'setSuccess'}})
    }
  }
}
</script>
<style lang="scss">
  .bq-page-set-pwd-success {
    padding: 0 20px;
    text-align: center;
    box-sizing: border-box;
    img {
      width: 102px;
      height: 102px;
      margin: 119.5px auto 25px;
      display: block;
    }
    .btn-login {
      margin-top: 54px;
    }
  }
</style>
