<template>
  <view>
    <u-modal :show="errShow" title="提示">
      <view class="slot-content">
        <text>{{ errMessage }}</text>
      </view>
      <view slot="confirmButton">
        <navigator open-type="exit" target="miniProgram" class="close-btn complete">确定</navigator>
      </view>
    </u-modal>
  </view>
</template>

<script>
import Utils from '@/js/utils'
import { getOwnerInfoByUserId } from '@/service/wechatguanjia'
import { syncOwnerInfo } from '@/service/api-gateway'

export default {
  data() {
    return {
      errMessage: '未同步到业主信息',
      errShow: false
    }
  },
  async onLoad(options) {
    const platform = Utils.isPlatform()
    if (platform == 'qy') {
      // 先进行认证登录
      await this.$onLaunched
      let flag = await Utils.toolbarPermissions();
      if(!flag){
         return;
     }
       // 获取当前用户人员的userId   
      wx.qy.getContext({
        success: (res) => {
          if (res.entry == 'single_chat_tools') {
            console.log('单聊进入', res)
            // 从单聊会话的工具栏进入
            wx.qy.getCurExternalContact({
              success: async (result) => {
                const userId = result.userId //返回当前外部联系人userId
                this.getOwnerInfo(userId)
              }
            })
          } else if (res.entry == 'group_chat_tools') {
            // 从群聊会话的工具栏进入 
            wx.qy.getCurExternalChat({
              success: function (res) {
                var chatId = res.chatId //返回当前外部群的群聊ID
                uni.reLaunch({ url: `/pages-archives/owner-document/list?pageType=group&id=${chatId}` })
              }
            })
          } else {
            this.showMessage('该菜单只支持在单聊或群聊中打开')
          }
        },
        fail: () => {
          this.showMessage('该菜单只支持在企业微信中打开')
        }
      })
    }
  },
  methods: {
    async getOwnerInfo(userId) {
      const params = {
        data: {},
        pathParams: `/${userId}`,
        hideLoading: true,
        responseToast: false,
      }
      // 需要先根据企微外部联系人id同步业主信息
      await syncOwnerInfo(userId)
      const res = await getOwnerInfoByUserId(params)
      const data = res.data || {}
      const ownerId = data.ownerId
      if (Utils.isEmpty(ownerId)) {
        this.showMessage('业主未认证，请同步到业主信息再试，或者邀请业主认证后再试')
      } else {
        uni.reLaunch({ url: `/pages-archives/owner-document/detail?type=singleChat&ownerId=${ownerId}` }) 
      }
    },
    // 弹出错误提示
    showMessage(val) {
      this.errMessage = val
      this.errShow = true
    }
  }
}
</script>

<style>
.close-btn {
  text-align: center;
}
</style>