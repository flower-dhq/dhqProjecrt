<style lang="scss" scoped>
.addr-list-page{
  padding: 0 28rpx 68rpx;
}
.btn-cont{
  position: fixed;
  width: 100%;
  bottom: 0;
  left: 0;
  height: 68rpx;
  line-height: 68rpx;
  text-align: center;
  font-size: 28rpx;
  color: #fff;
  background: var(--app-primary-color);
}
</style>
<template>
  <view class="addr-list-page" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
    <auth-address-item v-for="(item,i) in addressList" :key="i" :addrData ='item' @click.native="selectAddress(item)"></auth-address-item>
    <view class="btn-cont" v-if="routerSign != 'wyPayment'" @click="navTo">新增认证路址</view>
    <uniPop ref="rzModal"></uniPop>
  </view>
</template>
<script>
import utils from '@/js/utils';
import commLogic from '@/js/comm-logic';
import {mapGetters, mapMutations } from 'vuex'
import AuthAddressItem from './components/auth-address-item.vue'
import { findLocations } from '../../service/community'
export default {
  components:{
    AuthAddressItem
  },
  data(){
    const { projectType } =  commLogic.getProjectConfig()
    return{
      memberId:'',
      companyId:'',
      projectId: "",
      projectType,
      userTypesNum:'',
      addressList:[],
      routerName:'',
			taskType:'',//录单页过来
      enterpriseSign:true, //默认企业
    }
  },

  onLoad(options){
    this.getMemberInfo()
    this.getAddrList()
		// #ifndef H5
		if(options.page && options.page == 'reportingRorRepairs'){
		  this.routerSign = options.page 
		  this.taskType = options.taskType 
		}else{
			this.routerSign = options.page 
		}
		// #endif
  },

  onShow(){
		// #ifdef H5
    let page = this.$route.query.page
    if(page){
      //标记来自哪个页面
      this.routerSign = page 
    }
		let taskType = this.$route.query.taskType
		if(taskType){
		  this.taskType = taskType 
		}
		// #endif
		if(this.routerSign && this.routerSign =='inviteFamily'){
		  let obj = this.familyInfo
		  obj.pageFrom = 'authAddressList'
		  this.saveInviteFamily(JSON.parse(JSON.stringify(obj)));
		}
  },

  computed:{
		...mapGetters('repair', {
      getRepairsInfo: 'getRepairsInfo',
    }),
    ...mapGetters('inviteFamily', {
      familyInfo: 'getInviteFamily',
    }),
  },

  methods:{
		...mapMutations('repair', ['saveRepairsInfo']),
    ...mapMutations('inviteFamily', ['saveInviteFamily']),
		navTo(){
      this.$refs.rzModal.showModal({ modalType: 'rz' });
      this.$refs.rzModal.showCompanyConfig();
      // let url = ''
      // if(this.enterpriseSign){
      //   url = '/pages-d/enterprise-info/join-company'
      // }else{
      //   url = '/pages-b/house-info/add-house-address'
      // }
			// uni.navigateTo({ url })
		},
    selectAddress(item){
      if(this.routerSign=='inviteFamily'){
        let obj = this.familyInfo;
        obj.addressInfo = item;
        obj.pageFrom = 'authAddressList'
        this.saveInviteFamily(JSON.parse(JSON.stringify(obj)));
        uni.navigateBack()
        // uni.redirectTo({
        //   url:'/pages-b/house-info/invite-family'
        // });
      }else if(this.routerSign=='reportingRorRepairs'){
				// localStorage.removeItem('followUpProcessorObj')
        this.updateRepairAdd(item);
				uni.navigateBack()
				// uni.redirectTo({
				//   url:'/pages-a/repair/reportingRorRepairs?taskType='+this.taskType
				// });
			}else if(this.routerSign === 'wyPayment'){
        let paymentRoomInfo = {
          roomId: item.roomId,
        }
        uni.setStorageSync('paymentRoomInfo',JSON.stringify(paymentRoomInfo));
        uni.redirectTo({
          url:'/pages-leasing/paymentinfo/newPaymentCenter'
        });
      }else if(this.routerSign === 'addCustomWorkOrder'){
        // this.saveRepairsInfo(item);
        const eventChannel = this.getOpenerEventChannel()
        eventChannel.emit('dataEvent', { data: item })
        uni.navigateBack()
      }
    },

    getAddrList(){
      let routes = getCurrentPages(); // 获取当前打开过的页面路由数组
        let prePages = routes[routes.length - 2]; //获取路由参数 
        let prePage = prePages.route
       let params
        if(prePage == 'pages-a/repair/reportingRorRepairs' || prePage == 'pages-order/order/add'){
            params = {
                 data:{
                   memberId:this.memberId,
                   companyId:this.companyId,
                   projectType:this.projectType,
                   //authType:1, // 已认证房产
                   isEnterpriseHouse: 1, // 查询企业房产
                 },
                 pathParams:'/0' // 0- 查所有 1-查业主认证房产 2-查收获地址 3-查企业认证房产
               }
        }else {
          // todo：企业认证用户也查询所有房产，和crm工单保持一致
           params = {
                 data:{
                   memberId:this.memberId,
                   companyId:this.companyId,
                   projectType:this.projectType,
                   //authType:1, //已认证房产
                   isEnterpriseHouse: 1, // 查询企业房产
                 },
                 pathParams:'/0' // 0- 查住宅+企业认证类房间 1-查住宅类 2-查快递地址 3-查企业认证类  
               }
        }
      findLocations(params).then(res =>{
        if(res.status=='200'){
          let list = res.data.authBuildings
          let flag = false
          if(list.length>0){
            list.forEach(item => {
              let authTypeStr = ''
              switch (item.authType) {
                case 1:
                  authTypeStr = '认证成功';
                  break;
                case 2:
                  authTypeStr = '待认证';
                  break;
                case 3:
                  authTypeStr = '拒绝认证';
                  break;
                case 4:
                  authTypeStr = '已取消';
                  break;
                case 5:
                  authTypeStr = '异常';
                  break;
              }
              if(item.isEnterpriseHouse){
                flag = true
              }
              item.authStatus = authTypeStr
              item.name = item.isEnterpriseHouse ==1 ? item.concatName  : item.ownerName;
            });
            if(this.routerSign == "wyPayment"){
              let addressListArr = JSON.parse(JSON.stringify(list));
              list = addressListArr.filter(
                item => item.projectId == this.projectId
              )
            }else if( this.routerSign == 'inviteFamily'){
              // 邀请家人选择地址，只返回业主身份的地址
              list = list.filter(item=>item.houseState == 2);
            }
          }
          if(flag){
            this.enterpriseSign= true //有公司认证的，新增则跳转到新增企业，否则跳转到房屋
          }else{
            this.enterpriseSign= false
          }
          this.addressList = list
        }
      })
    },

    //获取缓存信息
    getMemberInfo(){
      const { O_USER_INFO, URL_PROJECT_TYPE, PROJECT_ID } = this.$constant;
      const { companyId, id } = utils.storageAction({ key: O_USER_INFO, action: 'get' });
      this.projectId = utils.storageAction({ key: PROJECT_ID, action: 'get' });
      // this.projectType = utils.storageAction({ key: URL_PROJECT_TYPE, action: 'get' });
      this.companyId = companyId;
      this.memberId = id
    },
		updateRepairAdd(add) {
				const { O_USER_INFO } = this.$constant;
				const userInfo = utils.storageAction({ key: O_USER_INFO, action: 'get' });
        const {areaId, areaName, projectId, projectName, regName, ownerName, address, concatName, infoId, ownerPhones, ownerId, relateId, addrId,authType, isEnterpriseHouse, companyName, phoneNumber, buildingId} = add || {};
        const oldApi = this.oldApi;
        let repairsInfo = this.getRepairsInfo;
        if(!repairsInfo){
          repairsInfo={};
        }
        let owner=userInfo.ownerPhone=="undefined" ? null : userInfo.ownerPhone
        let number=userInfo.phoneNumber=="undefined" ? null : userInfo.phoneNumber
        let contact=userInfo.contactPhone=="undefined" ? null : userInfo.contactPhone
        let phone = owner|| number || contact
        const isEnterprise = isEnterpriseHouse == 1;
        const oldFieldName = regName || ownerName;
        const oldFieldPhone = isEnterprise ? phone : ownerPhones;
        repairsInfo.ownerInfo = {
          areaId,
          areaName,
          projectId,
          projectName,
          isEnterpriseHouse,
          companyName,
          //name: regName || ownerName,
          name: oldApi ? oldFieldName : isEnterprise ? ownerName || concatName   : ownerName,
          // name: oldApi ? oldFieldName : isEnterprise ? ownerName  : concatName,
          //phone: isEnterpriseHouse==1 ? phone : ownerPhones,
          phone: oldApi ? oldFieldPhone : isEnterprise ? phoneNumber : ownerPhones,
          add: address,
          addrId:  oldApi ? addrId : isEnterprise ? infoId : addrId,
          projectId,
          relateId,
          ownerId,
          authType,
          buildingId,
        };
        console.log(repairsInfo)
        this.saveRepairsInfo(JSON.parse(JSON.stringify(repairsInfo)));
      }
  }
}
</script>