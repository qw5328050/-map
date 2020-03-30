<template>
  <!-- 计数 -->
  <div class="count-wrapper">
    <!-- 头部区域 -->
    <header class="tool-title">
      <h4>计数显示</h4>
      <a href="javascript: void(0);" class="seeting">设置默认选择</a>
      <a href="javascript: void(0);" class="iconfont close-tool" @click="emitClose">&#xe601;</a>
    </header>
    <div class="count">
      <zt-scrollbar class="ps" style="maxHeight: 580px; width: 370px;">
        <div class="layer">
          <div v-for="(classItem,index) in this.countData">
            <div class="widge-title">
              <h3>{{classItem.name}}</h3>
              <div class="form-inline" v-show="index === 0">
                <zt-select v-model="timePriod">
                  <zt-option value="1" label="今天">今天</zt-option>
                  <zt-option value="2" label="24小时">24小时</zt-option>
                  <zt-option value="3" label="本周">本周</zt-option>
                  <zt-option value="4" label="最近7天">最近7天</zt-option>
                  <zt-option value="5" label="本月">本月</zt-option>
                </zt-select>
              </div>
            </div>
            <dl v-for="typeItem in classItem.childs">
              <dt>{{typeItem.name}}：</dt>
              <dd>
                <label class="list-item" v-for="item in typeItem.childs">
                  <zt-checkbox v-model="item.checked" @change="val => emitPickCb(val, item)" :key="item.code"
                               :label="item.name">{{item.name}}
                  </zt-checkbox>
                </label>
              </dd>
            </dl>
          </div>
        </div>
      </zt-scrollbar>
    </div>
  </div>
</template>

<script>
  import mapHttp from '@/https/map/mapHttp'
  import ZtSelect from '@/components/_public/zt/select/select'
  import ZtDictSelect from '@/components/_public/zt/select/dict-select'
  import ZtOption from '@/components/_public/zt/select/option'

  export default {
    name: 'count-panel',
    components: {ZtOption, ZtDictSelect, ZtSelect},
    data () {
      return {
        countData: [],
        timePriod: '1'
      }
    },
    created () {
      this.getCountData()
    },
    methods: {
      getCountData () {
        mapHttp.countPanel().then((result) => {
          if (result.data) {
            this.countData = result.data
            this.countData.forEach((classItem) => {
              classItem.childs.forEach((tpyeItem) => {
                tpyeItem.childs.forEach((item) => {
                  this.$set(item, 'checked', false)
                })
              })
            })
          }
        })
      },
      emitPickCb (val, item) {
        this.$emit('pickCb', item, this.timePriod)
      },
      emitClose () {
        this.$emit('close')
      }
    }
  }
</script>
