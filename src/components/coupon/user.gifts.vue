<template>
  <div class="user-gifts">
    <div class="dialog-content":class="{'dialog-bg': tagShow.failShow}">
      <div :class="{'title': type === 1, 'order-title':type === 6 && !tagShow.couponShow && !tagShow.failShow}">
        <p v-if="tagShow.couponShow" class="gifts-title bq-f-size-20" style="color:#fff">恭喜你，领到大礼包！</p>
        <p v-if="type === 1" class="gifts-title bq-f-size-18">新用户礼包</p>
        <p v-if="type === 6 && !tagShow.couponShow && !tagShow.failShow" class="gifts-title bq-f-size-26" style="color:#fff">Duang</p>
        <p style="color:#fff; font-size:14px" v-if="tagShow.couponShow">已放入你的账户，{{ info.userPhone }}</p>
        <p v-if="type === 6 && !tagShow.couponShow && !tagShow.failShow" class="bq-f-size-18">喜从天降，试试你的手气吧！</p>
      </div>
      <ul v-if="type === 1 || tagShow.couponShow" :class="{'order-ul': type === 6 && !tagShow.couponShow && !tagShow.failShow}">
        <li v-for="(item, index) in info.couponList" :key="'item'+ index">
          <div class="top">
            <div class="way">
              <!-- {{item.couponTypeDesc}} -->
              <i v-if="item.couponType == 10" class="bq-f-size-12" :class="{'tag1': item.couponType == 10}">[{{item.couponTypeDesc}}]</i>
              <i v-if="item.couponType == 20" class="bq-f-size-12" :class="{'tag2': item.couponType == 20}">[{{item.couponTypeDesc}}]</i>
              <i v-if="item.couponType == 30" class="bq-f-size-12" :class="{'tag3': item.couponType == 30}">[{{item.couponTypeDesc}}]</i>
              <span class="bq-f-size-14 couponName">{{ item.couponName }}</span>
            </div>
            <p class="rule">
              <span v-if="item.couponType == 10">无使用门槛</span>
              <span v-if="item.couponType == 20 || item.couponType == 30">满{{ item.amountLimit }}元可用</span>
              <span v-if="item.couponType == 10 || item.couponType == 20" class="money">￥<i class="bq-f-size-25">{{ item.faceValue }}</i></span>
              <span v-if="item.couponType == 30" class="money"><i class="bq-f-size-25">{{ item.faceValue }}</i>折</span>
            </p>
          </div>
          <div class="footer">
            <p>{{ item.validPeriodStart }} - {{ item.validPeriodEnd }} 有效</p>
          </div>
        </li>
      </ul>
      <div class="gift-hongbao" v-if="type === 6 && !tagShow.couponShow && !tagShow.failShow">
        <div class="chai" id="chai" :class="{'rotate': tagShow.isRotate}"  @click="getRotate()">
             <!-- <span>拆</span> -->
         </div>
      </div>
      <div class="gift-error" v-if="tagShow.failShow">
        <img src="../../assets/img/error.png" alt="1" width="80" height="80">
        <h4 class="bq-f-size-18">真是的，手气欠佳</h4>
        <p class="bq-f-size-13">就差了那么一毫米，不要气馁哦~</p>
      </div>
      <div class="btn-box" v-if="type === 1 || tagShow.couponShow">
        <button v-if="type === 1" class="btn bq-f-size-16" @click="known">知道了</button>
        <button v-if="tagShow.couponShow" class="btn bq-f-size-16" @click="Toknown">去看看</button>
      </div>
      <div class="btn-box btn-bot" v-if="tagShow.failShow">
        <button  class="btn bq-f-size-16" @click="moreKnown">再来一单试试</button>
      </div>
      <button class="order-btn" v-if="type === 6 && !tagShow.couponShow && !tagShow.failShow" @click="abandon">忍痛放弃</button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'user-gifts',
  data() {
    return {
    }
  },
  props: {
    info: {},
    type: '',
    tagShow: {}
  },
  methods: {
    known () {
      this.$store.commit('GET_NEW_USER_GIFTS', {})
      this.$emit('closeDialog')
      this.tagShow.isRotate = false
    },
    getRotate () {
      this.tagShow.isRotate = true
      this.$emit('Rotate')
    },
    moreKnown () {
      this.tagShow.isRotate = false
      this.$router.replace('/home')
    },
    Toknown () {
      this.$router.replace('/me/coupon')
    },
    abandon () {
      this.$emit('closeDialog')
    }
  }
}
</script>
<style lang="scss" scoped>
@import 'scss/variables';
@import 'scss/mixin';
.user-gifts {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(0,0,0,0.60);
  z-index: 10000;
  .dialog-content {
    width: 300px;
    // height: 58.7%;
    height: 390px;
    background: url(../../assets/img/coupon-bg.png) no-repeat;
    background-size: 100%;
    position: relative;
    left: 50%;
    top: 50%;
    margin-left: -150px;
    margin-top: -200px;
    padding-top: 26px;
    // overflow: hidden;
    .title {
      color: #FFFCED;
      text-align: center;
      position: relative;
      p {
        margin-bottom: 2px;
      }
      .gifts-title{
        font-weight: 700;
        color: #fff;
      }
      .gifts-title:before,.gifts-title:after {
        content: '';
        width: 4px;
        height: 4px;
        display: inline-block;
        background: #fff;
        border-radius: 2px;
        margin: 5px;
        margin-top: 0;
      }
    }
    .order-title{
      width: 300px;
      // height: 58.7%;
      height: 390px;
      background: url(../../assets/img/bg-top.png) no-repeat;
      background-size: 100%;
      position: relative;
      left: 50%;
      top: 50%;
      margin-left: -150px;
      margin-top: -220px;
      padding-top: 26px;
      color: #FFFCED;
      text-align: center;
      font-weight: 200;
      p {
        margin-bottom: 2px;
      }
      .gifts-title:before,.gifts-title:after {
        content: '';
        width: 4px;
        height: 4px;
        display: inline-block;
        background: #fff;
        border-radius: 2px;
        margin: 5px;
        margin-top: 0;
      }
    }
    ul {
      height: 235px;
      overflow: scroll;
      margin-top: 10px;
      li {
        width: 256px;
        margin: 0 auto;
        background: #fff;
        border-radius: 3px;
        margin-bottom: 10px;
        overflow: hidden;
        .top {
          padding: 10px 0 0 11px;
          .way{
            text-align: left;
          }
          .tag1 {
            color: #FF3D3D;
          }
          .tag2 {
            color: #FF8113;
          }
          .tag3 {
            color: #4AA7F5;
          }
        }
        .rule {
          text-align: left;
          font-size: 11px;
          -webkit-text-size-adjust:none;
          -webkit-transform:scale(0.9);
          -webkit-transform-origin:0 0;
          -o-transform:scale(1);
          color: #999999;
          height: 30px;
          line-height: 34px;
          margin-top: -2px;
          .money {
            float: right;
            color: $coupon-color;
            margin-top: -5px;
          }
        }
        .footer {
          display: inline-block;
          width: 100%;
          color: #999999;
          background: #F5F5F5;
          height: 24px;
          line-height: 24px;
          padding-left: 11px;
          p {
            font-size: 10px;
            padding-top: 2px;
            -webkit-text-size-adjust:none;
            -webkit-transform:scale(0.9);
            -webkit-transform-origin:0 0;
            -o-transform:scale(1);
          }
        }
      }
    }
    .order-ul{
      height: 235px;
      overflow: scroll;
      margin-top: 10px;
      background: url(../../assets/img/bg-bottom.png) no-repeat;
      background-size: 100%;
    }
    .gift-error{
      position: absolute;
      top:50%;
      text-align: center;
      margin: 0 auto;
      width: 100%;
      height: 150px;
      margin-top:-100px;
      color: #fff;
      h4{
        color: #333;
      }
      p{
        color: #666;
      }
      img{
        display: inline-block;
        width: 105px;
        height: 125px;
      }
    }
    .btn-box {
      width: 100%;
      height: 80px;
      position: absolute;
      bottom: 22px;
      z-index: 100;
      background: url(../../assets/img/coupon-bg-bottom.png) no-repeat;
      background-size: 100%;
      .btn {
        width: 140px;
        height: 36px;
        display: block;
        margin: 22px auto;
        background-image: linear-gradient(-180deg, #FFDA3D 0%, #DBB200 100%);
        box-shadow: 0 2px 4px 0 rgba(0,0,0,0.08);
        border-radius: 18px;
        color: #C65501;
      }
    }
    .btn-bot{
      bottom: -5px;
    }
    .order-btn{
      width: 80px;
      position: absolute;
      bottom: 20%;
      left: 38%;
      margin-left: -40px;
      z-index: 100;
      margin: 0 auto;
      color: #fff;
      border-bottom: 1px solid #FFFCED;
      font-weight: 200;
      font-size: 15px;
      color: #FFFCED;
    }
    .gift-hongbao{
      text-align: center;
      margin: 0 auto;
      width: 100%;
      height: 100%;
      margin-top: -55px;
      background: url(../../assets/img/bg-bottom.png) no-repeat;
      background-size: 100%;
      #chai{
        position: absolute;
        left:50%;
        top:50%;
        width: 122px;
        height: 122px;
        margin-left:-61px;
        margin-top:-100px;
        background: url(../../assets/img/chai.png) no-repeat;
        background-size: 100%;
        border-radius: 50%;
        color: #fff;
        text-align: center;
        vertical-align: middle;
        line-height: 122px;
        display: inline-block;
        // box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.2);
        cursor: pointer;
      }
      .rotate{
          -webkit-animation: anim .6s infinite alternate;
              -ms-animation: anim .6s infinite alternate;
                  animation: anim .6s infinite alternate;
      }
      @-webkit-keyframes anim {
          from { -webkit-transform: rotateY(180deg); }
          to { -webkit-transform: rotateY(360deg); }
      }
      @-ms-keyframes anim {
          from { -ms-transform: rotateY(180deg); }
          to { -ms-transform: rotateY(360deg); }
      }
      @keyframes anim {
          from { transform: rotateY(180deg); }
          to { transform: rotateY(360deg); }
      }
    }
  }
  .dialog-bg{
    background: #fff;
    border-radius: 7px;
  }
}
</style>
