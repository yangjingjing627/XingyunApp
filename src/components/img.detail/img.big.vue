<template>
 <div class="dialog modal" @click="closeDialog">
   <div class="img">
    <img :src="img" alt="">
   </div>
</div>
</template>
<script>
export default {
  name: 'img-big',
  data () {
    return {
    }
  },
  props: ['imgUrl'],
  mounted () {
    console.log(this.imgUrl)
  },
  computed: {
    img () {
      // let shui = '?imageView2/1/w/800/h/800/q/75|watermark/1/image' +
      // '/aHR0cDovL29vd21vdWlrZC5ia3QuY2xvdWRkbi5jb20vc2h1aXlpbjgwMC5wbmc=' +
      // '/dissolve/100/gravity/Center/dx/10/dy/10|imageslim'
      // return this.imgUrl + shui
      return this.imgUrl
    }
  },
  methods: {
    closeDialog () {
      this.$emit('closeDialog')
    }
  },
  components: {}
}
</script>
<style lang="scss" scoped>
@import 'scss/variables';
@import 'scss/mixin';
.dialog{
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -moz-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-direction: normal;
  -webkit-box-orient: horizontal;
  -webkit-flex-direction: horizontal;
  -moz-flex-direction: horizontal;
  -ms-flex-direction: horizontal;
  flex-direction: horizontal;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  -webkit-justify-content: center;
  -moz-justify-content: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.8);
  position: absolute;
  top:0;
  z-index: 2200;
  @media screen and (max-width: 600px) {
    .img{
      width: 85%;
      padding-top: 70%;
      margin: auto;
      position: relative;
      img{
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
      }
    }
  }
  @media only screen and (min-width: 600px) {
    .img{
      width: 500px;
      margin: auto;
      max-height: 500px;
      img{
        width: 100%;
        max-height: 500px;
      }
    }
  }
}
</style>
