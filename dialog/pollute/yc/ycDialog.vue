<template>
  <div class="point-info-wrapper" v-if="visible && hidePlane">
    <a class="close-detail-btn" @click="justClosedPlane">
      <span class="iconfont" @click="justClosedPlane">&#xe601;</span>
    </a>
    <div class="point-info-detail">
      <!-- 头部信息 -->
      <header-info :detailData="detailData"></header-info>
      <div class="form-group ml_15" style="margin-top:5px;">
        <a>
          <span class="iconfont position-strong">&#xe65a;</span>
        </a>
        {{detailData.address}}
      </div>
      <!-- 分类信息 -->
      <zt-scrollbar class="ps" :style="{'max-height': documentClientHeight - 40 + 'px'}">
        <div class="classification-info">
          <div class="tab-wrapper">
            <span class="tab-item" :class="{'cur': tabIndex === 1}" @click="tabIndex1">实时监控</span>
            <!--<span class="tab-item" :class="{'cur': tabIndex === 2}" @click="tabIndex2">视频</span>-->
          </div>
          <div v-if="tabIndex === 1">
            <!-- 子类标签 -->
            <zt-rolling-label :labelList="labelList" @change="inClick"></zt-rolling-label>
            <div class="time-tips" style="margin-left:20px">
              <time>{{currentTime.substr(0, 16)}}时</time>
              <span class="label label-border-success" v-if="detailData.siteStatus = 1">正常</span>
              <span class="label label-border-danger" v-if="detailData.siteStatus != 1">异常</span>
            </div>
            <div class="tab-content">
              <div class="panel-table">
                <!-- 实时监控 -->
                <!-- 不合格车辆 -->
                <zt-table
                  ref="table"
                  class="zt-tr-pointer"
                  :data="unqualifiedList"
                  v-if="unqualified && !punish"
                  @click="showUnqualifiedDetail"
                >
                  <zt-column type="index" width="50" label="序号"></zt-column>
                  <zt-column prop="monitorTime"  width="160"  label="监测时间"></zt-column>
                  <zt-column prop="plateNumber"  width="100"  label="车牌号"></zt-column>
                  <zt-column prop="state" label="检测状态">
                    <template slot-scope="scope">
                      <span class="label label-border-primary" v-if="scope.row.state === 0">合格</span>
                      <span class="label label-border-danger" v-if="scope.row.state !== 0">不合格</span>
                    </template>
                  </zt-column>
                </zt-table>
                <!-- 处罚车辆 -->
                <zt-table
                  ref="table"
                  class="zt-tr-pointer"
                  :data="punishList"
                  v-if="punish && !unqualified"
                  @click="showPunishDetail"
                >
                  <zt-column type="index" style="width:1%" label="序号"></zt-column>
                  <zt-column prop="monitorTime" style="width:33%" label="监测时间"></zt-column>
                  <zt-column prop="plateNumber" style="width:33%" label="车牌号"></zt-column>
                  <zt-column prop="Num" style="width:33%" label="超标次数">
                    <template slot-scope="scope">
                      <span>{{scope.row.Num}}</span>
                    </template>
                  </zt-column>
                </zt-table>
              </div>
            </div>
          </div>
          <div v-if="tabIndex === 2">
            <!-- 视频 -->
            <div class="ml_10" style="height:300px">
              <h1>视频功能暂未开发！</h1>
            </div>
          </div>
        </div>
      </zt-scrollbar>
      <!-- 详情弹出框 -->
      <zt-dialog :title="title" :visible.sync="openUnqualifiedDetail" modal :innerHeight="600">
        <!-- 详情表格(不合格车辆) -->
        <div v-if="openUnqualifiedDetail">
          <div v-for="(item,index) in unqualifiedDetailList" :key="index">
            <!-- 表格上半部分 -->
            <div v-if="index == 0">
              <table class="table table-striped table-bordered">
                <tbody>
                  <tr>
                    <th class="td-gray" style="width: 15%;">车牌号</th>
                    <td style="width: 35%;">{{item.plateNumber}}</td>
                    <th class="td-gray" style="width: 15%;">车牌颜色</th>
                    <td style="width: 35%;">{{item.plateColor}}</td>
                  </tr>
                  <tr>
                    <th class="td-gray" style="width: 15%;">车主/单位</th>
                    <td style="width: 35%;">{{item.owner}}</td>
                    <th class="td-gray" style="width: 15%;">燃油类型</th>
                    <td style="width: 35%;">{{item.fuelType}}</td>
                  </tr>
                  <tr>
                    <th class="td-gray" style="width: 15%;">联系地址</th>
                    <td style="width: 35%;">{{item.ownerAddress}}</td>
                    <th class="td-gray" style="width: 15%;">联系电话</th>
                    <td style="width: 35%;">{{item.ownerMobile}}</td>
                  </tr>
                  <tr>
                    <th class="td-gray" style="width: 15%;">更新时间</th>
                    <td style="width: 35%;">{{item.updateTime}}</td>
                    <th class="td-gray" style="width: 15%;">处理状态</th>
                    <td style="width: 35%;"></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!-- 表格下半部分 -->
            <div style="height:40px;"></div>
            <table class="table table-striped table-bordered">
              <tbody>
                <tr>
                  <th class="td-gray" style="width: 15%;">点位编号</th>
                  <td style="width: 35%;">{{item.siteCode}}</td>
                  <th class="td-gray" style="width: 15%;">抓拍时间</th>
                  <td style="width: 35%;">{{item.monitorTime}}</td>
                </tr>
                <tr>
                  <th class="td-gray" style="width: 15%;">抓拍地点</th>
                  <td style="width: 35%;">{{item.location}}</td>
                  <th class="td-gray" style="width: 15%;">图像</th>
                  <td style="width: 35%;">
                    <img
                      style="width:100%"
                      :src="item.imgUrl || ''"
                      alt
                      @click="showImgs(item.imgUrl)"
                    />
                  </td>
                </tr>
                <tr>
                  <th class="td-gray" style="width: 15%;">CO结果</th>
                  <td style="width: 35%;">{{item.coResult}}</td>
                  <th class="td-gray" style="width: 15%;">HC结果</th>
                  <td style="width: 35%;">{{item.hcResult}}</td>
                </tr>
                <tr>
                  <th class="td-gray" style="width: 15%;">林格曼黑度</th>
                  <td style="width: 35%;">{{item.ringelmanEmittance}}</td>
                  <th class="td-gray" style="width: 15%;">NO结果</th>
                  <td style="width: 35%;">{{item.noResult}}</td>
                </tr>
                <tr>
                  <th class="td-gray" style="width: 15%;">不透光度</th>
                  <td style="width: 35%;">{{item.transparentResult}}</td>
                  <th class="td-gray" style="width: 15%;">超标污染物</th>
                  <td style="width: 35%;">
                    <template v-for="(result,index) in item.exceed">
                      {{result}}
                      <template v-if="index < (item.exceed.length - 1)">、</template>
                    </template>
                  </td>
                </tr>
                <tr>
                  <th class="td-gray" style="width: 15%;">监测结果</th>
                  <td style="width: 35%;">
                    <span v-if="item.telemeteringResult == 0">合格</span>
                    <span v-if="item.telemeteringResult == 1">不合格</span>
                  </td>
                </tr>
              </tbody>
            </table>
            <div style="height:40px;"></div>
          </div>
        </div>
        <imgs v-if="isimgs" @closeImgs="closeImgs" :imgLists="srcimageUrl"></imgs>
        <div slot="footer">
          <zt-button size="sm" type="primary" @click="checkOut">关闭</zt-button>
        </div>
      </zt-dialog>
      <!-- 详情弹出框 -->
      <zt-dialog :title="title" :visible.sync="openPunishDetail" modal :innerHeight="600">
        <!-- 详情表格(处罚车辆) -->
        <div v-if="openPunishDetail">
          <div v-for="(item,index) in detailList" :key="index">
            <!-- 表格上半部分 -->
            <div v-if="index == 0">
              <table class="table table-striped table-bordered">
                <tbody>
                  <tr>
                    <th class="td-gray" style="width: 15%;">车牌号</th>
                    <td style="width: 35%;">{{item.plateNumber}}</td>
                    <th class="td-gray" style="width: 15%;">车牌颜色</th>
                    <td style="width: 35%;">{{item.plateColor}}</td>
                  </tr>
                  <tr>
                    <th class="td-gray" style="width: 15%;">车主/单位</th>
                    <td style="width: 35%;">{{item.owner}}</td>
                    <th class="td-gray" style="width: 15%;">燃油类型</th>
                    <td style="width: 35%;">{{item.fuelType}}</td>
                  </tr>
                  <tr>
                    <th class="td-gray" style="width: 15%;">联系地址</th>
                    <td style="width: 35%;">{{item.ownerAddress}}</td>
                    <th class="td-gray" style="width: 15%;">联系电话</th>
                    <td style="width: 35%;">{{item.ownerMobile}}</td>
                  </tr>
                  <tr>
                    <th class="td-gray" style="width: 15%;">更新时间</th>
                    <td style="width: 35%;">{{item.updateTime}}</td>
                    <th class="td-gray" style="width: 15%;">处理状态</th>
                    <td style="width: 35%;">{{item.status}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!-- 表格下半部分 -->
            <div style="height:40px;"></div>
            <table class="table table-striped table-bordered">
              <tbody>
                <tr>
                  <th class="td-gray" style="width: 15%;">点位编号</th>
                  <td style="width: 35%;">{{item.siteCode}}</td>
                  <th class="td-gray" style="width: 15%;">抓拍时间</th>
                  <td style="width: 35%;">{{item.monitorTime}}</td>
                </tr>
                <tr>
                  <th class="td-gray" style="width: 15%;">抓拍地点</th>
                  <td style="width: 35%;">{{item.location}}</td>
                  <th class="td-gray" style="width: 15%;">图像</th>
                  <td style="width: 35%;">
                    <img
                      style="width:100%"
                      :src="item.imgUrl || ''"
                      alt
                      @click="showImgs(item.imgUrl)"
                    />
                  </td>
                </tr>
                <tr>
                  <th class="td-gray" style="width: 15%;">CO结果</th>
                  <td style="width: 35%;">{{item.coResult}}</td>
                  <th class="td-gray" style="width: 15%;">HC结果</th>
                  <td style="width: 35%;">{{item.hcResult}}</td>
                </tr>
                <tr>
                  <th class="td-gray" style="width: 15%;">林格曼黑度</th>
                  <td style="width: 35%;">{{item.ringelmanEmittance}}</td>
                  <th class="td-gray" style="width: 15%;">NO结果</th>
                  <td style="width: 35%;">{{item.noResult}}</td>
                </tr>
                <tr>
                  <th class="td-gray" style="width: 15%;">不透光度</th>
                  <td style="width: 35%;">{{item.transparentResult}}</td>
                  <th class="td-gray" style="width: 15%;">超标污染物</th>
                  <td style="width: 35%;">
                    <template v-for="(result,index) in item.exceed">
                      {{result}}
                      <template v-if="index < (item.exceed.length - 1)">、</template>
                    </template>
                  </td>
                </tr>
                <tr>
                  <th class="td-gray" style="width: 15%;">监测结果</th>
                  <td style="width: 35%;">
                    <span v-if="item.telemeteringResult == 0">合格</span>
                    <span v-if="item.telemeteringResult == 1">不合格</span>
                  </td>
                </tr>
              </tbody>
            </table>
            <div style="height:40px;"></div>
          </div>
        </div>
        <imgs v-if="isimgs" @closeImgs="closeImgs" :imgLists="srcimageUrl"></imgs>
        <div slot="footer">
          <zt-button size="sm" type="primary" @click="checkOut">关闭</zt-button>
        </div>
      </zt-dialog>
    </div>
  </div>
</template>
<script>
import ycHttp from "@/https/monitor/ycHttp";
import baseDialog from "@/map/dialog/base/baseDialog";
import baseInfoList from "@/map/dialog/_public/baseInfoList.vue";
import mapUtil from "@/map/js/util/mapUtil";
import headerInfo from "@/map/dialog/_public/headerInfo.vue";
import mapHttp from "@/https/map/mapHttp";
import moment from "moment";
import imgs from "@/components/_public/imgs";

export default {
  name: "ycDialog",
  mixins: [baseDialog],
  components: {
    headerInfo,
    baseInfoList,
    imgs
  },
  data() {
    return {
      curr: 0,
      hidePlane: false,
      unqualified: false,
      punish: false,
      openUnqualifiedDetail: false,
      openPunishDetail: false,
      isimgs: false, //图片预览弹窗
      srcimageUrl: [], //图片预览地址
      tabIndex: 1,
      info: {},
      selectedItem: {},
      labelList: [
        {
          code: 1,
          name: "不合格车辆"
        },
        {
          code: 2,
          name: "处罚车辆"
        }
      ],
      currentTime: "", //当前时间
      unqualifiedList: [],
      punishList: [],
      videoList: [],
      detailData: {},
      title: "检测报告详情",
      detailList: [],
      unqualifiedDetailList: [] //不合格
    };
  },
  created() {},
  methods: {
    //关闭面板
    justClosedPlane() {
      this.hidePlane = false;
    },
    // 展示详情
    showDetail() {
      this.unqualified = true;
      this.punish = false;
      this.getHeadDetail();
      this.getCurrentTime();
    },
    tabIndex1() {
      this.tabIndex = 1;
    },
    tabIndex2() {
      this.tabIndex = 2;
    },
    // 不合格车辆/处罚车辆表格显示（选择）
    inClick(item) {
      if (item.name === "不合格车辆") {
        this.unqualified = true;
        this.punish = false;
        this.getCurrentTime();
        this.getUnqualified();
      } else if (item.name === "处罚车辆") {
        this.unqualified = false;
        this.punish = true;
        this.getCurrentTime();
        this.getPunish();
      }
    },
    // 遥测站点实时数据--不合格
    getUnqualified() {
      ycHttp
        .getUnqualified({
          siteCode: this.itemData.siteCode
        })
        .then(response => {
          this.unqualifiedList = response.result;
          this.hidePlane = true;
        })
        .catch(error => {
          console.error(error);
        });
    },
    // 遥测站点实时数据--处罚
    getPunish() {
      ycHttp
        .getPunish({
          siteCode: this.itemData.siteCode
        })
        .then(response => {
          this.punishList = response.result;
          this.hidePlane = true;
        })
        .catch(error => {
          console.error(error);
        });
    },
    // 获取面板头部信息详情
    getHeadDetail() {
      this.detailData = [];
      mapHttp
        .siteDetail({
          siteCode: this.itemData.siteCode,
          type: this.itemData.type
        })
        .then(response => {
          this.detailData = response.result;
          this.detailData.type = this.itemData.type;
          this.hidePlane = true;
        })
        .catch(error => {
          console.error(error);
        });
    },
    // 获取当前时间
    getCurrentTime() {
      this.currentTime = moment().format("YYYY-MM-DD HH");
    },
    // 展示检测报告详情（不合格车辆）
    showUnqualifiedDetail(selectRow) {
      this.openUnqualifiedDetail = true;
      if (this.openUnqualifiedDetail) {
        let params = {
          type: selectRow.type,
          telemeteringCode: selectRow.recordCode
        };
        this.getUnqualifiedDetailList(params);
      } else if (!this.openUnqualifiedDetail) {
        this.unqualifiedDetailList = [];
      }
    },
    // 展示检测报告详情（处罚车辆）
    showPunishDetail(selectRow) {
      this.openPunishDetail = true;
      if (this.openPunishDetail) {
        let params = {
          type: selectRow.type,
          administrativeSanctionCode: selectRow.recordCode
        };
        this.getPunishDetail(params);
      } else if (!this.openPunishDetail) {
        this.detailList = [];
      }
    },
    // 获取检测报告详情（不合格车辆）数据列表
    getUnqualifiedDetailList(params) {
      ycHttp.getUnqualifiedDetail(params).then(result => {
        this.unqualifiedDetailList = result.result;
      });
    },
    // 获取检测报告详情（处罚车辆）数据列表
    getPunishDetail(params) {
      this.detailList = [];
      ycHttp.getPunishDetail(params).then(result => {
        result.result.forEach(element => {
          element.records.forEach(t => {
            this.detailList = this.detailList.concat(t);
          });
        });
      });
    },
    // 检测报告详情（不合格车辆/处罚车辆）数据列表--关闭
    checkOut() {
      this.openUnqualifiedDetail = false;
      this.openPunishDetail = false;
      this.unqualifiedDetailList = [];
      this.detailList = [];
    },
    // 图片预览弹窗打开
    showImgs(url) {
      this.isimgs = true;
      this.srcimageUrl = url;
    },
    // 图片预览弹窗关闭
    closeImgs() {
      this.isimgs = false;
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.info = this.itemData;
      this.showDetail();
    });
  },
  computed: {}
};
</script>
<style>
</style>
