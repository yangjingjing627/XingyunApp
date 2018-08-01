<!-- 页面 提示插件  -->
<template lang="html">
  <div class="bq-page-prompt" :style="">
    <div class="bq-page-prompt__content">
      <i :class="icon"></i>
      <p class="bq-f-size-15">{{title}}</p>
      <div class="bq-page-prompt__btns" v-if="bottonText && goUrl">
        <bq-button type="primary" @click="onClick">{{ bottonText }}</bq-button>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'bq-prompt',
    props: {
      title: {
        type: String,
        default: '暂无数据'
      },
      icon: {
        type: String,
        default: 'bq-icon-prompt'
      },
      goUrl: String,
      bottonText: {
        type: String,
        default: '去逛逛'
      }
    },
    methods: {
      onClick() {
        if (this.goUrl) {
          this.$router.push(this.goUrl)
        }
      }
    }
  }
</script>
<style lang="scss">
  @import 'scss/variables.scss';
  @import 'scss/mixin.scss';
  $iconImgUrl:'../../../src/assets/img';
  .bq-page-prompt {
    width: 100%;
    height: 100%;
    z-index: 1000;
    background-color: #ffffff;
    position: relative;
    left: 0;
    top: 0;
    &__content {
      position: absolute;
      width: 300px;
      transform: translateX(-50%);
      left: 50%;
      top: 54px;
      display: flex;
      align-items: center;
      flex-direction: column;
      .bq-icon-prompt {
        @include baseIcon( '/components/prompt/shuju.png', 208px, 190px);
      }
      i {
        flex: 1;
        display: block;
      }
      p {
        margin-top: 10px;
        text-align: center;
        color: $font-color;
        @include font-dpr(16px);
        height: 30px;
        line-height: 30px;
      }
    }

    &__btns {
      margin-top: 16px;
      width: 100%;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      .mint-button {
        width: 160px;
        height: 40px;
        border-radius: 20px;
      }
    }
  }
</style>
