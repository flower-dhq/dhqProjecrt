<template>
  <view class="list-wrapper">
    <view
      :class="['cmn-list',{'cmn-active':selectProperty == item.value}]"
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
        { value: 'internalTask', label: '内部工单' },
        { value: 'customerTask', label: '客户工单' }
      ],
      selectProperty: ''
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
      if (item.value == this.selectProperty) {
        this.selectProperty = ''
      } else {
        this.selectProperty = item.value
      }
    },
    handleSyncData() {
      this.selectProperty = this.dataInfo.orignSource
      console.log('同步数据', this.dataInfo)
    },
    updateStoreDate() {
      this.setDataInfo({ orignSource: this.selectProperty })
      console.log('更新数据', this.selectProperty, this.dataInfo)
      return true;
    },
    resetData(){
      this.selectProperty = '';
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