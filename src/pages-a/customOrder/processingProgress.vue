<style scoped lang="scss">
  .processing-progress {
    // position: relative;
    .com-w {
      margin: 0 auto;
      width: 670rpx;
      .repair-status{
        @include flx-dsp(space-evenly, flex-start,column);

         view text:first-child{
           display:inline-block;
           width: 130rpx;
          font-size: 28rpx;
          color: #333;
        }
        view text:last-child{
          font-size: 28rpx;
          color: #666;
        }
      }
    }
    &-head {
      background-color: #fff;
      & > view:nth-child(1) {
        padding: 30rpx 0 20rpx 0;
        border-bottom: 1px solid rgba(245, 240, 240, 1);;
        .service-no {
          line-height: 60rpx;
          @include flx-dsp($jsc: flex-start, $ali: center);
          & > view:nth-of-type(1) {
            width: 180rpx;
            text-align: left;
            font-size: 28rpx;
            color:#333;
          }
          & > view:nth-of-type(2) {
            flex: 1;
            text {
              font-size: 28rpx;
              color: #666;
            }
            @include flx-dsp($jsc: space-between, $ali: center);
          }
        }
        .problem-desc {
          @include flx-dsp($jsc: flex-start, $ali: flex-start);
          & > view:nth-child(1) {
            width: 180rpx;
            text-align: left;
            font-size: 28rpx;

          }
          & > view:nth-child(2) {
            flex: 1;
            line-height: 45rpx;
            font-size: 28rpx;
            color: #666;
            word-wrap: break-word;
            word-break: break-all;
          }
          text {
            font-size: 28rpx;
          }
        }
        .problem-image {
          margin-top:30rpx;
          .img-swp {
            width: 100%;
						display: flex;
            // ::v-deep .swiper-wrapper {
            //   width: auto;
            // }
            .img-ele {
              width: 100rpx;
              height: 100rpx;
              border-radius: 6px;
							margin: 0 10rpx;
            }
          }
          & > view:nth-of-type(2) {

          }
        }
      }
      & > view:nth-child(2) {
        padding: 30rpx 0 30rpx 0;
        @include flx-dsp($jsc: flex-start, $ali: flex-start);
        .server-wr {
          width: 180rpx;
          @include flx-dsp($jsc: flex-start, $ali: flex-start, $drt: column);
          & > view {
            // .repair-Tel1{
            //   content: url('~@/assets/images/mine/service_icon2.png');
            // }
            .cenBox{
              width:110rpx;
              height:110rpx;
              display:flex;
              align-items: center;
              justify-content: center;
              image{
                width: 80rpx;
								height: 80rpx;
              }
            }
            width: 150rpx;
            @include flx-dsp($jsc: center, $ali: center, $drt: column);
            & > img {
              width: 110rpx;
            }
            & > button {
              padding: 5rpx 15rpx;
              background: var(--app-primary-color);
              border-radius: 50rpx;
              color: #fff;
              font-size: 24rpx;
							line-height: unset;
            }
						& > button::after{
							border: none;
						}
          }
        }
        & > view:nth-child(2) {
          // margin-top: .15rpx;
          flex: 1;
          view {
            text {
              color: var(--app-primary-color);
            }
            color: #666;
            font-size: 28rpx;
          }
          & > view:nth-child(2) {
            margin-top: 10rpx;
          }
        }
      }
    }
    .progress-wr {
      margin: 0 auto;
      width: 597rpx;
      height: 150rpx;
      @include flx-dsp($jsc: center, $ali: center, $drt: column);
      & > view:nth-of-type(1) {
        width: 100%;
        @include flx-dsp($jsc: space-between, $ali: center);
        text {
          color: #666;
          font-size: 28rpx;
        }
      }
      & > view:nth-of-type(2) {
        margin-top: 22rpx;
				// width: 520rpx;
        @include flx-dsp($jsc: center, $ali: center);
				.progress-line {
				  width: 230rpx;
				  height: 1px;
				  background-color: #ddd;
				}
        .crc {
          .child-crc {
            &.active {
              background-color: var(--app-primary-color);
            }
            display: block;
            background-color: #ddd;
            width: 20rpx;
            height: 20rpx;
            border-radius: 50%;
          }
        }
      }
    }
    .flow-wr {
      padding: 18px 50rpx;
      box-sizing: border-box;
      background-color: #fff;
      .flow-item {
        @include flx-dsp($jsc: flex-start, $ali: flex-start);
        &-l {
          margin-right: 30rpx;
          padding:5px 0;
          @include flx-dsp($jsc: center, $ali: center, $drt: column);
          & > text {
            &.active {
              background-color: var(--app-primary-color);
            }
            display: block;
            background-color: #ddd;
            width: 20rpx;
            height: 20rpx;
            border-radius: 50%;
          }
          view {
            width: 1px;
            height: 200rpx;
            background-color: #ddd;
          }
          view.done {
            display: none;
          }
        }
        &-r {
          view, view, .phone{
            color: #666;
            /*line-height: .5rpx;*/
            font-size: 28rpx;
          }

          text {
            color: #aaa;
            font-size: 24rpx;
          }
          
          .finish-image {
            margin-top:30rpx;
            .img-swp {
              width: 100%;
              display: flex;
              // ::v-deep .swiper-wrapper {
              //   width: auto;
              // }
              .img-ele {
                // width: 100%;
                width: 100rpx;
                height: 100rpx;
                border-radius: 6px;
							  margin-left:  10rpx;
              }
            }
            & > view:nth-of-type(2) {

            }
          }
        }
      }
    }
    .no-flow {
      color: #aaa;
      font-size: 28rpx;
      text-align: center;
      line-height: 100rpx;
      background-color: #fff;
    }
    .evaluate-btn {
      position: fixed;
      width: 100%;
      /* background-color:#f6f7f9; */
      bottom: 0;
      padding: 30rpx 0;
      @include flx-dsp($jsc: center, $ali: center);
      & > button {
        min-width: 250rpx;
				font-size: 28rpx;
				height: 70rpx;
        padding: 15rpx 80rpx;
        background: var(--app-primary-color);
        border-radius: 48rpx;
				@include flx-dsp($jsc: center, $ali: center);
        color: #fff;

      }
    }
  }
  .setBottom{
		width: 100%;
		height: 40rpx;
	}
  button::after {
    border: none;
  }
