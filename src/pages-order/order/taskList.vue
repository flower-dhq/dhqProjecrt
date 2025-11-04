<template>
  <view class="order-list" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
    <view class>
      <search-bar @onSearch="handleSetSearchData"></search-bar>
    </view>
    <view class="list-content">
      <u-list @scrolltolower="scrolltolower" v-if="listData.length" height="100%">
        <list-item v-for="item in listData" :key="item.quesTaskId" :itemData="item" :action="false"></list-item>
        <view class="bottom-wrap" v-if="listData.length === total">到底啦~</view>
      </u-list>
      <view class="e-empty" v-else>
        <view class="img-wrap">
          <image style="width: 100%" src="@/static/icon-img/no-data.png" mode="aspectFit"></image>
        </view>
        <view class="text-wrap">暂无数据</view>
      </view>
    </view>
  </view>
</template>

<script>
import searchBar from '../components/taskHeader/searchBar.vue'
import listItem from './component/list-item.vue'
import { findMyTaskListByPage } from '@/service/wuyecrm'
export default {
  name: 'order-list',
  components: { searchBar, listItem },
  data() {
    return {
      listData: [],
      query: {
        companyId: '',
        userId: '',
        pageNum: 1,
        pageSize: 15
      },
      total: 0,
      userInfo: {}
    }
  },
  onPullDownRefresh() {
    this.query.pageNum = 1
    this.getTaskList()
  },
  onLoad() {
    const { O_USER_INFO } = this.$constant;
    this.userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' }); 
    this.query.companyId = this.userInfo.companyId
    this.query.userId = this.userInfo.userId
  },
  methods: {
    getTaskList() {
      let params = {
        data: this.query
      }
      findMyTaskListByPage(params).then((res) => {
        uni.stopPullDownRefresh()
        if (res.status == 200) {
          if (this.query.pageNum === 1) {
            this.listData = res.data.list || []
          } else {
            this.listData = this.listData.concat(res.data.list || [])
          }
          this.total = res.data.total
        } else {
          this.listData = []
        }
      })
    },
    handleSetSearchData(params) {
      this.query = {
        ...this.query,
        ...params
      }
      this.query.pageNum = 1
      this.getTaskList()
    },
    scrolltolower() {
      if (this.listData.length < this.total) {
        this.query.pageNum++
        this.getTaskList()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.order-list {
  height: 100%;
  overflow: hidden;
  display: grid;
  grid-template-rows: 100px 1fr;
  background-color: #f5f5f5;
  .list-content {
    display: flex;
    flex-direction: column;
    row-gap: 10px;
    overflow: hidden;
    .bottom-wrap {
      font-size: 30rpx;
      color: #999999;
      text-align: center;
      padding-bottom: 30rpx;
    }
    .e-empty {
      width: 100%;
      height: 100%;
      @include flx-dsp($jsc: center, $ali: center, $drt: column);
      .img-wrap {
        width: 75%;
      }
      .text-wrap {
        font-size: 30rpx;
        color: #999999;
      }
    }
  }
}
</style>
