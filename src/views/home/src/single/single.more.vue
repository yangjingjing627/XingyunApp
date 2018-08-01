<template>
  <div class="single swiper-container" :class="singleClass">
    <ul class="swiper-wrapper">
      <li v-for="item in list"
      :style="{ background: item.backgroundValue, backgroundImage: 'url(' + item.backgroundValue + ')' }"
      class="swiper-slide"  @click="link(item)">
        <div class="title">
          <h3 :style="{ color: item.mainTitleColor }">{{ item.mainTitleName }}</h3>
          <span :style="{ color: item.subTitleColor }">
            <i class="single-border-top" :style="{ background: item.subTitleColor}"></i>
            <i class="single-border-bottom" :style="{ background: item.subTitleColor}"></i>
            {{ item.subTitleName }}
          </span>
        </div>
        <div class="img">
          <img v-lazy="item.programPic" alt="">
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import { goPage } from '../home'
import Swiper from 'swiper'
export default {
  data() {
    return {
      singleList: []
    }
  },
  computed: {
    singleClass () {
      return this.list.length > 3 ? 'more' : 'single-' + this.list.length
    }
  },
  props: ['list'],
  watch: {
    list (val) {
      this.singleList = val
    }
  },
  mounted() {
    this.singleList = this.list
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    init() {
      this.$nextTick(() => {
        let swiper = new Swiper('.single', {
          direction: 'horizontal',
          freeMode: true,
          scrollbarHide: true,
          scrollbarDraggable: true,
          slidesPerView: 'auto',
          grabCursor: true
        })
        swiper.on('tap', s => {
          console.log($(s.clickedSlide).data('url'))
        })
      })
    },
    link (item) {
      goPage(this.$router, item)
    }
  }
}
</script>
<style lang="scss" scoped>
@import 'scss/variables.scss';
@import 'scss/mixin.scss';
@import 'scss/lib/swiper.scss';
@import "./single.scss";

  .single{
    width: 100%;
    height: 150px;
    margin-bottom: 10px;
    background: #fff;
    &.single-2{
      ul li{
        width: 50%;
      }
    }
    &.single-3{
      ul li{
        width: 33.33%;
      }
    }
    &.more{
      display: block;
      ul li{
        width: 110px;
      }
    }
    ul li{
      float: left;
      height: 100%;
      background-size: contain;
      .title{
        box-sizing: border-box;
        padding: 10px;
        text-align: center;
        h3{
          line-height: 15px; /*no*/
          @include font-dpr(15px);
          @include text-overflow-1();
        }
        span{
          @include text-overflow-1();
          display: inline-block;
          padding: 0 2px;
          @include font-dpr(11px);
          position: relative;
          margin-top: 7px;
        }
      }
      .img{
        width: 80px;
        height: 80px;
        margin: 0 auto;
        img{
          width: 100%;
          height: 100%;
        }
      }
    }
  }
</style>