</style>

<template>
  <view class="reportingRorRepairs" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
    <view class="processing-progress">
      <view class="processing-progress-head">
        <view class="com-w">
          <view class="service-no">
            <view>服务单号</view>
            <view>
              <text>{{orderData.serviceNo}}</text>
            </view>
          </view>
          <view class="problem-desc">
            <view>问题描述</view>
            <view>{{orderData.problemDesc}}</view>
          </view>
          <view class="problem-image" v-if="problemImage.length">
						<view class="img-swp">
							<view v-for="(img, index) in problemImage" :key="index">
								<!-- <image class="img-ele" :src="img.src" @click="previewImage(img.src)"></image> -->
								<image class="img-ele" :src="img.src" @click="previewImage(index)"></image>
							</view>
						</view>
          </view>
        </view>
        <view class="com-w">
          <view class="server-wr">
            <view>
              <view class="cenBox">
                <image :src="serveIcon"></image>
              </view>
              <button @click="dialTel">联系客服</button>
            </view>
          </view>
           <view  v-if="orderData.progressValue==2" class="repair-status">
            <view>
              <text>工单状态</text> <text>已完成</text>
            </view>
            <view>
              <text>完成日期</text> <text>{{finishedTime}}</text>
            </view>
          </view>
          <view v-else>
            <view>
             距离下单时间 <text style="font-size: 28rpx;margin-left: 5px;">{{orderData.finishedTime}}</text>
            </view>
            <view>
              {{orderInfo}}
            </view>
          </view>
        </view>
      </view>
      <view style="background-color: #f6f7f9;">
        <view class="progress-wr">
          <view>
            <text>提交任务</text>
            <text> 处理中</text>
            <text>已完成</text>
          </view>
          <view>
            <view class="crc">
              <view class="active child-crc"></view>
            </view>
            <view class="progress-line"></view>
            <view class="crc">
              <view class="child-crc" :class="{'active': orderData.progressValue >= 1}"></view>
            </view>
            <view class="progress-line"></view>
            <view class="crc">
              <view class="child-crc" :class="{'active': orderData.progressValue === 2}"></view>
            </view>
          </view>
        </view>
      </view>
      <scroll-view scroll-y :height="scrollerHeight" style="padding-bottom:80rpx">
        <view>
          <view v-if="progressList.length" class="flow-wr">
            <view class="flow-item" v-for="(item, index) in progressList" :key="index">
              <view class="flow-item-l">
                <text class="active"></text>
                <view :class="{'done': item.done}" v-if="index+1<progressList.length"></view>
                <!-- <text class="active" v-if="orderData.progressValue === 2 && index + 1 == progressList.length "></text> -->
              </view>
              <view class="flow-item-r">
                <view v-html="item.desc"></view>
                <view v-if="item.mtainUserName">维修师傅: {{item.mtainUserName}}; 联系方式: <text class="phone" @click="callMtainUserPhone(item)" style="margin-left:2px">{{item.mtainUserPhone}}</text></view>
                <view class="finish-image" v-if="item.finishFiles">
									<view class="img-swp">
										<view v-for="(img, imgIndex) in item.finishFiles" :key="imgIndex">
											<image class="img-ele" :src="img" @click="previewFinishImage(item.finishFiles, imgIndex)" ></image>
										</view>
									</view>
                </view>
                <text class="time">{{item.time}}</text>
              </view>
            </view>
          </view>
          <view v-else class="no-flow">暂无工单流程记录~</view>
        </view>
      </scroll-view>
      <view class="evaluate-btn">
        <button  v-show="(visitState == 1 || visitState == 6 ) && orderData.progressValue === 2" @click="toEvaluatePage(0)">评价</button>
        <button style="border-color:transparent;"  v-show="visitState==2" @click="toEvaluatePage(1)">查看评价</button>
      </view>
      <!-- v-if="orderData.finished" -->

    </view>
    <!-- <view v-transfer-dom>
      <previewer :list="finishImages" ref="finishImagPreviewer"></previewer>
    </view> -->
		<view class="setBottom"></view>
  </view>

