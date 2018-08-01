<template>
  <span class="yc-mkt-label" :class="typeCls">
    <!-- {{ text }} -->
  </span>
</template>
<script>
const LABELS_MAX = {
  manjian: '满减',
  chuxiao: '促销',
  maizeng: '买赠'
}
const LABELS_MIN = {
  manjian: '满',
  chuxiao: '促',
  maizeng: '赠'
}
export default {
  name: 'yc-mkt-label',
  computed: {
    text() {
      let label = this.size === 'min' ? LABELS_MIN : LABELS_MAX
      return label[this.type]
    },
    typeCls() {
      let base = 'yc-mkt-label'
      let size = this.size === 'min' ? '' : '-max'
      switch (this.type) {
        case 'manjian':
          return `${base}--manjian${size}`
        case 'chuxiao':
          return `${base}--chuxiao${size}`
        case 'maizeng':
          return `${base}--maizeng${size}`
        case 'zuhe':
          return `${base}--zuhe`
        case 'zuhebixuan':
          return `${base}--zuhebixuan`
        case 'zhijiang':
          return `${base}--zhijiang`
      }
    }
  },
  props: {
    // 营销标签大小  大是指 满减这种 小是指 满 默认是 min
    size: {
      type: String,
      default: 'min',
      validator(value) {
        return ['min', 'max'].indexOf(value) > -1
      }
    },
    type: {
      required: true,
      type: String,
      validator(value) {
        return ['manjian', 'chuxiao', 'maizeng', 'zuhe', 'zuhebixuan', 'zhijiang'].indexOf(value) > -1
      }
    }
  }
}
</script>
<style lang="scss">
  @import 'scss/variables.scss';
  @import 'scss/mixin.scss';
  $iconImgUrl: '../../assets/img';
  span.yc-mkt-label {
    display: inline-block;
    border-radius: 1px;
    text-align: center;
    // background: #FF571E;
    color: #fff;
    @include font-dpr(10px);
    width: 26px;
    height: 14px;/*no*/
    line-height: 15px;/*no*/
    background-clip: padding-box;
    margin-right: 2px;
    &--manjian {
      @include baseIcon('/components/mkt.label/man.png', 14px, 14px);
    }
    &--manjian-max {
      @include baseIcon('/components/mkt.label/man-max.png', 26px, 14px);
    }
    // 促销
    &--chuxiao {
      @include baseIcon('/components/mkt.label/chu.png', 14px, 14px);
      top: -3px;
    }
    &--chuxiao-max {
      @include baseIcon('/components/mkt.label/chu-max.png', 26px, 14px);
    }
    // 买赠
    &--maizeng-max {
      @include baseIcon('/components/mkt.label/maizeng.png', 26px, 14px);
    }
    // 组合
    &--zuhe {
      @include baseIcon('/components/mkt.label/combin-master.png', 46px, 14px);
    }
    &--zuhebixuan {
      @include baseIcon('/components/mkt.label/combin-dev.png', 46px, 14px);
    }
    // 直降
    &--zhijiang {
      @include baseIcon('/components/mkt.label/zhijiang.png', 26px, 14px);
    }
  }
</style>
