<template>
  <view class="page-panel">
    <u-list height="calc(100vh - 44px)" @scrolltolower="onScrollBottom">
      <u-list-item v-for="(item, index) in releaseData" :key="index">
        <view class="card__box" @click="linkTo(item)">
          <view class="card__box--left">
            <cell-text label="放行人员" border="none" style="padding-bottom: 0;">{{ item.pedestriansName }}</cell-text>
            <cell-text label="放行日期" border="none">{{ $options.filters.getDateRange(item.startTime) }} ~ {{ $options.filters.getDateRange(item.endTime) }}</cell-text>
          </view>
          <u-icon class="card_box--right" name="arrow-right" />
        </view>
      </u-list-item>

      <!-- 空数据 -->
      <u-empty v-if="!pageObj.count" mode="list" icon="http://cdn.uviewui.com/uview/empty/list.png" />
      <u-loadmore v-if="pageObj.count && releaseData.length === pageObj.count" status="nomore" />
    </u-list>
  </view>
</template>

<script>
import CellText from '@/components/cell-text/cell-text.vue'
import Utils from '@/js/utils'
import { findDecPassList } from '@/service/wxmanage'

export default {
  name: 'ReleaseAnnounceList',
  components: {
    CellText
  },
  data() {
    const { MEMBER_ID, COMPLANY_ID } = this.$constant

    return {
      companyId: Utils.storageAction({ key: COMPLANY_ID, action: 'get' }),
      memberId: Utils.storageAction({ key: MEMBER_ID, action: 'get' }),
      pageObj: { // 页码
        index: 1,
        count: 0
      },
      releaseData: [], // 列表数据
    }
  },
  filters: {
    getDateRange(val) {
      return val ? uni.$u.timeFormat(val, 'yyyy-mm-dd hh:MM') : ''
    }
  },
  created() {
    this.getList(this.pageObj.index)
  },
  /**监听用户下拉刷新 */
  onPullDownRefresh() {
    this.getList(1)
  },
  methods: {
    async getList(pageIndex) {
      this.pageObj.index = pageIndex
      if (pageIndex == 1) {
        this.releaseData = []
      }

      const params = {
        submitter: this.memberId,
        companyId: this.companyId,
        current: this.pageObj.index,
        size: 10,
        type: 1,
      }
      const res = await findDecPassList(params).finally(() => {
        uni.stopPullDownRefresh()
      })
      const data = res.data || {}
      const releaseDataTmp = data.records || []

      this.pageObj.count = data.total || 0
      if (pageIndex == 1) {
        this.releaseData = releaseDataTmp
      } else {
        this.releaseData = [].concat(this.releaseData, releaseDataTmp)
      }
    },
    onScrollBottom() {
      // 判断是否为最后一页
      if (this.pageObj.count === this.releaseData.length) return

      this.getList(this.pageObj.index + 1, this.selTab.id)
    },
    linkTo(item) {
      uni.navigateTo({
        url: Utils.spliceGetUrl('/pages-c/goods-release/release-announce-detail', { passId: item.releaseId })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-panel {
  min-height: 100vh;
  background-color: rgb(245, 245, 245);
  // padding-top: 44px;
}

.u-tabs {
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: #fff;
}

.u-list-item {
  margin: 10px 10px 0;
}

.card__box {
  display: flex;
  align-items: center;
  background-color: #fff;
  border-radius: 8px;
}
.card__box--left {
  display: flex;
  flex-direction: column;
  flex: 1;
  font-size: 14px;
  padding: 0 15px;
}
.card_box--right {
  flex: 0 0 auto;
  padding-right: 15px;
}
</style>