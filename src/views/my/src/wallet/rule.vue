<template>
  <bq-page class="bq-page-rule">
    <bq-header title="余额用户协议"></bq-header>
    <bq-content>
      <h1>余额使用规则</h1>
      <p>余额是指商户在云采平台支付订单时，在一定品类和条件下，可用于抵付现金的金额。</p>
      <p>余额充值成功后目前不支持在云采买家端进行手动提现；</p>
      <p>余额取得的主要途径有：</p>
      <p>在线充值余额，在“我的钱包”中给自己的账号充值；</p>
      <p>为保证账户安全，请在确保商户信息正确的情况下进行充值；</p>
      <p>余额目前仅适用在云采平台订货使用；</p>
      <p>若后续调整余额使用范围则以具体订单页面显示的为准。</p>
      <p>使用余额支付的订单退款，如果订单申请退款成功，订单中余额支付的金额将返还到余额中。</p>
      <p>用户不得利用余额进行违反云采订货交易反作弊活动，否则云采平台有权采取终止该订单的效力、停止向用户提供订单产品、查封用户账号等措施，并有权通过法律途径向用户追讨经济损失。</p>
    </bq-content>
  </bq-page>
</template>
<style lang="scss">
  @import 'scss/variables.scss';
  .bq-page-rule {
    color: $font-color;
    font-size: 14px;
    h1 {
      font-size: 16px;
      line-height: 16px;
      margin:20px auto;
      text-align: center;
    }
    p {
      margin-bottom: 20px;
      padding:0 15px;
      line-height: 18px;
    }
  }
</style>
