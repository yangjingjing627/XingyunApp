# git 规范

## 命名

> {action}/{shortName}

* action
  * feature
  * release
  * hotfix

 列子:

  * feature/home
  * release/renhong
  * hotfix/223

  ## git提交规范

  > {action} [{module}] {description}

  * {action}
    * __+__ add
    * __*__ update or bugfix
    * __-__ remove
  * [module]
    * component 组件
    * doc 文档
    * test 测试
    * page 页面功能
    * css 样式
    * build webpack 配置
    * assets 资源
    * all 一堆内容
    * other 一堆内容

  * {description}
    * 简洁的描述

  列子: 

   * __+__ [page] 找回密码
   * __*__ [page] axios 增加msg 拦截
   * __*__ [css] update app tab z-index 2000
   * __-__ [assets] remove 小图标
   * __*__ [page] fix #2055


   > #2055 代表禅道的bug id 
