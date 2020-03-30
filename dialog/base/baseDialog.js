import store from "@/store";
export default{
  data(){
    return {
      visible: false,
      closeDestroy: true,
      showModal: false,
      showSecondary: false,
    }
  },
  watch: {
    isRelated (newValue, value) {
      this.showSecondary = !newValue
    }
  },
  computed: {
    documentClientHeight: {
      get () {
        let href = window.location.href;
        let height = 250;
        if (href.indexOf('/map') >= 0) {
          height = 190;
        } else if (document.querySelector('.return-btn-box')) {
          height = 290;
        }
        if (store.state.common.documentClientHeight) {
          return store.state.common.documentClientHeight - height;
        } else {
          return document.documentElement['clientHeight'] - height;
        }
      }
    },
    isRelated () {
      let flag = store.state.map.relatedAnalysis
      return flag
    }
  },
  methods: {
    destroyPop(){
      this.$destroy(true);
    },
    show(parentElement){
      if (parentElement) {
        parentElement.appendChild(this.$mount().$el);
      } else {
        let details = document.querySelectorAll('.result-detail')
        let lenOfDetails = details && details.length
        if (!this.showSecondary && lenOfDetails > 1) {
          details[1].childNodes.forEach((value, index, listObj) => {
            details[1].removeChild(value)
          })
          details[1].appendChild(this.$mount().$el)
        } else {
          details[0].childNodes.forEach((value, index, listObj) => {
            details[0].removeChild(value)
          })
          details[0].appendChild(this.$mount().$el)
        }
      }
      this.visible = true;
      this.initDom();
    },
    close(params){
      let closeAll = params && params.closeAll ? params.closeAll : 'false'
      // console.log('==closeAll==' + closeAll)
      if ('false' === closeAll) {
        let parentId = this.$el && this.$el.parentNode && this.$el.parentNode.id ? this.$el.parentNode.id : ''
        if (this.showSecondary && 'primary' === parentId) {
          return;
        }
        this.visible = false;
        this.$destroy(true);
      } else if ('true' === closeAll) {
        let details = document.querySelectorAll('.result-detail')
        details[0].childNodes.forEach((value, index, listObj) => {
          details[0].removeChild(value)
        });
      }
    },
    initDom(){

    },
  },
  beforeDestroy(){
    if (this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el);
    }
  }
}
