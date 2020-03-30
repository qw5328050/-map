<template>
  <div class="result-wrapper" v-if="visible">
    <zt-scrollbar class="ps" :style="{'maxHeight':  documentClientHeight - 280 + 'px'}">
      <ul>
        <li class="result-list" v-for="(item, index) in dataList"
            @mouseenter.stop="addFocus(item)"
            @mouseleave.stop="removeFocus(item)"
            @click="showStationDetail(item)">
        </li>
      </ul>
    </zt-scrollbar>
    <!-- <zt-pagination
        layout="total,prev, pager, next"
        :page-size="pageSize"
        :total="total"
        @change="handlePgChange">
    </zt-pagination> -->
  </div>
</template>
<script>
  import basePanel from '../basePanel'
  import mixins from '@/mixins/index'
  import ztScrollbar from '@/components/_public/zt/scrollbar/scrollbar'
//   import ZtPagination from '@/components/_public/zt/pagination/pagination'

  export default {
    name: 'selectResultPanel',
    components: {
      ztScrollbar
    },
    mixins: [
      basePanel,
      mixins
    ],
    data () {
      return {
        total: 0,
        dataList: []
      }
    },
    inject: ['getMap'],
    methods: {
      init () {
        this.getDataList()
      },
      getDataList () {
        this.dataList = []
      },
      showStationDetail (item) {
        this.$emit('showDetail', item)
      },
      close () {
        this.visible = false
      }
    }

  }
</script>
<style>
</style>
