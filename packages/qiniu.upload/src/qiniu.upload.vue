<template>
<div class="uploader-bq">
  <el-upload class="avatar-uploader"
  :action="url"
  :on-error="errorFun"
  name="imgFile"
  accept="image/*"
  :show-file-list="false" :on-success="handleAvatarSuccess"
  :before-upload="beforeAvatarUpload">
    <img v-if="nowimageUrl" :src="nowimageUrl" class="avatar">
    <i v-if="!nowimageUrl" class="icon-add">{{ prompt }}</i>
  </el-upload>
</div>
</template>
<script>
import { API_HOST } from '@/config/global.config'

export default {
  name: 'bq-qiniu-upload',
  data() {
    return {
      nowimageUrl: '',
      loading: false,
      newUrl: ''
    }
  },
  computed: {
    url () {
      return API_HOST + 'util/qiniuyun/img/upload'
    }
  },
  mounted() {
    console.log(this.env)
    this.nowimageUrl = this.imageUrl
  },
  props: {
    prompt: String,
    imageUrl: String
  },
  watch: {
    'imageUrl' (val) {
      this.nowimageUrl = val
    }
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.loading = false
      if (res.error === 0) {
        this.nowimageUrl = file.url
        this.newUrl = res.url
      } else {
        if (res.message) {
          this.$toast(res.message)
        } else {
          this.$toast('上传失败')
        }
      }
    },
    errorFun () {
      this.$toast('上传失败')
      this.loading = false
    },
    beforeAvatarUpload(file) {
      // /\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(f)
      console.log(file.type)
      window.alert(file.type)
      const isType = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/bmp'
      if (!isType) {
        this.$toast('上传图片格式不正确')
        return false
      }
      const isLt3M = file.size / 1024 / 1024 < 3
      if (!isLt3M) {
        this.$toast('上传头像图片大小不能超过3M')
        return false
      }
      this.loading = true
    }
  }
}
</script>
<style lang="scss">
@import 'scss/variables.scss';
@import 'scss/mixin.scss';
$iconImgUrl: '../../../src/assets/img';

.uploader-bq,.avatar-uploader {
    width: 100%;
    height: 100%;
}
.avatar-uploader .el-upload {
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 100%;
    img{
      width: 100%;
      height: 100%;
    }
}
.el-upload__input {
    display: none;
}
.uploader-bq{
  width: 100%;
  height: 200px;
  text-align: center;
  margin: 0 auto;
  i.icon-add {
    width: 100%;
    height: 100%;
    background: url(#{$iconImgUrl}/components/upload/upload.png) no-repeat center;
    display: inline-block;
  }
  img {
    width: 100%;
    height: 100%;
  }
  .el-loading-mask.is-fullscreen {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
}
</style>
