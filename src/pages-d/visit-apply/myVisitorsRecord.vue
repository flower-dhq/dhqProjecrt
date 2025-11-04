<style lang="scss" scope>
	
@mixin flx-dsp($jsc, $ali, $drt:row) {
    display: flex;
    flex-direction: $drt;
    justify-content: $jsc;
    align-items: $ali;
  }
text,view{
		font-size: 28rpx;
	}
.my-report-and-repair {
  width: 100%;
  min-height: 100%;
	background-color:  #f5f5f5;
  // overflow: hidden;
  box-sizing: border-box;

  .tab-wr{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
  }
  ::v-deep .vux-tab-container {
    $c: #ffa633 ;
    text.vux-tab-bar-inner {
      background-color:var(--app-primary-color) !important;
    }
  }
  .detail-list {
    margin-top: 12rpx;
    padding: 0 30rpx;
    background-color: #FFFFFF;
    ;

    .detail-list-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 80rpx;

      .detail-list-status{
        color: var(--app-primary-color);
        font-weight: 700
      }

    }

    .detail-list-content {
      // border-top: .3px solid #999999;
      // border-bottom: .3px solid #999999;
      border-top: .5px solid rgba(0,0,0,.1);
      border-bottom: .5px solid rgba(0,0,0,.1);
      padding: 10rpx 0;
      view {
        height: 70rpx;
        width: 100%;
        line-height: 70rpx;
      }


    }

    .detail-list-action {
      display: flex;
      justify-content: flex-end;
      padding: 20rpx 0;

      button {
        width: 150rpx;
        height: 60rpx;
        border: 1px solid var(--app-primary-color);
        border-radius: 20rpx;
        color: var(--app-primary-color);
        outline: none;
        background-color: #fff;
        font-size: 24rpx;
        margin-right: 20rpx;
				line-height: 60rpx;
      }
			button::after{
				border: none;
			}

    }
  }

  .no-data{
        @include flx-dsp($jsc: flex-start, $ali: center, $drt: column);
        width: 100%;
        height:  calc(100vh - 88rpx);
        background-color: #fff;
        padding-top: 180rpx;
        box-sizing: border-box;
        img{
            width: 520rpx;
            height: 300rpx;
            margin-bottom: 20rpx;
        }
        text{
            font-size: 28rpx;
            color: #666;
            margin-left: 20rpx;
        }

        .no-data-icon{
            width: 504rpx;
            height: 380rpx;
            box-sizing: border-box;
            // padding-top: 336rpx;
            text-align: center;
            font-size:28rpx;
            font-family:PingFang SC;
            font-weight:400;
            line-height:44rpx;
            color:rgba(136,136,136,1);
            // background-image:url("@/static/theme-default/index/tips.png");
            // background-repeat: no-repeat;
            // background-size: 350rpx 350rpx;
            // background-position: top center;
        }
    }

}
.scroller-body {
  width: 100%;
  min-height: calc(100vh - 44px);
  overflow: hidden;
}
.vux-tab-wrap ::v-deep .vux-tab-item.vux-tab-selected {
  color: var(--app-primary-color) !important;
}

.tab-wr{
	width: 100%;
}
.reportingRorRepairs-tab {
		width: 100%;
		height: 88rpx;
		.rorRepairs-box {
			width: 100%;
			height: 88rpx;
			position: fixed;
			top: 0;
			left: 0;
			background: #fff;
			z-index: 1;
			border-bottom: 1px solid rgba(245, 240, 240, 1);
		}
	}
.base-lien {
      position: relative;
      margin: 30rpx auto 20rpx auto;
      width: 476rpx;
      height: 80rpx;
      @include flx-dsp($jsc: center, $ali: center);
      font-size: 30rpx;
      & > view {
        width: 100%;
        height: 1px;
        background-color: #e0e0e0;
      }
      & > text {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 180rpx;
        height: 40rpx;
        text-align: center;
        background-color: #f5f5f5;
        transform: translate(-50%, -50%);
        display: block;
        color: #ACACAC;
      }
    }
		.test{
			width: 100%;
			height: 1000px;
			background: #000;
		}
		.noDataImg{
			width: 350rpx;
			height: 350rpx;
		}
		.authBtn{
			display: flex;
			justify-content: flex-end;
		}
