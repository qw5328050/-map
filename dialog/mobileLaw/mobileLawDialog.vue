<template>
  <div class="zt-popbox-wrapper" v-if="visible">
    <!-- 遮照层 -->
    <div class="modal"></div>
    <div class="popbox-wrapper _lc popbox-pollute-detail-wrapper">
      <div class="popbox popbox-size-larger" style="width:1130px;">
        <!-- 头部 -->
        <header class="popbox-header">
          <h3>{{itemData.name}}监察执法详情</h3>
          <a href="javascript:void(0);" class="iconfont" @click.stop.prevent="close">&#xe601;</a>
        </header>
        <!-- body -->
        <div class="popbox-body">
          <div class="popbox-pollute-detail cf" style="height: 410px;overflow: auto">
            <div class="table-list mb_15">
              <table class="table small-padding table-complex table-bordered light-blue-th">
                <thead>
                  <tr>
                    <th>检查时间</th>
                    <th>检查人</th>
                    <th>是否发现涉嫌环境违法行为</th>
                  </tr>
                </thead>
                <tbody>
                   <tr v-if="loading&&dataList&&dataList.length==0"><td class="al_center" colspan="3">{{constants.no_data_text}}</td></tr>
                  <tr v-for="item in dataList" :class="{'current-row':curRowId == item.id}"  @click="handleTrClick(item)">
                    <td>{{item.time | dateConvert('YYYY-MM-DD')}}</td>
                    <td>{{item.person}}</td>
                    <td>{{item.unlawfulType |dictionaryConvert(constants.unlawfal_type)}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="table-list mb_20">
              <h2 class="table-caption">现场监察笔录（一般工业污染源）</h2>
              <table class="table-info light-blue-th table-baseInfo">
                <tr>
                  <th style="width: 18%;">是否双随机任务</th>
                  <td style="width: 32%;">否</td>
                  <th style="width: 18%;">任务类型</th>
                  <td style="width: 32%;">{{dataInfo.type | dictionaryConvert(constants.enforcement_type)}}</td>
                </tr>
                <tr>
                  <th>被检查单位名称</th>
                  <td>{{dataInfo.sopName}}</td>
                  <th>污染源地址</th>
                  <td>{{dataInfo.sopAddress}}</td>
                </tr>
                <tr>
                  <th>经度</th>
                  <td>{{dataInfo.sopLng}}</td>
                  <th>纬度</th>
                  <td>{{dataInfo.sopLat}}</td>
                </tr>
                <tr>
                  <th>法定代表人</th>
                  <td></td>
                  <th>法定代表人联系电话</th>
                  <td></td>
                </tr>
                <tr>
                  <th>现场负责人</th>
                  <td>{{dataInfo.fieldManager}}</td>
                  <th>职务</th>
                  <td>{{dataInfo.duty}}</td>
                </tr>
                <tr>
                  <th>联系电话</th>
                  <td>{{dataInfo.phone}}</td>
                  <th>执法单位</th>
                  <td>{{dataInfo.unitName}}</td>
                </tr>
                <tr>
                  <th>执法人员</th>
                  <td>{{dataInfo.person}}</td>
                  <th>执法证号</th>
                  <td>{{dataInfo.number}}</td>
                </tr>
                <tr>
                  <th>是否发现涉嫌环境违法行为</th>
                  <td>{{dataInfo.hasUnlawful | yeaOrNoConvert}}</td>
                  <th>涉嫌环境违法行为类型</th>
                  <td>{{dataInfo.unlawfulType | dictionaryConvert(constants.unlawfal_type)}}</td>
                </tr>
              </table>
            </div>
            <div class="table-list mb_20">
              <h3 class="form-item-name">现场监察情况</h3>
              <table class="table-info light-blue-th table-baseInfo">
                <tr>
                  <th>生产状况</th>
                  <th>检查时企业生产状态</th>
                  <td colspan="3">{{dataInfo.status | dictionaryConvert(constants.production_state)}}</td>
                </tr>
                <tr>
                  <th style="width: 18%">环保相关制度执行情况</th>
                  <th style="width: 18%">有无未办理环评审批（备案）手续项目</th>
                  <td style="width: 23%">{{dataInfo.hasDontdealProject  | yeaOrNoConvert(['有','无'])}}</td>
                  <th style="width: 18%">是否申领排污许可证</th>
                  <td style="width: 23%">{{dataInfo.isApplyPermit  | yeaOrNoConvert}}</td>
                </tr>
                <tr>
                  <th rowspan="2">废水治理设施建设运行情况</th>
                  <th>处理工艺</th>
                  <td>{{dataInfo.craftWarter}}</td>
                  <th>废水治理设施_实际处理水量</th>
                  <td>{{dataInfo.treatedWarter}}</td>
                </tr>
                <tr>
                  <th>运行状况</th>
                  <td>{{dataInfo.runningStatusWarter}}</td>
                  <th>现场陪同人员</th>
                  <td>{{dataInfo.accompanyPerson}}</td>
                </tr>
                <tr>
                  <th rowspan="5">废气治理设施建设运行情况</th>
                  <th>处理工艺</th>
                  <td>{{dataInfo.craftAir}}</td>
                  <th>除尘</th>
                  <td>{{dataInfo.craftDedusting}}</td>
                </tr>
                <tr>
                  <th>脱硫</th>
                  <td>{{dataInfo.craftDesulfuration}}</td>
                  <th>脱硝</th>
                  <td>{{dataInfo.craftDenitration}}</td>
                </tr>
                <tr>
                  <th>废气处理设施运行情况</th>
                  <td>{{dataInfo.runningStatusAir}}</td>
                  <th>固体废物储存、处置 是否符合规定</th>
                  <td>{{dataInfo.ismeetSolid | yeaOrNoConvert}}</td>
                </tr>
                <tr>
                  <th>危废储存、处置 是否符合规定</th>
                  <td>{{dataInfo.ismeetHazardous | yeaOrNoConvert}}</td>
                  <th>产噪设备布局是否合理</th>
                  <td>{{dataInfo.isrationalLayoutNoise | yeaOrNoConvert}}</td>
                </tr>
                <tr>
                  <th>噪声控制与防治设备运行是否正常</th>
                  <td>{{dataInfo.isnormalNoiseTreat | yeaOrNoConvert}}</td>
                  <th>自动监控系统情况</th>
                  <td>{{dataInfo.monitorStatus}}</td>
                </tr>
                <tr>
                  <th rowspan="3">在线监测数据</th>
                  <th>项目1</th>
                  <td>{{dataInfo.projectName1}}</td>
                  <th>数据1</th>
                  <td>{{dataInfo.projectData1}}</td>
                </tr>
                <tr>
                  <th>项目2</th>
                  <td>{{dataInfo.projectName2}}</td>
                  <th>数据2</th>
                  <td>{{dataInfo.projectData2}}</td>
                </tr>
                <tr>
                  <th>项目3</th>
                  <td>{{dataInfo.projectName3}}</td>
                  <th>数据3</th>
                  <td>{{dataInfo.projectData3}}</td>
                </tr>
                <tr>
                  <th rowspan="5">人工采样情况</th>
                  <th>采样时间</th>
                  <td>{{dataInfo.samplingTime}}</td>
                  <th>采样地点</th>
                  <td>{{dataInfo.samplingAddress}}</td>
                </tr>
                <tr>
                  <th>污染物排放口是否规范</th>
                  <td>{{dataInfo.isnormOutlet | yeaOrNoConvert}}</td>
                  <th>污染物排放情况</th>
                  <td>{{dataInfo.pollutantDischargeCase}}</td>
                </tr>
                <tr>
                  <th>现场监察结论</th>
                  <td colspan="3">{{dataInfo.summing}}</td>

                </tr>
                <tr>
                  <th>违法行为处理建议</th>
                  <td colspan="3">{{dataInfo.suggest}}</td>
                </tr>
                <tr>
                  <th>检查日期</th>
                  <td colspan="3">{{dataInfo.time}}</td>
                </tr>
              </table>
            </div>
            <div class="table-list mb_20">
              <h3 class="form-item-name">参加人员情况</h3>
              <table class="table-info light-blue-th table-baseInfo">
                <tr>
                  <th style="width: 18%;">参加人员</th>
                  <td style="width: 32%;">{{dataInfo.participantName}}</td>
                  <th style="width: 18%;">工作单位</th>
                  <td style="width: 32%;">{{dataInfo.participantUnit}}</td>
                </tr>
              </table>
            </div>
            <div class="table-list mb_15">
              <h3 class="form-item-name">现场照片</h3>
              <div class="scene-photos">
                <div class="scene-item">
                  <div class="photo-wrapper">
                    <img src="static/images/temporary/scene-photos-01.png" alt="">
                  </div>
                </div>
                <div class="scene-item">
                  <div class="photo-wrapper">
                    <img src="static/images/temporary/scene-photos-02.png" alt="">
                  </div>
                </div>
                <div class="scene-item">
                  <div class="photo-wrapper">
                    <img src="static/images/temporary/scene-photos-01.png" alt="">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/jsx">
  import mapMobileLawHttp from '@/https/map/mapMobileLawHttp'
  import {objectAssign} from '@/utils/util'
  export default {
    data() {
      return {
        visible: false,
        loading:false,
        curRowId:'',
        dataList:[],
        dataInfo:{}
      }
    },
    components: {

    },
    created() {
      this.getData()
    },
    mounted() {

    },
    methods: {
      getData() {
        this.loading = false;
        mapMobileLawHttp.queryMobileLawRecordById(this.itemData.id).then((result) => {
          this.dataList = result.data;
          if(this.dataList&&this.dataList.length>0){
            let firstItem = this.dataList[0];
            this.curRowId = firstItem.id;
            this.getDetail(firstItem.id);
          }
          this.loading  = true;
        }).catch((error) => {
          this.loading  = true;
        })
      },
      getDetail(id){
        mapMobileLawHttp.queryMobileLawRecordDetail(id).then((result) => {
          this.dataInfo = result.data;
        }).catch((error) => {

        })
      },
      handleTrClick(item){
        this.curRowId = item.id;
        this.getDetail(item.id);
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
<style lang="less" type="text/less">
.popbox-wrapper .popbox-pollute-detail .table-list .current-row{
    background-color: #d9edf7;
  }
</style>

