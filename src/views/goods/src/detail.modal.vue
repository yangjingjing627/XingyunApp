<template>
  <bq-popup
    class="bq-page-modal"
    v-model="currentVal"
    position="right"
    :modal="false">
    <detail :sku="sku" :sellerId="sellerId" type="modal" @close="onClose"></detail>
  </bq-popup>
</template>
<script>
import {Modal} from '~'
import Detail from '@/components/detail/common.vue'
export default {
  name: 'bq-detail',
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
    destroyElement() {
      this.timer = setTimeout(() => {
        this.$el.removeEventListener('transitionend', this.destroyElement)
        this.$destroy(true)
        this.$el.parentNode.removeChild(this.$el)
      }, 500)
    }
  },
  components: {
    Detail
  }
}
</script>
