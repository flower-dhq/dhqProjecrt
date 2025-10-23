<template>
  <view class="page-background">
    <!-- 模块概览页面 -->
    <view v-if="showModuleOverview" class="module-overview">
      <!-- 使用全局样式类 -->
      <view class="page-header gradient-bg">
        <view class="page-header-content">
          <text class="title">{{ currentModuleInfo.name }}</text>
          <text class="subtitle">{{ currentModuleInfo.description }}</text>
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
                :customStyle="{ marginBottom: '24rpx' }"
              >
                {{ option }}
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
import { buttonStyles } from '@/utils/styles'
import { getQuestion } from '@/service/question'
export default {
  name: 'QuestionnairePage',
  data() {
    return {
      buttonStyles,
      showModuleOverview: true,
      currentModuleIndex: 0,
      currentQuestionIndex: 0,
      currentAnswer: null,
      
      modules: [
        
      ],
      
      allQuestions: []
    }
  },
  inject: ['questionnaireData', 'dataManager'],
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
    overallProgress() {
      const totalQuestions = this.getAllQuestionsCount()
      const completedQuestions = Object.keys(this.questionnaireData.answers).length
      return Math.round((completedQuestions / totalQuestions) * 100)
    }
  },
  onLoad() {
	getQuestion().then(res=>{
		this.modules = res.data
		this.initializeAllQuestions()
		this.loadAnswerState()
	})
    
  },
  methods: {
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
      const answers = this.questionnaireData.answers
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
        const savedAnswer = this.questionnaireData.answers[this.currentQuestion.id]
        if (savedAnswer !== undefined) {
          this.currentAnswer = savedAnswer
        } else {
          this.currentAnswer = null
        }
      }
    },
    
    saveCurrentAnswer() {
      if (this.currentQuestion && this.currentAnswer !== null) {
        this.questionnaireData.answers[this.currentQuestion.id] = this.currentAnswer
        this.dataManager.saveToLocal()
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
.page-background {
  min-height: 100vh;
  background-color: #f8fafc;
}

.page-header {
  height: 300rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -40rpx;
    left: 50%;
    transform: translateX(-50%);
    width: 80rpx;
    height: 80rpx;
    background: white;
    border-radius: 50%;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
  }
}

.page-header-content {
  text-align: center;
  color: white;
}

.title {
  display: block;
  font-size: 48rpx;
  font-weight: 700;
  margin-bottom: 16rpx;
}

.subtitle {
  font-size: 28rpx;
  opacity: 0.9;
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

:deep(.u-radio__label) {
  font-size: 28rpx !important;
  color: #374151 !important;
  line-height: 1.5 !important;
}

:deep(.u-checkbox__label) {
  font-size: 28rpx !important;
  color: #374151 !important;
  line-height: 1.5 !important;
}
</style>
