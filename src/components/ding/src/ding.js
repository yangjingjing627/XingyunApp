import Vue from 'vue'
import DingVue from './ding.vue'
const DingVueConstructor = Vue.extend(DingVue)
let instance
let currentMsg
let msgQueue = []

const defaultCallback = (action, inputVal) => {
  if (currentMsg) {
    if (currentMsg.resolve) {
      if (action === 'confirm') {
        currentMsg.resolve({ value: inputVal, action })
      } else if (action === 'cancel' && currentMsg.reject) {
        instance.inputVal = []
        currentMsg.reject(action)
      }
    }
  }
}

let Ding = function(options = {}, callback) {
  return new Promise((resolve, reject) => { // eslint-disable-line
    msgQueue.push({
      callback: callback,
      resolve: resolve,
      reject: reject
    })
    if (msgQueue.length > 0) {
      currentMsg = msgQueue.shift()
      // instance 不做缓存
      instance = instance || new DingVueConstructor()
      instance.vm = instance.$mount()
      // 初始化
      instance.callback = defaultCallback
      instance.sku = options.sku
      instance.sellerId = options.sellerId
      instance.type = options.type
      if (!instance.value || instance.closeTimer) {
        document.body.appendChild(instance.vm.$el)
        Vue.nextTick(() => {
          instance.currentVal = true
        })
      }
    }
  })
}

Ding.close = () => {
  Vue.nextTick(() => {
    if (instance) {
      instance.currentVal = false
    }
  })
}

export default Ding
