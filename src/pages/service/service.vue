<style lang="scss" scoped>
.body {
  padding-bottom: calc(var(--window-bottom) + 100rpx);
  background-color: white ;
  display: flex;
    flex-direction: column;
    justify-content: start;
}
.content {
  flex: 1;
    padding: 32rpx 44rpx 100rpx 44rpx;
    background-color: #FFFFFF;
    margin-bottom: 16rpx;
    
}
.switop {
    // width: 688rpx;
    height: 338rpx;
    background-color: #F5F5F5;
}
.steward-info {
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-content: center;
    // margin-bottom: 44rpx;
    padding:50rpx  36rpx 0  36rpx;
    box-sizing: border-box;
    .steward-info-image ::v-deep image{
      width: 240rpx;
      height: 240rpx;
      overflow: hidden;
      border-radius: 120rpx;
      border: 1px solid #e4e4e4;
      box-sizing: border-box;
    }
     .stwedInfo {
        flex:1;
        margin-left:52rpx;
     }
    .sttitle {
        display: flex;
        -webkit-box-orient: horizontal;
        -webkit-box-direction: normal;
        -ms-flex-direction: row;
        flex-direction: row;
        -webkit-box-pack: justify;
        -ms-flex-pack: justify;
        justify-content: space-between;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
    }
    .sttitle span {
        font-size: 36rpx;
        font-family: PingFang SC;
        font-weight: bold;
        color: #333333;
    }
    .sttitle  ::v-deep image {
     width: 80rpx;
     height: 80rpx;
     margin-left: 120rpx;
     }
     .secondPen ::v-deep image{
        width: 30rpx;
        height: 30rpx;
        margin-right: 20rpx;
     }
     .star-item ::v-deep image{
        width: 30rpx;
        height: 30rpx;
     }
     .secondPen {
        margin: 20rpx 0;
        width: 100%;
        display: flex;
    align-items: center;

     }
     .thirdPen {
        display: flex;
        width: 100%;
        align-items: flex-start;
     }
     .thirdPen ::v-deep image{
       width: 32rpx;
        height: 32rpx;
        margin-right: 20rpx;
     }
   
  }
  .articStyle {
    font-size: 26rpx;
    font-family: PingFang SC;
    font-weight: 400;
    color: #444444;
    word-wrap: word-break;
    word-break: break-all;
    text-overflow: -o-ellipsis-lastline;
	  overflow: hidden;				//溢出内容隐藏
	  text-overflow: ellipsis;		//文本溢出部分用省略号表示
	  display: -webkit-box;			//特别显示模式
	  -webkit-line-clamp: 2;			//行数
	  line-clamp: 2;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    flex:1
  }
.box {
    .box-title {
        font-size: 32rpx;
        font-weight: bold;
        color: #333333;
    }
    .menu-box {
        padding: 40rpx 0;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        gap: 40rpx 20rpx;
        .menu-grid {
            display: grid;
            align-items: center;
            justify-content: center;
            text-align: center;
        }
        .menu-icon {
            height: 60rpx;
            width: 60rpx;
            background-repeat: no-repeat;
            background-size: 60rpx;
            margin: auto;
        }
        .menu-title {
            font-size: 26rpx;
            color: #333333;
            margin-top: 10rpx;
        }
    }
}
</style>

