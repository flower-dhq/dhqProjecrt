<style>
page{
  background:#f5f5f5;
}
</style>
<style lang="scss" scoped>
.img-cont{
  display: flex;
  padding: 40rpx 20rpx 0;
  .img-item{
    flex: 1;
    display: flex;
    justify-content: center;
    height: 174rpx;
    image{
      width: 336rpx;
      height: 174rpx;
    }
  }
}
.tip-cont{
  padding: 10rpx 40rpx 16rpx;
  color: #ccc;
  font-size: 28rpx;
}
.form-info-cont{
  padding: 0 30rpx;
  background-color: #fff;
  margin-bottom: 76rpx;
}
.form-item{
  display: flex;
  padding:26rpx 0;
  font-size: 28rpx;
  align-items: center;
  text{
    width: 160rpx;
  }
  .input-box{
    flex: 1;
    padding: 0 !important;
    border: none;
  }
  .addr-box{
    flex: 1;
    padding: 0 !important;
    height: 46rpx;
  }
  .icon-cont{
    width: 24rpx;
    height: 48rpx;
    display: flex;
    align-items: center;
    margin-left: 20rpx;
    .icon-r{
      width: 24rpx;
      height: 24rpx;
    }
  }
  .code-text{
    color: var(--app-primary-color);
    width: 23%;
  }
  .radio-cont{
    display: flex;
    .radio-item{
      padding: 5rpx 32rpx 5rpx 0;
      .circle{
        display: inline-block;
        width: 26rpx;
        height: 26rpx;
        border: 2rpx solid #aaa;
        border-radius: 100%;
        position: relative;
        top: 4rpx;
        margin-right: 10rpx;
      }
      image{
        width: 30rpx;
        height: 30rpx;
        position: relative;
        top: 4rpx;
        margin-right: 10rpx;
      }
    }
  }
  ::v-deep .u-input{
    padding: 0 !important;
    border: unset;
  }
}
.btn{
  width: 540rpx;
    height: 68rpx;
    line-height: 68rpx;
    border-radius: 34rpx;
    text-align: center;
    color: #fff;
    margin: auto;
    background-color: var(--app-primary-color);
}
</style>
<template>
  <view :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
    <view class="img-cont">
      <view class="img-item" @click.native="changeType1()">
        <image :src=" selectType ? peoplev : peoplevAct "></image>
      </view>
      <view class="img-item" @click.native="changeType2()">
        <image :src=" !selectType ? clothesv : clothesvAct "></image>
      </view>
    </view>
    <view class="tip-cont">
      <text v-if="!selectType">亲爱的业主，如果您的手机号已经在物业做过登记，您可以选择此方式进行信息认证。</text>
      <text v-if="selectType">亲爱的业主，如果您的手机号没有在物业做过登记，您可以选择此方式提交申请，物业服务中心审核通过后完成您的信息认证。</text>
    </view>
    <view class="form-info-cont">
      <view class="form-item">
        <text>关系</text>
        <view class="radio-cont">
          <view class="radio-item" v-for="item in relations" :key="item.key" @click="changeRelation(item)">
            <text v-if="!item.checked" class="circle"></text>
            <image v-else :src="relationIcon"></image>
            <text>{{item.value}}</text>
          </view>
        </view>
      </view>
      <view class="half-line"></view>
      <view class="form-item" @click="goSelectCity()">
        <text>城市</text>
        <u-input class="input-box" readonly clearable type="text" placeholder-style="color:#d7d7d7; font-size:28rpx" placeholder="请选择城市" v-model="cityName"/>
        <view class="icon-cont">
          <image class="icon-r" src="@/static/icon-img/icon_right.png"></image>
        </view>
      </view>
      <view class="half-line"></view>
      <view class="form-item" @click="showProject()">
        <text>项目</text>
        <u-input class="input-box" readonly clearable style="pointer-events: none;" type="text" placeholder-style="color:#d7d7d7; font-size:28rpx" placeholder="请选择项目" v-model="projectName"/>
      </view>
      <view class="half-line"></view>
      <view class="form-item">
        <text>房屋</text>
          <view class="addr-box" @click.native="selectDetailAddr()" > {{ addrDetail.addrstr ? addrDetail.addrstr : '' }}</view>
        <view class="icon-cont">
          <image class="icon-r" src="@/static/icon-img/icon_right.png"></image>
        </view>
      </view>
      <view class="half-line"></view>
      <view class="form-item">
        <text>真实姓名</text>
        <u-input class="input-box" clearable type="text" placeholder-style="color:#d7d7d7; font-size:28rpx" placeholder="请输入真实姓名" v-model="name"/>
      </view>
      <view class="half-line"></view>
      <view class="form-item">
        <text>手机号码</text>
        <u-input class="input-box" clearable type="text" placeholder-style="color:#d7d7d7; font-size:28rpx" placeholder="输入业主在物业登记的手机号" v-model="phone"/>
      </view>
      <view class="half-line" v-if="!selectType && smsEnableState=='1'"></view>
      <view class="form-item" v-if="!selectType && smsEnableState=='1'">
        <text>验证码</text>
        <u-input class="input-box" :maxlength="6" clearable type="text" placeholder-style="color:#d7d7d7; font-size:28rpx" placeholder="请输入验证码" v-model="code"/>
        <text class="code-text" @click="getCode()" :style="codeDisable?'pointer-events:none':'pointer-events:auto'">{{ codeName }}</text>
      </view>
    </view>
    <view class="btn" @click="submint">提交</view>
    <u-picker 
      :show="showProjectPic"
      :columns="projectList"
      keyName="projectName"
      @confirm="confirmProject"
      @cancel ="cancel"
    ></u-picker>
  </view>
