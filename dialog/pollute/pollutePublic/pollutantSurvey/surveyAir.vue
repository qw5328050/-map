<template>
  <div class="sub-tab-content">
    <div class="table-list-wrapper content-scroll">
      <!-- 工业企业锅炉/燃气轮机废气治理与排放情况 -->
      <section class="table-list mb_15">
        <h3 class="form-item-name">工业企业锅炉/燃气轮机废气治理与排放情况</h3>
        <zt-table :data="iebgtegtemissionList" style="margin-top: 10px;">
          <zt-column prop="ppboilerorgturbnub" label="电站锅炉/燃气轮机编号" align="center"></zt-column>
          <zt-column prop="ppboilerorgturbtype" label="电站锅炉/燃气轮机类型" align="center"></zt-column>
          <zt-column prop="correspondunitnum" label="对应机组编号" align="center"></zt-column>
          <zt-column prop="correspondunitcap" label="对应机组装机容量(万千瓦)" align="center"></zt-column>
          <zt-column prop="isheatandpower" label="是否热电联产" align="center"></zt-column>
          <zt-column prop="ppboilerhcci" label="电站锅炉燃烧方式名称" align="center"></zt-column>
          <zt-column prop="ppboilerorgturbout" label="电站锅炉/燃气轮机额定出力(蒸吨/小时)" align="center"></zt-column>
          <zt-column prop="ppboilerorgturbtime" label="电站锅炉/燃气轮机运行时间(小时)" align="center"></zt-column>
          <zt-column prop="entboilernum" label="工业锅炉编号" align="center"></zt-column>
          <zt-column prop="entboilertype" label="工业锅炉类型" align="center"></zt-column>
          <zt-column prop="entboilerpurpose" label="工业锅炉用途" align="center"></zt-column>
          <zt-column prop="entboilerhccitype" label="工业锅炉燃烧方式名称" align="center"></zt-column>
          <zt-column prop="entboilerout" label="工业锅炉额定出力(蒸吨/小时)" align="center"></zt-column>
          <zt-column prop="entboilertime" label="工业锅炉运行时间(小时)" align="center"></zt-column>
          <zt-column prop="generationcapacity" label="发电量(万千瓦时)" align="center"></zt-column>
          <zt-column prop="heatcapacity" label="供热量(万吉焦)" align="center"></zt-column>
          <zt-column prop="fueltypeo" label="燃料一类型" align="center"></zt-column>
          <zt-column prop="fuelpowercono" label="燃料一消耗量-发电消耗量" align="center"></zt-column>
          <zt-column prop="fuelheatcono" label="燃料一消耗量-供热消耗量" align="center"></zt-column>
          <zt-column prop="fuellowcalvalo" label="燃料一低位发热量(千卡/千克或千卡/标准立方米)" align="center"></zt-column>
          <zt-column prop="fuelavgbsulo" label="燃料一平均收到基含硫量" align="center"></zt-column>
          <zt-column prop="fuelavgbasho" label="燃料一平均收到基灰分(%)" align="center"></zt-column>
          <zt-column prop="fuelavgdryasho" label="燃料一平均干燥无灰基挥发分(%)" align="center"></zt-column>
          <zt-column prop="fueltypet" label="燃料二类型" align="center"></zt-column>
          <zt-column prop="fuelconsumptiont" label="燃料二消耗量" align="center"></zt-column>
          <zt-column prop="fuelpowercont" label="燃料二消耗量-发电消耗量" align="center"></zt-column>
          <zt-column prop="fuelheatcont" label="燃料二消耗量-供热消耗量" align="center"></zt-column>
          <zt-column prop="fuellowcalvalt" label="燃料二低位发热量(千卡/千克或千卡/标准立方米)" align="center"></zt-column>
          <zt-column prop="fuelavgbsult" label="燃料二平均收到基含硫量" align="center"></zt-column>
          <zt-column prop="fuelavgbasht" label="燃料二平均收到基灰分(%)" align="center"></zt-column>
          <zt-column prop="fuelavgdryasht" label="燃料二平均干燥无灰基挥发分(%)" align="center"></zt-column>
          <zt-column prop="totfuelconsumption" label="其他燃料消耗总量(吨标准煤)" align="center"></zt-column>
          <zt-column prop="tlssbh" label="脱硫设施编号" align="center"></zt-column>
          <zt-column prop="tlgy1" label="脱硫工艺1" align="center"></zt-column>
          <zt-column prop="tlgy2" label="脱硫工艺2" align="center"></zt-column>
          <zt-column prop="tlgy3" label="脱硫工艺3" align="center"></zt-column>
          <zt-column prop="desueffic" label="脱硫效率(%)" align="center"></zt-column>
          <zt-column prop="desuyearruntime" label="脱硫设施年运行时间(小时)" align="center"></zt-column>
          <zt-column prop="desuname" label="脱硫剂名称" align="center"></zt-column>
          <zt-column prop="desuuse" label="脱硫剂使用量(吨)" align="center"></zt-column>
          <zt-column prop="tnssbh" label="脱硝设施编号" align="center"></zt-column>
          <zt-column prop="txgy1" label="脱硝工艺1" align="center"></zt-column>
          <zt-column prop="txgy2" label="脱硝工艺2" align="center"></zt-column>
          <zt-column prop="txgy3" label="脱硝工艺3" align="center"></zt-column>
          <zt-column prop="denfeffic" label="脱硝效率(%)" align="center"></zt-column>
          <zt-column prop="denyearruntime" label="脱硝设施年运行时间(小时)" align="center"></zt-column>
          <zt-column prop="denname" label="脱硝剂名称" align="center"></zt-column>
          <zt-column prop="denuse" label="脱硝剂使用量(吨)" align="center"></zt-column>
          <zt-column prop="ccssbh" label="除尘设施编号" align="center"></zt-column>
          <zt-column prop="ccgy1" label="除尘工艺1" align="center"></zt-column>
          <zt-column prop="ccgy2" label="除尘工艺2" align="center"></zt-column>
          <zt-column prop="ccgy3" label="除尘工艺3" align="center"></zt-column>
          <zt-column prop="dustfeffic" label="除尘效率(%)" align="center"></zt-column>
          <zt-column prop="dustyearruntime" label="除尘设施年运行时间(小时)" align="center"></zt-column>
          <zt-column prop="fq_pfl2" label="工业废气排放量(万立方米)" align="center"></zt-column>
          <zt-column prop="fq_csl_eyhl" label="二氧化硫产生量(吨)(核算结果)" align="center"></zt-column>
          <zt-column prop="fq_pfl_eyhl" label="二氧化硫排放量(吨)(核算结果)" align="center"></zt-column>
          <zt-column prop="fq_csl_dyhw" label="氮氧化物产生量(吨)(核算结果)" align="center"></zt-column>
          <zt-column prop="fq_pfl_dyhw" label="氮氧化物排放量(吨)(核算结果)" align="center"></zt-column>
          <zt-column prop="klwcsld" label="颗粒物产生量(吨)(核算结果)" align="center"></zt-column>
          <zt-column prop="klwpfld" label="颗粒物排放量(吨)(核算结果)" align="center"></zt-column>
          <zt-column prop="hfxyjwcslqk" label="挥发性有机物产生量(千克)(核算结果)" align="center"></zt-column>
          <zt-column prop="ffxyjwpflqk" label="挥发性有机物排放量(千克)(核算结果)" align="center"></zt-column>
          <zt-column prop="ammemission" label="氨排放量(吨)" align="center"></zt-column>
          <zt-column prop="fq_csl_s" label="废气砷产生量(千克)" align="center"></zt-column>
          <zt-column prop="fq_pfl_s" label="废气砷排放量(千克)" align="center"></zt-column>
          <zt-column prop="fq_csl_q" label="废气铅产生量(千克)" align="center"></zt-column>
          <zt-column prop="fq_pfl_q" label="废气铅排放量(千克)" align="center"></zt-column>
          <zt-column prop="fq_csl_qe" label="废气镉产生量(千克)" align="center"></zt-column>
          <zt-column prop="fq_pfl_qe" label="废气镉排放量(千克)" align="center"></zt-column>
          <zt-column prop="exhgaspro" label="废气铬产生量(千克)" align="center"></zt-column>
          <zt-column prop="exhgasdis" label="废气铬排放量(千克)" align="center"></zt-column>
          <zt-column prop="fq_csl_g" label="废气汞产生量(千克)" align="center"></zt-column>
          <zt-column prop="fq_pfl_g" label="废气汞排放量(千克)" align="center"></zt-column>
          <zt-column prop="fq_csl_eyhlhs" label="二氧化硫产生量(吨)" align="center"></zt-column>
          <zt-column prop="fq_pfl_eyhlhs" label="二氧化硫排放量(吨)" align="center"></zt-column>
          <zt-column prop="fq_csl_dyhwhs" label="氮氧化物产生量(吨)" align="center"></zt-column>
          <zt-column prop="fq_pfl_dyhwhs" label="氮氧化物排放量(吨)" align="center"></zt-column>
          <zt-column prop="klwcsldhs" label="颗粒物产生量(吨)" align="center"></zt-column>
          <zt-column prop="klwpfldhs" label="颗粒物排放量(吨)" align="center"></zt-column>
          <zt-column prop="hfxyjwcslqkhs" label="挥发性有机物产生量（千克）" align="center"></zt-column>
          <zt-column prop="ffxyjwpflqkhs" label="挥发性有机物排放量（千克）" align="center"></zt-column>
          <zt-column prop="ammemissionhs" label="氨排放量(吨)(核算结果)" align="center"></zt-column>
          <zt-column prop="fq_csl_shs" label="废气砷产生量(千克)(核算结果)" align="center"></zt-column>
          <zt-column prop="fq_pfl_shs" label="废气砷排放量(千克)(核算结果)" align="center"></zt-column>
          <zt-column prop="fq_csl_qhs" label="废气铅产生量(千克)(核算结果)" align="center"></zt-column>
          <zt-column prop="fq_pfl_qhs" label="废气铅排放量(千克)(核算结果)" align="center"></zt-column>
          <zt-column prop="fq_csl_qehs" label="废气镉产生量(千克)(核算结果)" align="center"></zt-column>
          <zt-column prop="fq_pfl_qehs" label="废气镉排放量(千克)(核算结果)" align="center"></zt-column>
          <zt-column prop="exhgasprohs" label="废气铬产生量(千克)(核算结果)" align="center"></zt-column>
          <zt-column prop="exhgasdishs" label="废气铬排放量(千克)(核算结果)" align="center"></zt-column>
          <zt-column prop="fq_csl_ghs" label="废气汞产生量(千克)(核算结果)" align="center"></zt-column>
          <zt-column prop="fq_pfl_ghs" label="废气汞排放量(千克)(核算结果)" align="center"></zt-column>
          <zt-column prop="unitheader" label="单位负责人" align="center"></zt-column>
          <zt-column prop="statisticalofficerauditor" label="统计负责人(审核人)" align="center"></zt-column>
          <zt-column prop="fillingperson" label="填表人" align="center"></zt-column>
          <zt-column prop="issuedate" label="报出日期" align="center"></zt-column>
        </zt-table>
      </section>
      <!-- 工业企业炉窑废气治理与排放情况 -->
      <section class="table-list mb_15">
        <h3 class="form-item-name">工业企业炉窑废气治理与排放情况</h3>
        <zt-table :data="iefakegtemissionList" style="margin-top: 10px;">
          <zt-column prop="kilntype" label="炉窑类型" align="center"></zt-column>
          <zt-column prop="kilncode" label="炉窑编号" align="center"></zt-column>
          <zt-column prop="kilnscape" label="炉窑规模" align="center"></zt-column>
          <zt-column prop="proyeartime" label="设计年生产时间（h）" align="center"></zt-column>
          <zt-column prop="fueltypeo" label="燃料一类型" align="center"></zt-column>
          <zt-column prop="fuelconsumptiono" label="燃料一消耗量" align="center"></zt-column>
          <zt-column prop="fuellowcalvalo" label="燃料一低位发热量(千卡/千克或千卡/标准立方米)" align="center"></zt-column>
          <zt-column prop="fuelavgbsulo" label="燃料一平均收到基含硫量" align="center"></zt-column>
          <zt-column prop="fuelavgbasho" label="燃料一平均收到基灰分(%)" align="center"></zt-column>
          <zt-column prop="fuelavgdryasho" label="燃料一平均干燥无灰基挥发分(%)" align="center"></zt-column>
          <zt-column prop="fueltypet" label="燃料二类型" align="center"></zt-column>
          <zt-column prop="fuelconsumptiont" label="燃料二消耗量" align="center"></zt-column>
          <zt-column prop="fuellowcalvalt" label="燃料二低位发热量(千卡/千克或千卡/标准立方米)" align="center"></zt-column>
          <zt-column prop="fuelavgbsult" label="燃料二平均收到基含硫量" align="center"></zt-column>
          <zt-column prop="fuelavgbasht" label="燃料二平均收到基灰分(%)" align="center"></zt-column>
          <zt-column prop="fuelavgdryasht" label="燃料二平均干燥无灰基挥发分(%)" align="center"></zt-column>
          <zt-column prop="totfuelconsumption" label="其他燃料消耗总量(吨标准煤)" align="center"></zt-column>
          <zt-column prop="productname" label="产品名称" align="center"></zt-column>
          <zt-column prop="productsoutput" label="产品产量" align="center"></zt-column>
          <zt-column prop="fluename" label="原料名称" align="center"></zt-column>
          <zt-column prop="flueuse" label="原料用量" align="center"></zt-column>
          <zt-column prop="tlssbh" label="脱硫设施编号" align="center"></zt-column>
          <zt-column prop="tlgy1" label="脱硫工艺1" align="center"></zt-column>
          <zt-column prop="tlgy2" label="脱硫工艺2" align="center"></zt-column>
          <zt-column prop="tlgy3" label="脱硫工艺3" align="center"></zt-column>
          <zt-column prop="desueffic" label="脱硫效率(%)" align="center"></zt-column>
          <zt-column prop="desuyearruntime" label="脱硫设施年运行时间(小时)" align="center"></zt-column>
          <zt-column prop="desuname" label="脱硫剂名称" align="center"></zt-column>
          <zt-column prop="desuuse" label="脱硫剂使用量(吨)" align="center"></zt-column>
          <zt-column prop="tnssbh" label="脱硝设施编号" align="center"></zt-column>
          <zt-column prop="txgy1" label="脱硝工艺1" align="center"></zt-column>
          <zt-column prop="txgy2" label="脱硝工艺2" align="center"></zt-column>
          <zt-column prop="txgy3" label="脱硝工艺3" align="center"></zt-column>
          <zt-column prop="denfeffic" label="脱硝效率(%)" align="center"></zt-column>
          <zt-column prop="denyearruntime" label="脱硝设施年运行时间(小时)" align="center"></zt-column>
          <zt-column prop="denname" label="脱硝剂名称" align="center"></zt-column>
          <zt-column prop="denuse" label="脱硝剂使用量(吨)" align="center"></zt-column>
          <zt-column prop="ccssbh" label="除尘设施编号" align="center"></zt-column>
          <zt-column prop="ccgy1" label="除尘工艺1" align="center"></zt-column>
          <zt-column prop="ccgy2" label="除尘工艺2" align="center"></zt-column>
          <zt-column prop="ccgy3" label="除尘工艺3" align="center"></zt-column>
          <zt-column prop="dustfeffic" label="除尘效率(%)" align="center"></zt-column>
          <zt-column prop="dustyearruntime" label="除尘设施年运行时间(小时)" align="center"></zt-column>
          <zt-column prop="fq_pfl2" label="工业废气排放量(万立方米)" align="center"></zt-column>
          <zt-column prop="fq_csl_eyhlhs" label="二氧化硫产生量(吨)(核算结果)" align="center"></zt-column>
          <zt-column prop="fq_pfl_eyhlhs" label="二氧化硫排放量(吨)(核算结果)" align="center"></zt-column>
          <zt-column prop="fq_csl_dyhwhs" label="氮氧化物产生量(吨)(核算结果)" align="center"></zt-column>
          <zt-column prop="fq_pfl_dyhwhs" label="氮氧化物排放量(吨)(核算结果)" align="center"></zt-column>
          <zt-column prop="klwcsldhs" label="颗粒物产生量(吨)(核算结果)" align="center"></zt-column>
          <zt-column prop="klwpfldhs" label="颗粒物排放量(吨)(核算结果)" align="center"></zt-column>
          <zt-column prop="hfxyjwcslqkhs" label="挥发性有机物产生量(千克)(核算结果)" align="center"></zt-column>
          <zt-column prop="ffxyjwpflqkhs" label="挥发性有机物排放量(千克)(核算结果)" align="center"></zt-column>
          <zt-column prop="ammemission" label="氨排放量(吨)" align="center"></zt-column>
          <zt-column prop="fq_csl_s" label="废气砷产生量(千克)" align="center"></zt-column>
          <zt-column prop="fq_pfl_s" label="废气砷排放量(千克)" align="center"></zt-column>
          <zt-column prop="fq_csl_q" label="废气铅产生量(千克)" align="center"></zt-column>
          <zt-column prop="fq_pfl_q" label="废气铅排放量(千克)" align="center"></zt-column>
          <zt-column prop="fq_csl_qe" label="废气镉产生量(千克)" align="center"></zt-column>
          <zt-column prop="fq_pfl_qe" label="废气镉排放量(千克)" align="center"></zt-column>
          <zt-column prop="exhgaspro" label="废气铬产生量(千克)" align="center"></zt-column>
          <zt-column prop="exhgasdis" label="废气铬排放量(千克)" align="center"></zt-column>
          <zt-column prop="fq_csl_g" label="废气汞产生量(千克)" align="center"></zt-column>
          <zt-column prop="fq_pfl_g" label="废气汞排放量(千克)" align="center"></zt-column>
          <zt-column prop="fq_csl_eyhl" label="二氧化硫产生量(吨)" align="center"></zt-column>
          <zt-column prop="fq_pfl_eyhl" label="二氧化硫排放量(吨)" align="center"></zt-column>
          <zt-column prop="fq_csl_dyhw" label="氮氧化物产生量(吨)" align="center"></zt-column>
          <zt-column prop="fq_pfl_dyhw" label="氮氧化物排放量(吨)" align="center"></zt-column>
          <zt-column prop="klwcsld" label="颗粒物产生量(吨)" align="center"></zt-column>
          <zt-column prop="klwpfld" label="颗粒物排放量(吨)" align="center"></zt-column>
          <zt-column prop="hfxyjwcslqk" label="挥发性有机物产生量（千克）" align="center"></zt-column>
          <zt-column prop="ffxyjwpflqk" label="挥发性有机物排放量（千克）" align="center"></zt-column>
          <zt-column prop="ammemissionhs" label="氨排放量(吨)(核算结果)" align="center"></zt-column>
          <zt-column prop="fq_csl_shs" label="废气砷产生量(千克)(核算结果)" align="center"></zt-column>
          <zt-column prop="fq_pfl_shs" label="废气砷排放量(千克)(核算结果)" align="center"></zt-column>
          <zt-column prop="fq_csl_qhs" label="废气铅产生量(千克)(核算结果)" align="center"></zt-column>
          <zt-column prop="fq_pfl_qhs" label="废气铅排放量(千克)(核算结果)" align="center"></zt-column>
          <zt-column prop="fq_csl_qehs" label="废气镉产生量(千克)(核算结果)" align="center"></zt-column>
          <zt-column prop="fq_pfl_qehs" label="废气镉排放量(千克)(核算结果)" align="center"></zt-column>
          <zt-column prop="exhgasprohs" label="废气铬产生量(千克)(核算结果)" align="center"></zt-column>
          <zt-column prop="exhgasdishs" label="废气铬排放量(千克)(核算结果)" align="center"></zt-column>
          <zt-column prop="fq_csl_ghs" label="废气汞产生量(千克)(核算结果)" align="center"></zt-column>
          <zt-column prop="fq_pfl_ghs" label="废气汞排放量(千克)(核算结果)" align="center"></zt-column>
          <zt-column prop="unitheader" label="单位负责人" align="center"></zt-column>
          <zt-column prop="statisticalofficerauditor" label="统计负责人(审核人)" align="center"></zt-column>
          <zt-column prop="fillingperson" label="填表人" align="center"></zt-column>
          <zt-column prop="issuedate" label="报出日期" align="center"></zt-column>
        </zt-table>
      </section>
      <!-- 工艺加热炉废气治理与排放 -->
      <section class="table-list mb_15">
        <h3 class="form-item-name">工艺加热炉废气治理与排放情况</h3>
        <zt-table :data="pephfegtemissionList" style="margin-top: 10px;">
          <zt-column prop="heatfurnacenum" label="加热炉编号" align="center"></zt-column>
          <zt-column prop="heatmaterialname" label="加热物料名称" align="center"></zt-column>
          <zt-column prop="heatfurnacescale" label="加热炉规模(兆瓦)" align="center"></zt-column>
          <zt-column prop="thermaleffic" label="热效率" align="center"></zt-column>
          <zt-column prop="avgfurnacetemp" label="炉膛平均温度(℃)" align="center"></zt-column>
          <zt-column prop="proyeartime" label="设计年生产时间（h）" align="center"></zt-column>
          <zt-column prop="fueltypeo" label="燃料一类型" align="center"></zt-column>
          <zt-column prop="fuelconsumptiono" label="燃料一消耗量" align="center"></zt-column>
          <zt-column prop="fuellowcalvalo" label="燃料一低位发热量(千卡/千克或千卡/标准立方米)" align="center"></zt-column>
          <zt-column prop="fuelavgbsulo" label="燃料一平均收到基含硫量" align="center"></zt-column>
          <zt-column prop="fueltypet" label="燃料二类型" align="center"></zt-column>
          <zt-column prop="fuelconsumptiont" label="燃料二消耗量" align="center"></zt-column>
          <zt-column prop="fuellowcalvalt" label="燃料二低位发热量(千卡/千克或千卡/标准立方米)" align="center"></zt-column>
          <zt-column prop="fuelavgbsult" label="燃料二平均收到基含硫量" align="center"></zt-column>
          <zt-column prop="tlssbh" label="脱硫设施编号" align="center"></zt-column>
          <zt-column prop="tlgy1" label="脱硫工艺1" align="center"></zt-column>
          <zt-column prop="tlgy2" label="脱硫工艺2" align="center"></zt-column>
          <zt-column prop="tlgy3" label="脱硫工艺3" align="center"></zt-column>
          <zt-column prop="desueffic" label="脱硫效率(%)" align="center"></zt-column>
          <zt-column prop="desuyearruntime" label="脱硫设施年运行时间(小时)" align="center"></zt-column>
          <zt-column prop="desuname" label="脱硫剂名称" align="center"></zt-column>
          <zt-column prop="desuuse" label="脱硫剂使用量(吨)" align="center"></zt-column>
          <zt-column prop="isusenitro" label="是否采用低氮燃烧技术" align="center"></zt-column>
          <zt-column prop="ccssbh" label="除尘设施编号" align="center"></zt-column>
          <zt-column prop="ccgy1" label="除尘工艺1" align="center"></zt-column>
          <zt-column prop="ccgy2" label="除尘工艺2" align="center"></zt-column>
          <zt-column prop="ccgy3" label="除尘工艺3" align="center"></zt-column>
          <zt-column prop="dustfeffic" label="除尘效率(%)" align="center"></zt-column>
          <zt-column prop="dustyearruntime" label="除尘设施年运行时间(小时)" align="center"></zt-column>
          <zt-column prop="fq_pfl2" label="工业废气排放量(万立方米)" align="center"></zt-column>
          <zt-column prop="fq_csl_eyhl" label="二氧化硫产生量(吨)" align="center"></zt-column>
          <zt-column prop="fq_pfl_eyhl" label="二氧化硫排放量(吨)" align="center"></zt-column>
          <zt-column prop="fq_csl_dyhw" label="氮氧化物产生量(吨)" align="center"></zt-column>
          <zt-column prop="fq_pfl_dyhw" label="氮氧化物排放量(吨)" align="center"></zt-column>
          <zt-column prop="klwcsld" label="颗粒物产生量(吨)" align="center"></zt-column>
          <zt-column prop="klwpfld" label="颗粒物排放量(吨)" align="center"></zt-column>
          <zt-column prop="hfxyjwcslqk" label="挥发性有机物产生量（千克）" align="center"></zt-column>
          <zt-column prop="ffxyjwpflqk" label="挥发性有机物排放量（千克）" align="center"></zt-column>
          <zt-column prop="fq_csl_eyhlhs" label="二氧化硫产生量(吨)(核算结果)" align="center"></zt-column>
          <zt-column prop="fq_pfl_eyhlhs" label="二氧化硫排放量(吨)(核算结果)" align="center"></zt-column>
          <zt-column prop="fq_csl_dyhwhs" label="氮氧化物产生量(吨)(核算结果)" align="center"></zt-column>
          <zt-column prop="fq_pfl_dyhwhs" label="氮氧化物排放量(吨)(核算结果)" align="center"></zt-column>
          <zt-column prop="klwcsldhs" label="颗粒物产生量(吨)(核算结果)" align="center"></zt-column>
          <zt-column prop="klwpfldhs" label="颗粒物排放量(吨)(核算结果)" align="center"></zt-column>
          <zt-column prop="hfxyjwcslqkhs" label="挥发性有机物产生量(千克)(核算结果)" align="center"></zt-column>
          <zt-column prop="ffxyjwpflqkhs" label="挥发性有机物排放量(千克)(核算结果)" align="center"></zt-column>
          <zt-column prop="unitheader" label="单位负责人" align="center"></zt-column>
          <zt-column prop="statisticalofficerauditor" label="统计负责人(审核人)" align="center"></zt-column>
          <zt-column prop="fillingperson" label="填表人" align="center"></zt-column>
          <zt-column prop="issuedate" label="报出日期" align="center"></zt-column>
        </zt-table>
      </section>
      <!-- 生产工艺废气治理与排放 -->
      <section class="table-list mb_15">
        <h3 class="form-item-name">生产工艺废气治理与排放情况</h3>
        <zt-table :data="peppwgtemissionList" style="margin-top: 10px;">
          <zt-column prop="technicscode" label="装置名称" align="center"></zt-column>
          <zt-column prop="xkcodenum" label="装置编号" align="center"></zt-column>
          <zt-column prop="capacity" label="生产能力" align="center"></zt-column>
          <zt-column prop="proyeartime" label="设计年生产时间（h）" align="center"></zt-column>
          <zt-column prop="productname" label="产品名称" align="center"></zt-column>
          <zt-column prop="productsoutput" label="产品产量" align="center"></zt-column>
          <zt-column prop="fluename" label="原料名称" align="center"></zt-column>
          <zt-column prop="flueuse" label="原料用量" align="center"></zt-column>
          <zt-column prop="tlssbh" label="脱硫设施编号" align="center"></zt-column>
          <zt-column prop="tlgy1" label="脱硫工艺1" align="center"></zt-column>
          <zt-column prop="tlgy2" label="脱硫工艺2" align="center"></zt-column>
          <zt-column prop="tlgy3" label="脱硫工艺3" align="center"></zt-column>
          <zt-column prop="desueffic" label="脱硫效率(%)" align="center"></zt-column>
          <zt-column prop="desuyearruntime" label="脱硫设施年运行时间(小时)" align="center"></zt-column>
          <zt-column prop="desuname" label="脱硫剂名称" align="center"></zt-column>
          <zt-column prop="desuuse" label="脱硫剂使用量(吨)" align="center"></zt-column>
          <zt-column prop="tnssbh" label="脱硝设施编号" align="center"></zt-column>
          <zt-column prop="txgy1" label="脱硝工艺1" align="center"></zt-column>
          <zt-column prop="txgy2" label="脱硝工艺2" align="center"></zt-column>
          <zt-column prop="txgy3" label="脱硝工艺3" align="center"></zt-column>
          <zt-column prop="denfeffic" label="脱硝效率(%)" align="center"></zt-column>
          <zt-column prop="denyearruntime" label="脱硝设施年运行时间(小时)" align="center"></zt-column>
          <zt-column prop="denname" label="脱硝剂名称" align="center"></zt-column>
          <zt-column prop="denuse" label="脱硝剂使用量(吨)" align="center"></zt-column>
          <zt-column prop="ccssbh" label="除尘设施编号" align="center"></zt-column>
          <zt-column prop="ccgy1" label="除尘工艺1" align="center"></zt-column>
          <zt-column prop="ccgy2" label="除尘工艺2" align="center"></zt-column>
          <zt-column prop="ccgy3" label="除尘工艺3" align="center"></zt-column>
          <zt-column prop="dustfeffic" label="除尘效率(%)" align="center"></zt-column>
          <zt-column prop="dustyearruntime" label="除尘设施年运行时间(小时)" align="center"></zt-column>
          <zt-column prop="voctreatementfacnum" label="挥发性有机物处理设施编号" align="center"></zt-column>
          <zt-column prop="voctreatement" label="挥发性有机物处理工艺" align="center"></zt-column>
          <zt-column prop="vocremoveeffic" label="挥发性有机物去除效率(%)" align="center"></zt-column>
          <zt-column prop="voctreatefacyruntime" label="挥发性有机物处理设施年运行时间(小时)" align="center"></zt-column>
          <zt-column prop="fq_pfl2" label="工业废气排放量(万立方米)" align="center"></zt-column>
          <zt-column prop="fq_csl_eyhl" label="二氧化硫产生量(吨)" align="center"></zt-column>
          <zt-column prop="fq_pfl_eyhl" label="二氧化硫排放量(吨)" align="center"></zt-column>
          <zt-column prop="fq_csl_dyhw" label="氮氧化物产生量(吨)" align="center"></zt-column>
          <zt-column prop="fq_pfl_dyhw" label="氮氧化物排放量(吨)" align="center"></zt-column>
          <zt-column prop="klwcsld" label="颗粒物产生量(吨)" align="center"></zt-column>
          <zt-column prop="klwpfld" label="颗粒物排放量(吨)" align="center"></zt-column>
          <zt-column prop="hfxyjwcslqk" label="挥发性有机物产生量（千克）" align="center"></zt-column>
          <zt-column prop="ffxyjwpflqk" label="挥发性有机物排放量（千克）" align="center"></zt-column>
          <zt-column prop="ammemission" label="氨排放量(吨)" align="center"></zt-column>
          <zt-column prop="fq_csl_eyhlhs" label="二氧化硫产生量(吨)(核算结果)" align="center"></zt-column>
          <zt-column prop="fq_pfl_eyhlhs" label="二氧化硫排放量(吨)(核算结果)" align="center"></zt-column>
          <zt-column prop="fq_csl_dyhwhs" label="氮氧化物产生量(吨)(核算结果)" align="center"></zt-column>
          <zt-column prop="fq_pfl_dyhwhs" label="氮氧化物排放量(吨)(核算结果)" align="center"></zt-column>
          <zt-column prop="klwcsldhs" label="颗粒物产生量(吨)(核算结果)" align="center"></zt-column>
          <zt-column prop="klwpfldhs" label="颗粒物排放量(吨)(核算结果)" align="center"></zt-column>
          <zt-column prop="hfxyjwcslqkhs" label="挥发性有机物产生量(千克)(核算结果)" align="center"></zt-column>
          <zt-column prop="ffxyjwpflqkhs" label="挥发性有机物排放量(千克)(核算结果)" align="center"></zt-column>
          <zt-column prop="ammemissionhs" label="氨排放量(吨)(核算结果)" align="center"></zt-column>
          <zt-column prop="dsspnum" label="全厂动静密封点个数(个)" align="center"></zt-column>
          <zt-column prop="dssphfxyjwcsl" label="全厂动静密封点挥发性有机物产生量(千克)" align="center"></zt-column>
          <zt-column prop="dssphfxyjwpfl" label="全厂动静密封点挥发性有机物排放量(千克)" align="center"></zt-column>
          <zt-column prop="dssphfxyjwcslhs" label="全厂动静密封点挥发性有机物产生量(千克)(核算结果)" align="center"></zt-column>
          <zt-column prop="dssphfxyjwpflhs" label="全厂动静密封点挥发性有机物排放量(千克)(核算结果)" align="center"></zt-column>
          <zt-column prop="ocwctycircwater" label="敞开式循环水冷却塔年循环水量(立方米)" align="center"></zt-column>
          <zt-column prop="ocwcthfxyjwcsl" label="敞开式循环水冷却塔挥发性有机物产生量(千克)" align="center"></zt-column>
          <zt-column prop="ocwcthfxyjwpfl" label="敞开式循环水冷却塔挥发性有机物排放量(千克)" align="center"></zt-column>
          <zt-column prop="ocwcthfxyjwcslhs" label="敞开式循环水冷却塔挥发性有机物产生量(千克)(核算结果)" align="center"></zt-column>
          <zt-column prop="ocwcthfxyjwpflhs" label="敞开式循环水冷却塔挥发性有机物排放量(千克)(核算结果)" align="center"></zt-column>
          <zt-column prop="unitheader" label="单位负责人" align="center"></zt-column>
          <zt-column prop="statisticalofficerauditor" label="统计负责人(审核人)" align="center"></zt-column>
          <zt-column prop="fillingperson" label="填表人" align="center"></zt-column>
          <zt-column prop="issuedate" label="报出日期" align="center"></zt-column>
        </zt-table>
      </section>
      <!-- 其他废气治理与排放 -->
      <section class="table-list mb_15">
        <h3 class="form-item-name">其他废气治理与排放情况</h3>
        <zt-table :data="ieowgtemissionList" style="margin-top: 10px;">
          <zt-column prop="productnameone" label="产品一名称" align="center"></zt-column>
          <zt-column prop="productoutputone" label="产品一产量" align="center"></zt-column>
          <zt-column prop="productnametwo" label="产品二名称" align="center"></zt-column>
          <zt-column prop="productoutputtwo" label="产品二产量" align="center"></zt-column>
          <zt-column prop="productnamethree" label="产品三名称" align="center"></zt-column>
          <zt-column prop="productoutputthree" label="产品三产量" align="center"></zt-column>
          <zt-column prop="materialnameone" label="原料一名称" align="center"></zt-column>
          <zt-column prop="materialuseone" label="原料一用量" align="center"></zt-column>
          <zt-column prop="materialnametwo" label="原料二名称" align="center"></zt-column>
          <zt-column prop="materialusetwo" label="原料二用量" align="center"></zt-column>
          <zt-column prop="materialnamethree" label="原料三名称" align="center"></zt-column>
          <zt-column prop="materialusethree" label="原料三用量" align="center"></zt-column>
          <zt-column prop="exaholdqua" label="挖掘机保有量(台)" align="center"></zt-column>
          <zt-column prop="bulholdqua" label="推土机保有量(台)" align="center"></zt-column>
          <zt-column prop="loaderholdqua" label="装载机保有量(台)" align="center"></zt-column>
          <zt-column prop="dofholdqua" label="柴油叉车保有量(台)" align="center"></zt-column>
          <zt-column prop="otdomholdqua" label="其他柴油机械保有量(台)" align="center"></zt-column>
          <zt-column prop="doconsumption" label="柴油消耗量(吨)" align="center"></zt-column>
          <zt-column prop="fq_zlsss_tl" label="脱硫设施数（套）" align="center"></zt-column>
          <zt-column prop="fq_zlsss_tx" label="脱硝设施数（套）" align="center"></zt-column>
          <zt-column prop="fq_zlsss_cc" label="除尘设施数（套）" align="center"></zt-column>
          <zt-column prop="fq_zlsss_vocs" label="VOCS处理设施数（套）" align="center"></zt-column>
          <zt-column prop="amtreatfacnum" label="氨治理设施数(套)" align="center"></zt-column>
          <zt-column prop="fq_pfl2" label="工业废气排放量(万立方米)" align="center"></zt-column>
          <zt-column prop="fq_csl_eyhl" label="二氧化硫产生量(吨)" align="center"></zt-column>
          <zt-column prop="fq_csl_eyhlhs" label="二氧化硫产生量(吨)(核算结果)" align="center"></zt-column>
          <zt-column prop="fq_pfl_eyhl" label="二氧化硫排放量(吨)" align="center"></zt-column>
          <zt-column prop="fq_pfl_eyhlhs" label="二氧化硫排放量(吨)(核算结果)" align="center"></zt-column>
          <zt-column prop="fq_csl_dyhw" label="氮氧化物产生量(吨)" align="center"></zt-column>
          <zt-column prop="fq_csl_dyhwhs" label="氮氧化物硫产生量(吨)(核算结果)" align="center"></zt-column>
          <zt-column prop="fq_pfl_dyhw" label="氮氧化物排放量(吨)" align="center"></zt-column>
          <zt-column prop="fq_pfl_dyhwhs" label="氮氧化物排放量(吨)(核算结果)" align="center"></zt-column>
          <zt-column prop="ipmsnoemission" label="其中：厂内移动源氮氧化物排放量(吨)" align="center"></zt-column>
          <zt-column prop="ipmsnoemissionhs" label="其中：厂内移动源氮氧化物排放量(吨)(核算结果)" align="center"></zt-column>
          <zt-column prop="klwcsld" label="颗粒物产生量（吨）" align="center"></zt-column>
          <zt-column prop="klwcsldhs" label="颗粒物产生量(吨)(核算结果)" align="center"></zt-column>
          <zt-column prop="klwpfld" label="颗粒物排放量（吨）" align="center"></zt-column>
          <zt-column prop="klwpfldhs" label="颗粒物排放量(吨)(核算结果)" align="center"></zt-column>
          <zt-column prop="ipmspmemission" label="其中：厂内移动源颗粒物排放量(吨)" align="center"></zt-column>
          <zt-column prop="ipmspmemissionhs" label="其中：厂内移动源颗粒物排放量(吨)(核算结果)" align="center"></zt-column>
          <zt-column prop="hfxyjwcslqk" label="挥发性有机物产生量（千克）" align="center"></zt-column>
          <zt-column prop="hfxyjwcslqkhs" label="挥发性有机物产生量(千克)(核算结果)" align="center"></zt-column>
          <zt-column prop="ffxyjwpflqk" label="挥发性有机物排放量（千克)" align="center"></zt-column>
          <zt-column prop="ffxyjwpflqkhs" label="挥发性有机物排放量(千克)(核算结果)" align="center"></zt-column>
          <zt-column prop="ipmsvocemission" label="其中：厂内移动源挥发性有机物排放量(千克)" align="center"></zt-column>
          <zt-column prop="ipmsvocemissionhs" label="其中：厂内移动源挥发性有机物排放量(千克)(核算结果)" align="center"></zt-column>
          <zt-column prop="ammproduction" label="氨产生量(吨)" align="center"></zt-column>
          <zt-column prop="ammproductionhs" label="氨产生量(吨)(核算结果)" align="center"></zt-column>
          <zt-column prop="ammemission" label="氨排放量(吨)" align="center"></zt-column>
          <zt-column prop="ammemissionhs" label="氨排放量(吨)(核算结果)" align="center"></zt-column>
          <zt-column prop="fq_csl_s" label="废气砷产生量(千克)" align="center"></zt-column>
          <zt-column prop="fq_csl_shs" label="废气砷产生量(千克)(核算结果)" align="center"></zt-column>
          <zt-column prop="fq_pfl_s" label="废气砷排放量(千克)" align="center"></zt-column>
          <zt-column prop="fq_pfl_shs" label="废气砷排放量(千克)(核算结果)" align="center"></zt-column>
          <zt-column prop="fq_csl_q" label="废气铅产生量(千克)" align="center"></zt-column>
          <zt-column prop="fq_csl_qhs" label="废气铅产生量(千克)(核算结果)" align="center"></zt-column>
          <zt-column prop="fq_pfl_q" label="废气铅排放量(千克)" align="center"></zt-column>
          <zt-column prop="fq_pfl_qhs" label="废气铅排放量(千克)(核算结果)" align="center"></zt-column>
          <zt-column prop="fq_csl_qe" label="废气镉产生量(千克)" align="center"></zt-column>
          <zt-column prop="fq_csl_qehs" label="废气镉产生量(千克)(核算结果)" align="center"></zt-column>
          <zt-column prop="fq_pfl_qe" label="废气镉排放量(千克)" align="center"></zt-column>
          <zt-column prop="fq_pfl_qehs" label="废气镉排放量(千克)(核算结果)" align="center"></zt-column>
          <zt-column prop="exhgaspro" label="废气铬产生量(千克)" align="center"></zt-column>
          <zt-column prop="exhgasprohs" label="废气铬产生量(千克)(核算结果)" align="center"></zt-column>
          <zt-column prop="exhgasdis" label="废气铬排放量(千克)" align="center"></zt-column>
          <zt-column prop="exhgasdishs" label="废气铬排放量(千克)(核算结果)" align="center"></zt-column>
          <zt-column prop="fq_csl_g" label="废气汞产生量(千克)" align="center"></zt-column>
          <zt-column prop="fq_csl_ghs" label="废气汞产生量(千克)(核算结果)" align="center"></zt-column>
          <zt-column prop="fq_pfl_g" label="废气汞排放量(千克)" align="center"></zt-column>
          <zt-column prop="fq_pfl_ghs" label="废气汞排放量(千克)(核算结果)" align="center"></zt-column>
        </zt-table>
      </section>
    </div>
  </div>
