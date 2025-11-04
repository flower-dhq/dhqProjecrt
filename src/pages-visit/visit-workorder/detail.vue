<template>
  <view class="page-panel" :style="[THEME_CSS_VAR]">
    <view class="header-panel">
      <!-- 任务描述，工单状态 -->
      <view class="header-title">
        <view class="cell-text-label">{{ visitDetail.quesDesc }}</view>
        <text class="cell-text-content">{{ getVisitState }}</text>
      </view>
      <cell-text customClass="side-text" labelWidth="0" border="none" padding="16rpx 0 0">{{ visitDetail.ownerName }} | {{ visitDetail.ownerTel }}</cell-text>
      <cell-text customClass="side-text" labelWidth="0" border="none" padding="16rpx 0 0">{{ visitDetail.buildingLocation }}</cell-text>
      <cell-text customClass="side-text" labelWidth="0" border="none" padding="16rpx 0 0">{{ visitDetail.createDate }}</cell-text>
      <view class="desc-tag-panel">
        <u--text prefixIcon="phone" text="联系客户" type="primary" size="28rpx" :iconStyle="{fontSize: '34rpx', color: THEME_COLOR, marginRight: '12rpx'}" @click="callPhone" />
        <!-- 只有待回访，才需要显示 发起会话 -->
        <u--text v-if="visitDetail.visitStateNum == 1" :prefixIcon="require(`@/static/${THEME_NAME}/workorder/icon-chat.png`)" text="发起会话" type="primary" size="28rpx" :iconStyle="{fontSize: '34rpx', color: THEME_COLOR, marginRight: '12rpx'}" @click="openChat" />
      </view>
    </view>

    <!-- 操作记录 -->
    <view class="log">
      <view class="log-title">工单信息</view>
      <cell-text label="任务单号：" customStyle="font-size: 28rpx;" labelWidth="auto" labelColor="#666666" border="none" padding="30rpx 30rpx 16rpx">
        <text :style="{color: THEME_COLOR}" @click="openOrderDetail">{{ taskDetail.quesTaskCode }}</text>
      </cell-text>
      <cell-text label="问题描述：" customStyle="font-size: 28rpx;" labelWidth="auto" labelColor="#666666" border="bottom" padding="0rpx 30rpx 30rpx">
        <text style="color: #333333;">{{ taskDetail.quesDesc }}</text>
      </cell-text>
      <view :class="['log-steps', {hide: !stepsShow}]">
        <u-steps current="0" dot direction="column">
          <u-steps-item v-for="(item, index) in taskRecord" :key="index" ref="stepsItemEl">
            <view slot="desc">
              <view class="log-left">
                <!-- 任务状态 -->
                <view class="logcell1">{{ item.operate }}</view>
                <!-- 日期时间 -->
                <view class="logcell2">{{ item.submitDate ? $u.timeFormat(item.submitDate, 'mm-dd hh:MM') : '' }}</view>
              </view>
              <view :class="['log-right', { 'no-bottom': index === taskRecord.length - 1 }]">
                <view class="logcell1">{{ item.userName }}</view>
                <!-- 任务描述 -->
                <view class="logcell2">{{ item.recordDesc }}</view>
                <!-- 相册 -->
                <u-album :urls="item.urls" :singleSize="60" :multipleSize="60" :space="12" />
              </view>
            </view>
          </u-steps-item>
        </u-steps>
      </view>
      <view class="open-steps" @click="openSteps">
        <u--text :text="stepsShow ? '收起' : '展开'" type="primary" :suffixIcon="stepsShow ? 'arrow-up' : 'arrow-down'" align="center" :iconStyle="{color: THEME_COLOR, marginLeft: '4px'}" />
      </view>
    </view>

    <!-- 问卷 -->
    <view class="card-panel">
      <view class="card-title">评价内容</view>
      <visit-question :subjectList="subjectList" questionType="read" />
    </view>
    
    <view class="placeholder"></view>
    <u-safe-bottom />

    <!-- 底部按钮 -->
    <view class="footer-panel" v-if="visitDetail.visitStateNum == 1">
      <!-- 只有待回访，才需要显示 邀请评价 -->
      <view class="footer-btn">
        <u-button text="邀请评价" type="primary" size="large" customStyle="border-radius: 0; height: 88rpx" @click="linkTo" />
      </view>
      <u-safe-bottom />
    </view>

    <u-modal :show="ownerModal.isShow" title="提示" content="未添加业主为外部联系人，暂无法发起会话，您可选择其他联系人发起" confirmText="选择联系人" showCancelButton @confirm="chooseExternal" @cancel="ownerModal.isShow = false" />
  </view>
</template>

<script>
import CellText from '@/components/cell-text.vue'
import VisitQuestion from '@/pages-visit/modules/visit-question.vue'
import { getVisitDetailById, getVisitQuestionList } from '@/service/returnVisit'
import { getQuesTaskDetailRecord } from '@/service/landcrm'
import { getQYInfoByOwnerId, syncOwnerInfo } from '@/service/api-gateway'

