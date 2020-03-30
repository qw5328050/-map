<template>
  <div class="sub-tab-content">
    <div class="table-list-wrapper">
      <section class="table-list mb_15">
        <h3 class="form-item-name">自行监测要求</h3>
        <table class="table small-padding table-complex table-bordered light-blue-th">
          <thead>
          <tr>
            <th>污染源类别</th>
            <th>排放口编码</th>
            <th>排放口名称</th>
            <th>监测内容</th>
            <th>污染物名称</th>
            <th>监测设施</th>
            <th>自动监测是否联网</th>
            <th>自动监测仪器名称</th>
            <th>自动监测设施是否符合安装、运行、维护等管理需求</th>
            <th>手工监测采样方法及个数</th>
            <th>手工监测频次</th>
            <th>手工测定方法</th>
            <th>其他信息</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="loadingOne&&requireList&&requireList.length==0">
            <td class="al_center" colspan="13">{{constants.no_data_text}}</td>
          </tr>
          <tr v-for="(item,index) in requireList">
            <td v-if="showLevel(item, 'type')" :rowspan="item.typeLevel">{{item.type}}</td>
            <td v-if="showLevel(item, 'xkdraincode')" :rowspan="item.codeLevel">{{item.xkdraincode}}</td>
            <td v-if="showLevel(item, 'drainname')" :rowspan="item.codeLevel">{{item.drainname}}</td>
            <td v-if="showLevel(item, 'content')" :rowspan="item.contentLevel">{{item.content}}</td>
            <td>{{item.wrwname}}</td>
            <td>{{item.monitorFacilities}}</td>
            <td>{{item.islinkscode}}</td>
            <td>{{item.instrument}}</td>
            <td>{{item.issafe}}</td>
            <td>{{item.qtmonitorsampname}}</td>
            <td>{{item.qtmonitorfreqname}}</td>
            <td>{{item.testmethodname}}</td>
            <td>{{item.otherInformation}}</td>
          </tr>
          </tbody>
        </table>
      </section>
      <section class="table-list mb_15">
        <h3 class="form-item-name">环境管理台账记录要求</h3>
        <table class="table small-padding table-complex table-bordered light-blue-th">
          <thead>
          <tr>
            <th>类别</th>
            <th>记录内容</th>
            <th>记录频次</th>
            <th>记录形式</th>
            <th>其他信息</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="loadingOne&&solidWasteList&&solidWasteList.length==0">
            <td class="al_center" colspan="13">{{constants.no_data_text}}</td>
          </tr>
          <tr v-for="(item,index) in recordList">
            <td>{{item.type}}</td>
            <td>{{item.content}}</td>
            <td>{{item.frequency}}</td>
            <td>{{item.form}}</td>
            <td>{{item.elseInfo}}</td>
          </tr>
          </tbody>
        </table>
      </section>
      <!--<section class="table-list mb_15">-->
        <!--<h3 class="form-item-name">执行（守法）报告</h3>-->
        <!--<table class="table small-padding table-complex table-bordered light-blue-th">-->
          <!--<thead>-->
          <!--<tr>-->
            <!--<th>序号</th>-->
            <!--<th>主要内容</th>-->
            <!--<th>上报频次</th>-->
            <!--<th>其他信息</th>-->
          <!--</tr>-->
          <!--</thead>-->
          <!--<tbody>-->
          <!--<tr v-if="loadingOne&&solidWasteList&&solidWasteList.length==0">-->
            <!--<td class="al_center" colspan="13">{{constants.no_data_text}}</td>-->
          <!--</tr>-->
          <!--<tr v-for="(item,index) in recordList">-->
            <!--<td>{{item.type}}</td>-->
            <!--<td>{{item.content}}</td>-->
            <!--<td>{{item.frequency}}</td>-->
            <!--<td>{{item.form}}</td>-->
            <!--<td>{{item.elseInfo}}</td>-->
          <!--</tr>-->
          <!--</tbody>-->
        <!--</table>-->
      <!--</section>-->
      <section class="table-list mb_15">
        <h3 class="form-item-name">执行（守法）报告</h3>
        <table class="table small-padding table-complex table-bordered light-blue-th">
          <thead>
          <tr>
            <th style="width:25%;">序号</th>
            <th style="width:25%;">主要内容</th>
            <th style="width:25%;">上报频次</th>
            <th style="width:25%;">其他信息</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="loadingOne&&enforceList&&enforceList.length==0">
            <td class="al_center" colspan="13">{{constants.no_data_text}}</td>
          </tr>
          <tr v-for="(item,index) in enforceList">
            <td>{{index + 1}}</td>
            <td>{{item.content}}</td>
            <td>{{item.frequency}}</td>
            <td>{{item.elseInfo}}</td>
          </tr>
          </tbody>
        </table>
      </section>
      <section class="table-list mb_15">
        <h3 class="form-item-name">环境管理台账-信息公开</h3>
        <table class="table small-padding table-complex table-bordered light-blue-th">
          <thead>
          <tr>
            <th style="width:20%;">序号</th>
            <th style="width:20%;">公开方式</th>
            <th style="width:20%;">时间节点</th>
            <th style="width:20%;">公开内容</th>
            <th style="width:20%;">其他信息</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="loadingOne&&disclosureList&&disclosureList.length==0">
            <td class="al_center" colspan="13">{{constants.no_data_text}}</td>
          </tr>
          <tr v-for="(item,index) in disclosureList">
            <td>{{index + 1}}</td>
            <td>{{item.way}}</td>
            <td>{{item.timeNode}}</td>
            <td>{{item.content}}</td>
            <td>{{item.elseInfo}}</td>
          </tr>
          </tbody>
        </table>
      </section>
    </div>
  </div>
