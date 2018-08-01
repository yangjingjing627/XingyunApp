<template>
  <div class="brand">
    <ul>
      <li v-for="item in list">
        <h3 :style="{color: item.color}"> {{ item.title }}</h3>
        <div class="img">
          <img v-lazy="item.img" alt="">
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  data() {
    return {
      list: [
        {
          color: '#333',
          title: '整箱购',
          img: 'http://img.bqmart.cn/data/files/store/1501928062031.jpg'
        },
        {
          color: '#333',
          title: '整箱购1',
          img: 'http://img.bqmart.cn/data/files/store/1501928062031.jpg'
        },
        {
          color: '#333',
          title: '整箱购2',
          img: 'http://img.bqmart.cn/data/files/store/1501928062031.jpg'
        },
        {
          color: '#333',
          title: '整箱购3',
          img: 'http://img.bqmart.cn/data/files/store/1501928062031.jpg'
        },
        {
          color: '#333',
          title: '整箱购4',
          img: 'http://img.bqmart.cn/data/files/store/1501928062031.jpg'
        },
        {
          color: '#333',
          title: '整箱购5',
          img: 'http://img.bqmart.cn/data/files/store/1501928062031.jpg'
        },
        {
          color: '#333',
          title: '整箱购6',
          img: 'http://img.bqmart.cn/data/files/store/1501928062031.jpg'
        },
        {
          color: '#333',
          title: '整箱购7',
          img: 'http://img.bqmart.cn/data/files/store/1501928062031.jpg'
        },
        {
          color: '#333',
          title: '整箱购8',
          img: 'http://img.bqmart.cn/data/files/store/1501928062031.jpg'
        }
      ]
    }
  },
  computed: {
  },
  components: {
  }
}
</script>
<style lang="scss" scoped>
@import 'scss/variables.scss';
@import 'scss/mixin.scss';
.brand{
  width: 100%;
  margin-bottom: 10px;
  ul{
    display: block;
    width: 100%;
    overflow: hidden;
    li{
      width: 33.33%;
      float: left;
      text-align: center;
      box-sizing: border-box;
      padding: 17px 10px 10px 10px;
      &:nth-child(odd){
        background: #fff;
      }
      &:nth-child(even){
        background: #fafafa;
      }
      h3{
        @include font-dpr(14px);
        line-height: 14px;/*no*/
        margin-bottom: 9px;
      }
      .img{
        width: 75px;
        height: 75px;
        margin: 0 auto;
        img{
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>
