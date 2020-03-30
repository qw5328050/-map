<template>
  <ul class="nav nav-line factor">
    <li  :class="{active:item.type==curType}"
         v-for="item in dataList" @click="handleTabClick(item)" class="tab-item">
      <a href="javascript:void(0)">{{item.name}}</a>
    </li>
  </ul>
</template>

<script type="text/jsx">
  export default {
    props: {
      dataList: Array
    },
    data(){
      return {
        curType: ''
      }
    },
    watch: {
      dataList(newValue){
        this.curType = newValue[0].type;
      }
    },
    mounted(){
    },
    methods: {
      handleTabClick(item){
        this.curType = item.type;
        this.$emit('change', item);
      }
    }
  }
</script>

