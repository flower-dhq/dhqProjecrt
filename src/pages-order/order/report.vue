<template>
  <view class="report-list" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
    <view class="search-top">
      <search-bar @onSearch="handleSetSearchData"></search-bar>
    </view>
    <view class="report-tab">
      <view class="tabs-wrap">
        <view @click="tabClick(tab)" :class="['tab-wrap', { 'tab-active': tabName === tab.name }]" v-for="(tab, index) in tabs" :key="index">{{ tab.name }}</view>
      </view>
    </view>
    <view v-show="tabName === '移动报表'">
      <stat-chart :query="query" ref="statChart"></stat-chart>
      <task-count :query="query" ref="taskCount"></task-count>
    </view>
    <view v-show="tabName === '预警中心'">
      <task-count2 :query="query" ref="taskCount2"></task-count2>
    </view>
  </view>
</template>

<script>
import searchBar from './reportComponents/reportHeader/searchBar.vue'
import statChart from './reportComponents/statChart.vue'
import taskCount from './reportComponents/taskCount.vue'
import taskCount2 from './reportComponents/taskCount2.vue'

export default {
  name: 'taskReport',
  components: { searchBar, statChart, taskCount, taskCount2 },
  data() {
    return {
      query: {
        companyId: '',
        userId: ''
      },
      tabName: '移动报表',
      tabs: [
        { name: '移动报表', value: '1' },
        { name: '预警中心', value: '2' }
      ],
      userInfo: {}
    }
  },
  onLoad() {
    const { O_USER_INFO } = this.$constant;
    this.userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' }); 
    this.query.companyId = this.userInfo.companyId
    this.query.userId = this.userInfo.userId
  },
  methods: {
    tabClick(tab) {
      this.tabName = tab.name
    },
    handleSetSearchData(params) {
      this.query = {
        ...this.query,
        ...params
      }
      this.$refs.statChart.getEcharts(this.query)
      this.$refs.taskCount.getCounts(this.query)
      this.$refs.taskCount2.getCounts(this.query)
    }
  }
}
</script>

<style lang="scss" scoped>
.report-list {
  height: 100%;
  overflow: auto;
  background-color: #f5f5f5;
  .search-top {
    padding-bottom: 24rpx;
  }
  .report-tab {
    background: #ffffff;
    padding: 32rpx 20% 8rpx;
    .tabs-wrap {
      border: 1rpx solid #999999;
      border-radius: 8rpx;
      overflow: hidden;
      display: flex;
      .tab-wrap {
        flex: 1;
        padding: 16rpx 0;
        text-align: center;
        font-size: 24rpx;
        color: #666666;
      }
      .tab-active {
        font-weight: bold;
        color: #ffffff;
        background: var(--app-primary-color);
      }
    }
  }
}
</style>
