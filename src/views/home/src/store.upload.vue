<template>
  <bq-page class="bq-page-store">
    <bq-header title="店铺信息认证"></bq-header>
    <bq-content style="background: #FBF9F1">
      <bq-card class="store-info">
        <bq-card-header title="提交认证信息后，即可开始低价订货了!" class="bq-store"></bq-card-header>
        <bq-card-input padding fixed no-margin  placeholder="不得超过30个汉字" :maxlength ="30" v-model="params.storeName">
          店铺名称
        </bq-card-input>
        <bq-card-input padding fixed no-margin placeholder="订货后，供货商会联系你" v-model="params.contact">
          联系人
        </bq-card-input>
        <bq-card-input padding fixed no-margin placeholder="输入身份证号" v-model="params.legalPersonPasscode" :maxlength="18">
          身份证
        </bq-card-input>
        <bq-card-input padding fixed no-margin placeholder="输入联系人手机号" v-model="params.contactMobile" :maxlength="11">
          联系手机
          <bq-button slot="button" class="button">
            <i></i>
          </bq-button>
        </bq-card-input>
        <bq-card-item padding fixed no-margin placeholder="选择行业" @click.native="showIndustrySelect">
          所属行业
          <i v-if="!params.industryName" class="selectcity">选择行业</i>
          <span class="selectcity">{{ params.industryName }}</span>
        </bq-card-item>
        <bq-card-item padding fixed @click.native="showSelect">
          收货地址
          <i v-if="!citySelectValue" class="selectcity">选择省市区</i>
          <span class="selectcity">{{ citySelectValue }}</span>
        </bq-card-item>
        <bq-card-input padding fixed type="textarea" placeholder="输入详细地址" v-model="params.address" ></bq-card-input>
      </bq-card>
      <bq-card class="bq-upload" style="background:#FBF9F1;">
        <bq-card-header title="营业执照照片" class="bq-f-size-16 no-border" ></bq-card-header>
        <bq-card-content padding>
          <bq-wx-upload  :single="true" v-model="params.certificates"></bq-wx-upload>
        </bq-card-content>
      </bq-card>
      <bq-card margin-top class="bq-upload" style="background:#FBF9F1">
        <bq-card-header title="法人身份证照片(正面)" class="bq-f-size-16 no-border" ></bq-card-header>
        <bq-card-content padding>
          <bq-wx-upload  :single="true" v-model="params.identityCardFrontImgUrl"></bq-wx-upload>
        </bq-card-content>
      </bq-card>
      <bq-card margin-top class="bq-upload" style="background:#FBF9F1">
        <bq-card-header title="法人身份证照片(反面)" class="bq-f-size-16 no-border" ></bq-card-header>
        <bq-card-content padding>
          <bq-wx-upload  :single="true" v-model="params.identityCardBehindImgUrl"></bq-wx-upload>
        </bq-card-content>
      </bq-card>
      <bq-card margin-top class="bq-upload" style="background:#FBF9F1">
        <bq-card-header title="店铺门头照片" class="bq-f-size-16 no-border"></bq-card-header>
        <bq-card-content padding>
          <bq-wx-upload  :single="true" v-model="params.storeDoorHeadImgUrl"></bq-wx-upload>
        </bq-card-content>
      </bq-card>
      <bq-card margin-top class="bq-upload" style="background:#FBF9F1">
        <bq-card-header title="店铺营业场所照片" class="bq-f-size-16 no-border" ></bq-card-header>
        <bq-card-content padding>
          <bq-wx-upload  :single="true" v-model="params.storeBusinessPlaceImgUrl"></bq-wx-upload>
        </bq-card-content>
      </bq-card>
      <div class="btn">
        <bq-button type="primary" size="large" @click.native="subMit()">确认并提交</bq-button>
      </div>
  </bq-content>
  <bq-select-city v-model="isCitySelect" @onClose="onClose"></bq-select-city>
  <bq-select v-model="isShow" :itemList="itemList" field="industryName" @confirm="onOK"></bq-select>
  </bq-page>
