<template>
  <div ref="tab" style="overflow: hidden;margin: 0;width:100%;position:relative;border-bottom:1px solid #e9eaec;">
    <!-- <div
      ref="tabUl"
      class="tab-boder no-bg flex-start sub-tab"
      :style="'left: '+offsetLeft+'px;overflow:visible;margin-bottom:0;'"
    >
      <div  class="tab-item"  :class="{'cur':showModel==item[itemValue]}" v-for="item in tabList" @click="handelTabClick(item)">
          {{item[itemName]}}
      </div>
    </div> -->

    <!-- tab -->
    <div class="tab-wrapper">
        <ul class="nav nav-line">
            <li 
                @click="handelTabClick(item)"
                v-for="(item, index) in tabList"
                :class="{'active': showModel==item[itemValue]}"
                :key="index"
            >
                <a href="javascript:void(0);">{{item[itemName]}}</a>
            </li>
        </ul>
    </div>

    <!-- <div class="tab-more" style="top:8px;" v-show="showBtn || showBtnTwo">
      <a href="javascript:void(0);" class="tab-forward" @click="tabMoveLeft">
        <span class="iconfont">&#xe882;</span>
      </a>
      <a href="javascript:void(0);" class="tab-backward" @click="tabMoveRight">
        <span class="iconfont">&#xe617;</span>
      </a>
    </div> -->
  </div>
</template>
<script>
export default {
  props: {
    tabList: {
      type: Array,
      default: () => []
    },
    itemName: String,
    itemValue: String,
    showBtnTwo: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      offsetLeft: 0,
      tabBoxWidth: 0,
      tabUlWidth:0,
      showModel: 'base',
      showBtn:false
    };
  },
  created() {},
  mounted() {
    let that = this;
    that.$nextTick(() => {
      that.tabBoxWidth = that.$refs.tab.clientWidth - 36;
    });
  },
  methods: {
    handelTabClick(item){
      this.showModel = item[this.itemValue];
      this.$emit('tabClick',item);
    },
    computeTabWidth(){
      let $tabUL = this.$refs.tabUl;
      let $childs = $tabUL.childNodes;
      let childWidth = 0;
      for (let i = $childs.length - 1; i >= 0; i--) {
        let $child = $childs[i];
        childWidth += $child.offsetWidth;
      }
      return childWidth;
    },
    tabMoveLeft() {
      if (this.offsetLeft == 0) return;
      let $tabUL = this.$refs.tabUl;
      let $childs = $tabUL.childNodes;
      let childWidth = 0;
      for (let i = $childs.length - 1; i >= 0; i--) {
        let $child = $childs[i];
        if ($child.offsetLeft + this.offsetLeft < 0) {
          childWidth += $child.offsetWidth;
          if (childWidth > this.tabBoxWidth) {
            this.offsetLeft = -$child.offsetLeft - $child.offsetWidth;
            break;
          }
        }
      }
      if (childWidth <= this.tabBoxWidth) {
        this.offsetLeft = 0;
      }
    },
    clearOffsetLeft(){
      this.offsetLeft = 0
    },
    tabMoveRight() {
      let $tabUL = this.$refs.tabUl;
      let $childs = $tabUL.childNodes;
      let childWidth = 0;
      let leftPreChild;
      for (let i = 0; i < $childs.length; i++) {
        let $child = $childs[i];
        if ($child.offsetLeft + this.offsetLeft >= 0) {
          childWidth += $child.offsetWidth;
          if (childWidth > this.tabBoxWidth) {
            this.offsetLeft = -$child.offsetLeft;
            break;
          }
        }
      }
    }
  },
  watch:{
      tabList:{
        handler (newV, oldV) {
          if (newV && newV.length > 0) {
            this.$nextTick(() => {
              this.showBtn = this.computeTabWidth() > this.tabBoxWidth;
            });
            let firstItem =newV[0];
            this.handelTabClick(firstItem)

            //this.showModel = firstItem[this.itemValue];
          }
        },
        deep:true
      }
    }
};
</script>

<style lang="less" scoped>
.nav-line{
  li{
    &.active{
      font-weight: bold;
    }
    a{
      margin-right: 0;
    }
  }
}
</style>