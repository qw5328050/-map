<template>
  <div class="sub-tab-content">
    <div class="table-list-wrapper content-scroll">
      <!-- 工业企业固体物料堆存信息 -->
      <section class="table-list mb_20">
        <h3 class="form-item-name">工业企业固体物料堆存信息</h3>
        <zt-table :data="iesmsinfoList" style="margin-top: 10px;">
          <zt-column prop="yardnumber" label="堆场编号" align="center"></zt-column>
          <zt-column prop="yardname" label="堆场名称" align="center"></zt-column>
          <zt-column prop="yardtype" label="堆场类型" align="center"></zt-column>
          <zt-column prop="yardtypeot" label="堆场类型其他" align="center"></zt-column>
          <zt-column prop="storagematerial" label="堆存物料" align="center"></zt-column>
          <zt-column prop="storagematerialtype" label="堆存物料类型" align="center"></zt-column>
          <zt-column prop="storagematerialtypeot" label="堆存物料类型其他" align="center"></zt-column>
          <zt-column prop="zdmj" label="占地面积(平方米)" align="center"></zt-column>
          <zt-column prop="maxheight" label="最高高度(米)" align="center"></zt-column>
          <zt-column prop="avgdailystorage" label="日均储存量(吨)" align="center"></zt-column>
          <zt-column prop="materialenddir" label="物料最终去向" align="center"></zt-column>
          <zt-column prop="materialenddirot" label="物料最终去向其他" align="center"></zt-column>
          <zt-column prop="amdvehiclenum" label="年物料运载车次(车)" align="center"></zt-column>
          <zt-column prop="abcarrycapacity" label="单车平均运载量(吨/车)" align="center"></zt-column>
          <zt-column prop="dustcontrolmeasure" label="粉尘控制措施" align="center"></zt-column>
          <zt-column prop="dustcontrolmeasureot" label="粉尘控制措施其他" align="center"></zt-column>
          <zt-column prop="fq_csl_yc" label="烟_粉尘产生量(吨)" align="center"></zt-column>
          <zt-column prop="fq_pfl_yc" label="烟_粉尘排放量(吨)" align="center"></zt-column>
          <zt-column prop="hfxyjwcslqk" label="挥发性有机物产生量（千克）" align="center"></zt-column>
          <zt-column prop="ffxyjwpflqk" label="挥发性有机物排放量（千克）" align="center"></zt-column>
          <zt-column prop="fq_csl_ychs" label="粉尘产生量(吨)(核算结果)" align="center"></zt-column>
          <zt-column prop="fq_pfl_ychs" label="粉尘排放量(吨)(核算结果)" align="center"></zt-column>
          <zt-column prop="hfxyjwcslqkhs" label="挥发性有机物产生量(千克)(核算结果)" align="center"></zt-column>
          <zt-column prop="ffxyjwpflqkhs" label="挥发性有机物排放量(千克)(核算结果)" align="center"></zt-column>
          <zt-column prop="unitheader" label="单位负责人" align="center"></zt-column>
          <zt-column prop="statisticalofficerauditor" label="统计负责人(审核人)" align="center"></zt-column>
          <zt-column prop="fillingperson" label="填表人" align="center"></zt-column>
          <zt-column prop="issuedate" label="报出日期" align="center"></zt-column>
        </zt-table>
      </section>
      <!-- 工业企业一般工业固体废物产生与处理利用信息 -->
      <section class="table-list mb_20">
        <h3 class="form-item-name">工业企业一般工业固体废物产生与处理利用信息</h3>
        <zt-table :data="iegtugiswinfoList" style="margin-top: 10px;">
          <zt-column prop="gfnameandcode" label="一般工业固体废物名称及代码" align="center"></zt-column>
          <zt-column prop="gf_csl" label="一般工业固体废物产生量(吨)" align="center"></zt-column>
          <zt-column prop="gf_zhlyl" label="一般工业固体废物综合利用量(吨)" align="center"></zt-column>
          <zt-column prop="gfzhlylzxzhlyl" label="一般工业固体废物综合利用量-自行综合利用量(吨)" align="center"></zt-column>
          <zt-column prop="gfzhlylzhlywnzcl" label="一般工业固体废物综合利用量-综合利用往年贮存量(吨)" align="center"></zt-column>
          <zt-column prop="gf_czl" label="一般工业固体废物处置量(吨)" align="center"></zt-column>
          <zt-column prop="gfczlzxczl" label="一般工业固体废物处置量-自行处置量(吨)" align="center"></zt-column>
          <zt-column prop="gfczlczwnzcl" label="一般工业固体废物处置量-处置往年贮存量(吨)" align="center"></zt-column>
          <zt-column prop="gf_zcl" label="一般工业固体废物贮存量(吨)" align="center"></zt-column>
          <zt-column prop="gf_qddql" label="一般工业固体废物倾倒丢弃量(吨)" align="center"></zt-column>
          <zt-column prop="gfzcczzctype" label="一般工业固体废物贮存处置场类型" align="center"></zt-column>
          <zt-column prop="detailedaddresscountydcb" label="详细地址_县(区、市、旗)" align="center"></zt-column>
          <zt-column prop="detailedaddresstownshipt" label="详细地址_乡(镇)" align="center"></zt-column>
          <zt-column prop="detailedaddressstreetdn" label="详细地址_街(村)、门牌号" align="center"></zt-column>
          <zt-column prop="zcczcgeolond" label="贮存处置场地理经度(度)" align="center"></zt-column>
          <zt-column prop="zcczcgeolonm" label="贮存处置场地理经度(分)" align="center"></zt-column>
          <zt-column prop="zcczcgeolons" label="贮存处置场地理经度(秒)" align="center"></zt-column>
          <zt-column prop="zcczcgeolatd" label="贮存处置场地理纬度(度)" align="center"></zt-column>
          <zt-column prop="zcczcgeolatm" label="贮存处置场地理纬度(分)" align="center"></zt-column>
          <zt-column prop="zcczcgeolats" label="贮存处置场地理纬度(秒)" align="center"></zt-column>
          <zt-column prop="czcsjrl" label="处置场设计容量(立方米)" align="center"></zt-column>
          <zt-column prop="czcytrl" label="处置场已填容量(立方米)" align="center"></zt-column>
          <zt-column prop="czcsjcznl" label="处置场设计处置能力(吨/年)" align="center"></zt-column>
          <zt-column prop="wkkedangerlevel" label="尾矿库环境风险等级" align="center"></zt-column>
          <zt-column prop="wkkedangerlevely" label="尾矿库环境风险等级划定年份" align="center"></zt-column>
          <zt-column prop="gfzhlyfs" label="一般工业固体废物综合利用设施-综合利用方式" align="center"></zt-column>
          <zt-column prop="gfzhlynl" label="一般工业固体废物综合利用设施-综合利用能力(吨)" align="center"></zt-column>
          <zt-column prop="gfbnsjzhlyl" label="一般工业固体废物综合利用设施-本年实际综合利用量(吨)" align="center"></zt-column>
          <zt-column prop="unitheader" label="单位负责人" align="center"></zt-column>
          <zt-column prop="statisticalofficerauditor" label="统计负责人(审核人)" align="center"></zt-column>
          <zt-column prop="fillingperson" label="填表人" align="center"></zt-column>
          <zt-column prop="issuedate" label="报出日期" align="center"></zt-column>
        </zt-table>
      </section>
      <!-- 工业企业危险废物产生与处理利用信息 -->
      <section class="table-list mb_20">
        <h3 class="form-item-name">工业企业危险废物产生与处理利用信息</h3>
        <zt-table :data="iehwgtuinfoList" style="margin-top: 10px;">
          <zt-column prop="gf_mc_wf" label="危险废物名称" align="center"></zt-column>
          <zt-column prop="gf_dm_wf" label="危险废物代码" align="center"></zt-column>
          <zt-column prop="snmbdwsjzclt" label="上年末本单位实际贮存量(吨)" align="center"></zt-column>
          <zt-column prop="gf_csl_wf" label="危险废物产生量(吨)" align="center"></zt-column>
          <zt-column prop="sczdwlt" label="送持证单位量(吨)" align="center"></zt-column>
          <zt-column prop="accwldangerfwlt" label="接收外来危险废物量(吨)" align="center"></zt-column>
          <zt-column prop="zxzhlylt" label="自行综合利用量(吨)" align="center"></zt-column>
          <zt-column prop="zxczlt" label="自行处置量(吨)" align="center"></zt-column>
          <zt-column prop="bnmbdwsjzclt" label="本年末本单位实际贮存量(吨)" align="center"></zt-column>
          <zt-column prop="zhlywzwnzclt" label="综合利用外置往年贮存量(吨)" align="center"></zt-column>
          <zt-column prop="gf_qddql_wf" label="危险废物倾倒丢弃量(吨)" align="center"></zt-column>
          <zt-column prop="tmcdaddresscountydcb" label="填埋场详细地址_县(区、市、旗)" align="center"></zt-column>
          <zt-column prop="tmcdaddresstownshipt" label="填埋场详细地址_乡(镇)" align="center"></zt-column>
          <zt-column prop="tmcdaddressstreetdn" label="填埋场详细地址_街(村)、门牌号" align="center"></zt-column>
          <zt-column prop="tmcgeolond" label="填埋场地理坐标_经度(度)" align="center"></zt-column>
          <zt-column prop="tmcgeolonm" label="填埋场地理坐标_经度(分)" align="center"></zt-column>
          <zt-column prop="tmcgeolons" label="填埋场地理坐标_经度(秒)" align="center"></zt-column>
          <zt-column prop="tmcgeolatd" label="填埋场地理坐标_纬度(度)" align="center"></zt-column>
          <zt-column prop="tmcgeolatm" label="填埋场地理坐标_纬度(分)" align="center"></zt-column>
          <zt-column prop="tmcgeolats" label="填埋场地理坐标_纬度(秒)" align="center"></zt-column>
          <zt-column prop="sjrl" label="设计容量_填埋(立方米)" align="center"></zt-column>
          <zt-column prop="ytrl" label="已填容量_填埋(立方米)" align="center"></zt-column>
          <zt-column prop="sjcznlty" label="设计处置能力(吨/年)" align="center"></zt-column>
          <zt-column prop="bnsjtmczlt" label="本年实际填埋处置量(吨)" align="center"></zt-column>
          <zt-column prop="fszzaddresscountydcb" label="焚烧装置的具体位置_县(区、市、旗)" align="center"></zt-column>
          <zt-column prop="fszzaddresstownshipt" label="焚烧装置的具体位置_乡(镇)" align="center"></zt-column>
          <zt-column prop="fszzaddressstreetdn" label="焚烧装置的具体位置-街(村)、门牌号" align="center"></zt-column>
          <zt-column prop="fszzgeolond" label="焚烧装置的地理坐标_经度(度)" align="center"></zt-column>
          <zt-column prop="fszzgeolonm" label="焚烧装置的地理坐标_经度(分)" align="center"></zt-column>
          <zt-column prop="fszzgeolons" label="焚烧装置的地理坐标_经度(秒)" align="center"></zt-column>
          <zt-column prop="fszzgeolatd" label="焚烧装置的地理坐标_纬度(度)" align="center"></zt-column>
          <zt-column prop="fszzgeolatm" label="焚烧装置的地理坐标_纬度(分)" align="center"></zt-column>
          <zt-column prop="fszzgeolats" label="焚烧装置的地理坐标_纬度(秒)" align="center"></zt-column>
          <zt-column prop="facilitynum" label="设施数量(台)" align="center"></zt-column>
          <zt-column prop="sjfscznlty" label="设计焚烧处置能力(吨/年)" align="center"></zt-column>
          <zt-column prop="bnsjfsczl" label="本年实际焚烧处置量(吨)" align="center"></zt-column>
          <zt-column prop="gf_nbzhlyczfs" label="危险废物内部综合利用/处置方式" align="center"></zt-column>
          <zt-column prop="gf_nbnzhlycznlty" label="危险废物内部年综合利用/处置能力(吨/年)" align="center"></zt-column>
          <zt-column prop="bnsjzhlyczl" label="本年实际综合利用/处置量(吨)" align="center"></zt-column>
          <zt-column prop="unitheader" label="单位负责人" align="center"></zt-column>
          <zt-column prop="statisticalofficerauditor" label="统计负责人(审核人)" align="center"></zt-column>
          <zt-column prop="fillingperson" label="填表人" align="center"></zt-column>
          <zt-column prop="issuedate" label="报出日期" align="center"></zt-column>
        </zt-table>
      </section>
    </div>
  </div>
