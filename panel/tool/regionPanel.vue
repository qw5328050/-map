<template>
  <!-- 区域 -->
  <div class="region-wrapper">
    <!-- 头部区域 -->
    <header class="tool-title">
      <h4>当前：{{curDivision.divisionName}}</h4>
      <!--<a href="javascript: void(0);" class="seeting">设置默认选择</a>-->
      <a href="javascript: void(0);" class="iconfont close-tool" @click="emitClose">&#xe601;</a>
    </header>
    <div class="region">
      <!-- 地区tab页 -->
      <div class="region-tabs">
        <span class="tab-item"
              :class="{'cur': curDivision.divisionCode === regionData.divisionCode}"
              @click="emitPickCb(regionData)">
          {{regionData.divisionName}}
        </span>

        <span class="tab-item"
              v-for="item in regionData.child"
              :class="{'cur': curDivision.divisionCode === item.divisionCode}"
              @click="emitPickCb(item)">
          {{item.divisionName}}
        </span>

      </div>
      <!-- 地区子类 -->
      <zt-scrollbar class="ps" style="width: 370px;"
                    :style="{'max-height': documentClientHeight - 260 + 'px'}">
        <div class="region-sub">
          <dl v-for="item in regionData.child">
            <dt>{{item.divisionName}}：</dt>
            <dd>
            <span class="sub-item"
                  v-for="subItem in item.child"
                  :class="{'cur': curDivision.divisionCode === subItem.divisionCode}"
                  @click="emitPickCb(subItem)">
              {{subItem.divisionName}}
            </span>
            </dd>
          </dl>
        </div>
      </zt-scrollbar>
    </div>
  </div>
</template>

<script>
  import mapHttp from '@/https/map/mapHttp'
  import {deepClone} from '@/utils/util'
  import mixins from '@/mixins'
  import {getQueryHash} from '@/utils'

  export default {
    name: 'region-panel',
    data () {
      return {
        regionData: {},
        curDivision: {}
      }
    },
    created () {
      this.getRegionData()
    },
    mixins: [mixins],
    methods: {
      getRegionData () {
        mapHttp.divisionPanel().then((result) => {
          if (result.data) {
            this.curDivision = this.regionData = result.data[0]
            let type = getQueryHash('type');
            if (!type) {
              this.emitPickCb(this.curDivision)
            } else {
              this.$parent.curDivisionName = this.curDivision.divisionName;
            }
          }
        })
      },
      emitPickCb (val) {
        let obj = deepClone(val)
        delete obj.child

        this.curDivision = obj

        this.$emit('pickCb', obj)
        this.emitClose()
      },
      emitClose () {
        this.$emit('close')
      }
    }
  }
</script>
