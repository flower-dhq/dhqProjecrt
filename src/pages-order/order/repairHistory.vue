<template>
  <view class="page" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
    <view class="tabs-wrap">
      <u-tabs :current="tabCurrent" @click="clickTabs" :list="list1" itemStyle="width:50%;padding:0;height:88rpx" activeStyle="font-size:28rpx;color:var(--app-primary-color);" inactiveStyle="font-size:28rpx" lineWidth="100rpx" lineColor="var(--app-primary-color)"></u-tabs>
    </view>
    <view class="list-wrap">
      <u-list @scrolltolower="scrolltolower" customStyle="height: 100%;">
        <u-list-item v-for="(item, index) in dataList" :key="index">
          <view class="list-box" >
            <u--form labelPosition="left" labelWidth="80" :borderBottom="false" :labelStyle="{ fontSize: '12px', color: '#333333' }" ref="form1">
              <u-form-item label="工单编号">
                <text class="repair_text"> {{ item.taskCode }}</text>
                <view slot="right" class="repair_state">{{ state(item.taskState) }}</view>
              </u-form-item>
              <u-form-item label="工单类型">
                <text class="repair_text"> {{ item.taskTypeName }}</text>
              </u-form-item>
              <u-form-item label="问题描述">
                <text class="repair_text"> {{ item.taskDesc }}</text>
              </u-form-item>
              <u-form-item label="创建时间">
                <text class="repair_text"> {{ formatDate(item.createDate) }}</text>
              </u-form-item>
            </u--form>
            <view class="btn-box" @tap.stop.prevent>
              <u-button :customStyle="btnStyle" @click="clickPage(item)" type="primary" text="处理进度" :plain="true" shape="circle" color="#aeaeae"></u-button>
              <u-button :customStyle="btnStyle" @click="contact(item)" type="primary" text="联系客服" :plain="true" shape="circle" color="var(--app-primary-color)"></u-button>
              <u-button v-if="item.payStatus === 0" :customStyle="btnStyle" @click="toPay(item)" type="primary" text="立即支付" shape="circle" color="var(--app-primary-color)"></u-button>
              <u-button v-if="(item.visitState == 6 || item.visitState == 1) && item.visitId" :customStyle="btnStyle" @click="clickRate(item)" type="primary" text="评价" shape="circle" color="var(--app-primary-color)"></u-button>
            </view>
          </view>
        </u-list-item>
        <view v-if="dataList.length === 0" class="nodata"></view>
      </u-list>
    </view>
    <u-toast ref="uToast"></u-toast>
		<u-popup :show="rateShow" mode="center" closeOnClickOverlay duration="0" class="list-search">
			<view class="rateMax">
				<view class="rate-title">请您对本次服务作出评价？</view>
				<view class="rate-rt"><u-rate v-model="satisfied" size="26" color="#ffd21e"></u-rate></view>
				<view class="rate-btn">
				  <u-row :gutter="10">
				   <u-col span="6" class="hdCellCenter">
				     <view class="leftBtn" @click="rateShow=false;">取消</view>
				   </u-col>
				    <u-col span="6" class="hdCellCenter">
				      <view class="rightBtn" @click="saveRate">提交</view>
				    </u-col>
				  </u-row>
				</view>
			</view>
			
		</u-popup>
  </view>
</template>

<script>
import dayjs from 'cl-uni/utils/dayjs';
import util from '@/js/utils';
import { getCrmTaskListByMemberId,saveAndUpdateQuestionTask } from '@/service/wycrm60';

