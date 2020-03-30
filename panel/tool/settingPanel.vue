<template>
  <!-- 设置 -->
  <div class="setting-wrapper">
    <!-- 头部区域 -->
    <header class="tool-title">
      <h4>设置</h4>
      <!--<a href="#" class="seeting">设置默认选择</a>-->
      <a href="#" class="iconfont close-tool" @click="emitClose">&#xe601;</a>
    </header>
    <div class="setting">
      <section>
        <div class="widge-title">
          <h3>空气站实时数据频度和指标</h3>
          <div class="form-inline">
            <zt-dict-select
              v-model="model.airSetInfo.frequency"
              :itemCode="constants.air_quality_frequency"
              placeholder="数据频率" @change="()=>singleChange('air','frequency',model.airSetInfo.frequency)">
            </zt-dict-select>
          </div>
        </div>
        <div class="real-data">
          <dl>
            <dt>标站：</dt>
            <dd>
              <div class="form-inline">
                <div class="form-group">
                  <zt-dict-select
                    v-model="model.airSetInfo.bzFactor"
                    :itemCode="constants.air_quality_s1_factor"
                    placeholder="指标" @change="()=>singleChange('air','bzFactor',model.airSetInfo.bzFactor)">
                  </zt-dict-select>
                </div>
              </div>
            </dd>
          </dl>
          <dl>
            <dt>微站：</dt>
            <dd>
              <div class="form-inline">
                <div class="form-group">
                  <zt-dict-select
                    v-model="model.airSetInfo.wzFactor"
                    :itemCode="constants.air_quality_s2_factor"
                    placeholder="指标" @change="()=>singleChange('air','wzFactor',model.airSetInfo.wzFactor)">
                  </zt-dict-select>
                </div>
              </div>
            </dd>
          </dl>
          <dl>
            <dt>走航：</dt>
            <dd>
              <div class="form-inline">
                <div class="form-group">
                  <zt-dict-select
                    v-model="model.airSetInfo.zhFactor"
                    :itemCode="constants.air_quality_s3_factor"
                    placeholder="指标" @change="()=>singleChange('air','zhFactor',model.airSetInfo.zhFactor)">
                  </zt-dict-select>
                </div>
              </div>
            </dd>
          </dl>
        </div>
      </section>
      <section>
        <div class="widge-title">
          <h3>报警消息</h3>
          <div class="form-inline">
            <zt-dict-select
              v-model="model.warnSetInfo.frequency"
              :itemCode="constants.warn_time_frequency"
              placeholder="数据频率" @change="()=>singleChange('warn','frequency',model.warnSetInfo.frequency)">
            </zt-dict-select>
          </div>
        </div>
        <dl>
          <dt>站点：</dt>
          <dd>
            <zt-dict-checkbox
              v-model="model.warnSetInfo.stationType"
              dict-key="warn_station_type"
              code="detailCode"
              label="detailName" @change="()=>singleChange('warn','stationType',model.warnSetInfo.stationType)">
            </zt-dict-checkbox>
          </dd>
        </dl>
        <dl>
          <dt>企业：</dt>
          <dd>
            <zt-dict-checkbox
              v-model="model.warnSetInfo.enterpriseType"
              dict-key="warn_enterprise_type"
              code="detailCode"
              label="detailName"
              @change="()=>singleChange('warn','enterpriseType',model.warnSetInfo.enterpriseType)">
            </zt-dict-checkbox>
          </dd>
        </dl>
      </section>
      <section>
        <div class="widge-title">
          <h3>监管信息</h3>
          <div class="form-inline">
            <zt-dict-select
              v-model="model.superviseSetInfo.frequency"
              :itemCode="constants.grid_time_frequency"
              placeholder="数据频率"
              @change="()=>singleChange('supervise','frequency',model.superviseSetInfo.frequency)">
            </zt-dict-select>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'setting-panel',
    data () {
      return {
        model: {
          airSetInfo: {
            frequency: 'hour', // 数据频率
            bzFactor: 'aqi', // 标站指标
            wzFactor: 'pm10', // 微站指标
            zhFactor: 'pm10' // 走航指标
          },
          warnSetInfo: {
            frequency: 'today', // 数据频率
            stationType: 'jiez', // 站点类型  s1,s2,s3 逗号分隔
            enterpriseType: 'feiq,feis' // 企业类型 s1,s2,s3 逗号分隔
          },
          superviseSetInfo: {
            frequency: '1'  // 数据频率
          }
        }
      }
    },
    mounted(){
      this.$nextTick(() => {
        this.singleChange('', '', '');
      })
    },
    methods: {
      //单个改变
      singleChange(classCode, typeCode, val){
        this.$emit('pickCb', {
          classCode,
          typeCode,
          val,
          model: this.model
        })
      },
      emitClose () {
        this.$emit('close')
      }
    }
  }
</script>

<style scoped>

</style>
