<template>
  <bq-tabs v-model="currentVal" class="home-tabs">
    <bq-tab id="allclassification" @click.native="onTab">
      推荐
    </bq-tab>
    <bq-tab id="new" @click.native="onTab">
      新品
    </bq-tab>
    <bq-tab id="selling" @click.native="onTab">
      热销
    </bq-tab>
    <bq-tab id="oftenbuy" @click.native="onTab">
      常买
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