</template>
<script>
import {mapGetters, mapMutations } from 'vuex'
import utils from '@/js/utils';
import { 
  getSmsCode, //获取验证码
  getProjectsByCity, //根据城市名称获取项目
  approvalAuthCommWithCode, //提交
  getCompanyConfig, //获取公司配置--是否需要短信校验
  getAuthMessageByAddrId
} from '../../service/community'
import commLogic from '@/js/comm-logic';
export default {
  data(){
    return{
      peoplev: require(`@/static/houseAuth/peoplev.png`) ,//'../../static/houseAuth/peoplev.png',
      clothesv: require(`@/static/houseAuth/clothesv.png`),//'../../static/houseAuth/clothesv.png',
      selectType: false,
      relations: [
        { value: "业主", key:2, checked: false },
        { value: "家人", key:3, checked: true },
        { value: "租户",key:1, checked: false }
      ],
      relationId:3, //关系
      relationName:'家人',
      name:'', //名字
      phone:'', //手机号码
      code:'', //验证码
      codeName:'获取验证码',
      timeNum:60,
      codeDisable:false,
      cityName:'', 
      projectType:'',
      memberId:'',
      companyId:'',
      showProjectPic:false,
      projectList:[],
      projectId:'',
      projectName:'',
      addrDetail:{

      },
      phoneNumber:'',
      smsEnableState:'1',
      ownerId:'',
      authType: '',
      pathCode: '',
      otherQuery: {}
    }
  },
  computed: {
    ...mapGetters('houseAuth', {
      getAuthInfo: 'getAuthInfo',
    }),
    peoplevAct() {
      // D:\project\通用\打包\ownerUI\src\static\theme-default\houseAuth\peoplev.png
       return  `${this.IMG_BASE_URL}/static/${this.THEME_NAME}/houseAuth/peoplev.png` ;// `${this.IMG_BASE_URL}/../../static/${this.THEME_NAME}/houseAuth/peoplev.png`;
    },
    clothesvAct() {
      return `${this.IMG_BASE_URL}/static/${this.THEME_NAME}/houseAuth/clothesv.png` ;//  `${this.IMG_BASE_URL}/../../static/${this.THEME_NAME}/houseAuth/clothesv.png`;
    },
    relationIcon() {
      return `${this.IMG_BASE_URL}/static/${this.THEME_NAME}/houseAuth/selected.png` ;//  `${this.IMG_BASE_URL}/../../static/${this.THEME_NAME}/houseAuth/selected.png`;
    },
  },

  onShow() {
    uni.setNavigationBarTitle({
							title:'新增房屋'
						})

    this.getMemberInfo()
    this.getCompanySet()

    let data = this.getAuthInfo
    if(data.pageFrom == 'selectCity'){
      //选择城市页面回来
      this.getCache()
      this.projectId = '';
      this.projectName = '';
      this.addrDetail = {}
    }else if(data.pageFrom == 'selectAddr'){
      this.getCache()
    }
  },

  onLoad(options) {
    // '/pages-a/authorization/auth-certify' 跳转到 'pages-a/authorization/bindingMobile' 再跳转到 '/pages-b/house-info/add-house-address'
    const { ownerId, addrId, authType, pathCode = '', ...tempOther } = options || {}
    this.ownerId = ownerId || ''
    if (addrId) {
      this.getAddrInfo(options.addrId)
    }
    this.authType = authType
    this.pathCode = pathCode || ''
    this.otherQuery = tempOther

    uni.setNavigationBarTitle({
							title:'新增房屋'
						})
    //授权处理
    const { O_USER_INFO } = this.$constant;
		const { phoneNumber } = utils.storageAction({ key: O_USER_INFO, action: 'get' });
		if(!phoneNumber){
				  uni.navigateTo({ url: '/pages-a/authorization/bindingMobile'});
					return
		}
    
    this.getMemberInfo()
    this.getCompanySet()
    let routes = getCurrentPages(); // 获取当前打开过的页面路由数组
    if (routes.length < 2) return
    let prePages = routes[routes.length - 2]; //获取路由参数 
    let prePage = prePages.route
    if( prePage = '/pages-b/house-info/house-auth-list'){
      this.selectType = false
      this.relationId = 3
      this.relationName = '家人'
      this.clearAuthInfo()
    }
  },

  methods:{
    ...mapMutations('houseAuth', [
      'saveAuthInfo',
      'clearAuthInfo'
    ]),

    //获取公司配置，是否要验证码校验
    getCompanySet(){
      let parmas = {
        data:{
          companyId: this.companyId
        }
      }
      getCompanyConfig(parmas).then(res =>{
        if(res.status=='200'){
          this.smsEnableState = res.data.smsEnableState;
        }
      })
    },

    //提交
    submint(){
      let self = this
      if(this.cityName==''){
        this.showToast('请选择城市')
        return
      }
      if(this.projectId==''){
        this.showToast('请选择项目')
        return
      }
      if(this.addrDetail.houseId==''){
        this.showToast('请选择房屋地址')
        return
      }
      if(this.name==''){
        this.showToast('请填写真实姓名')
        return
      }
      if(this.phone==''){
        this.showToast('请填写手机号码')
        return
      }
      if(!utils.checkPhone(this.phone)){
        this.showToast('请填写正确的手机号码')
        return
      }
      if(this.smsEnableState=='1' && this.code=='' && !this.selectType){
        this.showToast('请输入验证码')
        return
      }
      const { PROGRAM_TYPE } = this.$appConfig;
      // 2:公众号  3：app 7：微信小程序
      const source = PROGRAM_TYPE == 'wechat' ? 2 : PROGRAM_TYPE == 'appH5' ? 3 : 7
      let params = {
        data:{
          houseId: self.addrDetail.houseId, //房间id
          memberId: self.memberId,
          phone: self.phone, //
          code: self.smsEnableState=='1'?self.code:'', //业主手机验证码
          type: this.selectType ? 3 : 2, //认证类型:2-我是住户;3-向物业申请
          identity: self.relationId, //身份:3-家人;1-租户
          name: self.name, //申请人姓名
          source,
          projectId:self.projectId,
          project:self.projectName, //项目名称
          building:self.addrDetail.addrstr //房间具体路址
        }
      }
      if(this.ownerId){
        params.data.ownerId=this.ownerId
      }
      console.log('params',params)
      approvalAuthCommWithCode(params).then(res =>{
        if(res.status=='200'){
          this.showToast('提交成功！')
          setTimeout(e=>{
            if (this.authType && this.authType !== 'none' && !this.pathCode) {
              // 只跳转到当前的房屋认证页面，提交成功后回到首页
              const query = uni.$u.queryParams(otherQuery)
              uni.switchTab({ url: '/pages/index/index' + query })
            } else if (this.authType && this.pathCode) {
              // 跳转到当前的房屋认证页面，提交成功后回到指定页面
              const query = uni.$u.queryParams(Object.assign(
                {
                  authType: 'none',
                  pathCode: this.pathCode || ''
                },
                this.otherQuery
              ))
              uni.reLaunch({ url: '/pages-a/authorization/auth-certify' + query })
            } else {
              uni.navigateBack()
            }
          },800)
        }else{
          this.showToast(res.message)
        }
      })
    },

    cancel(){
      this.showProjectPic = false
    },
    confirmProject(item){
      this.showProjectPic = false
      this.projectId = item.value[0].projectId
      this.projectName = item.value[0].projectName
      console.log(item)
    },

    showProject(){
      this.showProjectPic = true;
      this.getProjectList()
    },

    // 选择城市
    goSelectCity(){
      this.setCache()
      uni.navigateTo({
        url: '/pages-b/house-info/city-index-list'
      });
    },

    //选择项目
    getProjectList(){
      if(this.cityName =='') return
      let params = {
        data:{
          cityName:this.cityName,
          projectType:this.projectType
        }
      }
      getProjectsByCity(params).then(res =>{
        if(res.status == '200'){
          this.projectList = []
          if(res.data.length>0){
            this.projectList.push(res.data)
            
            console.log(this.projectList)
          }
        }
      })
    },

    //选择房屋
    selectDetailAddr(){
      console.log(393)
      if(this.cityName==''){
        this.showToast('请选择城市')
        return
      }
      if(this.projectId==''){
        this.showToast('请选择项目')
        return
      }
      this.setCache()
      uni.navigateTo({
        url: `/pages-b/house-info/choose-houses?type=0&projectId=${this.projectId}`
      });
    },

    //获取验证码
    getCode() {
      var self = this;
      if (!self.phone) {
        self.showToast('请输入手机号码')
        return false;
      }
      if (self.phone.length != 11) {
        self.showToast('请输入正确的手机号码')
        return false;
      }
      var jsonData = {
        data:{
          mobiles: self.phone,
          model: 2, //1.登录  2.验证码
          projectType: this.projectType
        }
      };
      self.countdown();
      getSmsCode(jsonData).then(result => {
        if (result.status == "200") {
          self.showToast('短信验证码发送成功')
        } else {
          self.codeDisable = false;
          self.codeName = "重新获取";
          clearInterval(self.timer);
          self.showToast('短信验证码发送失败')
        }
      }).catch(error => {
        self.codeDisable = false;
        self.codeName = "重新获取";
      });
    },

    //倒计时
    countdown() {
      var self = this;
      if (!self.codeDisable) {
        self.codeDisable = true;
        var time = self.timeNum;
        self.codeName = time + "s";
        self.timer = setInterval(() => {
          if (time > 0) {
            time--;
            self.codeName = time + "s";
          } else {
            time = self.timeNum;
            self.codeDisable = false;
            self.codeName = "重新获取";
            clearInterval(self.timer); //停止循环
          }
        }, 1000);
      }
    },
    
    //选择关系
    changeRelation(item){
      this.relationId = item.key;
      this.relationName = item.value;
      this.relations.filter(e =>{
        e.checked = false
      })
      item.checked = true
    },

    //顶部切换认证类型
    changeType1() {
      let self = this
      if (self.selectType == true ) {
        self.selectType = false;
        self.phone = "";
        }
      // } else {
      //   self.selectType = true;
      //   self.phone = self.phoneNumber;
      // }
    },
    changeType2() {
      let self = this
      if (self.selectType == false ) {
        self.selectType = true;
        self.phone = self.phoneNumber;
      }
    },

    // 提示
    showToast (tips) {
      uni.showToast({ title: tips, icon: 'none' });
    },

    //设置缓存
    setCache(){
      const data={
        selectType:this.selectType,
        relationId: this.relationId,
        relationName: this.relationName,
        name: this.name,
        phone:this.phone,
        code:this.code,
        cityName:this.cityName,
        projectId:this.projectId,
        projectName:this.projectName,
        addrDetail:this.addrDetail, //具体地址信息
        pageFrom:'',
      }
      this.saveAuthInfo(JSON.parse(JSON.stringify(data)));
    },

    // 获取缓存
    getCache(){
      const { selectType, relationId, relationName, name, phone, code, cityName, projectId, projectName, addrDetail={} } = this.getAuthInfo
      this.selectType = selectType
      this.relationId = relationId
      this.relationName = relationName
      this.name = name
      this.phone = phone
      this.code = code
      this.cityName = cityName
      this.projectId = projectId
      this.projectName = projectName
      this.addrDetail = addrDetail
    },

    //获取缓存信息
    getMemberInfo(){
      const { O_USER_INFO, URL_PROJECT_TYPE } = this.$constant;
      const { companyId, id, phoneNumber } = utils.storageAction({ key: O_USER_INFO, action: 'get' });
      console.log('用户信息',utils.storageAction({ key: O_USER_INFO, action: 'get' }))
      this.projectType = utils.storageAction({ key: URL_PROJECT_TYPE, action: 'get' });
      this.companyId = companyId;
      this.memberId = id;
      this.phoneNumber = phoneNumber
      const { projectType } = commLogic.getProjectConfig();
      this.projectType = projectType
    },
    // 根据房产id获取房产数据
    async getAddrInfo(addrId) {
      const res = await getAuthMessageByAddrId(addrId)
      const data = res.data || {}

      this.projectId = data.projectId
      this.projectName = data.projectName
      this.addrDetail = {
        houseId: data.addrId,
        addrstr: data.address
      }
      this.cityName = data.cityName
    }
  }
}
</script>