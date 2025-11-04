<template>
  <view class="search-bar">
    <view class="common-bar bar-1">
      <view v-if="filters.includes(1)" class="filter-title select-area" :class="{ 'title-active': panel.area }" @click="handleShowPanelList(1, 'area')">
        <view class="cmn-text cmn-text-line" style="font-size: 30rpx">{{ dataInfo.projectName ? dataInfo.projectName : dataInfo.areaName ? dataInfo.areaName : '全部' }}</view>
        <text class="iconfont drop-icon" :class="[{ rotate180: panel.area }]">&#xe600;</text>
      </view>
      <u-search class="search-input" v-model="condition" placeholder="请输入客户姓名/电话/工单编号" :showAction="false"></u-search>
      <view class="cmn-text" style="color: var(--app-primary-color)" @click="handleSearch">搜索</view>
    </view>
    <view class="common-bar bar-2">
      <view v-if="filters.includes(2)" class="filter-title" :class="{ 'title-active': panel.categoryType }" @click="handleShowPanelList(2, 'categoryType')">
        <view class="cmn-text">业务类别</view>
        <text class="iconfont drop-icon" :class="[{ rotate180: panel.categoryType }]">&#xe600;</text>
      </view>
      <view v-if="filters.includes(3)" class="filter-title" :class="{ 'title-active': panel.orderProperty }" @click="handleShowPanelList(3, 'orderProperty')">
        <view class="cmn-text">工单性质</view>
        <text class="iconfont drop-icon" :class="[{ rotate180: panel.orderProperty }]">&#xe600;</text>
      </view>
      <view v-if="filters.includes(4)" class="filter-title" :class="{ 'title-active': panel.createDate }" @click="handleShowPanelList(4, 'createDate')">
        <view class="cmn-text">
          <!-- <view class="create-date" v-if="dataInfo.beginDate && dataInfo.endDate">
            <view>{{dataInfo.beginDate}}</view>
            <view>-</view>
            <view>{{dataInfo.endDate}}</view>
          </view>-->
          <view>创建时间</view>
        </view>
        <text class="iconfont drop-icon" :class="[{ rotate180: panel.createDate }]">&#xe600;</text>
      </view>
      <view v-if="filters.includes(5)" class="filter-title" :class="{ 'title-active': panel.tabType }" @click="handleShowPanelList(5, 'tabType')">
        <view class="cmn-text">办理人</view>
        <text class="iconfont drop-icon" :class="[{ rotate180: panel.tabType }]">&#xe600;</text>
      </view>
      <view v-if="filters.includes(6)" class="filter-title" :class="{ 'title-active': panel.listFilter }" @click="handleShowPanelList(6, 'listFilter')">
        <view class="cmn-text">筛选</view>
        <text class="iconfont filter-icon">&#xe616;</text>
      </view>
    </view>
    <!-- 选择城市公司 -->
    <drop-panel v-show="visible" class="pull-down-panel" :reset="resetBtn" :style="{ top: top, height: `calc(100vh - ${top})` }" @closePanel="handleClosePanel" @reset="handleReset" @confirm="handleConfirm">
      <!-- 城市公司 -->
      <list-area ref="area" v-show="panel.area" slot="content"></list-area>
      <!-- 业务类别 -->
      <category-type ref="categoryType" v-show="panel.categoryType" slot="content"></category-type>
      <!-- 工单性质 -->
      <order-property ref="orderProperty" v-show="panel.orderProperty" slot="content"></order-property>
      <!-- 创建时间 -->
      <date-list ref="createDate" v-show="panel.createDate" slot="content"></date-list>
      <!-- 工单类别 -->
      <order-status ref="tabType" v-show="panel.tabType" slot="content"></order-status>
      <!-- 筛选 -->
      <list-filter ref="listFilter" v-show="panel.listFilter" slot="content"></list-filter>
    </drop-panel>
  </view>
