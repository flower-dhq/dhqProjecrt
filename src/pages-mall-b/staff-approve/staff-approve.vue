<template>
  <view class="mod">
    <view class="tips" v-if="currentOaAccount">
      <cl-icon name="cl-icon-warning-border" color="#FFFFFF"></cl-icon>
      <p>您已经认证了OA账号：{{currentOaAccount}}，如果信息无误，不需要重复认证</p>
    </view>

    <view class="mod-box">
      <view class="mod-item">
        <span>
          分公司
          <i>*</i>
        </span>
        <view>
          <cl-select v-model="selectCompanyId" :options="companyList" label-key="companyName" value-key="companyId" @confirm="handleCompany"></cl-select>
        </view>
      </view>

      <view class="mod-item">
        <span>
          项目
          <i>*</i>
        </span>
        <view>
          <cl-select v-model="selectProjectId" :options="projectList" label-key="projectName" value-key="id" @confirm="handleProject"></cl-select>
        </view>
      </view>

      <view class="mod-item">
        <span>
          岗位
        </span>
        <view>
          <!-- <cl-select v-model="selectJobId" :options="jobList" label-key="jobName" value-key="jobId" @confirm="handleJob"></cl-select> -->
          <input type="text" placeholder="请填写" @input="evt => onInput({evt, key: 'authArchName'})"/>
        </view>
       
      </view>

      <view class="mod-item">
        <span>
          姓名
          <i>*</i>
        </span>
        <input type="text" placeholder="请填写" @input="evt => onInput({evt, key: 'authName'})"/>
      </view>
      <!-- <view class="mod-item">
        <span>
          手机号
          <i>*</i>
        </span>
        <input type="text" placeholder="请填写" @input="evt => onInput({evt, key: 'authOaAccount'})"/>
      </view> -->
      <view class="mod-item">
        <span>
          OA账号
          <i>*</i>
        </span>
        <input type="text" placeholder="请填写" @input="evt => onInput({evt, key: 'authOaAccount'})"/>
      </view>
      <!-- <view class="mod-remark">
        <span>备注信息</span>
        <textarea cols="5" rows="4" placeholder="请填写" @input="evt => onInput({evt, key: 'authArchName'})"></textarea>
      </view> -->
    </view>

    <view class="btn-group">
      <view class="submit" @tap="submit">提交</view>
    </view>

    <cl-confirm ref="confirm"> </cl-confirm>
  </view>
</template>

<script>
export default {
  data(){
    return {
      companyList:[],
      projectList:[],
      jobList:[],
      selectCompanyId: '',
      selectProjectId: '',
      selectJobId: '',
      authFormData:{},
      currentOaAccount: "" // 当前OA账号

    }
  },
  methods:{
    onInput(params = {}) {
      const {evt, key} = params;
      const value = evt.detail.value;
      this.authFormData[key] = value;
    },
    // 获取公司列表
    async getCompanyList(){
      const data = {}
      const { data:res }= await this.$mallApi.data.getCompany({data})
      this.companyList = res
    },
    // 获取项目列表
    async getProjectList(companyId){
      const { data:res } = await this.$mallApi.data.getProject(companyId)
      this.projectList = []
      res.forEach((item,i) => {
        this.projectList.push({
          id: i+1,
          projectName:item.projectName,
        })
      })
      
    },
    // 获取岗位列表
    async getJobList(archId){
      const { data:res } = await this.$mallApi.data.getJobArchList(archId)
      this.jobList = res
    },
    handleCompany(item){
      this.getProjectList(item.companyId)
      this.authFormData.authCompany = item.companyName

    },
    handleProject(item){
      // this.getJobList(item.archId)
      this.authFormData.authProject = item.projectName

    },
    handleJob(item){
      this.authFormData.authArchId = item.jobId
      this.authFormData.authArchName = item.jobName

    },
    // 提交员工认证
    async postStaffAuth(){
      const data = {
        // "authArchId": 0,            // 认证岗位id
        // "authArchName": "string",   // 认证岗位名称
        // "authCompany": "string",    // 认证公司
        // "authName": "string",       // 认证姓名
        // "authOaAccount": "string",  // 认证OA账号
        // "authProject": "string",    // 认证项目
        ...this.authFormData
      }

      const res =  await this.$mallApi.data.staffAuth({data})
      if(res.statusCode == 200) uni.navigateBack({delta: 1})

    },
    submit(){
      if(this.currentOaAccount){
        this.$refs["confirm"].open({
					title: "温馨提示",
					message: `你已经绑定OA账号:${this.currentOaAccount},请问是否覆盖?`,
					callback: ({ action }) => {
						if(action == "confirm"){
              this.postStaffAuth()
            }
					}
				});
      } else {
        this.postStaffAuth()
      }
    },
  },
  onLoad(){
    this.getCompanyList()

    // 拿缓存中的OA账号
    const {USER_INFO} = this.$constant;
    const userInfo = this.$cmMth.storageAction({key: USER_INFO, action: 'get'});
    this.currentOaAccount = userInfo.staffOaAccount

  },
}
</script>

<style lang="scss" scoped>
.cl-select::v-deep .cl-select__inner .cl-select__icon{
  right: -50rpx;
}

.mod {
  width: 100%;
  height: 100%;
  background: #f2f2f2;
  padding-top: 10rpx;
  box-sizing: border-box;

  .tips{
    display: flex;
    align-items: center;
    padding: 15rpx 20rpx;
    background-color: $uni-color-primary;

    p {
      font-size: 24rpx;
      color: #ffffff;
      margin-left: 20rpx;
      line-height: 1.3;
    }
  }

  .mod-box {
    padding: 0 30rpx;
    background-color: #ffffff;

    .mod-item {
      width: 100%;
      height: 100rpx;
      border-bottom: 1px #f6f6f6 solid;
      display: flex;
      justify-content: space-between;
      align-items: center;

      span {
        font-size: 28rpx;
        color: #333333;

        i {
          display: inline-block;
          color: red;
          font-size: 24rpx;
        }
      }

      input {
        font-size: 28rpx;
        color: #333333;
        text-align: right;

        input::-webkit-input-placeholder {
          /* WebKit browsers */
          color: #999999;
          font-size: 24rpx;
        }

        input:-moz-placeholder {
          /* Mozilla Firefox 4 to 18 */
          color: #999999;
          font-size: 24rpx;
        }

        input::-moz-placeholder {
          /* Mozilla Firefox 19+ */
          color: #999999;
          font-size: 24rpx;
        }

        input::-ms-input-placeholder {
          /* Internet Explorer 10+ */
          color: #999999;
          font-size: 24rpx;
        }
      }
    }

    .mod-remark {
      width: 100%;
      height: 200rpx;
      border-bottom: 1px #f6f6f6 solid;
      display: flex;
      justify-content: space-between;
      padding-top: 40rpx;

      span {
        font-size: 28rpx;
        color: #333333;
      }

      textarea {
        font-size: 28rpx;
        color: #333333;
        text-align: right;
        height: 100%;
        width: 450rpx;
      }
    }
  }

  .btn-group {
    width: 100%;
    height: 80rpx;
    font-size: 28rpx;
    line-height: 80rpx;
    text-align: center;
    display: flex;
    position: fixed;
    bottom: 0;

    .submit {
      width: 100%;
      height: 100%;
      background-color: $uni-color-primary;
      color: #ffffff;
    }
  }
}
</style>