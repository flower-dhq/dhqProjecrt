<template>
  <view class="stat-chart">
    <card-title title="月度统计"></card-title>
    <view class="chart-wrap">
      <view class="chart-body">
        <qiun-data-charts type="line" :opts="opts" :chartData="chartData" tooltipFormat="tooltipStat" />
      </view>
    </view>
  </view>
</template>
<script>
import { getQuestionTaskMonthRate } from '../../../service/crm6.0'

import cardTitle from './cardTitle.vue'
export default {
  name: 'statChart',
  components: { cardTitle },
  data() {
    return {
      query: {},
      taskMonthRate: [],
      chartData: {
        categories: [],
        series: []
      },
      opts: {
        color: ['#2761FF', '#FE9901'],
        fontSize: 12,
        padding: [0, 0, 0, 0],
        dataPointShapeType: 'hollow',
        dataLabel: false,
        enableScroll: false,
        legend: {
          position: 'top'
        },
        xAxis: {
          disableGrid: true,
          titleOffsetY: 30
        },
        yAxis: {
          gridType: 'solid',
          gridColor: '#EAEAEA',
          titleFontSize: 12,
          data: [
            {
              min: 0,
              max: 100,
              unit: '%',
              axisLine: false
            }
          ]
        },
        extra: {
          line: {
            type: 'straight',
            width: 2,
            activeType: 'hollow'
          }
        }
      }
    }
  },
  methods: {
    getEcharts(query) {
      const { O_USER_INFO } = this.$constant;
      let userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' }); 
      this.query = query
      let params = {
        data: {
          companyId: userInfo.companyId,
          areaId: this.query.areaId || '',
          projectId: this.query.projectId || '',
          userId: userInfo.userId
        }
      }
      getQuestionTaskMonthRate(params).then((res) => {
        this.taskMonthRate = res.data
        this.chartData = {
          categories: [],
          series: [
            {
              name: '完成率',
              data: []
            },
            {
              name: '关闭率',
              data: []
            }
          ]
        }
        this.taskMonthRate.forEach((ele) => {
          this.chartData.categories.push(ele.monthStr)
          this.chartData.series[0].data.push(Number(parseFloat(ele.completeRate * 100).toFixed(2)))
          this.chartData.series[1].data.push(Number(parseFloat(ele.closeRate * 100).toFixed(2)))
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.stat-chart {
  padding: 30rpx 0;
  background: #ffffff;
  margin-bottom: 24rpx;
  .chart-wrap {
    padding: 0 30rpx;
    .chart-body {
      width: 100%;
      height: 360rpx;
    }
  }
}
</style>
