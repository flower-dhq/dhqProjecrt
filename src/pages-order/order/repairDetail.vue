<template>
  <view class="page" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
    <view class="form_box">
      <u--form labelPosition="left" labelWidth="80" :labelStyle="{ fontSize: '13px', color: '#333333' }" :borderBottom="false" labelAlign="right" ref="form1">
        <u-form-item label="工单编号">
          <text class="detail_text">{{ orderData.taskCode }}</text>
        </u-form-item>
        <u-form-item label="问题描述">
          <text class="detail_text">{{ orderData.taskDesc }}</text>
        </u-form-item>
        <u-form-item v-if="taskAttachmentList.length > 0">
          <view class="images-wrap">
            <view class="images-item" v-for="(item, index) in taskAttachmentList" :key="index">
              <u--image :src="item.fileUrl" alt="" mode="aspectFill" width="120rpx" height="120rpx" />
            </view>
          </view>
        </u-form-item>
        <u-form-item>
          <view Slot class="cellbox">
            <view class="cell">
              <image :src="require(`@/static/${[THEME_NAME]}/repair/kft.png`)"></image>
              <view class="contactNumber">联系客服</view>
            </view>
            <view>
              <view
                ><text class="detail_text">距离下单时间</text> <text class="detail_time">{{ orderData.finishedTime }}</text>
              </view>
              <view class="detail_text"> {{ quesRecord.length ? quesRecord[0].recordDescCustom : '您的服务订单已成功提交，客服人员将及时处理' }}</view>
            </view>
          </view>
        </u-form-item>
      </u--form>
    </view>
    <view class="detail-steps1">
      <uni-steps active-color="var(--app-primary-color)" active-icon="smallcircle-filled" :options="[{ title: '提交任务' }, { title: '处理中' }, { title: '已完成' }]" :active="orderData.progressValue"></uni-steps>
    </view>

    <view class="detail-steps">
      <u-list height="auto">
        <u-list-item v-for="(item, index) in progressList" :key="index">
          <view class="flow-item">
          <view class="flow-item-l">
            <view class="active"></view>
            <view class="done" v-if="index < progressList.length - 1"></view>
          </view>
          <view class="steps-concent">
            <view class="steps-text">{{ item.desc }}</view>
            <!-- <view class="steps-text">{{ item.recordDesc }}</view> -->
            <!-- <view class="steps-text" v-if="item.mtainUserName"
              >维修师傅: {{ item.mtainUserName }}; 联系方式: <text class="steps-phone" @click="callMtainUserPhone(item)">{{ item.mtainUserPhone }}</text>
            </view> -->
            <view class="finish-image" v-if="item.finishFiles">
              <template v-for="(img, imgIndex) in item.finishFiles">
                <image :key="imgIndex" class="img-ele" :src="img" alt="" @click="previewFinishImage(item.finishFiles, imgIndex)"></image>
              </template>
            </view>
            <view class="steps-time">{{ item.time }}</view>
          </view>
            </view>
        </u-list-item>
      </u-list>
    </view>
    <view class="btn-box"  v-if="payStatus === 0">
      <u-button customStyle="margin: 18rpx 0 0 20rpx;width: 170rpx;height: 60rpx;margin: 0 auto;" @click="toPay()" type="primary" text="立即支付" shape="circle" color="var(--app-primary-color)"></u-button>
    </view>
    <view class="btn-box" v-else>
      <u-button v-if="(visitState == 6 || visitState == 1) && visitId" customStyle="margin: 18rpx 0 0 20rpx;width: 170rpx;height: 60rpx;margin: 0 auto;" shape="circle" type="primary" text="评价" @click="toEvaluatePage(0)"></u-button>
      <u-button v-if="visitState == 2" customStyle="margin: 18rpx 0 0 20rpx;width: 170rpx;height: 60rpx;margin: 0 auto;" shape="circle" type="primary" text="查看评价" @click="toEvaluatePage(1)"></u-button>
    </view>
  </view>
</template>

<script>
import dayjs from 'cl-uni/utils/dayjs';
import { getCrmTaskDetailByTaskID } from '@/service/wycrm60';
import { getReturnVisitRecordById } from '@/service/returnVisit';

