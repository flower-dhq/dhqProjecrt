<style lang="scss" scoped>
.e-upload {
  border-radius: 8rpx;
  overflow: hidden;
  ::v-deep .u-upload__success {
    display: none;
  }
}
.upload-icon {
  background-color: #f4f5f7; 
  width: 120rpx; 
  height: 120rpx; 
  border-radius: 4rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

<template>
  <view class="e-upload">
    <u-upload :fileList="fileList" deletable @afterRead="uploadPic" @delete="deletePic" :maxCount="maxCount" previewFullImage width="120rpx" height="120rpx">
      <image v-if="isUploadImg" src="@/static/icon-img/icon-add.png" mode="widthFix" style="width: 120rpx; height: 120rpx"></image>
      <!-- <image v-else src="@/static/icon-img/icon-add2.png" mode="widthFix" style="width: 120rpx; height: 120rpx"></image> -->
       <view class="upload-icon" v-else>
         <u-icon  name="camera" color="#c7c7c7" size="32"></u-icon>
       </view>
    </u-upload>
  </view>
</template>

<script>
import { uploadMutiFile, uploadMutiFileOnlyFile, uploadMutiFileOnlyFile2 } from '@/service/landcrm'
import { base64ToPath } from './image-tools.js'

export default {
  name: 'e-upload',
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
			immediate:true,
      handler() {
        if (!this.dValue) {
          this.fileList = []
        }else if(Array.isArray(this.dValue)){
					this.fileList=[];
					this.dValue.forEach((item,index)=>{
						let obj={
							url:item,
							resPath:item,
							index:index,
						};
						 this.fileList.push(obj);
					})
				}
      }
    }
  },
  methods: {
    // 上传图片
    async uploadPic(event) {
      uni.navigateTo({
        url: '/pages-order/editor/imageEditor?thumb=' + event.file.thumb + '&projectName=' + this.projectName,
        events: {
          imgEvent: async (path) => {
            let file = {
              ...event.file,
              status: 'uploading',
              message: '上传中'
            }
            let res = {}
            if (path.includes('blob:')) {
              this.fileList.push(file)
              res = await uploadMutiFile(path)
                        console.log(res,111)
            } else {
              base64ToPath(path)
                .then((thumb) => {
                  file.thumb = thumb
                  file.url = thumb
                  this.fileList.push(file)
                })
                .catch((error) => {
                  this.fileList.push(file)
                })
              let params = {}
              const { uniPlatform } = uni.getSystemInfoSync();
              const mpWx = uniPlatform === 'mp-weixin';  
              if (mpWx) {
                params = {
                  filePath: path,
                  name: path.split('.').pop()
                }
              } else {
                params =  {
                  files:  [
                    {
                      name: file.name,
                      file: this.convertFile(path, file.name)
                    }
                  ],
                  name: 'file'
                }
              }  
             
              res = await uploadMutiFileOnlyFile2(params)
                        console.log(res,222)
            }

            if (!res.fileInfo) {
              uni.showToast({ title: msg.msg, icon: 'none' })
              this.fileList.pop()
              return
            }
            const Idx = this.fileList.findIndex((ele2) => ele2.thumb === file.thumb)
            this.fileList.splice(Idx, 1, {
              ...this.fileList[Idx],
              ...res.fileInfo,
              fileId: res.fileInfo.fid,
              status: 'success',
              message: ''
            })
            console.log(this.fileList)
            this.$emit('file-change', this.fileList)
          }
        }
      })
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
      // return new Blob([u8arr], { type: fileType })
      return new File([u8arr], name, { type: fileType })
    },
    /**删除图片 */
    deletePic(event) {
      this.fileList.splice(event.index, 1)
      this.$emit('file-change', this.fileList)
    }
  }
}
</script>
