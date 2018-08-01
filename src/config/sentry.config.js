/**
 * 前端日志收集
 */

import Vue from 'vue'
import Raven from 'raven-js'
import RavenVue from 'raven-js/plugins/vue'

// https://docs.sentry.io/clients/javascript/config/
// 开发环境 使用saar-dev  线上坏境使用 saar
const config = bq.isProduction
? 'http://018368d49bc045ff9e9887b28fc54efc@zentao.bqmart.cn:8088/8'
: 'http://3a066a01ddb84909b819fde47dfc2119@zentao.bqmart.cn:8088/7'
Raven.config(config, {
  environment: bq.env,
  release: `'${bq.version}'`,
  tags: {version: bq.version}
})
    .addPlugin(RavenVue, Vue)
    .install()
