<template>
  <view :class="['payment-list-sheet', getCustomClass]" :style="[getCustomStyle]" @click="linkTo">
    <view class="sheet-content-wrap">
      <view class="sheet-person-status">
        <text class="arrear-month">【{{data.reminderMonth}}】{{data.customerName}}</text>
        <text
          class="arrear-status"
          :style="{color:reminderStateColorList[data.reminderState]}"
        >{{data.reminderState | filterReminderState}}</text>
      </view>
      <view class="person-seria">
        <image class="list-icon" :src="require(`@/static/index/icon-order.png`)" />
        <text class="list-text-1">{{data.reminderSerialNumber}}</text>
      </view>
      <view class="person-resource">
        <image class="list-icon" :src="require(`@/static/index/icon-assets.png`)" />
        <text class="list-text-1">{{data.resource}}</text>
      </view>
      <view class="payment-amount">
        <view class="amount-item">
          <image class="list-icon" :src="require(`@/static/index/icon-payment.png`)" />
          <text class="pay-amount">¥ {{data.receivableAmount}}</text>
        </view>
        <view class="amount-item">
          <image class="list-icon" :src="require(`@/static/index/icon-arrears.png`)" />
          <text class="pay-amount">¥ {{data.arrearsAmount}}</text>
        </view>
      </view>
      <view class="block-line"></view>
      <view class="create-action">
        <text class="create-date">{{data.createDateStr}}</text>
        <view>
          <text
            :class="{'disable-btn': data.reminderState == 2 }"
            class="arrear-btn"
            @click="handleBtnClick(data)"
          >催缴</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import mpMixin from "@/js/mixin/mpMixin";
import { updateReminderBatch } from "@/service/leasing";
import { getCompanyAgentMaterialList } from '@/service/api-gateway'
import imgPaymentPoster from '@/static/theme-default/common/payment-poster.png'

export default {
  mixins: [mpMixin],
  props: {
    item: {
      type: Object,
      default: () => ({})
    }
  },
  filters: {
    filterReminderState: function(i) {
      let list = ["待催缴", "已催缴", "欠费缴清"];
      return list[i];
    }
  },

  data() {
    return {
      data: this.item,
      reminderStateColorList: ["#FF8A15", "#999999", "#16CE92"],
      shareConfig: {
        // 分享按钮的配置信息
        type: '',
        materialTitle: '',
        materialDesc: '',
        materialPicUrl: '',
        materialUrl: '',
        appId: '',
      }
    };
  },
  created() {
    this.getShareConfig()
  },
  methods: {
    linkTo() {},
    handleBtnClick(data) {
      if (!this.shareConfig.materialUrl) {
        uni.showToast({ title: '请联系管理员配置常用链接', icon: 'none' })
        return
      }

      let self = this;
      if (data.reminderState == "0" || data.reminderState == "1") { 
        let { O_USER_INFO } = this.$constant;
        let userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' });
        let companyId = userInfo.companyId ? userInfo.companyId : this.$appConfig.COMPLANY_ID;
        let params = `&projectId=${data.projectId}&isWechat=${true}&companyId=${companyId}`;
        
        let attachments = []
        if (this.shareConfig.type == 1) {
          // 发送 H5
          attachments.push({
            msgtype: 'link',
            link: {
              title: '亲爱的业主，敬请查收您的物业账单',
              desc: this.shareConfig.materialDesc || '',
              imgUrl: this.shareConfig.materialPicUrl,
              url: this.shareConfig.materialUrl + params
            }
          })
        } else if (this.shareConfig.type == 2) {
          // 发送小程序
          attachments.push({
            msgtype: 'miniprogram',
            miniprogram: {
              appid: this.shareConfig.appId,
              title: '亲爱的业主，敬请查收您的物业账单',
              imgUrl: this.shareConfig.materialPicUrl,
              page: this.shareConfig.materialUrl + params // 小程序消息打开后的路径，注意要以.html作为后缀，否则在微信端打开会提示找不到页面
            }
          })
        }

        wx.qy.shareToExternalContact({
          text: {
            content: ''
          },
          attachments,
          success: () => {
            this.handleUpdateStatus(data)
          }
        })
      }
    },
    async handleUpdateStatus(data) {
      let { O_USER_INFO } = this.$constant;
      let userInfo = this.$utils.storageAction({
        key: O_USER_INFO,
        action: "get"
      });
      let params = {
        data: {
          onlineType: 0,
          reminderDate: uni.$u.timeFormat(Date.now(), "yyyy-mm-dd"),
          reminderSerialNumbers: data.reminderSerialNumber,
          reminderTypeId: "sf_cj_by_enterprise_wechat",
          reminderTypeName: "sf_cj_by_enterprise_wechat",
          reminderUserId: userInfo.userId,
          reminderUserName: userInfo.userName
        }
      };
      await updateReminderBatch(params).then(res => {
        if (res.status == 200) {
          this.$set(this.data, "reminderState", "1");
        }
      });
    },
    // 获取“分享催缴”的配置
    async getShareConfig() {
      const params = {
        data: {
					pageNum: 1,
					pageSize: 100,
					title: '分享催缴'
				},
        hideLoading: true
      }
      const res = await getCompanyAgentMaterialList(params)

      const data = res?.data?.records?.[0]
      if (!data) {
        this.shareConfig = {}
        return
      }

      this.shareConfig = data
    }
  }
};
</script>