</template>

<script>
  import {getReturnVisitRecordById} from '@/service/returnVisit.js';
  import commLogic from '@/js/comm-logic';
  // import { controlFunction } from "@/assets/js/mixin.js";

  // import 'swiper/dist/css/swiper.css';
  // import {swiper, swiperSlide} from 'vue-awesome-swiper';
	import {
		DOMParser
	} from 'xmldom'
	import { feedBackOrderDetailToJson,feedBackTrackNew } from '@/service/landcrm.js';
  import { findOwnerTaskProgress } from '@/service/wycrm60'

  export default {
    name: "processingProgress",
    data() {
      return {
        projectName:process.env.currProjectName || '',
        finishedTime:'',
        swiperOption: {
          slidesPerView: 6,
          freeMode: true,
        },
        problemImage: [],
        orderData: {},
        orderDataT: {
          serviceNo: '一碑测试20191200013',
          problemDesc: '测试',
          latestStatus: '您的服务单已经维修完成',
          servicePhone: '18201634535',
          progressValue: 2,
          createTime: '2019-12-10 14:23:30',
          finishedTime: '2019-12-16 16:59:29',
          finished: true
        },
        progressList: [],
        progressListT: [
          {
            time: '2019-12-10 14:23:30',
            desc: '您的服务单已提交成功，客服人员将及时处理。提交人：客服经理-一碑',
            done: false
          },
          {
            time: '2019-12-16 16:59:29',
            desc: '您的服务单已经维修完成',
            done: true
          }
        ],
        orderId: '',
        visitState: '',
        scrollerHeight: '300rpx',
        timer: '',
				
				
        // theme:localStorage.theme,
        finishImages: [],
        orderInfo: '您的服务订单已成功提交，客服人员将及时处理',
				options:{}
      }
    },
		onLoad(options) {
		  // this.addcolor();
			this.options = options
      // this.getQuery();
		  // this.initData();
      // uni.$on('refreshData',()=>{
      //   this.getQuery();
		  //   this.initData();
      // })
		},
    onShow(){
      this.getQuery();
		  this.initData();
    },
    onShareAppMessage(res) {
  	  return {
  	    title: '处理进度',
  	    path: '/pages-a/repair/processingProgress?arg='+this.options.arg
  	  }
  	},
		computed:{
			serveIcon(){
				return `${this.IMG_BASE_URL}/static/${this.THEME_NAME}/multiplexing/service_icon.png`
			}
		},
    // mixins: [controlFunction],
    methods: {
      // 获取参数
      getQuery() {  
        const {arg,orderId:optsOrd} = this.options;
        if(optsOrd){
          this.orderId = optsOrd;
        }else{
          const {orderId} = arg && JSON.parse(decodeURIComponent(arg)) || {};
          if (orderId) this.orderId = orderId;
        }
				
       
      },
      // 预览图片
      // previewImage(url) {
      //   // this.$refs.previewer.show(index);
      //   // 当前图片在 预览图片数组中的索引
       
			// 	uni.previewImage({
			// 		urls:[url],
			// 	})
       
      // },

      previewImage(index) {
        // this.$refs.previewer.show(index);
        // 当前图片在 预览图片数组中的索引
        console.log(index);
      uni.previewImage({
        current: index,
        urls: this.problemImage.map(img => img.src)
      })
       
      },
      // 预览修改完成图片
      previewFinishImage(images, index) {
        this.finishImages = images.map(item => {
          return item
        });
        // this.$nextTick(() => {
        //   this.$refs.finishImagPreviewer.show(index);
        // })
				uni.previewImage({
          current: index,
					urls:this.finishImages
				})
      },
      // 拨打电话
      async dialTel() {
        const {servicePhone: tel} = this.orderData;
        if (tel) {
          const { code } = await commLogic.permissionCheckAndAlert({permissionKeys: ['callPhone']})
					if (code !== 1 && code !== -2) return
					uni.makePhoneCall({
						phoneNumber:tel
					})
				}else{
						uni.showToast({ title: "联系号码为空，暂时无法联系", icon: 'none' })
        }
      },
      //
      feedBackOrderDetails() {
        // this.$vux.loading.show({text: '加载中...'});
        /*
        const pms = new Promise((resolve) => {
          setTimeout(_ => {
            const d1 = {
              "data": {
                "acceptDate": "",
                "serviceType": "",
                "cpType": "",
                "orderId": "aebb0234-ce7c-4407-93b0-85e18ee461ce",
                "appointmenTime": "",
                "managerName": "客服经理-一碑",
                "type": "",
                "distributeDate": "",
                "isDistribute": "",
                "linkName": "有钱人",
                "sendMoney": "",
                "sellerId": "",
                "evaluationLink": "",
                "reviews": "",
                "managerTel": "18201634535",
                "price": "",
                "payment": "",
                "state": "已关闭",
                "dealFilePath": "",
                "totalMoney": "",
                "couponsMoney": "",
                "acceptance": "",
                "materials": "",
                "ifPay": "",
                "projectName": "",
                "asState": "",
                "closeStatus": 0,
                "sellerName": "",
                "couponsId": "",
                "orderNum": "一碑测试20191200013",
                "linkTel": "13268214337",
                "matterType": "",
                "houseName": "",
                "abnormityCloseStatus": 0,
                "serviceId": "",
                "createDate": "2019-12-10 14:23:30",
                "address": "一碑测试项目-1栋-3-3-101",
                "moduleType": "",
                "filePath": "",
                "stateId": "4",
                "closeType": "正常关闭",
                "serviceName": "默认报事",
                "userId": "2bd2b6f3-b72b-4969-b5f9-3963e0939d5d",
                "buildingId": "0f82d296-60c5-46ae-821c-c3de1df63a6c",
                "isReturnCall": "",
                "closeDate": "",
                "money": "",
                "crmFilePath": "",
                "anonymous": "",
                "callBackState": 0,
                "remarks": "测试"
              },
              "questionnaireId": 146,
              "message": "",
              "status": 1
            };
            resolve(d1)
          }, 500)
        });
        */
			 let params = {
				 data:{
          quesTaskId: this.orderId
				 },
				 hideLoading:true
			 }
        const pms = findOwnerTaskProgress(params);
        return pms.then(res => {
          // this.$vux.loading.hide();
					console.log(res,"res")
          if (res.status == 200) {
            const {remarks, state, orderNum, filePath = '', managerTel} = res.data;
            const pv = state === '处理中' || state === '已暂停' ? 1 :  state === '已协商' || state === '已协商沟通' || state === '待确认' || state === '已完成' || state === '已关闭' ? 2 : -1;

            console.log(pv, '===')
            const obj = {
              serviceNo: orderNum,
              problemDesc: remarks,
              servicePhone: managerTel,
              progressValue: pv,
            };
            Object.assign(this.orderData, obj);
            console.log("结果",this.orderData)

            // 问题图片
            const imgLength = filePath.trim().length;
            if (imgLength) {
              this.problemImage = []
              filePath.split(',').forEach(url => {
                this.problemImage.push({msrc: url, src: url})
              })
            }
            this.$forceUpdate();
            this.visitId = res.data.visitId;
						console.log(this.visitId,"this.visitId")
            this.getReturnVisitRecord();
          } else {
						this.$refs.elMessage.open({ message:'图片'+res.msg,position: 'bottom'})
          }
        }).catch(_ => {
          // this.$vux.loading.hide()
        })
      },
			//xml解析
			xmlParse(xmldata){
				const doc = new DOMParser().parseFromString(xmldata, 'text/xml')
				let allResult = doc.documentElement.getElementsByTagName('result')
				let list = []
				for(let i = 0;i<allResult.length;i++){
					let obj = {}
					for(let j = 0;j<allResult[i].childNodes.length;j++){
							if(!!allResult[i].childNodes[j].firstChild){
								obj[allResult[i].childNodes[j].nodeName] = allResult[i].childNodes[j].firstChild.data
							}
					}
					list.push(obj)
				}
        return list
			},
      //获取进度
      feedBackTrackNew() {
        // this.$vux.loading.show({text: '加载中...'});
        /*
        const pms = new Promise((resolve) => {
          setTimeout(_ => {
            const xml1 = `<list>
                            <result>
                              <trackDesc>您的服务单已提交成功，客服人员将及时处理。提交人：客服经理-一碑</trackDesc>
                              <recordDesc>测试</recordDesc>
                              <followUpProcessorTel />
                              <quesState>待派单</quesState>
                              <recordType>新增任务</recordType>
                              <submitDate>2019-12-10 14:23:30</submitDate>
                              <followUpProcessorName />
                              <creatorName>客服经理-一碑</creatorName>
                              <recordState>0</recordState>
                            </result>
                            <result>
                              <trackDesc>您的服务单已经维修完成。</trackDesc>
                              <recordDesc>正常关闭</recordDesc>
                              <followUpProcessorTel />
                              <quesState>维修完成</quesState>
                              <recordType>关闭任务</recordType>
                              <submitDate>2019-12-16 16:59:29</submitDate>
                              <followUpProcessorName />
                              <creatorName>管理员</creatorName>
                              <recordState>4</recordState>
                            </result>
                          </list>`;
            resolve(xml1)
          }, 500)
        });
        */
			 let params = {
				 data:{
					 quesTaskId:this.orderId
				 },
				 hideLoading:true
			 }
       this.progressList = []
        const pms = findOwnerTaskProgress(params), self = this;
        return pms.then(result => {
          // this.$vux.loading.hide();
          const dataObj = result.data || {}
          const list = dataObj.recordList || []

            if (Array.isArray(list)) {
							// console.log('list------------',list)
              // trackState 没有就是处理完  
              list.forEach((item, index) => {
                const {submitDate, trackDesc, trackState, mtainUserName, mtainUserPhone, finishFiles} = item;

                if (index === 0) {
                  this.orderData.createTime = submitDate;
                  this.orderData.latestStatus = trackDesc;
                  this.orderData.finished = trackState === undefined;
                  this.timer = setInterval(() => {
                    self.$set(self.orderData, 'finishedTime',  self.hoursOfUse(submitDate));
                  }, 1000);
                  this.finishedTime = this.$cmMth.formatDate({ type: 's2d', value: submitDate, format: 'YY-MM-DD' })
                }
                else if (index == list.length - 1) {
                  this.orderData.latestStatus = trackDesc;
                  this.orderData.finished = trackState === undefined;
                  this.timer = setInterval(() => {
                    self.$set(self.orderData, 'finishedTime',  self.hoursOfUse(submitDate));
                  }, 1000);
                  this.finishedTime = this.$cmMth.formatDate({ type: 's2d', value: submitDate, format: 'YY-MM-DD' })
                }
                const progress = {
                  time: submitDate,
                  desc: trackDesc,
                  done: trackState === undefined,
                  mtainUserName,
                  mtainUserPhone,
                  finishFiles: finishFiles?finishFiles.split(','): [],
                };
                this.progressList.push(progress);
              });
              if(this.progressList.length > 1){
                this.orderInfo = this.progressList[this.progressList.length -1].desc;
              }
            } else {
              const {submitDate, trackDesc, trackState} = list;
              console.log(trackState, 'trackState')
              this.orderData.createTime = submitDate;
              this.orderData.latestStatus = trackDesc;
              this.orderData.finished = trackState === undefined;
              this.timer = setInterval(() => {
                // self.orderData.finishedTime = self.hoursOfUse(submitDate);
                self.$set(self.orderData, 'finishedTime',  self.hoursOfUse(submitDate));
              }, 1000);
							// console.log(this.$cmMth.formatDate({ type: 's2d', value: submitDate, format: 'YY-MM-DD' }),"this.$cmMth.formatDate({ type: 's2d', value: new Date().getTime() })")
              this.finishedTime = this.$cmMth.formatDate({ type: 's2d', value: submitDate, format: 'YY-MM-DD' })
              const progress = {
                time: submitDate,
                desc: trackDesc,
                done: trackState === undefined
              };

              this.progressList.push(progress);
            }

          
        })
      },
			// 解析XML
			parseXml(data,keyName,keyName1,keyName2) {
			  let text = '';
			  if (typeof data === 'string') {
			    const [path] = data.match(keyName) || [];
			    text = typeof path === 'string' && path.replace(keyName1, '').replace(keyName2, '');
			  }
				return text
			},
      // 处理时间
      hoursOfUse(submitDate) {
        const {createTime, finished} = this.orderData;
        const currentTime = new Date().getTime();
        const startTime = this.$cmMth.formatDate({ type: 'd2s', value: createTime })
        const endTime = finished ? this.$cmMth.formatDate({ type: 'd2s', value: submitDate }) : currentTime;
        const second = (endTime - startTime) / 1000;
        let days = 0, h = 0, m = 0, s = 0;
        days = Number.parseInt(second / 60 / 60 / 24);
        h = Number.parseInt(second / 3600) % 24;
        m = Number.parseInt(second / 60) % 60;
        s = Math.floor(second % 60);
        return `${days ? days + '天' : ''}${h ? h + '小时' : ''}${m ? m + '分钟' : ''}${s ? s + '秒' : ''}`
      },
      // 去评价
      toEvaluatePage(n) {
        // this.$router.push({path: '/returnVisitQuestionnaireDetail', query: {visitId:this.visitId,type:1}});
				uni.navigateTo({
					url:'/pages-a/repair/returnVisitQuestionnaireDetail?visitId='+this.visitId+'&type=1'
				})
      },
      // 初始化数据
      async initData() {
        await this.feedBackOrderDetails().then(data => [null, data]).catch(err => {
          return [err, null]
        });
        this.feedBackTrackNew();
      },
      getReturnVisitRecord() { //查询不成功回访的列表
        var self = this;
        getReturnVisitRecordById({visitId : self.visitId}).then(res => {
          if(res.status == '200') {
            self.visitState = res.data.visitState;
          }
          // var scrollerHeightInt = document.documentElement.clientHeight - $('.processing-progress-head').innerHeight() -$('.progress-wr').innerHeight() - $('.evaluate-btn').innerHeight() -36;  //36为 .flow-wr 
          // this.scrollerHeight = `${scrollerHeightInt}px`;
        })
      },

      async callMtainUserPhone(item){
				if (item.mtainUserPhone){
          const { code } = await commLogic.permissionCheckAndAlert({permissionKeys: ['callPhone']})
					if (code !== 1 && code !== -2) return
					uni.makePhoneCall({
						phoneNumber:item.mtainUserPhone
					})
				}
      },
    },
    onUnload() {
      clearInterval(this.timer);
    },
  }
</script>


