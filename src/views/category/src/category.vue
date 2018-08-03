<template>
  <div>
    <!-- <bq-header title="市场" :isLeftIcon="true">
    </bq-header> -->
    <div class="content">
      是否获得丰富的
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @import 'scss/variables.scss';
  @import 'scss/mixin.scss';
  $iconImgUrl:'../../../assets/img';
  .cart{
    width: 20%;
    height: 20px;
    position: relative;
    .badge{
      color: #fff;
      font-size: 11px;
      position: absolute;
      top: -5px;
      left: 50%;
    }
  }
  .content{
    width: 100%;
    position: absolute;
    top: 43px;
    padding-top: 45px;
    right: 0;
    left: 0;
    bottom: 44px;
    .search-bar{
      position: absolute;
      top: 0;
    }
  }
  .category{
    width: 100%;
    height: 100%;
    position: relative;
  }

</style>
