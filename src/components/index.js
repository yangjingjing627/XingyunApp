import Base from './base.vue'
import ItemImg from './item.img/item.img.vue'
import Item from './item.img/item.vue'
import OrderConfirmList from './order.list/order.confirm.list.vue'
import SearchBar from './search.bar/search.bar.vue'
import GoodContent from './goods/good.content.vue'
import GoodItem from './goods/good.item.vue'
import CartCount from './cart/cart.count.vue'
import ReturnInfo from './return.info/return.info.vue'
import Scan from './scan/scan.vue'
import City from './city/city.select.vue'
import MktLabel from './marketing/mkt.label'
import MktDiscount from './marketing/discount'
import ActivityIcon from './marketing/activity.icon'
import CombinText from './marketing/combin.text'
import ZhijiangText from './marketing/zhijiang.text'
import SubtitleText from './marketing/subtitle.text'
import CartIcon from './cart/cart.icon.vue'
import OriginPrice from './marketing/origin.price.vue'
import Ding from './ding'
import BtnDing from './modify/btn.ding.vue'
import CouponItem from './coupon/coupon.item.vue'
import DisabledCoupon from './coupon/disabled.coupon.vue'
import UserGifts from './coupon/user.gifts.vue'
import FareDetail from './fare/fare.detail.vue'
import WithdrawSafe from './withdraw/withdraw.safe.vue'
import ImgBig from './img.detail/img.big.vue'
// import LazyLoad from 'vue-lazyload-component'
const install = (Vue) => {
  if (install.installed) {
    return
  }
  Vue.component(Base.name, Base)
  Vue.component(ItemImg.name, ItemImg)
  Vue.component(Item.name, Item)
  Vue.component(OrderConfirmList.name, OrderConfirmList)
  Vue.component(SearchBar.name, SearchBar)
  Vue.component(CartCount.name, CartCount)
  Vue.component(GoodContent.name, GoodContent)
  Vue.component(GoodItem.name, GoodItem)
  Vue.component(ReturnInfo.name, ReturnInfo)
  Vue.component(Scan.name, Scan)
  Vue.component(City.name, City)
  Vue.component(MktLabel.name, MktLabel)
  Vue.component(MktDiscount.name, MktDiscount)
  Vue.component(ActivityIcon.name, ActivityIcon)
  Vue.component(CombinText.name, CombinText)
  Vue.component(ZhijiangText.name, ZhijiangText)
  Vue.component(SubtitleText.name, SubtitleText)
  Vue.component(OriginPrice.name, OriginPrice)
  Vue.component(CartIcon.name, CartIcon)
  Vue.component(CouponItem.name, CouponItem)
  Vue.component(DisabledCoupon.name, DisabledCoupon)
  Vue.component(UserGifts.name, UserGifts)
  Vue.component(FareDetail.name, FareDetail)
  Vue.component('ycDing', BtnDing)
  Vue.component(WithdrawSafe.name, WithdrawSafe)
  Vue.component(ImgBig.name, ImgBig)

  Vue.use(Ding)
  // Vue.prototype.$eventHub = Vue.prototype.$eventHub || new Vue()
  const EventBus = new Vue()
  Object.defineProperties(Vue.prototype, {
    $bus: {
      get() {
        return EventBus
      }
    }
  })

  // Vue.use(LazyLoad)
  Vue.$$loadingImgSrc = Vue.prototype.$$loadingImgSrc = 'http://static.js.bqmart.cn/static/img/l.gif'

}
export default {
  install
}
