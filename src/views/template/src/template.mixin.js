import ShareMixin from '@/mixins/share.mixin'
import TopicService from '@/services/topic.service'
export default {
  mixins: [ ShareMixin ],
  data() {
    return {
      template: {}
    }
  },
  created() {
    this.TopicService = new TopicService()
    this.init()
  },
  mounted() {
    this.win = window
    this.body = document.body
    // hash 值变更
    this.win.addEventListener('hashchange', () => {
      this.$store.commit('UPDATE_LOADING', { isLoading: false })
    })
  },
  computed: {
    bodyStyle() {
      let {backgroundType, backgroundValue, backgroundShowType} = this.template
      let repeat = backgroundShowType === 0 ? 'no-repeat' : 'repeat'
      let style = {
        background: backgroundType === 1 ? `url(${backgroundValue}) ${repeat} center` : backgroundValue
      }
      return style
    },
    navbar() {
      let navAttr = [
        'navbarDefaultBackground',
        'navbarDefaultFontColor',
        'navbarFocusBackground',
        'navbarFocusFontColor',
        'navbarStatus',
        'navbarType']
      let navs = {}
      navAttr.forEach(key => {
        navs[key] = this.template[key]
      })
      return navs
    }
  },
  methods: {
    async init() {
      try {
        this.topicId = this.$route.params.topicId
        this.template = await this.TopicService.getByTopicId({topicId: this.topicId})
        this.wxShareInit({
          desc: this.template.wechatShareProfile || '云采货',
          title: this.template.wechatShareTitle,
          link: this.template.url || window.location.href,
          imgUrl: this.template.wechatSharePic
        })
        this.initScroll()
      } finally {
        this.$store.commit('UPDATE_LOADING', { isLoading: false })
      }
    },
    initScroll() {
      this.$nextTick(() => {
        this.$ycTemplateNavbar = $('#ycTemplateNavbar')
        this.scroll()
      })
    },
    scroll() {
      if (this.$ycTemplateNavbar.length <= 0) {
        return
      }
      this.win.addEventListener('scroll', this.$bqUtils.throttle(_e => {
        let offsetTop = this.$ycTemplateNavbar.parent('.yc-template-t').offset().top
        let scrollTop = this.body.scrollTop
        if (scrollTop > offsetTop && !this.$ycTemplateNavbar.hasClass('fixed')) {
          this.$ycTemplateNavbar.addClass('fixed')
          return
        }
        if (scrollTop < offsetTop && this.$ycTemplateNavbar.hasClass('fixed')) {
          this.$ycTemplateNavbar.removeClass('fixed')
        }
      }, 200))
    }
  }
}
