import Demo from './src/demo.vue'
const NativeDemo = resolve => require(['./src/native.vue'], resolve)
const ButtonDemo = resolve => require(['./src/button.vue'], resolve)
const CardDemo = resolve => require(['./src/card.vue'], resolve)
const TabsdDemo = resolve => require(['./src/tabs.vue'], resolve)
const RadiosDemo = resolve => require(['./src/radios.vue'], resolve)
const CheckboxDemo = resolve => require(['./src/checkbox.vue'], resolve)
const CartAdd = resolve => require(['./src/modify.vue'], resolve)
const EmptyDemo = resolve => require(['./src/empty.vue'], resolve)
const CollapseDemo = resolve => require(['./src/collapse.vue'], resolve)
export default function(router) {
  router.push({
    path: '/demo',
    name: 'demo',
    component: Demo,
    meta: {
      requiresAuth: false
    }
  })

  router.push({
    path: '/native',
    component: NativeDemo
  })

  router.push({
    path: '/button',
    component: ButtonDemo
  })

  router.push({
    path: '/card',
    component: CardDemo
  })

  router.push({
    path: '/tabs',
    component: TabsdDemo
  })

  router.push({
    path: '/radios',
    component: RadiosDemo
  })

  router.push({
    path: '/checkbox',
    component: CheckboxDemo
  })

  router.push({
    path: '/empty',
    component: EmptyDemo
  })

  router.push({
    path: '/cartA',
    component: CartAdd
  })

  router.push({
    path: '/collapse',
    component: CollapseDemo
  })
}
