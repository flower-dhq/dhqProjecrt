<template>
  <view class="page-background">
    <view class="page-header gradient-bg" style="height: 400rpx;">
      <view class="page-header-content">
        <u-icon name="checkmark-circle" color="white" size="80"></u-icon>
        <text class="title" style="margin: 20rpx 0 16rpx;">问卷完成</text>
        <text class="subtitle">感谢您的参与</text>
      </view>
    </view>

    <view class="page-container">
      <!-- 添加心理健康评估结果展示 -->
      <view class="common-card" v-if="resultData">
        <view class="result-header">
          <text class="result-title">心理健康评估结果</text>
        </view>
        
        <view class="health-level-section">
          <text class="greeting">您好，根据您的答题结果，推测您目前心理健康状况为：</text>
          <view class="level-display">
            <text class="level-number">{{ safesList[levelIndex].lev }}级</text>
            <text class="level-description">{{ safesList[levelIndex].remark }}</text>
          </view>
        </view>
		
		<!-- 添加心理健康等级进度条 -->
		<view class="health-progress-section">
		  <view class="progress-container">
			<view class="progress-levels">
			  <view 
				v-for="(level,i) in safesList" 
				:key="i"
				class="progress-level"
				:class="{ 'active': i==levelIndex }"
			  >
				<view class="level-box">
				  <text class="level-text">{{ level.lev }}级</text>
				  <text class="level-name">{{ level.name }}</text>
				</view>
			  </view>
			</view>
			<view class="progress-indicator">
			  <view class="indicator-arrow" :style="{ left: getIndicatorPosition() }">
				<view class="arrow-right"></view>
			  </view>
			</view>
		  </view>
		</view>

        <view class="indicators-section">
          <text class="section-title">具体测评指标如下：</text>
		  <!-- <view class="indicators-table">
		    <view class="table-header">
		      <text class="header-cell">1级情绪状况</text>
		      <text class="header-cell">2级身心状态</text>
		      <text class="header-cell">3级生命状况</text>
		    </view>
		    <view class="table-row">
		      <view class="indicator-cell">
		        <text class="indicator-name">{{getIndicatorResult('A').label}}</text>
		        <text class="indicator-result">{{ getIndicatorTableResult('A') }}</text>
		      </view>
		      <view class="indicator-cell">
		        <text class="indicator-name">{{getIndicatorResult('C').label}}</text>
		        <text class="indicator-result">{{ getIndicatorTableResult('C') }}</text>
		      </view>
		      <view class="indicator-cell">
		        <text class="indicator-name">{{getIndicatorResult('E').label}}</text>
		        <text class="indicator-result">{{ getIndicatorTableResult('E') }}</text>
		      </view>
		    </view>
		    <view class="table-row">
		      <view class="indicator-cell">
		        <text class="indicator-name">{{getIndicatorResult('B').label}}</text>
		        <text class="indicator-result">{{ getIndicatorTableResult('B') }}</text>
		      </view>
		      <view class="indicator-cell">
		        <text class="indicator-name">{{getIndicatorResult('D').label}}</text>
		        <text class="indicator-result">{{ getIndicatorTableResult('D') }}</text>
		      </view>
		      <view class="indicator-cell">
		        <text class="indicator-name">{{getIndicatorResult('F').label}}</text>
		        <text class="indicator-result">{{ getIndicatorTableResult('F') }}</text>
		      </view>
		    </view>
		  </view> -->
      
      <view class="warns-list" v-for="(item,i) in warnsList" :key="i">
        <view class="name">{{ item.groupName }}</view>
        <view class="cont" v-for="(value,index) in item.warns">{{ index+1 }}、{{ value.enTips }}。</view>
      </view>
		  <!-- <p class="text-indent" v-for="(item,i) in warnsList">{{ i+1 }}、{{ item }}。</p> -->

		  <!-- <p class="text-indent">首先，在情绪状况方面，一方面您<text >{{ getIndicatorResult('A').label }}</text>；另一方面您<text >{{ getIndicatorResult('B').label }}</text>。</p>
		  <p class="text-indent">其次，在身心状态方面，一方面您<text >{{ getIndicatorResult('C').label }}</text>；另一方面您<text >{{ getIndicatorResult('D').label }}</text>。</p>
		  <p class="text-indent">最后，在生命状况方面，一方面您<text >{{ getIndicatorResult('E').label }}</text>；另一方面您<text >{{ getIndicatorResult('F').label }}</text>。</p> -->
        </view>

        <view class="attitude-section">
          <text class="section-title">答题态度检查</text>
          <text class="attitude-note">为了确保答题的有效性，本次测试还考察了您的答题态度。若存在下列问题，表示结果可信度较低。</text>
          <view class="attitude-table">
            <view class="attitude-row" v-for="(item,i) in strutsList" :key="i">
              <text class="attitude-label">{{ item.remark }}</text>
              <text class="attitude-result">{{ item.isCheck==1 ? '是':'否' }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 保留基本完成信息但简化展示 -->
      <view class="common-card">
        <view class="completion-info">
          <view class="info-item">
            <u-icon name="clock" color="#10b981" size="40"></u-icon>
            <view class="info-content">
              <text class="info-title">用时</text>
              <text class="info-value">{{ formatDuration(duration) }}</text>
            </view>
          </view>

          <view class="info-item">
            <u-icon name="calendar" color="#10b981" size="40"></u-icon>
            <view class="info-content">
              <text class="info-title">完成时间</text>
              <text class="info-value">{{ formatTime(endTime) }}</text>
            </view>
          </view>
        </view>

        <view class="submission-section" v-if="!isSubmitted">
          <u-button 
            type="primary" 
            size="large" 
            shape="round"
            :custom-style="buttonStyles.primary"
            :loading="submitting"
            @click="submitQuestionnaire"
          >
            {{ submitting ? '提交中...' : '提交问卷' }}
          </u-button>
        </view>

        <view class="success-section" v-else>
          <view class="success-info">
            <u-icon name="checkmark-circle" color="#10b981" size="60"></u-icon>
            <text class="success-text">问卷已成功提交</text>
            <!-- <text class="submission-id">提交编号：{{ questionnaireData.submissionId }}</text> -->
          </view>
        </view>
      </view>

      <!-- 移除导出功能，只保留重新开始 -->
      <view class="action-section" v-if="!isSubmitted">
        <u-button 
          type="default" 
          size="large" 
          shape="round"
          :custom-style="buttonStyles.secondary"
          @click="startNew"
        >
          重新开始
        </u-button>
      </view>
    </view>
  </view>
</template>

<script>
import { buttonStyles } from '@/utils/styles';
import { getQuestionResult, submitQuestion } from '@/service/question'
import utils from '@/js/utils'

export default {
  name: 'ResultPage',
  data() {
    return {
      submitting: false,
      buttonStyles,
      resultData: null,
      levelDescriptions: {
        6: "您的心理健康状况被确定为6级，表示非常健康，目前无任何明显问题，说明您自身具有积极的能力和品质，能够顺利应对生活和工作方面的挑战，祝福您继续保持良好的状态。",
        5: "您的心理健康状况被确定为5级，表示健康，虽然有个别轻微的问题，但无明显症状，不影响正常的生活和工作。说明您自身的力量能够帮助您顺利应对生活和工作中的大部分问题，但还需要进一步的提升，期望您能够有更为良好的状态。",
        4: "您的心理健康状况被确定为4级，表示基本健康，虽然整体上无严重问题，但一些指标显示具有一定的症状，说明您需要更多的了解心理健康保健方面的知识，帮助您提升目前的生活质量。",
        3: "您的心理健康状况被确定为3级，表示心理健康状况可能存在风险。说明您需要投入一定的时间和精力去改善您的心理健康状况，确保自身生活和工作不受其影响。",
        2: "您的心理健康状况被确定为2级，达到了心理健康的预警水平，说明存在心理问题，希望您能够联系专业的心理健康机构或医院的心理门诊进行一定的咨询，帮助自己尽快脱离心理困扰。",
        1: "您的心理健康状况被确定为1级，达到了心理健康的正式预警水平，说明存在心理问题，为了防止问题进一步加剧，希望您能够主动联系专业的心理健康机构或医院的心理门诊进行专业辅导，期待尽快解决您的问题。"
      },
      isSubmitted:false,
      endTime:null,
      safesList:[],
      resInfo:{},
      levelIndex:0, //等级下标
      strutsList:[],
      warnsList:[],
      duration:null,
    }
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
  },

  computed: {
    // completionStats() {
    //   return this.dataManager.getCompletionStats()
    // },
    
    healthLevel() {
      if (!this.resultData) return 6
      const score = this.resultData.totalScore
      if (score === 0) return 6
      if (score >= 1 && score <= 2) return 5
      if (score >= 3 && score <= 5) return 4
      if (score >= 6 && score <= 10) return 3
      if (score >= 11 && score <= 12) return 2
      if (score >= 13 && score <= 14) return 1
      return 6
    },
    levelDescription() {
      return this.levelDescriptions[this.healthLevel] || ''
    }
  },

  mounted() {
    const { QUESTIONNAIRE_INFO } = this.$constant
    const obj = utils.storageAction({ key: QUESTIONNAIRE_INFO, action: 'get' });
    if(obj.isSubmitted){
      this.endTime = obj.endTime
      this.isSubmitted = obj.isSubmitted
      this.getResult()
    }else{
      obj.endTime = new Date()
      this.endTime = new Date()
    }
    utils.storageAction({ key: QUESTIONNAIRE_INFO, action: 'set', value: obj })
    this.durationFun()
  },
  methods: {
    durationFun() {
      const { QUESTIONNAIRE_INFO } = this.$constant
      const obj = utils.storageAction({ key: QUESTIONNAIRE_INFO, action: 'get' }) || {};
      if (!obj.startTime) this.duration =  0
      this.duration =  Math.round(((obj.endTime?new Date(obj.endTime):new Date()) - new Date(obj.startTime)) / 1000 / 60)
    },
    //获取问卷结果
    async getResult(){
      const { BASIC_INFO, QUESTIONNAIRE_INFO } = this.$constant
      const basicInfo= utils.storageAction({ key: BASIC_INFO, action: 'get' });
      const questionInfo= utils.storageAction({ key: QUESTIONNAIRE_INFO , action: 'get' });
      let params = {
        data:{
          basicInfo,
        }
      }
      const tmpResult = await getQuestionResult(params)
      if(tmpResult.code == 20000){
        let data = tmpResult.data
        this.resInfo = data
        this.safesList = data.safes
        this.strutsList = data.struts
        this.levelIndex = this.safesList.findIndex(item => item.lev === data.riskLevel);
        this.warnsList = data.warns
       
        this.resultData = data
        this.endTime = data.endTime
        //把时间放回缓存里
        questionInfo.startTime = data.startTime
        questionInfo.endTime = data.endTime
        utils.storageAction({ key: QUESTIONNAIRE_INFO , action: 'set', value:questionInfo });
        this.durationFun()
      }  
    },
    async submitQuestionnaire() {
      const { BASIC_INFO, QUESTIONNAIRE_INFO } = this.$constant
      const basicInfo= utils.storageAction({ key: BASIC_INFO, action: 'get' });
      const questionInfo= utils.storageAction({ key: QUESTIONNAIRE_INFO , action: 'get' });
      try {
        this.submitting = true
        let myParams = {
          data:{
            basicInfo,
            answers:questionInfo.answers,
            startTime:questionInfo.startTime,
            endTime:new Date(),
          }
        }
        const response = await submitQuestion(myParams)
        if(response.code == 20000){
          questionInfo.isSubmitted = true
          this.isSubmitted = true
          utils.storageAction({ key: QUESTIONNAIRE_INFO , action: 'set', value:questionInfo });
          uni.showToast({
            title: '提交成功',
            icon: 'success'
          })
          this.getResult()
        }
        
      } catch (error) {
        console.error('提交失败:', error)
        uni.showToast({
          title: '提交失败，请重试',
          icon: 'error'
        })
      } finally {
        this.submitting = false
      }
    },
    
    startNew() {
      uni.showModal({
        title: '确认重新开始',
        content: '这将清除所有已填写的数据，确定要重新开始吗？',
        success: (res) => {
          if (res.confirm) {
            const { QUESTIONNAIRE_INFO } = this.$constant
            utils.storageAction({ key: QUESTIONNAIRE_INFO , action: 'set', value:{} });
            uni.reLaunch({
              url: '/pages/questionnaire-baseInfo'
            })
          }
        }
      })
    },
    
    getIndicatorResult(indicator) {
      if (!this.resultData || !this.resultData.tableMap) return '无'
	  
      const score = parseInt(this.resultData.tableMap[indicator]) || 0
	  var resultMap = {};
	  if(indicator == 'A'){
		resultMap = {
			0:{label:'精力比较充沛、能够积极进取',color:'green'},
			1:{label:'情绪有时较为低落',color:'green'},
			2:{label:'情绪时常低落，常出现失望感',color:'orange'},
			3:{label:'情绪十分低落，具有强烈的失望感',color:'red'}
		}
	  }else if(indicator == 'B'){
		resultMap = {
			0:{label:'遇到事情不会紧张、很少焦虑',color:'green'},
			1:{label:'遇到事情有时会感到紧张和焦虑',color:'green'},
			2:{label:'遇到事情多数情况下会感到紧张和焦虑',color:'orange'},
			3:{label:'遇到事情总是感到非常紧张，十分焦虑',color:'red'}
		}  
	  }else if(indicator == 'C'){
		resultMap = {
			0:{label:'做事主动，具有活力',color:'green'},
			1:{label:'有时有疲惫感，会丧失做事的兴趣',color:'green'},
			2:{label:'身心经常感到疲惫，提不起精神，感兴趣的事情很少',color:'orange'},
			3:{label:'身心具有强烈的疲惫感，感受不到生活的乐趣',color:'red'}
		}  
	  }else if(indicator == 'D'){
		resultMap = {
			0:{label:'能够顺利应对生活中的问题',color:'green'},
			1:{label:'有时会感到压力，出现紧张的状况，但总体上能够应对生活中的问题',color:'green'},
			2:{label:'较多时候处于压力之中，神经紧张，遇到事情容易激动',color:'orange'},
			3:{label:'总是处于非常紧张的状态、遇到事情反应强烈、过于激动',color:'red'}
		}  
	  }else if(indicator == 'E'){
		resultMap = {
			0:{label:'有生活目标和人生奋斗的方向',color:'green'},
			1:{label:'容易产生自我否定的感觉，感到生命没有意义',color:'red'}
		}  
	  }else if(indicator == 'F'){
		resultMap = {
			0:{label:'对身边的事情不会感到惊恐和害怕',color:'green'},
			1:{label:'总会无缘由的感到惊恐和害怕',color:'red'}
		}  
	  }
      
      return resultMap[score] || {label:'无',color:'grey'}
    },
    getIndicatorTableResult(indicator) {
      if (!this.resultData || !this.resultData.tableMap) return '无'
      const score = parseInt(this.resultData.tableMap[indicator]) || 0
      const resultMap = {
        0: '无',
        1: indicator === 'E' || indicator === 'F' ? '有' : '轻度',
        2: '中度', 
        3: '重度'
      }
      return resultMap[score] || '无'
    },
    
    getAttitudeResult(key) {
      if (!this.resultData || !this.resultData.tableMap) return '否'
      const score = parseInt(this.resultData.tableMap[key]) || 0
      
      if (key === 'A21' || key === 'B21' || key === 'E14') {
        return (score === 1 ) ? '是' : '否'
      } 
      return '否'
    },
    
    formatDuration(minutes) {
      if (minutes < 1) return '不到1分钟'
      return `${minutes}分钟`
    },
    
    formatTime(date) {
      return utils.formatDate(date)
      // return date.toLocaleString('zh-CN', {
      //   year: 'numeric',
      //   month: '2-digit',
      //   day: '2-digit',
      //   hour: '2-digit',
      //   minute: '2-digit'
      // })
    },
	
    getLevelName(level) {
      const levelNames = {
        6: '非常健康',
        5: '健康', 
        4: '基本健康',
        3: '存在风险',
        2: '轻度预警',
        1: '正式预警'
      }
      return levelNames[level] || ''
    },
    
    getIndicatorPosition() {
      // 计算当前等级在进度条中的位置（百分比）
      let length = this.safesList.length
      const position = ((length - this.levelIndex) / length) * 100 + 8
      return `${position}%`
    }
  }
}
</script>

<style lang="scss" scoped>
.result-header {
  text-align: center;
  margin-bottom: 40rpx;
  
  .result-title {
    font-size: 36rpx;
    font-weight: 600;
    color: #1f2937;
  }
}



.health-level-section {
  margin-bottom: 60rpx;
  
  .greeting {
    display: block;
    font-size: 28rpx;
    color: #374151;
    margin-bottom: 30rpx;
    line-height: 1.6;
  }
  
  .level-display {
    background: linear-gradient(135deg, #10b981, #059669);
    border-radius: 20rpx;
    padding: 40rpx;
    text-align: center;
    
    .level-number {
      display: block;
      font-size: 48rpx;
      font-weight: 700;
      color: white;
      margin-bottom: 20rpx;
    }
    
    .level-description {
      font-size: 26rpx;
      color: white;
      line-height: 1.6;
    }
  }
}

.indicators-section {
  margin-bottom: 60rpx;
  
  .section-title {
    display: block;
    font-size: 32rpx;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 30rpx;
  }
  
  .indicators-table {
	margin-bottom: 20px;
    .table-header {
      display: flex;
      background-color: #f3f4f6;
      border-radius: 12rpx 12rpx 0 0;
      
      .header-cell {
        flex: 1;
        padding: 20rpx;
        font-size: 24rpx;
        font-weight: 600;
        color: #374151;
        text-align: center;
        border-right: 1px solid #e5e7eb;
        
        &:last-child {
          border-right: none;
        }
      }
    }
    
    .table-row {
      display: flex;
      border-bottom: 1px solid #e5e7eb;
      
      &:last-child {
        border-bottom: none;
        border-radius: 0 0 12rpx 12rpx;
      }
      
      .indicator-cell {
        flex: 1;
        padding: 30rpx 20rpx;
        border-right: 1px solid #e5e7eb;
        
        &:last-child {
          border-right: none;
        }
        
        .indicator-name {
          display: block;
          font-size: 22rpx;
          color: #6b7280;
          margin-bottom: 10rpx;
          line-height: 1.4;
        }
        
        .indicator-result {
          font-size: 28rpx;
          font-weight: 600;
          color: #1f2937;
        }
      }
    }
  }
}

.attitude-section {
  .section-title {
    display: block;
    font-size: 32rpx;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 20rpx;
  }
  
  .attitude-note {
    display: block;
    font-size: 24rpx;
    color: #6b7280;
    margin-bottom: 30rpx;
    line-height: 1.5;
  }
  
  .attitude-table {
    .attitude-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 25rpx 0;
      border-bottom: 1px solid #f3f4f6;
      
      &:last-child {
        border-bottom: none;
      }
      
      .attitude-label {
        font-size: 26rpx;
        color: #374151;
      }
      
      .attitude-result {
        font-size: 26rpx;
        font-weight: 600;
        color: #1f2937;
      }
    }
  }
}

.completion-info {
  margin-bottom: 60rpx;
  
  .info-item {
    display: flex;
    align-items: center;
    margin-bottom: 40rpx;
    
    .info-content {
      margin-left: 20rpx;
      
      .info-title {
        display: block;
        font-size: 24rpx;
        color: #6b7280;
        margin-bottom: 8rpx;
      }
      
      .info-value {
        font-size: 32rpx;
        font-weight: 600;
        color: #1f2937;
      }
    }
  }
}

.submission-section {
  text-align: center;
}

.success-section {
  text-align: center;
  
  .success-info {
    .success-text {
      display: block;
      font-size: 32rpx;
      font-weight: 600;
      color: #10b981;
      margin: 20rpx 0;
    }
    
    .submission-id {
      font-size: 24rpx;
      color: #6b7280;
    }
  }
}

.health-progress-section {
  margin-bottom: 60rpx;
  
  .progress-container {
    background: white;
    border-radius: 16rpx;
    padding: 40rpx;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
    
    .progress-levels {
      display: flex;
      margin-bottom: 60rpx;
      
      .progress-level {
        flex: 1;
        position: relative;
        
        &:not(:last-child)::after {
          content: '';
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 1px;
          height: 80rpx;
          background-color: #e5e7eb;
        }
        
        .level-box {
          height: 120rpx;
          padding: 20rpx 10rpx;
          text-align: center;
          // border-radius: 12rpx;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          justify-content: center;
          
          .level-text {
            display: block;
            font-size: 24rpx;
            font-weight: 600;
            color: #374151;
            margin-bottom: 8rpx;
          }
          
          .level-name {
            display: block;
            font-size: 20rpx;
            color: #6b7280;
            line-height: 1.2;
          }
        }
        
        &.active .level-box {
          //background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          transform: scale(1.05);
		  .level-text,
		  .level-name {
		    font-weight: 700;
		  }
        }
        
        // 根据等级设置不同的背景色
		// 根据等级设置不同的背景色
		&:nth-child(1) .level-box {
		  background-color: #dbeafe;
		}
		
		
		&:nth-child(2) .level-box {
		  background-color: #bfdbfe;
		}
		
		&:nth-child(3) .level-box {
		  background-color: #93c5fd;
		}
		
		&:nth-child(4) .level-box {
		  background-color: #60a5fa;
		}
		
		&:nth-child(5) .level-box {
		  background-color: #3b82f6;
		  
		  .level-text,
		  .level-name {
		    color: white;
		  }
		}
		
		&:nth-child(6) .level-box {
		  background-color: #1d4ed8;
		  
		  .level-text,
		  .level-name {
		    color: white;
		  }
		}
		
        &.active:nth-child(1) .level-box,
		&.active:nth-child(2) .level-box,
		&.active:nth-child(3) .level-box {
		   background: linear-gradient(135deg, #10b981, #059669);
		  .level-text,
		  .level-name {
		    color: white;
		  }
		}
		
		&.active:nth-child(4) .level-box,
		&.active:nth-child(5) .level-box {
		  background: linear-gradient(135deg, #f59e0b, #d97706);
		  .level-text,
		  .level-name {
		    color: white;
		  }
		}
		
		&.active:nth-child(6) .level-box {
		   background: linear-gradient(135deg, #ef4444, #dc2626);
		  .level-text,
		  .level-name {
		    color: white;
		  }
		}
      }
    }
    
    .progress-indicator {
      position: relative;
      height: 60rpx;
      background: linear-gradient(to right, #dbeafe, #1d4ed8);
      border-radius: 30rpx;
      
      .indicator-arrow {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        transition: left 0.5s ease;
        
        .arrow-right {
          width: 0;
          height: 0;
          border-left: 20rpx solid transparent;
          border-right: 20rpx solid transparent;
          border-bottom: 40rpx solid #ef4444;
          transform: translateX(-50%);
        }
      }
    }
  }
}
.text-indent {
    text-indent: 2em;
}

.warns-list{
  padding: 6rpx 0;
  font-size: 28rpx;
  .name{
    margin-bottom: 5prx;
    font-weight: bold;
  }
  .cont{
    padding: 5rpx 0;
  }
}
</style>