</template>
<script>
import LoginMixin from '@/mixins/login.mixin'
import HomeService from '@/services/home.service'
import CouponService from '@/services/coupon.service'
export default {
  mixins: [ LoginMixin ],
  data () {
    /* eslint-disable */
    return {
      isShow: false,
      phoneReg: /^1[34578]\d{9}$/,
      itemList: [],
      isCitySelect: false,
      citySelectValue: '',
      params: {
        storeName: '',
        contactMobile: '',
        legalPersonPasscode: '',
        address: '',
        contact: '',
        // certificates: 'http://localhost:8900/store/upload/18801268480',
        // identityCardFrontImgUrl: 'http://localhost:8900/store/upload/18801268480',
        // identityCardBehindImgUrl: 'http://localhost:8900/store/upload/18801268480',
        // storeDoorHeadImgUrl: 'http://localhost:8900/store/upload/18801268480',
        // storeBusinessPlaceImgUrl: 'http://localhost:8900/store/upload/18801268480',
        certificates: '',
        identityCardFrontImgUrl: '',
        identityCardBehindImgUrl: '',
        storeDoorHeadImgUrl: '',
        storeBusinessPlaceImgUrl: '',
        provinceId: '',
        cityId: '',
        districtId: '',
        countyId: '',
        tempArr: {},
        industryId: null,
        industryName: null
      },
      industry: [],
      select: null
    }
    /* eslint-enable */
  },
  beforeDestroy() {
    this.$messagebox.close()
  },
  mounted() {
    this.params.contactMobile = this.$route.params.phone
    this.HomeService = new HomeService()
    this.CouponService = new CouponService()
    this.getIndustry()
  },
  methods: {
    async getIndustry() {
      let res = await this.HomeService.getIndustry()
      this.industry = res
      this.$store.commit('UPDATE_LOADING', { isLoading: false })
    },
    showIndustrySelect () {
      this.isShow = true
      this.itemList = [{
        values: this.industry
      }]
    },
    onOK(values) {
      this.industry = values
      let arr = this.industry
      this.params.industryId = arr[0].industryId
      this.params.industryName = arr[0].industryName
    },
    showSelect() {
      window.location.hash = '#selectCity'
      this.isCitySelect = true
    },
    onClose(values) {
      this.$store.commit('UPDATE_LOADING', { isLoading: false })
      this.tempArr = values.filter(item => item.selectedId !== -1).map(item => item.selectedId)
      this.params.provinceId = this.tempArr[0]
      if (this.tempArr[1]) {
        this.params.cityId = this.tempArr[1]
      }
      if (this.tempArr[2]) {
        this.params.districtId = this.tempArr[2]
      }
      if (this.tempArr[3]) {
        this.params.countyId = this.tempArr[3]
      }
      this.citySelectValue = values.filter(item => item.selectedId !== -1).map(item => item.text).join(' ')
    },
    async subMit() {
      if ($.trim(this.params.storeName).length <= 0) {
        this.$toast('请输入店铺名称')
        return
      }
      if (!this.$bqUtils.vRegister($.trim(this.params.storeName))) {
        this.$toast('店铺名称只允许输入汉字，数字和英文字母')
        return
      }
      if ($.trim(this.params.contact).length <= 0) {
        this.$toast('请输入联系人')
        return
      }
      if ($.trim(this.params.legalPersonPasscode).length <= 0) {
        this.$toast('请输入身份证号')
        return
      }
      if (!this.$bqUtils.enIdentityCard($.trim(this.params.legalPersonPasscode))) {
        this.$toast('请输入正确的身份证号')
        return
      }
      if ($.trim(this.params.contactMobile).length <= 0) {
        this.$toast('请输入手机号')
        return
      }
      if (this.phoneReg.test($.trim(this.params.contactMobile)) !== true) {
        this.$toast('手机号有误请重新输入')
        return
      }
      if (!this.params.industryName) {
        this.$toast('请选择行业')
        return
      }
      if (!this.citySelectValue) {
        this.$toast('请选择省市区')
        return
      }
      if ($.trim(this.params.address).length <= 0) {
        this.$toast('请输入详细地址')
        return
      }
      if (!this.params.certificates) {
        this.$toast('请上传营业执照照片')
        return
      }
      if (!this.params.identityCardFrontImgUrl) {
        this.$toast('请上传法人身份证照片正面')
        return
      }
      if (!this.params.identityCardBehindImgUrl) {
        this.$toast('请上传法人身份证照片反面')
        return
      }
      if (!this.params.storeDoorHeadImgUrl) {
        this.$toast('请上传店铺门头照片')
        return
      }
      if (!this.params.storeBusinessPlaceImgUrl) {
        this.$toast('请上传店铺营业场所照片')
        return
      }
      let self = this
      let params = {
        uid: ''
      }
      let res = await this.HomeService.submitAuth(this.params)
      this.setLoginCookie(res)
      params.uid = res.uid
      this.$messagebox.alert('恭喜你，店铺认证信息提交成功！现在开始你的低价订货之旅吧！', {
        confirmButtonText: '确定'
      }).then(() => {
        self.CouponService.orderAddCoupon(params).then(res => {
          let info = res
          console.log(info)
          self.$store.commit('GET_NEW_USER_GIFTS', info)
          self.$router.replace('/home')
        })
      })
    }
  }
}
</script>
<style lang="scss">
@import 'scss/variables.scss';
@import 'scss/mixin';
.bq-page-store {
  .bq-store{
    background: #FEF3CC;
    @include font-dpr(14px);
    color: #FF8113;
  }
  .bq-input-wrapper .mint-button {
    display:inline-block;
    height: 41px;
    position: absolute;
    width: 75%;
    right: 14px;
    top: 0px;
    background: #fff;
  }
  .bq-input-wrapper .mint-button {
    width: 40px;
  }
  .button {
    i {
      position: absolute;
      display: inline-block;
      width: 20px;
      height: 20px;
      right: 11px;
      top: 11px;
      background: url(../../../assets/img/home/edit.png) no-repeat;
      background-size: 20px;
    }
  }
  .btn {
    padding: 0 15px;
    margin-top: 70px;
  }
  .bq-card-header:after {
    border-bottom: 0;
  }
  .bq-card-item__info {
    -webkit-box-flex: 6;
    -webkit-flex: 6;
    -ms-flex: 6;
    flex: 6;
  }

  .selectcity {
    width: 100%;
    text-align: center;
    padding-left: 10px;
  }
  .bq-card:after {
    border-bottom: 1px solid #ccc;
    border-top: 0;
    height: auto;
  }

  .bq-card.store-info {
    &:after {
      content: none;
    }
  }
}
</style>
