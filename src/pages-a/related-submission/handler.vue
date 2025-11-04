<style lang="scss" scoped>
.handler {
  width: 100%;
  min-height: 100vh;
  background-color: #ebebeb;
  box-sizing: border-box;
  $search-h: 108rpx;
  .search-area {
    @include flx-dsp($jsc: flex-start, $ali: center);
    width: 100%;
    height: $search-h;
    background-color: #fff;
    box-sizing: border-box;
    padding: 20rpx 20rpx 20rpx 24rpx;
    .buttons {
      margin: 0 10px;
      height: 100%;
      text {
        display: inline-block;
        height: 100%;
        font-size: 28rpx;
        line-height: 68rpx;
        &:first-child {
          margin-right: 10px;
        }
      }
    }
  }
  &__list {
    @include flx-dsp($jsc: flex-start, $ali: flex-start);
    position: relative;
    width: 100%;
    height: calc(100vh - $search-h);
    &::before {
      position: absolute;
      left: 0;
      top: 0;
      display: block;
      content: '';
      width: 100%;
      height: 1px;
      background-color: #eee;
      transform: translateY(-50%);
    }
    & > view {
      height: 100%;
      overflow-y: auto;
    }
    .column {
      flex: 1;
      height: 100%;
      background-color: #fff;
      .cell {
        border-bottom: 1px solid #edebeb;
      }
    }
    .column-1 {
      background-color: #fff;
    }
    .column-2 {
      background-color: #f6f6f6;
      .cell {
        border-bottom: 1px solid #e7e7e7;
      }
    }
    .column-3 {
      background-color: #ebebeb;
      .cell {
        border-bottom: 1px solid #ddd;
      }
    }
    .column-4 {
      background-color: #e5e5e5;
      .cell {
        border-bottom: 1px solid #d7d7d7;
      }
    }
    .level-two {
      width: 240rpx;
      background-color: #f6f6f6;
      .cell {
        border-bottom: 1px solid #ddd;
      }
    }
    text.active-cell {
      color: var(--app-primary-color);
    }
    .cell {
      width: 100%;
      display: inline-block;
      box-sizing: border-box;
      padding: 30rpx;
      font-size: 30rpx;
      color: #333;
      text-align: center;
    }
  }
}
</style>

