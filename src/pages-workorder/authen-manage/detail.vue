<style scoped lang="scss">
.page {
  box-sizing: border-box;
  background-color: #F3F4F7;
  width: 100%;
  height: 100%;
  padding: 24rpx 0;
}

.page-box {
  height: calc(100% - 80rpx);
  overflow: auto;
  margin: 0 20rpx;
}

.content {
  background: #FFFFFF;
  border-radius: 12rpx;

  .item-title {
      display: flex;
      padding: 24rpx 30rpx;
      justify-content: space-between;



      .item-caption {
          font-size: 30rpx;
          font-family: PingFang SC;
          font-weight: bold;
          color: #222222;

          .textred {
              color: red;
          }
      }

      .item-status {
          font-size: 28rpx;
          color: #33BA73;
          width: 20%;
          padding-top: 2px;
          text-align: right;
          display: inline-block;
          white-space: nowrap;
      }
  }

  .item-content {
      padding: 12rpx 30rpx;

      font-size: 30rpx;
      font-weight: bold;
      color: #222222;
  }

  .item-tag {
      padding: 12rpx 30rpx;

      display: flex;

      .tags {
          font-size: 22rpx;
          color: #2761FF;
          margin: 0 10rpx 0 0;
          padding: 10rpx;
          text-align: center;
          background: rgba(39, 97, 255, 0.1);
          border-radius: 4rpx;
      }

  }

  .item-addr {
      padding: 24rpx 30rpx;
      font-size: 26rpx;
      color: #999999;

  }
}

.progress {
  background: #FFFFFF;
  border-radius: 12rpx;

  .progress-title {
      padding: 24rpx 30rpx;
  }

  .progress-content {
      .pc-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10rpx 30rpx;
          font-size: 28rpx;
          // height: 38px;

          .pc-name {
              color: #666666;
              margin-right: 10rpx;
          }

          .pc-val {
              color: #2761FF;
          }

          .pc-name-val {
              color: #666666;
          }

          .pc-Status {
              color: #33BA73;
              display: inline-block;
              white-space: nowrap;

          }

          .colorB {
              color: #2761FF;
          }
      }
  }
}

.log {
  background: #FFFFFF;
  border-radius: 12rpx;
  padding: 24rpx 30rpx;

  .log-title {
      font-size: 30rpx;
      font-weight: bold;
      line-height: 60rpx;
      color: #333333;
  }
}

.logLeft {
  position: absolute;
  left: -80px;
  text-align: center;
}

.logcell1 {
  font-size: 28rpx;
  color: #333333;
  // padding: 16rpx 0;
  min-height: 60rpx;
}

.logcell2 {
  // margin-bottom: 40rpx;
  font-size: 26rpx;
  color: #999999;
  min-height: 60rpx;

  .text {
      width: 450rpx;
      word-break: break-all;
  }

  .logUrl {
      color: #2761FF;

      image {
          width: 140rpx;
          height: 140rpx;
      }
  }
}

.log-steps {
  margin-left: 80px;
  margin-top: 20rpx;
}

.page-footer {
  color: #2761FF;
  height: 100rpx;
  line-height: 100rpx;
  flex: 0 0 100rpx;
  background-color: #FFFFFF;
  font-size: 30rpx;
  display: flex;
  justify-content: space-around;
  align-items: center;

  .footer-img {
      height: 32rpx;
      width: 32rpx;
      margin: 0 10rpx 0 0;
  }

  view {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 65%;
  }

  .view-border {
      border-left: 1px solid #F3F4F7;
      border-left: 1px solid #F3F4F7;
  }

}

