<template>
  <view class="search-bar">
    <view class="common-bar bar-1">
      <view :class="['select-wrap', { active: visible && panel.area }]" @click="handleShowPanelList('area')">
        <view class="menu-name">{{ areaName }}</view>
        <text class="iconfont drop-icon">&#xe600;</text>
      </view>
    </view>
    <view v-show="visible" class="pull-down-panel" style="top: 88rpx; height: calc(100vh - 88rpx)" @click.stop="visible = false">
      <view class="panel-wrapper" @click.stop>
        <view class="wrapper-content">
          <!-- 城市公司 -->
          <task-area v-show="panel.area" ref="area" @updateData="updateData"></task-area>
        </view>
        <view class="footer-btn" v-if="!panel.status">
          <view class="reset" @click="handleReset">重置</view>
          <view class="confirm" @click="handleConfirm">确认</view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import taskArea from './taskArea.vue'

export default {
  name: 'search-bar',
  components: { taskArea },
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
      searchParams: {
        condition: ''
      },
      areaName: '集团总部'
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
      if (params.nowFresh) {
        delete this.searchParams.nowFresh
        this.handleConfirm()
      }
    },
    handleShowPanelList(property) {
      this.visible = !this.panel[property]
      for (const key in this.panel) {
        this.panel[key] = this.visible && property === key
      }
    },
    handleConfirm() {
      for (const key in this.panel) {
        if (Object.hasOwnProperty.call(this.panel, key)) {
          if (this.panel[key]) {
            this.panel[key] = false
          }
        }
      }
      this.visible = false
      if (this.searchParams.areaName) {
        this.areaName = this.searchParams.areaName
        delete this.searchParams.areaName
      }
      this.$emit('onSearch', this.searchParams)
    },
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
    align-items: center;
    height: 88rpx;
    padding: 0 24rpx;
    border-bottom: 1rpx solid #eaeaea;
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
  }

  .select-wrap {
    @include flx-dsp($jsc: center, $ali: center);
    color: #333333;
    cursor: pointer;
  }
  .menu-name {
    font-size: 30rpx;
    max-width: 80vw;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    transition: 0.6s;
  }
  .drop-icon,
  .filter-icon {
    margin-left: 10rpx;
    color: #666666;
    font-size: 28rpx;
    transition: all 0.2s ease-in-out;
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
