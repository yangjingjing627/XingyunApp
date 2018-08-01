<template>
  <bq-popup
    class="bq-page-modal"
    v-model="currentVal"
    position="right"
    :modal="false">
    <combin :sku="sku" :sellerId="sellerId" type="modal" @close="onClose"></combin>
  </bq-popup>
</template>
<script>
import {Modal} from '~'
import combin from './combin.vue'
export default {
  name: 'bq-combin-modal',
  mixins: [Modal],
  data() {
    return {
      sku: '',
      sellerId: ''
    }
  },
  beforeDestroy() {
    this.timer && clearTimeout(this.timer)
    this.$messagebox.close()
  },
  methods: {
    onClose(fun) {
      this.currentVal = false
      if (this.$bqUtils.isFunction(this.close)) {
        this.close(this)
      }
      this.$messagebox.close()
      // 兼容安卓返回按钮，关闭移除监听
      window.removeEventListener('popstate', fun, false)
    },
    destroyElementCombin() {
      this.timer = setTimeout(() => {
        window.store.commit('COMBIN_PAGE_STATUS', false)
        this.$el.removeEventListener('transitionend', this.destroyElementCombin)
        this.$destroy(true)
        this.$el.parentNode.removeChild(this.$el)
      }, 500)
    }
  },
  components: {
    combin
  }
}
</script>
