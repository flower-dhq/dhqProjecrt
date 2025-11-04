<template>
  <view class="page-panel" :style="[THEME_CSS_VAR]">
    <view class="row-panel" @click.stop="selectAll(!allCheck)">
      <u-checkbox-group>
        <u-checkbox :checked="allCheck" :name="1" shape="circle" :size="22" :iconSize="16" :customStyle="{marginRight: '8px'}" @change="selectAll" />
      </u-checkbox-group>
      <text>全部群聊</text>
    </view>
    <view class="row-panel" v-for="(item, index) in dataList" :key="index" @click.stop="selectCheckbox(item, !item.isCheck)">
      <u-checkbox-group>
        <u-checkbox :checked="item.isCheck" :name="1" shape="circle" :size="22" :iconSize="16" :customStyle="{marginRight: '8px'}" @change="selectCheckbox(item, $event)" />
      </u-checkbox-group>
      <text class="row-label">{{ item.groupName }}</text>
    </view>
    <text class="footer-text">共{{ dataList.length }}个群聊</text>

    <u-safe-bottom></u-safe-bottom>
    <view class="footer-panel">
      <view class="footer-btn">
        <u-button text="确定" type="primary" :disabled="!isCheckCount" customStyle="width: auto; height: 30px; margin: 0; padding: 0 20px;" @click="handleSubmit" />
      </view>
      <u-safe-bottom></u-safe-bottom>
    </view>
  </view>
</template>

<script>
import { contactGroup, getQYInfoByUserId } from '@/service/api-gateway'
import storeGroup from '@/pages-tasks/group-send/storeGroup'

/**
 * 选择客户群
 */
export default {
  name: 'GroupList',
  data() {
    return {
      allCheck: false, // 是否全选
      dataList: [],
      isCheckCount: 0,
      wechatUserId: '', // 企微ID
    }
  },
  async mounted() {
    storeGroup.init()

    await this.getQYInfoByUserId()
    await this.getGroupList()
  },
  methods: {
    // 根据员工ID查询企微上的ID
    async getQYInfoByUserId(userId) {
      const { O_USER_INFO } = this.$constant
      const userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' })
      const res = await getQYInfoByUserId(userInfo.userId)
      const data = res.data || {}
      this.wechatUserId = data.wechatUserId
    },
    // 获取群聊列表
    async getGroupList() {
      
      const params = {
        data: {
          groupOwner: this.wechatUserId
        }
      }
      const res = await contactGroup(params)

      this.dataList = (res.data || []).map(item => ({ chatId: item.chatId, groupName: item.groupName, isCheck: false }))
    },
    selectCheckbox(item, isCheck) {
      item.isCheck = isCheck

      this.isCheckCount += (isCheck ? 1 : -1)
      if (this.isCheckCount === this.dataList.length) {
        // 全选
        this.allCheck = true
      } else {
        this.allCheck = false
      }
    },
    // 全选
    selectAll(isCheck) {
      this.allCheck = isCheck
      this.dataList =  this.dataList.map(item => ({
        ...item,
        isCheck
      }))

      this.isCheckCount = isCheck ? this.dataList.length : 0
    },
    handleSubmit() {
      const selItem = this.dataList.filter(item => item.isCheck)
      selItem.forEach(item => {
        storeGroup.set(item)
      })

      // 返回上一页
      uni.navigateBack()
    }
  }
}
</script>

<style lang="scss" scoped>
.page-panel {
  display: flex;
  flex-direction: column;
  background-color: #f2f3f5;
  min-height: 100vh;
  box-sizing: border-box;
  padding-bottom: 46px;
}
.row-panel {
  display: flex;
  align-items: center;
  padding: 20rpx 20rpx;
  border-bottom: 1rpx solid #EAEAEA;
  background-color: #fff;
}
.row-label {
  font-size: 28rpx;
}
.footer-text {
  text-align: center;
  font-size: 24rpx;
  color: #a6a7ab;
  padding: 20rpx 0;
}
.footer-panel {
  display: flex;
  flex-direction: column;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #f5f6f8;
  padding: 8px 10px;
}
.footer-btn {
  display: flex;
  justify-content: flex-end;
}
</style>