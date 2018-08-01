<template>
  <div class="lazy-load-component" :style="{height: !isRender? '100px' : 'auto'}">
    <slot v-if="isRender"></slot>
    <slot name="tip" v-if="!isRender">
      <div :class="[maskClass ? maskClass : 'lazy-load-component-mask']">
        <img :src="loadingUrl">
      </div>
    </slot>
  </div>
</template>
<script>
import inViewport from 'in-viewport'
import loading from '@/assets/img/loading-spin.svg'
export default {
  name: 'lazy-component',
  data() {
    return {
      // 是否渲染组件
      isRender: false,
      loadingUrl: loading
    }
  },
  mounted() {
    inViewport(this.$el, {offset: this.offset}, () => {
      this.sync()
    })
    this.$win = $(window)
    this.$$el = $(this.$el)
    this.$win.on('scroll', this.$bqUtils.throttle(() => {
      let scrollTop = this.$win.scrollTop()
      let offset = this.$$el.offset()
      let offsetTop = offset.top - 130
      let offsetBottom = offsetTop + offset.height
      if (scrollTop > offsetTop && scrollTop < offsetBottom) {
        this.$emit('visible')
      }
    }))
  },
  props: {
    maskClass: String,
    offset: {
      type: Number,
      default: 10
    }
  },
  methods: {
    sync() {
      this.isRender = true
      this.$emit('loaded')
    }
  }
}
</script>
<style lang="scss">
.lazy-load-component {
  position: relative;
  &-mask {
    position: absolute;
    width: 100%;
    height: 100px;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: #000;
    color: #ffffff;
    opacity: 0.2;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
