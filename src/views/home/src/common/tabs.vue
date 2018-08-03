<template>
  <bq-tabs v-model="currentVal" class="home-tabs">
    <bq-tab id="allclassification" @click.native="onTab">
      <p>邀请好友</p>
      <bq-button>去邀请 +1</bq-button>
    </bq-tab>
    <bq-tab id="new" @click.native="onTab">
      <p>每日签到</p>
      <bq-button>去签到 +1</bq-button>
    </bq-tab>
    <bq-tab id="selling" @click.native="onTab">
      <p>矿机时长</p>
      <bq-button>敬请期待</bq-button>
    </bq-tab>
    <bq-tab id="oftenbuy" @click.native="onTab">
      <p>实名认证</p>
      <bq-button>去认证</bq-button>
    </bq-tab>
  </bq-tabs>
</template>
<script>
export default {
  data() {
    return {
      currentVal: this.value || 'allclassification'
    }
  },
  props: {
    value: {}
  },
  watch: {
    value(val) {
      this.currentVal = val
    },
    currentVal(val) {
      this.$emit('input', val)
    }
  },
  methods: {
    onTab() {
      this.$emit('tab')
    }
  }
}
</script>
<style media="screen">
  bq-tabs .mint-button-text {
    font-size: 8px;
  }
</style>
