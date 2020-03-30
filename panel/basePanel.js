export default{
  data () {
    return {
      visible: false,
      obj: null
    }
  },
  mounted () {
    this.$eventHub.$on(this.constants.event_name.close_map_panel, () => {
      this.close()
    })
  },
  methods: {
    show (obj) {
      this.visible = true
      if (obj) {
        this.obj = obj
      }
      this.init()
    },
    reshow () {
      this.visible = true
    },
    hide () {
      this.visible = false
    },
    close () {
      this.visible = false
      // this.$destory(true);
      // this.$el.parentNode.removeChild(this.$el)
    }
  }
}
