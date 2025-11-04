<style>
page{
  background:#f5f5f5;
}
</style>
<style lang="scss" scoped>
.invite_staff_cont{
  height: 100%;
}
.list-box{
  padding-top: 158rpx;
}
.list-box2{
  padding-top: 104rpx;
}
.top-box{
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 999;
  border-bottom: 2rpx solid #eee;
  .search-cont{
    width: 100%;
    display: flex;
    padding: 12rpx 24rpx 0;
    background-color: #fff;
    box-sizing: border-box;
    // border: 2rpx solid #eee;
    .search-input{
      background: #f5f5f5;
      height: 48rpx;
      padding-left: 20rpx; 
      
    }
    .search-btn{
      padding: 8rpx 24rpx 0;
      margin-left: 24rpx;
      border-radius: 10rpx;
      color: #fff;
      font-size: 28rpx;
      background-color: var(--app-primary-color);
    }
  }
  .search-cont2{
    padding: 24rpx;
  }
}
::v-deep .u-input{
  border-radius: 38rpx !important;
  padding: 4rpx 10rpx !important;
  background: #eee;
}
.tab_cont{
  display: flex;
  background-color: #fff;
  .tab_item{
    width: 50%;
    text-align: center;
    height: 90rpx;
    line-height: 90rpx;
    text{
      color: #666;
      font-size: 30rpx;
    }
  }
  .select_item{
    position: relative;
    text{
      color: var(--app-primary-color);
    }
    view{
      position: relative;
      top: -20rpx;
      width: 46rpx;
      border-radius: 2rpx;
      margin: auto;
      height: 6rpx;
      background-color: var(--app-primary-color);
    }
  }
}
.tab_container{
  padding: 20rpx;
}
::v-deep .u-loadmore__content {
margin: 0 20rpx !important;
}
::v-deep .u-modal__content {
  justify-content: left !important;
}
::v-deep .u-textarea {
  margin-top: 20rpx !important;
}

  ::v-deep .u-textarea__field {
    color: #000000 !important;
  }

</style>

<template>
  <view class="invite_staff_cont" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
    <view class="top-box">
      <view class="search-cont" :class="{'search-cont2':!isContacts}">
        <u--input
          class="search-input"
          placeholder="手机号码/姓名"
          prefixIcon="search"
          border='none'
          prefixIconStyle="font-size: 20px;color: #909399"
          v-model="search"
          clearable
        ></u--input>
        <view class="search-btn" @click="searchData(1)">搜索</view>
      </view>
      <view class="tab_cont" v-if="isContacts">
        <view class="tab_item"  v-for='(tab,i) in tabItem' :class="{'select_item':tabShow==i}" :key="i">
          <text @click="staffInfoTab(i)">{{tab.title}}({{tab.count }})</text>
          <view class="tab_line"></view>
        </view>
      </view>
    </view>
    <view class="list-box" :class="{'list-box2':!isContacts}" v-if="staffData.length>0">
      <view class="tab_container">
        <view class="form_cont">
          <staff-info-item @getStaffInfo='getParams' :staffInfoList='staffData' @authorityThat="authorityCheck"></staff-info-item>
        </view>
        <u-loadmore :status="status" background-color="#fbf9fe" line lineColor="#e0e0e0"
				/>
      </view>
    </view>
    <no-data-bg v-else></no-data-bg>
    <u-modal :show="modalShow" :content='modalCont' :showCancelButton='true' @confirm='examineFun' @cancel='cancelExamine'>
      <view class="slot-content" style="width:100%">
        <view>{{ modalCont }}</view>
        <view v-if="state!= 0 && state!=1" style="margin-top:20rpx" class="rejectRclass">
          拒绝理由：<u--textarea  placeholder="请输入" :rows="3" v-model="rejectReason"></u--textarea>
        </view>
			</view>
      </u-modal>
    <u-modal :show="modalShow2" :content='modalCont2' :showCancelButton='true' @confirm='examineFun2' @cancel='cancelExamine2'>
      <view class="slot-content" style="width:100%">
        <view>{{ modalCont2 }}</view>
			</view>
      </u-modal>
  </view>
