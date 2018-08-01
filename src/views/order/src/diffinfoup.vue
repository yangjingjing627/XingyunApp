<template>
  <bq-page class="diffinfoup">
    <bq-header title="差异商品凭证上传">
    </bq-header>
    <bq-content>
      <bq-card>
        <bq-card-header class="areatext-header" title="差异商品凭证-文本描述(*)"></bq-card-header>
        <bq-card-input class="areatext" padding type="textarea" :maxlength="maxRemarkLength" v-model="diffDescription">
        </bq-card-input>
        <p class="areatext-tip">{{ diffDescription.length }}/{{ maxRemarkLength }}</p>
      </bq-card>
      <bq-card>
        <bq-card-header class="img-header" title="差异商品凭证-图片证明(*)"></bq-card-header>
        <bq-card-content padding>
          <bq-wx-upload @on-success="onSuccess" :count="3" ></bq-wx-upload>
          <p class="upload-text">最少上传1张图片</p>
        </bq-card-content>
      </bq-card>
      <bq-card v-for="item,index in info.goodsList" :key="item.sku" v-if="item.sku">
        <bq-card-header title="差异商品明细" v-if="index === 0"></bq-card-header>
        <bq-card-content padding>
          <div class="img">
            <yc-mkt-discount v-if="item.marketingType===40 && item.isGifts" class="zeng-discount">赠品</yc-mkt-discount>
            <!-- <yc-mkt-discount v-if="item.marketingType === 20">{{ item.marketingRule }}折</yc-mkt-discount> -->
            <yc-activity-icon
              :rule="item.marketingRule"
              type="orderGoodsList"
              :activityType="item.marketingType"
            ></yc-activity-icon>
            <img v-lazy="item.goodsImage">
          </div>
          <div class="info">
            <p>条码：{{ item.sku }}</p>
            <p>{{ item.goodsName }}</p>
            <p v-if="item.propertyName && item.propertyName !== '无'">
              {{ item.propertyName + '：' + item.propertyValue }}
            </p>
            <p><span class="spec">规格：{{ item.goodsSpec || '无' }}</span><span class="text">单位：{{ item.goodsSellUnit || '无' }}</span></p>
            <p>单价：￥{{ $bqUtils.moneyFixed(item.price) }}
              <yc-origin-price :goodsInfo="item">
                ￥{{ $bqUtils.moneyFixed(item.originalPrice)}}
              </yc-origin-price>
            </p>
          </div>
          <div class="count">
            <div>
              <span>订货数量：{{ item.goodsNum }}</span>
              <span>实收数量：{{ item.checkNum }}</span>
            </div>
            <div>
              <span>差异数量：{{ item.diffNum }}</span>
              <span>差异金额小计：<i class="money">￥{{ $bqUtils.moneyFixed(item.diffSmallPrice) }}</i></span>
            </div>
          </div>
        </bq-card-content>
      </bq-card>
    </bq-content>
    <bq-card class="footer">
      <bq-card-footer>
        <div class="all-count">
          <div>
            <p>差异总数量：{{ info.diffNumber }}</p>
            <p>差异总金额：<i class="money">￥{{ $bqUtils.moneyFixed(info.diffPrice) }}</i></p>
          </div>
        </div>
        <bq-button class="btn" type="primary" @click="submit"><i>确认并提交</i></bq-button>
      </bq-card-footer>
    </bq-card>
  </bq-page>
</template>
<script>
import OrderService from '@/services/order.service'

