<style lang="scss" scoped>
.e-upload {
  display: flex;
  flex-wrap: wrap;
  .imgs-wrap {
    padding: 12rpx 24rpx 0 0;
    position: relative;
    .img-wrap {
      width: 120rpx;
      height: 120rpx;
      border-radius: 8rpx;
    }
    .del-wrap {
      position: absolute;
      right: 12rpx;
      top: 0;
      width: 32rpx;
      height: 32rpx;
    }
  }
}
</style>

<template>
  <view class="e-upload">
    <view class="imgs-wrap" v-for="(img, index) in fileList" :key="index">
      <image class="img-wrap" :src="img.resPath" mode="scaleToFill" @click="previewImage(index)"></image>
      <image class="del-wrap" @click="deletePic(index)" src="@/static/icon-img/icon-del.png" mode="widthFix"></image>
    </view>
    <view class="imgs-wrap" v-if="fileList.length < maxCount">
      <image v-if="isUploadImg" @click="addImg" src="@/static/icon-img/icon-add.png" mode="widthFix" style="width: 120rpx; height: 120rpx"></image>
      <image v-else @click="addImg" src="@/static/icon-img/icon-add2.png" mode="widthFix" style="width: 120rpx; height: 120rpx"></image>
    </view>
  </view>
</template>

<script>
import { uploadMutiFileOnlyFile } from '@/service/landcrm'

export default {
  name: 'eUploadByApp',
  props: {
    maxCount: {
      type: Number,
      default: 9
    },
    dValue: {
      default: ''
    },
    isUploadImg: {
      type: Boolean,
      default: false
    },
    projectName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      fileList: []
    }
  },
  watch: {
    dValue: {
      immediate: true,
      handler() {
        if (!this.dValue) {
          this.fileList = []
        } else if (Array.isArray(this.dValue)) {
          this.fileList = []
          this.dValue.forEach((item, index) => {
            let obj = {
              url: item,
              resPath: item,
              index: index
            }
            this.fileList.push(obj)
          })
        }
      }
    }
  },
  methods: {
    addImg() {
      EbeiPlugins.takePhotoWithWaterMark(
        { enabledcamera: true, enabledphoto: true, hideVideo: true, hideVoice: true, projectName:this.projectName },
        (array) => {
          array.forEach((file) => {
            EbeiPlugins.getFileBase64(
              file.bigimageUrl,
              async (img) => {
                const fileName = new Date().getTime() + '.' + file.bigimageUrl.split('.')[1]
                const fileBase64 = 'data:image/' + file.bigimageUrl.split('.')[1] + ';base64,' + img
                let files = [
                  {
                    name: fileName,
                    file: this.convertFile(fileBase64, fileName)
                  }
                ]
                const res = await uploadMutiFileOnlyFile(files)
                const fileInfo = JSON.parse(res.data).fileInfo
                const errorData = JSON.parse(res.data)
                if (!fileInfo) {
                  uni.showToast({ title: errorData.msg, icon: 'none' })
                  return
                }
                this.fileList.push({
                  url: fileInfo.resPath,
                  resPath: fileInfo.resPath,
                  url: fileInfo.resPath,
                  fileId: fileInfo.fid,
                  fileName: fileInfo.fileName
                })
                this.$emit('file-change', this.fileList)
              },
              (error) => {}
            )
          })
        },
        () => {
          // 获取失败
        }
      )
    },
    convertFile(base64, name) {
      let fileArray = base64.split(','),
        // 过滤出文件类型
        fileType = fileArray[0].match(/:(.*?);/)[1],
        // atob 是对经过 base-64 编码的字符串进行解码
        bstr = atob(fileArray[1]),
        n = bstr.length,
        //Uint8Array 数组类型表示一个 8 位无符号整型数组
        u8arr = new Uint8Array(n)
      while (n--) {
        // 返回字符串n个字符的 Unicode 编码
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], name, { type: fileType })
    },
    /**删除图片 */
    deletePic(index) {
      this.fileList.splice(index, 1)
      this.$emit('file-change', this.fileList)
    },
    previewImage(current) {
      // 预览图片
      const files = this.fileList.map((ele) => ele.resPath)
      uni.previewImage({
        current: current,
        urls: files,
        success: () => {},
        fail: (err) => {
          console.log(err.errMsg)
        }
      })
    }
  }
}
</script>
