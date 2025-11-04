<template>
  <view :style="[THEME_CSS_VAR]">
    <u-modal :show="show" title="提示" content="未添加业主为外部联系人，暂无法发起会话，您可选择其他联系人发起" confirmText="选择联系人" showCancelButton @confirm="chooseExternal" @cancel="show = false" />
  </view>
</template>

<script>
import { getQYInfoByOwnerId, syncOwnerInfo } from '@/service/api-gateway';
export default {
  data() {
    return {
      show: false,
    };
  },
  methods: {
    // 发下消息
    sendChatMessage(params) {
      const { appId, materialTitle, materialPicUrl, materialUrl } = params;
      const { uniPlatform } = uni.getSystemInfoSync();
      console.log('sendChatMessage', params);
      if (uniPlatform !== 'mp-weixin') return Promise.resolve();
      const miniprogram = {
        appid: appId, //小程序的appid
        title: materialTitle, //小程序消息的title
        imgUrl: materialPicUrl, //小程序消息的封面图
        page: materialUrl, //小程序消息打开后的路径，注意要以.html作为后缀，否则在微信端打开会提示找不到页面
      };
      return new Promise((resolve) => {
        wx.qy.shareToExternalContact({
          attachments: [
            {
              msgtype: 'miniprogram',
              miniprogram: miniprogram,
            },
          ],
          success: function (res) {
            resolve();
          },
        });
      });
    },
    // 会话
    async startChat(params) {
      const { ownerId } = params;
      const { uniPlatform } = uni.getSystemInfoSync();
      console.log('startChat', params);
      if (uniPlatform !== 'mp-weixin') return;

      if (!ownerId) return (this.show = true);

      const res = await getQYInfoByOwnerId(ownerId); // 获取反馈人在企微上的信息
      const data = res.data || {};
      if (!data.userId) return (this.show = true);

      // 需要先根据外部联系人id同步企微外部联系人信息
      await syncOwnerInfo(data.userId);
      // 打开与客户的单聊会话
      wx.qy.openEnterpriseChat({
        externalUserIds: data.userId,
        success: (res) => {},
      });
    },
    // 选择外部联系人（客户）
    chooseExternal() {
      wx.qy.selectExternalContact({
        filterType: 0,
        success: (res) => {
          const data = res.userIds || [];
          // 客户id
          const userItem = data[0] || '';
          this.show = false;

          wx.qy.openEnterpriseChat({
            externalUserIds: userItem,
          });
        },
      });
    },
  },
};
</script>
