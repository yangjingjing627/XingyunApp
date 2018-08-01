<template >
  <bq-modal class="bq-fare-detail" v-model="currentVal" title="运费明细">
    <div class="title bq-f-size-12">
      <div>{{ getFareDetail.sellerName }}</div>
      <div>运费总金额：<span>￥{{ getFareDetail.carriageTotal }}</span></div>
    </div>
    <ul class="goodinfo" v-for="(item, index) in getFareDetail.carriageList" :key="'item' + index">
      <li v-for="good in item.goodsList" class="item" :key="good.goodsId">
        <img class="img" v-lazy="good.goodsImage" />
         <div class="bq-goods-right">
           <span>{{good.goodsName}}</span>
           <span v-if="good.propertyName !== '无'">
             {{ good.propertyName + '：' + good.propertyValue }}
           </span>
           <!-- <span>属性名：{{good.propertyValue || '无'}}</span> -->
           <span class="spec-unit">{{ good.specName1 || '无' }}/{{good.specName2 || '无'}}</span>
           <span class="gap">x {{ good.count }}</span>
         </div>
       </li>
       <div class="fare-path">
         <p>运费：<span>￥{{ item.total }}</span></p>
       </div>
       <div class="fare-footer bq-f-size-12" v-if="item.type == 1">
         <p>以上商品按件计费，货品总件数{{ item.totalCount }}件</p>
         <p>运费费率：首件({{ item.firstItemNum }}件){{ item.firstItemFee }}元；每增加{{ item.addItemNum }}件，增加运费{{ item.addItemFee }}元</p>
         <p>模板备注：{{ item.remarks }}</p>
       </div>
       <div class="fare-footer bq-f-size-12" v-if="item.type == 2">
         <p>以上商品按重量计费，货品总重量{{ item.heavy }}公斤</p>
         <p>运费费率：首重({{ item.firstItemNum }}公斤){{ item.firstItemFee }}元；每增加{{ item.addItemNum }}公斤，增加运费{{ item.addItemFee }}元</p>
         <p>模板备注：{{ item.remarks }}</p>
       </div>
    </ul>
  </bq-modal>
</template>
<script>
export default {
  name: 'fare-detail',
  data() {
    return {
      goodImglist: '',
      title: '',
      currentVal: this.value || false
    }
  },
  props: {
    getFareDetail: {
      type: Object,
      default: () => {}
    },
    value: {}
  },
  watch: {
    value(val) {
      this.currentVal = val
    },
    currentVal(val) {
      this.$emit('input', val)
    }
  }
}
</script>
<style lang="scss">
@import 'scss/variables.scss';
@import 'scss/mixin.scss';
.bq-fare-detail{
  position: relative;
  .title {
    // height: 32px;
    background: #FEF3CC;
    padding: 10px 15px;
    border-top: 1px solid $light-border-color;
    border-bottom: 1px solid $light-border-color;
    span {
      color: $danger;
    }
  }
  .bq-header{
    z-index: 0
  }
  .bq-isShow{
    width:100%;
    height: 45px;
    // background: red;
    position: absolute;
    z-index: 100;
  }
  .goodinfo {
    color: #666;
    height: auto;
    .item {
      width: 100%;
      // height: 71px;
      background: #fff;
      padding: 10px 15px 10px 10px;
      border-bottom: 1px solid $light-border-color;
      position: relative;
      .yc-mkt-discount {
        left: 10px;
        top: 10px;
      }
      .img {
        display: inline-block;
        width: 70px;
        height: 85%;
        top:6%;
        border: 1px solid #d8d8d8
      }
      .bq-goods-right{
        width: 74%;
        padding-left: 90px;
        @include font-dpr(14px);
        span:nth-child(1){
         overflow: hidden;
         text-overflow: ellipsis;
         display: -webkit-box;
         -webkit-line-clamp: 2;
         -webkit-box-orient: vertical;
         margin-bottom: 5px;
        }
        span{
          display: block;
          line-height: 18px;
        }
        span.spec-unit{
          float: left;
        }
        span.gap{
          float: right;
          margin-left: 15px;
        }
      }
    }
    .goods-right{
      width: 30%;
      position: absolute;
      right: 0;
      bottom: 20px;
    }
  }
  .fare-path {
    overflow: hidden;
    height: 42px;
    line-height: 42px;
    padding-right: 15px;
    p {
      float: right;
    }
    span {
      color: $danger;
    }
  }
  .fare-footer {
    padding: 10px;
    background: #F2F2F2;
    position: relative;
    p {
      @include font-dpr(12px);
      padding-bottom: 2px;
      word-break: break-all;
    }
  }
  .fare-footer:before {
    content: '';
    width: 0;
    height: 0;
    border-right: 5px solid transparent;
    border-bottom: 5px solid #F2F2F2;
    border-left: 5px solid transparent;
    position: absolute;
    top: -5px;
  }
}
</style>
