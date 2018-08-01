<template>
  <div class="assemble" >
    <div class="left" :style="{ background: list[0].background }">
      <div class="title">
        <h3 :style="{ color: list[0].title1Color }">{{ list[0].title1 }}</h3>
        <h4 :style="{ color: list[0].title2Color }">{{ list[0].title2 }}</h4>
      </div>
      <div class="img">
        <img v-lazy="list[0].img" alt="">
      </div>
    </div>
    <div class="right">
      <div class="assemble3"
      v-for="item,index in list"
      :style="{ background: item.background }"
      v-if="index !== 0"
      :class="{'two': index ===1, 'three': index === 2}">
      <div class="title">
        <h3 :style="{ color: item.title1Color }">{{ item.title1 }}</h3>
        <h4 :style="{ color: item.title2Color }">{{ item.title2 }}</h4>
      </div>
      <div class="img">
        <img v-lazy="item.img" alt="">
      </div>
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
*{
  box-sizing: border-box;
}
.assemble{
  overflow: hidden;
  text-align: center;
  height: 195px;
  margin-bottom: 3px;
  .left{
    float: left;
    width: 40%;
    height: 100%;
    .img{
      width: 110px;
      height: 110px;
      margin: 10px auto;
      img{
        width: 100%;
        height: 100%;
      }
    }
    .title{
      h3{
        margin-top: 25px;
        line-height: 16px; /*no*/
        @include font-dpr(16px);
      }
      h4{
        height: 12px;/*no*/
        line-height: 12px;/*no*/
        @include font-dpr(12px);
        margin-top: 8px;
      }
    }
  }
  .right{
    float: right;
    width: 59%;
    height: 100%;
    .assemble3{
      overflow: hidden;
      .title{
        max-width: 95px;
        @include text-overflow-1();
      }
      &.two{
        height: 96px;
        .img{
          float: right;
        }
        .title{
          float: left;
        }
      }
      &.three{
        margin-top: 3px;
        height: 96px;
        .img{
          float: left;
        }
        .title{
          float: right;
        }
      }
    }
  }
}
  .assemble3{
    padding: 8px 20px 0 20px;
    .img{
      width: 80px;
      height: 80px;
      img{
        width: 100%;
        height: 100%;
      }
    }
    .title{
      h3{
        margin-top: 25px;
        line-height: 15px; /*no*/
        @include font-dpr(15px);
      }
      h4{
        // height: 12px;
        line-height: 12px;
        @include font-dpr(11px);
        margin-top: 10px;
      }
    }
  }
</style>
