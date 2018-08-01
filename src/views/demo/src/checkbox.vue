<template>
  <bq-page class="demo-checkbox">
    <bq-header title="checkbox"></bq-header>
    <bq-content has-footer>
      <bq-card>
        <bq-card-item padding  >
          <bq-checkbox v-model="value" id="ckVal" label="i am title"></bq-checkbox>
        </bq-card-item>
        <bq-card-item padding  >
          <bq-checkbox v-model="value1" id="ckVal1" val="哈哈"></bq-checkbox> <span for="ckVal1">checoboxs 哈哈</span>
        </bq-card-item>
        <bq-card-item padding  >
          <bq-checkbox v-model="value1" val="哈哈1"></bq-checkbox> checoboxs 哈哈1
        </bq-card-item>
        <bq-card-item padding  >
          <bq-checkbox type="radio"  v-model="value3"></bq-checkbox> radio checkbox
        </bq-card-item>
        <bq-card-item padding  >
          radio checkbox
          <div slot="right">
            <span>剩余0元</span>
            <bq-checkbox type="radio"  v-model="value5"></bq-checkbox>
          </div>
        </bq-card-item>
        <bq-card-item padding  >
          <bq-checkbox type="radio" val="one" :is-checkbox="false" v-model="value4"></bq-checkbox> radio one
        </bq-card-item>
        <bq-card-item padding  >
          <bq-checkbox type="radio" val="two" :is-checkbox="false" v-model="value4"></bq-checkbox> radio two
        </bq-card-item>
        <bq-card-item padding>
          <bq-checkbox type="radio" val="alipay" :is-checkbox="false" v-model="pay"></bq-checkbox> 支付宝
        </bq-card-item>
        <bq-card-item padding  >
          <bq-checkbox type="radio" val="微信" :is-checkbox="false" v-model="pay"></bq-checkbox> 微信
        </bq-card-item>
        <bq-card-item padding  >
          <bq-checkbox type="radio" val="余额支付" :is-checkbox="false" v-model="pay"></bq-checkbox> 余额支付
        </bq-card-item>
        <bq-card-content>
          <p>checkbox: {{ value }}</p>
          <p>checoboxs: {{ value1 }}</p>
          <p>radio: {{ value4 }}</p>
          <p>pay: {{ pay }}</p>
        </bq-card-content>
      </bq-card>
    </bq-content>
  </bq-page>
</template>
<script>
export default {
  data() {
    return {
      value: true,
      value1: [],
      value2: [],
      value3: false,
      value4: 'one',
      value5: false,
      pay: 'alipay'
    }
  },
  watch: {
    selectedHome(val) {
      console.log(val)
    }
  }
}
</script>
