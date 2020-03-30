<template>
  <div v-if="$parent.visible">
    <header class="header-info">
      <a href="javascript:void(0);" v-if="closeBtn" @click.stop.prevent="handleClose" class="iconfont point-info-close">&#xe601;</a>
      <h3 class="name">{{name}}</h3>
      <p>
        <span class="fr">{{info.county}}</span>
      </p>
    </header>
    <!-- 基础信息 -->
    <div class="base-info-list">
      <ul>
        <li class="text-ellipsis width380"><em class="iconfont address">&#xe606;</em>{{info.address}}</li>
        <li class="contact-info">
          <span class="contact-item" title="环保联系人"><em class="iconfont user">&#xe66b;</em>{{info.entMan}}</span>
          <span class="contact-item" title="联系电话"><em class="iconfont tel">&#xe66d;</em>{{info.mobilPhone}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script type="text/jsx">
  import mapDialogHttp from '@/https/map/mapDialogHttp'
  import {objectAssign} from '@/utils/util'
  export default{
    props: {
      id: String,
      name: String,
      closeBtn: {
        type: Boolean,
        default: false
      }
    },
    data(){
      return {
        info: {
          address: '',
          county: '',
          entMan: '',
          mobilPhone: ''
        }
      }
    },
    created(){
      this.info.address = '';
      this.info.county = '';
      this.info.entMan = '';
      this.info.mobilPhone = '';
    },
    mounted(){
      this.getBaseInfo();
    },
    methods: {
      getBaseInfo(){
        mapDialogHttp.getSourceInfo({
          id: this.id
        }).then(result => {
          objectAssign(this.info, result.data);
        })
      },
      handleClose(){
        this.$parent.close();
      },
    },
  }
</script>

