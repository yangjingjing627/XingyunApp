<template>
  <bq-page class="mypwd-set">
    <bq-header title="支付密码管理"></bq-header>
    <bq-content>
      <bq-card>
        <bq-card-item padding no-margin :icon="true" :href="'/me/passwordset/getcode/1'">
          设置支付密码
        </bq-card-item>
      </bq-card>
    </bq-content>
  </bq-page>
</template>
<style lang="scss">
  .mypwd-set {
    .bq-content .scroller {
      padding-top: 10px;
    }
    .bq-card:after {
      border-left: none;
      border-right: none;
    }
  }
</style>
