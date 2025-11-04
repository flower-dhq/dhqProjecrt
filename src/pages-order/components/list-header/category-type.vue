<template>
  <view class="list-wrapper">
    <view class="cmn-list" :style="{ 'background-color': BackgroundColor[index] }" v-for="(item, index) in treeData" :key="index">
      <view v-if="item.length > 0">
        <view :class="['cmn-list-item', { activeItem: selectServerIds[index] == child.serverId }, { selectIcon: selectServerIds[selectServerIds.length - 1] == child.serverId }]" v-for="child in item" :key="child.serverId" @click="hanldSelectServer(child, index)">
          <view class="item-name">{{ child.serverName }}</view>
          <u-icon v-if="selectServerIds[selectServerIds.length - 1] == child.serverId" size="40rpx" color="var(--app-primary-color)" name="checkmark"></u-icon>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  data() {
    return {
      treeData: [],
      selectServerIds: [],
      BackgroundColor: ['#FFFFFF', '#F0F0F0', '#F3F3F3', '#F6F6F6']
    }
  },
  computed: {
    ...mapGetters('searchBar', {
      dataInfo: 'getDataInfo'
    })
  },
  methods: {
    ...mapMutations('searchBar', ['setDataInfo']),
    hanldSelectServer(server, index) {
      console.log(server, index, this.selectServerIds[index])
      if (this.selectServerIds[index] && server.serverId == this.selectServerIds[index]) {
        if (index == 0) {
          console.log(1)
          this.selectServerIds = []
        } else {
          console.log(2)
          this.selectServerIds = this.selectServerIds.slice(0, index)
        }
      } else {
        console.log(3)
        this.$set(this.selectServerIds, index, server.serverId)
        this.selectServerIds = this.selectServerIds.slice(0, index + 1)
      }

      if (server.children && server.children.length > 0) {
        this.$set(this.treeData, index + 1, server.children)
        this.treeData = this.treeData.slice(0, server.classLevel)
      } else {
        this.treeData = this.treeData.slice(0, server.classLevel - 1)
      }

      console.log(123, this.selectServerIds)
    },
    handleSyncData() {
      if (this.dataInfo.treeData.length > 0) {
        this.treeData = JSON.parse(JSON.stringify(this.dataInfo.treeData))
      }
      if (this.dataInfo.selectServerIds.length > 0) {
        this.selectServerIds = JSON.parse(JSON.stringify(this.dataInfo.selectServerIds))
      }
    },
    updateStoreDate() {
      this.setDataInfo({ treeData: this.treeData, selectServerIds: this.selectServerIds })
      return true
    },
    resetData() {
      this.selectServerIds = []
      this.treeData = [this.treeData[0]]
    }
  }
}
</script>

<style lang="scss" scoped>
.list-wrapper {
  flex: 1;
  height: 100%;
  display: flex;
  // padding: 0 30rpx;
  overflow: hidden;
  max-height: 50vh;
  .cmn-list {
    overflow: auto;

    .activeItem {
      background: #ffffff;
      color: #2761ff;
    }
    .selectIcon {
      display: flex;
      justify-content: space-between;

      // &::after {
      //   position: relative;
      //   font-size: 0;
      //   content: url('@/static/icon-img/icon-select.png');
      // }
    }

    &:nth-child(1) {
      width: 30%;
      overflow-x: hidden;
      background: #ffffff;
    }
    &:nth-child(2) {
      width: 30%;
    }

    &:last-child {
      flex: 1;
    }
  }

  .cmn-list-item {
    padding: 30rpx;
    font-size: 30rpx;
    .item-name {
      word-break: break-all;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2; /* 超出几行省略 */
      overflow: hidden;
    }
  }
}
</style>