</template>
<script>
import staffInfoItem from './components/staffInfoItem.vue'
import noDataBg from './components/no-data-imgae.vue'
import { auditAuthApply, updateEmployeeDemission, getEnterpriseEmployeeListPage, findAuditAuthListPage,walletAuthorize } from '../../service/community'
import utils from '@/js/utils';
import commLogic from '@/js/comm-logic';
export default {
  components:{
    staffInfoItem,
    noDataBg
  },
  data(){
    return{
      isContacts:true,
      tabShow:0,  //默认显示的tab
      tabItem:[
        { title:'全部员工', count:0 },
        { title:'待审批', count:0 },
        { title:'已审批', count:0 },
      ],
      memberId:'',
      companyId:'',
      modalShow:false,
      modalShow2:false,
      modalCont:'',
      modalCont2:'',
      staffInfo:{}, //选中员工信息
      staffInfo2:{}, //选中员工信息
      pageSize:10,
      pageIndex:1,
      pages:0, //总页码
      staffData:[], //员工列表
      search:'', //查询参数
      state:'',
      rejectReason:''//拒绝理由
    }
  },

  onLoad(e){
    this.getMemberInfo()
    //查询所有数据
    this.searchData()
  },

  //上拉加载更多
  onReachBottom(){
    if(this.pageIndex>=this.pages) return
    this.pageIndex++
    this.initData(1)
  },

  methods:{
    // 取消授权操作
    cancelExamine2(){
      this.modalShow2 = false
    },
    //授权钱包
    authorityCheck(id,employeeName,type){
      console.log(id,employeeName,type,'id,employeeName,type')
      this.staffInfo2 = {
        employeeId:id,
        type
      }
      if(type == '1'){
        this.modalCont2 = `确认授权企业钱包给${employeeName}吗？` 
      }else{
        this.modalCont2 =`确认取消授权企业钱包给${employeeName}吗？`
      }
      this.modalShow2 = true
      console.log(this.modalCont2,'this.modalCont2')
    },
    examineFun2(){
      let params = {
        data:this.staffInfo2
      }
      walletAuthorize(params).then(res=>{
        this.modalShow2 = false
        if(res.status == '200'){
          this.searchData()
          this.showToast('操作成功')
        }else{
          this.showToast(res.message)
        }
      })
    },
    //查询数据，传1代表查询单个tab（使用场景：搜索按钮，点击tab切换，上拉加载数据），
    // 不传查询所有（页面加载，操作按钮）
    searchData(type){
      this.pageIndex=1
      this.pages=0 //总页码
      this.staffData=[]
      this.initData(type)
    },

    initData(type){
      //type:1查询单个数据，否则查询所有数据
      if(type==1){
        switch(this.tabShow){
          case 0:
            this.getAllData()
            break;
          case 1:
            this.getExamineList(0)
            break;
          case 2:
            this.getExamineList(1)
            break
        }
      }else{
        this.getAllData()
        //企业联系人才需查询审核列表
        if(this.isContacts){
          this.getExamineList(0)
          this.getExamineList(1)
        }
      }
    },

    //获取全部员工
    getAllData(){
      let params = {
        data:{
          memberId:this.memberId,
          queryCondition:this.search
        },
        pathParams:`/${this.pageSize}/${this.pageIndex}`
      }
      getEnterpriseEmployeeListPage(params).then(res =>{
        if(res.status=='200'){
          this.tabItem[0].count = 10
          if(this.tabShow==0){
            this.staffData=res.data.records
            //this.staffData=[
            //  {userName:'张看看',phone:'13535842123',applyStatus:4,department:'部门1',employeeStatusName:'66666',rejectReason:''},
            //  {userName:'张看看',phone:'13535842123',applyStatus:4,department:'部门1',employeeStatusName:'66666',rejectReason:''},
            //  {userName:'张看看',phone:'13535842123',applyStatus:2,department:'部门1',employeeStatusName:'66666',rejectReason:'666'},
            //  {userName:'张看看',phone:'13535842123',applyStatus:2,department:'部门1',employeeStatusName:'66666',rejectReason:'666'},
            //  {userName:'张看看',phone:'13535842123',applyStatus:2,department:'部门1',employeeStatusName:'66666',rejectReason:'666'},
            //]
            this.pages = res.data.pages
            this.staffData.forEach(item =>{
              item.employeeName = item.userName
              item.phoneNumber = item.phone
            })
            if(this.staffData.length<res.data.total){
              this.status = 'loading';
            }else{
              this.status = 'nomore';
            }
          }
        }
      })
    },

    //审核列表
    getExamineList(type){
      let params = {
        data:{
          memberId:this.memberId,
          type:type, //0:待审核记录，1.已审核记录
          queryCondition:this.search
        },
        pathParams:`/${this.pageSize}/${this.pageIndex}`
      }
      findAuditAuthListPage(params).then(res =>{
        if(res.status=='200'){
          this.tabItem[type+1].count = res.data.total
          if(this.tabShow == type+1){
            this.staffData=this.staffData.concat(res.data.records)
            this.pages = res.data.pages
            if(this.staffData.length<res.data.total){
              this.status = 'loading';
            }else{
              this.status = 'nomore';
            }
          }
        }
      })
    },

    // 获取员工信息，审核
    getParams(id,state){
      let that=this
      that.state = state
      // console.log(269, that.state)
      let status=''
      if(state==1){
        status='同意'
      }else{
        status='拒绝'
      }
      this.modalShow = true
      if(state==0){
        this.modalCont ='离职将移除此认证数据，是否确认离职？'
      }else{
        this.modalCont = `确定${status}该用户的申请？`
      }
      this.staffInfo = {
        id,
        state
      }
    },

    // 取消审核
    cancelExamine(){
      this.modalShow = false
      this.rejectReason = ''
    },

    //审核
    examineFun(){
      // state 0：移除（离职）、 2：拒绝、1：同意
      const { id, state } = this.staffInfo
      if(state==0){
        this.quit(id)
      }else{
        if(state == '2' && !this.rejectReason){
          this.showToast('请输入拒绝理由')
          return;
        }
        let params={
          data:{
            id:id,
            applyStatus:state,
            operateSource:1, //操作源(1.业主端，2.运营后台)(必填)
            auditorMemberId:this.memberId,
            rejectReason:this.rejectReason || ''   //拒绝原因
          }
        }
        auditAuthApply(params).then(res =>{
          if(res.status=='200'){
            this.searchData()
            this.showToast('操作成功！')
          }else{
            this.showToast(res.message)
          }
        })
      }
      this.modalShow = false
      this.rejectReason = ''
    },

    // 移除
    quit(id){
      let params = {
        data:{
          id:id
        }
      }
      updateEmployeeDemission(params).then(res =>{
        if (res.status === '200') {
            this.showToast('操作成功')
            this.searchData()
          } else {
            this.showToast(res.message)
          }
      })
    },

    // 提示
    showToast (tips) {
      uni.showToast({ title: tips, icon: 'none' });
    },
    //tab切换
    staffInfoTab(i){
      this.tabShow=i
      this.searchData(1)
    },

    //获取缓存信息
    getMemberInfo(){
      const { O_USER_INFO, USER_TYPE_NUM } = this.$constant;
      const { id } = utils.storageAction({ key: O_USER_INFO, action: 'get' });
      const num = utils.storageAction({ key: USER_TYPE_NUM, action: 'get' });
      const { companyId } = commLogic.getProjectConfig();
      this.companyId  = companyId
      this.memberId = id
      this.isContacts = num==4 || num == 9 || num == 10 || num == 11 || num == 12 ? true : false
    },

  },
  }
  
</script>