export default {
  components: {
    CellText,
    VisitQuestion
  },
  data() {
    return {
      queryObj: {
        visitId: '', // 回访任务id
      },
      visitDetail: {}, // 回访详情
      taskDetail: {}, // 任务详情
      taskRecord: [], // 任务记录
      subjectList: [], // 题目
      stepsShow: true, // 是否展开操作记录内容
      setpsFirst: false, // 是否已经操作过竖线问题，不然每次点展开，都会去操作竖线问题
      ownerModal: {
        isShow: false
      }
    }
  },
  computed: {
    // 获取回访状态
    getVisitState() {
      const map = {
        1: '待回访',
        2: '成功回访',
        3: '不成功回访',
        4: '无需回访',
        5: '回访中',
        6: '已生成回访',
        7: '回访超时关闭'
      }
      if (this.visitDetail.visitStateNum == 3 && this.visitDetail.is_over == 1) {
        return map[7]
      } else {
        return map[this.visitDetail.visitStateNum] || map[3]
      }
    }
  },
  async onLoad(options) {
    this.queryObj.visitId = options.visitId || ''

    await Promise.all([this.getVisitDetail(), this.getVisitQuestionList()])
    await this.getTaskDetail()
  },
  methods: {
    // 获取回访详情
    async getVisitDetail() {
      const params = {
        data: {
          visitId: this.queryObj.visitId
        }
      }
      const res = await getVisitDetailById(params)
      const _data = this.visitDetail = res.data?.[0]??{}

      // 如果是待回访状态，则工单记录默认展开；如果是其他状态，则默认收起
      this.stepsShow = _data.visitStateNum == '1'
    },
    // 获取工单详情
    async getTaskDetail() {
      const params = {
        data: {
          quesTaskId: this.visitDetail.taskId
        },
        wrapResponse: true
      }
      const res = await getQuesTaskDetailRecord(params)

      this.taskRecord = (res.data?.rectData ?? []).map(item => ({
        ...item,
        urls: (item.files || '').split(',').filter(file => /\.(?:png|jpg|jpeg|gif|bmp|WebP)$/i.test(file))
      }))
      const dataTmp = res.data?.taskDetail ?? {}
      this.taskDetail = dataTmp
      
      // 处理操作记录，竖线因图片延迟渲染问题导致高度不够问题
      this.$nextTick(() => {
        this.$refs.stepsItemEl.forEach(el => {
          el.getStepsItemRect()
        })
        setTimeout(() => {
          this.$refs.stepsItemEl.forEach(el => {
            el.getStepsItemRect()
          })
        }, 1000)
      })
    },
    // 获取题目和答案
    async getVisitQuestionList() {
      const params = {
        data: {
          visitId: this.queryObj.visitId
        }
      }
      const res = await getVisitQuestionList(params)

      const _questionTmp = res.data?.questionnaireMpqExtend?.subjectsList || []
      const _answerTmp = res.data?.questionnaireAnswerValues || []
      this.subjectList = this.answerIntoSubject(_questionTmp, _answerTmp)
    },
    // 将答案组合进题目的选项里
    answerIntoSubject(subjectList, answerList) {
      // 拷贝数组
      let copySubject = subjectList.slice()

      // 遍历答案
      answerList.forEach(answer => {
        const subjectId = answer.subjectsId

        // 遍历题目
        copySubject.some((subject, index) => {
          if (subject.id == subjectId) {
            // 该题目的答案，把答案放在 subject.elementList 里
            // 修改copySubject对象里的数据时候，同时也是在修改subjectList里的数据
            copySubject[index].elementList = this.getElementList(subject, answer)

            copySubject.splice(index, 1) // 已经找到了答案，就去除
            return true
          }
        })
      })

      return subjectList
    },
    // 计算出答案
    getElementList(subjectItem, answerItem) {
      const type = subjectItem.type

      if (type == '0') {
        // 单选
        return subjectItem.elementList.map(item => {
          const answer = item.id == answerItem.elements
          return {
            ...item,
            answer
          }
        })
      } else if (type == 1) {
        // 多选
        const arrTmp = answerItem.elements ? answerItem.elements.split(',') : []
        return subjectItem.elementList.map(item => {
          const answer = arrTmp.some(el => el == item.id)
          return {
            ...item,
            answer
          }
        })
      } else if (type == 2) {
        // 文本区域
        return [{ value: answerItem.text || '' }]
      } else if (type == 3) {
        // 评分
        const arrTmp = subjectItem.elementList.slice()
        const value = subjectItem.elementList.findIndex(el => el.id == answerItem.elements) + 1 // 获取第几个
        // 这样写的情况，请看 客户拜访详情 的问卷
        return [Object.assign({}, arrTmp[0] || {}, { value })].concat(arrTmp.slice(1))
      }
    },
    // 联系客户
    callPhone() {
      if (this.visitDetail.ownerTel) {
        wx.makePhoneCall({
          phoneNumber: this.visitDetail.ownerTel,
          success() {
            console.log("拨打电话成功！")
          },
          fail() {
            console.log("拨打电话失败！")
          }
        })
      }
    },
    // 发起会话
    async openChat() {
      const ownerId = this.taskDetail.contactId || '' // 反馈人业主id
      if (!ownerId) {
        // 业主没有开通业主端（一般不存在，因为新建工单可以选择当前业主客户，就证明已经注册过业主端了）
        this.ownerModal.isShow = true
        return
      }

      const res = await getQYInfoByOwnerId(ownerId) // 获取反馈人在企微上的信息
      const data = res.data || {}
      if (!data.userId) {
        // 如果不存在外部联系人id
        this.ownerModal.isShow = true
        return
      }

      // 需要先根据外部联系人id同步企微外部联系人信息
      await syncOwnerInfo(data.userId)
      // 打开与客户的单聊会话
      wx.qy.openEnterpriseChat({
        externalUserIds: data.userId,
        success: (res) => {}
      })
    },
    // 选择外部联系人（客户）
    chooseExternal() {
      wx.qy.selectExternalContact({
        filterType: 0,
        success: (res) => {
          const data = res.userIds || []
          // 客户id
          const userItem = data[0] || ''
          this.ownerModal.isShow = false

          wx.qy.openEnterpriseChat({
            externalUserIds: userItem,
            success: (res) => {
            }
          })
        }
      })
    },
    linkTo() {
      uni.navigateTo({ url: '/pages-visit/visit-workorder/choose?visitId=' + this.queryObj.visitId })
    },
    // 展示/收起操作记录
    openSteps() {
      this.stepsShow = !this.stepsShow

      // 第一次点击展开时，需要操作一次竖线问题
      if (!this.stepsShow || this.setpsFirst) return
      this.setpsFirst = true

      this.$nextTick(() => {
        this.$refs.stepsItemEl.forEach(el => {
          el.getStepsItemRect()
        })
      })
    },
    // 打开工单详情页面
    openOrderDetail() {
      uni.navigateTo({ url: '/pages-workorder/workorder-detail/detail?type=visitWorkorder&taskId=' + this.taskDetail.quesTaskId })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-panel {
  padding: 24rpx 20rpx 20rpx;
  min-height: 100vh;
  background-color: #f3f5f9;
  box-sizing: border-box;
}
.header-panel {
  @include flx-dsp(flex-start, flex-start, column);
  width: 100%;
  padding: 24rpx 30rpx;
  border-radius: 12rpx;
  box-sizing: border-box;
  background-color: #fff;
  margin-bottom: 24rpx;
}
.header-title {
  display: flex;
  width: 100%;
  padding-bottom: 16rpx;

  .cell-text-label {
    flex: 1 1 auto;
    font-size: 30rpx;
    font-weight: bold;
    color: #222;
    padding-right: 40rpx;
    @include ellipsis(2);
  }
  .cell-text-content {
    flex: 0 0 auto;
    font-size: 28rpx;
    color: var(--app-primary-color);
  }
}
.desc-tag-panel {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-top: 1px solid #EBEBEB;
  padding-top: 20rpx;
  margin-top: 16rpx;

  ::v-deep .u-text {
    /* flex: 0 0 50%; */
    display: flex;
    justify-content: center !important;
  }
}
::v-deep .auto-width {
  .cell-text-label {
    flex: 1 1 auto;
  }
  .cell-text-content {
    flex: 0 0 auto;
  }
}
::v-deep .side-text {
  .cell-text-content {
    color: #666;
    font-size: 28rpx;
  }
}
::v-deep .cell-text {
  .cell-text-label {
    min-height: 1rem;
  }
  .cell-text-content {
    min-height: 1rem;
  }
}

.log {
  background: #FFFFFF;
  border-radius: 12rpx;
  margin-bottom: 24rpx;
}
.log-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333333;
  padding: 30rpx;
  border-bottom: 1px solid #EBEBEB;
}
.log-steps {
  padding: 30rpx;
  margin-left: 80px;

  &.hide {
    display: none;
  }
}
.open-steps {
  padding: 24rpx 0;
}
.log-left {
  position: absolute;
  top: -8rpx;
  left: -80px;
  text-align: center;
  width: 163rpx;
}
.log-right {
  margin-top: -8rpx;
  margin-bottom: 38rpx;

  &.no-bottom {
    margin-bottom: 0rpx;
  }
}
::v-deep .u-album {
  margin-top: 8rpx;
}
.logcell1 {
  font-size: 28rpx;
  color: #333333;
  padding: 8rpx 0;
}
.logcell2 {
  font-size: 26rpx;
  color: #999999;
}
.card-panel {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
}
.card-title {
  height: 102rpx;
  line-height: 102rpx;
  padding: 0 30rpx;
  font-size: 30rpx;
  color: #333;
  font-weight: bold;
  border-bottom: 1px solid #d9dce7;
}
.placeholder {
  width: 100%;
  height: 68rpx;
}
.footer-panel {
  width: 100%;
  position: fixed;
  left: 0;
  bottom: 0;
  background-color: #fff;
}
</style>