</template>
<script>
import moment from "moment";
import mixins from "@/mixins";
import sopDetailHttp from "@/https/monitor/sopDetailHttp.js";
export default {
  props: {
    itemData: Object
  },
  data() {
    return {
      iebgtegtemissionList: [], //锅炉燃气轮机废气治理与排放
      iefakegtemissionList: [], //工业企业炉窑废气治理与排放情况
      pephfegtemissionList: [], //工艺加热炉废气治理与排放
      peppwgtemissionList: [], //生产工艺废气治理与排放
      ieowgtemissionList: [] //其他废气治理与排放
    };
  },
  created() {
    this.getIebgtegtemissionData();
    this.getIefakegtemissionData();
    this.getPephfegtemissionData();
    this.getPeppwgtemissionData();
    this.getIeowgtemissionData();
  },
  mounted() {},
  methods: {
    //锅炉燃气轮机废气治理与排放
    getIebgtegtemissionData() {
      let params = {
        pollutionId: this.itemData.id
      };
      sopDetailHttp
        .getIebgtegtemissionData(params)
        .then(result => {
          if (result.code === 0) {
            this.iebgtegtemissionList = result.result.list;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //工业企业炉窑废气治理与排放情况
    getIefakegtemissionData() {
      let params = {
        pollutionId: this.itemData.id
      };
      sopDetailHttp
        .getIefakegtemissionData(params)
        .then(result => {
          if (result.code === 0) {
            this.iefakegtemissionList = result.result.list;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //工艺加热炉废气治理与排放
    getPephfegtemissionData() {
      let params = {
        pollutionId: this.itemData.id
      };
      sopDetailHttp
        .getPephfegtemissionData(params)
        .then(result => {
          if (result.code === 0) {
            this.pephfegtemissionList = result.result.list;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //生产工艺废气治理与排放
    getPeppwgtemissionData() {
      let params = {
        pollutionId: this.itemData.id
      };
      sopDetailHttp
        .getPeppwgtemissionData(params)
        .then(result => {
          if (result.code === 0) {
            this.peppwgtemissionList = result.result.list;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //其他废气治理与排放
    getIeowgtemissionData() {
      let params = {
        pollutionId: this.itemData.id
      };
      sopDetailHttp
        .getIeowgtemissionData(params)
        .then(result => {
          if (result.code === 0) {
            this.ieowgtemissionList = result.result.list;
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