</template>
<script>
import { mapGetters } from 'vuex'
import dropPanel from './drop-panel.vue'
import listArea from './list-area.vue'
import categoryType from './category-type.vue'
import orderProperty from './order-property.vue'
import dateList from './date-list.vue'
import orderStatus from './order-status.vue'
import listFilter from './list-filter.vue'
export default {
  name: 'search-bar',
  components: { dropPanel, listArea, categoryType, orderProperty, dateList, orderStatus, listFilter },
  props: {
    filters: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      visible: false,
      condition: '',
      panel: {
        area: false, // 城市公司
        categoryType: false, // 业务类别
        orderProperty: false, // 工单性质
        createDate: false, // 创建日期
        tabType: false, // 工单类别,
        listFilter: false // 筛选
      },
      showAreaList: false,
      showCategoryList: false,
      top: '44px',
      resetBtn: false
    }
  },
  computed: {
    ...mapGetters('searchBar', {
      dataInfo: 'getDataInfo'
    })
  },
  onLoad() {},
  onShow() {},
  onReady() {},
  onHide() {},
  methods: {
    handleSearch() {
      this.$emit('onSearch', this.condition)
    },
    handleShowPanelList(i, property) {
      for (const key in this.panel) {
        if (property == key && !this.visible) {
          console.log('key', key, property)
          this.panel[key] = true
          this.$refs[key].handleSyncData()
        } else {
          this.panel[key] = false
        }
      }
      if (property === 'listFilter') {
        this.resetBtn = true
      } else {
        this.resetBtn = false
      }
      this.handleShowDropPanel(i)
    },
    handleShowDropPanel(i) {
      console.log(i)
      this.visible = !this.visible
      this.top = i == 1 ? '44px' : '88px'
      // this.resetBtn = false
      // this.resetBtn = i == 1 ? false : true
    },
    /**
     * 点击确定后关闭下拉框
     */
    handleConfirm() {
      console.log('确认')
      let result = true
      for (const key in this.panel) {
        if (Object.hasOwnProperty.call(this.panel, key)) {
          if (this.panel[key]) {
            console.log('key', key)
            result = this.$refs[key].updateStoreDate()
            if (result) {
              this.panel[key] = false
            }
          }
        }
      }
      console.log('result', result)
      if (result) {
        this.visible = false
        this.handleSearch()
      }
    },
    /**
     * 点击重置关闭下拉框
     */
    handleReset() {
      for (const key in this.panel) {
        if (Object.hasOwnProperty.call(this.panel, key)) {
          if (this.panel[key]) {
            this.$refs[key].resetData()
          }
        }
      }
    },
    /**
     * 点击空白关闭下拉框
     */
    async handleClosePanel() {
      for (const key in this.panel) {
        if (Object.hasOwnProperty.call(this.panel, key)) {
          this.panel[key] = false
        }
      }
      this.visible = false
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
    height: 44px;
    padding: 0 12px;
    border-bottom: 1px solid #eaeaea;
    box-sizing: border-box;
  }
  .bar-1 {
    position: relative;
    display: flex;
    column-gap: 12px;

    .search-input {
      flex: 1;
      ::v-deep .uicon-search {
        display: none;
      }
    }
  }
  .bar-2 {
    padding: 0 48rpx;
  }

  .create-date {
    display: flex;
    flex-direction: column;
    text-align: center;
  }

  .filter-title {
    display: flex;
    align-items: center;
    color: #333333;
  }
  .title-active {
    color: var(--app-primary-color) !important;
    .drop-icon,
    .filter-icon {
      color: var(--app-primary-color);
    }
  }
  .cmn-text {
    font-size: 26rpx;
  }
  .cmn-text-line {
    white-space: nowrap; /* 防止文本换行 */
    overflow: hidden; /* 隐藏超出容器的部分 */
    text-overflow: ellipsis; /* 显示省略号 */
    max-width: 160rpx; /* 指定宽度 */
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
  .rotate180 {
    transform: rotate(-180deg);
  }
}
.pull-down-panel {
  position: absolute;
  width: 100%;
  background: rgba($color: #000, $alpha: 0.5);
  border-top: 1rpx solid #eaeaea;
  z-index: 1;
  overflow: hidden;
}
</style>