export default {
  data() {
    return {
      orderId: '',
      orderData: {},
      progressList: [],
      timer: '',
      visitId: '',
      visitState: '',
      swiperOption: {
        slidesPerView: 6,
        freeMode: true,
      },
      payStatus: '',
      taskAttachmentList: []
    };
  },
  onLoad: function (option) {
    this.orderId = option.quesTaskId;
  },
  onShow() {
    this.progressList = [];
    this.getDetail();
  },
  onUnload() {
    clearInterval(this.timer);
  },
  methods: {
    async getDetail() {
      let that = this;
      let params = {
        data: {
          quesTaskId: that.orderId,
        },
      };
      await getCrmTaskDetailByTaskID(params).then((result) => {
        if (result.status == 200) {
          const { questionTaskInfo, quesRecord, payStatus } = result.data;
          this.orderData = questionTaskInfo;
          this.payStatus = payStatus
          let state = questionTaskInfo.taskState;
          // const pv = state === '处理中' || state === '已暂停' ? 1 : state === '已协商' || state === '已协商沟通' || state === '待确认' || state === '已完成' || state === '已关闭' ? 2 : 0;
          //    0:待派单、1:待接单  2:处理中、3:待确认、4:已关闭  5：已暂停 6：待审核
          const pv = state === 1 || state === 2 || state === 5 ? 1 : state === '已协商' || state === '已协商沟通' || state === 3 || state === '处理完成' || state === 4 ? 2 : 0;
          this.orderData.progressValue = pv;

          this.visitId = questionTaskInfo.visitId || '';
          // // 根据回访ID查询 回复记录 来显示是否评价
          this.visitState = questionTaskInfo.visitState;
          // that.getReturnVisitRecord();

          if (Array.isArray(quesRecord)) {
            // trackState 没有就是处理完
            quesRecord.forEach((item, index) => {
              const { createDate, recordDescCustom, recordState, mtainUserName, mtainUserPhone, finishFiles,recordDesc, operationCode, taskAttachmentList } = item;
              let ct = dayjs(createDate).format('YYYY-MM-DD HH:mm:ss');
              if (index === quesRecord.length - 1) {
                that.orderData.createTime = ct;
              }
              if (index === quesRecord.length - 1) {
                that.orderData.latestStatus = recordDescCustom;
                that.orderData.finished = recordState === undefined;
                that.timer = setInterval(() => {
                  that.$set(that.orderData, 'finishedTime', that.hoursOfUse(ct));
                }, 1000);
              }
              const progress = {
                time: ct,
                desc: recordDescCustom,
                done: recordState === undefined,
                mtainUserName,
                mtainUserPhone,
                finishFiles: finishFiles ? finishFiles.split(',') : null,
								recordDesc:recordDesc?recordDesc:'',
                operationCode: operationCode || '',
                taskAttachmentList:taskAttachmentList || []
              };
              that.progressList.push(progress);
            });
            if (that.progressList.length > 1) {
              that.orderInfo = that.progressList[that.progressList.length - 1].desc;
            }
            let addIdx = that.progressList.findIndex(item => item.operationCode == 'submittask');
            if(addIdx !== -1){
              this.taskAttachmentList = that.progressList[addIdx].taskAttachmentList || [];
            }
          } else {
            const { createDate, recordDescCustom, recordState } = quesRecord;
            let ct = dayjs(createDate).format('YYYY-MM-DD HH:mm:ss');
            that.orderData.createTime = ct;
            that.orderData.latestStatus = recordDescCustom;
            that.orderData.finished = recordState === undefined;
            that.timer = window.setInterval(() => {
              that.$set(that.orderData, 'finishedTime', that.hoursOfUse(ct));
            }, 1000);
            const progress = {
              time: ct,
              desc: recordDescCustom,
              done: recordState === undefined,
            };

            that.progressList.push(progress);
          }
        }
      });
    },
    // 处理时间
    hoursOfUse(submitDate) {
      const { createTime, finished } = this.orderData;

      const currentTime = new Date().getTime();
      const startTime = dayjs(createTime, 'YYYY-MM-DD HH:mm:ss');
      const endTime = finished ? dayjs(submitDate, 'YYYY-MM-DD HH:mm:ss') : currentTime;
      const second = (endTime - startTime) / 1000;
      let days = 0,
        h = 0,
        m = 0,
        s = 0;
      days = Number.parseInt(second / 60 / 60 / 24);
      h = Number.parseInt(second / 3600) % 24;
      m = Number.parseInt(second / 60) % 60;
      s = Math.floor(second % 60);
      return `${days ? days + '天' : ''}${h ? h + '小时' : ''}${m ? m + '分钟' : ''}${s ? s + '秒' : ''}`;
    },
    callMtainUserPhone(item) {
      if (item.mtainUserPhone) {
        uni.makePhoneCall({
          phoneNumber: item.mtainUserPhone.toString(), //电话号码
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
    getReturnVisitRecord() {
      let that = this;
      getReturnVisitRecordById({ visitId: this.visitId }).then((res) => {
        if (res.status == 200) {
          that.visitState = res.data.visitState;
        }
      });
    },
    // 去评价
    toEvaluatePage(n) {
      uni.navigateTo({
        url: `/pages-a/repair/returnVisitQuestionnaireDetail?visitId=${this.visitId}&type=1`,
      });
    },
    toPay(){
      uni.navigateTo({
        url: '/pages-order/order/toPay?quesTaskId=' + this.orderId,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.page {
  box-sizing: border-box;
  background: #f5f5f5;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
}

.cellbox {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
}

.cell {
  width: 160rpx;
  text-align: center;

  image {
    width: 42px;
    height: 42px;
  }

  .contactNumber {
    width: 60px;
    background: rgba(255, 166, 51, 0.39);
    border-radius: 12px;
    font-size: 8px;
    color: #ffffff;
    margin: auto;
  }
}

.form_box {
  background: #ffffff;
  padding: 20rpx;
}

.detail_text {
  font-size: 13px;
  color: #666666;
  opacity: 0.99;
}

.detail_time {
  margin-left: 20rpx;
  font-size: 13px;
  color: var(--app-primary-color);
  opacity: 0.99;
}

.detail-steps1 {
  padding: 40rpx 20rpx;

  ::v-deep .uni-steps__row-title {
    color: #666666 !important;
  }
}

.detail-steps {
  background: #ffffff;
  padding: 20rpx 60rpx;
  overflow: auto;
  flex: 1;
}

::v-deep .u-form-item__body__left {
  align-items: baseline !important;
}

::v-deep .u-steps-item__wrapper {
  background-color: transparent !important;
}

@mixin flx-dsp($jsc, $ali, $drt: row) {
  display: flex;
  flex-direction: $drt;
  justify-content: $jsc;
  align-items: $ali;
}

.flow-item {
  @include flx-dsp($jsc: flex-start, $ali: flex-start);

  .flow-item-l {
    @include flx-dsp($jsc: center, $ali: center, $drt: column);
    margin-right: 20rpx;
    padding: 5px 0;

    .active {
      background-color: var(--app-primary-color);
      display: block;
      width: 20rpx;
      height: 20rpx;
      border-radius: 50%;
    }

    .done {
      width: 1px;
      height: 140rpx;
      background-color: #ddd;
    }
  }
}

.finish-image {
  margin-top: 20rpx;

  .img-ele {
    width: 100px;
    height: 100px;
    border-radius: 6px;
  }
}

.steps-concent {
  view {
    margin-bottom: 10rpx;
  }
}

.steps-text {
  font-size: 12px;
  color: #666666;
  opacity: 0.99;
}

.steps-phone {
  color: blue;
}

.steps-time {
  font-size: 12px;
  color: #aaaaaa;
  opacity: 0.99;
}

.btn-box {
  width: 100%;
  padding: 10rpx 0 30rpx;
  background: #ffffff;
}

.images-wrap{
  display: flex;
  flex-wrap: wrap;
  padding-left: 40rpx;
  .images-item{
    margin-right: 10rpx;
    margin-bottom: 10rpx;
  }
}
</style>
