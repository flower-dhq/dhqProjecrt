<template>
  <view class="task-count">
    <card-title title="数据概述"></card-title>
    <view class="count-wrap">
      <type-filter @filterChange="filterChange"></type-filter>
      <view class="count-body">
        <count-item2 v-for="(item, index) in countList" :key="index" :data="item" :changeName="changeName"></count-item2>
      </view>
    </view>
  </view>
</template>
<script>
import cardTitle from './cardTitle.vue'
import typeFilter from './typeFilter.vue'
import countItem2 from './countItem2.vue'
import { getQuestionTaskWarnReport } from '../../../service/crm6.0'

export default {
  name: 'taskCount2',
  components: { cardTitle, typeFilter, countItem2 },
  data() {
    return {
      countList: [
        {
          name: '派单超期',
          num: 0,
          numKey: 'giveoutWarnNum',
          yjList: [
            {
              yjName: '一级预警数',
              yjNum: 0,
              yjLv: 0,
              changeNum: 0,
              numKey: 'giveoutFirstNum',
              LvKey: 'giveoutFirstRate',
              changeNumKey: 'giveoutFirstCompareRate'
            },
            {
              yjName: '二级预警数',
              yjNum: 0,
              yjLv: 0,
              changeNum: 0,
              numKey: 'giveoutSecondNum',
              LvKey: 'giveoutSecondRate',
              changeNumKey: 'giveoutSecondCompareRate'
            },
            {
              yjName: '三级预警数',
              yjNum: 0,
              yjLv: 0,
              changeNum: 0,
              numKey: 'giveoutThirdNum',
              LvKey: 'giveoutThirdRate',
              changeNumKey: 'giveoutThirdCompareRate'
            }
          ]
        },
        {
          name: '接单超期',
          num: 0,
          numKey: 'acceptWarnNum',
          yjList: [
            {
              yjName: '一级预警数',
              yjNum: 0,
              yjLv: 0,
              changeNum: 0,
              numKey: 'acceptFirstNum',
              LvKey: 'acceptFirstRate',
              changeNumKey: 'acceptFirstCompareRate'
            },
            {
              yjName: '二级预警数',
              yjNum: 0,
              yjLv: 0,
              changeNum: 0,
              numKey: 'acceptSecondNum',
              LvKey: 'acceptSecondRate',
              changeNumKey: 'acceptSecondCompareRate'
            },
            {
              yjName: '三级预警数',
              yjNum: 0,
              yjLv: 0,
              changeNum: 0,
              numKey: 'acceptThirdNum',
              LvKey: 'acceptThirdRate',
              changeNumKey: 'acceptThirdCompareRate'
            }
          ]
        },
        {
          name: '审批超期',
          num: 0,
          numKey: 'approveWarnNum',
          yjList: [
            {
              yjName: '一级预警数',
              yjNum: 0,
              yjLv: 0,
              changeNum: 0,
              numKey: 'approveFirstNum',
              LvKey: 'approveFirstRate',
              changeNumKey: 'approveFirstCompareRate'
            },
            {
              yjName: '二级预警数',
              yjNum: 0,
              yjLv: 0,
              changeNum: 0,
              numKey: 'approveSecondNum',
              LvKey: 'approveSecondRate',
              changeNumKey: 'approveSecondCompareRate'
            },
            {
              yjName: '三级预警数',
              yjNum: 0,
              yjLv: 0,
              changeNum: 0,
              numKey: 'approveThirdNum',
              LvKey: 'approveThirdRate',
              changeNumKey: 'approveThirdCompareRate'
            }
          ]
        },
        {
          name: '处理超期',
          num: 0,
          numKey: 'dealWarnNum',
          yjList: [
            {
              yjName: '一级预警数',
              yjNum: 0,
              yjLv: 0,
              changeNum: 0,
              numKey: 'dealFirstNum',
              LvKey: 'dealFirstRate',
              changeNumKey: 'dealFirstCompareRate'
            },
            {
              yjName: '二级预警数',
              yjNum: 0,
              yjLv: 0,
              changeNum: 0,
              numKey: 'dealSecondNum',
              LvKey: 'dealSecondRate',
              changeNumKey: 'dealSecondCompareRate'
            },
            {
              yjName: '三级预警数',
              yjNum: 0,
              yjLv: 0,
              changeNum: 0,
              numKey: 'dealThirdNum',
              LvKey: 'dealThirdRate',
              changeNumKey: 'dealThirdCompareRate'
            }
          ]
        },
        {
          name: '确认超期',
          num: 0,
          numKey: 'confirmWarnNum',
          yjList: [
            {
              yjName: '一级预警数',
              yjNum: 0,
              yjLv: 0,
              changeNum: 0,
              numKey: 'confirmFirstNum',
              LvKey: 'confirmFirstRate',
              changeNumKey: 'confirmFirstCompareRate'
            },
            {
              yjName: '二级预警数',
              yjNum: 0,
              yjLv: 0,
              changeNum: 0,
              numKey: 'confirmSecondNum',
              LvKey: 'confirmSecondRate',
              changeNumKey: 'confirmSecondCompareRate'
            },
            {
              yjName: '三级预警数',
              yjNum: 0,
              yjLv: 0,
              changeNum: 0,
              numKey: 'confirmThirdNum',
              LvKey: 'confirmThirdRate',
              changeNumKey: 'confirmThirdCompareRate'
            }
          ]
        }
      ],
      changeName: '较去年',
      query: {},
      localQuery: {
        taskTypeId: '',
        dateValue: '',
        dateType: ''
      },
      allCount: {}
    }
  },

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
      const { O_USER_INFO } = this.$constant;
      let userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' }); 
      let params = {
        data: {
          companyId: userInfo.companyId,
          areaId: this.query.areaId || '',
          projectId: this.query.projectId || '',
          userId: userInfo.userId,
          ...this.localQuery
        }
      }
      getQuestionTaskWarnReport(params).then((res) => {
        if (res.status == '200') {
          this.allCount = res.data
          this.countList.forEach((ele) => {
            ele.num = this.allCount[ele.numKey] || 0
            ele.yjList.forEach((ele2) => {
              ele2.yjNum = this.allCount[ele2.numKey] || 0
              ele2.yjLv = Number(parseFloat((this.allCount[ele2.LvKey] || 0) * 100).toFixed(2))
              ele2.changeNum = Number(parseFloat((this.allCount[ele2.changeNumKey] || 0) * 100).toFixed(2))
            })
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
  }
}
</style>
