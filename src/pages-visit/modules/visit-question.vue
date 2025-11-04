<template>
  <view class="visit-question">
    <view class="ques-item-panel" v-for="(item, index) in subjectList" :key="index">
      <text class="ques-item-title">{{ index + 1 + '.' + item.title }}</text>

      <template v-if="item.type == '0'">
        <!-- 单选 -->
        <u-radio-group v-model="getAnswerObj[item.id].value" :disabled="isRead" placement="column" inactiveColor="#666666">
          <u-radio v-for="selItem in item.elementList" :key="selItem.id" :label="selItem.title" :name="selItem.id" :customStyle="{marginBottom: '30rpx'}" labelSize="30rpx" labelColor="#666666" />
        </u-radio-group>
      </template>

      <template v-if="item.type == 1">
        <!-- 多选 -->
        <u-checkbox-group v-model="getAnswerObj[item.id].value" :disabled="isRead" placement="column" inactiveColor="#666666">
          <u-checkbox v-for="selItem in item.elementList" :key="selItem.id" :label="selItem.title" :name="selItem.id" :customStyle="{marginBottom: '30rpx'}" labelSize="30rpx" labelColor="#666666" />
        </u-checkbox-group>
      </template>

      <template v-if="item.type == 2">
        <!-- 文本区域 -->
        <u--textarea v-model="getAnswerObj[item.id].value" :disabled="isRead" placeholder="请输入内容" />
      </template>

      <template v-if="item.type == 3">
        <!-- 评分 -->
        <u-rate :count="5" v-model="getAnswerObj[item.id].value" :readonly="isRead" size="48rpx" inactiveIcon="star-fill" :activeColor="isRead ? '#666666' : THEME_COLOR" inactiveColor="#d2d2d2" />
      </template>
    </view>
  </view>
</template>

<script>

/**
 * 评价内容
 */
export default {
  name: 'VisitQuestion',
  props: {
    // 问卷题目
    /**
     * subjectsList: [
     *   {
     *     // 选项
     *     elementList: [
     *       {
     *         id: number, // 选项id
     *         title: string, // 标题
     *         answer: boolean, // 选项答案。单选、多选的答案字段为 answer
     *         value: string|number, // 选项答案。文本区域，评分的答案字段为 value
     *       }
     *     ],
     *     id: number, // 题目id
     *     title: string, // 标题
     *     type: number, // 题目类型
     *   }
     * ]
     */
    subjectList: {
      type: Array,
      default: () => []
    },
    // 问卷类型。read: 只读, edit: 可编辑
    questionType: {
      type: String,
      default: 'read',
      validator(val) {
        return ['read', 'edit'].includes(val)
      }
    }
  },
  data() {
    return {
    }
  },
  computed: {
    // 获取带有答案的题目对象
    getAnswerObj() {
      if (this.subjectList.length == 0) return {}

      const _subjectObj = this.getSubjectObj(this.subjectList)
      return _subjectObj
    },
    isRead() {
      return this.questionType == 'read'
    }
  },
  methods: {
    // 将题目为数组格式，转换为对象格式 { [题目id]: { elementList: [题目选项], 题目内容 } }
    getSubjectObj(subjectList) {
      const answerObj = this.extractAnswerByList(subjectList)

      return subjectList.reduce((store, item) => {
        // 题目id
        const subjectsId = item.id
        const subjectsOptions = {
          ...item,
          value: answerObj[subjectsId] // 题目答案
        }

        return Object.assign(store, {
          [subjectsId]: subjectsOptions
        })
      }, {})
    },
    // 提取答案，转为对象格式 { [题目id]: 题目答案 }
    extractAnswerByList(subjectsList = []) {
      let res = {}

      subjectsList.forEach(item => {
        const subId = item.id
        if (item.type == 2) {
          // 文本区域
          res[subId] = item.elementList?.[0]?.value || ''
        } else if (item.type == 3) {
          // 评分
          const value = item.elementList?.[0]?.value || ''
          res[subId] = value ? parseInt(value) : ''
        } else if (item.type == '0') {
          // 单选
          const answerEl = item.elementList.find(el => el.answer) || {}
          res[subId] = answerEl.id || ''
        } else if (item.type == '1') {
          // 多选
          const answerEl = item.elementList.filter(el => el.answer) || []
          res[subId] = answerEl.map(el => el.id)
        }
      })

      return res
    },
    // 校验所有题目是否都已作答了
    validatorParams() {
      const count = this.subjectList.length

      // 没有题目
      if (count == 0) return { success: true }

      const validList = Object.values(this.getAnswerObj).map(item => {
        if (item.type == 2 || item.type == 3 || item.type == '0') {
          return !!item.value
        } else if (item.type == 1) {
          return !!item.value.length
        }
      })

      // 有多少题目已作答
      const asnwerCount = validList.filter(Boolean).length
      if (asnwerCount == 0) {
        // 没有一个填写
        return { success: false, message: '未填写问卷' }
      } else if (asnwerCount < count) {
        // 填写不完整
        return { success: false, message: '请填写完整问卷' }
      }
      return { success: true }
    },
    // 被父级调用，获取答题结果
    getSubjectAnswer() {
      const valid = this.validatorParams()
      if (!valid.success) return valid

      // 将题目对象格式转换为数组格式
      const list = this.subjectList.map(subItem => {
        const content = this.getAnswerObj[subItem.id]
        let elementList = content.elementList // 题目选项
        const answerId = content.value // 题目答案

        if (content.type == 2 || content.type == 3) {
          // 文本区域、评分
          elementList = [{ value: answerId }]
        } else if (content.type == '0') {
          // 单选
          elementList = elementList.map(elItem => ({
            ...elItem,
            answer: answerId == elItem.id
          }))
        } else if (content.type == 1) {
          // 多选
          elementList = elementList.map(elItem => ({
            ...elItem,
            answer: answerId.includes(elItem.id)
          }))
        }
        return {
          ...content,
          elementList
        }
      })
      return { success: true, data: list }
    }
  }
}
</script>

<style lang="scss" scoped>
.visit-question {
  background: #FFFFFF;
  border-radius: 12rpx;
  margin-bottom: 24rpx;
}
.ques-title {
  padding: 30rpx;
  font-size: 30rpx;
  color: #333;
  font-weight: bold;
  border-bottom: 1px solid #EBEBEB;
}
.ques-content {
  display: flex;
  flex-direction: column;
  padding-bottom: 20rpx;
}
.ques-item-panel {
  display: flex;
  flex-direction: column;
  padding: 30rpx 30rpx 10rpx;
}
.ques-item-title {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
  padding-bottom: 30rpx;
}
</style>