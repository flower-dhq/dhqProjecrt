<template>
  <view class="page-box" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
    <visit-question ref="questionEl" :subjectList="subjectList" :questionType="isEdit ? 'edit' : 'read'" />
    <view class="footer-btn" v-if="isEdit" @click="submitEvent">提交</view>
    <u-safe-bottom />

    <u-modal :show="modalObj.isShow" :content="modalObj.content" :width="260" style="text-align: center" @confirm="modalObj.isShow = false" />
    <u-toast ref="uToast" />
  </view>
</template>

<script>
import VisitQuestion from './modules/visit-question.vue'
import Utils from '@/js/utils'
import { getCustomerVisitDetailById, uploadCustomerVisitInfo } from '@/service/returnVisit'

/**
 * 从管家端小程序（客户拜访-发送问卷）跳到过来
 */
export default {
  components: {
    VisitQuestion
  },
  data() {
    return {
      query: {
        visitRecordId: '',
        houseInfoId: ''
      },
      subjectList: [], // 问卷题目
      visitDetail: {}, // 拜访详情
      isEdit: false, // 问卷是否可以填写
      modalObj: {
        isShow: false,
        content: '该问卷您已做过评价！'
      },
    };
  },
  onLoad(query) {
    if (query.visitRecordId && query.houseInfoId) {
      this.query.visitRecordId = query.visitRecordId // 拜访id
      this.query.houseInfoId = query.houseInfoId // 房产id
    }

    this.domain = this.$appConfig.DOMAIN_PRO

    this.getCustomerVisitDetailById()
  },
  methods: {
    // 获取客户拜访详情
    async getCustomerVisitDetailById() {
      const params= {
        data: {
          visitRecordId: this.query.visitRecordId,
          houseInfoId: this.query.houseInfoId,
        }
      }
      const res = await getCustomerVisitDetailById(params)
      const _dataTmp = this.visitDetail = res.data.data?.[0] ?? null

      if (!_dataTmp) {
        this.modalObj.isShow = true
        this.modalObj.content = '该问卷不存在！'

        return
      }

      this.subjectList = _dataTmp.questionnaireAnswerData.subjectsList || []

      const { noStart, isExpired } = this.expiredState(_dataTmp.visitTaskStart, _dataTmp.visitTaskEnd)
      const hasAnswer = this.hasAnswer(this.subjectList)
      if (noStart) {
        // 拜访任务还没开始
        this.isEdit = false
        this.modalObj.isShow = true
        this.modalObj.content = '该问卷尚未开始！'
      } else if (isExpired && !hasAnswer) {
        // 任务拜访已过期，还没填写问卷
        this.isEdit = false
        this.modalObj.isShow = true
        this.modalObj.content = '该问卷已过期！'
      } else if (hasAnswer || _dataTmp.visitState != '0') {
        // 已填写问卷，或者不是在未拜访状态
        this.isEdit = false
        this.modalObj.isShow = true
        this.modalObj.content = '该问卷您已做过评价！'
      } else {
        // 可以填写问卷
        this.isEdit = true
        this.modalObj.isShow = false
        this.modalObj.content = ''
      }
    },
    /**
     * 问卷过期状态
     * 如果 当前时间在拜访结束日期之前，拜访开始日期之后，并且拜访任务是未拜访，则才能跳转到填写的页面
     */
    expiredState(visitTaskStart, visitTaskEnd) {
      // 拜访开始日期
      const startTime = this.stringToTime(visitTaskStart)
      // 拜访结束日期
      const endTime = this.stringToTime(visitTaskEnd)
      const nowTime = new Date().getTime()

      const noStart = nowTime < startTime
      const noExpired = endTime - nowTime > 1000 // 预留 1秒 时间
      return {
        noStart,
        isExpired: !noExpired
      }
    },
    // 获取问卷是否已填写过
    hasAnswer(subjectList) {
      const res = subjectList.some(item => {
        const type = item.type
        if (type == '0' || type == 1) {
          // 单选/多选
          return item.elementList.some(el => el.answer)
        } else if (type == 2 || type == 3) {
          // 填空/评价
          return !!(item.elementList?.[0]?.value)
        }
      })
      return res
    },
    // 将字符串格式的日期转换为时间格式
    stringToTime(value) {
      if (value) {
        const tmp = value.replace(/-/ig, '\/')
        return new Date(tmp).getTime()
      } else {
        return 0
      }
    },
    // 提交事件
    async submitEvent() {
      const subValid = this.$refs.questionEl.getSubjectAnswer()
      if (!subValid.success) {
        this.$refs.uToast.show({
          type: 'default',
          message: subValid.message
        })
        return
      }

      const { MEMBER_ID } = this.$constant
      const memberId = Utils.storageAction({ key: MEMBER_ID, action: 'get' })
      const params = {
        data: {
          userId: memberId,
          userName: '',
          visitRecordId: this.query.visitRecordId, // 拜访记录id
          visitRecordCode: this.visitDetail.visitRecordCode, // 记录code
          questionnaireAnswerData: {
            ...this.visitDetail.questionnaireAnswerData,
            answered: 1,
            subjectsList: subValid.data, // 题目
          },
          type: 1, // 表示业主端填写问卷，只需要传问卷信息就行
        }
      }
      const res = await uploadCustomerVisitInfo(params)
      this.$refs.uToast.show({
        type: 'default',
        message: res.data.resultCode == 200 ? '操作成功' : res.data.resultDesc
      })

      if (res.data.resultCode == 200) {
        this.isEdit = false
        uni.navigateBack({ delta: 1 })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.page-box {
  display: flex;
  flex-direction: column;
  background: #f7f7f7;
  padding: 30rpx 20rpx;
  box-sizing: border-box;
  min-height: 100vh;
  height: initial;
}
.footer-btn {
  height: 68rpx;
  color: #fff;
  text-align: center;
  line-height: 68rpx;
  border-radius: 34rpx;
  width: 40%;
  margin: 20rpx auto 0;
  border: 1px solid var(--app-primary-color);
  background-color: var(--app-primary-color);
}
</style>