<style lang="scss" scoped>
.payment-list-sheet {
  position: relative;
  margin: 24rpx 20rpx;
  background-color: #fff;
  border-radius: 10rpx;
  font-family: "PingFang SC";
  overflow: hidden;

  .list-icon {
    width: 34rpx;
    height: 34rpx;
    margin-right: 12rpx;
  }

  .list-text-1 {
    font-size: 24rpx;
    font-family: PingFang SC;
    font-weight: 400;
    color: #666666;
    opacity: 1;
    word-wrap: break-word;
    word-break: break-all;
    white-space: pre-line;
  }
}
.sheet-content-wrap {
  box-sizing: border-box;
  padding: 30rpx 24rpx;
  font-size: 30rpx;
}
.sheet-person-status {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24rpx;

  .arrear-month {
    position: relative;
    left: -14rpx;
    font-size: 30rpx;
    font-family: PingFang SC;
    font-weight: bold;
    color: #222222;
    opacity: 1;
  }

  .arrear-status {
    font-size: 28rpx;
    font-family: PingFang SC;
    font-weight: 400;
    color: #ff8a15;
    opacity: 1;
  }
}

.person-seria {
  display: flex;
  margin-bottom: 16rpx;
}

.person-resource {
  display: grid;
  grid-template-columns: auto 1fr;
  margin-bottom: 16rpx;
}

.payment-amount {
  display: flex;
  column-gap: 67rpx;
  .amount-item {
    display: flex;
    align-items: center;
    .pay-amount {
      position: relative;
      top: 1rpx;
      display: inline-block;
      font-size: 28rpx;
      font-family: PingFang SC;
      font-weight: 400;
      color: #333333;
    }
  }
}

.block-line {
  margin: 16rpx 0px;
  border-bottom: 1px solid rgb(214, 215, 217);
  width: 100%;
  transform: scaleY(0.5);
  border-top-color: rgb(214, 215, 217);
  border-right-color: rgb(214, 215, 217);
  border-left-color: rgb(214, 215, 217);
}

.create-action {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .create-date {
    font-size: 24rpx;
    font-family: PingFang SC;
    font-weight: 400;
    line-height: 24rpx;
    color: #999999;
    opacity: 1;
  }

  .arrear-btn {
    display: inline-block;
    width: 120rpx;
    height: 60rpx;
    text-align: center;
    line-height: 60rpx;
    font-size: 26rpx;
    color: #fff;
    background: #1989f7;
    border: 1px solid #1989f7;
    opacity: 1;
    border-radius: 8rpx;
  }

  .disable-btn {
    background: #ccc;
    border-color: #ccc;
  }
}
</style>
