<template>
  <view class="task-count">
    <card-title title="数据概述"></card-title>
    <view class="count-wrap">
      <type-filter @filterChange="filterChange"></type-filter>
      <view class="count-body">
        <count-item v-for="(item, index) in countList" :key="index" :data="item" :changeName="changeName"></count-item>
      </view>
    </view>
  </view>
</template>
<script>
import cardTitle from './cardTitle.vue'
import typeFilter from './typeFilter.vue'
import countItem from './countItem.vue'

import { getQuestionTasDataOverview } from '../../../service/crm6.0'
export default {
  name: 'taskCount',
  components: { cardTitle, typeFilter, countItem },
  data() {
    return {
      query: {},
      countList: [
        {
          name: '工单总数',
          num: '0',
          changeNum: 0,
          numKey: 'taskNum',
          changeNumKey: 'totalCompareRate'
        },
        {
          name: '内部工单总数',
          num: '0',
          changeNum: 0,
          numKey: 'innerTaskNum',
          changeNumKey: 'innerTaskCompareRate'
        },
        {
          name: '客户工单总数',
          num: '0',
          changeNum: 0,
          numKey: 'customTaskNum',
          changeNumKey: 'customTaskCompareRate'
        },
        {
          name: '待派单',
          num: '0',
          changeNum: 0,
          numKey: 'waitGiveOutNum',
          changeNumKey: 'waitGiveOutCompareRate'
        },
        {
          name: '待接单',
          num: '0',
          changeNum: 0,
          numKey: 'waitAcceptNum',
          changeNumKey: 'waitaccepteCompareRate'
        },
        {
          name: '接单率',
          num: '100%',
          changeNum: 0,
          numKey: 'acceptRate',
          changeNumKey: 'acceptedRateCompareRate'
        },
        {
          name: '待审核',
          num: '0',
          changeNum: 0,
          numKey: 'waitApproveNum',
          changeNumKey: 'waitApproveCompareRate'
        },
        {
          name: '已完成',
          num: '0',
          changeNum: 0,
          numKey: 'finishedNum',
          changeNumKey: 'finishedCompareRate'
        },
        {
          name: '处理完成率',
          num: '100%',
          changeNum: 0,
          numKey: 'finishRate',
          changeNumKey: 'finishedRateCompareRate'
        },
        {
          name: '待确认',
          num: '0',
          changeNum: 0,
          numKey: 'waitAffirmNum',
          changeNumKey: 'waitAffirmCompareRate'
        },
        {
          name: '已关闭',
          num: '0',
          changeNum: 0,
          numKey: 'closedNum',
          changeNumKey: 'closedCompareRate'
        },
        {
          name: '关闭率',
          num: '100%',
          changeNum: 0,
          numKey: 'closeRate',
          changeNumKey: 'closedRateCompareRate'
        }
      ],
      changeName: '较去年',
      localQuery: {
        taskTypeId: '',
        dateValue: '',
        dateType: ''
      },
      allCount: {},
      userInfo: {}
    }
  },
  created() {
		const { O_USER_INFO } = this.$constant;
		this.userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' }); 
	},
  mounted() {},
  methods: {
    filterChange(data) {
      this.localQuery = data
      this.localQuery = {
        taskTypeId: data.serverId || '',
        dateType: data.tabVal === 'years' ? '1' : '2'
      }
      if (data.tabVal === 'years') {
        this.localQuery.dateValue = this.$dayjs(data.dateVal).format('YYYY')
      } else {
        this.localQuery.dateValue = this.$dayjs(data.dateVal).format('YYYY-MM')
      }
      this.changeName = data.tabVal == 'years' ? '较去年' : '较上月'
      this.getCounts()
    },
    getCounts(query) {
      if (query) {
        this.query = query
        console.log(this.query)
      }
      let params = {
        data: {
          companyId: this.userInfo.companyId,
          areaId: this.query.areaId || '',
          projectId: this.query.projectId || '',
          userId: this.userInfo.userId,
          ...this.localQuery
        }
      }
      getQuestionTasDataOverview(params).then((res) => {
        if (res.status == '200') {
          this.allCount = res.data
          this.countList.forEach((ele) => {
            ele.num = this.allCount[ele.numKey] || 0
            ele.changeNum = Number(parseFloat((this.allCount[ele.changeNumKey] || 0) * 100).toFixed(2))
            console.log(ele)
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.task-count {
  padding: 30rpx 0;
  background: #ffffff;
  .count-wrap {
    padding: 0 30rpx;
  }
  .count-body {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    .count-item {
      border-bottom: 1rpx solid #eaeaea;
      position: relative;
      &:not(:nth-child(3n + 3)):after {
        content: '';
        position: absolute;
        right: 0;
        top: 50%;
        transform: translate(0, -50%);
        width: 0;
        height: 80rpx;
        border-right: 1rpx solid #eaeaea;
      }
      &:last-child:after {
        display: none;
      }
      &:nth-child(10) {
        border-bottom: 0 solid #eaeaea;
      }
      &:nth-child(11) {
        border-bottom: 0 solid #eaeaea;
      }
      &:nth-child(12) {
        border-bottom: 0 solid #eaeaea;
      }
    }
  }
}
</style>
