<template>
  <bq-page class="bq-page-login">
    <bq-header :isLeftButton="false" title="绑定成功"></bq-header>
    <bq-content>
      <div class="bq-success">
        <img :src="successSrc"/>
        <p>恭喜你好升益店铺已成功绑定云采</p>
      </div>
      <div class="bq-suc-content">
        <h4>友情提示</h4>
        <p>由于目前云采微信端尚未上线，故目前你只能通过以下方式订货：</p>
        <p>方式1:电脑PC端访问：http://buyer.yuncai.bqmart.cn/</p>
        <p>&nbsp;&nbsp;用户名是你绑定云采时输入的手机号</p>
        <p>&nbsp;&nbsp;密码需要你在登录页面点击［忘记密码］设置</p>
        <br>
        <p>方式2:下载倍全商户APP；</p>
        <p>&nbsp;&nbsp;登录倍全商户APP点击［云采订货］进入；</p>
        <p>&nbsp;&nbsp;若无倍全商户APP账号或者无法登录，请联系云采产品运营；</p>
        <!-- <p>1. 电脑PC端访问：http://buyer.yuncai.bqmart.cn/；</p>
        <p>2. 下载并登录倍全商户APP选择[云采订货]，如果无法登录，请联系云采产品运营。</p> -->
      </div>
    </bq-content>

  </bq-page>
</template>
<script>
  import successSrc from 'assets/img/login/chengong.png'
  export default {
    data() {
      return {
        successSrc: successSrc
      }
    },
    created() {
    },
    computed: {
    },
    methods: {
    }
  }
</script>
<style lang="scss">
  @import 'scss/variables.scss';
  .bq-page-login {
    padding: 0 20px;
    text-align: center;
    box-sizing: border-box;
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
