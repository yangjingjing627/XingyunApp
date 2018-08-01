<template>
  <section class="bq-template-single-ad" @click="goLink(module.linkValue)">
    <img v-lazy="module.imgUrl || $$loadingImgSrc">
  </section>
</template>
<script>
import ModuleMixin from './module.mixin'
export default {
  mixins: [ ModuleMixin ],
  props: {
    module: {
      type: Object
    }
  }
}
</script>
