<template>
  <view class="share-attachments" :style="[getCustomStyle]">
    <view style="display: flex; flex-wrap: wrap; margin-bottom: 6px;">
      <!-- 图片，可左右滑动查看切换 -->
      <u-album v-if="getAlbumImgList.length>1" :urls="getAlbumImgList" />
      <template v-if="getAlbumImgList.length == 1">
        <u-image :src="getAlbumImgList[0]" width="70" height="70"  @click="previewImage"></u-image>
      </template>

      <!-- 视频 -->
      <view
        v-for="(item, index) in getVideoList" :key="index"
        class="item-wrapper item-position"
      >
        <!-- <u-icon name="play-right-fill" color="#fff" :size="20" customStyle="position: absolute; z-index: 1; left: 50%; top: 50%; transform: translateX(-50%) translateY(-50%);" /> -->
        <video
          :id="item.data.id" class="item-wrapper" :src="item.data.url"
          controls :show-fullscreen-btn="true" :show-center-play-btn="true"
          :show-play-btn="true" object-fit="fill" :initial-time="item.data.initTime"
        />
      </view>
    </view>
    
    <view style="display: flex; flex-direction: column;">
      <template v-for="(item, index) in stripList">
        <!-- 链接 -->
        <view v-if="item.msgType === 'link'" :key="index" class="strip-wrapper" @click="copyLink(item)">
          <u-image :src="item.data.imgUrl" mode="aspectFill" :width="34" :height="34" :radius="5" customStyle="margin-right: 8px" />
          <text class="link-text">{{ item.data.title || '' }}</text>
        </view>
        <!-- 小程序 -->
        <view v-if="item.msgType === 'miniprogram'" :key="index" class="strip-wrapper" @click="openMiniprogram(item)">
          <u-image src="@/static/theme-default/tasks/miniprogram.png" mode="aspectFill" :width="30" :height="30" :radius="5" customStyle="margin-right: 8px; margin-left: 4px" />
          <text class="link-text">{{ item.data.title + ' 小程序' }}</text>
        </view>
        <!-- 文件 -->
        <view v-if="item.msgType === 'file'" :key="index" class="strip-wrapper" @click="downloadFile(item)">
          <u-icon name="file-text" :size="34" customStyle="margin-right: 8px" />
          <text class="link-text">{{ item.data.name || '' }}</text>
        </view>
      </template>
    </view>
    
    <!-- 图片的显示 -->
    <u-overlay :show="showImage" :opacity="0.8" @click="closeOverlay">
      <view class="image-overlay">
        <image :src="curImage" mode="aspectFit" />
        <u-icon name="close" color="#fff" :size="20" customStyle="position: fixed; top: 10px; right: 10px;" @click="closeOverlay" />
      </view>
    </u-overlay>

    <yb-complete ref="completeEl" />
  </view>
</template>

<script>
import MpMixin from '@/js/mixin/mpMixin'
import YbComplete from '@/components/yb-complete/yb-complete.vue'
import Utils from '@/js/utils'
import { mediaUpload } from '@/service/api-gateway'

/**
 * 小程序分享附件的展示区
 * @event {function} mediaUpload 上传素材到企微
 */
