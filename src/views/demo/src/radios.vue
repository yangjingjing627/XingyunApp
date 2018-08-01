<template>
  <bq-page class="demo-button">
    <bq-header title="radios"></bq-header>
    <bq-content >
      radios
      <bq-radios :options="options" align="right" v-model="value">
      </bq-radios>
      <p>value: {{ value }}</p>
      checkboxs
      <bq-radios  :options="options" v-model="value2" type="checkbox">
      </bq-radios>
      <p>value: {{ value2 }}</p>
    </bq-content>
  </bq-page>
</template>
<script>
export default {
  data() {
    return {
      value: 'weixin',
      value2: [],
      options: [{value: '支付宝支付', disabled: true, text: '支付宝支付', rightText: '哈哈11'}, {value: 'weixin', text: '微信支付'}, {value: 'beiquan', text: '倍全商户余额'}]
    }
  }
}
</script>
