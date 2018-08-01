<template>
  <bq-page class="demo-card">
    <bq-header title="card"></bq-header>
    <bq-content>
      <modify-cart :cartData="cartData" type="cart" v-on:modifyCartEnd = "modifyCartEnd"></modify-cart>
      <div class="modify-order">
        <modify-order :goodsData="goodsData" v-on:modifyOrderEnd = "modifyOrderEnd"></modify-order>
      </div>
      {{ count }}
      <cart-count></cart-count>
    </bq-content>
  </bq-page>
</template>
<script>
import modifyCart from '@/components/modify/modify.cart'
import modifyOrder from '@/components/modify/modify.order'
// type为 goodsList cart goodsDetail 三种类型
// 分别是 商品列表页面 购物车页面 商品详情页
export default {
  data() {
    return {
      count: 0,
      goodsCount: 0,
      cartData: {
        'goodsId': 385,
        'orderUnit': 5,
        'price': 3.2,
        'sellerName': '倍全太原市大仓',
        'sellerId': 12,
        'stock': 60,
        'status': 0,
        'minDeliveryAmount': 300,
        'count': 0
      },
      // goodsData: {
      //   'orderDetailId': 50117,
      //   'goodsId': 7157,
      //   'goodsName': '蒙牛纯牛奶无菌砖1*20*250ml',
      //   'price': 55,
      //   'status': 1,
      //   'sku': '6923644270971',
      //   'unit': '',
      //   'spec': '',
      //   'receiveCount': 1,
      //   'canReturnCount': 23,
      //   'goodsImage': 'http://img.bqmart.cn/data/files/store/763cf2f958daf7181d908784623213d5.jpg'
      // },
      goodsData: {
        'goodsId': 385,
        'goodsName': '畅优植物乳酸菌芒果+西番莲',
        'goodsImage': 'http://img.bqmart.cn/data/files/store/c9e449fb5a6babc4e74023c1300c6bf1.jpg',
        'count': 7,
        'price': 7.5,
        'totalPrice': 52.5,
        'status': 1,
        'orderStatus': 3,
        'spec': '',
        'unit': '',
        'sku': '6923800535593',
        'sendCount': 7,
        'orderUnit': 1,
        'receiveCount': 0
      }
    }
  },
  methods: {
    modifyCartEnd (count) {
      console.log(count)
      this.count = count
    },
    modifyOrderEnd (count) {
      console.log(count)
      this.goodsCount = count
    }
  },
  components: {
    modifyCart,
    modifyOrder
  }
}
</script>
<style lang="scss" scoped>
  .modify {
    position: absolute;
    top: 20px;
  }
  .modify-order{
    .modify {
      top: 60px;
    }
  }
</style>
