import Vue from 'vue'
import combinVue from './combin.modal.vue'
const CombinVueConstructor = Vue.extend(combinVue)
let instance = ''

let Combin = function(options = {}) {
  instance = new CombinVueConstructor({
    data: options
  })
  instance.close = function() {
    Combin.close()
  }
  instance.vm = instance.$mount()
  if (!instance.value || instance.closeTimer) {
    document.body.appendChild(instance.vm.$el)
    Vue.nextTick(() => {
      instance.currentVal = true
    })
  }
  instance.dom = instance.vm.$el
  return instance
}

Combin.close = function() {
  instance.destroyElementCombin()
}

export default Combin
