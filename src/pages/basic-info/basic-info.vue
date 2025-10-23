<template>
  <view class="page-background">
    <view class="page-header gradient-bg">
      <view class="page-header-content">
        <text class="title">基本信息</text>
        <text class="subtitle">请填写您的基本信息</text>
      </view>
    </view>

    <view class="page-container">
      <view class="common-card">
        <u-form 
          :model="formData" 
          ref="form" 
          :rules="rules"
          labelPosition="top"
          labelWidth="auto"
        >
          <u-form-item label="单位（全名）" prop="unit" required>
            <u-input 
              v-model="formData.unit" 
              placeholder="请输入您的工作单位全名"
              :customStyle="inputStyles.default"
            />
          </u-form-item>

          <u-form-item label="姓名" prop="name" required>
            <u-input 
              v-model="formData.name" 
              placeholder="请输入您的姓名"
              :customStyle="inputStyles.default"
            />
          </u-form-item>

          <u-form-item label="性别" prop="gender" required>
            <u-radio-group v-model="formData.gender" placement="row">
              <u-radio 
                v-for="item in genderOptions" 
                :key="item.value"
                :label="item.label"
                :name="item.value"
                activeColor="#667eea"
              >
                {{ item.label }}
              </u-radio>
            </u-radio-group>
          </u-form-item>

          <u-form-item label="年龄" prop="age" required>
            <u-radio-group v-model="formData.age" placement="column">
              <u-radio 
                v-for="item in ageOptions" 
                :key="item.value"
                :label="item.label"
                :name="item.value"
                activeColor="#667eea"
                :customStyle="{ marginBottom: '20rpx' }"
              >
                {{ item.label }}
              </u-radio>
            </u-radio-group>
          </u-form-item>

          <u-form-item label="工龄" prop="workYears" required>
            <u-radio-group v-model="formData.workYears" placement="column">
              <u-radio 
                v-for="item in workYearsOptions" 
                :key="item.value"
                :label="item.label"
                :name="item.value"
                activeColor="#667eea"
                :customStyle="{ marginBottom: '20rpx' }"
              >
                {{ item.label }}
              </u-radio>
            </u-radio-group>
          </u-form-item>

          <u-form-item label="职位级别" prop="position" required>
            <u-radio-group v-model="formData.position" placement="column">
              <u-radio 
                v-for="item in positionOptions" 
                :key="item.value"
                :label="item.label"
                :name="item.value"
                activeColor="#667eea"
                :customStyle="{ marginBottom: '20rpx' }"
              >
                {{ item.label }}
              </u-radio>
            </u-radio-group>
          </u-form-item>

          <u-form-item label="婚姻状况" prop="maritalStatus" required>
            <u-radio-group v-model="formData.maritalStatus" placement="row">
              <u-radio 
                v-for="item in maritalStatusOptions" 
                :key="item.value"
                :label="item.label"
                :name="item.value"
                activeColor="#667eea"
                :customStyle="{ margin:'10rpx 30rpx 10rpx 0' }"
              >
                {{ item.label }}
              </u-radio>
            </u-radio-group>
          </u-form-item>

          <u-form-item label="子女状况" prop="childrenStatus" required>
            <u-radio-group v-model="formData.childrenStatus" placement="row">
              <u-radio 
                v-for="item in childrenStatusOptions" 
                :key="item.value"
                :label="item.label"
                :name="item.value"
                activeColor="#667eea"
                :customStyle="{ marginBottom: '20rpx', marginRight: '30rpx' }"
              >
                {{ item.label }}
              </u-radio>
            </u-radio-group>
          </u-form-item>

          <u-form-item label="您有身体健康方面的担忧吗" prop="healthConcern" required>
            <u-radio-group v-model="formData.healthConcern" placement="column">
              <u-radio 
                v-for="item in concernLevelOptions" 
                :key="item.value"
                :label="item.label"
                :name="item.value"
                activeColor="#667eea"
                :customStyle="{ marginBottom: '20rpx' }"
              >
                {{ item.label }}
              </u-radio>
            </u-radio-group>
          </u-form-item>

          <u-form-item label="您的经济压力" prop="economicPressure" required>
            <u-radio-group v-model="formData.economicPressure" placement="column">
              <u-radio 
                v-for="item in pressureLevelOptions" 
                :key="item.value"
                :label="item.label"
                :name="item.value"
                activeColor="#667eea"
                :customStyle="{ marginBottom: '20rpx' }"
              >
                {{ item.label }}
              </u-radio>
            </u-radio-group>
          </u-form-item>

          <u-form-item label="您的工作压力" prop="workPressure" required>
            <u-radio-group v-model="formData.workPressure" placement="column">
              <u-radio 
                v-for="item in pressureLevelOptions" 
                :key="item.value"
                :label="item.label"
                :name="item.value"
                activeColor="#667eea"
                :customStyle="{ marginBottom: '20rpx' }"
              >
                {{ item.label }}
              </u-radio>
            </u-radio-group>
          </u-form-item>

          <u-form-item label="您的家庭负担" prop="familyBurden" required>
            <u-radio-group v-model="formData.familyBurden" placement="column">
              <u-radio 
                v-for="item in pressureLevelOptions" 
                :key="item.value"
                :label="item.label"
                :name="item.value"
                activeColor="#667eea"
                :customStyle="{ marginBottom: '20rpx' }"
              >
                {{ item.label }}
              </u-radio>
            </u-radio-group>
          </u-form-item>

          <u-form-item label="您的人际压力" prop="interpersonalPressure" required>
            <u-radio-group v-model="formData.interpersonalPressure" placement="column">
              <u-radio 
                v-for="item in pressureLevelOptions" 
                :key="item.value"
                :label="item.label"
                :name="item.value"
                activeColor="#667eea"
                :customStyle="{ marginBottom: '20rpx' }"
              >
                {{ item.label }}
              </u-radio>
            </u-radio-group>
          </u-form-item>
        </u-form>
      </view>

      <view class="action-section">
        <u-button 
          type="primary" 
          size="large" 
          shape="round"
          :custom-style="buttonStyles.primary"
          :loading="loading"
          @click="submitBasicInfo"
        >
          {{ loading ? '保存中...' : '保存并继续' }}
        </u-button>
      </view>
    </view>
  </view>
