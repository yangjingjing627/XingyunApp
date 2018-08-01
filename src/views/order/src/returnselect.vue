<template>
  <bq-page class="returnselect-info">
    <bq-header title="选择退货商品">
    </bq-header>
    <bq-content>
      <search-bar v-model="keyword" @scan="onScan"></search-bar>
      <bq-card v-show="item.show" v-for="item,index in info" :key="index">
        <bq-card-content padding>
          <div class="good-item">
            <div class="img">
              <i v-if="item.enable_check" class="bq-checkbox">
                <input class="bq-checkbox-input"  type="checkbox" v-model="item.checked" @change="selectGood(item)">
              </i>
              <yc-mkt-discount v-if="item.marketingType===40 && item.isGifts" class="zeng-discount">赠品</yc-mkt-discount>
              <!-- <yc-mkt-discount v-if="item.marketingType===20">{{ item.marketingRule }}折</yc-mkt-discount> -->
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
              <p><span class="spec">规格：{{ item.spec || '无' }}</span><span class="text">单位：{{ item.unit || '无' }}</span></p>
              <p>单价：
                <i>￥{{ $bqUtils.moneyFixed(item.price) }}</i>
                <yc-origin-price :goodsInfo="item">
                  ￥{{ $bqUtils.moneyFixed(item.originalPrice)}}
                </yc-origin-price>
              </p>
            </div>
            <div class="count">
              <span>实收数量：{{ item.receiveCount }}</span>
              <div><span class="return">可退数量：</span><modify-order :goodsData="item" v-on:modifyOrderEnd = "modifyOrderEnd"></modify-order></div>
            </div>
          </div>
          <div class="date">
            <div>生产日期：
              <span class="selectdate" @click="timeSelect(index)">{{ item.productTime }}</span>
            </div>
            <div class="keep">保质期：
              <span class="keepdate">
                <span class="text"><input type="number" v-model="item.safeTime" @input="changeSafeTime(item)"></span>
                <span class="btn" @click="getKeepDate(index)">{{ item.keepTypeName }}</span>
              </span>
            </div>
          </div>
          <p class="tip" v-if="item.error_period">保质期请填正整数</p>
        </bq-card-content>
      </bq-card>
    </bq-content>
    <bq-card class="footer">
      <bq-card-footer>
        <i class="bq-checkbox sel">
          <i class="model" @click="selectAll"></i>
          <input class="bq-checkbox-input sel-input" id="all" type="checkbox" v-model="checkAll" :disabled="info.length < 1">
          <label v-if="!checkAll" >全选</label>
          <label v-if="checkAll" >全不选</label>
        </i>
        <bq-button class="btn" type="primary" @click="next" :disabled="!checkOk || false"><i>下一步</i></bq-button>
      </bq-card-footer>
    </bq-card>
    <bq-popup v-model="popup_name" position="bottom" closeOnClickModal="true" popup-transition="popup-fade">
      <div class="popup-content">
        <ul>
          <li v-if="list.name" v-for="list,index in date_list" @click="selectKeep(list)">{{ list.name }}</li>
        </ul>
      </div>
    </bq-popup>
    <bq-datetime-picker
      ref="datePicker"
      type="date"
      v-model="pickerValue"
      @confirm="sureDate">
    </bq-datetime-picker>
  </bq-page>
