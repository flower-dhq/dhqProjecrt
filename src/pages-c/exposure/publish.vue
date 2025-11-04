<style lang="scss" scoped>
.interval {
  width: 100%;
  height: 20rpx;
  
}
.publish {
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;  
  background-color: #f6f6f7;
  .label {
    padding-bottom: 20rpx;
    background-color: #fff;
    & > view {
      @include flx-dsp($jsc: center, $ali: center);
      padding: 20rpx 30rpx 0 30rpx;
      display: block;
      font-size: 28rpx;
      & > text:last-child {
        position: relative;
        top: 8rpx;
        color: red;
        margin-left: 10rpx;
      }
    }
  }
  .submit-button{
    width: 700rpx;
    margin: 40rpx auto 20rpx auto;
  }
}
</style>

<template>
  <view class="publish" :style="[THEME_CSS_VAR]">
    <!-- 标题 -->
    <view class="label">
      <view>
        <text>标题</text>
        <text>*</text>
      </view>
      <u--textarea border="none" v-model="title" placeholder="请输入标题" count maxlength="50"></u--textarea>
    </view>
    <view class="interval"></view>
    <!-- 详情 -->
    <view class="label">
      <view>
        <text>详情</text>
        <text>*</text>
      </view>
      <u--textarea border="none" v-model="descr" height="150px" placeholder="请描述具体问题" count maxlength="1000"></u--textarea>
    </view>
    <view class="interval"></view>
    <!-- 图片 -->
    <view class="label">
      <view>
        <text>上传照片</text>
        <text>*</text>
      </view>
      <u-upload name="upload" :fileList="fileList" :maxCount="9" previewFullImage @afterRead="afterRead" @delete="deleteImg" />
    </view>
    <view class="interval"></view>
    <!-- 详情 -->
    <view class="label">
      <view>
        <text>联系电话</text>
        <text></text>
      </view>
      <view class="contact-phone">
        <u--input placeholder="选填" type="number" border="none" v-model="contactPhone"></u--input>
      </view>
    </view>
    <!-- 提交 -->
    <view class="submit-button"><u-button text="提交" type="primary" @click="submit" /></view>
  </view>
</template>

<script>
import util from '@/js/utils';
import { uploadMutiFile } from '@/service/landcrm'
import { saveMiniExposure } from '@/service/wxmanage'
export default {
  data() {
    return {
      title: '',
      descr: '',
      fileList: [],
      contactPhone: '',
    };
  },
  methods: {
    // 上传图片
    afterRead(evt) {
      uploadMutiFile(evt.file.url).then(res => {
        if (res.success) {
          const file = res.fileInfo || {}
          this.fileList.push({...file, url: file.resPath})
        }
      })
    },
    // 删除图片
    deleteImg(evt) {
      this.fileList.splice(evt.index, 1)
    },
    // 提交
    submit() {
      const emptyTitle = this.title.trim() === ''
      const emptyDescr = this.descr.trim() === ''
      const emptyImage = this.fileList.length === 0
      const { MEMBER_ID, AREA_ID, PROJECT_ID, USER_TYPE_NUM} = this.$constant;
      const projectId = util.storageAction({ key: PROJECT_ID, action: 'get' });
      const areaId = util.storageAction({ key: AREA_ID, action: 'get' });
      const memberId = util.storageAction({ key: MEMBER_ID, action: 'get' });
      const num = util.storageAction({ key: USER_TYPE_NUM, action: 'get' });
      const internal = num == 4 && num == 6
      const params = {
        data: {
          projectId,
          areaId,
          memberId,
          phone: this.contactPhone,
          title: this.title,
          detailDesc: this.descr,
          // userType: internal ? 1 : 2,
          fileIds: this.fileList.reduce((prev, item) => prev = `${prev ? `${prev},` : prev}${item.fid}`, '')
        }
      }
      
      if (emptyTitle) return uni.showToast({ title: '标题不能为空', icon: 'none'});
      if (emptyDescr) return uni.showToast({ title: '详情不能为空', icon: 'none'});
      if (emptyImage) return uni.showToast({ title: '请上传照片', icon: 'none'});
      
      saveMiniExposure(params).then(res => {
        if (res.success) {
          uni.navigateTo({url: '/pages-c/exposure/success'})
        }
      })
      
    }
  }
};
</script>
