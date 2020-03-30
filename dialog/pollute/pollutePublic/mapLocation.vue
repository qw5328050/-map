<template>
  <div class="map" id="mapAreaInfo" style="width:100%;height:100%;position: relative;"></div>
</template>
<script>
  import Map from '@/map/js/map'
  import xmap from '@/map/js/xmap/export/xmap'
  import IndustryInfoLayer from '@/map/js/layer/industryInfoLayer'
  import IndustryInfoRangeLayer from '@/map/js/layer/industryInfoRangeLayer'
  export default {
    data() {
      return {
        mapObj: undefined
      }
    },
    props: {
      dataList: {
        type: Array,
        default: () => []
      },
    },
    created() {
    },
    mounted() {
      this.$nextTick(() => {
        this.mapObj = new Map({
          target: 'mapAreaInfo'
        });
        //增加矢量图层
        new IndustryInfoLayer({
          map: this.mapObj,
          name: 'industryInfo',//点
        });
        new IndustryInfoRangeLayer({
          map: this.mapObj,
          name: 'industryInfoRange',//阴影范围
        });
        this.showDataInMap(this.dataList);
        /* this.showDataInMap([{
         name: '1',
         longitude: 117.088838611706,
         latitude: 36.738897095199,
         }, {
         name: '2',
         longitude: 117.048838611706,
         latitude: 36.708897095199,
         }, {
         name: '3',
         longitude: 117.068838611706,
         latitude: 36.688897095199,
         }, {
         name: '4',
         longitude: 117.108838611706,
         latitude: 36.668897095199,
         },])*/
      });
    },
    methods: {
      showDataInMap(dataList){
        if (dataList.length === 0) {
          return;
        }
        dataList.forEach((item, i) => {
          item.id = i.toString()
        });
        //计算得到区域范围点
        const range = xmap.util.getPointerRange(dataList);
        if (range) {
          const newRange = [];
          let disLongitude = range[2] - range[0];
          let disLatitude = range[3] - range[1];
          newRange.push(range[0] - disLongitude / 4);
          newRange.push(range[1] - disLatitude / 4);
          newRange.push(range[2] + disLongitude / 4);
          newRange.push(range[3] + disLatitude / 4);

          let rangeGeometry = [];
          rangeGeometry.push('POLYGON((');
          rangeGeometry.push(newRange[0] + ' ' + newRange[1] + ',');
          rangeGeometry.push(newRange[0] + ' ' + newRange[3] + ',');
          rangeGeometry.push(newRange[2] + ' ' + newRange[3] + ',');
          rangeGeometry.push(newRange[2] + ' ' + newRange[1] + ',');
          rangeGeometry.push(newRange[0] + ' ' + newRange[1]);
          rangeGeometry.push('))');
          const rangeDataList = [];
          rangeDataList.push({
            id: 1,
            geometry: rangeGeometry.join('')
          });
          this.mapObj.showData({
            name: 'industryInfoRange',
            data: rangeDataList
          })
        }
        this.mapObj.showData({
          name: 'industryInfo',
          data: dataList
        });
        if (range) {
          this.mapObj.map.fitExtent(range, {padding: [20, 20, 20, 20]});
        } else {
          this.mapObj.map.setCenter([dataList[0].longitude, dataList[0].latitude]);
        }
      },
    },
    watch: {
      dataList (newV, oldV) {
        this.$nextTick(() => {
          this.showDataInMap(newV);
        });
      }
    }
  }
</script>
