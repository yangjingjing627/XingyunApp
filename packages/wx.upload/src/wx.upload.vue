<template>
  <section class="bq-wx-upload" v-if="!single">
    <ul>
      <template v-for="item in imgs"  >
        <li class="bq-wx-upload_active">
          <i @click="onDel(item.localId)" class="del">
          </i>
          <img :src="item.localId" >
        </li>
      </template>
      <li v-if="isAdd" @click="onUpload">
        <i class="icon-add"></i>
      </li>
    </ul>
  </section>
  <section class="bq-wx-upload-single" v-else @click="onUploadSingle">
     <i class="icon-add" v-if="!singleImgs.localId"></i>
     <img :src="singleImgs.localId" v-else >
  </section>
</template>
<script>
  import WxConfig from '@/config/wx.config'
  import WxService from '@/services/wx.service'
  export default {
    name: 'bq-wx-upload',
    data() {
      return {
        imgs: [],
        isAdd: true,
        singleImgs: {
          localId: ''
        }
      }
    },
    props: {
      single: {
        type: Boolean,
        default: false
      },
      count: {
        type: Number,
        default: 1
      },
      value: {}
    },
    created() {
      this.wxConfig = new WxConfig()
      this.WxService = new WxService()
    },
    methods: {
      onDel(localId) {
        let index = this.imgs.findIndex(value => value.localId === localId)
        this.imgs.splice(index, 1)
        if (this.imgs.length < 3) {
          this.isAdd = true
        }
      },
      async onUpload() {
        if (!this.$device.isWechat) {
          this.$messagebox.alert('请在微信下打开！')
          return
        }
        let res = await this.wxConfig.chooseImage()
        let {localIds} = res
        let [localId] = localIds
        let uploadRes = await this.wxConfig.uploadImage(localId)
        if (uploadRes.serverId) {
          this.imgs.push({...uploadRes, localId: localId})
        }
        if (this.imgs.length >= this.count) {
          this.isAdd = false
        }
        this.getUrl(this.imgs.map(item => item.serverId).toString())
      },
      async onUploadSingle() {
        if (!this.$device.isWechat) {
          this.$messagebox.alert('请在微信下打开！')
          return
        }
        let res = await this.wxConfig.chooseImage()
        let {localIds} = res
        let [localId] = localIds
        let uploadRes = await this.wxConfig.uploadImage(localId)
        if (uploadRes.serverId) {
          this.singleImgs = {...uploadRes}
        }
        this.getUrl(this.singleImgs.serverId, uploadRes, localId)
      },
      async getUrl(serverIds, uploadRes, localId) {
        let res = await this.WxService.getTmpMediaUrl({mediaIds: serverIds})
        if (this.singleImgs.serverId && res) {
          this.singleImgs = {...uploadRes, localId: localId}
        }
        this.$emit('input', res)
        this.$emit('on-success', res)
      }
    }
  }
</script>
<style lang="scss" >
  @import 'scss/variables.scss';
  @import 'scss/mixin.scss';
  $iconImgUrl: '../../../src/assets/img';
  .bq-wx-upload {
    margin-top: 20px;
    padding: 0 15px;
    width: 100%;
    height: 60px;
    ul {
      width: 100%;
      height: 60px;
      display: flex;
      align-items: center;
      li {
        width: 60px;
        height: 60px;
        line-height: 60px;
        margin-right: 20px;
        z-index: 2;
        border:0.5px dashed rgba(151,151,151,0.5);
        border-radius: 8px;
        text-align: center;
        i.icon-add {
          @include baseIcon('/components/upload/add.png', 32px, 32px);
        }
        &.bq-wx-upload_active {
          border:0.5px solid rgba(151,151,151,0.5);
          position: relative;
          i.del {
            position: absolute;
            right: -28px;
            top: -28px;
            z-index: 3;
            @include baseIcon('/components/upload/group.png', 20px, 20px);
          }
          img {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            border-radius: 8px;
            width: 55px;
            height: 55px;
          }
        }
      }
    }
  }

  .bq-wx-upload-single {
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
  }

</style>
