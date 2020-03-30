<template>
  <!-- 图层 -->
  <div class="layer-wrapper">
    <!-- 头部区域 -->
    <header class="tool-title">
      <h4>图层选择</h4>
      <!--<a href="javascript: void(0);" class="seeting">设置默认选择</a>-->
      <a href="javascript: void(0);" class="iconfont close-tool" @click="emitClose">&#xe601;</a>
    </header>
    <!-- 图层选择 -->
    <zt-scrollbar class="ps" style="width: 370px;"
                  :style="{'max-height': documentClientHeight - 170 + 'px'}">
      <div class="layer">
        <div v-for="classItem in this.layerData">
          <div class="widge-title">
            <h3>{{classItem.name}}</h3>
          </div>
          <dl v-for="typeItem in classItem.childs">
            <dt>{{typeItem.name}}：</dt>
            <dd>
              <label class="list-item" v-for="item in typeItem.childs">
                <zt-checkbox v-model="item.checked"
                             @change="val => emitPickCb(val, item, classItem.code, typeItem.code)" :key="item.code"
                             :label="item.name">{{item.name}}
                </zt-checkbox>
              </label>
            </dd>
          </dl>
        </div>
      </div>
    </zt-scrollbar>
  </div>
</template>

<script>
  import mapHttp from '@/https/map/mapHttp'
  import ZtCheckbox from '@/components/_public/zt/checkbox/checkbox'
  import mixins from '@/mixins/index'
  import mapUtil from '@/map/js/util/mapUtil'

  export default {
    name: 'layer-panel',
    components: {ZtCheckbox},
    props: {
      showShik: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        layerData: [],
        selectedCode: ['xzqy']
      }
    },
    mixins: [mixins],
    created () {
      this.getRegionData()
    },
    methods: {
      showShikPoint(){
        if (this.layerData.length > 0) {
          this.layerData.forEach((classItem) => {
            classItem.childs.forEach((tpyeItem) => {
              tpyeItem.childs.forEach((item) => {
                if (item.code === mapUtil.defaultParams.airCheckedType) {
                  this.$set(item, 'checked', true);
                } else {
                  this.$set(item, 'checked', false);
                }
              })
            })
          });
        }
        this.$nextTick(() => {
          this.emitPickCb('pickCb', {
            code: mapUtil.defaultParams.airCheckedType,
            checked: true,
            name: mapUtil.defaultParams.airCheckedType,
          }, null, null, this.layerData);
        });
      },
      getRegionData () {
        mapHttp.layerPanel().then((result) => {
          let rule = {
            shij (data) {
              return Object.assign(data, {code: 'event'})
            },
            xunc (data) {
              return Object.assign(data, {code: 'patrol'})
            },
            renw (data) {
              return Object.assign(data, {code: 'task'})
            },
          }
          if (result.data) {
            let clickLayer = result.data.filter(v => {
              return v.code == 'dianc'
            })[0]
            clickLayer.childs.forEach(data => {
              if (data.code === 'jiang') {
                data.childs = data.childs.map(v => {
                  return rule[v.code](v)
                })
              }
            })
            result.data.map(v => {
              if (v.code === 'dianc') {
                v = clickLayer
              }
              return v
            })
            this.layerData = result.data
            this.layerData.forEach((classItem) => {
              classItem.childs.forEach((tpyeItem) => {
                tpyeItem.childs.forEach((item) => {
                  if (this.showShik) {
                    if (item.code === mapUtil.defaultParams.airCheckedType) {
                      this.$set(item, 'checked', true);
                    } else {
                      this.$set(item, 'checked', false);
                    }
                  } else {
                    this.$set(item, 'checked', false);
                  }
                })
              })
            });
            if (this.showShik) {
              //触发地图选中时间
              this.$nextTick(() => {
                this.emitPickCb('pickCb', {
                  code: mapUtil.defaultParams.airCheckedType,
                  checked: true,
                  name: mapUtil.defaultParams.airCheckedType,
                }, null, null, this.layerData);
              });
            }
          }
        })
      },
      emitPickCb (val, item, classCode, typeCode) {
        this.$emit('pickCb', item, classCode, typeCode, this.layerData)
      },
      emitClose () {
        this.$emit('close')
      }
    }
  }
</script>
