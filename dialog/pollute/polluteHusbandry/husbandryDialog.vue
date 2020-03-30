<template>
  <div class="zt-popbox-wrapper" v-if="visible">
    <!-- 遮照层 -->
    <div class="modal"></div>
    <div class="popbox-wrapper _lc popbox-pollute-wrapper" v-if="selectDailog =='survey'">
      <div class="popbox popbox-size-biger">
        <!-- 头部 -->
        <header class="popbox-header">
          <h3>{{itemData.name}}</h3>
          <a href="javascript:void(0);" class="iconfont" @click.stop.prevent="close">&#xe601;</a>
        </header>
        <husbandry-survey :itemData="itemData" @contentClick="handelSurveyClick"></husbandry-survey>
      </div>
    </div>

    <div class="popbox-wrapper _lc popbox-pollute-detail-wrapper" v-if="selectDailog =='info'">
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
            <left-nav ref="leftNav" @change="handelNavChange" :menuList='menuList'
                      :selectNavCode="selectNavCode"></left-nav>
            <!-- 右侧内容区域-基本信息 -->
            <husbandry-info :itemData="itemData" v-if="selectNavCode=='B02.01'"></husbandry-info>
            <!-- 右侧内容区域-环评审批 -->
            <env-approval :itemData="itemData" v-if="selectNavCode=='B04.01'"></env-approval>
            <!-- 右侧内容区域-环境统计 -->
            <env-statistics ref="env" v-if="selectNavCode=='B05.01'"></env-statistics>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/jsx">
  import mapPollutePublicHttp from '@/https/map/mapPollutePublicHttp'
  import {objectAssign} from '@/utils/util'
  import {getDictListByKey} from '@/components/_public/zt/dictionary/index'
  import husbandrySurvey from './husbandrySurvey'
  import leftNav from '../pollutePublic/leftNav'
  import husbandryInfo from './husbandryInfo'
  import envApproval from '../pollutePublic/envApproval'
  import envStatistics from '../pollutePublic/envStatistics'
  export default {
    data() {
      return {
        visible: false,
        selectDailog: 'survey',
        menuList: [],
        selectNavCode: '',
      }
    },
    components: {
      husbandrySurvey,
      leftNav,
      husbandryInfo,
      envApproval,
      envStatistics,
    },
    created() {
    },
    mounted() {
      this.$nextTick(() => {
        this.getData();
        this.getMenuTree();
      })
    },
    methods: {
      getData() {
        mapPollutePublicHttp.getSourceInfo(this.itemData.id).then((result) => {
          objectAssign(this.itemData, result.data);
        }).catch((error) => {
        })
      },
      getMenuTree(){
        mapPollutePublicHttp.getMenuTree(this.itemData.id).then((result) => {
          this.menuList = result.data;
        }).catch((error) => {
        })
      },
      handelSurveyClick(navCode){
        this.selectDailog = 'info';
        if (navCode) {
          this.selectNavCode = navCode;
        } else {
          this.selectNavCode = 'B02.01';
        }
      },
      handelNavChange(node){
        if (node.code == 'B01') {
          this.selectDailog = 'survey'
        } else if (node.parentCode == 'B05.01') {
          let that = this;
          that.envYear = node.desc;
          that.selectNavCode = node.parentCode;
          that.$nextTick(() => {
            that.$refs.env.init(that.itemData, node.desc)
          })
        } else {
          this.selectNavCode = node.code;
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

