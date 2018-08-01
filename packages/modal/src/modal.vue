<template>
  <bq-popup
    class="bq-page-modal"
    v-model="currentVal"
    position="right"
    :modal="false">
    <bq-header :title="title" :is-left="true">
      <bq-button slot="left" @click="onCloseOpen">
        关闭
        <!-- <i class="bq-icon-input-close" slot="icon"></i> -->
      </bq-button>
    </bq-header>
    <bq-content>
      <slot></slot>
    </bq-content>
  </bq-popup>
</template>
<script>
  import {Popup} from 'mint-ui'
  export default {
    name: 'bq-modal',
    data() {
      return {
        currentVal: false,
        href: ''
      }
    },
    watch: {
      value(val) {
        // 兼容安卓返回键 监听返回
        if (val) {
          this.href = window.location.href
          window.history.pushState(null, null, window.location.href)
          window.addEventListener('popstate', this.listenBack, false)
        }
        this.currentVal = val
      },
      currentVal(val) {
        this.$emit('input', val)
      }
    },
    methods: {
      listenBack () {
        this.onClose()
        // 兼容安卓返回键 移除监听
        window.removeEventListener('popstate', this.listenBack, false)
      },
      onClose() {
        this.currentVal = false
      },
      onCloseOpen () {
        window.history.go(-1)
      }
    },
    props: {
      value: {},
      title: String
    },
    components: {
      bqPopup: Popup
    }
  }
</script>
<style lang="scss">
  @import 'scss/variables.scss';
  .bq-page-modal {
    width: 100%;
    height: 100%;
    background-color: $bg-color;
    z-index: 2000;
    .bq-header {
      z-index: 100000;
    }
  }
</style>