</template>

<script>
import { buttonStyles, inputStyles } from '@/utils/styles';
import { checkUser } from '../../service/system'
export default {
  name: 'BasicInfoPage',
  data() {
    return {
      loading: false,
      buttonStyles,
      inputStyles,
      formData: {
        unit: '',
        name: '',
        gender: '',
        age: '',
        workYears: '',
        position: '',
        maritalStatus: '',
        childrenStatus: '',
        healthConcern: '',
        economicPressure: '',
        workPressure: '',
        familyBurden: '',
        interpersonalPressure: ''
      },
      genderOptions: [
        { label: '男', value: '1' },
        { label: '女', value: '2' }
      ],
      ageOptions: [
        { label: '29岁以下', value: '1' },
        { label: '30-39岁', value: '2' },
        { label: '40-49岁', value: '3' },
        { label: '50岁以上', value: '4' }
      ],
      workYearsOptions: [
        { label: '5年以下', value: '1' },
        { label: '6-10年', value: '2' },
        { label: '11-20年', value: '3' },
        { label: '21-30年', value: '4' },
        { label: '30年以上', value: '5' }
      ],
      positionOptions: [
        { label: '科员', value: '1' },
        { label: '副科', value: '2' },
        { label: '正科', value: '3' },
        { label: '副处', value: '4' },
        { label: '正处', value: '5' },
        { label: '副厅', value: '6' },
        { label: '正厅', value: '7' },
		{ label: '副高', value: '8' },
		{ label: '正高', value: '9' },
      ],
      maritalStatusOptions: [
        { label: '未婚', value: '1' },
        { label: '已婚', value: '2' },
        { label: '丧偶', value: '3' },
        { label: '离异', value: '4' }
      ],
      childrenStatusOptions: [
        { label: '无子女', value: '1' },
        { label: '独生子', value: '2' },
        { label: '多子女', value: '3' }
      ],
      concernLevelOptions: [
        { label: '无', value: '1' },
        { label: '很少', value: '2' },
        { label: '一般', value: '3' },
        { label: '较大', value: '4' },
        { label: '很多', value: '5' }
      ],
      pressureLevelOptions: [
        { label: '无', value: '1' },
        { label: '很小', value: '2' },
        { label: '一般', value: '3' },
        { label: '较大', value: '4' },
        { label: '很大', value: '5' }
      ],
      rules: {
        unit: [
          { required: true, message: '请输入工作单位', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
		gender: [
		  { required: true, message: '请选择性别', trigger: 'change' }
		],
		age: [
		  { required: true, message: '请选择年龄', trigger: 'change' }
		],
		workYears: [
		  { required: true, message: '请选择工龄', trigger: 'change' }
		],
		position: [
		  { required: true, message: '请选择职位级别', trigger: 'change' }
		],
		maritalStatus: [
		  { required: true, message: '请选择婚姻状况', trigger: 'change' }
		],
		childrenStatus: [
		  { required: true, message: '请选择子女状况', trigger: 'change' }
		],
		healthConcern: [
		  { required: true, message: '请选择健康担忧程度', trigger: 'change' }
		],
		economicPressure: [
		  { required: true, message: '请选择经济压力程度', trigger: 'change' }
		],
		workPressure: [
		  { required: true, message: '请选择工作压力程度', trigger: 'change' }
		],
		familyBurden: [
		  { required: true, message: '请选择家庭负担程度', trigger: 'change' }
		],
		interpersonalPressure: [
		  { required: true, message: '请选择人际压力程度', trigger: 'change' }
		]
      }
    }
  },
  inject: ['questionnaireData', 'dataManager'],
  onLoad() {
    if (this.questionnaireData.basicInfo) {
      Object.assign(this.formData, this.questionnaireData.basicInfo)
    }
  },
  methods: {
    async submitBasicInfo() {
      try {
        const valid = await this.$refs.form.validate()
        if (!valid) {
          return
        }

        this.loading = true

        Object.assign(this.questionnaireData.basicInfo, this.formData)
        
        
		this.dataManager.saveToLocal()
    let params = {
      data:{
        unit:this.formData.unit,
        name:this.formData.name
      }
    }
		const checkResult = await checkUser(params)
		if(checkResult.data.isFinish == '1'){
			//跳转到结果页
			uni.showToast({
			  title: '用户已完成问卷,将跳转结果页',
			  icon: 'success'
			})
			this.questionnaireData.isSubmitted = true
			setTimeout(() => {
			  uni.navigateTo({
			    url: '/pages/result/result'
			  })
			}, 1000)
		}else{
			
			await new Promise(resolve => setTimeout(resolve, 800))
			uni.showToast({
			  title: '保存成功',
			  icon: 'success'
			})
			
			setTimeout(() => {
			  uni.navigateTo({
			    url: '/pages/questionnaire/questionnaire'
			  })
			}, 1000)
		}

      } catch (error) {
        console.error('保存基本信息失败:', error)
        uni.showToast({
          title: '保存失败，请重试',
          icon: 'error'
        })
      } finally {
        this.loading = false
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

.action-section {
  text-align: center;
  padding: 0 40rpx;
}

:deep(.u-form-item__label) {
  font-size: 30rpx !important;
  font-weight: 600 !important;
  color: #374151 !important;
  margin-bottom: 20rpx !important;
}

:deep(.u-radio__label) {
  font-size: 28rpx !important;
  color: #374151 !important;
}
</style>
