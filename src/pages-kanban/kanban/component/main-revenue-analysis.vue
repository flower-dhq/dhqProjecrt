<style scoped lang="scss">
.main-revenue-analysis {
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
  <view class="main-revenue-analysis">
    <label-header :title="$t('主营业务收入')">
      <view slot="slot-left" style="margin-left: 16rpx"><switch-tabs @click="(evt) => updateAllData({ ...evt, key: 'unitType' })"></switch-tabs></view>
      <oval-tabs :value.sync="feeType" :tabs="mainRevenueTabs" @click="(evt) => updateAllData({ ...evt, key: 'feeType' })"></oval-tabs>
      <view class="bg-style" style="margin-top: 24rpx">
        <switch-tabs @click="(evt) => onPrefixEvent(evt, 'revenueAnalysis')" :tabs="revenueAnalysis.msy"></switch-tabs>
        <text class="inner-title">{{$t('收缴情况分析')}}</text>
        <view class="fee-items-row">
          <view class="fee-item">
            <text class="sub-title">{{revenueAnalysisPrefix}} {{$t('{0}度应收')}}</text>
            <text class="num-text">{{ revenueAnalysis.revenue }}</text>
          </view>
          <view class="fee-item">
            <text class="sub-title">{{revenueAnalysisPrefix}} {{$t('{0}度实收')}}</text>
            <text class="num-text">{{ revenueAnalysis.revenueActually }}</text>
          </view>
        </view>
        <view class="fee-items-row">
          <view class="fee-item">
            <text class="sub-title">{{revenueAnalysisPrefix}} {{$t('{0}度收缴率')}}</text>
            <text class="num-text">{{ revenueAnalysis.revenueRate }}</text>
          </view>
          <view class="fee-item">
            <text class="sub-title">{{revenueAnalysisPrefix}} {{$t('{0}度目标收缴率')}}</text>
            <text class="num-text">{{ revenueAnalysis.targetRevenueRate }}</text>
          </view>
        </view>
        <view class="fee-items-row">
          <view class="fee-item">
            <text class="sub-title">{{revenueAnalysisPrefix}} {{$t('{0}度预缴总金额')}}</text>
            <text class="num-text">{{ revenueAnalysis.totalAdvancePayment }}</text>
          </view>
          <view class="fee-item">
            <text class="sub-title">{{revenueAnalysisPrefix}} {{$t('{0}度指标数据')}}</text>
            <text class="num-text">{{ revenueAnalysis.indexData }}</text>
          </view>
        </view>
      </view>
      <text class="chart-title">{{$t('收缴趋势图')}}</text>
      <view>
        <qiun-data-charts :onmovetip="true" :ontouch="true" :canvas2d="true" :canvasId="'revenueLineChart'" type="line" :opts="lineOpts" :chartData="revenueChartData" />
      </view>
      <view class="bg-style" style="margin-top: 24rpx">
        <switch-tabs @click="(evt) => onPrefixEvent(evt, 'payingOffArrearsAnalysis')" :tabs="payingOffArrearsAnalysis.msy"></switch-tabs>
        <text class="inner-title">{{$t('清欠情况分析')}}</text>
        <view class="fee-items-row">
          <view class="fee-item">
            <text class="sub-title">{{ payingOffArrearsPrefix }} {{$t('{0}度清欠金额')}}</text>
            <text class="num-text">{{ payingOffArrearsAnalysis.amountOfPayingOffArrears }}</text>
          </view>
          <view class="fee-item">
            <text class="sub-title">{{ payingOffArrearsPrefix }} {{$t('{0}度清欠率')}}</text>
            <text class="num-text">{{ payingOffArrearsAnalysis.rateOfPayingOffArrears }}</text>
          </view>
        </view>
        <view class="fee-items-row">
          <view class="fee-item">
            <text class="sub-title">{{payingOffArrearsPrefix}} {{$t('{0}度清欠目标达成率')}}</text>
            <text class="num-text">{{ payingOffArrearsAnalysis.targetCompleteRateOfPayingOffArrears }}</text>
          </view>
          <view class="fee-item">
            <text class="sub-title">{{ payingOffArrearsPrefix }} {{$t('{0}度清缴指标数据')}}</text>
            <text class="num-text">{{ payingOffArrearsAnalysis.indexDataOfPayingOffArrears }}</text>
          </view>
        </view>
      </view>
      <text class="chart-title">{{$t('清欠趋势图')}}</text>
      <view>
        <qiun-data-charts :onmovetip="true" :ontouch="true" :canvas2d="true" :canvasId="'arrearsLineChart'" type="line" :opts="lineOpts" :chartData="arrearsChartData" />
      </view>
    </label-header>
  </view>
</template>

<script>
import i18n from '../../../lang/index'

import { collectionSituation, collectionChart, clearSituation, clearChart, getTargetSettingByPortal  } from '@/service/leasingbi_new';
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
            label: i18n.t('季'),
            value: 1,
          },
          {
            label: i18n.t('年'),
            value: 2,
          },
        ],
        revenue: 0,
        revenueActually: 0,
        revenueRate: '0%',
        targetRevenueRate: '0%',
        totalAdvancePayment: 0,
        indexData: 0,
      },
      payingOffArrearsAnalysis: {
        index: 0,
        msy: [
          {
            label: i18n.t('月'),
            value: 0,
          },
          {
            label: i18n.t('季'),
            value: 1,
          },
          {
            label: i18n.t('年'),
            value: 2,
          },
        ],
        amountOfPayingOffArrears: 0,
        rateOfPayingOffArrears: '0%',
        targetCompleteRateOfPayingOffArrears: '0%',
        indexDataOfPayingOffArrears: 0,
      },
      revenueTrend: [],
      revenueTrendMonth: [i18n.t('1月'), i18n.t('2月'), i18n.t('3月'), i18n.t('4月'), i18n.t('5月'), i18n.t('6月'), i18n.t('6月'), i18n.t('7月'), i18n.t('8月'), i18n.t('9月'), i18n.t('10月'), i18n.t('11月'), i18n.t('12月')],
      revenueTrendChart: null,
      payingOffTrend: [],
      payingOffTrendMonth: [i18n.t('1月'), i18n.t('2月'), i18n.t('3月'), i18n.t('4月'), i18n.t('5月'), i18n.t('6月'), i18n.t('6月'), i18n.t('7月'), i18n.t('8月'), i18n.t('9月'), i18n.t('10月'), i18n.t('11月'), i18n.t('12月')],
      payingOffTrendChart: null,
      mainRevenueTabs: [],
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
      arrearsChartData: {
        categories: [i18n.t('1月'), i18n.t('2月'), i18n.t('3月'), i18n.t('4月'), i18n.t('5月'), i18n.t('6月'), i18n.t('7月'), i18n.t('8月'), i18n.t('9月'), i18n.t('10月'), i18n.t('11月'), i18n.t('12月')],
        series: [
          {
            name: i18n.t('月清欠金额'),
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
  computed: {
    revenueAnalysisPrefix() {
      const { index } = this.revenueAnalysis;
      return index == 0 ? i18n.t('月度') : index == 1 ? i18n.t('季度') : i18n.t('年度');
    },
    payingOffArrearsPrefix() {
      const { index } = this.payingOffArrearsAnalysis;
      return index == 0 ? i18n.t('月度')  : index == 1 ? i18n.t('季度') : i18n.t('年度');
    },
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
      const { areaId, projectId, companyId, searchDate } = params || this.commonParams || {};

      if (this.mainRevenueTabs.length == 0) await this.getTargetSettingByPortal().catch(err => {})

      const feeType = this.feeType;
      const mainRevenueTabs = this.mainRevenueTabs.filter(item => item.target2ndLvlName != i18n.t('合计'))
      const allType = mainRevenueTabs.reduce((total, item) => (total += item.target2ndLvlType + ','), '');
      const commonParams = {
        areaId,
        projectId,
        searchDate,
        companyId,
        unitType: this.unitType,
        target2ndLvlType: feeType == -1 ? allType : feeType,
      };
      Object.assign(this.commonParams, commonParams);
      
      this.collectionSituation();
      this.collectionChart();
      this.clearSituation();
      this.clearChart();
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
          let data = res.data && res.data[0] || []
          const { receivableAmount = 0, receivedAmount = 0, percent = '0%', targetPercent = '0%', advanceAmount = 0, targetAmount = 0 } = data || {};

          const d = {
            revenue: receivableAmount,
            revenueActually: receivedAmount,
            revenueRate: percent,
            targetRevenueRate: targetPercent,
            totalAdvancePayment: advanceAmount,
            indexData: targetAmount,
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
    // 清欠情况分析
    clearSituation() {
      const { index } = this.payingOffArrearsAnalysis;
      const commonParams = this.commonParams;
      const params = {
        data: {
          ...commonParams,
          periodType: index + 1,
        },
      };
      clearSituation(params).then((res) => {
        if (res.status == 200) {
          let data = res.data && res.data[0]
          const { receivedAmount = 0, percent = '0%', targetPercent = '0%', targetAmount = 0 } = data || {};
          const d = {
            amountOfPayingOffArrears: receivedAmount,
            rateOfPayingOffArrears: percent,
            targetCompleteRateOfPayingOffArrears: targetPercent,
            indexDataOfPayingOffArrears: targetAmount,
          };
          Object.assign(this.payingOffArrearsAnalysis, d);
        }
      });
    },
    // 清欠趋势图
    clearChart() {
      const params = {
        data: this.commonParams
      };
      clearChart(params).then((res) => {
        if (res.status == 200) {
          const list = Array.isArray(res.data) ? res.data : [];
          const data = [];
          const month = [];
          list.forEach((item) => {
            const { chargePeriod, receivedAmount = 0 } = item;
            data.push(receivedAmount);
            month.push(chargePeriod);
          });

          this.arrearsChartData.series[0].data = data;
          this.arrearsChartData.categories = month;
        }
      });
    },
    // 获取主营业务收入类型
    getTargetSettingByPortal() {
      const callback = (res, type) => {
        const list = Array.isArray(res.data) ? res.data : [];
        const typeList = this.mainRevenueTabs;
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
      return getTargetSettingByPortal({data: { target_type: 5 }}).then((res) => {
        if (res.status == 200) {
          this.mainRevenueTabs = [];
          callback(res, 5);
        }
      });
    },
    // 根据事件更新数据
    updateAllData(evt = {}) {
      const { value, key } = evt;
      this[key] = value;
      this.init();
    },
  }
};
</script>
