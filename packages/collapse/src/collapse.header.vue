<template>
  <div class="bq-callapse-header">
    <div class="bq-callapse-header__title">
      <slot></slot>
    </div>
    <div class="bq-callapse-header__btns" @click="onClick">
      {{ getState.text }} <i class="icon" :class="getState.cls" slot="icon"></i>
    </div>
  </div>
</template>
<script>
  const OPT = {
    show: {
      text: '展开',
      cls: 'bq-icon-callapse-arrow-down'
    },
    hide: {
      text: '收起',
      cls: 'bq-icon-callapse-arrow-up'
    }
  }
  export default {
    name: 'bq-collapse-header',
    data() {
      return {
        isActive: this.$parent.isActive
      }
    },
    computed: {
      getState() {
        return OPT[this.isActive ? 'hide' : 'show']
      }
    },
    watch: {
      '$parent.isActive'(val) {
        this.isActive = val
      }
    },
    methods: {
      onClick() {
        this.isActive = !this.isActive
        this.$parent.isActive = this.isActive
      }
    }
  }
</script>
<style lang="scss">
  @import 'scss/variables.scss';
  @import 'scss/mixin.scss';
  $iconImgUrl: '../../../src/assets/img';
  $bg: #FEF3CC;
  .bq-callapse-header {
    display: flex;
    padding: 0 15px;
    height: 30px;
    background: $bg;
    color: #505050;
    @include font-dpr(12px);
    &__title {
      flex: 1;
      display: flex;
      align-items: center;
    }
    &__btns {
      width: 60px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      .icon {
        padding-left: 6px;
      }

      .bq-icon-callapse-arrow-down {
        @include baseIcon('/components/collapse/arrow_down.png', 14px, 8px);
      }

      .bq-icon-callapse-arrow-up {
        @include baseIcon('/components/collapse/arrow_up.png', 14px, 8px);
      }
    }
  }
</style>
