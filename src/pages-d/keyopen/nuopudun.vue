<template>
  <view class="page-panel" :class="[THEME_NAME]" :style="[THEME_CSS_VAR, {backgroundImage: `url('${require('@/static/aKeyOpenDoor/open_door.png')}')`}]">
    <view class="header-panel">
      <image :src="require('@/static/aKeyOpenDoor/open_door_bluetooth.png')" style="width: 40rpx; height: 40rpx; margin-right: 20rpx;" />
      请连接蓝牙一键开门哦～
    </view>
    <view class="btn-panel">
      <view class="btn-watermark-1" />
      <view class="btn-watermark-2" />
      <view class="btn--text" @click="handleOpenDoor">点击开门</view>
    </view>

    <!-- 蓝牙授权 -->
    <u-modal :show="isShowAuth">
      <u--text text="蓝牙开门需要获取您的公开信息（昵称、头像等）" align="center" customStyle="text-align: center;" />
      <u-button slot="confirmButton" open-type="getUserInfo" lang="zh_CN" type="primary" text="去获取" @getuserinfo="initNpd" />
    </u-modal>
    <u-modal :show="modalObj.isShow" :content="modalObj.content" closeOnClickOverlay @confirm="modalObj.isShow = false" @close="modalObj.isShow = false" />
  </view>
</template>

<script>
import npd from '@/js/sdk/npd'
import Util from '@/js/utils'
import dingdongMp3 from '@/static/dingdong.mp3'
import { getDeviceData } from './deviceStorage'
import { insertAccessDeviceLog } from '@/service/community'

/**
 * 诺普顿开门
 */
export default {
  data() {
    this.audioEl = null

    return {
      isShowAuth: false,
      modalObj: {
        isShow: false,
        content: '提示'
      },
      deviceObj: {
        deviceId: '',
        deviceName: '',
        deviceVendor: '',
        address: '',
        key: '',
        mac: '',
        projectId: '',
        projectName: ''
      }
    }
  },
  onLoad() {
    this.deviceObj = getDeviceData()
    this.initNpd()
  },
  onPullDownRefresh() {
    this.initNpd()
    uni.stopPullDownRefresh()
  },
  methods: {
    async handleOpenDoor() {
      // 开门铃声
      if (!this.audioEl) {
        this.audioEl = uni.createInnerAudioContext()
        this.audioEl.src = dingdongMp3
      }
      this.audioEl.play()

      const obRes = await this.openBluetooth()
      if (!obRes.success) return

      const sdRes = await this.scaleDevice()
      if (!sdRes.success) return

      await this.openLockByKey(sdRes.data)
    },
    // 初始化诺普顿蓝牙
    initNpd() {
      this.isShowAuth = false

      return new Promise((resolve) => {
        const openTime = uni.$u.timeFormat(new Date(), 'yyy-mm-dd hh:MM:ss')

        npd.init(this, (error) => {
          if (error) {
            if (error.errCode == 1008) {
              this.isShowAuth = true
              resolve({ success: false })
              return
            }
            
            this.saveDoorLog(false, openTime, `蓝牙初始化失败，errCode：${error.errCode}，errMsg：${error.errMsg}`)
            this.openModal('初始化失败，确认您的蓝牙是否已打开，请重新下拉刷新')
            resolve({ success: false })
            return
          }

          resolve({ success: true })
        })
      })
    },
    // 打开蓝牙
    openBluetooth() {
      return new Promise((resolve) => {
        const openTime = uni.$u.timeFormat(new Date(), 'yyy-mm-dd hh:MM:ss')

        uni.openBluetoothAdapter({
          success: () => {
            console.log('启动蓝牙适配器成功')
            resolve({ success: true })
          },
          fail: (error) => {
            this.saveDoorLog(false, openTime, `启动蓝牙适配失败，errorCode：${error.errCode}，errMsg：${error.errMsg}`)
            this.openModal('亲，请确认您的蓝牙是否已打开，并保持在2米范围内')
            resolve({ success: false })
          }
        })
      })
    },
    // 扫描设备
    scaleDevice() {
      return new Promise((resolve) => {
        npd.startScanCustom(500, (error, devices) => {
          if (error) {
            this.openModal('亲，请确认您的蓝牙是否已打开，并保持在2米范围内')
            resolve({ success: false })
            return
          }

          console.log('【npd.startScanCustom】扫码到的蓝牙设备：', devices)
          const doorKeyItem = (devices || []).filter(item => item.mac.toLowerCase() === this.deviceObj.mac.toLowerCase())
          if (doorKeyItem.length) {
            resolve({ success: true, data: doorKeyItem[0] })
          } else {
            this.openModal('没识别到有效设备')
            resolve({ success: false })
          }
        })
      })
    },
    // 开门
    openLockByKey(doorKey) {
      return new Promise((resolve) => {
        const openTime = uni.$u.timeFormat(new Date(), 'yyy-mm-dd hh:MM:ss')

        npd.openLockByKey(doorKey, this.deviceObj.key, (error) => {
          if (error) {
            this.saveDoorLog(false, openTime, `开门失败，errCode：${error.errCode}，errMsg：${error.errMsg}`)
            this.openModal('开门失败')
            resolve({ success: false })
            return
          }

          this.saveDoorLog(true, openTime, `开门成功`)
          this.openModal('开门成功')
          resolve({ success: true })
        })
      })
    },
    // 开门日志
    saveDoorLog(isSuccess, openTime, logDesc) {
      const createDate = uni.$u.timeFormat(new Date(), 'yyy-mm-dd hh:MM:ss')
      const { O_USER_INFO } = this.$constant
      const userInfo = Util.storageAction({ key: O_USER_INFO, action: 'get' })
      const userName = this.deviceObj.ownerName || userInfo?.fullName || userInfo?.memberName || ''
      const nickName = userInfo?.nickname || userInfo?.wxUserName || ''
      const telephone = userInfo?.phoneNumber ?? ''
      const ownerId = userInfo?.ownerId ?? ''

      const params = {
        data: {
          deviceId: this.deviceObj.deviceId,
          deviceType: 1, // 1: 蓝牙; 2: 网络; 3: 二维码
          createDate,
          openTime, // 开门时间
          whetherSuccess: isSuccess ? 1 : 0, // 是否开门成功
          type: 1, // 1: 业主； 2: 访客
          newOwnerInfoId: ownerId,
          userName,
          nickName,
          telephone,
          address: this.deviceObj.address,
          projectId: this.deviceObj.projectId,
          projectName: this.deviceObj.projectName,
          logDesc
        }
      }
      insertAccessDeviceLog(Object.assign(params, this.deviceObj))
    },
    openModal(content = '') {
      this.modalObj.content = content || ''
      this.modalObj.isShow = true
    },
  }
}
</script>

