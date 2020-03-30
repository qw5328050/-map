<template>
  <div v-zt-dialog-drag>
    <div class="comparison zt-drag-dialog">
      <div style="width:265px;" v-show="showChoosePanel">
        <table>
            <tr style="height:30px;">
            <td style="padding-top:5px;padding-left:5px;padding-bottom:5px;">辐射安全许可证</td>
            <td style="padding-top:5px;padding-left:5px;padding-bottom:5px;">是否录入监管系统</td>
            <td style="padding-top:5px;padding-left:5px;padding-bottom:5px;">备注</td>                   
            </tr>
            <tr style="height:30px;">
            <td style="padding-top:5px;padding-left:5px;padding-bottom:5px;">{{item.radSafelicense}}</td>
            <td style="padding-top:5px;padding-left:5px;padding-bottom:5px;">{{item.sflrjgxt}}</td>
            <td style="padding-top:5px;padding-left:5px;padding-bottom:5px;">{{item.bz}}</td>                    
            </tr>
        </table> 
      </div>
    </div>
  </div>
</template>
<script>

  export default {
    data () {
      return {
        showChoosePanel: false, 
        item: {}       
      }
    },
    methods: {
      show (item){
        this.showChoosePanel = true
        this.item = item
      },
      hide () {
        this.showChoosePanel = false
      }
    }
  }
</script>
<style>

</style>
