<template>
  <view class="search-bar">
    <view class="common-bar bar-1">
      <view :class="['select-wrap', { active: visible && panel.area }]" @click="handleShowPanelList('area')">
        <view class="menu-name" style="font-size: 30rpx">{{ showAreaName }}</view>
        <text class="iconfont drop-icon">&#xe600;</text>
      </view>
      <u-search
        class="search-wrap"
        v-model="searchParams.condition"
        placeholder="请输入客户姓名/电话/单号/工单编号"
        :inputStyle="{ 'font-size': '26rpx', color: '#333333' }"
        @focus="visible = false"
        @search="handleConfirm"
        @custom="handleConfirm"
        :actionStyle="{ 'font-size': '30rpx', color: 'var(--app-primary-color)' }"
      ></u-search>
    </view>
    <view class="common-bar bar-2">
      <view :class="['select-wrap', { active: visible && panel.type }]" @click="handleShowPanelList('type')">
        <view class="menu-name">业务类别</view>
        <text class="iconfont drop-icon">&#xe600;</text>
      </view>
      <view :class="['select-wrap', { active: visible && panel.status }]" @click="handleShowPanelList('status')">
        <view class="menu-name">工单状态</view>
        <text class="iconfont drop-icon">&#xe600;</text>
      </view>
      <view :class="['select-wrap', { active: visible && panel.filter }]" @click="handleShowPanelList('filter')">
        <view class="menu-name">筛选</view>
        <text class="iconfont filter-icon">&#xe616;</text>
      </view>
    </view>

    <view v-show="visible" class="pull-down-panel" :style="{ top: top, height: `calc(100vh - ${top})` }" @click.stop="visible = false">
      <view class="panel-wrapper" @click.stop>
        <view class="wrapper-content">
          <!-- 城市公司 -->
          <task-area v-show="panel.area" ref="area" @updateData="updateData"></task-area>
          <!-- 业务类别 -->
          <task-type v-show="panel.type" ref="type" @updateData="updateData"></task-type>
          <!-- 工单状态 -->
          <task-status v-show="panel.status" ref="status" @updateData="updateData"></task-status>
          <!-- 筛选条件 -->
          <task-filter v-show="panel.filter" ref="filter" @updateData="updateData"></task-filter>
        </view>
        <view class="footer-btn" v-if="!panel.status">
          <view class="reset" v-if="!panel.type && !panel.area" @click="handleReset">重置</view>
          <view class="confirm" @click="handleConfirm">确认</view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import taskArea from './taskArea.vue'
import taskStatus from './taskStatus.vue'
import taskType from './taskType.vue'
import taskFilter from './taskFilter.vue'

export default {
  name: 'search-bar',
  components: { taskArea, taskStatus, taskType, taskFilter },
  data() {
    return {
      visible: false,
      panel: {
        area: false, // 城市公司
        type: false, // 业务类别
        status: false, // 工单性质
        filter: false // 创建日期
      },
      showAreaList: false,
      showCategoryList: false,
      top: '44px',
      searchParams: {
        condition: ''
      },
      areaName: '全部',
      showAreaName: '全部'
    }
  },
  onLoad() {},
  onShow() {},
  onReady() {},
  onHide() {},
  methods: {
    updateData(params) {
      this.searchParams = {
        ...this.searchParams,
        ...params
      }
      console.log(this.searchParams)
      if (this.searchParams.areaName) {
        this.areaName = this.searchParams.areaName
        delete this.searchParams.areaName
      }
      if (params.nowFresh) {
        delete this.searchParams.nowFresh
        this.handleConfirm()
      }
    },
    handleShowPanelList(property) {
      this.top = property === 'area' ? '44px' : '88px'
      this.visible = !this.panel[property]
      for (const key in this.panel) {
        this.panel[key] = this.visible && property === key
      }
    },
    /**
     * 点击确定后关闭下拉框
     */
    handleConfirm() {
      this.showAreaName = this.areaName
      for (const key in this.panel) {
        if (Object.hasOwnProperty.call(this.panel, key)) {
          if (this.panel[key]) {
            this.panel[key] = false
          }
        }
      }
      this.visible = false
      this.$emit('onSearch', this.searchParams)
    },
    /**
     * 点击重置关闭下拉框
     */
    handleReset() {
      for (const key in this.panel) {
        if (this.panel[key] && this.$refs[key]) {
          this.$refs[key].reset()
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.search-bar {
  background-color: #fff;
  .common-bar {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 88rpx;
    padding: 0 24rpx;
    border-bottom: 1rpx solid #eaeaea;
    box-sizing: border-box;
    .search-wrap {
      padding-left: 24rpx;
      ::v-deep .uicon-search {
        display: none;
      }
      ::v-deep .u-search__content__input--placeholder {
        font-size: 26rpx;
        color: #999999;
      }
    }
  }
  .bar-1 {
    position: relative;
    display: grid;
    grid-template-columns: auto 1fr auto;
  }
  .bar-2 {
    padding: 0 48rpx;
  }

  .select-wrap {
    @include flx-dsp($jsc: center, $ali: center);
    color: #333333;
    cursor: pointer;
  }
  .menu-name {
    font-size: 26rpx;
    max-width: 160rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    transition: 0.6s;
  }
  .drop-icon,
  .filter-icon {
    margin-left: 6rpx;
    color: #666666;
    font-size: 20rpx;
    transition: all 0.2s ease-in-out;
  }
  .filter-icon {
    font-size: 22rpx;
  }
  .active {
    color: var(--app-primary-color) !important;
    .drop-icon {
      transform: rotate(180deg);
      color: var(--app-primary-color);
    }
    .filter-icon {
      color: var(--app-primary-color);
    }
  }
  .pull-down-panel {
    position: absolute;
    width: 100%;
    background: rgba($color: #000, $alpha: 0.5);
    border-top: 1rpx solid #eaeaea;
    z-index: 1;
    overflow: hidden;
    .panel-wrapper {
      position: relative;
      width: 100%;
      max-height: 62%;
      display: flex;
      flex-direction: column;
      background: #fff;
      overflow: hidden;
      z-index: 999;

      .wrapper-content {
        position: relative;
        flex: 1;
        height: 100%;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      .footer-btn {
        width: 100%;
        @include flx-dsp($jsc: center, $ali: center);
        .reset {
          width: 35%;
          text-align: center;
          padding: 24rpx 0;
          font-size: 32rpx;
        }
        .confirm {
          flex: 1;
          text-align: center;
          padding: 24rpx 0;
          color: #ffffff;
          background: #2761ff;
          font-size: 32rpx;
        }
      }
    }
  }
}
</style>
