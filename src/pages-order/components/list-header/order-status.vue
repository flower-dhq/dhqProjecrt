<template>
  <view class="list-wrapper">
    <view
      :class="['cmn-list',{'cmn-active':tabType == item.value}]"
      v-for="item in list"
      :key="item.value"
      @click="handleSelectOrder(item)"
    >{{item.label}}</view>
  </view>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  data() {
    return {
      list: [
        { value: '2', label: '待我处理' },
        { value: '1', label: '我发起的' },
        { value: '3', label: '我已处理' }
      ],
      tabType: ''
    }
  },
  computed: {
    ...mapGetters('searchBar', {
      dataInfo: 'getDataInfo'
    })
  },
  methods: {
    ...mapMutations('searchBar', ['setDataInfo']),
    handleSelectOrder(item) {
      this.tabType = item.value
    },
    handleSyncData() {
      this.tabType = this.dataInfo.tabType
      console.log('同步数据', this.dataInfo)
    },
    updateStoreDate() {
      this.setDataInfo({ tabType: this.tabType })
      console.log('更新数据', this.tabType, this.dataInfo)
      return true
    }
  }
}
</script>

<style lang="scss" scoped>
.list-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;

  overflow: hidden;
  .cmn-list {
    display: flex;
    justify-content: space-between;
    padding: 0 30rpx;
    height: 51px;
    line-height: 51px;
    font-size: 30rpx;
    border-bottom: 0.5px solid #eaeaea;
  }

  .cmn-active {
    background: #ffffff;
    color: #2761ff;
    &::after {
      position: relative;
      top: 3px;
      content: url('@/static/icon-img/icon-select.png');
    }
  }
}
</style>