<style lang="scss" scoped>
.page-panel {
  width: 100vw;
  height: 100vh;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  position: relative;
}
.header-panel {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 120rpx;
  font-size: 36rpx;
  color: #fff;
}
.btn-panel {
  position: absolute;
  bottom: 310rpx;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 296rpx;
  height: 296rpx;
}

@mixin btn-watermark($size) {
  width: $size;
  height: $size;
  border-radius: $size;
  border: 1px solid #fff;
  position: absolute;
  box-sizing: border-box;
}
.btn-watermark-1 {
  @include btn-watermark(296rpx);
  animation: btn-watermark-1-flashing 1s infinite linear;
}
.btn-watermark-2 {
  @include btn-watermark(236rpx);
  animation: btn-watermark-2-flashing 1s infinite linear;
}
.btn--text {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 176rpx;
  height: 176rpx;
  background-color: #fff;
  border-radius: 176rpx;
  color: var(--app-primary-color);
  font-size: 36rpx;
  box-sizing: border-box;
  padding: 0 40rpx;
  text-align: center;
  animation: btn-flashing 1s infinite linear;
}
@mixin flashing($scale, $opacity) {
  transform: scale($scale);
  opacity: $opacity;
}
@keyframes btn-watermark-1-flashing {
  0%{
    @include flashing(1, 0.6);
  }
  50%{
    @include flashing(1.2, 0);
  }
  100%{
    @include flashing(1, 0.6);
  }
}
@keyframes btn-watermark-2-flashing {
  0%{
    @include flashing(1, 0.8);
  }
  50%{
    @include flashing(1.2, 0);
  }
  100%{
    @include flashing(1, 0.8);
  }
}
@keyframes btn-flashing {
  0%{
    transform: scale(1);
  }
  50%{
    transform: scale(1.2);
  }
  100%{
    transform: scale(1);
  }
}
</style>