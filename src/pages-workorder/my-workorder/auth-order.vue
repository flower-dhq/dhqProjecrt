<template>
  <view :style="[THEME_CSS_VAR]">
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
      errMessage: '',
      errShow: false
    }
  },
  async onLoad() {
    uni.showLoading()

    const platform = Utils.isPlatform();
    if (platform == 'qy') {
      // 先进行登录认证 
      await this.$onLaunched
      let flag = await Utils.toolbarPermissions();
      if(!flag) {
        uni.hideLoading()
        return
      }

      wx.qy.getContext({
        success: (res) => {
          console.log('业户工单===', res)
          if (res.entry != 'single_chat_tools') {
            uni.hideLoading()
            this.showMessage('该菜单只支持在单聊中打开')
          } else {
            wx.qy.getCurExternalContact({
              success: (res) => {
                const userId = res.userId //返回当前外部联系人userId
                this.getOwnerInfo(userId)
              },
              fail: (e) => {
                console.log('业户工单报错===', e)
                uni.hideLoading()
              }
            })
          }
        },
        fail: () => {
          uni.hideLoading()
          this.showMessage('该菜单只支持在企业微信中打开')
        }
      })
    }
  },
  methods: {
    // 根据员工id获取业主信息
    async getOwnerInfo(userId) {
      const params = {
        data: {},
        pathParams: `/${userId}`,
        hideLoading: true,
        responseToast: false,
      }
      // 需要先根据员工id同步业主信息
      await syncOwnerInfo(userId)
      const res = await getOwnerInfoByUserId(params)
      const data = res.data || {}
      uni.hideLoading()
      if (data.ownerId) {
        const query = uni.$u.queryParams({
          pageType: 'singleChat',
          ownerId: data.ownerId || ''
        })
        uni.redirectTo({ url: '/pages-workorder/my-workorder/list' + query })
      } else {
        this.showMessage('业主未认证，请同步到业主信息再试，或者邀请业主认证后再试')
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

<style lang="scss" scoped>
.close-btn {
  text-align: center;
}
</style>