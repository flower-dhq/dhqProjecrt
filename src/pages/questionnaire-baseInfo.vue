<template>
  <view class="pages-box">
    <!-- #ifdef H5 -->
    <view class="title">问卷指导语</view>
    <!-- #endif -->
    <view class="hand-box bg-gradient">
      <view class="cont-text">
        <view class="big-text">基本信息</view>
        <view class="small-text">请填写您的基本信息</view>
      </view>
    </view>
    <view class="content-box">
      <view class="form-list">
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
                :customStyle="{ padding:'10rpx 30rpx 20rpx 0' }"
              >
                
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
                :customStyle="{padding: '8px 0 12px'}"
              >
                
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
                :customStyle="{padding: '8px 0 12px'}"
              >
                
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
                :customStyle="{padding: '8px 0 12px'}"
              >
                
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
                :customStyle="{ padding:'10rpx 30rpx 20rpx 0' }"
              >
                
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
                :customStyle="{ padding:'10rpx 30rpx 20rpx 0' }"
              >
                
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
                :customStyle="{padding: '8px 0 12px'}"
              >
                
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
                :customStyle="{padding: '8px 0 12px'}"
              >
                
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
                :customStyle="{padding: '8px 0 12px'}"
              >
                
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
                :customStyle="{padding: '8px 0 12px'}"
              >
                
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
                :customStyle="{padding: '8px 0 12px'}"
              >
              </u-radio>
            </u-radio-group>
          </u-form-item>
        </u-form>
      </view>
    </view>

    <view class="btn-cont">
      <u-button size="large" :custom-style="buttonStyles.primary" @click="submitBasicInfo" class="btn" text="保存并继续"></u-button>
    </view>
  </view>
</template>

<script>
import { buttonStyles, inputStyles } from '@/utils/styles';
import { checkUserInfo, getIssueId } from '../service/question'
import utils from '@/js/utils'
export default{
  data(){
    return{
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
        interpersonalPressure: '',
        issueId:''
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

  computed: {

  },

  onLoad(){
    const { BASIC_INFO } = this.$constant
    const data= utils.storageAction({ key: BASIC_INFO, action: 'get' });
    if(JSON.stringify(data)!='{}' && data){
      this.formData = JSON.parse(JSON.stringify(data))
    }
    this.getIssueIdFun()

    
    // #ifdef MP-WEIXIN
    wx.enableAlertBeforeUnload({
      message: "您的问卷数据尚未提交，确定要退出吗？数据将会保存在本地。",
      success: function (res) {
      },
      fail: function (errMsg) {
        console.log("点击取消按钮了：", errMsg);
      },
    })
    // #endif
  },

  methods:{

    //提交
    async submitBasicInfo() {
      try {
        const valid = await this.$refs.form.validate()
        if (!valid) {
          return
        }
        this.loading = true

        //设置基本信息缓存
        const { BASIC_INFO, QUESTIONNAIRE_INFO } = this.$constant
        utils.storageAction({ key: BASIC_INFO, action: 'set', value: this.formData });
        
        //提交基本信息
        let params = {
          data:{
            unit:this.formData.unit,
            name:this.formData.name,
            issueId:this.formData.issueId, //发布id
          }
        }
        const checkResult = await checkUserInfo(params)
        if(checkResult.data.isFinish == '1'){
          //跳转到结果页
          uni.showToast({
            title: '用户已完成问卷,将跳转结果页',
            icon: 'success'
          })
          const data= utils.storageAction({ key: QUESTIONNAIRE_INFO, action: 'get' }) || {};
          data.isSubmitted = true
          utils.storageAction({ key: QUESTIONNAIRE_INFO, action: 'set', value:data });
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
          const obj= utils.storageAction({ key: QUESTIONNAIRE_INFO, action: 'get' }) || {};
          obj.startTime = new Date()
          utils.storageAction({ key: QUESTIONNAIRE_INFO, action: 'set', value: obj });
          setTimeout(() => {
            uni.navigateTo({
              url: '/pages/questionnaire-list'
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
    },

    //获取发布id
    getIssueIdFun(){
      let params = {
        data:{}
      }
      getIssueId(params).then(res =>{
        if(res.code==20000){
          this.formData.issueId=res.data
        }
      })
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

.content-box{
  padding: 82rpx 40rpx 40rpx;
  margin-bottom: 22rpx;
}
.form-list{
  padding: 62rpx 40rpx;
  border-radius: 20rpx;
  box-shadow: 0 .25rem 1.25rem rgba(0,0,0,.08);

}

.btn-cont{
  padding: 0 80rpx;
  .btn{
    // height: 100rpx;
    border-radius: 20rpx;
    // font-size: 33rpx !important;
    font-weight: 600;
    color: #fff;
    background: linear-gradient(135deg, rgb(102, 126, 234) 0%, rgb(118, 75, 162) 100%);
  }
}

::v-deep .u-form-item__label {
  font-size: 30rpx !important;
  font-weight: 600 !important;
  color: #374151 !important;
  margin-bottom: 40rpx !important;
}

::v-deep .u-radio .u-radio__text, ::v-deep .u-form-item__body__left__content__label {
  font-size: 32rpx !important;
  color: #374151 !important;
}

</style>