::v-deep .u-steps {
  .u-steps-item__wrapper {
      height: 20rpx;
  }

  .u-steps-item:first-child {
      .u-steps-item__line {
          background: #2761FF !important;
          ;
      }
  }
}
.detail-pd{
	width: 710rpx;
	margin: 0 20rpx;
	background: #fff;
	border-radius: 10rpx;
	.title{
		display: flex;
		align-items: center;
		height: 100rpx;
		padding-left: 30rpx;
		font-size: 30rpx;
		font-weight: bold;
		border-bottom: 1px solid #EBEBEB;
	}
	.all-txt{
		width: 100%;
		box-sizing: border-box;
		padding:22rpx 0 22rpx 30rpx;
		.box{
			padding: 8rpx 0;
			display: flex;
			align-items: center;
			.box-l{
				font-size: 28rpx;
				width: 150rpx;
				color: #333;
			}
			.box-r{
				color: #333;
				font-size: 28rpx;
			}
		}
	}
}
.tree-btn{
	width: 100%;
	box-sizing: border-box;
	padding: 0 30rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	position: fixed;
	bottom: 50rpx;
	left: 0;
	.btns-c{
		width: 330rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1px solid #2761FF;
		border-radius: 10rpx;
		height: 80rpx;
		color: #2761FF;
		cursor: pointer;
	}
	.btns-d{
		width: 330rpx;
		height: 80rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #2761FF;
		color: #fff;
		border-radius: 10rpx;
		cursor: pointer;
	}
}
.center-flex{
	justify-content: center;
}
</style>
<!--  -->
<template>
  <view class='page' v-if="loading" :style="[THEME_CSS_VAR]">
      <workorder-authen v-for="(item, index) in dataList" :key="index" :data="item" :hiddenBottom="false"/>
      <view class="detail-pd">
      	<view class="title">认证信息</view>
				<view class="all-txt">
					<view class="box">
						<view class="box-l">区域名称:</view>
						<view class="box-r">{{allData.areaName}}</view>
					</view>
					<view class="box">
						<view class="box-l">项目名称:</view>
						<view class="box-r">{{allData.projectName}}</view>
					</view>
					<view class="box">
						<view class="box-l">姓名:</view>
						<view class="box-r">{{allData.ownerName || allData.nickname}}</view>
					</view>
					<view class="box">
						<view class="box-l">性别:</view>
						<view class="box-r">{{allData.ownerSex | getSexText}}</view>
					</view>
					<view class="box">
						<view class="box-l">联系方式:</view>
						<view class="box-r">{{allData.ownerCalls}}</view>
					</view>
					<view class="box">
						<view class="box-l">登记时间:</view>
						<view class="box-r">{{allData.createDate}}</view>
					</view>
					<view class="box">
						<view class="box-l">属性:</view>
						<view class="box-r">{{allData.houseState | getHouseStateText}}</view>
					</view>
					<view class="box">
						<view class="box-l">来源:</view>
						<view class="box-r">{{allData.sourceName}}</view>
					</view>
					<view class="box">
						<view class="box-l">详细地址:</view>
						<view class="box-r">{{allData.detailAddress}}</view>
					</view>
					<view class="box">
						<view class="box-l">证件类型:</view>
						<view class="box-r">{{allData.ownerCardType}}</view>
					</view>
					<view class="box">
						<view class="box-l">证件号码:</view>
						<view class="box-r">{{allData.idNumber}}</view>
					</view>
				</view>
      </view>
      <view v-if="allData.authBuilding == '1'">
			<view class="tree-btn" v-if="allData.authState == 2">
				<view class="btns-c" @click="rejectThat">拒绝</view>
				<view class="btns-d" @click="agreeThat">同意</view>
			</view>
			<view class="tree-btn center-flex" v-else>
				<view class="btns-c" v-if="allData.authState == 1" @click="cancelThat">取消认证</view>
				<view class="btns-c" v-if="allData.authState == 3 || allData.authState == 4" @click="againThat">重新认证</view>
			</view>
      </view>
      <u-modal :show="agreeShow" content="确定要同意认证申请吗？" showCancelButton @confirm="agreeThatCheak"
          @cancel="agreeShow = false" />
      <u-modal :show="againShow" content="确定要重新认证吗？" showCancelButton @confirm="againThatCheak"
          @cancel="againShow = false" />
  </view>
</template>

