<!-- 折扣 -->
<template>
  <div class="yc-activity-icon">
    <span class="combin" :class="{'bixuan': bixuan}" v-if="atype === 50 && zuheicon"></span>
    <span class="zhi-jiang" v-if="atype === 60 && changeType === 1"></span>
    <span class="yc-mkt-discount" v-if="atype === 20">
      {{ zhekou }}折
    </span>
  </div>
</template>
<script>
  export default {
    name: 'yc-activity-icon',
    data() {
      return {
        // chuxiao: ''
      }
    },
    props: {
      ycActivity: {
        type: Object,
        default () {
          return {
            chuxiao: undefined,
            activityType: 0,
            changeType: 0
          }
        }
      },
      rule: {},
      activityType: {},
      type: {}
    },
    computed: {
      activityRule () {
        let crule = this.$bqUtils.jsonParse(this.rule)
        return crule
      },
      changeType () {
        return this.ycActivity.changeType || this.activityRule.changeType
      },
      atype () {
        return this.ycActivity.activityType || this.activityType
      },
      bixuan () {
        if ((this.type === 'combinPage' || this.type === 'cartDetail' || this.type === 'orderGoodsList') && this.changeType !== 1) {
          return true
        } else {
          return false
        }
      },
      zuheicon () {
        if (this.changeType === 1 || this.bixuan) {
          return true
        } else {
          return false
        }
      },
      zhekou () {
        return this.ycActivity.chuxiao || this.rule
      }
    }
  }
</script>
<style lang="scss">
$iconImgUrl: '../../assets/img';
.bq-order-confirm .goodinfo .item {
  .yc-activity-icon{
    .yc-mkt-discount {
      left: 0;
      top: 0;
    }
  }
}
.bq-order-confirm, .diff-card-item{
  .yc-activity-icon{
    top: 10px;
    left: 15px;
  }
}
.yc-activity-icon{
  min-width: 32px;
  position: absolute;
  top: 0;
  left: 0;
  height: 16px;/*no*/
  line-height: 16px;/*no*/
  text-align: center;
  background-clip: padding-box;
  box-sizing: border-box;
  font-size: 10px;/*no*/
  z-index: 3;
  span{
    display: block;
    &.combin{
      width: 46px;
      height: 14px;
      background: url(#{$iconImgUrl}/components/mkt.label/combin-master.png) no-repeat center;
      background-size: 46px;
      &.bixuan{
        background: url(#{$iconImgUrl}/components/mkt.label/combin-dev.png) no-repeat center;
        background-size: 46px;
      }
    }
    &.zhi-jiang{
      width: 26px;
      height: 14px;
      background: url(#{$iconImgUrl}/components/mkt.label/zhijiang.png) no-repeat center;
      background-size: 26px;
    }
  }
  .yc-mkt-discount {
    top: 0;
    left: 0;
  }
}
  .yc-mkt-discount {
    background-color: #50B24B;
    color: #fff;
  }
  .bq-android {
    .yc-mkt-discount {
      line-height: 17px;/*no*/
    }
  }
</style>
