<style>
page{
  background:#f5f5f5;
}
</style>
<style lang="scss" scoped>
.company-page{
  padding-top: 104rpx;
}
.search-cont{
  position: fixed;
  top: 0;
  width: 100%;
  padding: 24rpx 44rpx;
  box-shadow: 0 10rpx 18rpx -4rpx #f5f5f5;
  background-color: #fff;
  box-sizing: border-box;
  .search-input{
    background: #f5f5f5;
    height: 56rpx;
    border-radius: 28rpx;
    padding-left: 20rpx;
  }
}
::v-deep .u-input__content{
  padding-left: 20rpx; 
}
</style>
<template>
  <view class="company-page" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
    <view class="search-cont">
      <u--input
        class="search-input"
        placeholder="请输入公司名称"
        prefixIcon="search"
        border='none'
        prefixIconStyle="font-size: 20px;color: #909399"
        v-model="search"
      ></u--input>
    </view>
    <company-item @company-info='selectCompany' :companyList='addressList'></company-item>
  </view>
</template>
<script>
import companyItem from './components/companyItem.vue'
import utils from '@/js/utils';
import {
  getCompanyListById,
  findCompanyAuthInfoListPage
} from '../../service/community'
import commLogic from '@/js/comm-logic';
export default {
  components:{
    companyItem
  },
  data(){
    return{
      search:'', //查询值
      searchList:[], //查询结果
      addressList:[],
      type:null,
      memberId:'',
      companyId:''
        
    }
  },
  watch:{
    search: function(val) {
      let _this = this
      setTimeout(function() {
        _this.searchData();
      },500)
    },
  },

  onLoad(e){
    this.getMemberInfo()
     this.type = e.type;
     //邀请员工
     if(this.type==2){
      this.getAuthCompanyList()
     }
  },

  methods:{
    selectCompany(item){
      uni.$emit('selectCompanyInfo', item)
      let canNavBack = getCurrentPages();  
      if(canNavBack && canNavBack.length>1) {  
        uni.navigateBack({  
          delta: 1 //返回层数，2则上上页 
        });  
      } else {  
        history.back(); //被刷新后，历史栈消失，用这个返回上一层。
      }
    },
    //搜索公司
    searchData() {
      let search = this.search;
      if(this.type==1){
        this.addressList = []
        if (search) {
          this.getCompanyList(search) 
        }
      } else if(this.type == 2){
        this.getAuthCompanyList(search)
      }
    },
        //获取公司列表
    getCompanyList(name){
      let params = {
        data:{
          companyId:this.companyId,
          enterpriseName:name
        }
      }
      getCompanyListById(params).then(res => {
        if(res.status=='200'){
          this.addressList=res.data
          this.addressList.forEach(item => {
            item.shrink = true
          })
        }else{
          this.loading = false
          this.message('获取列表失败')
        }

        // console.log(res,'公司列表')
      })
    },

    //获取已认证公司列表
    getAuthCompanyList(name){
      let params = {
        data:{
          "companyId":this.companyId,
          "memberId":this.memberId,
          employeeType:0, //0企业联系人，1企业员工
          "enterpriseName":name,
          applyStatus:'9'
        },
        pathParams:`/100/1`
      }
      findCompanyAuthInfoListPage(params).then(res =>{
        if(res.status == "200"){
          let arr =res.data.records
          let list=[]
          arr.forEach(item => {
            const {companyLinkman, companyLinkmanPhone, enterpriseName, enterpriseId, projectId, projectName, enterpriseAddress  }=item
            const obj={
              contactName: companyLinkman,
              contactPhone: companyLinkmanPhone,
              id: enterpriseId,
              name: enterpriseName,
              projectId: projectId,
              projectName: projectName,
              address: enterpriseAddress ? enterpriseAddress.substring(1, enterpriseAddress.length-1).split(","): []
            }
            list.push(obj)
          });
          this.addressList = list
        }else{
          this.loading = false
          this.message('获取列表失败')
        }
      })
    },
    getMemberInfo(){
      const { MEMBER_ID } = this.$constant;
      this.memberId = utils.storageAction({ key: MEMBER_ID, action: 'get' });
      const { companyId } = commLogic.getProjectConfig();
      this.companyId  = companyId
    }
  }
}
</script>