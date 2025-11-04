<style>
page{
  background:#f5f5f5;
}
</style>
<style scoped lang="scss" >
.companyAuth_cont{
  height: 100%;
  .data-listempty{
    width: 95%;
    height: calc(100vh - 166rpx);
    margin:24rpx auto;
    border-radius: 18rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #FFFFFF;
    list-style: none;
    view{
      image{
      width: 400rpx;
      }
      text{
        display: block;
        color: #999;
        text-align: center;
      }
    }
  }
  .fixed_button{
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: #fff;
    box-shadow: 0 -10rpx 18rpx -10rpx #d7d7d7;
    z-index: 1000;
  }
}
.list-cont{
  padding-bottom: 108rpx;
}
.nodata {
    height: calc(100vh - 100rpx);
    background: url("@/static/theme-default/multiplexing/tips.png");
    background-position: center;
    background-repeat: no-repeat;
    background-size: 175px;
    position: relative;
    background-position: center 25%;
    background-color: #ffffff;
}
.nodata::after {
    content: "暂无数据~";
    color: #999;
    font-size: 14px;
    text-align: center;
    margin-top: 10px;
    margin-bottom: 50px;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>

<template>
  <view class="companyAuth_cont" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
    <view class="nodata" v-if="isNoData"></view>
    <view v-else class="list-cont">
      <company-item :companyList='authList' :onlyShow='true'></company-item>
      <!-- <u-loadmore :status="lsStatus"/> -->
    </view>
    <view class="fixed_button">
      <auth-btn :btnName="'添加认证'" @click.native="goJoinCompany()"></auth-btn>
    </view>
  </view>
</template>

<script>
import companyItem from './components/companyItem.vue'
import authBtn from './components//authBtn.vue'
import { findCompanyAuthInfoList,findCompanyAuthInfoListPage } from '../../service/community.js' 
import utils from '@/js/utils';
import commLogic from '@/js/comm-logic';
export default {
  name:'enterprise-auth-list',
  components:{
    companyItem,
    authBtn
  },
  options:{ styleIsolation: 'shared' },
  data(){
    return{
      loading:false,
      isNoData:false,
      memberId:'',
      companyId:'',
      authList:[],
      pageSize:20,
      pageIndex:1,
      lsStatus:'',
      pages:''
      
    }
  },
  
  onShow(){
    this.getMemberInfo() //获取人员信息
    this.getAuthList()  //获取企业认证列表
  },

  //上拉加载更多
  onReachBottom(){
    if(this.pageIndex>=this.pages) return
    this.pageIndex++
    this.getAuthList()
  },

  methods:{
    //加入公司
    goJoinCompany(){
      uni.navigateTo({
        url: '/pages-d/enterprise-info/join-company'
      });
    },


    //查询认证企业
    getAuthList(){
      let params = {
        data:{
          memberId:this.memberId
        },
        pathParams:`/${this.pageSize}/${this.pageIndex}`
      }
      findCompanyAuthInfoListPage(params).then(res =>{
        if(res.status == "200"){
          this.pages = res.data.pages
          let list=[]
          res.data.records.forEach(item => {
            let obj={
              name:item.enterpriseName,
              contactName:item.companyLinkman,
              contactPhone:item.companyLinkmanPhone,
              applyStatus:item.applyStatus,
              address:item.enterpriseAddress ? item.enterpriseAddress.substring(1, item.enterpriseAddress.length-1).split(","): [],
              rejectReason:item.rejectReason ? item.rejectReason : ''
            }
            list.push(obj)
          });
					if(this.pageIndex == 1){
						this.authList=list
					}else{
						this.authList=this.authList.concat(list)
					}
          this.isNoData = this.authList.length ? false : true;
          if(this.authList.length<res.data.total){
            this.status = 'loading';
          }else{
            this.status = 'nomore';
          }
          console.log('企业认证列表',res.data)
        }
      })
    },

    getMemberInfo(){
      const { MEMBER_ID, USER_INFO } = this.$constant;
      this.memberId = utils.storageAction({ key: MEMBER_ID, action: 'get' });
      const { companyId } = commLogic.getProjectConfig();
      this.companyId  = companyId
    }
  }
}
</script>