</template>
<script>
  import mapPollutePublicHttp from '@/https/map/mapPollutePublicHttp'
  export default {
    data() {
      return {
        loadingOne: false,
        loadingTwo: false,
        requireList: [],
        recordList: [],
        enforceList: [],
        disclosureList: [],
      }
    },
    props: {
      permitId: String,
    },
    created() {

    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        this.getRequireList();
        this.getRecordList();
        this.getEnforceList();
        this.getDisclosureList();
      },
      changeInit(id) {
        this.permitId = id
        this.init();
      },
      getRequireList(){
        mapPollutePublicHttp.getRequireList(this.permitId).then((result) => {
          if(result.result&&result.result.length>0){
            let data = result.result
            if (data.length > 0) {
              data = this.handleRequireList(result.result);
            }
            this.requireList = data
          }
          this.loadingOne = true;
        }).catch((error) => {
          this.loadingOne = true;
        })
      },
      getRecordList(){
        mapPollutePublicHttp.getRecordList(this.permitId).then((result) => {
          if(result.result&&result.result.length>0){
            this.recordList = result.result;
          }
          this.loadingTwo = true;
        }).catch((error) => {
          this.loadingTwo = true;
        })
      },
      getEnforceList() {
        mapPollutePublicHttp.getEnforceList(this.permitId).then((result) => {
          if(result.result&&result.result.length>0){
            this.enforceList = result.result;
          }
          this.loadingOne = true;
        }).catch((error) => {
          this.loadingOne = true;
        })
      },
      getDisclosureList() {
        mapPollutePublicHttp.getDisclosureList(this.permitId).then((result) => {
          if(result.result&&result.result.length>0){
            this.disclosureList = result.result;
          }
          this.loadingOne = true;
        }).catch((error) => {
          this.loadingOne = true;
        })
      },
      handleRequireList(data) {
        let resultList = [];
        data.forEach((v, index) => {
          let obj = {}
          if (index === 0 || v.type !== data[index - 1].type) {
            obj = v
            obj.typeLevel = index
            obj.codeLevel = index
            obj.contentLevel = index
          } else {
            if (v.xkdraincode !== data[index - 1].xkdraincode) {
              Object.keys(v).forEach(key => {
                if (key !== 'type') {
                  obj[key] = v[key]
                }
              })
              obj.codeLevel = index
            } else {
              if (v.content !== data[index - 1].content) {
                Object.keys(v).forEach(key => {
                  if (key !== 'type' && key !== 'xkdraincode' && key !== 'drainname' ) {
                    obj[key] = v[key]
                  }
                })
                obj.contentLevel = index
              } else {
                Object.keys(v).forEach(key => {
                  if (key !== 'type' && key !== 'xkdraincode' && key !== 'drainname'&& key !== 'content' ) {
                    obj[key] = v[key]
                  }
                })
              }
            }
          }
          resultList.push(obj)
        })
        this.handleLevel(resultList, 'typeLevel')
        this.handleLevel(resultList, 'codeLevel')
        this.handleLevel(resultList, 'contentLevel')
        return resultList
      },
      handleLevel (resultList, type) {
        let idx = 0;
        let level = resultList.filter(v => {
          return v.hasOwnProperty(type)
        }).map(v => {
          return v[type]
        })
        level.push(data.length)
        level = level.map((v, index) => {
          if (level[index + 1]) {
            return level[index + 1] - v
          }
        })
        level.pop()
        resultList = resultList.map(v => {
          if (v.hasOwnProperty(type)) {
            v[type] = level[idx]
            idx += 1
          }
          return v
        })
      },
      showLevel(val, type) {
        return val.hasOwnProperty(type)
      }
      // recursion (ruleData, obj, current, data, rule, index) {
      // let rule = [
      //   {
      //     type: 'type',
      //     arr: ['type', 'xkdraincode', 'drainname', 'typeLevel'],
      //     end: false,
      //     judge (v, data, index) {
      //       return index === 0 || v.type !== data[index - 1].type
      //     }
      //   },
      //   {
      //     type: 'xkdraincode',
      //     arr: ['content', 'codeLevel'],
      //     end: false,
      //     judge (v, data, index) {
      //       return v.xkdraincode !== data[index - 1].xkdraincode
      //     }
      //   },
      //   {
      //     type: 'content',
      //     arr: ['type', 'xkdraincode', 'drainname', 'typeLevel'],
      //     end: true,
      //     judge (v, data, index) {
      //       return v.content !== data[index - 1].content
      //     }
      //   },
      // ]
      //   let idx = 0;
      //   if (ruleData.end) {
      //     obj.wrwname = parentValue.wrwname
      //   } else {
      //     if (ruleData.judge(current, data, index)) {
      //       ruleData.arr.forEach(v => {
      //         obj[v] = data[v]
      //       })
      //     } else {
      //       idx += 1
      //       recursion(rule[idx], obj, current, data, rule, index)
      //     }
      //   }
      // }
    },
    watch: {
      permitId (val) {
        console.log(val)
      }
    },
    computed:{

    }
  }
</script>
<style type="text/css">
</style>