<template>
    <view  class="[THEME_NAME] body" :style="[THEME_CSS_VAR]">
        <view class="switop" v-if="housekeeperShow">
            <swiper  
            class="banner stwedbanner" 
            :indicator-dots="stewardListCode"
            dots-position="right"
            indicator-color="#ffffff"
            indicator-active-color="var(--app-primary-color)"
            :current = 0
            style="height:340rpx">
      <swiper-item v-for="(data,index) in stewardList" :key="index">
        <view class="steward-info"
             @click="goToEvaluate(data,index)"
             v-if="true">
          <view class="steward-info-image">
            <image mode="aspectFill"  :src="data.stewardHeadUrl == '' || data.stewardHeadUrl == undefined || data.stewardHeadUrl == null? defaultImage:data.stewardHeadUrl"
                 alt />
          </view>
          <view class="stwedInfo">
            <view class="sttitle">
              <span>{{data.nickname}}</span>
              <image src="@/static/components/tel.png"  @click.stop="dialStewardTel(data)" />
            </view>
            <view class=" goEvaluationBox">
              <view class="secondPen">
                <image src="@/static/components/pen.png" alt /> 
                <view class="star-wrapper" v-show="data.starScore">
			               <uni-rate :max="5" :value="data.starScore ? data.starScore : '0' " active-color="var(--app-primary-color)" color="#cccccc" :readonly="true" size="18"/>
                </view>
                    <p style="color: #444; font-size: 26rpx; margin-left: 20rpx;" v-show="data.starScore">{{data.starScore}}分</p>
              </view>
              <view class="thirdPen">
                <image src="@/static/components/heart_icon.png" alt />
                <p v-if="data.stewardRecord" v-html="data.stewardRecord" class="articStyle"></p>
                <p v-if="!data.stewardRecord" class="articStyle">以全心全意的卓越服务，带给用户发自内心的预愉悦。</p>
              </view>
            </view>
          </view>
        </view>
      </swiper-item>
            </swiper>
        </view>
       <view class="content"  :style="[THEME_CSS_VAR]">
        <view class="box" v-for="(listItem,listindex) in list" :key="listindex">
            <template v-if="menuList[listItem.id]">
                <view class="box-title">{{listItem.name}}</view>
                <view class="menu-box">
                    <view class="menu-grid" v-for="(item, index) in menuList[listItem.id]" :key="index" @click="menuJump(item)">
                        <image class="menu-icon" :src="item.icon.indexOf('http') > -1 ? item.icon : require(`@/static/${[THEME_NAME]}/menu/${item.icon}.png`)"></image>
                        <view class="menu-title">{{item.configName}}</view>
                    </view>
                </view>
            </template>
        </view>
       </view>

        <u-toast ref="uToast"></u-toast>
        <uniPop ref="rzModal"></uniPop>
        <middle-box :current-page="1" ref="child"></middle-box>
        <custom-modal ref="customModal"></custom-modal>
       
    </view>
</template>

<script>
import util from '../../js/utils';
import { menu } from '../../js/menu'
import { getAppByCode ,findLocations, saveStewardContactRecord,getCompanyConfig} from '../../service/community';
import {findStewardByBuilding,getStewardEvaluate } from '../../service/wxmanage'
import { mapMutations } from 'vuex'
import { savePageTitle } from '@/js/router/router-utils'
import tabBarFun from '../../js/utils/tabBarCommon'
import MiddleBox from '@/components/middle/middle-box.vue';

