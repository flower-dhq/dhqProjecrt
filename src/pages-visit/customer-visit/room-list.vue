<template>
  <view class="page-panel" :style="[THEME_CSS_VAR]">
    <view class="header-filter">
      <view class="filter-radio">
        <view class="radio-panel" :style="{padding: '26rpx 30rpx'}">
          <view class="radio-tag"></view>
          <text>未拜访（{{ totalObj.waitVisitCount }}）</text>
        </view>
        <view class="radio-panel" :style="{padding: '26rpx 30rpx'}">
          <view class="radio-tag" :style="{backgroundColor: THEME_COLOR}"></view>
          <text>已拜访（{{ totalObj.hasVisitCount }}）</text>
        </view>
      </view>
      <u--text :text="stateObj.label" :suffixIcon="require(`@/static/${THEME_NAME}/common/icon-more.png`)" size="26rpx" color="#333" iconStyle="width: 24rpx; height: 24rpx;" margin="26rpx 30rpx 26rpx 0" @click="showMask" />
    </view>
    <dropdown-universal :show.sync="stateObj.isShow" maskTop="90rpx" contentHeight="184rpx">
      <dropdown-radio :show="stateObj.isShow" :data="stateObj.list" :value="stateObj.selItem" required @confirm="filterChange" />
    </dropdown-universal>
    <room-tree-visit :visitTaskId="visitTaskId" :totalData.sync="totalObj" :filterData="stateObj.selItem" />
    <u-safe-bottom />
  </view>
</template>

<script>
import menuAuthMixin from '@/js/mixin/menuAuthMixin'
import DropdownUniversal from '@/components/dropdown-area/dropdown-universal.vue'
import DropdownRadio from '@/components/dropdown-area/dropdown-radio.vue'
import RoomTreeVisit from '@/pages-visit/modules/room-tree-visit.vue'

export default {
  mixins: [menuAuthMixin],
  components: {
    RoomTreeVisit,
    DropdownUniversal,
    DropdownRadio
  },
  authName: '业户档案',
  data() {
    return {
      visitTaskId: '', // 拜访任务id
      // 拜访数量
      totalObj: {
        waitVisitCount: 0, // 未拜访数量
        hasVisitCount: 0, // 已拜访数量
      },
      // 拜访状态筛选
      stateObj: {
        isShow: false, // 是否显示遮罩层
        list: [
          { label: '未拜访', name: '1' },
          { label: '已拜访', name: '2' }
        ],
        selItem: '1',
        label: '未拜访'
      }
    }
  },
  onLoad(query) {
    this.visitTaskId = query.visitTaskId || ''
  },
  onShow() {
    const oldVal = this.visitTaskId
    this.visitTaskId = ''
    setTimeout(() => {
      this.visitTaskId = oldVal
    }, 500)
  },
  methods: {
    // 显示筛选
    showMask() {
      this.stateObj.isShow = true
    },
    // 筛选条件确认事件
    filterChange(item) {
      this.stateObj.selItem = item.name
      this.stateObj.label = item.label
      this.stateObj.isShow = false
    },
  }
}
</script>

<style lang="scss" scoped>
.page-panel {
  height: 100vh;
  box-sizing: border-box;
  font-family: "PingFang SC";
  display: flex;
  flex-direction: column;
}
.area-panel {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  width: 100%;
  height: 88rpx;
  background-color: #fff;
  padding: 0 30rpx;
  box-sizing: border-box;
  color: #333;
  font-size: 26rpx;
}
.search-panel {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  background-color: #fff;
  padding: 14rpx 30rpx;
  border-bottom: 1px solid #EBEBEB;

  ::v-deep .u-text {
    flex: 0 0 auto !important;
    width: auto !important;
  }
}

.header-filter {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 26rpx;
  color: #333;
  border-bottom: 1px solid #ebebeb;
}
.filter-radio {
  flex: 1 1 auto;
  display: flex;
}
.filter-tag {
  flex: 0 0 auto;
}
.radio-panel {
  display: flex;
  align-items: center;
}
.radio-tag {
  width: 24rpx;
  height: 24rpx;
  border-radius: 4rpx;
  background-color: #ccc;
  margin-right: 12rpx;
}
</style>