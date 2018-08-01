<template>
  <div class="assemble">
    <div class="assemble1"
    v-for="item,index in list"
    :style="{ background: item.background }"
    :class="{two: index === 1}">
      <div class="img">
        <img v-lazy="item.img" alt="">
      </div>
      <div class="title">
        <h3 :style="{ color: item.title1Color }">{{ item.title1 }}</h3>
        <h4 :style="{ color: item.title2Color }">{{ item.title2 }}</h4>
      </div>
      <div class="clear">
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
    }
  },
  props: ['list'],
  computed: {
  }
}
</script>
<style lang="scss" scoped>
@import 'scss/variables.scss';
@import 'scss/mixin.scss';
.assemble{
  .assemble1{
    &.two{
      margin-top: 3px;
      .img{
        float: right;
      }
    }
  }
}
  .assemble1{
    height: 100px;
    padding: 10px 20px 10px 73px;
    .img{
      width: 100px;
      height: 100px;
      float: left;
      margin-right: 20px;
      img{
        width: 100%;
        height: 100%;
      }
    }
    .title{
      float: left;
      max-width: 130px;
      h3{
        margin-top: 25px;
        line-height: 20px; /*no*/
        @include font-dpr(20px);
      }
      h4{
        height: 14px;/*no*/
        line-height: 14px;/*no*/
        @include font-dpr(14px);
        margin-top: 10px;
      }
    }
    .clear{
      clear: both;
    }
  }
</style>
