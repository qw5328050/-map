<template>
  <div>
    <div class="pop-video-box cf">
      <div class="pop-video-item" v-for="(item,index) in playNewVideoList" :key="index">
        <div class="video-wrap noVideo">
          <!--<img src="static/images/video-default.jpg"/>-->
          <!--<hbVideoPlaySmall style="width: 100%;" :id="item.device_id"></hbVideoPlaySmall>-->
          <hbVideoPlay style="width: 100%;" :id="item.id" :na="item.na" :rightPlane="false"
                       :showMaskFlag="item.showMaskFlag"
                       @newPlayVideo="newPlayVideo(item.id, item.status, item.na)"></hbVideoPlay>
          <h3 :class="item.status == 0 ? 'active' : ''"
              style="margin-top: 4px; overflow: hidden;text-overflow: ellipsis;white-space: nowrap;" :title="item.na">
            {{item.na}}</h3>
        </div>
      </div>
      <!--      <div class="pop-video-item" v-for="(item,index) in dataList" :key="index">
              <hbVideoPlay videoSrc="http://21810.liveplay.myqcloud.com/live/21810_ea70a9e139.m3u8"></hbVideoPlay>
            </div>-->
    </div>
    <div class="btnBox mt_20">
      <a :class="hasVideoPlayFlag ? '' : 'hasVideoPlay'" href="javascript:void(0)" class="btn btn-primary btn-sm"
         style="text-align: center;"
         @click="playAllVideo">一键播放</a>
      <a style="padding-left: 10px;font-size: 12px;"
         :href="href">视频插件下载</a>
      <!--<a
         href="./static/plugins/ueditor-1.4.3.3/济大气办发【2019】13号关于印发《济南市镇（街道）2019年2月份环境空气质量（PM10）考核通报》的通知.pdf" target="_blank">视频插件下载</a>-->
    </div>
  </div>
</template>

