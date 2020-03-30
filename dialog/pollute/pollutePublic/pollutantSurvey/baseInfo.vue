<template>
  <!-- 右侧内容区域-基本信息 -->
  <div class="sub-tab-content">
    <table class="table table-bordered light-gray-th table-baseInfo">
      <tbody>
        <tr>
          <th style="width: 19%;">企业名称</th>
          <td style="width: 31%;">{{resultList.licens_number}}</td>
          <th style="width: 19%;">普查小区代码</th>
          <td style="width: 31%;">{{resultList.general_code}}</td>
        </tr>
        <tr>
          <th style="width: 19%;">年份</th>
          <td style="width: 31%;">{{resultList.particularyear}}</td>
          <th style="width: 19%;">统一社会信用代码</th>
          <td style="width: 31%;">{{resultList.social_credit_code}}</td>
        </tr>
        <tr>
          <th style="width: 19%;">组织机构代码</th>
          <td style="width: 31%;">{{resultList.organicode}}</td>
          <th style="width: 19%;">曾用名</th>
          <td style="width: 31%;">{{resultList.cym}}</td>
        </tr>
        <tr>
          <th style="width: 19%;">行业名称1</th>
          <td style="width: 31%;">{{resultList.tradenameone}}</td>
          <th style="width: 19%;">行业代码1</th>
          <td style="width: 31%;">{{resultList.tradecodeone}}</td>
        </tr>
        <tr>
          <th style="width: 19%;">行业名称2</th>
          <td style="width: 31%;">{{resultList.tradenametwo}}</td>
          <th style="width: 19%;">行业代码2</th>
          <td style="width: 31%;">{{resultList.tradecodetwo}}</td>
        </tr>
        <tr>
          <th style="width: 19%;">行业名称3</th>
          <td style="width: 31%;">{{resultList.tradenamethree}}</td>
          <th style="width: 19%;">行业代码3</th>
          <td style="width: 31%;">{{resultList.tradecodethree}}</td>
        </tr>
        <tr>
          <th style="width: 19%;">省(自治区、直辖市)</th>
          <td style="width: 31%;">{{resultList.asd_province_name}}</td>
          <th style="width: 19%;">地区(市、州、盟)</th>
          <td style="width: 31%;">{{resultList.area_csa}}</td>
        </tr>
        <tr>
          <th style="width: 19%;">县(区、市、旗)</th>
          <td style="width: 31%;">{{resultList.county_dcb}}</td>
          <th style="width: 19%;">乡(镇)</th>
          <td style="width: 31%;">{{resultList.asd_country_name}}</td>
        </tr>
        <tr>
          <th style="width: 19%;">街(村)、门牌号</th>
          <td style="width: 31%;">{{resultList.street_doornum}}</td>
          <th style="width: 19%;">行政区代码</th>
          <td style="width: 31%;">{{resultList.admincode}}</td>
        </tr>
        <tr>
          <th style="width: 19%;">中心经度(度)</th>
          <td style="width: 31%;">{{resultList.centrallong_deg}}</td>
          <th style="width: 19%;">中心经度(分)</th>
          <td style="width: 31%;">{{resultList.centrallong_min}}</td>
        </tr>
        <tr>
          <th style="width: 19%;">中心经度(秒)</th>
          <td style="width: 31%;">{{resultList.centrallong_sec}}</td>
          <th style="width: 19%;">中心纬度(度)</th>
          <td style="width: 31%;">{{resultList.centerlati_deg}}</td>
        </tr>
        <tr>
          <th style="width: 19%;">中心经度(分)</th>
          <td style="width: 31%;">{{resultList.centerlati_min}}</td>
          <th style="width: 19%;">中心纬度(秒)</th>
          <td style="width: 31%;">{{resultList.centerlati_sec}}</td>
        </tr>
        <tr>
          <th style="width: 19%;">企业规模</th>
          <td style="width: 31%;">{{resultList.enterprise_scale}}</td>
          <th style="width: 19%;">法定代表人</th>
          <td style="width: 31%;">{{resultList.legal_repres_code}}</td>
        </tr>
        <tr>
          <th style="width: 19%;">开业时间（年）</th>
          <td style="width: 31%;">{{resultList.openinghours_year}}</td>
          <th style="width: 19%;">开业时间（月）</th>
          <td style="width: 31%;">{{resultList.openinghours_mon}}</td>
        </tr>
        <tr>
          <th style="width: 19%;">联系人</th>
          <td style="width: 31%;">{{resultList.contacts}}</td>
          <th style="width: 19%;">电话号码</th>
          <td style="width: 31%;">{{resultList.telephone_number}}</td>
        </tr>
        <tr>
          <th style="width: 19%;">登记注册类型</th>
          <td style="width: 31%;">{{resultList.djzclxdm}}</td>
          <th style="width: 19%;">受纳水体名称</th>
          <td style="width: 31%;">{{resultList.snstmc}}</td>
        </tr>
        <tr>
          <th style="width: 19%;">受纳水体代码</th>
          <td style="width: 31%;">{{resultList.snstdm}}</td>
          <th style="width: 19%;">是否发放新版排污许可证</th>
          <td style="width: 31%;">{{resultList.isissuancenewep}}</td>
        </tr>
        <tr>
          <th style="width: 19%;">许可证编号</th>
          <td style="width: 31%;">{{resultList.licens_number}}</td>
          <th style="width: 19%;">企业运行状态</th>
          <td style="width: 31%;">{{resultList.operationenterprisesstatus}}</td>
        </tr>
        <tr>
          <th style="width: 19%;">正常生产时间(小时)</th>
          <td style="width: 31%;">{{resultList.normalproduction_h}}</td>
          <th style="width: 19%;">工业总产值(当年价格)(千元)</th>
          <td style="width: 31%;">{{resultList.grossindustrialoutputc}}</td>
        </tr>
        <tr>
          <th style="width: 19%;">产生工业废水</th>
          <td style="width: 31%;">{{resultList.produceindustrialwastewater}}</td>
          <th style="width: 19%;">有电站锅炉/燃气轮机</th>
          <td style="width: 31%;">{{resultList.utilityboilergast}}</td>
        </tr>
        <tr>
          <th style="width: 19%;">有工业炉窑</th>
          <td style="width: 31%;">{{resultList.industrialkilns}}</td>
          <th style="width: 19%;">有炼焦工序</th>
          <td style="width: 31%;">{{resultList.cokingprocess}}</td>
        </tr>
        <tr>
          <th style="width: 19%;">有烧结/球团工序</th>
          <td style="width: 31%;">{{resultList.sinteringpelletizingprocess}}</td>
          <th style="width: 19%;">有炼铁工序</th>
          <td style="width: 31%;">{{resultList.ironmakingprocess}}</td>
        </tr>
        <tr>
          <th style="width: 19%;">有炼钢工序</th>
          <td style="width: 31%;">{{resultList.steelmakingprocess}}</td>
          <th style="width: 19%;">有熟料生产</th>
          <td style="width: 31%;">{{resultList.clinkerproduction}}</td>
        </tr>
        <tr>
          <th style="width: 19%;">是否为石化企业</th>
          <td style="width: 31%;">{{resultList.ispetrochemicalenterprises}}</td>
          <th style="width: 19%;">有有机液体储罐/装载</th>
          <td style="width: 31%;">{{resultList.organicliquidtankl}}</td>
        </tr>
        <tr>
          <th style="width: 19%;">有含挥发性有机物原辅材料使用</th>
          <td style="width: 31%;">{{resultList.usevolatileorganiccram}}</td>
          <th style="width: 19%;">有工业固体物料堆存</th>
          <td style="width: 31%;">{{resultList.industrialsolidmaterials}}</td>
        </tr>
        <tr>
          <th style="width: 19%;">有其他生产废气</th>
          <td style="width: 31%;">{{resultList.otherproductionwasteg}}</td>
          <th style="width: 19%;">一般工业固体废物</th>
          <td style="width: 31%;">{{resultList.generallndustrialsolidw}}</td>
        </tr>
        <tr>
          <th style="width: 19%;">危险废物</th>
          <td style="width: 31%;">{{resultList.hazardouswaste}}</td>
          <th style="width: 19%;">涉及稀土等15类矿产</th>
          <td style="width: 31%;">{{resultList.involvetombarthitefm}}</td>
        </tr>
        <tr>
          <th style="width: 19%;">备注</th>
          <td style="width: 31%;">{{resultList.remarks}}</td>
          <th style="width: 19%;">单位负责人</th>
          <td style="width: 31%;">{{resultList.unitheader}}</td>
        </tr>
        <tr>
          <th style="width: 19%;">统计负责人(审核人)</th>
          <td style="width: 31%;">{{resultList.statisticalofficerauditor}}</td>
          <th style="width: 19%;">填表人</th>
          <td style="width: 31%;">{{resultList.fillingperson}}</td>
        </tr>
        <tr>
          <th style="width: 19%;">报出日期</th>
          <td style="width: 31%;">{{resultList.issuedate}}</td>
        </tr>

        <!-- <tr>
          <th style="width: 19%;">许可证编号</th>
          <td style="width: 31%;">{{resultList.licens_number}}</td>
          <th style="width: 19%;">许可证管理类别</th>
          <td style="width: 31%;">重点管理</td>
        </tr>
        <tr>
          <th>有效期限</th>
          <td>自 2018 年 06 月 22 日 起 至 2021 年 06 月 21 日 止</td>
          <th rowspan="4">许可证二维码</th>
          <td rowspan="4">
            <img src="static/images/qr-code.jpg" alt />
          </td>
        </tr>
        <tr>
          <th>发证机关</th>
          <td>济南市环境保护局</td>
        </tr>
        <tr>
          <th>发证日期</th>
          <td>2018 年 06 月 22 日</td>
        </tr>
        <tr>
          <th>是否需整改</th>
          <td>否</td>
        </tr>
        <tr>
          <th>技术负责人</th>
          <td>胡飞飞</td>
          <th>联系电话</th>
          <td>0531 - 88669920</td>
        </tr>
        <tr>
          <th>
            所在地区是否
            <br />属于大气污染重点控制区
          </th>
          <td>是</td>
          <th>
            所在地区是否
            <br />属于总磷总氮控制区
          </th>
          <td>否</td>
        </tr>
        <tr>
          <th>是否工业园区</th>
          <td>是</td>
          <th>所属工业园区名称</th>
          <td>章丘区刁镇化工工业区</td>
        </tr>
        <tr>
          <th>主要污染物类别</th>
          <td>废气、废水</td>
          <th></th>
          <td></td>
        </tr>
        <tr>
          <th>气主要污染物种类</th>
          <td>颗粒物、SO2、NOx、VOCs、其它特征污染物</td>
          <th>废水主要污染物种类</th>
          <td>COD、氨氮、其它特征污染物</td>
        </tr>
        <tr>
          <th>大气污染物排放形式</th>
          <td>有组织、无组织</td>
          <th>废水污染物排放规律</th>
          <td>连续排放、流量稳定</td>
        </tr>
        <tr>
          <th>大气污染物排放执行标准名称</th>
          <td>山东省区域性大气污染物综合排放标准DB37/2376-2013</td>
          <th>水污染物排放执行标准名称</th>
          <td>合成氨工业水污染物排放标准GB 13458-2013</td>
        </tr>-->
      </tbody>
    </table>
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
      resultList: []
    };
  },
  created() {
    this.getBaseInfoData();
  },
  mounted() {},
  methods: {
    getBaseInfoData() {
      let params = {
        pollutionId: this.itemData.id
      };
      sopDetailHttp
        .getBaseInfoData(params)
        .then(result => {
          if (result.code === 0) {
            this.resultList1 = result.result.list;
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
<style scoped>
table tbody {
  display: block;
  height: 550px;
  overflow-y: scroll;
}
table th {
  height: calc(100%-1em);
}
</style>
