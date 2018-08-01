<template>
  <bq-page class="bq-page-login">
    <bq-header title="云采登录提示" :isLeftButton="false"></bq-header>
    <bq-content>
      <div class="bq-success">
        <img :src="successSrc"/>
        <p>请使用微信扫码登录</p>
      </div>
      <div class="bq-suc-content">
        <h4>友情提示</h4>
        <p>为了保障你的订货体验，目前云采平台暂不支持在手机浏览器中访问，请打开微信，用微信扫一扫，在微信中访问云采平台进行订货。</p>
      </div>
    </bq-content>
  </bq-page>
</template>
<script>
  import successSrc from 'assets/img/login/auth.warn.png'
  export default {
    data() {
      return {
        successSrc: successSrc
      }
    },
    created() {
      if (this.$device.isWechat) {
        this.$router.push('/')
      }
    }
  }
</script>
<style lang="scss">
  @import 'scss/variables.scss';
  .bq-page-login {
    padding: 0 20px;
    text-align: center;
    box-sizing: border-box;
    background: #FBF9F1;
    .bq-success{
      width: 100%;
      margin-bottom: 60px;
      img{
        width: 102px;
        height: 102px;
        margin: 47px auto 30px;
        display: inline-block;
      }
    }
    .bq-suc-content{
    padding: 10px 20px;
    height: 200px;
        p{
          text-align: left;
          font-size: 12px;
          color: #666;
          line-height: 20px;
        }
    }
  }
</style>
