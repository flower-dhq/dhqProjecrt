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
  </view>
</template>
<script>
import utils from '@/js/utils';
import {mapGetters, mapMutations } from 'vuex'
import AuthAddressItem from './components/auth-address-item.vue'
import { findLocations } from '../../service/community'
export default {
  components:{
    AuthAddressItem
  },
  data(){
    return{
      memberId:'',
      companyId:'',
      projectType:'175',
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
		  this.routerSign = taskType 
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
      let url = ''
      if(this.enterpriseSign){
        url = '/pages-d/enterprise-info/join-company'
      }else{
        url = '/pages-b/house-info/add-house-address'
      }
			uni.navigateTo({ url })
		},
    selectAddress(item){
        console.log(99,item)
        this.updateRepairAdd(item);
		uni.navigateBack()
    },

    getAddrList(){
      let params = {
        data:{
          memberId:this.memberId,
          companyId:this.companyId,
          projectType:this.projectType,
          authType:1 //已认证房产
        },
        pathParams:'/0'
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
      const { O_USER_INFO, URL_PROJECT_TYPE } = this.$constant;
      const { companyId, id } = utils.storageAction({ key: O_USER_INFO, action: 'get' });
      // this.projectType = utils.storageAction({ key: URL_PROJECT_TYPE, action: 'get' });
      this.companyId = companyId;
      this.memberId = id
    },
		updateRepairAdd(add) {
				const { O_USER_INFO } = this.$constant;
				const userInfo = utils.storageAction({ key: O_USER_INFO, action: 'get' });
        const {regName, ownerName, address, concatName, ownerCall, infoId, ownerPhones, ownerId, projectId, relateId, addrId,areaId,authType, isEnterpriseHouse, companyName, phoneNumber} = add || {};
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
          isEnterpriseHouse,
          companyName,
          name: oldApi ? oldFieldName : isEnterprise ? concatName  : ownerName,
          phone: oldApi ? oldFieldPhone : isEnterprise ? phoneNumber : ownerCall,
          add: address,
          addrId:  oldApi ? addrId : isEnterprise ? infoId : addrId,
          projectId,
          relateId,
          ownerId,
          authType:authType,
          areaId
        };
        console.log(207,repairsInfo)
        this.saveRepairsInfo(JSON.parse(JSON.stringify(repairsInfo)));
      }
  }
}
</script>