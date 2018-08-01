import Lazyload from './src/lazyload.vue'

Lazyload.install = function(Vue) {
  Vue.component(Lazyload.name, Lazyload)
}

export default Lazyload