export default {
  data() {
    return {
      list1: [
        {
          name: '未完成',
        },
        {
          name: '已完成',
        },
      ],
      dataList: [],
      tabIndex: 0,
      tabCurrent: 0,
			processList:[],
			rateShow:false,
			satisfied:0,
			jdpjFlag:'',
			quesTaskId:'',
      btnStyle: 'margin: 18rpx 0 0 20rpx;width: 150rpx;height: 60rpx;'
    };
  },
  onLoad(option) {
    if(option.tab == '1'){
      this.tabCurrent = 1
      this.tabIndex = 1
    }
  },
  onShow(){
    this.loadmore();
  },
  methods: {
    clickTabs(item) {
      this.tabIndex = item.index;
      this.loadmore();
    },
    clickPage(item) {
      uni.navigateTo({
        url: '/pages-order/order/repairDetail?quesTaskId=' + item.quesTaskId,
      });
    },
		clickRate(item){
      uni.navigateTo({
        url: `/pages-a/repair/returnVisitQuestionnaireDetail?visitId=${item.visitId}&type=1`,
      });
      return
			this.quesTaskId=item.quesTaskId;
			this.satisfied=0;
			let operateBtn=JSON.parse(item.operateBtn);
			this.processList=[];
			operateBtn.forEach(item=>{
				if(item.conditionExpression){
				  this.processList.push(item);
				  // this.isShowRate=true;
				}
			})
			this.rateShow=true;
		},
    toPay(item){
      uni.navigateTo({
        url: '/pages-order/order/toPay?quesTaskId=' + item.quesTaskId,
      });
    },
		saveRate(){
			let self = this;
			const { WX_USERID } = this.$constant;
			let params={
			  evaluationScore:this.satisfied,
			  jdpjFlag:1,
			  quesTaskId:this.quesTaskId,
			  jobInfo:'工单管理员',
				ownerSideFlag:1,
				creator:util.storageAction({ key: WX_USERID, action: 'get' }),
			};
			this.processList.forEach(item=>{
			  if(this.satisfied<=3&&item.btnName=='返工'){
			    params.conditionExpression=item.conditionExpression;
			    params.operationCode=item.btnCode;
			    params.operationName=item.btnName;
			  }else if(this.satisfied>=4&&item.btnName=='关闭'){
			    params.conditionExpression=item.conditionExpression;
			    params.operationCode=item.btnCode;
			    params.operationName=item.btnName;
			  }
			})
			let params1 = {
			  data: {
			    ...params
			  }
			}
			saveAndUpdateQuestionTask(params1).then(res => {
			  if (res.status == 200) {
					uni.showToast({
					  title: '操作成功',
					  duration: 1000,
					  icon: 'success'
					})
			    this.rateShow=false;
			    setTimeout(function () {
			      self.loadmore()
			    }, 1000)
			  }else{
			    uni.showToast({ title: res.message, icon: 'none' })
			  }
			})
		},
    scrolltolower() {},
    loadmore() {
      const { COMPLANY_ID, MEMBER_ID, O_USER_INFO } = this.$constant;
      const userInfo = util.storageAction({ key: O_USER_INFO, action: 'get' });
      var params = {
        data: {
          companyId: util.storageAction({ key: COMPLANY_ID, action: 'get' }),
          memberId: util.storageAction({ key: MEMBER_ID, action: 'get' }),
          houseinfoId: '',
          contactPhone: userInfo.phoneNumber || '',
          taskStates: this.tabIndex, //（传1查询未完成，传2查询已完成）
        },
      };
      getCrmTaskListByMemberId(params).then((result) => {
        if (result.status == 200) {
          this.dataList = result.data;
        }
      });
    },
    formatDate(createTime) {
      let t = '';
      if (createTime) {
        t = dayjs(createTime).format('YYYY-MM-DD HH:mm:ss');
      }
      return t;
    },
    state(key) {
      let state = '';
      //  0:待派单、1:待接单  2:处理中、3:待确认、4:已关闭  5：已暂停 6：待审核
      switch (key) {
        case 0:
          state = '待派单';
          break;
        case 1:
          state = '待接单';
          break;
        case 2:
          state = '处理中';
          break;
        case 3:
          state = '待确认';
          break;
        case 4:
          state = '已关闭';
          break;
        case 5:
          state = '已暂停';
          break;
        case 6:
          state = '待审核';
          break;
        default:
          break;
      }
      return state;
    },
    contact(item) {
      if (item.serviceTel) {
        uni.makePhoneCall({
          phoneNumber: item.serviceTel.toString(), //电话号码
          success: function (e) {
            console.log(e);
          },
          fail: function (e) {
            console.log(e);
          },
        });
      } else {
        this.$refs.uToast.show({ message: '暂无联系方式' });
      }
    },
  },
};
</script>
<style scoped lang="scss">
.page {
  background: #f5f5f5;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.tabs-wrap {
  background: #ffffff;
}
.list-wrap {
  flex: 1;
  overflow: auto;
}
.list-box {
  background: #ffffff;
  margin: 20rpx;
  border-radius: 16rpx;
  padding: 20rpx;
}

.repair_text {
  font-size: 13px;
  color: #666666;
  opacity: 0.99;
}

.repair_state {
  font-size: 13px;
  color: var(--app-primary-color);
  opacity: 1;
}

.btn-box {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

::v-deep .u-form-item__body {
  padding: 10rpx 0;
}

.nodata {
  margin-top: 20rpx;
  height: calc(100vh - 120rpx);
  background: url('@/static/theme-default/multiplexing/tips.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: 175px;
  position: relative;
  background-position: center 25%;
  background-color: #ffffff;
}
.nodata::after {
  content: '暂无数据~';
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
.rateMax{
	width: 300px;
	background-color: #FFFFFF;
	border-radius: 10rpx;
	.rate-title{
		border-bottom: 2rpx solid #e8eaec;
		padding: 30rpx;
		text-align: center;
	}
	.rate-rt{
		padding: 100rpx 25%;
		border-bottom: 2rpx solid #e8eaec;
	}
	.rate-btn{
		line-height: 80rpx;
		height: 80rpx;
		width: 100%;
		background-color: #fff;
		font-size: 28rpx !important;
		color: #333333;
		::v-deep .u-row{
			margin: 0 !important;
		}
		.hdCellCenter {
		  text-align: center !important;
		  padding: 0 !important;
			
		}
		.leftBtn {
		  color: var(--app-primary-color);
			background-color: #FFFFFF;
			text-align: center;
		}
		.rightBtn {
		  background: var(--app-primary-color);
		  color: #ffffff;
			text-align: center;
		}
		
	}
}
::v-deep .u-popup{
	flex: 0 !important;
}
</style>
