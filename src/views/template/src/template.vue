<template>
  <div class="bq-template" :style="bodyStyle">
    <bq-header :title="template.topicName" ></bq-header>
    <div class="bq-template-banner">
      <img v-lazy="template.bannerImgUrl || $$loadingImgSrc">
    </div>
    <template v-for="item in template.modulesList">
      <tabs v-if="item.moduleType === 0" 
        :nav="navbar" 
        :key="item.moduleId"
        :module="item">
      </tabs>
      <single-ad v-if="item.moduleType === 1" 
        :key="item.moduleId" 
        :module="item.modulesDetailList[0]">
      </single-ad>
      <double-ad v-if="item.moduleType === 2" 
        :key="item.moduleId" 
        :list="item.modulesDetailList">
      </double-ad>
    </template>
    <yc-card-icon></yc-card-icon>
  </div> 
</template>
<script>
  import TemplateMixin from './template.mixin'
  import SingleAd from './components/single.ad.vue'
  import DoubleAd from './components/double.ad.vue'
  import Tabs from './components/tabs.vue'
  export default {
    mixins: [ TemplateMixin ],
    data() {
      return {
        img: ''
      }
    },
    components: {
      Tabs: Tabs,
      SingleAd: SingleAd,
      DoubleAd: DoubleAd
    }
  }
</script>
<style lang="scss">
  @import './template.scss';
</style>
