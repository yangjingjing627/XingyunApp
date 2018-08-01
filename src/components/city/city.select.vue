<template>
 <bq-popup
    class="bq-page-modal bq-city-select"
    v-model="currentVal"
    position="right"
    :modal="false">
    <bq-header title="城市选择">
    </bq-header>
    <ul class="bq-city-select__header">
      <li v-for="item in selectTab" :key="'cityHeader' + item.id"
        @click="onSelect(item.id)"
        :class="[selected.pid === item.id ? 'active' : '']">
        {{ item.text }}
      </li>
    </ul>
    <bq-content>
      <bq-tab-content v-model="selected.pid" class="bq-city-select__content" >
        <bq-tab-content-item :id="tab.id" v-for="tab in selectTab" :key="'cityContent' + tab.id">
          <bq-card>
            <bq-card-item v-for="item in tab.list"
            :class="[item.id === tab.selectedId ? 'selected' : '']"
             @click.native ="onSelectItem(item, tab.id)"
             :key="'cityItem' + item.id" >
              {{ item.name }}
            </bq-card-item>
          </bq-card>
        </bq-tab-content-item>
      </bq-tab-content>
    </bq-content>
  </bq-popup>
</template>
<script>
import {Popup} from 'mint-ui'
import HomeService from '@/services/home.service'
export default {
  name: 'bq-select-city',
  data() {
    return {
      currentVal: this.value || false,
      selected: {
        pid: 0
      },
      selectTab: [
        {id: 0, selectedId: -1, text: '请选择', list: []},
        {id: 1, selectedId: -1, text: '', list: []},
        {id: 2, selectedId: -1, text: '', list: []},
        {id: 3, selectedId: -1, text: '', list: []}
      ]
    }
  },
  props: {
    value: {}
  },
  created() {
    this.HomeService = new HomeService()
    this.getCity()
  },
  mounted() {
    // 如果是连接  则直接弹出当前地址选择
    let hash = window.location.hash
    if (hash && hash === '#selectCity') {
      this.currentVal = true
    }
    window.addEventListener('hashchange', this.onHashchange.bind(this))
  },
  beforeDestroy() {
    window.removeEventListener('hashchange', this.onHashchange.bind(this))
  },
  watch: {
    value(val) {
      this.currentVal = val
    },
    currentVal(val) {
      this.$emit('input', val)
    }
  },
  methods: {
    onHashchange(e) {
      let {hash} = this.$bqUtils.parseUrl(e.oldURL)
      if (hash && hash === 'selectCity') {
        this.currentVal = false
        this.$emit('onClose', this.selectTab)
      }
    },
    onSelect(val) {
      this.selected.pid = val
      this.selectTab[val].text = '请选择'
      this.selectTab.forEach(item => {
        if (item.id > val) {
          item.selectedId = -1
          item.text = ''
          item.list = []
        }
      })
    },
    onSelectItem(item, pid) {
      let currentTab = this.selectTab[pid]
      currentTab.text = item.name
      currentTab.selectedId = item.id
      // next 下个tab
      if (!item.flag) {
        this.$router.go(-1)
        return
      }
      // 下个选择
      let nextTabPid = pid + 1
      let nextTab = this.selectTab[nextTabPid]
      nextTab.text = '请选择'
      this.getCity(currentTab.selectedId, nextTabPid)
      this.selected.pid = nextTabPid
    },
    async getCity(id = 1, currentList = 0) {
      let provinId = this.selectTab[0].selectedId
      let params = {regionId: id}
      if (provinId !== -1) {
        params.provinceId = provinId
      }
      let list = await this.HomeService.getCityInfo(params)
      this.selectTab[currentList].list = list
    }
  },
  components: {
    bqPopup: Popup
  }
}
</script>
<style lang="scss">
  @import 'scss/variables.scss';
  @import 'scss/mixin.scss';
  .bq-city-select {
    .bq-header {
      .mint-header {
        color: #333;
        font-size: 14px;
      }
    }
    .bq-content {
      background-color: #fff;
      top: 88px;
    }
    &__header {
      height: 44px;
      line-height: 44px;
      width: 100%;
      display: flex;
      list-style: none;
      overflow: hidden;
      position: absolute;
      left: 0;
      top: 44px;
      font-size: 15px;
      background-color: #fff;
      li {
        text-align: center;
        flex: 1;
        &.active {
          color: $danger;
          position: relative;
          &:after {
            content: '';
            width: 60%;
            height: 1px;
            border-bottom: 2px solid $danger;
            position: absolute;
            bottom: 1px;
            left: 50%;
            margin-left: -30%;
          }
        }
      }
    }

    &__content {
      .bq-card-item {
        margin: 0;
        padding: 14px 15px;
        &.selected {
          .bq-card-item__info {
            color: $danger;
          }
        }
        &:after {
          background: #e3e5e9;
        }
        &__info {
          text-align: left;
          color: #232326;
        }
      }
    }
  }
</style>
