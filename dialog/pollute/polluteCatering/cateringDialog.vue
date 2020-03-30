<template>
  <div class="zt-popbox-wrapper" v-if="visible">
    <!-- 遮照层 -->
    <div class="modal"></div>
    <div class="popbox-wrapper _lc popbox-pollute-detail-wrapper">
      <div class="popbox popbox-size-larger" style="width:1130px;">
        <!-- 头部 -->
        <header class="popbox-header">
          <h3>{{itemData.name}}</h3>
          <a href="javascript:void(0);" class="iconfont" @click.stop.prevent="close">&#xe601;</a>
        </header>
        <!-- body -->
        <div class="popbox-body">
          <div class="popbox-pollute-detail cf" style="height: 410px;overflow: auto">
            <catering-info :itemData="itemData"></catering-info>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/jsx">
  import mapPollutePublicHttp from '@/https/map/mapPollutePublicHttp'
  import {objectAssign} from '@/utils/util'
  import cateringInfo from './cateringInfo'
  export default {
    data() {
      return {
        visible: false,
      }
    },
    components: {
      cateringInfo,
    },
    created() {
      this.getData();
    },
    mounted() {

    },
    methods: {
      getData() {
        mapPollutePublicHttp.getSourceInfo(this.itemData.id).then((result) => {
          objectAssign(this.itemData, result.data);
        }).then((result) => {
          this.getMenuTree(this.itemData.id);
        }).catch((error) => {
        })
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