export default {
  data() {
    return {
      val: '',
      diffDescription: '',
      info: {},
      uploadValues: '',
      maxRemarkLength: 200,
      diffImage: {}
    }
  },
  mounted () {
    this.OrderService = new OrderService()
    this.getCheckDiffList()
  },
  methods: {
    onSuccess(val) {
      this.uploadValues = val
    },
    async getCheckDiffList() {
      let params = {
        orderId: this.$route.params.orderId
      }
      let res = await this.OrderService.getCheckDiffList(params)
      this.info = res
    },
    async submit() {
      if (this.diffDescription.replace(/(^\s*)|(\s*$)/g, '') === '') {
        this.$messagebox.alert('文本描述内容不能为空!')
        return
      } else if (this.diffDescription.length > 200) {
        this.$messagebox.alert('备注信息不得超过200字!')
        return
      } else if (this.$bqUtils.isEmojiCharacter(this.diffDescription)) {
        this.$messagebox.alert('文本描述内容不能含有emoji表情!')
        return
      }
      // this.uploadValues = 'http://ogd5wcvme.bkt.clouddn.com/no-img.png'
      if (!this.uploadValues) {
        this.$messagebox.alert('最少上传1张图片!')
        return
      } else {
        let str = this.uploadValues.split(',')
        let obj = {imgUrl1: '', imgUrl2: '', imgUrl3: ''}
        for (let i = 0; i < str.length; i++) {
          obj.imgUrl1 = str[0]
          obj.imgUrl2 = str[1]
          obj.imgUrl3 = str[2]
        }
        this.diffImage = obj
      }
      let params = {
        orderId: this.$route.params.orderId,
        diffDescription: this.diffDescription,
        diffImage: JSON.stringify(this.diffImage)
      }
      await this.OrderService.orderConfirmSubmit(params)
      let self = this
      this.time = setInterval(function() {
        self.getStus()
      }, 1000)
    },
    async getStus() {
      let params = {
        redisKey: this.$route.params.orderId,
        type: 4
      }
      try {
        let res = await this.OrderService.operationProgressGet(params)
        if (res.status !== 1) {
          clearInterval(this.time)
          if (res.status === 0) {
            this.$messagebox.alert('恭喜你确认收货成功！订货商品已按照实收数量同步到销售端，为不影响您的正常销售请您到销售端确认商品的零售价和上下架状态是否正确！', {
              confirmButtonText: '继续订货'
            }).then(() => {
              this.$router.push('/category')
            })
          } else {
            this.$messagebox.alert(res.msg)
          }
        }
      } catch (e) {
        clearInterval(this.time)
        this.$messagebox.alert(e.message)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import 'scss/variables';
@import 'scss/mixin';
.diffinfoup {
  .bq-card:after {
    border-left: none;
    border-right: none;
  }
  .bq-card:first-child {
    &:after {
      border-top: none;
    }
  }
  .bq-card:first-child {
    margin-bottom: 10px;
  }
  .bq-card {
    margin-bottom: 11px;
  }
  .areatext-header:first-child{
    &:after {
      border-bottom: none;
    }
  }
  .bq-card-header:before {
    content: '';
    width: 5px;
    height: 15px;
    background: $danger;
    float: left;
    margin: 9px 5px 0 0;
  }
  .bq-card:first-child{
    padding-bottom: 2px;
  }
  .areatext{
    padding: 0px 15px;
    height: 90px;
    @include font-dpr(12px);
    border: 1px solid $light-border-color;
    margin-bottom: 0px;
  }
  .bq-input-wrapper:after {
    background: none;
  }
  .areatext-tip {
    @include font-dpr(12px);
    color: #999;
    text-align: right;
    padding: 5px 15px 5px 0;
  }
  .bq-card-content {
    padding-bottom: 0;
    .bq-wx-upload {
      margin-top: 5px;
      padding: 0;
    }
    .upload-text {
      @include font-dpr(12px);
      color: #999;
      padding: 10px 0 15px 0;
    }
    .img {
      float: left;
      width: 60px;
      height: 60px;
      text-align: center;
      border: 1px solid $light-border-color;
      position: relative;
      top: 0px;
      img {
        width: 100%;
        height: 100%;
      }
      .zeng-discount {
        left: 0px;
        font-size: 10px;
        padding: 0px 5px;
        height: 20px;
        line-height: 20px;
        -webkit-text-size-adjust:none;
        -webkit-transform:scale(0.8);
        -webkit-transform-origin:0 0;
        -o-transform:scale(1);
        background-color: #FF8113;
      }
    }
    .info {
      width: 70%;
      margin-left: 75px;
      p{
        margin-bottom: 5px;
        overflow: hidden;
      }
      .text, .spec{
        display: inline-block;
        float: left;
      }
      .text {
        margin-left: 20px;
      }
      .spec{
        max-width: 150px;
        @include text-overflow-1;
      }
    }
    .count {
      margin-top: 20px;
      span {
        @include font-dpr(14px);
        margin-bottom: 20px;
        display: inline-block;
      }
      div {
        overflow: hidden;
        span:last-child {
          float: right;
        }
      }
    }
  }
  .footer {
    width: 100%;
    margin: 0;
    position: absolute;
    left: 0px;
    bottom: 0px;
    z-index: 10;
    .bq-card:after {
      border: none;
    }
    .mint-button--primary {
      i {
        @include font-dpr(16px);
      }
    }
    .all-count {
      height: 52px;
      position: absolute;
      left: 15px;
      display: flex;
	    align-items: center;
      @include font-dpr(14px);
    }
    .btn {
      width: 140px;
      height: 52px;
      line-height: 52px;
    }
    .bq-card-footer {
      padding-right: 0;
    }
  }
  .footer:after {
    border-top: none;
  }
  .money {
    color: $danger;
  }
  .bq-content {
    margin-bottom: 40px;
  }
}
</style>