</template>
<script>
import OrderService from '@/services/order.service'
import { Popup } from 'mint-ui'
import { mapState } from 'vuex'
import modifyOrder from '@/components/modify/modify.order'
export default {
  data() {
    return {
      keyword: '',
      info: [],
      pickerValue: '',
      tag: 0,
      checkOk: false,
      checkAll: false,
      only_index: null,
      date_show: -1,
      popup_name: false,
      keepType_tag: -1,
      date_list: [
        {name: '天', type: 0},
        {name: '月', type: 1},
        {name: '年', type: 2}
      ]
    }
  },
  computed: {
    ...mapState({
      list: state => state.returnorder.orderList
    })
  },
  mounted () {
    this.pickerValue = new Date()
    this.OrderService = new OrderService()
    if (this.list.length > 0) {
      this.info = this.list
      this.checkNext()
      this.$store.commit('GET_RETURN_ORDERLIST', [])
    } else {
      this.getReturnBefore()
    }
  },
  watch: {
    keyword(keyword) {
      if (keyword) {
        this.info.forEach(function(item) {
          if (item.goodsName.indexOf(keyword) >= 0 || item.sku.indexOf(keyword) >= 0) {
            item.show = true
          } else {
            item.show = false
          }
        })
      } else {
        this.info.forEach(function(item) {
          item.show = true
        })
      }
    }
  },
  methods: {
    // 获取商品信息
    async getReturnBefore () {
      let params = {
        orderId: this.$route.params.orderId
      }
      let res = await this.OrderService.getReturnBefore(params)
      res.orderDetailList.map(function(item) {
        item.show = true
        item.enable_check = false
        item.checked = false
        item.setquantity = item.canReturnCount
        item.safeTime = ''
        item.productTime = ''
        item.keepType = 0
        item.keepTypeName = '天'
        item.error_period = ''
        return item
      })
      this.info = res.orderDetailList

    },
    timeSelect (index) {
      this.$refs.datePicker.open()
      this.only_index = index
    },
    // 选择生产日期
    sureDate () {
      this.info[this.only_index].productTime = this.$bqUtils.dateFormat(this.pickerValue, 'yyyy-MM-dd')
      this.checkCheck(this.info[this.only_index], true)
    },
    // 数量的加减
    modifyOrderEnd (item) {
      let self = this
      for (let i of self.info) {
        if (i.orderDetailId === item.orderDetailId) {
          i.setquantity = item.count
          this.checkCheck(i, true)
        }
      }
    },
    // 选择商品
    selectGood (item) {
      this.selectCheck(item)
    },
    // 选择选择框
    selectCheck (item) {
      if (item.checked) {
        this.checkOk = true
      } else {
        if (this.info.length > 1) {
          this.checkOk = this.info.reduce(function(a, b) {
            return (a || b.checked)
          }, false)
        } else {
          this.checkOk = item.checked
        }
      }
      this.checkAll = this.info.reduce(function(a, b) {
        if (b.enable_check) {
          return (a && b.checked)
        } else {
          return (a && true)
        }
      }, true)
    },
    // 全选
    selectAll () {
      let self = this
      if (self.info.length === 0) {
        self.checkAll = false
        self.checkOk = false
      } else {
        self.checkAll = !self.checkAll
        self.info.map(function(item) {
          if (item.enable_check) {
            item.checked = self.checkAll
          } else {
            item.checked = false
          }
          return item
        })
        self.checkNext()
      }
    },
    // 选择保质期单位
    selectKeep (item) {
      this.popup_name = false
      this.info[this.keepType_tag].keepType = item.type
      this.info[this.keepType_tag].keepTypeName = item.name
    },
    getKeepDate (index) {
      let self = this
      self.popup_name = !self.popup_name
      this.keepType_tag = index
    },
    // 修改保质期
    changeSafeTime (item) {
      this.checkCheck(item, false)
    },
    // 检测是否可选
    checkCheck(item, init) {
      let re = /^[0-9]*[1-9][0-9]*$/
      if (!init && (!item.safeTime || !re.test(item.safeTime))) {
        item.error_period = true
      } else {
        item.error_period = false
      }
      if (item.setquantity > 0 && item.productTime && item.safeTime && !item.error_period) {
        item.enable_check = true
        this.checkAll = false
      } else {
        item.checked = false
        item.enable_check = false
      }
      this.checkNext()
    },
    // 检测是否可点下一步
    checkNext() {
      let count = 0
      this.checkAll = this.info.reduce(function(a, b) {
        if (b.enable_check) {
          count++
          return (a && b.checked)
        } else {
          return (a && true)
        }
      }, true)
      if (this.info.length > 0) {
        this.checkOk = this.info.reduce(function(a, b) {
          return (a || b.checked)
        }, false)
      }
      if (count === 0) {
        this.checkOk = this.checkAll = false
      }
    },
    next () {
      let amount = 0
      let total = 0
      let goodlist = []
      let i = 0
      for (let item of this.info) {
        if (item.checked === true) {
          total += item.setquantity * 1
          amount += item.price * item.setquantity
          goodlist[i] = item
          i++
        }
      }
      let info = {
        ...goodlist,
        'amount': amount,
        'total': total
      }
      this.$store.commit('GET_RETURN_ORDERLIST', this.info)
      this.$store.commit('GET_RETURN_ORDERINFO', info)
      this.$router.push('/order/returnselect/reason/' + this.$route.params.orderId)
    },
    onScan(val) {
      this.keyword = val
    }
  },
  components: {
    bqPopup: Popup,
    modifyOrder
  }
}
</script>
<style lang="scss">
@import "./returnselect.scss";
</style>
