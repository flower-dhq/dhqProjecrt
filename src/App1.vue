<script>
import { reactive, provide, watch, onMounted } from 'vue'
import { submitQuestion,getQuestionResult } from './service/question'

export default {
  onLaunch: function() {
    console.log('App Launch')
    // this.initGlobalData() 已移入setup中
    this.initH5PreventBack()
  },
  onShow: function() {
    console.log('App Show')
    // 每次显示时检查数据完整性
    // this.checkDataIntegrity() 已移入setup中
    this.bindH5PreventEvents()
  },
  onHide: function() {
    console.log('App Hide')
    // 应用隐藏时保存数据
    // this.dataManager.saveToLocal() 已移入setup中
  },
  onUnload: function() {
    this.unbindH5PreventEvents()
  },
  setup() {
    // 全局问卷数据管理
    const questionnaireData = reactive({
      basicInfo: {},
      answers: {},
      currentModule: 0,
      startTime: null,
	  endTime: null,
      lastSaveTime: null,
      isSubmitted: false,
      submissionId: null,
      version: '1.0.0', // 数据版本号
      deviceInfo: {}, // 设备信息
      sessionId: null ,// 会话ID
    })

    const dataManager = {
      getQuestionnaireStructure() {
        return []
      },

      getAllQuestionIds() {
        const structure = this.getQuestionnaireStructure()
        const questionIds = []
        
        structure.forEach(module => {
          if (module.questions) {
            module.questions.forEach(question => {
              if (question.topics) {
                question.topics.forEach(topic => {
                  questionIds.push(topic.id)
                })
              }
            })
          }
        })
        
        return questionIds
      },

      getTotalQuestionCount() {
        return this.getAllQuestionIds().length
      },

      // 保存数据到本地存储
      saveToLocal() {
        try {
          const dataToSave = {
            ...questionnaireData,
            lastSaveTime: new Date().toISOString(),
            // deviceInfo: this.getDeviceInfo()
          }
          
          // 主存储
          uni.setStorageSync('questionnaire_data', dataToSave)
          
          // 备份存储（防止数据丢失）
          uni.setStorageSync('questionnaire_backup', dataToSave)
          
          questionnaireData.lastSaveTime = dataToSave.lastSaveTime
          
          console.log('数据保存成功:', new Date().toLocaleTimeString())
          return true
        } catch (error) {
          console.error('保存数据失败:', error)
          
          // 尝试保存到备用位置
          try {
            uni.setStorageSync('questionnaire_emergency', {
              ...questionnaireData,
              lastSaveTime: new Date().toISOString(),
              error: error.message
            })
          } catch (emergencyError) {
            console.error('紧急保存也失败:', emergencyError)
          }
          
          return false
        }
      },

      // 从本地存储加载数据
      loadFromLocal() {
        try {
          let savedData = null
          
          // 尝试从主存储加载
          try {
            savedData = uni.getStorageSync('questionnaire_data')
          } catch (error) {
            console.warn('主存储加载失败，尝试备份存储:', error)
          }
          
          // 如果主存储失败，尝试备份存储
          if (!savedData) {
            try {
              savedData = uni.getStorageSync('questionnaire_backup')
              console.log('从备份存储恢复数据')
            } catch (error) {
              console.warn('备份存储加载失败:', error)
            }
          }
          
          // 如果都失败，尝试紧急存储
          if (!savedData) {
            try {
              savedData = uni.getStorageSync('questionnaire_emergency')
              console.log('从紧急存储恢复数据')
            } catch (error) {
              console.warn('紧急存储加载失败:', error)
            }
          }
          
          if (savedData && this.validateStoredData(savedData)) {
            // 确保 startTime 也被正确恢复
            Object.assign(questionnaireData, savedData)
			console.log(questionnaireData.startTime)
            console.log('数据恢复成功:', savedData.lastSaveTime)
            return true
          }
          
          return false
        } catch (error) {
          console.error('加载数据失败:', error)
          return false
        }
      },

      // 数据验证
      validateStoredData(data) {
        try {
          // 检查数据结构
          if (!data || typeof data !== 'object') {
            console.warn('数据格式无效')
            return false
          }
          
          // 检查必要字段
          const requiredFields = ['basicInfo', 'answers', 'version']
          for (const field of requiredFields) {
            if (!(field in data)) {
              console.warn(`缺少必要字段: ${field}`)
              return false
            }
          }
          
          // 检查数据版本兼容性
          if (data.version && data.version !== questionnaireData.version) {
            console.warn(`数据版本不匹配: ${data.version} vs ${questionnaireData.version}`)
            // 这里可以添加版本迁移逻辑
          }
          
          return true
        } catch (error) {
          console.error('数据验证失败:', error)
          return false
        }
      },

      // 清除本地存储数据
      clearLocal() {
        try {
          uni.removeStorageSync('questionnaire_data')
          uni.removeStorageSync('questionnaire_backup')
          uni.removeStorageSync('questionnaire_emergency')
          console.log('本地数据已清除')
          return true
        } catch (error) {
          console.error('清除数据失败:', error)
          return false
        }
      },

      // 提交数据到服务器
      async submitToServer() {
        try {
          // 数据验证
          const validationResult = this.validateData()
          if (!validationResult.isValid) {
            throw new Error(`数据验证失败: ${validationResult.errors.join(', ')}`)
          }
          // 准备提交数据
          const submitData = {
            basicInfo: questionnaireData.basicInfo,
            answers: questionnaireData.answers,
			startTime: new Date(questionnaireData.startTime),
			endTime: new Date(),
            // metadata: {
            //   startTime: questionnaireData.startTime,
            //   endTime: questionnaireData.endTime,
            //   duration: questionnaireData.startTime ? 
            //     Math.round((new Date(questionnaireData.endTime) - new Date(questionnaireData.startTime)) / 1000 / 60) : 0,
            //   version: questionnaireData.version,
            //   deviceInfo: this.getDeviceInfo(),
            //   sessionId: questionnaireData.sessionId
            // },
            // statistics: this.getCompletionStats()
          }

          // 模拟网络请求（可替换为实际API调用）
          console.log('开始提交数据到服务器...',submitData)
          const tmpResult = await submitQuestion(submitData)
		  if(tmpResult.code == 20000){
			// 更新提交状态
			questionnaireData.isSubmitted = true
			// 保存提交状态
			this.saveToLocal()  
			return tmpResult
		  }
		  
          // 模拟网络延迟和可能的失败
          // await new Promise((resolve, reject) => {
          //   setTimeout(() => {
          //     // 90%成功率模拟
          //     if (Math.random() > 0.1) {
          //       resolve()
          //     } else {
          //       reject(new Error('网络连接失败'))
          //     }
          //   }, 1500 + Math.random() * 1000)
          // })

          // 模拟成功响应
          // const response = {
          //   success: true,
          //   submissionId: 'QS_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
          //   message: '问卷提交成功',
          //   timestamp: new Date().toISOString(),
          //   serverVersion: '1.0.0'
          // }

          

          
        } catch (error) {
          console.error('提交数据失败:', error)
          
          // 保存失败的提交尝试
          try {
            const failedSubmission = {
              data: questionnaireData,
              error: error.message,
              timestamp: new Date().toISOString(),
              retryCount: (questionnaireData.retryCount || 0) + 1
            }
            uni.setStorageSync('failed_submission', failedSubmission)
          } catch (saveError) {
            console.error('保存失败提交记录失败:', saveError)
          }
          
          throw error
        }
      },

      validateData() {
        const errors = []
        
        try {
          // 验证基本信息
          const requiredBasicFields = [
            { field: 'unit', name: '工作单位' },
            { field: 'name', name: '姓名' },
            { field: 'gender', name: '性别' },
            { field: 'age', name: '年龄' },
            { field: 'workYears', name: '工龄' },
            { field: 'position', name: '职位级别' },
            { field: 'maritalStatus', name: '婚姻状况' },
            { field: 'childrenStatus', name: '子女状况' },
            { field: 'healthConcern', name: '健康担忧' },
            { field: 'economicPressure', name: '经济压力' },
            { field: 'workPressure', name: '工作压力' },
            { field: 'familyBurden', name: '家庭负担' },
            { field: 'interpersonalPressure', name: '人际压力' }
          ]
          
          for (const { field, name } of requiredBasicFields) {
            if (!questionnaireData.basicInfo[field]) {
              errors.push(`${name}不能为空`)
            }
          }

          // const allQuestionIds = this.getAllQuestionIds()
          // for (const questionId of allQuestionIds) {
          //   const answer = questionnaireData.answers[questionId]
          //   if (answer === undefined || answer === null || answer === '' || 
          //       (Array.isArray(answer) && answer.length === 0)) {
          //     // 根据题目ID找到对应的题目序号
          //     const questionInfo = this.getQuestionInfoById(questionId)
          //     const displayName = questionInfo ? `${questionInfo.seq}题` : `题目${questionId}`
          //     errors.push(`第${displayName}未回答`)
          //   }
          // }
          
          // for (const [questionId, answer] of Object.entries(questionnaireData.answers)) {
          //   if (!this.validateAnswerFormat(questionId, answer)) {
          //     const questionInfo = this.getQuestionInfoById(questionId)
          //     const displayName = questionInfo ? `${questionInfo.seq}题` : `题目${questionId}`
          //     errors.push(`第${displayName}答案格式不正确`)
          //   }
          // }

          return {
            isValid: errors.length === 0,
            errors: errors
          }
        } catch (error) {
          console.error('数据验证过程出错:', error)
          return {
            isValid: false,
            errors: ['数据验证过程出错']
          }
        }
      },

      getQuestionInfoById(questionId) {
        const structure = this.getQuestionnaireStructure()
        
        for (const module of structure) {
          if (module.questions) {
            for (const question of module.questions) {
              if (question.topics) {
                for (const topic of question.topics) {
                  if (topic.id === questionId) {
                    return topic
                  }
                }
              }
            }
          }
        }
        
        return null
      },

      validateAnswerFormat(questionId, answer) {
        try {
          const questionInfo = this.getQuestionInfoById(questionId)
          if (!questionInfo) {
            console.warn(`未找到题目信息: ${questionId}`)
            return true // 如果找不到题目信息，暂时认为有效
          }
          
          // 根据题目类型验证（目前所有题目都是type: "1"，即单选题）
          if (questionInfo.type === "1") {
            // 单选题：答案应该是字符串且不为空
            if (typeof answer !== 'string' || answer.length === 0) {
              return false
            }
            
            // 验证答案是否在有效的分数范围内
            if (questionInfo.score) {
              const validScores = questionInfo.score.split(';')
              return validScores.includes(answer)
            }
          }
          
          return true
        } catch (error) {
          console.error('答案格式验证出错:', error)
          return false
        }
      },

      getCompletionStats() {
        const totalQuestions = this.getTotalQuestionCount()
        const completedQuestions = Object.keys(questionnaireData.answers).length
        const completionRate = totalQuestions > 0 ? (completedQuestions / totalQuestions) * 100 : 0

        return {
          totalQuestions,
          completedQuestions,
          completionRate: Math.round(completionRate),
          hasBasicInfo: Object.keys(questionnaireData.basicInfo).length > 0,
          isComplete: completedQuestions === totalQuestions && Object.keys(questionnaireData.basicInfo).length > 0,
          lastSaveTime: questionnaireData.lastSaveTime,
          startTime: questionnaireData.startTime
        }
      },

      // 导出数据
      exportData() {
        const exportData = {
          basicInfo: questionnaireData.basicInfo,
          answers: questionnaireData.answers,
          metadata: {
            startTime: questionnaireData.startTime,
            lastSaveTime: questionnaireData.lastSaveTime,
            submissionId: questionnaireData.submissionId,
            isSubmitted: questionnaireData.isSubmitted,
            exportTime: new Date().toISOString(),
            version: questionnaireData.version,
            // deviceInfo: this.getDeviceInfo()
          },
          statistics: this.getCompletionStats(),
          validation: this.validateData()
        }

        return exportData
      },

      // 重置数据
      resetAll() {
        try {
          // 备份当前数据（以防误操作）
          const backupData = {
            ...questionnaireData,
            resetTime: new Date().toISOString()
          }
          uni.setStorageSync('questionnaire_reset_backup', backupData)
          
          // 重置数据
          Object.assign(questionnaireData, {
            basicInfo: {},
            answers: {},
            currentModule: 0,
            startTime: new Date().toISOString(),
            lastSaveTime: null,
            isSubmitted: false,
            submissionId: null,
            sessionId: 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
          })
          
          // 清除存储
          this.clearLocal()
          
          console.log('数据已重置，备份已保存')
          return true
        } catch (error) {
          console.error('重置数据失败:', error)
          return false
        }
      },

      async retryFailedSubmission() {
        try {
          const failedSubmission = uni.getStorageSync('failed_submission')
          if (failedSubmission && failedSubmission.retryCount < 3) {
            console.log('重试失败的提交...')
            return await this.submitToServer()
          }
          return null
        } catch (error) {
          console.error('重试提交失败:', error)
          throw error
        }
      }
    }

    // 初始化全局数据
    const initGlobalData = () => {
      // 生成会话ID
      if (!questionnaireData.sessionId) {
        questionnaireData.sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      }
      
      // 尝试恢复数据
      const loaded = dataManager.loadFromLocal()
      
      // 只有在没有加载到已保存数据时才设置新的开始时间
      // 修复：更准确地检查 startTime 是否已从存储中加载
      if (!questionnaireData.startTime || questionnaireData.startTime === null) {
        console.log("进入加载时间")
        questionnaireData.startTime = new Date().toISOString()
      }
      
      console.log(loaded ? '数据已恢复' : '开始新问卷')
      
      // 检查是否有失败的提交需要重试
      checkFailedSubmissions()
    }
    
    // 检查数据完整性
    const checkDataIntegrity = () => {
      try {
        const validation = dataManager.validateData()
        if (!validation.isValid && Object.keys(questionnaireData.answers).length > 0) {
          console.warn('数据完整性检查发现问题:', validation.errors)
        }
      } catch (error) {
        console.error('数据完整性检查失败:', error)
      }
    }
    
    // 检查失败的提交
    const checkFailedSubmissions = async () => {
      try {
        const failedSubmission = uni.getStorageSync('failed_submission')
        if (failedSubmission && failedSubmission.retryCount < 3) {
          console.log('发现失败的提交，准备重试')
          // 可以在这里提示用户是否重试
        }
      } catch (error) {
        console.error('检查失败提交时出错:', error)
      }
    }

    onMounted(() => {
      initGlobalData()
    })

    watch(
      () => [questionnaireData.basicInfo, questionnaireData.answers],
      () => {
        // 防抖保存，避免频繁写入
        clearTimeout(window.autoSaveTimer)
        window.autoSaveTimer = setTimeout(() => {
          const success = dataManager.saveToLocal()
          if (!success) {
            console.warn('自动保存失败')
          }
        }, 1000)
      },
      { deep: true }
    )

    provide('questionnaireData', questionnaireData)
    provide('dataManager', dataManager)

    return {
      questionnaireData,
      dataManager,
      // 暴露给模板或其他组件使用的方法
      checkDataIntegrity,
      initGlobalData
    }
  },
  methods: {
    initH5PreventBack() {
      // #ifdef H5
      try {
        console.log('初始化H5阻止返回功能')
        
        // 添加历史记录，防止直接返回
        if (window.history && window.history.pushState) {
          window.history.pushState(null, null, window.location.href)
        }
        
        // 绑定事件
        this.bindH5PreventEvents()
        
        // 禁用右键菜单
        document.addEventListener('contextmenu', this.preventContextMenu, false)
        
        // 禁用选择文本
        document.addEventListener('selectstart', this.preventSelect, false)
        
        // 禁用拖拽
        document.addEventListener('dragstart', this.preventDrag, false)
        
        console.log('H5阻止返回功能初始化完成')
      } catch (error) {
        console.error('初始化H5阻止返回功能失败:', error)
      }
      // #endif
    },

    bindH5PreventEvents() {
      // #ifdef H5
      try {
        // 阻止浏览器返回
        window.addEventListener('popstate', this.handlePopState, false)
        
        // 阻止键盘事件
        document.addEventListener('keydown', this.handleKeyDown, false)
        
        // 阻止页面刷新
        window.addEventListener('beforeunload', this.handleBeforeUnload, false)
        
        // 阻止触摸滑动
        document.addEventListener('touchstart', this.handleTouchStart, { passive: false })
        document.addEventListener('touchmove', this.handleTouchMove, { passive: false })
        
        // 阻止鼠标手势
        document.addEventListener('mousedown', this.handleMouseDown, false)
        
        console.log('H5阻止返回事件绑定完成')
      } catch (error) {
        console.error('绑定H5阻止返回事件失败:', error)
      }
      // #endif
    },

    unbindH5PreventEvents() {
      // #ifdef H5
      try {
        window.removeEventListener('popstate', this.handlePopState, false)
        document.removeEventListener('keydown', this.handleKeyDown, false)
        window.removeEventListener('beforeunload', this.handleBeforeUnload, false)
        document.removeEventListener('touchstart', this.handleTouchStart, false)
        document.removeEventListener('touchmove', this.handleTouchMove, false)
        document.removeEventListener('mousedown', this.handleMouseDown, false)
        document.removeEventListener('contextmenu', this.preventContextMenu, false)
        document.removeEventListener('selectstart', this.preventSelect, false)
        document.removeEventListener('dragstart', this.preventDrag, false)
        
        console.log('H5阻止返回事件解绑完成')
      } catch (error) {
        console.error('解绑H5阻止返回事件失败:', error)
      }
      // #endif
    },

    handlePopState(event) {
      // #ifdef H5
      try {
        event.preventDefault()
        event.stopPropagation()
        
        // 重新添加历史记录
        window.history.pushState(null, null, window.location.href)
        
        // 显示提示
        this.showExitConfirm()
        
        return false
      } catch (error) {
        console.error('处理返回事件失败:', error)
      }
      // #endif
    },

    handleKeyDown(event) {
      // #ifdef H5
      try {
        // 阻止返回键 (Backspace)
        if (event.keyCode === 8) {
          const target = event.target || event.srcElement
          const tagName = target.tagName.toUpperCase()
          const inputType = target.type ? target.type.toUpperCase() : ''
          
          // 如果不是在输入框中，阻止返回键
          if (tagName !== 'INPUT' && tagName !== 'TEXTAREA' && 
              inputType !== 'TEXT' && inputType !== 'PASSWORD' && 
              inputType !== 'EMAIL' && inputType !== 'SEARCH') {
            event.preventDefault()
            event.stopPropagation()
            this.showExitConfirm()
            return false
          }
        }
        
        // 阻止ESC键
        if (event.keyCode === 27) {
          event.preventDefault()
          event.stopPropagation()
          this.showExitConfirm()
          return false
        }
        
        // 阻止F5刷新
        if (event.keyCode === 116) {
          event.preventDefault()
          event.stopPropagation()
          this.showRefreshWarning()
          return false
        }
        
        // 阻止Ctrl+R刷新
        if (event.ctrlKey && event.keyCode === 82) {
          event.preventDefault()
          event.stopPropagation()
          this.showRefreshWarning()
          return false
        }
        
        // 阻止Alt+Left返回
        if (event.altKey && event.keyCode === 37) {
          event.preventDefault()
          event.stopPropagation()
          this.showExitConfirm()
          return false
        }
        
      } catch (error) {
        console.error('处理键盘事件失败:', error)
      }
      // #endif
    },

    handleBeforeUnload(event) {
      // #ifdef H5
      try {
        // 保存数据
        dataManager.saveToLocal()
        
        // 显示确认对话框
        const message = '您的问卷数据尚未提交，确定要离开吗？'
        event.returnValue = message
        return message
      } catch (error) {
        console.error('处理页面卸载事件失败:', error)
      }
      // #endif
    },

    handleTouchStart(event) {
      // #ifdef H5
      try {
        this.touchStartX = event.touches[0].clientX
        this.touchStartY = event.touches[0].clientY
        this.touchStartTime = Date.now()
      } catch (error) {
        console.error('处理触摸开始事件失败:', error)
      }
      // #endif
    },

    handleTouchMove(event) {
      // #ifdef H5
      try {
        if (!this.touchStartX || !this.touchStartY) return
        
        const touchEndX = event.touches[0].clientX
        const touchEndY = event.touches[0].clientY
        const diffX = touchEndX - this.touchStartX
        const diffY = touchEndY - this.touchStartY
        const diffTime = Date.now() - this.touchStartTime
        
        // 检测右滑手势 (向右滑动超过50px且时间小于300ms)
        if (diffX > 50 && Math.abs(diffY) < 100 && diffTime < 300) {
          event.preventDefault()
          event.stopPropagation()
          this.showExitConfirm()
          return false
        }
        
        // 检测下拉刷新手势
        if (diffY > 100 && Math.abs(diffX) < 50 && window.scrollY === 0) {
          event.preventDefault()
          event.stopPropagation()
          this.showRefreshWarning()
          return false
        }
        
      } catch (error) {
        console.error('处理触摸移动事件失败:', error)
      }
      // #endif
    },

    handleMouseDown(event) {
      // #ifdef H5
      try {
        // 阻止鼠标侧键返回 (button 3 和 4)
        if (event.button === 3 || event.button === 4) {
          event.preventDefault()
          event.stopPropagation()
          this.showExitConfirm()
          return false
        }
      } catch (error) {
        console.error('处理鼠标事件失败:', error)
      }
      // #endif
    },

    preventContextMenu(event) {
      // #ifdef H5
      event.preventDefault()
      event.stopPropagation()
      return false
      // #endif
    },

    preventSelect(event) {
      // #ifdef H5
      event.preventDefault()
      event.stopPropagation()
      return false
      // #endif
    },

    preventDrag(event) {
      // #ifdef H5
      event.preventDefault()
      event.stopPropagation()
      return false
      // #endif
    },

    showExitConfirm() {
      // #ifdef H5
      uni.showModal({
        title: '提示',
        content: '您的问卷数据尚未提交，确定要退出吗？数据将会保存在本地。',
        confirmText: '继续答题',
        cancelText: '确定退出',
        success: (res) => {
          if (!res.confirm) {
            // 用户选择退出，清理事件监听器
            this.unbindH5PreventEvents()
            // 允许页面跳转
            window.location.href = 'about:blank'
          }
        }
      })
      // #endif
    },

    showRefreshWarning() {
      // #ifdef H5
      uni.showToast({
        title: '请勿刷新页面，数据可能丢失',
        icon: 'none',
        duration: 2000
      })
      // #endif
    },
  }
}
</script>

<style lang="scss">
@import 'uview-plus/theme.scss';
@import './uni.scss';

/* 全局样式 */
page {
  background-color: #f8fafc;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.container {
  padding: 40rpx;
  min-height: 100vh;
}

.card {
  background: white;
  border-radius: 24rpx;
  padding: 40rpx;
  margin-bottom: 40rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
}

.gradient-bg {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 50rpx;
  padding: 24rpx 60rpx;
  font-size: 32rpx;
  font-weight: 600;
}

.btn-secondary {
  background: white;
  color: #667eea;
  border: 2rpx solid #667eea;
  border-radius: 50rpx;
  padding: 24rpx 60rpx;
  font-size: 32rpx;
  font-weight: 600;
}

/* H5专用样式 - 禁用选择和拖拽 */
* {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
  user-drag: none;
}

/* 允许输入框选择文本 */
input, textarea {
  -webkit-user-select: text !important;
  -moz-user-select: text !important;
  -ms-user-select: text !important;
  user-select: text !important;
}

/* 禁用滚动条 */
::-webkit-scrollbar {
  width: 0;
  height: 0;
}

/* 禁用高亮 */
* {
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
}

/* 禁用长按菜单 */
img, a {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>
