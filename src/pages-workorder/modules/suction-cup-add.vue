<template>
  <view class="suction-cup-add">
    <view class="move-panel">
      <view :class="['add-btn', { 'is-show': isShow }]" id="add-btn" @click="isShow = !isShow">
      </view>
      <view :class="['add-list', { 'is-show': isShow }]">
        <view class="item-panel" @click="handleClick('repair')">
          <u-image src="@/static/theme-default/workorder/icon-order-toolbox.png" mode="aspectFit" shape="circle" width="64rpx" height="64rpx" />
          <text style="font-size: 20rpx; color: #333; padding-top: 8rpx;">工程问题</text>
        </view>
        <view class="item-panel" @click="handleClick('complain')">
          <u-image src="@/static/theme-default/workorder/icon-order-chat.png" mode="aspectFit" shape="circle" width="64rpx" height="64rpx" />
          <text style="font-size: 20rpx; color: #333; padding-top: 8rpx;">客户投诉</text>
        </view>
        <view class="item-panel" @click="handleClick('other')">
          <u-image src="@/static/theme-default/workorder/icon-order-other.png" mode="aspectFit" shape="circle" width="64rpx" height="64rpx" />
          <text style="font-size: 20rpx; color: #333; padding-top: 8rpx;">其他问题</text>
        </view>
      </view>
    </view>

    <yb-complete ref="completeEl" />
  </view>
</template>

<script>
import mpMixin from '@/js/mixin/mpMixin'
import Utils from '@/js/utils'
import YbComplete from '@/components/yb-complete/yb-complete.vue'
import { getOwnerInfoByUserId } from '@/service/wechatguanjia'
import { syncOwnerInfo } from '@/service/api-gateway'
import { getHouseListByOwnerId } from '@/service/neikong'

/**
 * 吸盘-新增工单，用于与客户的会话聊天中，新增当前用户的代客录单
 */
export default {
  name: 'SuctionCupAdd',
  mixins: [mpMixin],
  components: {
    YbComplete
  },
  data() {
    return {
      isShow: false,
      // 屏幕大小
      systemInfo: {
        width: 0,
        height: 0
      },
      // 按钮位置
      btnInfo: {
        width: 0,
        left: 1000,
        top: 1000
      },
      moveInfo: {
        offsetX: 0, // 偏移量
        offsetY: 0
      }
    }
  },
  created() {
    uni.getSystemInfo({
      success: (res) => {
        this.systemInfo.width = res.windowWidth
        this.systemInfo.height = res.windowHeight
      }
    })
  },
  mounted() {
    const query = uni.createSelectorQuery().in(this)
    query.select('#add-btn').boundingClientRect().exec(res => {
      const detail = res[0]
      if (!detail) return

      this.btnInfo.width = detail.width

      // 将按钮定位到右下角
      this.btnInfo.left = this.systemInfo.width - detail.width - 10
      this.btnInfo.top = this.systemInfo.height - detail.height - 50
    })
  },
  computed: {
    getMoveStyle() {}
  },
  methods: {
    onChange(event) {
      const detail = event.detail || {}

      // this.debounceChange(detail)
    },
    debounceChange: Utils.debounce(function(detail) {
      this.moveInfo.left = this.systemInfo.width - this.btnInfo.width
      this.moveInfo.top = detail.y
    }, 400),
    onStart(event) {
      const touches = event.touches[0] || event.changedTouches[0]
      const left = touches.clientX || touches.pageX
      const top = touches.clientY || touches.pageY

      // 计算偏移量
      this.moveInfo.offsetX = left - this.btnInfo.left
      this.moveInfo.offsetY = top - this.btnInfo.top
    },
    onEnd(event) {
      const touches = event.touches[0] || event.changedTouches[0]

      // 固定到距离右边10px的位置
      const left = this.systemInfo.width - this.btnInfo.width - 10
      const top = touches.clientY

      // 设置按钮位置
      this.btnInfo.left = left
      this.btnInfo.top = top - this.moveInfo.offsetY
    },
    async handleClick(type) {
      // 从单聊会话的工具栏进入
      const userId = await this.getCurExternalContact()
      if (!userId) return
      const ownerObj = await this.getOwnerInfo(userId)
      if (!ownerObj) return
      const houseInfoId = await this.getHouseListByOwnerId(ownerObj.ownerId)
      if (!houseInfoId) return

      const params = {
        pageCode: type,
        pageType: 'add',
        houseInfoId,
        ownerPhone: ownerObj.ownerPhone,
        isFromSingleChat:true
      }
      const query = uni.$u.queryParams(params, true)
      uni.navigateTo({
        url: '/pages-a/related-submission/form' + query
      })
    },
    // 获取当前会话的联系人
    getCurExternalContact() {
      // 从单聊会话的工具栏进入
      return new Promise((resolve) => {
        wx.qy.getCurExternalContact({
          success: async (result) => {
            const userId = result.userId // 返回当前外部联系人userId
            resolve(userId)
          },
          fail: (error) => {
            console.log('获取当前会话的联系人', error),
            resolve('')
          }
        })
      })
    },
    // 根据企微外部联系人id获取ownerId
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
      const ownerId = data.ownerId || ''
      const ownerPhone = data.ownerPhone || ''
      if (Utils.isEmpty(ownerId)) {
        this.$refs.completeEl.showMessage('业主未认证，请同步到业主信息再试，或者邀请业主认证后再试')
        return false
      } else {
        return { ownerId, ownerPhone }
      }
    },
    // 根据ownerId获取业主房产信息
    async getHouseListByOwnerId(ownerId) {
      const params = {
        data: {
          pageNum: 1,
          pageSize: 1,
          ownerId
        }
      }
      const res = await getHouseListByOwnerId(params)
      const houseInfoId = res?.data?.records?.[0]?.infoId ?? ''
      if (Utils.isEmpty(houseInfoId)) {
        this.$refs.completeEl.showMessage('业主未认证，请同步到业主信息再试，或者邀请业主认证后再试')
        return ''
      } else {
        return houseInfoId
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.area-panel {
  position: fixed;
  z-index: 0;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
}
.move-panel {
  position: fixed;
  right: 20rpx;
  bottom: 100rpx;
  width: 125.5rpx;
  height: 125.5rpx;
}
.add-btn {
  width: 125.5rpx;
  height: 125.5rpx;
  border-radius: 125.5rpx;
  background-image: url('@/static/theme-default/workorder/icon-order-add.png');
  background-size: 100% 100%;
  transition: all 0.4s ease-out;

  &.is-show {
    transform: rotateZ(45deg);
  }
}
.add-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100rpx;
  padding-top: 28rpx;
  padding-bottom: 55rpx;
  background-color: #fff;
  border-top-left-radius: 100rpx;
  border-top-right-radius: 100rpx;
  box-shadow: 0rpx 0rpx 20rpx rgba(0,0,0,0.1);
  position: absolute;
  z-index: -1;
  bottom: 55rpx;
  left: 13.5rpx;
  transform-origin: bottom;
  transform: scaleY(0);
  transition: all 0.2s ease-out;

  &.is-show {
    transform: scaleY(1);
  }
}
.item-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 0 24rpx;
}
</style>