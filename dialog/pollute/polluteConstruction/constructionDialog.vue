<template>
  <div v-if="visible">
    <!-- 遮照层 -->
    <div class="modal"></div>
    <div class="popbox-wrapper _lc popbox-pollute-detail-wrapper">
      <div class="popbox popbox-size-biger">
        <!-- 头部 -->
        <header class="popbox-header">
          <h3>{{itemData.name}}</h3>
          <a href="javascript:void(0);" class="iconfont" @click.stop.prevent="close">&#xe601;</a>
        </header>
        <!-- body -->
        <div class="popbox-body">
          <div class="popbox-pollute-detail cf" style="height: 410px;overflow: auto">
             <!-- 侧边栏目导航 -->
            <left-nav
              v-if="menuList && menuList.length > 0"
              ref="leftNav"
              @change="handelNavChange"
              :menuList="menuList"
              :selectNavDesc="selectNavDesc"
            ></left-nav>
            <construction-info :itemData="itemData"></construction-info>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/jsx">
  import mapPollutePublicHttp from '@/https/map/mapPollutePublicHttp'
  import {objectAssign} from '@/utils/util'
  import constructionInfo from './constructionInfo'
  import leftNav from "../pollutePublic/leftNav";
  export default {
    data() {
      return {
        visible: false,
        menuList: [],
        selectNavDesc: ''
      }
    },
    components: {
      constructionInfo,
      leftNav,
    },
    created() {
      this.getData();
    },
    mounted() {
    this.selectNavDesc = "qiyexinxi"
    },
    methods: {
      getData() {
        mapPollutePublicHttp.getSourceInfo(this.itemData.id).then((result) => {
          objectAssign(this.itemData, result.data);
        }).then((result) => {
          this.getMenuTree();
        }).catch((error) => {
        })
      },
      getMenuTree() {
        mapPollutePublicHttp
          .getMenuTree(this.itemData.id)
          .then(result => {
            console.log('result.data:', result.data)
            this.menuList = result.data
            this.menuList[0].active = true
          })
          .catch(error => {
          });
      },
      handelNavChange(node) {
        console.log('node:', node)
        if (node.code == "jibenxinxi") {
          this.selectNavDesc = "qiyexinxi"
        } else if (node.desc == "huanjingtongji") {
          let that = this;
          // that.envYear = node.desc;
          that.selectNavDesc = node.desc;
          // 环境统计日期
          // var dateList = []
          // node.childList.sort(this.compare('desc'))
          // node.childList.forEach(function(item){
          //   dateList.push(parseInt(item.desc))
          // })
          console.log('node.childList:', this.itemData.id)
          that.$nextTick(() => {
            that.$refs.env.init(this.itemData.id);
          });
        } else {
          this.selectNavDesc = node.desc;
        }
      },
      show() {
        document.querySelector('body').appendChild(this.$mount().$el);
        this.visible = true;
      },
      close() {
        this.visible = false;
      }
    },
  }
</script>

