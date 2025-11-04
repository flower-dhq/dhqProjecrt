<template>
  <view class="page-panel" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
    <u-swiper :list="swiperList" :height="200" :radius="0"  @change="e => current = e.current" keyName="picture" @click="bannerClick">
      <view slot="indicator" class="indicator">
        <template v-if="swiperList.length>1">
          <view class="indicator__dot" v-for="(item, index) in swiperList" :key="index" :class="[index === current && 'indicator__dot--active']">
          </view>
        </template>
      </view>
    </u-swiper>
    <view class="card__title">热门卡证</view>

    <view class="card__box" v-for="(item, index) in releaseData" :key="index" @click="linkTo(item)">
      <u-image :showLoading="true" :src="item.cardImageFullPath" width="120px" height="80px" />
      <view class="card__content">
        <text class="card__content__title">{{ item.cardName }}</text>
        <view class="card__content--bright">
          <text>￥</text><text class="card__content--stress">{{ item.cardFirstPrice }}</text><text>元/{{ item.cardFirstPriceUnit }}</text>
        </view>
      </view>
    </view>

    <!-- 空数据 -->
    <u-empty v-if="!pageObj.count" mode="list" icon="http://cdn.uviewui.com/uview/empty/list.png" />
    <u-loadmore v-if="pageObj.loading || isLastPage" :status="pageObj.loading ? 'loading' : 'nomore'" />
  </view>
</template>

<script>
import { getCardList } from '@/service/returnVisit'
import { getShelvesList, addGbSlideRead } from '@/service/community'
import Utils from '@/js/utils'

export default {
  name: 'CardHandleList',
  data() {
    const { AREA_ID, PROJECT_ID, MEMBER_ID } = this.$constant

    return {
      current: 0,
      areaId: Utils.storageAction({ key: AREA_ID, action: 'get' }),
      projectId: Utils.storageAction({ key: PROJECT_ID, action: 'get' }),
      memberId: Utils.storageAction({ key: MEMBER_ID, action: 'get' }),
      swiperList: [],
      pageObj: { // 页码
        index: 1,
        count: 0,
        loading: false
      },
      releaseData: [], // 列表数据
    }
  },
  computed: {
    // 是否为最后一页
    isLastPage() {
      return this.pageObj.count && this.releaseData.length === this.pageObj.count
    }
  },
  onLoad() {
    this.getShelvesList()
    this.getCardList(1)
  },
  /**监听用户下拉刷新 */
  onPullDownRefresh() {
    this.getCardList(1)
  },
  onReachBottom() {
    // 判断是否为最后一页
    if (this.pageObj.count === this.releaseData.length) return

    this.getCardList(this.pageObj.index + 1)
  },
  methods: {
    async getShelvesList() {
      const params = {
        data:{
          projectId: this.projectId,
          toolsTypes: 'ad_cardHandling'
        }
      }
      const res = await getShelvesList(params)
      const data = res.data?.records || []

      this.swiperList = data.filter(item => item.recommendType == 'ad_cardHandling')
    },
    async getCardList(pageIndex) {
      this.pageObj.index = pageIndex
      if (pageIndex == 1) {
        this.releaseData = []
      } else {
        this.pageObj.loading = true
      }

      const params = {
        projectId: '',
        areaId: this.areaId,
        pageNum: 1,
        pageSize: 10,
        publishStatus: 1
      }
      const res = await getCardList(params).finally(() => {
        uni.stopPullDownRefresh()
        this.pageObj.loading = false
      })
      let data = res.data || {}

      this.pageObj.count = data.total || 0
      if (pageIndex == 1) {
        this.releaseData = data.list || []
      } else {
        this.releaseData = [].concat(this.releaseData, data.list || [])
      }
    },
    linkTo(item) {
      uni.navigateTo({ url: Utils.spliceGetUrl('/pages-d/card-manage/card-handle-detail', { id: item.id }) })
    },
    // banner点击事件
    bannerClick(e) {
      let info = this.swiperList[e];
      const { O_USER_INFO } = this.$constant;
      let userInfo = Utils.storageAction({ key: O_USER_INFO, action: 'get' });
      console.log('info====',info)
      var params = {
        data: {
            slideInfoId: info.slideinfoId,
            userId: this.memberId,
            userName: userInfo.fullName,
        },
        hideLoading: true,
      }
      // 链接类型(0、未有链接 1、文章 2、商品  3、外链 4、优惠券 5、活动,6、问卷)
      if (info.linkType == 0) {
          return
      } else if (info.linkType == 1) {
          addGbSlideRead(params);
          uni.navigateTo({ url: `/pages-b/announcement/detail?articleId=${info.url}` });
      } else if (info.linkType == 3) {
          uni.navigateTo({
              url: `/pages-d/webview/webview?url=${info.url}`
          })
      } else if (info.linkType == 5) {
          addGbSlideRead(params);
          uni.navigateTo({ url: `/pages-d/activity/activityDetail?aid=${info.url}` });
      } else if (info.linkType == 6) {
          addGbSlideRead(params);
          uni.navigateTo({ url: `/pages-c/questionnaire/detail?id=${info.url}` });
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.page-panel {
  min-height: 100vh;
  background-color: rgb(245, 245, 245);
  display: flex;
  flex-direction: column;
}
.card__title {
  margin-top: 15px;
  height: 40px;
  line-height: 40px;
  padding-left: 13px;
  background-color: #fff;
  position: sticky;
  z-index: 10;
  top: 0;
}
.card__box {
  display: flex;
  background-color: #fff;
  padding: 15px 13px;
}
.u-image {
  flex: 0 0 auto;
}
.card__content {
  display: flex;
  flex-direction: column;
  flex: 1;
  font-size: 12px;
  padding: 10px 0;
  margin-left: 10px;

  .card__content__title {
    font-weight: bold;
    word-break: break-all;
    height: 100%;
    @include textEllipsis(2);
  }
  .card__content--bright {
    color: var(--app-primary-color);
    flex: 0 0 auto;
  }
  .card__content--stress {
    font-size: 18px;
  }
}
.indicator {
  @include flex(row);
  justify-content: center;

  &__dot {
    height: 6px;
    width: 6px;
    border-radius: 100px;
    background-color: rgba(255, 255, 255, 0.35);
    margin: 0 5px;
    transition: background-color 0.3s;

    &--active {
        background-color: var(--app-primary-color);
    }
  }
}
::v-deep .u-loadmore {
  flex: 0 !important;
}
</style>