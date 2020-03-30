<template>
  <dt v-if="data.level==='level1'" @click="handleClick">
    <span class="circle" :class="{'cur': selectedTime===data.allName }"></span>
    <span class="hover-tips" :class="{'cur': selectedTime===data.allName }">{{data.name}}</span>
    <span class="date">{{data.label}}</span>
  </dt>
  <dd v-else @click="handleClick">
    <span class="rec" :class="{'cur': selectedTime===data.allName }"></span>
    <span class="hover-tips" :class="{'cur': selectedTime===data.allName }">{{data.label}}</span>
  </dd>
</template>

<script type="text/jsx">
  export default {
    props: {
      data: Object,
      selectedTime: String
    },
    methods: {
      handleClick(){
        this.$emit('click', this.data);
      }
    }
  }
</script>
