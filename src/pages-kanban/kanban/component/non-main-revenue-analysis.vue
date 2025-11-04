<style scoped lang="scss">
.non-main-revenue-analysis {
  width: 100%;
  padding-top: 14rpx;
  $c: #2761ff;
  .bg-style {
    background-color: #f6f9ff;
    padding: 24rpx;
    box-sizing: border-box;
    width: 100%;
  }
  .inner-title {
    margin-top: 30rpx;
    font-weight: bold;
    font-size: 24rpx;
    color: $c;
    display: block;
  }
  .fee-items-row {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .fee-item {
      flex: 1;
      &:nth-child(2) {
        margin-left: 20rpx;
      }
      .sub-title {
        font-size: 20rpx;
        color: #666;
      }
      .num-text {
        display: block;
        font-weight: bold;
        font-size: 40rpx;
        color: #333333;
      }
    }
  }
  .chart-title {
    margin-top: 48rpx;
    margin-bottom: 30rpx;
    display: block;
    font-size: 24rpx;
    font-weight: bold;
    color: $c;
  }
}
</style>

<template>
  <view class="non-main-revenue-analysis">
    <label-header :title="$t('非主营业务收入')">
      <view slot="slot-left" style="margin-left: 16rpx"><switch-tabs @click="(evt) => updateAllData({ ...evt, key: 'unitType' })"></switch-tabs></view>
      <oval-tabs :value.sync="feeType" :tabs="nonMainRevenueTabs" @click="(evt) => updateAllData({ ...evt, key: 'feeType' })"></oval-tabs>
      <view class="bg-style" style="margin-top: 24rpx">
        <switch-tabs @click="(evt) => onPrefixEvent(evt, 'revenueAnalysis')" :tabs="revenueAnalysis.msy"></switch-tabs>
        <text class="inner-title">{{$t('收入情况分析')}}</text>
        <view class="fee-items-row">
          <view class="fee-item">
            <text class="sub-title">{{$t('实际收入金额')}}</text>
            <text class="num-text">{{ revenueAnalysis.revenueActually }}</text>
          </view>
          <view class="fee-item">
            <text class="sub-title">{{$t('目标收入金额')}}</text>
            <text class="num-text">{{ revenueAnalysis.targetAmountOfRevene }}</text>
          </view>
        </view>
        <view class="fee-items-row">
          <view class="fee-item">
            <text class="sub-title">{{$t('目标达成率')}}</text>
            <text class="num-text">{{ revenueAnalysis.completeRateOfTarget }}</text>
          </view>
        </view>
      </view>
      <text class="chart-title">{{$t('收入趋势图')}}</text>
      <view>
        <qiun-data-charts :onmovetip="true" :ontouch="true" :canvas2d="true" :canvasId="'revenueTrenndChart'" type="line" :opts="lineOpts" :chartData="revenueChartData" />
      </view>
    </label-header>
  </view>
</template>

<script>
import i18n from '../../../lang/index'

