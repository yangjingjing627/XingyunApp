<template>
    <div class="item-img">
      <div :isdetail="isDetail" v-for="item in getTotal(getGoodImg)" :key="item.goodsIds">
        <div class="item-imglist">
          <img v-lazy="item.goodsImage">
        </div>
      </div>
  </div>
</template>
<script>
export default {
  name: 'item-img',
  data() {
    return {
      currentVal: this.value,
      contentShow: true
    }
  },
  props: {
    content: {},
    value: {},
    getGoodImg: Array,
    isDetail: Boolean
  },
  beforeMount() {
    if (this.$slots.default === undefined) {
      this.contentShow = false
    }
  },
  methods: {
    onSay() {
      this.$emit('on-say', this.currentVal)
    },
    getTotal(good) {
      return good.filter((item, index) => index <= 2)
    }
  }
}
</script>
<style lang="scss">
  .item-img {
    width:  100%;
    height: 80px;
    line-height: 0px;
    >div{
      &:last-child{
        .item-imglist{
          margin-right: 0;
        }
      }
    }
    .item-imglist{
      width: 60px;
      height: 60px;
      margin: 10px 5px;
      position: relative;
      border: 1px solid #ccc;
      float:left;
      &[isdetail=true] {
        border: 1px solid #ccc;
        margin-left: 10px;
        &:first-child {
          margin-left: 0px;
        }
      }
      img{
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
      }
    }
    @media screen and (max-width: 320px){
      .item-imglist{
        width: 55px;
        height: 55px;
      }
    }
  }
</style>
