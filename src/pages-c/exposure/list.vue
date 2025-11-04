<style lang="scss" scoped>
.exposure-list {
  $h: 90rpx;
  width: 100%;
  min-height: 100vh;
  background-color: #f6f6f7;
  padding-bottom: calc(#{$h} + 10rpx);
  box-sizing: border-box;
  .item {
    @include flx-dsp($jsc: flex-start, $ali: flex-start);
    background-color: #fff;
    border-bottom: 1rpx solid #eee;
    box-sizing: border-box;
    padding: 20rpx 20rpx;
    &-left {
      flex: 1;
      height: 150rpx;
      margin-right: 40rpx;
      @include flx-dsp($jsc: space-between, $ali: flex-end, $drt: column);
      .item-title {
        width: 100%;
        @include ellipsis($line: 2);
        font-size: 28rpx;
      }
      .item-left__bottom {
        font-size: 28rpx;
        width: 100%;
        @include flx-dsp($jsc: space-between, $ali: flex-end);
        color: #aaa;
        .view-style {
          color: var(--app-primary-color);
          ::v-deep .uni-icons {
            color: var(--app-primary-color) !important;
          }
          .view-count {
            margin-right: 4rpx;
          }
        }
      }
    }
    &-right {
      ::v-deep .u-image {
        width: 200rpx;
        height: 200rpx;
      }
    }
  }
  .bottom-bar{
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: $h;
    @include flx-dsp($jsc: center, $ali: center);
    background-color: var(--app-primary-color);
    & > view {
        &:first-child{
            border-right: 1rpx solid #fff;
        }
        flex: 1;
        height: 100%;
        @include flx-dsp($jsc: center, $ali: center);
        font-size: 28rpx;
        color: #fff;
        ::v-deep .u-icon__icon {
            color: #fff !important;
        }
        & > text{
            margin-left: 10rpx;
        }
    }
  }
}
</style>

<template>
  <view class="exposure-list" :style="[THEME_CSS_VAR]">
    <view class="item" v-for="(item, index) in dataList" :key="index" @click="navigate({data: item, page: 'detail'})">
      <view class="item-left">
        <text class="item-title">{{ item.title }}</text>
        <view class="item-left__bottom">
          <text>{{ item.date }}</text>
          <view class="view-style">
            <text class="view-count">{{ item.view }}</text>
            <uni-icons type="eye-filled" class="view-icon" size="16"></uni-icons>
          </view>
        </view>
      </view>
      <view class="item-right">
        <u--image :showLoading="true" radius="4px" mode="aspectFill" :src="item.image" width="240rpx" height="150rpx"></u--image>
      </view>
    </view>
    <u-loadmore v-if="showLoadmore" :status="status" />
    <u-empty v-if="showEmpty" mode="list" icon="http://cdn.uviewui.com/uview/empty/list.png"> </u-empty>
    <!-- 底部bar -->
    <view class="bottom-bar">
        <view @click="navigate({page: 'publish'})">
            <u-icon name="plus"></u-icon>
            <text>我要曝光</text>
        </view>
        <view @click="navigate({page: 'history'})">
            <u-icon name="edit-pen"></u-icon>
            <text>投稿历史</text>
        </view>
    </view>
  </view>
</template>

<script>
import util from '@/js/utils';
import { getMiniExposurePage } from '@/service/wxmanage'
export default {
  data() {
    return {
      dataList: [],
      page: {
        current: 1,
        size: 10,
      },
      loading: false,
      status: 'loadmore',
      initialized: false,
    };
  },
  computed: {
    showLoadmore() {
      return this.dataList.length !== 0;
    },
    showEmpty() {
      return !this.loading && this.dataList.length === 0;
    },
  },
  methods: {
    // 列表加载
    getDataList(params) {
      const { initialize } = params || {};
      const { current, size } = this.page;
      const { MEMBER_ID, AREA_ID, PROJECT_ID, IS_ASSOCIATION} = this.$constant;
      const projectId = util.storageAction({ key: PROJECT_ID, action: 'get' });
      const args = {
        data: {
          current,
          size,
          projectId,
          approveState: 2 // 通过 
        },
        hideLoading: this.initialized
      }
      const pms = getMiniExposurePage(args)

      this.status = 'loading';
      this.loading = true;
      pms.then((res) => {
          this.loading = false;
          this.initialized = true;
          if (initialize) uni.stopPullDownRefresh()
          if (res.success) {
            const { records } = res.data;
            const list = [];
            const lastedPage = records.length < size;
            if (Array.isArray(records)) {
              records.forEach((item) => {
                const { title, readNum, submitTime, file} = item
                const d = {
                  ...item,
                  title,
                  view: readNum,
                  date: submitTime,
                  image: file,
                };
                list.push(d);
              });
            }
            this.dataList = this.dataList.concat(list);
            if (!lastedPage) ++this.page.current;
            this.status = lastedPage ? 'nomore' : 'loadmore';
          } else {
            this.status = 'loadmore';
          }
        }).catch((_) => {
          this.loading = false;
          this.initialized = true;
          this.status = 'loadmore';
          if (initialize) uni.stopPullDownRefresh()
        });
    },
    // 跳转
    navigate(params) {
        const {page, data} = params || {}
        let route = null
        switch(page) {
            case 'detail':
            route = {url: `/pages-c/exposure/detail?detailId=${data.id}&increaseViews=1`}
            break
            case 'publish':
            route = {url: '/pages-c/exposure/publish'}
            break
            case 'history':
            route = {url: '/pages-c/exposure/history'}
            break
        }

        if (route) uni.navigateTo(route)
    }
  },
  onPullDownRefresh() {
    this.status = 'loadmore';
    this.dataList = [];
    this.page.current = 1
    this.getDataList({initialize: 1});
  },
  onReachBottom() {
    if (this.status != 'nomore') this.getDataList();
  },
  onLoad() {
    this.getDataList();
  },
};
</script>
