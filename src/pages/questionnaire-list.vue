<template>
  <view class="pages-box">
    <!-- #ifdef H5 -->
    <view class="title">问卷调查</view>
    <!-- #endif -->
    <view v-if="showModuleOverview">
      <view class="hand-box bg-gradient">
        <view class="cont-text">
          <view class="big-text">{{ currentModuleInfo.name }}</view>
          <view class="small-text">{{ currentModuleInfo.description }}</view>
        </view>
      </view>

      <view class="page-container">
        <view class="common-card">
          <view class="module-info">
            <view class="info-item">
              <u-icon name="list" color="#667eea" size="40"></u-icon>
              <text class="info-text">{{ currentModuleInfo.questionCount || getTotalQuestions() }} 道题目</text>
            </view>
            <view class="info-item">
              <u-icon name="clock" color="#10b981" size="40"></u-icon>
              <text class="info-text">预计 {{ currentModuleInfo.estimatedTime || '5' }} 分钟</text>
            </view>
            <view class="info-item">
              <u-icon name="checkmark-circle" color="#f59e0b" size="40"></u-icon>
              <text class="info-text">单选题</text>
            </view>
          </view>

          <view class="progress-section">
            <text class="progress-title">总体进度</text>
            <u-line-progress 
              :percentage="overallProgress" 
              activeColor="#667eea"
              inactiveColor="#e5e7eb"
              :showText="true"
            />
          </view>
        </view>

        <view class="action-section">
          <u-button 
            type="primary" 
            size="large" 
            shape="round"
            :custom-style="buttonStyles.primary"
            @click="startModule"
          >
            开始答题
          </u-button>
        </view>
      </view>
    </view>
    
    <!-- 问卷答题页面 -->
    <view v-else class="questionnaire-content">
      <view class="progress-header">
        <view class="progress-info">
          <text class="module-name">{{ currentModuleInfo.name }}</text>
          <text class="question-counter">{{ currentQuestionIndex + 1 }} / {{ currentModuleQuestions.length }}</text>
        </view>
        <u-line-progress 
          :percentage="moduleProgress" 
          activeColor="#667eea"
          inactiveColor="#e5e7eb"
          height="8"
        />
      </view>

      <view class="page-container">
        <view class="question-card" v-if="currentQuestion">
          <view class="question-header">
            <text class="question-number">第 {{ currentQuestionIndex + 1}} 题</text>
            <text class="question-type">单选题</text>
          </view>

          <view class="question-content">
            <text class="question-text">{{ currentQuestion.topic }}</text>
          </view>

          <!-- 修改为支持动态选项的单选题 -->
          <view class="answer-section">
            <u-radio-group v-model="currentAnswer" placement="column">
              <u-radio 
                v-for="(option, index) in currentQuestionOptions" 
                :key="index"
                :label="getOptionLabel(index)"
                :name="getOptionScore(index)"
                activeColor="#667eea"
                :customStyle="{ marginBottom: '32rpx' }"
              >
              </u-radio>
            </u-radio-group>
          </view>
        </view>

        <view class="navigation-section">
          <u-button 
            v-if="currentQuestionIndex > 0"
            type="default" 
            size="large" 
            shape="round"
            :custom-style="buttonStyles.secondary"
            @click="previousQuestion"
          >
            上一题
          </u-button>

          <u-button 
            type="primary" 
            size="large" 
            shape="round"
            :custom-style="buttonStyles.primary"
            :disabled="!currentAnswer"
            @click="nextQuestion"
          >
            {{ isLastQuestion ? '完成模块' : '下一题' }}
          </u-button>
        </view>
      </view>
    </view>

  </view>
</template>

