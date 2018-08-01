<!-- 组合购买提示语 -->
<template>
  <div class="yc-subtitle-text" v-if="subtitle">
    <span>{{ subtitle }}</span>
  </div>
</template>
<script>
  export default {
    name: 'yc-subtitle-text',
    data() {
      return {
      }
    },
    props: {
      subtitle: {}
    },
    computed: {
    },
    methods: {
    }
  }
</script>
<style lang="scss">
@import 'scss/mixin.scss';
  .yc-seller-info{
    .yc-subtitle-text{
      padding: 0px;
      position: relative;
      top: -8px;
    }
  }
  .yc-subtitle-text {
    padding: 4px 0;
    span{
      @include font-dpr(12px);
      color: #FF4E13;
      // display: inline-block;
      // border: 1px dotted #bdbdbd;
      background: #FFEDE2;
      box-sizing: border-box;
      // border-radius: 4px;
      line-height: 16px;/*no*/
      padding: 0px 4px;
    }
  }
</style>