import { collectionSituation, collectionChart, getTargetSettingByPortal } from '@/service/leasingbi_new';
import LabelHeader from '@/pages-kanban/kanban/component/label-header.vue';
import OvalTabs from './oval-tabs.vue';
import SwitchTabs from './switch-tabs.vue';
export default {
  data() {
    return {
      revenueAnalysis: {
        index: 0,
        msy: [
          {
            label: i18n.t('月'),
            value: 0,
          },
          {
            label: i18n.t('季度'),
            value: 1,
          },
          {
            label: i18n.t('年'),
            value: 2,
          },
        ],
        revenueActually: 0,
        completeRateOfTarget: "0%",
        targetAmountOfRevene: 0,
      },
      revenueTrend: [],
      revenueTrendMonth: [i18n.t('1月'), i18n.t('2月'), i18n.t('3月'), i18n.t('4月'), i18n.t('5月'), i18n.t('6月'), i18n.t('6月'), i18n.t('7月'), i18n.t('8月'), i18n.t('9月'), i18n.t('10月'), i18n.t('11月'), i18n.t('12月')],
      revenueTrendChart: null,
      nonMainRevenueTabs: [],
      feeType: '',
      unitType: '2',
      lineOpts: {
        color: ['#FA6400', '#FAAD13'],
        padding: [15, 10, 0, 15],
        enableScroll: false,
        dataLabel: false,
        legend: {},
        xAxis: {
          fontSize: 10,
          labelCount: 6,
        },
        yAxis: {
          gridType: 'solid',
          dashLength: 8,
          gridColor: '#F3F4F7',
          splitNumber: 5,
          data: [
            {
              unit: '',
              type: 'value',
              axisLine: false,
              position: 'left',
              fontSize: 9,
            },
          ],
        },
        extra: {
          line: {
            type: 'straight',
            width: 2,
            activeType: 'solid',
          },
        },
      },
      revenueChartData: {
        categories: [i18n.t('1月'), i18n.t('2月'), i18n.t('3月'), i18n.t('4月'), i18n.t('5月'), i18n.t('6月'), i18n.t('7月'), i18n.t('8月'), i18n.t('9月'), i18n.t('10月'), i18n.t('11月'), i18n.t('12月')],
        series: [
          {
            name: i18n.t('月实收金额'),
            data: [],
          },
        ],
      },
      commonParams: {},
    };
  },
  components: {
    OvalTabs,
    SwitchTabs,
    LabelHeader,
  },
  methods: {
    // 月季度年切换
    onPrefixEvent(e, key) {
      const { value } = e;
      this[key].index = value;
      if (key == 'revenueAnalysis') this.collectionSituation();
      if (key == 'payingOffArrearsAnalysis') this.clearSituation();
    },
    // 加载数据
    async init(params) {
      const { areaId, projectId, companyId, searchDate } =  params || this.commonParams || {};

      if (this.nonMainRevenueTabs.length == 0) await this.getTargetSettingByPortal().catch(err => {})

      const feeType = this.feeType;
      const nonMainRevenueTabs = this.nonMainRevenueTabs.filter(item => item.target2ndLvlName != i18n.t('合计'))
      const allType = nonMainRevenueTabs.reduce((total, item) => (total += item.target2ndLvlType + ','), '');
      const commonParams = {
        areaId,
        projectId,
        searchDate,
        companyId,
        unitType: this.unitType,
        target2ndLvlType: feeType == -1 ? allType : feeType,
      };

      this.commonParams = Object.assign(this.commonParams, commonParams);

      if (nonMainRevenueTabs.length == 0) await this.getTargetSettingByPortal().catch(err => {})
      this.collectionSituation();
      this.collectionChart();
    },
    // 收缴情况分析
    collectionSituation() {
      const { index } = this.revenueAnalysis;
      const commonParams = this.commonParams;
      const params = {
        data: {
          ...commonParams,
          periodType: index + 1,
        },
      };
      collectionSituation(params).then((res) => {
        if (res.status == 200) {
          let data = res.data && res.data[0]
          const { receivableAmount = 0, receivedAmount = 0, percent = '0%', targetPercent = '0%', advanceAmount = 0, targetAmount = 0 } = data || {};

          const d = {
            revenueActually: receivedAmount,
            completeRateOfTarget: targetPercent,
            targetAmountOfRevene: targetAmount,
          };

          Object.assign(this.revenueAnalysis, d);
        }
      });
    },
    // 收缴趋势图
    collectionChart() {
      const params = {
        data: this.commonParams,
      };
      collectionChart(params).then((res) => {
        if (res.status == 200) {
          const list = Array.isArray(res.data) ? res.data : [];
          const data = [];
          const month = [];
          list.forEach((item) => {
            const { chargePeriod, receivedAmount = 0 } = item;
            month.push(chargePeriod);
            data.push(receivedAmount);
          });
          this.revenueChartData.series[0].data = data;
          this.revenueChartData.categories = month;
        }
      });
    },
    // 获取主营业务收入类型
    getTargetSettingByPortal() {
      const callback = (res, type) => {
        const list = Array.isArray(res.data) ? res.data : [];
        const typeList = this.nonMainRevenueTabs;
        list.map((item) => {
          const { target2ndLvlName, target2ndLvlType } = item;

          typeList.push({
            ...item,
            label: target2ndLvlName,
            value: target2ndLvlType,
          });
          if (target2ndLvlName == i18n.t('合计')) this.feeType = target2ndLvlType || ''
        });
      };
      // 主营业务收入 5   非主营业务收入 6
      return getTargetSettingByPortal({data: { target_type: 6 }}).then((res) => {
        if (res.status == 200) {
          this.nonMainRevenueTabs = [];
          callback(res, 6);
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