export default {
  name: 'ShareAttachments',
  components: {
    YbComplete
  },
  mixins: [MpMixin],
  props: {
    /**
     * 附件列表
     * [{ msgType: 'image' || 'video' || 'file' || 'link' || 'miniprogram', data: { imgUrl, url, title, name } }]
     */
    data: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      squareList: [], // 展示 image, video
      stripList: [],
      showImage: false,
      curImage: '', // 当前需要展示的图片地址
    }
  },
  computed: {
    // 只筛查出图片，在查看图片时，可以左右滑动切换
    getAlbumImgList() {
      let squareList = this.squareList.filter(item => item.msgType == 'image').map(item => item.data.url)
      // if (squareList.length == 1) {
      //   squareList.push('')
      // }
      console.log('squareList==', squareList)
      return squareList
    },
    // 只筛查出视频
    getVideoList() {
      return this.squareList.filter(item => item.msgType == 'video')
    }
  },
  watch: {
    data: {
      // 数据格式请参考 /pages-tasks/modules/toAttachments.js
      handler(newVal) {
        // 为了展示效果，需要把 image, video 放一列，其他的放另一列
        this.squareList = newVal.filter(item => ['image', 'video'].includes(item.msgType)).map(item => {
          const type = item.msgType
          const data = item.data || {}

          if (type == 'video') {
            // 视频
            return {
              msgType: type,
              data: {
                url: data.url,
                title: data.title,
                id: 'video-' + Utils.uuid(), // id
                showFull: false, // 显示全屏
                showPlayBtn: false, // 显示播放按钮
                initTime: 0, // 初始播放时间
              }
            }
          } else if (type == 'image') {
            return {
              msgType: type,
              data: {
                url: data.url
              }
            }
          }
        })

        const temp = newVal.filter(item => ['link', 'file', 'miniprogram'].includes(item.msgType))
        this.stripList = JSON.parse(JSON.stringify(temp))
        // this.stripList = [
        //   {
        //     msgType: 'link',
        //     data: {
        //       imgUrl: '',
        //       title: '链接'
        //     }
        //   },
        //   {
        //     msgType: 'miniprogram',
        //     data: {
        //       title: '',
        //       imgUrl: '', // 小程序消息封面的URL
        //       appId: 'wxfb0a5d7b3f8d7c43',
        //       page: 'pages/mine/mine.html'
        //     }
        //   },
        //   {
        //     msgType: 'file',
        //     data: {
        //       name: '文件.png'
        //     }
        //   }
        // ]
      },
      immediate: true
    }
  },
  methods: {
    previewImage() {
      uni.previewImage({
        urls: this.getAlbumImgList,
        current: 0,
      })
    },
    // 播放时，打开全屏
    onPlay(item) {
      item.data.showPlayBtn = true
      item.data.showFull = true

      const videoContext = uni.createVideoContext(item.data.id, this)
      videoContext.requestFullScreen()
      videoContext.play()
    },
    // 退出全屏时，暂停播放，初始播放时间设置为0s
    onExistFullScreen(event, item) {
      if (!event.detail.fullScreen) {
        item.data.showPlayBtn = false
        item.data.showFull = false
        item.data.initTime = 0
        const videoContext = uni.createVideoContext(item.data.id, this)
        videoContext.seek(0)
        videoContext.stop()
        videoContext.exitFullScreen()
      }
    },
    // 打开图片显示
    openOverlay(item) {
      this.curImage = item.data.url
      this.showImage = true
    },
    // 关闭图片显示
    closeOverlay() {
      this.showImage = false
      setTimeout(() => {
        this.curImage = ''
      }, 500)
    },
    // 被外部调用，上传素材
    async mediaUpload(data = []) {
      // 过滤出需要上传的素材文件
      const isNeedUploadList = data.filter(item => ['image', 'file', 'video'].includes(item.msgType)).map(item => ({
        name: item.data.name,
        type: item.msgType,
        url: item.data.url
      }))
      // 不需要上传的素材
      const noPromiseArr = data.filter(item => ['link', 'miniprogram'].includes(item.msgType))
      
      // 需要上传的素材
      let promiseArr = []
      if (isNeedUploadList.length) {
        // 注意：这里需要上传到企业微信的素材库，https://developer.work.weixin.qq.com/document/path/90253
        const mediaRes = await mediaUpload({
          data: isNeedUploadList
        })
        // 检查是否全都上传成功
        if (mediaRes.status != 200) {
          // 上传失败
          this.$refs.completeEl.showMessage('上传附件失败，请重新发送')
          return Promise.resolve({ success: false })
        }

        promiseArr = (mediaRes.data || []).map(item => ({
          msgType: item.type,
          data: {
            ...item,
            mediaId: item.mediaId
          }
        }))
      }

      // 转换为微信接口需要的格式，参考：https://developer.work.weixin.qq.com/document/path/93571
      let attachments = []
      noPromiseArr.forEach(item => {
        const type = item.msgType
        const data = item.data

        if (type == 'link') {
          attachments.push({
            msgtype: 'link',
            link: {
              title: data.title || '',
              imgUrl: data.imgUrl || '',
              desc: data.desc || '',
              url: data.url || ''
            }
          })
        } else if (type == 'miniprogram') {
          attachments.push({
            msgtype: 'miniprogram',
            miniprogram: {
              appid: data.appId || '',
              title: data.title || '',
              imgUrl: data.imgUrl || '',
              page: data.page || ''
            }
          })
        }
      })
      promiseArr.forEach(item => {
        const type = item.msgType
        const data = item.data

        if (type == 'image') {
          attachments.push({
            msgtype: 'image',
            image: {
              mediaid: data.mediaId
            }
          })
        } else if (type == 'file') {
          attachments.push({
            msgtype: 'file',
            file: {
              mediaid: data.mediaId
            }
          })
        } else if (type == 'video') {
          attachments.push({
            msgtype: 'video',
            video: {
              mediaid: data.mediaId
            }
          })
        }
      })

      return Promise.resolve({ success: true, data: attachments })
    },
    // 下载文件进行查看
    downloadFile(item) {
      uni.showLoading({title:'加载中'})

      const fileUrl = item.data.url
      const fileName = item.data.name

      if (fileName.includes('.zip')) {
        uni.hideLoading()
        this.$refs.completeEl.showMessage('暂不支持打开zip文件')
        return
      }

      uni.downloadFile({
        url: fileUrl,
        filePath: wx.env.USER_DATA_PATH + '/' + fileName,
        success: res => {
          uni.hideLoading()
          if (res.statusCode != 200) {
            this.$refs.completeEl.showMessage('打开文件失败请重试')
            return
          }

          const extName = res.filePath.split('.').pop()
          uni.openDocument({
            showMenu: true,
            filePath: res.filePath,
            fileType: extName,
            success: () => {
            },
            fail: () => {
              this.$refs.completeEl.showMessage('打开文件失败请重试')
            }
          })
        },
        fail: () => {
          uni.hideLoading()
          this.$refs.completeEl.showMessage('打开文件失败请重试')
        }
      })
    },
    // 复制链接
    copyLink(item) {
      uni.setClipboardData({
        data: item.data.url,
        success: () => {
        }
      })
    },
    // 打开另一个小程序
    openMiniprogram(item) {
      const path = (item.data.page || '').replace(/(\.html)/i, '')

      uni.navigateToMiniProgram({
        appId: item.data.appId,
        path,
        extraData: {},
        success: () => {
        },
        fail: (err) => {
          this.$refs.completeEl.showMessage('打开小程序失败')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.share-attachments {
  display: flex;
  flex-direction: column;
}
.item-wrapper {
  width: 150px;
  height: 150px;
  margin: 0 6px 6px 0;
  border-radius: 5px;
  overflow: hidden;

  &.item-position {
    position: relative;
  }
}
.image-overlay {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;

  image {
    width: 100%;
  }
}
.strip-wrapper {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  background-color: #f3f5f4;
  color: #696d6e;
  border-radius: 5px;
  margin: 0 6px 6px 0;
  padding: 0 8px;
  box-sizing: border-box;

  .link-text {
    flex: 1;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
}
</style>