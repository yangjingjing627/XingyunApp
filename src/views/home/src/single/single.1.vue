<template>
  <div class="one"
  :style="bgStyle"
  @click="link(single)">
    <div class="img">
      <img v-lazy="single.programPic" alt="">
    </div>
    <div class="title">
      <h3 :style="{ color: single.mainTitleColor }">{{ single.mainTitleName }}</h3>
      <h4 :style="{ color: single.subTitleColor}">
        <i class="single-border-top" :style="{ background: single.subTitleColor}"></i>
        <i class="single-border-bottom" :style="{ background: single.subTitleColor}"></i>
        {{ single.subTitleName }}
      </h4>
    </div>
    <div class="clear">
    </div>
  </div>
</template>
<script>
import { goPage } from '../home'
export default {
  data() {
    return {
      single: this.list[0] || {}
    }
  },

  props: {
    list: {
      type: Array,
      default: () => [{}]
    }
  },

  watch: {
    list (val) {
      this.singleList = val[0] || {}
    }
  },

  computed: {
    bgStyle() {
      let {backgroundType, backgroundValue: val} = this.single
      return {
        background: backgroundType === 2 ? `url(${val})` : val
      }
    }
  },

  methods: {
    link (item) {
      goPage(this.$router, item)
    }
  }
}
</script>
<style lang="scss" scoped>
@import "./single.scss";
@import 'scss/variables.scss';
@import 'scss/mixin.scss';
  .one{
    height: 100px;
    padding-left: 78px;
    padding: 10px 20px 10px 78px;
    margin-bottom: 10px;
    background-size: contain;
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
      h3{
        margin-top: 25px;
        line-height: 20px; /*no*/
        @include font-dpr(20px);
      }
      h4{
        height: 20px;
        line-height: 20px;
        position: relative;
        @include font-dpr(14px);
        padding: 0 2px;
        // border-top: 1px solid;
        // border-bottom: 1px solid;
        margin-top: 8px;
      }
    }
    .clear{
      clear: both;
    }
  }
</style>