<script>
import { getIssue } from "../service/question"
import { buttonStyles } from '@/utils/styles';
import utils from '@/js/utils'
export default{
  data(){
    return{
      buttonStyles,
      showModuleOverview: true,
      currentModuleIndex: 0,
      currentQuestionIndex: 0,
      currentAnswer: null,
      
      modules: [],
      
      allQuestions: [],
      overallProgress:0
    }
  },

  computed: {
    currentModuleInfo() {
      return this.modules[this.currentModuleIndex] || {}
    },
    currentModuleQuestions() {
      const module = this.modules[this.currentModuleIndex]
      if (!module || !module.questions) return []
      
      let allTopics = []
      module.questions.forEach(question => {
        if (question.topics) {
          allTopics = allTopics.concat(question.topics)
        }
      })
      return allTopics
    },
    currentQuestion() {
      return this.currentModuleQuestions[this.currentQuestionIndex]
    },
    currentQuestionOptions() {
      if (!this.currentQuestion || !this.currentQuestion.options) return []
      return this.currentQuestion.options.split(';')
    },
    isLastQuestion() {
      return this.currentQuestionIndex === this.currentModuleQuestions.length - 1
    },
    moduleProgress() {
      if (this.currentModuleQuestions.length === 0) return 0
      return Math.round(((this.currentQuestionIndex + 1) / this.currentModuleQuestions.length) * 100)
    },
    
  },
  onUnload() {

    // #ifdef MP-WEIXIN
     uni.enableAlertBeforeUnload({
      message: "您的问卷数据尚未提交，确定要退出吗？数据将会保存在本地。",
      complete: function (res) {
        uni.reLaunch({
          url: '/pages/questionnaire-Instructions',
        });
      },
      fail: function (errMsg) {
        console.log("点击取消按钮了：", errMsg);
      },
    })
    // #endif

  },
  onLoad() {

    // #ifdef MP-WEIXIN
     uni.enableAlertBeforeUnload({
      message: "您的问卷数据尚未提交，确定要退出吗？数据将会保存在本地。",
      complete: function (res) {
      },
      fail: function (errMsg) {
        console.log("点击取消按钮了：", errMsg);
      },
    })
    // #endif

    const { QUESTIONNAIRE_INFO } = this.$constant
    const obj = utils.storageAction({ key: QUESTIONNAIRE_INFO, action: 'get' }) || {};
    // obj.startTime = new Date()
    // utils.storageAction({ key: QUESTIONNAIRE_INFO, action: 'set', value: obj });
    let params = {
      data:{}
    }
    getIssue(params).then(res=>{
      this.modules = res.data
      this.initializeAllQuestions()
      this.loadAnswerState()
    })
    
  },
  methods: {
    //计算进度
    myOverallProgress() {
      const totalQuestions = this.getAllQuestionsCount()
      const { QUESTIONNAIRE_INFO } = this.$constant
      const { answers={} } = utils.storageAction({ key: QUESTIONNAIRE_INFO, action: 'get' });
      const completedQuestions = Object.keys(answers).length
      this.overallProgress =  Math.round((completedQuestions / totalQuestions) * 100)
    },
    initializeAllQuestions() {
      this.allQuestions = []
      this.modules.forEach(module => {
        if (module.questions) {
          module.questions.forEach(question => {
            if (question.topics) {
              this.allQuestions = this.allQuestions.concat(question.topics)
            }
          })
        }
        this.myOverallProgress()
      })
    },
    
    getAllQuestionsCount() {
      return this.allQuestions.length
    },
    
    getTotalQuestions() {
      const module = this.modules[this.currentModuleIndex]
      if (!module || !module.questions) return 0
      
      let count = 0
      module.questions.forEach(question => {
        if (question.topics) {
          count += question.topics.length
        }
      })
      return count
    },
    getOptionLabel(index) {
      if (!this.currentQuestion || !this.currentQuestion.score) return index.toString()
      const options = this.currentQuestion.options.split(/[;；]/)
      return options[index] || index.toString()
    },
    getOptionScore(index) {
      if (!this.currentQuestion || !this.currentQuestion.score) return index.toString()
      const scores = this.currentQuestion.score.split(/[;；]/)
      return scores[index] || index.toString()
    },
    
    startModule() {
      this.showModuleOverview = false
      this.loadCurrentAnswer()
    },
    
    loadAnswerState() {
      const { QUESTIONNAIRE_INFO } = this.$constant
      const { answers={} } = utils.storageAction({ key: QUESTIONNAIRE_INFO, action: 'get' });
      let questionIndex = 0
      let moduleIndex = 0
      
      for (let i = 0; i < this.modules.length; i++) {
        const module = this.modules[i]
        let moduleCompleted = true
        const moduleQuestions = this.getModuleQuestions(i)
        
        for (let j = 0; j < moduleQuestions.length; j++) {
          const question = moduleQuestions[j]
          if (!answers[question.id]) {
            moduleCompleted = false
            moduleIndex = i
            questionIndex = j
            break
          }
        }
        
        if (!moduleCompleted) break
      }
      
      this.currentModuleIndex = moduleIndex
      this.currentQuestionIndex = questionIndex
    },
    
    getModuleQuestions(moduleIndex) {
      const module = this.modules[moduleIndex]
      if (!module || !module.questions) return []
      
      let allTopics = []
      module.questions.forEach(question => {
        if (question.topics) {
          allTopics = allTopics.concat(question.topics)
        }
      })
      return allTopics
    },
    
    loadCurrentAnswer() {
      if (this.currentQuestion) {
        const { QUESTIONNAIRE_INFO } = this.$constant
        const { answers={} } = utils.storageAction({ key: QUESTIONNAIRE_INFO, action: 'get' });
        const savedAnswer = answers[this.currentQuestion.id]
        if (savedAnswer !== undefined) {
          this.currentAnswer = savedAnswer
        } else {
          this.currentAnswer = null
        }
      }
    },
    
    saveCurrentAnswer() {
      if (this.currentQuestion && this.currentAnswer !== null) {
        const { QUESTIONNAIRE_INFO } = this.$constant
        const infoData = utils.storageAction({ key: QUESTIONNAIRE_INFO, action: 'get' }) || { };
        if(infoData.answers){
          infoData.answers[this.currentQuestion.id] = this.currentAnswer
        }else{
          infoData.answers = {}
          infoData.answers[this.currentQuestion.id] = this.currentAnswer
        }
        console.log("infoData",infoData,infoData.answers)
        utils.storageAction({ key: QUESTIONNAIRE_INFO, action: 'set', value:infoData });
      }
    },
    
    nextQuestion() {
      if (!this.currentAnswer) {
        uni.showToast({
          title: '请选择答案',
          icon: 'none'
        })
        return
      }
      
      this.saveCurrentAnswer()
      
      if (this.isLastQuestion) {
        this.completeModule()
      } else {
        this.currentQuestionIndex++
        this.loadCurrentAnswer()
      }
    },
    
    previousQuestion() {
      if (this.currentQuestionIndex > 0) {
        this.saveCurrentAnswer()
        this.currentQuestionIndex--
        this.loadCurrentAnswer()
      }
    },
    
    completeModule() {
      if (this.currentModuleIndex < this.modules.length - 1) {
        this.currentModuleIndex++
        this.currentQuestionIndex = 0
        this.showModuleOverview = true
        this.myOverallProgress()
        uni.showToast({
          title: '模块完成！',
          icon: 'success'
        })
      } else {
        uni.showToast({
          title: '问卷完成！',
          icon: 'success'
        })
        
        setTimeout(() => {
          uni.navigateTo({
            url: '/pages/result/result'
          })
        }, 1500)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.pages-box{
  /* #ifdef H5 */
  padding-top: 88rpx;
  /* #endif */
  padding-bottom: 60rpx;
  min-height: 100%;
  background-color: #f8fafc;
  font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;
  box-sizing: border-box;
}
.title{
  position: fixed;
  top: 0;
  z-index: 99;
  width: 100%;
  height: 88rpx;
  line-height: 88rpx;
  font-size: 32rpx;
  font-weight:700;
  color: #fff;
  text-align: center;
  background-color: rgb(102, 126, 234);
}

.bg-gradient{
  background: linear-gradient(135deg,#667eea,#764ba2);
}

.hand-box{
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 312rpx;
  .cont-text{
    text-align: center;
    color: #fff;
    .big-text{
      font-size: 50rpx;
      font-weight: 700;
      margin-bottom: 16rpx;
    }
    .small-text{
      font-size: 25rpx;
    }
  }
}

.hand-box::after{
  content: "";
  position: absolute;
  bottom: -1.25rem;
  left: 50%;
  transform: translate(-50%);
  width: 84rpx;
  height: 84rpx;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 .125rem .625rem rgba(0, 0, 0, .1);
  z-index: 9;
}

.page-container {
  padding: 80rpx 40rpx 40rpx;
}

.common-card {
  background: white;
  border-radius: 24rpx;
  padding: 60rpx 40rpx;
  box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.08);
  margin-bottom: 60rpx;
}

.module-info {
  margin-bottom: 60rpx;
  
  .info-item {
    display: flex;
    align-items: center;
    margin-bottom: 30rpx;
    
    .info-text {
      font-size: 28rpx;
      color: #374151;
      margin-left: 20rpx;
    }
  }
}

.progress-section {
  .progress-title {
    display: block;
    font-size: 30rpx;
    font-weight: 600;
    color: #374151;
    margin-bottom: 20rpx;
  }
}

.progress-header {
  background: white;
  padding: 40rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
  
  .progress-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
    
    .module-name {
      font-size: 32rpx;
      font-weight: 600;
      color: #1f2937;
    }
    
    .question-counter {
      font-size: 28rpx;
      color: #6b7280;
    }
  }
}

.question-card {
  background: white;
  border-radius: 24rpx;
  padding: 60rpx 40rpx;
  box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.08);
  margin-bottom: 40rpx;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40rpx;
  
  .question-number {
    font-size: 28rpx;
    font-weight: 600;
    color: #667eea;
  } 
  
  .question-type {
    font-size: 24rpx;
    color: #6b7280;
    background: #f3f4f6;
    padding: 8rpx 16rpx;
    border-radius: 20rpx;
  }
}

.question-content {
  margin-bottom: 40rpx;
  
  .question-text {
    font-size: 32rpx;
    line-height: 1.6;
    color: #1f2937;
  }
}

.answer-section {
  .scale-container {
    .scale-labels {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20rpx;
      
      .scale-label {
        font-size: 24rpx;
        color: #6b7280;
      }
    }
  }
}

.navigation-section {
  display: flex;
  justify-content: space-between;
  gap: 20rpx;
  padding: 0 40rpx;
}

.action-section {
  text-align: center;
  padding: 0 40rpx;
}

::v-deep .u-radio__label {
  font-size: 28rpx !important;
  color: #374151 !important;
  line-height: 1.5 !important;
}

::v-deep .u-checkbox__label {
  font-size: 28rpx !important;
  color: #374151 !important;
  line-height: 1.5 !important;
}

::v-deep .u-radio .u-radio__text, ::v-deep .u-form-item__body__left__content__label {
  font-size: 32rpx !important;
  color: #374151 !important;
}
</style>