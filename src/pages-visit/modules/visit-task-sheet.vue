<template>
  <view :class="['visit-task-sheet', getCustomClass]" :style="[getCustomStyle]" @click.stop="click">
    <view class="sheet-title-wrap">
      <!-- 问题描述 -->
      <view class="title-desc">{{ data.quesDesc }}</view>
      <!-- 工单状态 -->
      <text class="task-state">{{ getVisitState }}</text>
    </view>
    <view class="sheet-content-wrap">
      <!-- 姓名，联系电话 -->
      <text style="margin-bottom: 6rpx;">{{ data.ownerName }} | {{ data.ownerTel }}</text>
      <!-- 楼栋地址 -->
      <text>{{ data.buildingLocation }}</text>
    </view>
    <view class="sheet-footer-wrap">
      <text class="footer-time">{{ data.createDate }}</text>
      <view class="sheet-footer-right" v-if="showMenuButton && data.visitStateNum == '1'">
        <!-- 只有待回访，才需要 发起会话 和 邀请评价 -->
        <u--text
          :prefixIcon="require(`@/static/${THEME_NAME}/workorder/icon-chat.png`)"
          text="发起会话" type="primary" size="28rpx"
          :iconStyle="{fontSize: '32rpx', color: THEME_COLOR, marginRight: '4px'}"
          align="center" @click.native.stop="openChat"
        />
        <yb-tag
          text="邀请评价" size="medium" type="primary"
          :customStyle="{width: '140rpx', height: '60rpx', padding: '0', borderRadius: '8rpx', fontSize: '26rpx', lineHeight: '1', backgroundColor: THEME_COLOR, borderColor: THEME_COLOR, marginLeft: '48rpx'}"
          @click.native.stop="inviteComment"
        />
      </view>
    </view>
  </view>
</template>

<script>
import mpMixin from '@/js/mixin/mpMixin'
import { getOtherVisitTaskList } from '@/service/returnVisit'
import { getQYInfoByOwnerId, syncOwnerInfo } from '@/service/api-gateway'

/**
 * 工单回访
 * @property {Object} data 数据
 * @property {Boolean} showMenuButton 默认true。是否显示菜单按钮
 * @event chatEvent 参数：isShow: Boolean。是否显示会话的弹窗提示
 * @event click 参数data数据。点击事件
 */
export default {
  name: 'VisitTaskSheet',
  mixins: [mpMixin],
  props: {
    data: {
      type: Object,
      default: () => ({})
    },
    showMenuButton: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
    }
  },
  computed: {
    // 获取回访状态
    getVisitState() {
      const map = {
        1: '待回访',
        2: '成功回访',
        3: '不成功回访',
        4: '无需回访',
        5: '回访中',
        6: '已生成回访',
        7: '回访超时关闭'
      }
      if (this.data.visitStateNum == 3 && this.data.is_over == 1) {
        return map[7]
      } else {
        return map[this.data.visitStateNum] || map[3]
      }
    }
  },
  methods: {
    click() {
      this.$emit('click', this.data)
    },
    // 发起会话
    async openChat() {
      const ownerId = this.data.ownerId || '' // 反馈人业主id
      if (!ownerId) {
        // 业主没有开通业主端（一般不存在，因为新建工单可以选择当前业主客户，就证明已经注册过业主端了）
        this.$emit('chatEvent', true)
        return
      }

      const res = await getQYInfoByOwnerId(ownerId) // 获取反馈人在企微上的信息
      const data = res.data || {}
      if (!data.userId) {
        // 如果不存在外部联系人id
        this.$emit('chatEvent', true)
        return
      }

      // 需要先根据外部联系人id同步企微外部联系人信息
      await syncOwnerInfo(data.userId)
      // 打开与客户的单聊会话
      wx.qy.openEnterpriseChat({
        externalUserIds: data.userId,
        success: (res) => {}
      })
    },
    // 选择外部联系人（客户）
    chooseExternal() {
      wx.qy.selectExternalContact({
        filterType: 0,
        success: (res) => {
          const data = res.userIds || []
          // 客户id
          const userItem = data[0] || ''
          this.$emit('chatEvent', false)

          wx.qy.openEnterpriseChat({
            externalUserIds: userItem,
            success: (res) => {
            }
          })
        }
      })
    },
    // 邀请评价
    async inviteComment() {
      const hasOther = await this.getOtherVisitTaskList()
      if (hasOther) {
        // 如果还有其他回访，则跳转到 选择工单回访 页面
        uni.navigateTo({ url: '/pages-visit/visit-workorder/choose?visitId=' + this.data.visitId })
      } else {
        // const orderId = this.data.taskDetail

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
                page: 'pages-a/repair/returnVisitQuestionnaireDetail.html?visitId=' + this.data.visitId + '&type=1'
              }
            }
          ]
        })
      }
    },
    // 判断该客户是否有其他回访
    async getOtherVisitTaskList() {
      const { O_USER_INFO } = this.$constant
      const userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' })
      const params = {
        data: {
          visitId: this.data.visitId, // 这里绑定了客户id
          userId: userInfo.userId,
          startIndex: 1,
          pageSize: 1
        }
      }
      const res = await getOtherVisitTaskList(params)

      const dataTmp = res.data?.total ?? 0 // 是否存在其他回访
      return dataTmp > 0
    },
  }
}
</script>

<style lang="scss" scoped>
.visit-task-sheet {
  @include flx-dsp(flex-start, flex-start, column);
  background-color: #fff;
  border-radius: 10rpx;
  font-family: "PingFang SC";
  box-sizing: border-box;
}
.sheet-title-wrap {
  @include flx-dsp(flex-start, flex-start);
  box-sizing: border-box;
  width: 100%;
  padding: 24rpx 30rpx;
  
  .title-desc {
    flex: 1 1 auto;
    @include ellipsis(2);
    font-weight: bold;
		font-size: 30rpx;
		line-height: 40rpx;
    color: #222;
  }
  .task-state {
    flex: 0 0 auto;
    color: var(--app-primary-color);
    padding-left: 40rpx;
		font-size: 28rpx;
		max-width: 180rpx;
		text-align: right;
  }
}
.sheet-content-wrap {
  @include flx-dsp(flex-start, flex-start, column);
  box-sizing: border-box;
  width: 100%;
  font-size: 28rpx;
  padding: 0rpx 30rpx 16rpx;
  color: #666666;
  line-height: 44rpx;
  border-bottom: 1px solid #EAEAEA;
}
.sheet-footer-wrap {
  @include flx-dsp(space-between, center);
  box-sizing: border-box;
  width: 100%;
  padding: 28rpx 21rpx 28rpx 30rpx;

  .footer-time {
    color: #999999;
    font-size: 26rpx;
  }
}
.sheet-footer-right {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>