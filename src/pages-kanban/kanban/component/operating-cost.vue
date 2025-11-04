<style lang="scss" scoped>
.operating-cost {
  width: 100%;
  .items-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16rpx;
  }
  .cost-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex: 1;
    height: 120rpx;
    background-color: #f7f9ff;
    box-sizing: border-box;
    padding: 20rpx;
    & > view {
      text {
        font-size: 20rpx;
        color: #666;
      }
      text:nth-child(2) {
        display: block;
        font-size: 40rpx;
        font-weight: bold;
        color: #333;
      }
    }
  }
}
</style>

<template>
  <view class="operating-cost">
    <label-header :title="$t('经营成本')">
      <view slot="slot-left" style="margin-left: 16rpx"><switch-tabs @click="(evt) => updateAllData({ ...evt, key: 'unitType' })"></switch-tabs></view>
      <view class="items-box">
        <view class="cost-item">
          <view>
            <text>{{$t('月度经营成本')}}</text>
            <text>{{ monthlyCost }}</text>
          </view>
        </view>
        <view class="cost-item" style="margin-left: 22rpx">
          <view>
            <text>{{$t('季度经营成本')}}</text>
            <text>{{ seasonalCost }}</text>
          </view>
        </view>
      </view>
      <view class="cost-item">
        <view>
          <text>{{$t('年度经营成本')}}</text>
          <text>{{ yearlyCost }}</text>
        </view>
      </view>
    </label-header>
  </view>
</template>

<script>
import i18n from '../../../lang/index'

import { getOperatingCost } from '@/service/leasingbi_new';
import LabelHeader from '@/pages-kanban/kanban/component/label-header.vue';
import SwitchTabs from './switch-tabs.vue';
export default {
  data() {
    return {
      monthlyCost: 0,
      seasonalCost: 0,
      yearlyCost: 0,
      unitType: '2',
      commonParams: {},
    };
  },
  components: {
    LabelHeader,
    SwitchTabs
  },
  props: {
    tabs: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  methods: {
    // 加载数据
    init(params) {
      const { endTime = '', startTime, ...other } = params || this.commonParams || {};
      const [ymd] = endTime.split(' ') || []
      const args = {
        endDate: ymd || '',
        ...other,
        amountType: this.unitType
      };
      if (params) this.commonParams = params
      getOperatingCost({data: args}).then((res) => {
        if (res.status == 200) {
          const { quarterAmount, monthAmount, yearAmount } = res.data || {};
          this.monthlyCost = monthAmount;
          this.seasonalCost = quarterAmount;
          this.yearlyCost = yearAmount;
        }
      });
    },
     // 根据事件更新数据
     updateAllData(evt = {}) {
      const { value, key } = evt;
      this[key] = value;
      this.init();
    },
  },
};
</script>
