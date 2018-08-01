import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import loading from './modules/loading'
import createLogger from 'vuex/dist/logger'
import VuexLocalPlugin from 'plugins/vuex/vuex.local'
import cart from './modules/cart'
import goods from './modules/goods'
import returnorder from './modules/order.return'
import ordersearch from './modules/order.search'
import confirmorder from './modules/order.sure'
import usergifts from './modules/user.gifts'
import combin from './modules/combin'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

let localConfig = VuexLocalPlugin({
  paths: ['order'],
  // 根据店铺独有
  isStore: ['order'],
  mutationsReg: /_ORDERS_|^ORDERS_|_ORDERS$|_DEVICE/
})

const plugins = debug ? [createLogger(), localConfig] : [localConfig]

export default new Vuex.Store({
  actions,
  getters,
  modules: {
    loading,
    cart,
    goods,
    returnorder,
    ordersearch,
    confirmorder,
    usergifts,
    combin
  },
  strict: debug,
  plugins: plugins
})
