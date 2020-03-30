<template>
  <aside class="m-left-nav">
    <ul>
      <item-li v-for="(menu,index) in menuData" :key="index" :item-data="menu" @changeActive="handleClick"></item-li>
    </ul>
  </aside>
</template>
<script>
  import {deepCloneArray} from '@/utils/util'

  const sideMenu = {
    name: 'itemLi',
    template: `<li>
            <a href="javascript:void(0)" :class="{'cur':itemData.active}" style="padding-left: 0!important;" @click.stop.prevent="changeActive(itemData)">
                  <i class="text" :title="itemData.name">{{itemData.name}}</i>
                 <span  v-if="itemData.children&&itemData.children.length>0"  class="iconfont arrow" >&#xe6a2;</span>
            </a>
            <ul class="m-left-subnav" v-if="itemData.children&&itemData.children.length>0" >
                 <item-li v-for="(item,index) in itemData.children" :key="index" :item-data="item"  @changeActive="changeActive($event)"></item-li>
            </ul>
       </li>`,
    props: ['itemData'],
    data: function () {
      return {}
    },
    methods: {
      changeActive(d) {
        this.$emit('changeActive', d)
      }
    },
    mounted() {
    }
  }
  export default {
    data() {
      return {
        menuData: [],
        activeItem: {}
      }
    },
    components: {
      'item-li': sideMenu
    },
    props: {
      menuList: {
        type: Array,
        default: () => []
      },
      selectNavCode: {
        type: String,
        default: '6002'
      }
    },
    created() {
      if (this.menuList.length == 0) return
      this.resetActive(this.menuList)
      this.menuData = deepCloneArray(this.menuList)
    },
    mounted() {
      this.setSelectByCode(this.selectNavCode)
    },
    methods: {
      handleClick(d) {
        console.log('d:', this.menuData, d)
        console.log('d2222:', d.active || d.children.length > 0)
        if (d.active || d.children.length > 0) return
        this.resetActive(this.menuData)
        this.setParentActive(this.menuData, d)
        d.active = true
        this.$emit('change', d)
      },
      setSelectByCode(id) {
        this.setActive(this.menuData, id)
        if (this.activeItem.active) return
        this.resetActive(this.menuData)
        this.setParentActive(this.menuData, this.activeItem)
        this.activeItem.active = true
      },
      resetActive(tlist) {
        var _self = this
        tlist.forEach(function (v, i) {
          v.active = false
          if (v.children) {
            _self.resetActive(v.children)
          }
        });
      },
      setActive(tlist, code) {
        var _self = this
        tlist.forEach(function (v, i) {
          if (code == v.id) {
            _self.activeItem = v
          } else if (v.children) {
            _self.setActive(v.children, code)
          }
        })
      },
      setParentActive(tlist, d) {
        var _self = this
        for (let v of tlist) {
          if (d.pid == v.id) {
            v.active = true
            _self.setParentActive(_self.menuData, v)
            break
          } else {
            if (v.children) {
              _self.setParentActive(v.children, d)
            }
          }
        }
      },
    },
    watch: {
      menuList: {
        handler(newV, oldV) {
          this.resetActive(newV)
          this.menuData = deepCloneArray(newV)
          this.setSelectByCode(this.selectNavCode)
          console.log('this.menuData:', this.menuData)
          this.menuData[0].active = true
          this.menuData[0].children[0].active = true
        },
        deep: true
      }
    }
  }
</script>
