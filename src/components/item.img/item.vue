<template>
  <div class="item">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'item',
  data() {
    return {
      parent: 'ITEM'
    }
  },
  methods: {
    sayHello() {
      console.info('i am item.!!!!')
    }
  }
}
</script>
<style lang="scss">
  .item {
    width: 100%;
    min-height: 100px;
    background-color: green;
  }
</style>
