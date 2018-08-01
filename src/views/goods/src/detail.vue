<template>
  <bq-page class="good-detail">
    <detail :sku="$route.params.sku"></detail>
  </bq-page>
</template>
<script>
import Detail from '@/components/detail/common.vue'
export default {
  components: {
    Detail
  }
}
</script>