<script>
import OpinionModel from '@/pages/modules/opinion-model.vue'
import { getEarlyWarningDetailById, getLogList } from '@/service/wechatguanjia';
import { findQuestionTaskList } from '@/service/landcrm'
import utils from '@/js/utils';
import WorkorderAuthen from '@/pages-workorder/modules/workorder-authen.vue'
import { approvalAuthCommBg,reApprove,cancelApproveBg } from '@/service/community'
export default {
  data() {
      return {
          value1: 0,
          logCurrent: 0,
          logList: [],
          recordId: '',
          taskDetail: {},
          closeShow: false,
          reportShow: false,
          orderList: [],
          loading: false,
          isRefresh: false,
          dataList:[],
					allData:{
						
					},
					agreeShow:false,
					againShow:false,
      };
  },
  components: {
    WorkorderAuthen,
    OpinionModel
  },
  computed: {
      getTypeStyle() {
          switch (this.taskDetail.warningStatus) {
              case '0':
                  return {
                      color: '#FA6400',
                      id: 0
                  }
              case '1':
                  return {
                      color: '#2761FF',
                      id: 1
                  }
              case '2':
                  return {
                      color: '#33BA73',
                      id: 2
                  }
              default:
                  return {
                      color: '#33BA73',
                      id: -1
                  }
          }
      }
  },
	filters: {
		getSexText(val) {
			const map = {
				0: '男',
				1: '女'
			}
			return map[val]
		},
		getHouseStateText(val) {
			const map = {
				1: '租户',
				2: '业主',
				3: '家属',
				4: '企业联系人',
				5: '家政',
				6: '企业员工'
			}
			return map[val]
		}
	},
  async onLoad(options) {
			let data = uni.getStorageSync('authen_manage_allData');
			this.allData = JSON.parse(data)
			this.dataList = [this.allData]
			uni.setStorageSync('authen_manage_allData', '');
      setTimeout(() => {
          this.loading = true;
      }, 300);    
  },
  onShow() {
      // 如果是提交状态返回isRefresh=1，才刷新页面，从详情过来无需刷新
      let pages = getCurrentPages();
      let currPage = pages[pages.length - 1];
      let isRefresh = false;
      // #ifdef MP-WEIXIN
      isRefresh = currPage.data.isRefresh;
      // #endif
      // #ifdef H5 
      isRefresh = currPage._data.isRefresh;
      // #endif
      if (isRefresh) {
          this.loading = false;
          // 重新获取数据
          Promise.all([
              this.getTaskDetail(),
              this.handleLog(),
              this.getOrder()
          ]).then((results) => {
              setTimeout(() => {
                  this.loading = true;

              }, 300);

          })
          // 每一次需要清除，否则会参数会缓存
          // #ifdef H5 
          currPage._data.isRefresh = false
          // #endif
          // #ifdef MP-WEIXIN
          currPage.data.isRefresh = false
          // #endif
      }

  },
  methods: {
		//取消认证
		cancelThat(){
			let tempPicList = this.allData.relateId.split(",")
			let data = {
				tempPicList,
				houseState:this.allData.houseState,
			}
			uni.redirectTo({
				url:'/pages-workorder/authen-manage/cause-remark?type=cancel&reData='+JSON.stringify(data)
			})
		},
		//重新认证
		againThatCheak(){
			this.againShow = false
			let { O_USER_INFO } = this.$constant;
			let userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' });
			let tempPicList = this.allData.relateId.split(",")
			tempPicList.map(item=>{
				let params = {
					data:{
						relateId:item,
						approvalState:1,
						houseState:this.allData.houseState,
					}
				}
				reApprove(params).then(res=>{
					if(res.status == '200'){
						uni.showToast({title:'认证成功',icon:'none'})
						uni.setStorageSync('authen_manage_list_load','1')
						setTimeout(()=>{
							uni.navigateBack()
						},300)
					}else{
						uni.showToast({title:res.message,icon:'none'})
					}
				})
			})
		},
		againThat(){
			this.againShow = true
		},
		//拒绝认证
		rejectThat(){
			let tempPicList = this.allData.relateId.split(",")
			let data = {
				tempPicList,
				houseState:this.allData.houseState,
			}
			uni.redirectTo({
				url:'/pages-workorder/authen-manage/cause-remark?type=reject&reData='+JSON.stringify(data)
			})
		},
		agreeThatCheak(){
			this.agreeShow = false
			let { O_USER_INFO } = this.$constant;
			let userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' });
			let tempPicList = this.allData.relateId.split(",")
			tempPicList.map(item=>{
				let params = {
					data:{
						relateId:item,
						approvalState:1,
						userId: userInfo.userId,
						ownerPhone:userInfo.userAccount,
						houseState:this.allData.houseState,
					}
				}
				approvalAuthCommBg(params).then(res=>{
					if(res.status == '200'){
						uni.showToast({title:'认证成功',icon:'none'})
						uni.setStorageSync('authen_manage_list_load','1')
						setTimeout(()=>{
							uni.navigateBack()
						},300)
					}else{
						uni.showToast({title:res.message,icon:'none'})
					}
				})
			})
			
		},
		//同意认证
		agreeThat(){
			this.agreeShow = true
		},
      formatName(name) {
          return name ? decodeURIComponent(name) : ''
      },
      customFun(obj) {
          if (obj) {
              // 将打印出 { name: '周某某', sex: '女' }
              this.isRefresh = true;
          }
      },
      async getTaskDetail() {
          if (!this.recordId) return

          const params = {
              data: {},
              pathParams: `/${this.recordId}`,
              hideLoading: true
          }
          const res = await getEarlyWarningDetailById(params)
          this.taskDetail = res.data ?? {};
          this.taskDetail.warningContentList = [];
          if (this.taskDetail.warningContent) {
              let warningContent = this.taskDetail.warningContent;
              let key = this.taskDetail.sensitiveWords;
              let list = this.splitStr(warningContent, key)
              // let arr = warningContent.split(key);
              // if (arr[arr.length - 1] == '') {
              //     arr.pop()
              // }
              // let list = []
              // if (warningContent == key) {
              //     list.push('')
              // } else {
              //     for (let index = 0; index < arr.length; index++) {

              //         list.push(arr[index]);
              //         if (index < arr.length - 1 && arr[index] != '') {
              //             list.push('');

              //         }
              //     }
              // }
              this.taskDetail.warningContentList = list;
          }
      },
      splitStr(text, key) {
          let arr = [];
          let keyLength = key.length;
          let index = text.indexOf(key);
          if (index == -1) {
              if(text){
                arr.push(text)
              }
          } else if (index == 0) {
              arr.push(key);
              let str = text.slice(keyLength, text.length);
              let rA = this.splitStr(str, key);
              arr = arr.concat(rA);
          } else if ((index + keyLength) == text.length) {
              // 结尾
              let startVal = text.slice(0, index - 1);
              let endVal = text.slice(index, text.length);
              arr.push(startVal);
              arr.push(endVal);
          } else {
              // 中间部分
              let startVal = text.slice(0, index);
              let endVal = text.slice(index, text.length);
              arr.push(startVal);
              let rA = this.splitStr(endVal, key)

              arr = arr.concat(rA);
          }
          return arr;
      },
      async getOrder() {
          let { O_USER_INFO } = this.$constant;
          let userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' });
          const params = {
              data: {
                  startIndex: 1,
                  pageSize: 5,
                  areaId: '',
                  projectId: this.taskDetail?.projectId ?? '',
                  exportFlag: 0,
                  userId: userInfo.userId,
                  yqWarningId: this.recordId
              },
              hideLoading: true,
              responseToast: false,
          }
          const res = await findQuestionTaskList(params);
          this.orderList = res.data ?? []

      },
      // 操作记录
      handleLog() {
          var params = {
              data: {
                  recordId: this.recordId
              }
          }
          getLogList(params).then(res => {
              if (res.status == 200) {
                  this.logList = res.data;
                  this.logCurrent = res.data && res.data.length > 0 ? (res.data.length - 1) : 0;

              }
          })
      },
      changeDateFormat(val, type) {
          if (val) {
              return utils.formatDate({ type: 's2d', value: val, format: type ? type : 'YYYY-MM-DD HH:mm:ss' })

          }
      },
      identifyText(value) {
          let list = {
              content: '',
              url: []
          };
          if (value && value.indexOf('http') != '-1') {
              let text1 = value.substring(0, value.indexOf('http'));
              let urls = value.substring(value.indexOf('http'), value.length - 1).split(';');
              list.content = text1;
              list.urls = [];
              if (urls.length > 0) {
                  urls.forEach(element => {
                      list.urls.push({ url: element })
                  });
              }
          } else {
              list.content = value;
          }
          return list;
      },
      addOrder() {
          const recordId = this.recordId
          uni.navigateTo({ url: `/pages/workorder/index?recordId=${recordId}` });

      },
      operation(type, pageCode) {
          if (pageCode == 'orderDetail') {
              uni.navigateTo({ url: `/pages-workorder/workorder-detail/detail?taskId=${type.quesTaskId}` });

          } else {
              uni.navigateTo({ url: `/pages-workorder/opinion/earlyWarningModel?recordId=${this.recordId}&type=${type}` });

          }

      }

  },
}
</script>
