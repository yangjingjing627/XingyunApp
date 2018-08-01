<template>
  <section class="bq-template-double-ad">
    <div 
      v-for="item in list" 
      :key="item.moduleDetailId"
      @click="goLink(item.linkValue)"
      :class="[item.position === 1 ? 'bq-template-double-ad__left' : 'bq-template-double-ad__right']" >
        <img v-lazy="item.imgUrl || $$loadingImgSrc">
    </div>
  </section>
</template>
<script>
import ModuleMixin from './module.mixin'
export default {
  mixins: [ ModuleMixin ],
  props: {
    list: {
      type: Array,
      default: () => []
    }
  }
}
</script>
