import QiniuUpload from './src/qiniu.upload.vue'

QiniuUpload.install = function(Vue) {
  Vue.component(QiniuUpload.name, WxUpload)
}

export default QiniuUpload