<template>
  <view class="handler" :style="[THEME_CSS_VAR]">
    <view class="search-area">
      <u-search v-model="keyword" placeholder="请输入岗位人员名称" :showAction="false" shape="square" @blur="searchEvent"></u-search>
      <!-- <view class="buttons">
        <text @click="search">搜索</text>
        <text @click="confirm">确定</text>
      </view> -->
    </view>
    <view class="handler__list">
      <!-- 项目对接人 -->
      <view class="column-1 column">
        <text v-for="(item, index) in columnData[0].list" :key="index" :class="['cell', { 'active-cell': formObj.project == index }]" @click="clickCell('project', item, index)">{{ item.label }}</text>
      </view>
      <!-- 岗位 -->
      <view class="column-2 column">
        <text v-for="(item, index) in jobList" :key="index" :class="['cell', { 'active-cell': formObj.jobIndex == index }]" @click="clickCell('job', item, index)">{{ item.label }}</text>
      </view>
      <!-- 人员 -->
      <view class="column-3 column">
        <text v-for="(item, index) in getStaffListByJob" :key="index" :class="['cell', { 'active-cell': formObj.staffIndex == index }]" @click="clickCell('staff', item, index)">{{ item.label }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import { getJobArch, getSuperiorJobArchs, getJobArchUserMsg } from '@/service/landcrm';

export default {
  data() {
    return {
      keyword: '',
      columnData: [
        {
          index: 0,
          list: [
            {
              label: '项目对接人',
            },
            // {
            //   label: '上级人员',
            // },
          ],
        },
        {
          index: 0,
          list: [],
        },
        {
          index: 0,
          list: [],
        },
      ],
      option: {},
      formObj: {
        project: 0,
        jobIndex: 0,
        staffIndex: 0
      },
      jobListTmp: [], // 备份完整的岗位数据
      jobList: [], // 岗位
      staffList: [], // 人员
      jobToStaff: {}, // { [jobId]: [staff] }
    };
  },
  computed: {
    // 获取当前岗位下的人员数据
    getStaffListByJob() {
      const curJobItem = this.jobList[this.formObj.jobIndex]
      if (!curJobItem) return []

      return this.jobToStaff[curJobItem.id] || []
    }
  },
  methods: {
    // 点击分类单元
    clickCell(type, item, index) {
      if (type == 'project' && index != this.formObj.project) {
        this.formObj.project = index
      } else if (type == 'job' && index != this.formObj.jobIndex) {
        this.formObj.jobIndex = index
        this.formObj.staffIndex = 0
      } else if (type == 'staff') {
        this.formObj.staffIndex = index
        const { id, label, ...other } = item

        uni.$emit('select-handler', { type: this.option.type || '', data: { ...other, id, text: label } })
        uni.navigateBack()
      }
    },
    // 搜索
    async searchEvent(value) {
      // 匹配搜索结果的人员数据
      await this.getStaffData(value)
      const jobIdMap = this.jobToStaff = this.resolveStaff(this.staffList)
      this.jobList = this.getJobHasStaff(this.jobListTmp, jobIdMap)

      this.formObj = {
        project: 0,
        jobIndex: 0,
        staffIndex: 0
      }
    },
    // 获取项目对接
    async getProjectPost() {
      const params = {
        data: {
          areaId: this.option.areaId,
          projectId: this.option.projectId
        },
        hideLoading: true
      }
      const res = await getJobArch(params)

      const data = res.data || []
      this.jobList = this.jobListTmp = this.columnData[1].list = data.map(item => ({
        ...item,
        label: item.jobName,
        id: item.jobId
      }))
    },
    // 获取上级人员
    getSuperior() {
      const { O_USER_INFO } = this.$constant
      const userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' });
      const params = {
        data: {
          userId: userInfo.userId,
        },
        hideLoading: true
      };
      return getSuperiorJobArchs(params).then((res) => {
        if (res.success) {
          const data = res.data || [];
          data.forEach(item => {
            const { jobName, jobId} = item;
            item.label = jobName
            item.id = jobId
          })
          this.columnData[1].list = data
        }
      });
    },
    // 关联加载
    async relatedLoading(type) {
      uni.showLoading({ title: '加载中'})
      if (type == 'project') {
        await Promise.all([this.getProjectPost(), this.getStaffData()])

        this.jobToStaff = this.resolveStaff(this.staffList)
      }
      if (type == 'superior') await this.getSuperior().catch(_ => {})
      uni.hideLoading()
    },
    // 获取人员列表
    async getStaffData(userName = '') {
      let { O_USER_INFO } = this.$constant;
      let userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' });
      let companyId = userInfo.companyId ? userInfo.companyId : this.$appConfig.COMPLANY_ID;
      const params = {
        data: {
          areaId: this.option.areaId,
          projectId: this.option.projectId,
          companyId: companyId
        },
        hideLoading: true
      }
      if (!!userName) {
        params.data.userName = userName
      }
      const res = await getJobArchUserMsg(params)
      const data = res.resultCode || []
      this.staffList = data.map(item => ({ ...item, label: item.userName, id: item.userId }))
    },
    /**
     * 将人员数据转换为树形结构
     * @param {array} data
     * @returns {} { [jobName]: [staff] }
     */
    resolveStaff(data = []) {
      let arrRes = {}

      data.forEach(item => {
        if (!Array.isArray(arrRes[item.jobId])) {
          arrRes[item.jobId] = []
        }

        arrRes[item.jobId].push(item)
      })

      return arrRes
    },
    // 只查找有人员的岗位
    getJobHasStaff(jobList = [], staffList = {}) {
      return jobList.filter(item => !!staffList[item.jobId])
    },
  },
  onLoad(option) {
    this.option = option
    this.relatedLoading('project');
  },
};
</script>
