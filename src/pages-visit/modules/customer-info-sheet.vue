<template>
  <view class="customer-info-sheet">
    <cell-text :label="data.roomInfo" isRight isDesc labelWidth="auto" labelStyle="font-size: 30rpx; color: #333; font-weight: bold; flex: 1 1 auto;" padding="24rpx 30rpx 16rpx">
      <text slot="right" :style="{color: THEME_COLOR, fontSize: '28rpx'}">{{ data.visitState | getVisitStatus }}</text>
      <text slot="desc" style="font-size: 28rpx; color: #666; margin-top: 6rpx;">{{ data.visitTaskName }}</text>
    </cell-text>
    <view class="desc-tag-panel">
      <u--text prefixIcon="phone" text="联系客户" type="primary" size="28rpx" align="center" :iconStyle="{fontSize: '34rpx', color: THEME_COLOR, marginRight: '12rpx'}" @click="openUserModal" />
      <u--text :prefixIcon="require(`@/static/${THEME_NAME}/workorder/icon-chat.png`)" text="发起会话" type="primary" size="28rpx" align="center" :iconStyle="{fontSize: '34rpx', color: THEME_COLOR, marginRight: '12rpx'}" @click="openChat" />
    </view>

    <!-- 根据房间id显示所有的联系人 -->
    <room-user-list :show.sync="userModalShow" :userList="userList" @change="userChange" />
    <u-modal :show="ownerModal.isShow" title="提示" :content="ownerModal.message" confirmText="选择联系人" showCancelButton @confirm="chooseExternal" @cancel="ownerModal.isShow = false" />
    <u-toast ref="messageEl" />
  </view>
</template>

<script>
import CellText from '@/components/cell-text.vue'
import RoomUserList from '@/pages-visit/modules/room-user-list.vue'
import { getQYInfoByOwnerId, syncOwnerInfo } from '@/service/api-gateway'
import { getUserListByRoom } from '@/service/landcrm'

/**
 * 客户拜访的填写拜访信息的房间信息
 * @event userList
 * @param {Array} userList 该房间下的所有联系人
 */
export default {
  name: 'Customer-info-sheet',
  components: {
    CellText,
    RoomUserList
  },
  props: {
    // 拜访任务详情
    data: {
      type: Object,
      default: () => ({})
    },
    // 房间id
    houseInfoId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      userModalShow: false, // 是否显示选择联系人
      ownerModal: {
        isShow: false,
        message: '未添加业主为外部联系人，暂无法发起会话，您可选择其他联系人发起'
      },
      // 联系人数据
      userList: [],
      curOptType: 'callPhone', // 当前操作。callPhone是打电话。openChat是打开会话
    }
  },
  filters: {
    getVisitStatus(val) {
      const map = {
        0: '未拜访',
        1: '已拜访'
      }
      return map[val] || map[0]
    }
  },
  watch: {
    houseInfoId(newVal) {
      if (!newVal) return
      this.getUserListByRoom(newVal)
    }
  },
  methods: {
    openUserModal() {
      // 如果没有业主，则直接提示
      if (this.userList.length == 0) {
        this.$refs.messageEl.show({
          type: 'default',
          message: '房间无业主'
        })
        return
      }

      // 如果只有一个联系人，则无需弹窗
      if (this.userList.length == 1) {
        this.curOptType = 'callPhone'
        this.userChange(this.userList[0])
        return
      }

      // 弹出选择联系人窗口
      this.curOptType = 'callPhone'
      this.userModalShow = true
    },
    // 获取房间下的所有联系人
    async getUserListByRoom() {
      const params = {
        data: {
          houseInfoId: this.houseInfoId, // 房间id
        }
      }
      const res = await getUserListByRoom(params)
      this.userList = (res.data || []).filter(item => item.regName && item.ownerCalls)
      this.$emit('userList', this.userList)
    },
    // 当前选择的哪个客户
    userChange(item) {
      if (this.curOptType == 'callPhone') {
        // 打电话
        this.callPhone(item)
      } else if (this.curOptType == 'openChat') {
        // 打开会话
        this.userModalShow = false
        this.openQwChat(item.ownerId)
      }
    },
    // 电话联系客户
    callPhone(item) {
      this.userModalShow = false

      if (item.ownerCalls) {
        wx.makePhoneCall({
          phoneNumber: item.ownerCalls,
          success() {
            console.log("拨打电话成功！")
          },
          fail() {
            console.log("拨打电话失败！")
          }
        })
      } else {
        this.$refs.messageEl.show({
          type: 'default',
          message: `${item.regName}的手机号为空`
        })
      }
    },
    // 发起会话
    async openChat() {
      if (this.userList.length == 0) {
        // 没有业主时
        this.$refs.messageEl.show({
          type: 'default',
          message: '房间无业主'
        })
        return
      } else if (this.userList.length == 1) {
        // 只有一个业主时，直接打开该业主的会话聊天
        const ownerId = this.userList[0].ownerId || ''
        this.openQwChat(ownerId)
        return
      } else {
        // 弹出选择联系人
        this.curOptType = 'openChat'
        this.userModalShow = true
      }
    },
    // 选择外部联系人（客户）
    chooseExternal() {
      wx.qy.selectExternalContact({
        filterType: 0,
        success: (res) => {
          const data = res.userIds || []
          // 客户id
          const userItem = data[0] || ''
          this.ownerModal.isShow = false

          wx.qy.openEnterpriseChat({
            externalUserIds: userItem,
            success: (res) => {
            }
          })
        }
      })
    },
    // 发起会话操作
    async openQwChat(ownerId) {
      // 获取反馈人在企微上的信息
      const res = await getQYInfoByOwnerId(ownerId)
      const data = res.data || {}
      if (!data.userId) {
        // 如果不存在外部联系人id，可以自己选择外部联系人进行会话
        this.ownerModal.message = '未添加业主为外部联系人，暂无法发起会话，您可选择其他联系人发起'
        this.ownerModal.isShow = true
        return
      }

      // 需要先根据外部联系人id同步企微外部联系人信息
      await syncOwnerInfo(data.userId)
      // 打开与客户的单聊会话，这里只会存在与客户的会话，不会存在与员工的会话
      wx.qy.openEnterpriseChat({
        externalUserIds: data.userId,
        success: (res) => {}
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.customer-info-sheet {
  background-color: #fff;
  font-size: 30rpx;
  border-radius: 12rpx;
}
.desc-tag-panel {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 20rpx 0;
}
</style>