</template>
<script>
import sopDetailHttp from "@/https/monitor/sopDetailHttp.js";
export default {
  props: {
    itemData: Object
  },
  data() {
    return {
      iesmsinfoList: [], //固体物料堆存
      iegtugiswinfoList: [], //一般工业固体废物产生与处理利用
      iehwgtuinfoList: [] //危险废物产生与处理利用
    };
  },
  created() {
    this.getIesmsinfoData();
    this.getIegtugiswinfoData();
    this.getIehwgtuinfoData();
  },
  mounted() {},
  methods: {
    // 固体物料堆存
    getIesmsinfoData() {
      let params = {
        pollutionId: this.itemData.id
      };
      sopDetailHttp
        .getIesmsinfoData(params)
        .then(result => {
          if (result.code === 0) {
            this.iesmsinfoList = result.result.list;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //一般工业固体废物产生与处理利用
    getIegtugiswinfoData() {
      let params = {
        pollutionId: this.itemData.id
      };
      sopDetailHttp
        .getIegtugiswinfoData(params)
        .then(result => {
          if (result.code === 0) {
            this.iegtugiswinfoList = result.result.list;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //危险废物产生与处理利用
    getIehwgtuinfoData() {
      let params = {
        pollutionId: this.itemData.id
      };
      sopDetailHttp
        .getIehwgtuinfoData(params)
        .then(result => {
          if (result.code === 0) {
            this.iehwgtuinfoList = result.result.list;
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
