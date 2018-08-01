import Vue from 'vue'
import DetailVue from './detail.modal.vue'
const DetailVueConstructor = Vue.extend(DetailVue)
let instance
let instances = []
let seed = 1

let Detail = function(options = {}) {
  // 如果当前缓存内容超过 5个 则先移除缓存内容 在操作
  // if (instances.length > 5) {
  //   for (let i = 0, len = instances.length; i < len; i++) {
  //     let item = instances[i]
  //     if (item) {
  //       item.destroyElement()
  //     }
  //   }
  //   instances = []
  // }
  let id = 'bq__detail_' + seed++
  let skuId = 'bq__detail_s' + options.sku
  let userOnClose = options.onClose
  // 如果已经打开过 则使用老的内容
  // let oldInstance = instances.find(item => item.skuId === skuId)
  instance = new DetailVueConstructor({
    data: options
  })
  // if (oldInstance) {
  //   Vue.nextTick(() => {
  //     oldInstance.currentVal = true
  //   })
  //   return
  // }
  instance.close = function() {
    Detail.close(id, userOnClose)
  }
  instance.id = id
  instance.vm = instance.$mount()
  instance.skuId = skuId
  if (!instance.value || instance.closeTimer) {
    document.body.appendChild(instance.vm.$el)
    Vue.nextTick(() => {
      instance.currentVal = true
    })
  }
  instance.dom = instance.vm.$el
  instances.push(instance)
  return instance
}

Detail.close = function(id, userOnClose) {
  for (let i = 0, len = instances.length; i < len; i++) {
    let instance = instances[i]
    if (id === instance.id) {
      if (Vue.bqUtils.isFunction(userOnClose)) {
        userOnClose(instance)
      }
      instance.destroyElement()
      instances.splice(i, 1)
      break
    }
  }
}

Detail.closeAll = function() {
  for (let i = 0, len = instances.length; i < len; i++) {
    let item = instances[i]
    item.destroyElement()
  }
  instances = []
}

export default Detail
