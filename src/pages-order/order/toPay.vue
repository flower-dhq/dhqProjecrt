<template>
  <view class="page" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
    <EbeiPay
      :payMoney="payInfo.money"
      :infoData="infoData"
      defaultPay="local"
      payList="local"
      funcKey="requestData"
      @payResult="payResult"
    />
    <u-toast ref="uToast"></u-toast>
  </view>
</template>

<script>
import uniHttp from '@/service/uni-request';
import EbeiPay from '@ebei-component/ebei-pay/src/ebei-pay.vue';
import { customerWaitPay } from '@/service/wycrm60';

export default {
  name: 'toPay',
  components: {
    EbeiPay,
  },
  data() {
    return {
      quesTaskId: '',
      payInfo: {
        money: '0.00',
        notifyUrl: '',
        orderNo: '',
        assetsId: ''
      },
      infoData: [],
      requestData: {
        /**
         * 获取支付参数的接口
         */
        reqPayInfo: (url, params) => {
          const data = {
            ...params,
            model: 'workorder',
            orderNo: this.payInfo.orderNo,
            totalAmount: parseFloat(this.payInfo.money) * 100, // 单位分
            notifyUrl: this.payInfo.notifyUrl,
            assetsId: this.payInfo.assetsId, // 资产ID
          };
          // 支付接口
          return uniHttp.request({
            url,
            method: 'POST',
            params: {
              data,
            },
          });
        }
      },
    };
  },
  onLoad(option) {
    this.quesTaskId = option.quesTaskId;
    if (this.quesTaskId) {
      this.getPayInfo();
    } else {
      uni.showModal({
        content: '获取工单信息失败，请重试',
        showCancel: false,
        confirmText: '确定',
        success() {
          uni.navigateBack();
        },
      });
    }
  },
  methods: {
    async getPayInfo() {
      const params = {
        data: {
          quesTaskId: this.quesTaskId,
        },
      };
      const res = await customerWaitPay(params)
      if (res.code != 200) {
        uni.showModal({
          content: res.msg || '获取缴费信息失败',
          showCancel: false,
          confirmText: '确定',
          success() {
            uni.navigateBack();
          },
        });
        return
      }

      const objTemp = res || {}
      this.payInfo.money = parseFloat(objTemp.money || 0).toFixed(2)
      this.payInfo.notifyUrl = objTemp.notifyUrl || ''
      this.payInfo.orderNo = objTemp.orderNo || ''
      const houseDetail = objTemp.houseDetail || {}
      this.payInfo.assetsId = houseDetail.projectId || ''

      this.infoData = [
        {
          title: '支付信息',
          data: [
            { label: '服务费', value: parseFloat(objTemp.manmadePrice || 0).toFixed(2) },
            { label: '材料费', value: parseFloat(objTemp.materialPrice || 0).toFixed(2) },
          ],
        },
      ];
    },
    payResult(res) {
      if (res.success) {
        if (res.data == 'success') {
          uni.redirectTo({
            url: `/pages-order/order/payResult?status=1`,
          });
        } else if (res.data == 'cancel') {
          this.$refs.uToast.show({ message: '支付取消' });
        } else {
          this.$refs.uToast.show({ message: res.data || '获取支付信息失败' });
        }
      } else {
        uni.redirectTo({
          url: `/pages-order/order/payResult?status=0`,
        });
      }
    },
  },
};
</script>
<style scoped lang="scss"></style>
