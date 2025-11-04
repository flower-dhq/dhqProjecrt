<template>
  <view class="page-panel" :style="[THEME_CSS_VAR]">
    <u-sticky bgcolor="#fff" offsetTop="0" customNavHeight="0">
      <view class="header-panel">
        <dropdown-btn
          ref="btnEl"
          maskTop="90rpx"
          :isAll="false"
          :navIndex="11"
          contentHeight="612rpx;"
          @confirm="areaProjectEvent"
          @showMask="hideMenuEvent('btn')"></dropdown-btn>
        <!-- <view class="area" @click="selectArea">
          <text class="select-name" style="margin-right:10rpx;">{{ searchForm.projectName }}</text>
          <image  v-show="searchForm.projectName" :src="require(`@/static/${[THEME_NAME]}/kanban/icon-white-down.png`)" style="width:16rpx;height:16rpx;margin-top:2rpx"></image>
        </view> -->
        <u-search
          placeholder="房号/客户姓名"
          v-model="searchForm.searchParams"
          shape="square"
          :showAction="false"
          searchIcon=" "
          height="56rpx"
          @blur="initData"
          @clear="handleClearSearchParams"
        />
      </view>
      <dropdown-filter ref="navigatorEl" @confirm="dropdownEvent" />
    </u-sticky>
    <payment-list v-for="(item, index) in dataList" :key="index" :item="item"></payment-list>
    <u-loadmore
      v-if="isLastPage || pageForm.loadMore == 'loading'"
      :status="pageForm.loadMore"
      line
    />
    <screening ref="screening" :top="p_height" @selectProject="selectProject"></screening>
  </view>
</template>

<script>
import menuAuthMixin from '@/js/mixin/menuAuthMixin'
import DropdownBtn from "@/components/dropdown-area/dropdown-btn.vue";
import DropdownFilter from "./dropdown-filter.vue";
import PaymentList from "@/pages-payment/modules/payment-list.vue";
import { getReminderNewListPagination } from "@/service/leasing";

import Screening from "@/components/screening-criteria/screening.vue";

export default {
  mixins: [menuAuthMixin],
  components: {
    DropdownBtn,
    DropdownFilter,
    PaymentList,
    Screening
  },
  authName: '催缴管理',
  data() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return {
      p_height: "88px",
      defaultDate: year + "-" + (month < 10 ? "0" + month : month),
      searchForm: {
        areaId: "",
        projectId: "",
        projectName: "",
        searchParams: "",
        reminderState: "",
        billEndDate: year + "-" + (month < 10 ? "0" + month : month)
      },
      pageForm: {
        current: 1,
        size: 10,
        total: 0,
        loadMore: "nomore" // loading, nomore
      },
      dataList: [],
      options: '',
    };
  },
  computed: {
    isLastPage() {
      return this.dataList.length >= this.pageForm.total;
    }
  },
  onPullDownRefresh() {
    this.initData();
  },
  async onReachBottom() {
    this.getData(this.pageForm.current + 1);
  },
  async onLoad(options) {
    // #ifdef MP-WEIXIN
    const res = wx.getSystemInfoSync();
    if (res.environment) {
      await this.$onLaunched;
    }

    // #endif
    this.options = options;

  },
  mounted() {
    this.$nextTick(() => {
      let d = document.getElementsByClassName("u-sticky__content")[0];
      this.p_height = d.clientHeight + "px";
    });
    if(this.options.areaId){
      this.$refs.btnEl.iniArea(this.options.areaId, this.options.projectId);
      this.$refs.navigatorEl.iniDate(this.options.billEndDate);
    }
  },
  methods: {
    selectArea() {
      this.$refs.screening.open();
    },
    selectProject(item) {
      this.searchForm.areaId = item.areaId;
      this.searchForm.projectId = item.projectId;
      this.searchForm.projectName = item.projectName;
      this.getData(1);
    },
    // 获取数据
    handleRequestData() {
      this.getData(this.pageForm.current);
    },
    async getData(pageIndex = 1) {
      const req = ({ size }) =>
        new Promise(resolve =>
          resolve({ data: new Array(size).fill(1), total: 25 })
        );

      if (pageIndex != 1 && this.isLastPage) {
        // 最后一页
        this.pageForm.loadMore = "nomore";
        return;
      }
      if (pageIndex == 1) {
        // 滚动到顶部
        this.dataList = [];
        this.pageForm.total = 0;
        uni.pageScrollTo({ scrollTop: 0 });
      }

      this.pageForm.loadMore = "loading";
      this.pageForm.current = pageIndex;

      const params = {
        data: {
          areaId: this.searchForm.areaId,
          projectId: this.searchForm.projectId || "",
          searchParams: this.searchForm.searchParams,
          reminderState: this.searchForm.reminderState,
          billEndDate:
            this.searchForm.billEndDate == "NaN-NaN"
              ? this.defaultDate
              : this.searchForm.billEndDate,
          nodeCategory: 1,
          excludeState: 3,
          pageIndex: this.pageForm.current,
          pageSize: this.pageForm.size
        },
        hideLoading: true
      };

      const res = await getReminderNewListPagination(params).finally(() => {
        uni.stopPullDownRefresh();
        this.pageForm.loadMore = "nomore";
      });

      let data = res?.data.records ?? [];
      this.dataList = pageIndex == 1 ? data : this.dataList.concat(data);
      this.pageForm.total = res.data.total || 0;
    },

    initData() {
      uni.$u.debounce(this.getData(1), 200);
    },
    areaProjectEvent(data) {
      this.searchForm = Object.assign(this.searchForm, {
        areaId: data.areaId,
        projectId: data.projectId
      });
      console.log("查询参数", this.searchForm);
      this.initData();
    },
    handleClearSearchParams() {
      this.searchForm.searchParams = "";
      this.initData();
    },
    dropdownEvent(data) {
      this.searchForm = Object.assign(this.searchForm, {
        reminderState: data.reminderState,
        billEndDate: data.billEndDate
      });
      console.log("查询参数", this.searchForm);
      this.initData();
    },
    hideMenuEvent(type) {
      if (type == "btn") {
        this.$refs.navigatorEl?.$refs?.dropdownEl?.showMaskEvent(false);
      } else if (type == "navigator") {
        this.$refs.btnEl.showMaskEvent(false);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.page-panel {
  padding-bottom: 20rpx;
  background-color: #f3f5f9;
  min-height: 100vh;
  box-sizing: border-box;
  font-family: "PingFang SC";
}
.header-panel {
  display: flex;
  align-items: center;
  background-color: #fff;
  border-bottom: 1px solid #f8f8f8;

  .select-name {
    font-size: 26rpx;
    font-family: PingFang SC;
  }

  .select-drop {
    position: relative;
    top: 2rpx;
    display: block;
    width: 20rpx;
  }

  ::v-deep .dropdown-btn {
    flex: 0 0 auto;
    padding: 14rpx 0 14rpx 24rpx;
    box-sizing: border-box;

    .content-panel {
      left: -24rpx;
    }
  }

  .area {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 26rpx;
    font-family: "PingFang SC";
    color: #ffffff;
    padding: 0 10rpx;
    background: #3f9eff;
    height: 60rpx;
    padding: 0 20rpx;
    margin-left: 24rpx;
    margin-right: 5px;
    border-radius: 6rpx;
  }
}
::v-deep .u-search {
  padding: 14rpx 24rpx 14rpx 16rpx;
  background-color: #fff;
}
::v-deep .workorder-sheet {
  margin: 20rpx 20rpx 0;
}
</style>