</style>
<template>
  <view class="my-report-and-repair" :style="[THEME_CSS_VAR]" :class="[THEME_NAME]">
		<view class="reportingRorRepairs-tab">
			<view class="rorRepairs-box">
				<u-tabs :list="tabList" @click="tabItemClick" itemStyle="width:25%;padding:0;height:88rpx"
					lineWidth="100rpx" lineColor="var(--app-primary-color)"
					activeStyle="font-size:28rpx;color:var(--app-primary-color)" inactiveStyle="font-size:28rpx;color:#666" :current="selectedTabIndex">
				</u-tabs>
			</view>
		</view>
    <scroll-view v-if="recordList.length" scroll-y>
      <!-- <view class="scroller-body"> -->
        <view class="detail-list" v-for="item in recordList" :key="item.recordId" @click="toVisitorsDetail(item.recordId)">
          <view class="detail-list-title">
            <text v-if="item.recordType == 1">【访客登记】</text>
            <text v-if="item.recordType == 2">【访客邀请】</text>
            <text>访问时间：{{item.planVisitTime | getDataTime}}</text>
            <!-- <text class="detail-list-status"  v-if="item.recordStatus == 0">待审核</text>
            <text class="detail-list-status"  v-if="item.recordStatus == 1">待拜访</text>
            <text class="detail-list-status"  v-if="item.recordStatus == 2">已完成</text>
            <text class="detail-list-status"  v-if="item.recordStatus == 3">已拒绝</text>
            <text class="detail-list-status"  v-if="item.recordStatus == 4">已取消</text>
            <text class="detail-list-status"  v-if="item.recordStatus == 5">已过期</text> -->
            <text class="detail-list-status" v-if="item.recordStatusText !='待放行'">{{item.recordStatusText}}</text>
          </view>
          <view class="detail-list-content">
            <view v-if="item.toVisitCompanyName && recordInfo.visitType === 1">企业名称：{{item.toVisitCompanyName}}</view>
            <view v-if="item.toVisitCompanyAddr">企业地址：{{item.toVisitCompanyAddr}}</view>
            <!-- <view v-else>访客姓名：{{item.visitPersonName}}</view> -->

            <view>被访人员：{{item.toVisitPersonName}} {{item.toVisitPersonPhone}}</view>
            <!-- <view v-if="item.sweepType == 1">可用次数：{{item.visitableNum}}次</view> -->
            <view>访客信息：{{item.visitPersonName}} {{item.visitPersonPhone}}</view>
            <view v-if="item.sweepType == 1">放行方式：道闸扫码</view>
            <view v-if="item.sweepType == 2">放行方式：星光门禁扫码</view>
          </view>
          <view v-if="selectedTabIndex == 0 || selectedTabIndex == 1" class="detail-list-action">
            <view class="authBtn" v-if="selectedTabIndex == 0">
              <button v-if="!(item.visitPersonPhone == contactPhone && (userTypesNum ==4 || userTypesNum==6)) && item.isAudit == 1" @click.stop="onModalEvt(1,item)">通过</button>
              <button v-if="!(item.visitPersonPhone == contactPhone && (userTypesNum ==4 || userTypesNum==6)) && item.isAudit == 1" @click.stop="onModalEvt(3,item)">拒绝</button>
            </view>
            <button @click.stop="onModalEvt(4,item)" v-if="selectedTabIndex == 1">取消</button>
          </view>
        </view>
				<view class="base-lien" v-if="hasMoreData">
					<view class="line"></view>
					<text>已无其它内容</text>
				</view>
         <!-- <load-more v-if="hasMoreData" :show-loading="false" tip="已无其它内容" background-color="#fbf9fe"></load-more> -->

      <!-- </view> -->
    </scroll-view>

    <view class="no-data" v-if="!recordList.length">
			<image :src="noDataImg" class="noDataImg"></image>
      <view class="no-data-icon">暂无任何访客记录</view>
    </view>
    <u-modal :show="modal.show" :title="modal.title" showCancelButton  @confirm="onOperationEvt(1)" @cancel="onOperationEvt(0)"></u-modal>
    <u-toast ref="uToast"></u-toast>
  </view>
</template>