export default {
    components: {
      'middle-box':MiddleBox, 
      },
    data() {
        return {
            housekeeperShow:false,
            memberId: '',
            areaId: '',
            projectId: '',
            menuList: [],
            phoneNumber:'',
            projectType:'',
            companyId:'',
            list: [{
                name: '物业服务',
                id: "1"
            }, {
                name: '生活服务',
                id: "2"
            }, {
                name: '增值服务',
                id: "3"
            }, {
                name: '我的房子',
                id: "4"
            }, {
              name: '社区服务',
              id: '5'
            }],
            defaultMenu: [{}],
            stewardList: [],
            stewardListCode:false,
            ownerInfo: {},
            userTypes:'',
            showFWQY:Number

        };
    }, 
    onShow() {
         const { MEMBER_ID, AREA_ID, PROJECT_ID,O_USER_INFO,USER_TYPE,PROJECT_TYPE,COMPLANY_ID } = this.$constant;
         const { phoneNumber,companyId,projectType } = util.storageAction({ key: O_USER_INFO, action: 'get' });
        this.memberId = util.storageAction({ key: MEMBER_ID, action: 'get' });
        this.areaId = util.storageAction({ key: AREA_ID, action: 'get' });
        this.projectId = util.storageAction({ key: PROJECT_ID, action: 'get' });
        this.phoneNumber = phoneNumber
        this.projectType = projectType;;
        this.companyId = companyId;
        this.userTypes = util.storageAction({ key: USER_TYPE, action: 'get' })
        this.init();
        // 保存跳转商城tabbar前的页面
        this.catchTabbarPagePath('/pages/service/service')
        tabBarFun.setIdentity() //获取用户角色
        tabBarFun.isJoinEnterprise() //获取用户认证状态
        this.initData()
        this.showCompanyConfig();
    },
    onLoad() {

    },
    methods: {
        async initData(){
            await  this.getOwnerInfo()
            await  this.getStewardInfo()
            await  this.getStewardEvaluate()

        },
        ...mapMutations({
            catchTabbarPagePath: 'catchTabbarPagePath'
        }),

        // 跳转第三方小程序方法
        jumpMini(item){
            // #ifdef MP-WEIXIN
            uni.navigateToMiniProgram({
                appId:item.appId,// 第三方小程序appid
                path:item.url,// 
                envVersion:"release",
                success: res => {
                    // 打开成功
                    console.log("打开成功", res);
                },
                fail: err => {
                    console.log(err);
                }
            })
            // #endif

            // #ifdef APP-PLUS
            plus.share.getServices((res) => {
            let weixin = res.find(i => i.id === 'weixin');
                if (weixin) {
                    weixin.launchMiniProgram({
                        id: item.originalId,
                        path: item.url,
                        type: 0
                    }, (res) => {

                    }, (err) => {

                    });
                }
            }, (err) => {
                console.log("获取分享服务列表失败： " + JSON.stringify(e));
            });
            // #endif
        },

        menuJump(item) {
          console.log('menuJump',item)
            const { USER_TYPE, IS_ASSOCIATION } = this.$constant;
            const {PROGRAM_TYPE} = this.$appConfig;
 
            const userType = util.storageAction({ key: USER_TYPE, action: 'get' });
            let isAssociation = util.storageAction({ key: IS_ASSOCIATION, action: 'get' });

            if(!this.phoneNumber && item.auth=='1'){
              if(PROGRAM_TYPE == 'wechat' || PROGRAM_TYPE =='appH5'){
                uni.navigateTo({ url:'/pages-a/authorization/bindingMobile' });
                return
              }else{
                uni.navigateTo({ url:'/pages-a/authorization/bindingMobile' });
                return
              }
               
            }

            //跳转第三方小程序
            if(item.appId){
                this.jumpMini(item)
                return
            }

            if (isAssociation=='0' && item.registered) {
                // this.$refs.customModal.show({
                //     title: '提示',
                //     content: '您还未认证，请先去认证',
                //     showConfirmButton: true,
                //     showCancelButton: true,
                //     confirmText: "去认证",
                //     cancelText: '取消',
                //     onConfirm: () => {
                //         uni.navigateTo({url:'/pages-b/house-info/add-house-address'})
                //     }
                // })
                switch(this.showFWQY){
                    case 0:
                     this.$refs.rzModal.showModal({ modalType: 'rz' });
                     this.$refs.rzModal.showCompanyConfig();
                       break;
                    case 1:
                    this.$refs.customModal.show({
                          title: '提示',
                          content: '您还未认证，请先去认证',
                          showConfirmButton: true,
                          showCancelButton: true,
                           confirmText: "去认证",
                           cancelText: '取消',
                           onConfirm: () => {
                               uni.navigateTo({url:'/pages-b/house-info/add-house-address'})
                        }
                     })
                        break;
                    case 2:
                    this.$refs.customModal.show({
                          title: '提示',
                          content: '您还未认证，请先去认证',
                          showConfirmButton: true,
                          showCancelButton: true,
                           confirmText: "去认证",
                           cancelText: '取消',
                           onConfirm: () => {
                               uni.navigateTo({url:'/pages-d/enterprise-info/join-company'})
                        }
                     })
                        break;
                    default:
                        break;
                }
                return;
            }
            // if (!phoneNumber) {
            //     this.$refs.rzModal.showModal({ content: '您还未绑定手机号，请绑定手机号码！', path: '/pages-a/authorization/login' });
            //     return;
            // }
            // if (userType == '游客') {
            //     this.$refs.rzModal.showModal({ modalType: 'rz' });
            //     return;
            // }
            if (!item.page && !item.url) {
                this.$refs.customModal.show({
                    title: '提示',
                    content: '此功能暂未开放，敬请期待~',
                    showConfirmButton: true,
                    confirmText: "好的",
                })
                return;
            }

            if (item.isTabbar) {
                uni.switchTab({ url: item.page })
            } else {
                if (item.url) {
                    uni.navigateTo({
                        url: `/pages-d/webview/webview?url=${encodeURIComponent(item.url)}&code=${item.detailCode}`
                    })
                } else {
                    item.configName && savePageTitle({ title: item.configName })
                    uni.navigateTo({ url: item.page });
                }
            }
        },
        init() {
            this.getMenuConfig();
        },
        //动态增加分组
        dynamicallyAddinGroups(arr){
          this.list = [{
                name: '物业服务',
                id: "1"
            }, {
                name: '生活服务',
                id: "2"
            }, {
                name: '增值服务',
                id: "3"
            }, {
                name: '我的房子',
                id: "4"
            }]
          // 获取所有第三方分组名称
          let allName = []
          arr.map(item=>{
            if(item.detailCode.indexOf('tionalFea') > -1){
              allName.push(item.groupName)
            }
          })
          allName = [...new Set(allName)]
          allName.map((item,index)=>{
            if(!this.isHasThatCon(item)){
                this.list.push({name:item,id:(index+5)+''})
            }
          })
          console.log(this.list,'list========')
        },
        //判断是否已存在
        isHasThatCon(title){
            let flag = false
            this.list.map(item=>{
                if(item.name == title){
                    flag = true
                }
            })
            return  flag
        },
        //动态给新数组排序,按新的分组
        dynamicallyAddSort(list){
          list.map(item=>{
            this.list.map(tab=>{
              if(item.groupName == tab.name){
                item.service = tab.id
              }
            })
          })
          console.log(list,'list============')
          return list
        },
        //
        getMenuConfig() {
            let that = this;
            var params = {
                data: {
                    configCode: "paymentAuthModules",
                    projectId: that.projectId,
                    memberId: that.memberId
                },
                "hideLoading": true
            }
            getAppByCode(params).then(res => {
                if (res.statusCode == 200) {
                    let configDesc = res.data.configDesc;
                    var defaultMenu = [
                        { "detailCode": "announcement" },
                        { "detailCode": "activity" },
                        { "detailCode": "handlingGuideline" },
                        { "detailCode": "travelGuide" },
                        { "detailCode": "propertyPublicity" },
                        { "detailCode": "paymentCenterNew" }];
                    if (!configDesc || configDesc.length == 0) {
                        configDesc = defaultMenu;
                    }
                    this.dynamicallyAddinGroups(configDesc)
                    configDesc = this.dynamicallyAddSort(configDesc)
                    let showMenu = util.intersection(configDesc, menu, 'detailCode',true,'paymentAuthModules');
                    console.log(showMenu,'showMenu=================')
                    let setMenu = [];
                    configDesc.forEach(item => {
                        setMenu[item.detailCode] = item.configName;
                    })
                    showMenu.forEach(item => {
                        item.configName = setMenu[item.detailCode] ? setMenu[item.detailCode] : item.configName;
                    })
                    var responseObj = that.arrayGroupBy(showMenu, 'service');
                    const responMenu = JSON.parse(JSON.stringify(responseObj));
                    that.menuList = responMenu;
                    console.log('that.menuList====showMenu',that.menuList)
                }
            })
        },
        arrayGroupBy(list, groupId) {
            let groups = {};
            list.forEach(item => {
                let group = item[groupId];
                groups[group] = groups[group] || [];
                groups[group].push(item)
            })
            console.log('00000000000000000showMenu',JSON.stringify(this.menuList))
            return groups;
        },

        // 获取业主信息
   async getOwnerInfo () {
      // this.$vux.loading.show();
      let params = {
        data:{
          memberId:this.memberId,
          companyId:this.companyId,
          projectType:this.projectType,
          authType:1 //已认证房产
        },
        pathParams:'/0',
        responseToast:false,
        hideLoading: true
      }
      const pms =  findLocations(params);
      return pms
        .then(res => {
          if (res.status === "200") {
            const list =
              (res.data &&
                Array.isArray(res.data.authBuildings) && res.data.authBuildings) ||[];
            let isAuthTypeBuilding = []
            if (list.length > 0) {
               list.forEach(item => {
                if (item.authType === 1) {
                  isAuthTypeBuilding.push(item)
                 }
              })
            }
            const { PROJECT_ID } = this.$constant;
            let projectIds = util.storageAction({ key: PROJECT_ID, action: 'get' }) || ''
            console.log(468,projectIds)
            for (let i = 0; i < isAuthTypeBuilding.length; i++) {
            console.log(isAuthTypeBuilding[i].isDefault)
              if (isAuthTypeBuilding[i].isDefault == 1 || projectIds == isAuthTypeBuilding[i].projectId) {
                this.ownerInfo = isAuthTypeBuilding[i];
                return
              } else{
                  this.ownerInfo = isAuthTypeBuilding[0]; 
              }
            }
            console.log(this.ownerInfo, 'this.ownerInfo')
          }
        })
        .catch(_ => {
        });
    
    },
         // 获取管家信息
         async  getStewardInfo () {
              let that = this;
              that.stewardList = [];
              that.stewardListCode = false;
              const { buildingId, projectId, roomId } = this.ownerInfo;
              const params ={
                    data:{
                        projectId: projectId, 
                        memberId: this.memberId,
                       buildingId: buildingId ? buildingId : "",
                       roomId: roomId ? roomId : ''
                    },
                    responseToast:false,
                    hideLoading: true
                  };
              const pms = findStewardByBuilding(params);
              return pms
                .then(res => {
                  if (res.status === "200") {
                console.log(345,res)
                    if (res.data.length > 0) {
                      if (this.userTypes !== '游客') {
                        // this.housekeeperShow = true;
                      }
              res.data.forEach(item => {
                 item.stewardLabels = [];
                if (item.stewardLabel&& item.stewardLabel.endsWith(',')) {
                  item.stewardLabel = item.stewardLabel.substr(0, item.stewardLabel.length - 1);
                  item.stewardLabel.split(',').forEach(value => {
                    item.stewardLabels.push(value);
                  })
                }
                 that.stewardList.push(item);
                if(that.stewardList.length > 0 && this.userTypes !== '游客'){
                  this.housekeeperShow = true;
                }
               })
            } else {
            }
          } else {
          }
          if(this.stewardList.length > 1){
            this.stewardListCode = true
          }
         
          console.log("this.stewardList==" + this.stewardList)
          console.log(this.stewardList.length)
        })
        .catch(_ => {
        });
    },
    // 获取管家评价
    async getStewardEvaluate () {
      // const stewardId = this.ownerInfo.id || this.stewardList[0].id;
      const ownerId = this.ownerInfo.ownerId;
      const params = {
        data:{
            ownerId
        },
        responseToast:false,
        hideLoading: true
      };
      const pms = getStewardEvaluate(params);
      return pms
        .then(res => {
          if (res.status == "200") {
            let temp = res.data;
            for (let i = 0; i < this.stewardList.length; i++) {
              for (let j = 0; j < temp.length; j++) {
                if (this.stewardList[i].id == temp[j].stewardId) {
                  this.stewardList[i].starScore = temp[j].star
                  this.stewardList[i].msg = temp[j].msg
                }
              }
            }
            console.log(547,this.stewardList)
            this.$forceUpdate()
          }
        })
        .catch(_ => {
          // this.$vux.loading.hide();
        });
    },
    goToEvaluate (item, index) {
      console.log(529,item,index)
        this.toStewardPage(index);
    },
     // 去评价页面
     toStewardPage (index) {
      console.log(549,index,this.ownerInfo,this.stewardList[index])
          const { ownerId, buildingId, ownerName, addrId } = this.ownerInfo;
               const { stewardName, nickname, stewardHeadUrl,stewardRecord, msg, id } = this.stewardList[index];
               const info = {
                 ownerId,
                 buildingId,
                 ownerName,
                 addrId,
                 stewardName,
                 stewardHeadUrl,
                 stewardRecord,
                 msg,
                 id,
                 nickname
               };
             console.log(548,info)
      uni.navigateTo({url: '/pages-b/house-keeper/houserkeeperEvaluation?option='+ encodeURIComponent(JSON.stringify(info))});
    },
    recordDial(item) {
        const {
        buildingId,
        projectId,
        areaId,
        addrId,
        ownerName,
        } = this.ownerInfo;
        const { stewardName, id, stewardPhone } = item;
        const params = {
          data:{
            buildingId: buildingId,
            projectId: projectId,
            areaId: areaId,
            addrId: addrId,
            ownerName: ownerName,
            stewardName: stewardName,
            stewardId: id,
            stewardPhone: stewardPhone,
            roomId: addrId
          }
          
        };
        saveStewardContactRecord(params).then(res => {
          if (res.status == "200") {
              console.log("记录");
              //console.log(this.ownerInfo);
              //console.log(params);
          }
        });
      },
    dialStewardTel(data){
        console.log(566,data);
        
        uni.makePhoneCall({
        phoneNumber: data.stewardPhone,
        success: res => {
          console.log('拨打成功!');
          this.recordDial(data);
        },
        fail: res => {
          console.log('拨打失败!')
        }
      })
    },
    async  showCompanyConfig() { 
            const {COMPLANY_ID , O_USER_INFO} = this.$constant
            this.companyId = util.storageAction({ key: COMPLANY_ID, action: 'get' })
            const { companyId} = util.storageAction({ key: O_USER_INFO, action: 'get' });
             var params = {
                data:{
                    companyId: this.companyId || companyId,
                }
             };
           getCompanyConfig(params).then(result=>{ 
               if (result.status == 200) {
                this.authTypes= result.data.authType ? JSON.parse(result.data.authType).filter(f => { return f != '' }) : [];
                this.authTypes.forEach(item=>{ 
                   let val = item ? parseInt(item) : 0
                   if(this.authTypes.length==1){
                    console.log(699,val)
                     switch(val){
                      case 1:
                         this.showFWQY = val;
                        break
                       case 2:
                       this.showFWQY = val;
                         break;
                       default :
                       break;
                     }
                  }
                  if(this.authTypes.length==2){
                       this.showFWQY = 0;
                  }
               })
               }else{
                 this.showFW = 0; 
               }
     });
    }
    }
    
};
</script>
