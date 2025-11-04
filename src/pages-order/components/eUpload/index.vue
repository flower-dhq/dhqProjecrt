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
    <u-upload :fileList="fileList" deletable @afterRead="afterRead" @delete="deletePic" :maxCount="maxCount" previewFullImage width="120rpx" height="120rpx">
      <image v-if="isUploadImg" src="@/static/icon-img/icon-add.png" mode="widthFix" style="width: 120rpx; height: 120rpx"></image>
      <!-- <image v-else src="@/static/icon-img/icon-add2.png" mode="widthFix" style="width: 120rpx; height: 120rpx"></image> -->
      <view class="upload-icon" v-else>
        <u-icon name="camera" color="#c7c7c7" size="32"></u-icon>
      </view>
    </u-upload>
  </view>
</template>

<script>
import { uploadMutiFile, uploadMutiFileOnlyFile, uploadMutiFileOnlyFile2 } from "@/service/landcrm";
import { base64ToPath } from "./image-tools.js";
import commLogic from "@/js/comm-logic";

export default {
  name: "e-upload",
  props: {
    maxCount: {
      type: Number,
      default: 9,
    },
    dValue: {
      default: "",
    },
    isUploadImg: {
      type: Boolean,
      default: false,
    },
    projectName: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      fileList: [],
    };
  },
  watch: {
    dValue: {
      immediate: true,
      handler() {
        if (!this.dValue) {
          this.fileList = [];
        } else if (Array.isArray(this.dValue)) {
          this.fileList = [];
          this.dValue.forEach((item, index) => {
            let obj = {
              url: item,
              resPath: item,
              index: index,
            };
            this.fileList.push(obj);
          });
        }
      },
    },
  },
  methods: {
    beforeRead(data) {
      console.log("beforeRead", data);
    },
    // 上传图片
    async afterRead(event, index) {
      // 当设置 multiple 为 true 时, file 为数组格式，否则为对象格式
      console.log("afterRead", event);
      const { code } = await commLogic.permissionCheckAndAlert({ permissionKeys: ["camera", "readStorage"] });
      if (code !== 1 && code !== -2) {
        return;
      }
      let lists = [].concat(event.file);
      let fileListLen = this[`fileList${event.name}`].length;
      lists.map((item) => {
        this[`fileList${event.name}`].push({
          ...item,
          status: "uploading",
          message: "上传中",
        });
      });
      for (let i = 0; i < lists.length; i++) {
        const result = await this.uploadFilePromise(lists[i].url);
        console.log("result", result);
        let item = this[`fileList${event.name}`][fileListLen];
        this[`fileList${event.name}`].splice(
          fileListLen,
          1,
          {
            ...item,
            ...result,
            status: "success",
            message: "",
          }
        );
        fileListLen++;
      }
      console.log("this.fileList", this.fileList);
      this.$emit("file-change", this.fileList);
    },
    uploadFilePromise(url) {
      return new Promise((resolve, reject) => {
        const res = uploadMutiFile(url).then((res) => {
          const fileInfo = res.fileInfo;
          if (!fileInfo) {
            uni.showToast({ title: res.msg, icon: "none" });
            reject();
          } else {
            resolve(fileInfo);
          }
        });
      });
    },
    /**删除图片 */
    deletePic(event) {
      this.fileList = this.fileList.filter((item) => item.fid !== event.file.fid);
      this.$emit("file-change", this.fileList);
    },
  },
};
</script>
