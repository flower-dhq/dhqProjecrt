<template>
  <view class="phone-card-user" :style="[THEME_CSS_VAR]">
    <view class="card-user">
      <u-image :src="data.stewardHeadUrl" width="56px" height="56px" shape="circle" />
      <view class="card-user-info">
        <text style="font-size: 12px; font-weight: bold; margin-bottom: 8px; word-break: break-all;">{{ data.stewardName }}</text>
        <text style="font-size: 12px;">{{ data.stewardRecord }}</text>
      </view>
    </view>
    <view class="card-call">
      <text style="font-size: 18px; font-weight: bold; margin: 7px 0 0; flex: 1;">{{ data.stewardPhone }}</text>
      <u-icon name="phone-fill" color="#fff" :size="22" @click="callStewardTel" />
    </view>

    <u-toast ref="elToast" />
  </view>
</template>

<script>
import { saveStewardContactRecord } from '@/service/wxmanage'
import commLogic from '@/js/comm-logic';
export default {
  name: 'PhoneCardUser',
  props: {
    data: {
      type: Object,
      default: () => ({})
    },
    userInfo: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    async callStewardTel() {
      if (!this.data.stewardPhone) {
        this.$refs.elToast.show({
          type: 'warning',
          message: '管家电话为空'
        })
        return
      }

      const params = {
        data: {
          buildingId: this.userInfo.buildingId,
          projectId: this.userInfo.projectId,
          areaId: this.userInfo.areaId,
          addrId: this.userInfo.addrId,
          ownerName: this.userInfo.ownerName,
          stewardName: this.data.stewardName,
          stewardId: this.data.id,
          stewardPhone: this.data.stewardPhone,
          roomId: this.userInfo.addrId
        }
      }
      const res = await saveStewardContactRecord(params)
      if (res.status == 200) {
        const { code } = await commLogic.permissionCheckAndAlert({permissionKeys: ['callPhone']})
				if (code !== 1 && code !== -2) return
        uni.makePhoneCall({
          phoneNumber: this.data.stewardPhone
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.phone-card-user {
  background-color: #fff;
  border-radius: 10px;
  padding: 12px 10px;
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
}
.card-user {
  display: flex;
  align-items: stretch;
}
.u-image {
  flex: 0 0 auto;
}
.card-user-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  margin-left: 15px;
}
.card-call {
  display: flex;
  align-items: center;
}
.u-icon {
  background-color: var(--app-primary-color);
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 10px;
  border-left: 2px solid #f4f4f4;
}







.phone-card-left {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding-right: 10px;
}
.phone-card-right {
  border-left: 2px solid #f4f4f4;
  flex: 0 0 auto;
  margin: auto 0;
}
.card-font--weight {
  font-size: 18px;
  font-weight: bold;
  line-height: 1.2;
  word-break: break-all;
  margin-bottom: 10px;
}
.card-font--mini {
  font-size: 12px;
  font-weight: bold;
  line-height: 1.2;
  word-break: break-all;
  margin-bottom: 2px;
}
.card-time {
  font-size: 12px;
  line-height: 1.7;
  color: #666;
}
</style>