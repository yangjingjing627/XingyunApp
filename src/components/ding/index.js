import Ding from './src/ding'

const install = (Vue) => {
  Vue.$ding = Vue.prototype.$ding = Ding
}

export default {
  install,
  Ding
}
