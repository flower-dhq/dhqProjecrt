<style lang="scss" scoped>
.publish-history {
  width: 100%;
  min-height: 100vh;
  background-color: #f6f6f7;
  box-sizing: border-box;
  padding-top: 54px;
  padding-bottom: 10px;
  ::v-deep .u-tabs__wrapper__nav__item {
    flex: 1;
    padding: 0 !important;
  }
  .tabs-box {
    width: 100%;
    position: fixed;
    width: 100%;
    left: 0;
    top: 0;
    background-color: #fff;
    z-index: 99;
  }
  .data-list {
    .item {
      & > view {
        @include flx-dsp($jsc: flex-start, $ali: flex-start);
        background-color: #fff;
        border-bottom: 1rpx solid #eee;
        box-sizing: border-box;
        padding: 20rpx 20rpx;
      }
      &-left {
        flex: 1;
        height: 150rpx;
        margin-right: 40rpx;
        @include flx-dsp($jsc: space-between, $ali: flex-end, $drt: column);
        .item-left__top {
          width: 100%;
          @include flx-dsp($jsc: space-between, $ali: center);
          font-size: 28rpx;
          .flag {
            display: block;
            color: #fff;
            padding: 6rpx 10rpx;
            background-color: var(--app-primary-color);
            font-size: 24rpx;
            border-radius: 10rpx;
            font-size: 12px;
          }
        }
        .item-title {
          flex: 1;
          width: 100%;
          @include ellipsis($line: 2);
        }
        .item-left__bottom {
          font-size: 28rpx;
          width: 100%;
          @include flx-dsp($jsc: space-between, $ali: flex-end);
          color: #aaa;
          .date {
            flex: 1;
          }
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
        position: relative;
        .status-flag{
          position: absolute;
          right: 0;
          top: 0;
          z-index: 9;
          display: block;
          background-color: transparent;
          font-size: 12px;
          border-radius: 0 0 8rpx 8rpx;
          background-color: rgba($color: #fff, $alpha: 0.5);
          padding: 6rpx 10rpx;
        }
        ::v-deep .u-image {
          width: 200rpx;
          height: 200rpx;
        }
        .cancel-btn{
          margin-top: 20rpx;
          @include flx-dsp($jsc: flex-end, $ali: center);
          & > text {
            $color: var(--app-primary-color);
            display: inline-block;
            border: 1rpx solid  $color;
            color: $color;
            font-size: 24rpx;
            border-radius: 20rpx;
            text-align: center;
            padding: 10rpx 40rpx;
            border-radius: 8rpx;
            padding: 12rpx 60rpx;
          }
        }
      }
    }
  }
}
</style>

<template>
  <view class="publish-history" :style="[THEME_CSS_VAR]">
    <view class="tabs-box">
      <u-tabs :list="tabs" :lineColor="THEME_COLOR" @click="tabClick"></u-tabs>
    </view>
    <view class="data-list">
      <view class="item" v-for="(item, index) in dataList" :key="index" @click="navigate(item)">
        <view>
          <view class="item-left">
            <view class="item-left__top">
              <text class="item-title">{{ item.title }}</text>
              <text v-if="tabIndex === 1 && item.isReply" class="flag">有回复</text>
            </view>
            <view class="item-left__bottom">
              <text class="date">{{ item.date }}</text>
              <view class="view-style" v-if="tabIndex === 1">
                <text class="view-count">{{ item.view }}</text>
                <uni-icons type="eye-filled" class="view-icon" size="16"></uni-icons>
              </view>
            </view>
          </view>
          <view class="item-right">
            <text class="status-flag" :style="{color: statusColor}">{{statusText}}</text>
            <u--image :showLoading="true" radius="4px" mode="aspectFill" :src="item.image" width="240rpx" height="150rpx"></u--image>
            <view class="cancel-btn" v-if="tabIndex <= 1">
              <text @click.stop="cancelExposure(item)">取消</text>
            </view>
          </view>
        </view>
      </view>
      <u-loadmore v-if="showLoadmore" :status="status" />
      <u-empty v-if="showEmpty" mode="list" icon="http://cdn.uviewui.com/uview/empty/list.png"> </u-empty>
      
    </view>
    <custom-modal ref="customModal"></custom-modal>
  </view>
</template>

<script>
import util from '@/js/utils';
import { getMiniExposureListByMemberId, cancelMiniExposure } from '@/service/wxmanage'
export default {
  data() {
    return {
      tabs: [
        {
          name: '审核中(0)',
        },
        {
          name: '已通过(0)',
        },
        {
          name: '已驳回(0)',
        },
        {
          name: '已取消(0)',
        },
      ],
      tabIndex: 0,
      dataList: [],
      page: {
        current: 1,
        size: 10,
      },
      loading: false,
      status: 'loadmore',
      initialized: false,
      refresh: false
    };
  },
  computed: {
    showLoadmore() {
      const length = this.dataList.length
      return length !== 0 || (this.initialized && length == 0 && !this.refresh && this.loading);
    },
    showEmpty() {
      return !this.loading && this.dataList.length === 0;
    },
    statusText() {
      const index = this.tabIndex;
      return index === 0 ? '待审核' : index === 1 ? '已通过' : index === 2 ? '已驳回' : '已取消'
    },
    statusColor() {
      const index = this.tabIndex;
      return index === 0 ? 'red' : index === 1 ? 'green' : index === 2 ? 'red' : 'purple'
    },
  },
  methods: {
    // 数据列表
    getDataList(params) {
      const { initialize } = params || {};
      const { current, size } = this.page;
      const tabIndex = this.tabIndex;
      const { MEMBER_ID } = this.$constant;
      const memberId = util.storageAction({ key: MEMBER_ID, action: 'get' });
      const args = {
        data: {
          memberId,
          current,
          size,
          approveState: tabIndex + 1
        },
        hideLoading: this.initialized
      }
      const pms = getMiniExposureListByMemberId(args)
      this.status = 'loading';
      this.loading = true;
      pms
        .then((res) => {
          this.loading = false;
          this.initialized = true;
          this.refresh = false;
          if (initialize) uni.stopPullDownRefresh();
          if (res.success) {
            const { records, approveCount } = res.data;
            const statusCount = approveCount || {}
            const list = [];
            const lastedPage = records.length < size;

            // 各个状态条数
            this.tabs[0].name = `审核中(${statusCount?.waitCount || 0})`
            this.tabs[1].name = `已通过(${statusCount?.passCount || 0})`
            this.tabs[2].name = `已驳回(${statusCount?.rejectCount || 0})`
            this.tabs[3].name = `已取消(${statusCount?.cancelCount || 0})`

            // 列表
            if (Array.isArray(records)) {
              records.forEach((item) => {
                const { title, readNum, submitTime, file } = item
                const d = {
                  ...item,
                  title,
                  date: submitTime,
                  image: file,
                  view: readNum,
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
        })
        .catch((_) => {
          this.loading = false;
          this.refresh = false;
          this.initialized = true;
          this.status = 'loadmore';
          if (initialize) uni.stopPullDownRefresh();
        });
    },
    // tab切换
    tabClick({ index }) {
      this.tabIndex = index;
      this.status = 'loadmore';
      this.page.current = 1;
      this.dataList = [];
      this.getDataList();
    },
    // 跳转
    navigate(params) {
      const {id} = params || {}
      uni.navigateTo({url: `/pages-c/exposure/detail?detailId=${id}`})
    },
    // 取消曝光
    cancelExposure(params) {
      const { id } = params || {}
      this.$refs.customModal.show({
          content: '您确定要取消此曝光吗？',
          showConfirmButton: true,
          showCancelButton: true,
          confirmText: "确定",
          cancelText: '取消',
          onConfirm: () => {
            const { MEMBER_ID } = this.$constant;
            const memberId = util.storageAction({ key: MEMBER_ID, action: 'get' });
            const args = {
              data: {
                exposureId: id,
                memberId
              },
              responseToast: true,
              successfulText: '取消成功' 
            }
            cancelMiniExposure(args).then(res => {
              if (res.success) {
                this.tabClick({index: this.tabIndex})
              }
            })
          }
      })
    }
  },
  onPullDownRefresh() {
    this.status = 'loadmore';
    this.page.current = 1;
    this.dataList = [];
    this.refresh = true;
    this.getDataList({ initialize: 1 });
  },
  onReachBottom() {
    if (this.status != 'nomore') this.getDataList();
  },
  onLoad(){
    this.getDataList()
  }
};
</script>
