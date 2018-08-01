<template>
  <span class="badge" v-if="cartCount>0">
    {{ cartCount }}
  </span>
  <i v-else></i>
</template>
<script>
  export default {
    name: 'cart-count',
    computed: {
      cartCount() {
        return window.store.state.cart.cartCount
      }
    },
    mounted() {
      window.store.dispatch('getCartCount')
    }
  }
</script>
