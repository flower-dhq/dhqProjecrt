<template>
  <view class="page-panel" :style="[THEME_CSS_VAR]">
    <view style="margin: 24rpx 20rpx;">
      <visit-task-sheet :data="visitDetail" :showMenuButton="false" @click="openDetail(visitDetail.visitId)" />
    </view>
    <view class="list-panel">
      <view class="list-title">其他待回访任务</view>
      <view class="list-item-panel" v-for="(item, index) in listData" :key="index">
        <u-checkbox :checked="item.checked" name="1" shape="circle" size="40rpx" customStyle="margin: 24rpx -22rpx 0 20rpx; flex: 0 0 auto; z-index: 1;" @change="checkboxChange(item, $event)" />
        <visit-task-sheet :data="item" :showMenuButton="false" customStyle="padding-left: 0; flex: 1 1 auto;" @click="openDetail(item.visitId)" />
      </view>
    </view>
    
    <view class="placeholder"></view>
    <u-safe-bottom />

    <!-- 底部按钮 -->
    <view class="footer-panel">
      <view class="footer-btn">
        <u-checkbox :checked="allChecked" label="全选" name="all" shape="circle" size="40rpx" labelSize="28rpx" labelColor="#333333" @change="checkboxChange('all', $event)" />
        <view class="footer-right">
          <u-button text="取消" type="primary" plain size="large" customStyle="width: 160rpx; height: 80rpx;" @click="cancelEvent" />
          <u-button text="邀请评价" type="primary" size="large" customStyle="width: 160rpx; height: 80rpx; margin-left: 30rpx;" @click="inviteComment" />
        </view>
      </view>
      <u-safe-bottom />
    </view>
  </view>
</template>

<script>
import VisitTaskSheet from '@/pages-visit/modules/visit-task-sheet.vue'
import { getOtherVisitTaskList, getVisitDetailById } from '@/service/returnVisit'

export default {
  components: {
    VisitTaskSheet
  },
  data() {
    return {
      queryObj: {
        visitId: ''
      },
      visitDetail: {}, // 当前客户的拜访详情
      taskDetail: {},
      listData: [], // 其他待回访任务
      allChecked: false
    }
  },
  onLoad(options) {
    this.queryObj.visitId = options.visitId || ''

    this.getVisitDetail()
    this.getOtherVisitTaskList()
  },
  methods: {
    // 获取回访详情
    async getVisitDetail() {
      const params = {
        data: {
          visitId: this.queryObj.visitId
        }
      }
      const res = await getVisitDetailById(params)
      this.visitDetail = res.data?.[0]??{}
    },
    // 获取该客户下的其他回访
    async getOtherVisitTaskList() {
      const { O_USER_INFO } = this.$constant
      const userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' })
      const params = {
        data: {
          visitId: this.queryObj.visitId,
          userId: userInfo.userId,
          startIndex: 1,
          pageSize: 99999
        }
      }
      const res = await getOtherVisitTaskList(params)

      const dataTmp = res.data?.records ?? []
      this.listData = dataTmp.map(item => ({
        ...item,
        checked: false
      }))
    },
    // 多选事件
    checkboxChange(item, checked) {
      if (item == 'all') {
        // 全选
        this.listData = this.listData.map(item => ({
          ...item,
          checked
        }))
        this.allChecked = checked
      } else {
        item.checked = checked

        const hasFalse = this.listData.some(item => !item.checked)
        this.allChecked = hasFalse ? false : true
      }
    },
    // 发送邀请
    inviteComment() {
      // 如果还有其他回访，则推送工单列表给客户
      const hasOther = this.listData.some(item => item.checked)
      
      // 否则创建群发消息页面，选择客户将问卷发送给客户
      wx.qy.shareToExternalContact({
        text: {
          content: '工单回访',
        },
        attachments: [
          {
            msgtype: 'miniprogram',
            miniprogram: {
              appid: this.$appConfig.OWNER_APPID,
              title: '叮~您有一份问卷调查待填写',
              imgUrl: 'https://saas60.wuyeface.com/qw-online-assets/static/theme-default/common/gdhfQuestion.png',
              page: 'pages-a/repair/returnVisitQuestionnaireDetail.html?visitId=' + this.visitDetail.visitId + '&type=1'
            }
          }
        ]
      })
    },
    cancelEvent() {
      uni.navigateBack({ delta: 1 })
    },
    openDetail(visitId) {
      uni.navigateTo({ url: `/pages-visit/visit-workorder/detail?visitId=${visitId}` })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-panel {
  min-height: 100vh;
  background-color: #f3f5f9;
  box-sizing: border-box;

  &::before {
    content: '';
    height: 1px;
    display: block;
  }
}
.list-panel {
  display: flex;
  flex-direction: column;
  margin: 24rpx 20rpx;
  background-color: #fff;
  border-radius: 12rpx;
}
.list-title {
  width: 100%;
  height: 102rpx;
  font-size: 30rpx;
  font-weight: bold;
  color: #333333;
  line-height: 102rpx;
  padding: 0 30rpx;
  border-bottom: 1px solid #EBEBEB;
  box-sizing: border-box;
}
.list-item-panel {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;

  &:not(:last-child) {
    border-bottom: 1px solid #EBEBEB;
  }
}
.placeholder {
  width: 100%;
  height: 120rpx;
}
.footer-panel {
  width: 100%;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 2;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  box-shadow: 0rpx -2rpx 8rpx #EFF2F6;
}
.footer-btn {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
}
.footer-right {
  display: flex;
}
</style>