<script>
import { getVisitRecordList, getVisitRecordListCount, auditVisitApproval } from '@/service/wxmanage.js'
import Utils from '@/js/utils'
import { object, tr } from '@dcloudio/vue-cli-plugin-uni/packages/postcss/tags'
// import { formatDateTimeOfYMD } from '@/assets/js/TimeUtils.js'
export default {
  name:'myVisitorsRecord',
  data(){
		const { MEMBER_ID, AREA_ID, PROJECT_ID, COMPLANY_ID, PROJECT_TYPE ,USER_TYPE } = this.$constant
    return {
      // tabList: ['待审核', '待拜访', '已完成', '其他'],
      tabList: [{
        title:'待审核',
        num:0,
				name:'待审核(0)'
      },{
        title:'待拜访',
        num:0,
				name:'待拜访(0)'
      },{
        title:'已完成',
        num:0,
				name:'已完成(0)'
      },{
        title:'其他',
        num:0,
				name:'其他(0)'
      }],
      hasMoreData:false,
      selectedTabIndex: 0,
      page: {
        pageNum: 1,     // 当前页
        pageSize: 10,  // 当前页条数
        count: 0,    // 总页数
      },
      recordList: [], // 访客邀请记录数据
      userTypesNum: '',  // 当前身份  4:企业联系人  6：企业员工  其他：访客(会员或游客)
      contactPhone: '',
      companyId: Utils.storageAction({ key: COMPLANY_ID, action: 'get' }),
			memberId: Utils.storageAction({ key: MEMBER_ID, action: 'get' }),
      modal: {
        show: false,
        title: ''
      }
    }
  },
	computed:{
		noDataImg(){
			return `${this.IMG_BASE_URL}/static/${this.THEME_NAME}/index/tips.png`
		}
	},
	onLoad(){
		const { O_USER_INFO, USER_TYPE, USER_TYPE_NUM } = this.$constant
		let data = Utils.storageAction({ key: O_USER_INFO, action: 'get' }) || {}
		this.contactPhone = data.ownerPhone || data.phoneNumber || data.contactPhone || '' 
    if (data.companyId) this.companyId = data.companyId
		this.userTypesNum = Utils.storageAction({ key: USER_TYPE_NUM, action: 'get' })
		console.log(this.contactPhone,this.userTypesNum,"this.contactPhone")
		this.refreshData()
		this.reqVisitorListCount()
	},
  filters: {
    getDataTime(val) {
      // return formatDateTimeOfYMD(val)
      return uni.$u.timeFormat(val)
    }
  },
  methods:{
		setNewTitle(){
			this.tabList.map(item=>{
				item.name = `${item.title}(${item.num})`
			})
		},
    // tab切换
    tabItemClick(e) {
			console.log(e,"tabItemClick")
      // const key = e ? 'done' : 'undone';
      this.recordList = [];
      this.selectedTabIndex = e.index;

      this.refreshData()
      // const list = this.currentList = this[key].list;
      // console.log("list",list)
    },
    // 获取访客邀请记录列表
    async reqVisitorList() {
      let recordStatus = this.selectedTabIndex == 3 ? -1 : this.selectedTabIndex
      let data = {
        pageNum: this.page.pageNum,
        pageSize: this.page.pageSize,
        recordStatus: recordStatus,  //记录状态，全部则不传，待审核：0，已审核（待拜访、待放行）：1， 已完成：2， 已拒绝：3， 已取消：4， 已过期：5， 其他：-1（业主端我的访客列表加上）
        companyId: this.companyId,
        // toVisitPersonPhone:'', //被访人电话（仅企业员工)
        // toVisitCompanyContactPhone:'',   // 被访企业的联系人电话（仅企业联系人)
        // visitPersonPhone:'',  // 访客手机号（仅访客）
      }
			let num = this.userTypesNum+''
      switch (num) {
        case '4':
          data.toVisitCompanyContactPhone = this.contactPhone
          break;
        case '6':
          data.toVisitPersonPhone = this.contactPhone
          break;
        default:
          data.visitPersonPhone = this.contactPhone
          break;
      }
			let params = {
				data:data
			}
      return await getVisitRecordList(params)
    },
    // 获取各记录状态总条数
    reqVisitorListCount(){
      let data = {
        // projectId: localStorage.projectId,
        // areaId: localStorage.areaId,
        companyId: this.companyId,
        // recordStatus: recordStatus,  //记录状态，全部则不传，待审核：0，已审核（待拜访、待放行）：1， 已完成：2， 已拒绝：3， 已取消：4， 已过期：5， 其他：-1（业主端我的访客列表加上）
        // toVisitPersonPhone:'', //被访人电话（仅企业员工)
        // toVisitCompanyContactPhone:'',   // 被访企业的联系人电话（仅企业联系人)
        // visitPersonPhone:'',  // 访客手机号（仅访客）
      }
			let num = this.userTypesNum+''
      switch (num) {
        case '4':
          data.toVisitCompanyContactPhone = this.contactPhone
          break;
        case '6':
          data.toVisitPersonPhone = this.contactPhone
          break;
        default:
          data.visitPersonPhone = this.contactPhone
          break;
      }
			let params = {
				data,
			}
      getVisitRecordListCount(params).then(res => {
        if(res.status == 200){
          console.log("统计数据的阿----",res.data);
          this.tabList[0].num = res.data.beforeAudit  //待审核
          this.tabList[1].num = res.data.audited  //待拜访
          this.tabList[2].num = res.data.complete  //已完成
          this.tabList[3].num = res.data.other  //其他
					this.setNewTitle()
        }

      })
    },
    onModalEvt(status, record) {
      const d = {
        show: true,
        title: status == 1 ? '您确定要通过吗' : status == 3 ? '您确定要拒绝吗' : status == 4 ? '您确定要取消吗' : '您确定要进行此操作吗',
        status,
        record
      }
      this.modal.show = true
      Object.assign(this.modal, d)
    },
    onOperationEvt(confirm) {
      const {status, record} = this.modal
      this.modal.show = false
      if (confirm) this.handleVisitRecord(status, record)
    },
    // 审核——访客邀请
    handleVisitRecord(status,record){
      let self = this
      let data = {
        recordId: record.recordId,                   // 访客邀请记录id
        recordStatus: status,                 // 审核通过：1，审核不通过：3，取消：4
        operator: this.memberId,      // 操作者id
        // toVisitPersonPhone:'',                 // 企业员工电话（仅企业员工操作时传）
        // toVisitCompanyContactPhone:'',        // 企业联系人电话（仅企业员工操作时传）
        // visitPersonPhone:'',                  // 访客电话（仅访客操作时传）
        // operateType:'',                    //  操作类型，PC端：0，访客：1，被访人人：2，企业联系人：3
      }
      if (record.toVisitCompanyContactPhone && this.contactPhone == record.toVisitCompanyContactPhone) {
          data.toVisitCompanyContactPhone = this.contactPhone //企业联系人
          data.operateType = 3
      } else if (record.toVisitPersonPhone && this.contactPhone == record.toVisitPersonPhone) {
          data.toVisitPersonPhone = this.contactPhone  //企业员工
          data.operateType = 2
      } else {
          data.toVisitPersonPhone = this.contactPhone
          data.operateType = 1
      }
			let params = {
				data,
        responseToast: false
			}

      auditVisitApproval(params).then(res => {
        let message = `${status == 1 ? '通过' : status == 3 ? '拒绝' : status == 4 ? '取消' : '操作'}成功`
        if(res.status == 200){
					// uni.showToast({title:'操作成功',duration:1000,icon: 'none',})
          self.reqVisitorListCount()
          self.refreshData()
        }else{
          message = res.message
					// uni.showToast({title:res.message,duration:1000,icon: 'none',})
        }
        this.$refs.uToast.show({message})
      })
    },
    // 跳转访客邀请详情
    toVisitorsDetail(recordId){
			uni.navigateTo({
				url:'/pages-d/visit-apply/myVisitorsRecordDetail?recordId='+ recordId
			})
    },
		
		
    // 下拉刷新数据
    async refreshData() {
       this.hasMoreData = false;
      this.page.pageNum = 1
      const res = await this.reqVisitorList()
      this.page.count = res.data.pages
      this.recordList = res.data.records
         // this.$refs.elScroller.reset({top: 0})
        // this.$refs.elScroller.donePulldown()
        // this.$refs.elScroller.enablePullup()
      if(this.page.pageNum == this.page.count && this.recordList && this.recordList.length>0){
        this.hasMoreData = true;
				
           // this.$refs.elScroller.disablePullup()
      }

    },
    // 上拉加载更多
    async loadMoreData() {
       this.page.pageNum ++;
      if(this.page.pageNum <= this.page.count){
        const res =  await this.reqVisitorList()
        this.recordList = this.recordList.concat(res.data.records)
        // this.$refs.elScroller.donePullup()
      } else {
        // this.$refs.elScroller.disablePullup()

      }
       if(this.page.pageNum == this.page.count && this.recordList && this.recordList.length>0){
           this.hasMoreData = true;
           // this.$refs.elScroller.disablePullup()
        }

    },
  },
	onReachBottom(){
		this.loadMoreData()
	},
	// beforeRouteEnter(to, from, next) {
	// //判断从index页面进入，将list的isBack设置为true
	// //这样就可以请求数据了
	//   if (from.name != 'myVisitorsRecordDetail') {
	//   to.meta.isBack = true;
	//   }else{
	//   to.meta.isBack = false;
	//   }
	//   next();
	// },
	// activated: function () {
	//     if (this.$route.meta.isBack ) {
	//     this.recordList = [];
	//     this.tabList= [{
	//       title:'待审核',
	//       num:0
	//     },{
	//       title:'待拜访',
	//       num:0
	//     },{
	//       title:'已完成',
	//       num:0
	//     },{
	//       title:'其他',
	//       num:0
	//     }];
	//     this.hasMoreData=false;
	//     this.selectedTabIndex=0;
	//     this.page= {
	//       pageNum: 1,     // 当前页
	//       pageSize: 10,  // 当前页条数
	//       count: 0,    // 总页数
	//   };
	//     this.recordList= []; // 访客邀请记录数据
	//     this.userTypesNum= localStorage.userTypesNum; // 当前身份  4:企业联系人  6：企业员工  其他：访客(会员或游客)
	//     this.contactPhone= localStorage.phoneNumber;
	//     //请求数据
	//       this.refreshData()
	//       this.reqVisitorListCount()
	//     }else{
	//       //请求数据
	//       this.refreshData()
	//       this.reqVisitorListCount()
	//     }
	//     //重新设置当前路由的isBack
	//     this.$route.meta.isBack = false;
	//   },
}
</script>