<script type="text/jsx">
  import hbVideoPlay from '@/components/_public/hbVideoPlay.vue'
  import {getVideoExeHref, getExeLoadDownHref} from '@/utils/index'
  import Constants from "@/utils/Constants"

  export default{
    components: {hbVideoPlay},
    props: {
      playNewVideoList: Array
    },
    mounted(){
      this.getScreenWidthAndHeight();
    },
    data(){
      return {
        dataList: [],
        videoUrlList: [],
        href: getVideoExeHref(),
        hasVideoPlayFlag: false,
        isOnloading: false,
        videoClientHeight: 0,
        videoClientWidth: 0,
        myBrowser: false
      }
    },
    created() {
      this.myBrowserFn()
    },
    methods: {
      // 浏览器宽高
      getScreenWidthAndHeight(){
        this.videoClientHeight = document.body.clientHeight
        this.videoClientWidth = document.body.clientWidth
        console.log(this.videoClientHeight, this.videoClientWidth)
      },
      playAllVideo(){
        var that = this
        var isInstallActive = localStorage.getItem('isInstallActive')
        if (isInstallActive == null || isInstallActive == ' ' || isInstallActive == undefined) {
          this.$ztConfirm({
            message: '为提高视频播放的稳定性和流畅度，请下载安装专用播放插件并安装后再播放视频。',
            title: '视频播放提醒',
            comfirmButtonTxt: '点击下载并安装',
            cancelButtonTxt: '我已安装直接播放',
            cancelCallback: function () {
              localStorage.setItem('isInstallActive', 'true')
              that.playAllVideoFn()
            }
          }).then(() => {
            console.log('111')
            window.location.href = getVideoExeHref()
          })
          return
        } else {
          that.playAllVideoFn()
        }
      },
      // 灰至一键播放按钮
      hasVideoPlay(){
        var that = this
        for (let item of this.playNewVideoList) {
          if (item.status == 1) {
            that.hasVideoPlayFlag = true
          }
        }
      },
      playAllVideoFn(){
        // window.location.href = 'killvideo.exe://'
        console.log('1111')
        var len = this.playNewVideoList.length
        if (len <= 0) {
          return
        }
        var videoPlayList = []
        var canPlauVideoList = []
        for (let item of this.playNewVideoList) {
          if (item.status == 1) {
            videoPlayList.push(item)
          }
        }
        var playLen = videoPlayList.length
        if (playLen > 6) {
          canPlauVideoList = videoPlayList.slice(0, 6)
          this.$ztAlert('一次最多选择6个视频进行播放。')
        } else {
          canPlauVideoList = videoPlayList
        }
        console.log(canPlauVideoList)
        var playList = []
        canPlauVideoList.forEach(function (item, index) {
          playList.push(item.id)
        })
        var videoListString = playList.join(';')
        console.log("videoListString:", videoListString)
        if (videoListString.length == 0) {
          // if(!this.hasVideoPlayFlag) {
          //   return
          // }
          // this.$ztAlert('所选视频均处于离线状态！')
          return
        }
        if (!this.hasVideoPlayFlag) {
          // this.$ztAlert('所选视频均处于离线状态！')
          return
        }
        // window.location.href = `f3://${videoListString},200,100,900,600`
        var exeUrl = getExeLoadDownHref()
        var chineseTranscode
        if (this.myBrowser) {
          chineseTranscode = 'ChineseTranscode:'
        } else {
          chineseTranscode = ''
        }
        var urlLocation = `f3://[ver:${Constants.videoExeVersion}][url:${exeUrl}],${chineseTranscode}${videoListString},${parseInt((this.videoClientWidth) * 0.1)},${parseInt((this.videoClientHeight) * 0.1) + 160},${parseInt((this.videoClientWidth) * 0.8)},${parseInt((this.videoClientHeight) * 0.8)}`

        console.log(urlLocation, parseInt((this.videoClientWidth) * 0.1))
        window.location.href = urlLocation
      },
      closedAllVideo() {
        var that = this
        that.videoUrlList.forEach(function (item, index) {
          monitorHttp.getVideoIdClosed(item.id)
            .then(res => {
              // console.log(1)
            })
        })
        // that.$emit('deleteAllVideo')
        that.videoUrlList = []
      },
      newPlayVideo(id, status, name){
        // console.log(this.isOnloading)
        var that = this
        // if(that.isOnloading) {
        //   that.$ztAlert('视频正在加载中...')
        //   return
        // }
        // that.isOnloading = true
        // setTimeout(function(){
        //   that.isOnloading = false
        // }, 5000)
        if (status !== 1) {
          // this.$ztAlert('当前视频处于离线状态！')
          return
        }
        var isInstallActive = localStorage.getItem('isInstallActive')
        if (isInstallActive == null || isInstallActive == ' ' || isInstallActive == undefined) {
          this.$ztConfirm({
            message: '为提高视频播放的稳定性和流畅度，请下载安装专用播放插件并安装后再播放视频。',
            title: '视频播放提醒',
            comfirmButtonTxt: '点击下载并安装',
            cancelButtonTxt: '我已安装直接播放',
            cancelCallback: function () {
              localStorage.setItem('isInstallActive', 'true')
              // window.location.href = 'killvideo.exe://'
              // window.location.href = `f3://${id},200,100,900,600`
              var exeUrl = getExeLoadDownHref()
              var chineseTranscode
              if (this.myBrowser) {
                chineseTranscode = 'ChineseTranscode:'
              } else {
                chineseTranscode = ''
              }
              var urlLocation = `f3://[ver:${Constants.videoExeVersion}][url:${exeUrl}],${chineseTranscode}${id},${parseInt((this.videoClientWidth) * 0.1)},${parseInt((this.videoClientHeight) * 0.1) + 160},${parseInt((this.videoClientWidth) * 0.8)},${parseInt((this.videoClientHeight) * 0.8)},${name}`

              console.log(urlLocation, parseInt((this.videoClientWidth) * 0.1))
              window.location.href = urlLocation
            }
          }).then(() => {
          }).then(() => {
            console.log('111')
            window.location.href = getVideoExeHref()
          })
          return
        } else {
          // window.location.href = 'f3://killvideo.exe'
          // window.location.href = `f3://${id},200,100,900,600`
          var exeUrl = getExeLoadDownHref()
          var chineseTranscode
          if (this.myBrowser) {
            chineseTranscode = 'ChineseTranscode:'
          } else {
            chineseTranscode = ''
          }
          var urlLocation = `f3://[ver:${Constants.videoExeVersion}][url:${exeUrl}],${chineseTranscode}${id},${parseInt((this.videoClientWidth) * 0.1)},${parseInt((this.videoClientHeight) * 0.1) + 160},${parseInt((this.videoClientWidth) * 0.8)},${parseInt((this.videoClientHeight) * 0.8)},${name}`

          console.log(urlLocation, parseInt((this.videoClientWidth) * 0.1))
          window.location.href = urlLocation
        }

      },
      myBrowserFn(){
        var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
        var isChrome = userAgent.indexOf("Chrome") > -1
          && userAgent.indexOf("Safari") > -1 //判断Chrome浏览器
        console.log('isChrome:', isChrome)
        if (isChrome) {
          this.myBrowser = true
        }
      }
    },
    beforeDestroy() {
      // 当组件销毁之前关闭播放的视频源
      this.closedAllVideo()
    },

  }
</script>
<style scoped>
  h3.active {
    color: #aaa;
  }

  .hasVideoPlay {
    background: #aaa;
    border: 1px solid #aaa;
  }
</style>

