<template>
  <u-popup :show="isShow" mode="center" closeable round="12rpx" customStyle="height: 450rpx;" @close="closeEvent">
    <view class="content-panel">
      <view class="content-title">选择联系人</view>
      <scroll-view scroll-y style="height: 328rpx;">
        <view class="item-panel" v-for="(item, index) in userList" :key="index" @click="changeEvent(item)">
          <view class="item-tag">{{ item.houseState }}</view>
          <text class="item-desc">{{ item.regName }} | {{ item.ownerCalls }}</text>
        </view>
      </scroll-view>
    </view>
  </u-popup>
</template>

<script>
/**
 * 展示房间下的业主及家人的列表
 * @event change 列表里的节点被点击的事件
 */
export default {
  name: 'RoomUserList',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    // 联系人数据
    userList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
    }
  },
  computed: {
    isShow: {
      get() {
        return this.show
      },
      set(val) {
        this.$emit('update:show', val)
      }
    }
  },
  filters: {
    getUserState(val) {
      const  map = {
        1: '租户',
        2: '业主',
        3: '家人'
      }
      return map[val]
    }
  },
  methods: {
    changeEvent(item) {
      this.$emit('change', item)
    },
    closeEvent() {
      this.isShow = false
    },
  }
}
</script>

<style lang="scss" scoped>
.content-panel {
  display: flex;
  flex-direction: column;
  width: 600rpx;
  height: 100%;
  padding-bottom: 25rpx;
}
.content-title {
  font-size: 30rpx;
  padding: 30rpx 0 25rpx;
  text-align: center;
}
.item-panel {
  display: flex;
  align-items: center;
  padding: 25rpx 40rpx 25rpx;
}
.item-tag {
  padding: 4rpx 16rpx;
  margin-right: 22rpx;
  font-size: 24rpx;
  color: #fff;
  background-color: #d7d7d7;
  border-radius: 4rpx;
}
</style>