<template>
  <view class="page-panel" :style="[THEME_CSS_VAR]">
    <view class="model-panel">
      <view class="report-panel">
        <textarea class="report-textarea" v-model="approvalObj.reportContent" placeholder="描述" placeholder-style="color: #CCCCCC; font-size: 28rpx;" />
        <u-upload name="upload" :fileList="approvalObj.fileList" :maxCount="9" previewFullImage sizeType="compressed" @afterRead="afterRead"
          @delete="deleteImg" />
      </view>

      <view class="footer-panel">
        <u-button text="取消" :customStyle="{ margin: '0', borderColor: THEME_COLOR, color: THEME_COLOR, fontSize: '32rpx', borderTopRightRadius: '0', borderBottomRightRadius: '0' }" @click="closePage" />
        <u-button text="提交" type="primary" :disabled="isLoading" :customStyle="{ margin: '0', fontSize: '32rpx', borderTopLeftRadius: '0', borderBottomLeftRadius: '0' }" @click="agreeOrReject" />
      </view>
    </view>
  </view>
</template>

<script>
import approvalStore from './approvalStore'
import { agreeOrReject, uploadMutiFile } from '@/service/landcrm'
import pageRefresh from '@/js/pageRefresh'

/**
 * 审批操作
 * @event updatePage 用来提示页面需要更新操作
 */
export default {
  data() {
    return {
      queryObj: {
        // agress: 同意, reject: 拒绝
        flagText: 'reject',
        // 工单id
        quesTaskId: '',
        // 审批类型
        approvalType: '',
        // 从哪个页面跳转过来的
        fromPage: ''
      },
      approvalObj: {
        reportContent: '',
        fileList: [], // 附件
      },
      isLoading: false, // 禁止按钮重复点击
    }
  },
  created() {
    this.setQuery()
  },
  methods: {
    // 返回 工单详情 页面
    closePage() {
      uni.navigateBack({ delta: 1 })
    },
    // 获取 工单详情 传递过来的数据
    setQuery() {
      this.queryObj.flagText = approvalStore.getData('flagText')
      this.queryObj.quesTaskId = approvalStore.getData('quesTaskId')
      this.queryObj.fromPage = approvalStore.getData('fromPage')
      // 如果是对外回复审批，需要设置默认的对外回复内容
      this.approvalObj.reportContent = approvalStore.getData('externalReply')
    },
    // 同意/拒绝审批
    async agreeOrReject() {
      const validFlag = this.validParams()
      if (!validFlag.success) {
        uni.showToast({
          title: validFlag.message,
          icon: 'none'
        })
        return
      }

      if (this.isLoading) return
      this.isLoading = true

      const { O_USER_INFO } = this.$constant;
      const userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' })
      const fileList = this.approvalObj.fileList.map((item) => item.fid).join(',')
      const params = {
        data: {
          externalReply: this.approvalObj.reportContent, // 对外回复
          quesTaskId: this.queryObj.quesTaskId,
          userId: userInfo.userId,
          Flag: this.queryObj.flagText == 'agress' ? 1 : 0,
          remarks: this.approvalObj.reportContent,
          fileIds: fileList
        },
        hideLoading: true
      }
      const res = await agreeOrReject(params).catch(() => {
        this.isLoading = false
      })
      if (res.resultCode == 200) {
        pageRefresh.setRefresh('WORK_ORDER_APPROVAL')

        if (this.queryObj.fromPage == '/pages-workorder/workorder-detail/detail') {
          // 如果是从 工单详情页面 过来的
          this.closePage()
        } else if (this.queryObj.fromPage == '/pages-workorder/workorder-approval/list') {
          // 如果是从 审批列表 过来的，跳转到详情页面
          uni.redirectTo({ url: `/pages-workorder/workorder-detail/detail?type=approval&taskId=${this.queryObj.quesTaskId}` })
        }

        setTimeout(() => {
          this.isLoading = false
        })
      }
    },
    // 校验数据
    validParams() {
      if (!this.approvalObj.reportContent) return { success: false, message: '请填写审批描述' }
      return { success: true }
    },
    // 上传图片
    async afterRead(evt) {
      const res = await uploadMutiFile({ filePath: evt.file.url, name: 'file' })

      const file = res.fileInfo || {}
      this.approvalObj.fileList.push({ ...file, url: file.resPath })
    },
    // 删除图片
    deleteImg(evt) {
      this.approvalObj.fileList.splice(evt.index, 1)
    },
  }
}
</script>

<style lang="scss" scoped>
.page-panel {
  padding: 24rpx 20rpx;
  min-height: 100vh;
  background-color: #f3f5f9;
  box-sizing: border-box;
}
.model-panel {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #F3F4F7;
}
.footer-panel {
  width: 100%;
  display: flex;
  padding: 60rpx 54rpx;
  box-sizing: border-box;
}
.report-panel {
  background-color: #fff;
  box-sizing: border-box;
  padding: 30rpx;

  .report-textarea {
    width: 100%;
    height: 200rpx;
    padding-bottom: 20rpx;
  }
}
</style>