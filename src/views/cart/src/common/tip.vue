<template>
  <p class="yc-cart-item__tip" :class="{'is-bg': isBg}" >
    <span>
      <slot></slot>
    </span>
    <button class="btn-choudan" @click="onChoudan" >{{ text }}</button>
  </p>
</template>
<script>
export default {
  props: {
    // 是否有背景
    isBg: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: '去凑单'
    }
  },
  methods: {
    onChoudan() {
      this.$emit('choudan')
    }
  }
}
</script>
<style lang="scss">
  @import 'scss/variables.scss';
  @import 'scss/mixin.scss';
  // 提示
  .yc-cart-item__tip {
    padding: 0 15px;
    background: #ffffff;
    color: #333333;
    height: 30px;
    line-height: 30px;
    display: flex;
    @include font-dpr(12px);
    z-index: 2;
    &.is-bg {
      background: #FEF3CC;
    }
    span {
      flex: 1;
    }
    .btn-choudan {
      color: #FF8113;
      z-index: 3;
      &:after {
        content: '';
        width: 8px;
        display: inline-block;
        height: 8px;
        transform: rotate(44deg);
        border-right: 1px solid $danger;
        border-top: 1px solid $danger;
        margin-left: 8px;
      }
    }
  }
</style>
