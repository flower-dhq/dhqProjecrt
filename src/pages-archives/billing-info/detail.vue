<template>
  <view class="page-panel" :style="[THEME_CSS_VAR]">
    <block v-for="(item, i) in dataList" :key="i">
      <text class="title">{{ item.dateStr }}</text>
      <view class="card-wrap">
        <view class="card-panel" v-for="(child, j) in item.children" :key="j">
          <view class="content-panel">
            <text class="content-title">{{ child.fiName }}</text>
            <text class="content-desc">收款期限：{{ child.receiveDeadLine | date('yyyy-mm-dd') }}</text>
          </view>
          <view class="price-num">
            <u-icon name="rmb" top="4rpx" bold color="#333" size="35rpx" />
            {{ child.receivableAmount }}
          </view>
        </view>
      </view>
    </block>
  </view>
</template>

<script>
import { getAccountDetail, setAccountDetail } from '@/pages-archives/modules/accountStore'

/**
 * 账款明细
 */
export default {
  data() {
    return {
      dataList: []
    }
  },
  created() {
    const list = getAccountDetail()
    this.dataList = this.transformList(list)
  },
  beforeDestroy() {
    setAccountDetail([])
  },
  methods: {
    transformList(list = []) {
      // 按日期进行分组
      let res = list.reduce((store, item) => {
        const dateStr = uni.$u.timeFormat(item.receiveDeadLine, 'yyyy-mm-dd')
        const dateTime = new Date(dateStr.replace('-', '/')).getTime()

        let index = store.findIndex((child) => child.dateTime == dateTime)
        if (index == -1) {
          store.push({ dateStr, dateTime, children: [] })
          index = store.length - 1
        }

        store[index].children.push(item)
        return store
      }, [])

      // 根据时间排序
      res = res.sort((a, b) => a.dateTime - b.dateTime)
      return res
    }
  }
}
</script>

<style lang="scss" scoped>
.page-panel {
  background-color: #f3f5f9;
  min-height: 100vh;
  box-sizing: border-box;
  font-family: "PingFang SC";
  padding: 24rpx 20rpx 0;
}
.title {
  display: block;
  height: 102rpx;
  padding: 0 30rpx;
  font-size: 30rpx;
  font-weight: bold;
  line-height: 102rpx;
  color: #333;
  background-color: #fff;
  border-top-left-radius: 12rpx;
  border-top-right-radius: 12rpx;
  border-bottom: 1px solid #EBEBEB;
}
.card-wrap {
  padding: 0 30rpx;
  margin-bottom: 24rpx;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-bottom-left-radius: 12rpx;
  border-bottom-right-radius: 12rpx;
}
.card-panel {
  display: flex;
  background-color: #fff;
  box-sizing: border-box;
  padding: 30rpx 0;
  border-bottom: 1px solid #EBEBEB;
}
.content-panel {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
}
.content-title {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
}
.content-desc {
  font-size: 28rpx;
  color: #666;
  margin-top: 24rpx;
}
.price-num {
  display: flex;
  align-items: center;
  flex: 0 0 auto;
  font-family: "DIN";
  color: #333;
  font-size: 44rpx;
  font-weight: bold;
}
</style>