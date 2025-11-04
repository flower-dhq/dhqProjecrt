<style lang="scss" scoped>
.investigation {
  $pdb: 122rpx;
  width: 100%;
  min-height: 100vh;
  background-color: #f3f5f9;
  padding-top: 90rpx;
  overflow-y: auto;
  box-sizing: border-box;
  padding-bottom: $pdb;
  .list-container {
    padding: 20rpx;
    padding-bottom: 0;
    box-sizing: border-box;
  }
  .list-item {
    position: relative;
    background-color: #fff;
    box-sizing: border-box;
    padding: 28rpx 24rpx 20rpx 24rpx;
    margin-bottom: 24rpx;
    .filled-icon {
      position: absolute;
      top: 0;
      right: 0;
      width: 66rpx;
      height: 66rpx;
    }
    &__top {
      @include flx-dsp($jsc: flex-start, $ali: flex-start);
      ::v-deep .u-checkbox {
        position: relative;
        top: 8rpx;
        margin-right: 10rpx;
      }
      .info-text {
        .text1 {
          display: block;
          font-size: 30rpx;
          font-weight: bold;
          color: #333;
        }
        .addr-text {
          display: block;
          font-size: 28rpx;
          color: #6666;
          margin-top: 24rpx;
          margin-bottom: 16rpx;
          text{
            padding-left: 14rpx;
          }
        }
      }
    }
    &__bottom {
      position: relative;
      width: 100%;
      height: 80rpx;
      @include flx-dsp($jsc: flex-end, $ali: center);
      font-size: 28rpx;
      box-sizing: border-box;
      padding-top:14rpx;
      &::before {
        position: absolute;
        left: 0;
        top: 0;
        display: block;
        content: '';
        width: 100%;
        height: 1rpx;
        transform: scaleY(50%);
        background-color: #ebebeb;
      }
      .chat {
        @include flx-dsp($jsc: flex-start, $ali: center);
        text {
          margin-left: 8rpx;
          color: var(--app-primary-color);
        }
      }
      .send {
        @include flx-dsp($jsc: center, $ali: center);
        margin-left: 48rpx;
        width: 140rpx;
        height: 60rpx;
        color: #fff;
        background-color: var(--app-primary-color);
        border-radius: 8rpx;
      }
    }
  }
  .batchSend-box {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    bottom: 0;
    @include flx-dsp($jsc: center, $ali: center);
    background-color: #fff;
    padding: 16rpx 0;
    width: 100%;
    border-top: 1rpx solid #eee;
    .batchSend{
      width: 670rpx;
      height: 88rpx;
      line-height: 88rpx;
      background: var(--app-primary-color);
      border-radius: 8rpx;
      color: #fff;
      font-size: 32rpx;
      text-align: center;
    }
  }
  .sending-operation {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: $pdb;
    @include flx-dsp($jsc: space-between, $ali: center);
    box-sizing: border-box;
    padding: 0 30rpx;
    background-color: #fff;

    box-shadow: 0px -2rpx 8rpx #eff2f6;
    .buttons {
      @include flx-dsp($jsc: flex-end, $ali: center);
      text {
        @include flx-dsp($jsc: center, $ali: center);
        width: 160rpx;
        height: 80rpx;
        border: 1rpx solid var(--app-primary-color);
        border-radius: 8rpx;
        font-size: 30rpx;
      }
      text:nth-child(1) {
        color: var(--app-primary-color);
      }
      text:nth-child(2) {
        margin-left: 30rpx;
        background-color: var(--app-primary-color);
        color: #fff;
      }
    }
  }
}
</style>

<template>
  <view class="investigation" :style="[THEME_CSS_VAR]">
    <dropdown-selection @rowClick="rowClick" @search="onSearch" @toggle="onToggle" :options="options"></dropdown-selection>
    <!-- 列表 -->
    <view class="list-container">
      <template v-for="(item, index) in dataList">
        <view class="list-item" v-if="!batchSend || (batchSend && !item.filled)" :key="index">
          <image v-if="item.filled" class="filled-icon" :src="require(`@/static/${[THEME_NAME]}/common/filled.png`)"></image>
          <view class="list-item__top" @click="navigate(item)">
            <u-checkbox-group v-if="batchSend || true" v-model="item.checked" @change="checkedChange" iconPlacement="right" placement="row">
              <u-checkbox size="20" shape="circle" name="checked"></u-checkbox>
            </u-checkbox-group>
            <view class="info-text" style="padding-top:6rpx">
              <text class="text1"> {{ item.name }} | {{ item.phone }}</text>
              <text class="addr-text">{{ item.addresses[0] }}<text v-if="item.addresses.length>1"> 等{{item.addresses.length}}处房产</text>
              </text>
            </view>
          </view>
          <view class="list-item__bottom" v-if="!item.filled && !batchSend">
            <view class="chat" @click="chatAndMassage('chat', item)">
              <u--text
                  :prefixIcon="require(`@/static/${THEME_NAME}/workorder/icon-chat.png`)"
                  text="发起会话" type="primary" size="30rpx"
                  :iconStyle="{fontSize: '34rpx', color: THEME_COLOR, marginRight: '4px'}"
                  align="center"
                />
              <!-- <u-icon size="22" name="weixin-fill" :color="THEME_COLOR"></u-icon>
              <text>发起会话</text> -->
            </view>
            <text class="send" @click="chatAndMassage('message', item)">发送问卷</text>
          </view>
        </view>
      </template>
    </view>
    <!-- 加载更多 -->
    <u-loadmore :status="load.status" line />
    <!-- 批量发送 -->
    <view class="sending-operation" v-if="batchSend">
      <u-checkbox-group v-model="allChecked" iconPlacement="right" placement="row" @change="allcheckedChange">
        <u-checkbox size="20" shape="circle" name="allChecked"></u-checkbox>
        <text style="margin-left: 4px">全选</text>
      </u-checkbox-group>
      <view class="buttons">
        <text @click="cancelChecked">取消</text>
        <text @click="batchSendFn">发送问卷</text>
      </view>
    </view>
    <view v-if="batchSendButton" class="batchSend-box">
      <text class="batchSend" @click="batchSendClick">批量发送</text>
    </view>
    
    <chat-message ref="chatMessage"></chat-message>
  </view>
</template>

<script>
import DropdownSelection from './components/dropdown-selection.vue';
import { pushPage } from '@/service/wxmanage';
import ChatMessage from './components/chat-message.vue';
import { getShareConfig, shareToExternalContact } from '@/js/sharePage'

export default {
  data() {
    return {
      keywords: '',
      building: {},
      filled: '', // 未填写
      load: {
        current: 1,
        size: 10,
        status: 'nomore',
        pending: false,
      },
      dataList: [],
      batchSend: false, // 是否点了批量发送
      allChecked: [],
      options: {},
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
  components: {
    DropdownSelection,
    ChatMessage
  },
  computed: {
    batchSendButton() {
      return !this.batchSend && this.dataList.length
    }
  },
  methods: {
    // 楼栋确认
    rowClick(evt) {
      if (evt.buildingValue && evt.buildingIdList.includes(evt.buildingValue) && evt.buildingIdList.includes(',')) {
      this.building = {
        value: evt.buildingIdList.toString()
      }
      }else {
        this.building = evt;
      }
      this.resetCondition();
      this.getListData();
    },
    // 搜索
    onSearch(keywords) {
      this.keywords = keywords;
      this.resetCondition();
      this.getListData();
    },
    // 切换未填写
    onToggle(evt) {
      this.filled = evt ? 0 : '';
      this.resetCondition();
      this.getListData();
    },
    // 重置条件
    resetCondition() {
      this.load = {
        current: 1,
        size: 10,
        status: 'nomore',
        pending: false,
      };
      this.batchSend = false;
      this.allChecked = [];
      this.dataList = [];
    },
    // 加载列表
    getListData(params) {
      const { pullDown } = params || {};
      const { current, size } = this.load;
      const { value = [] } = this.building;
      const filled = this.filled;
      const keywords = this.keywords;
      const { projectId, surveyId } = this.options;
      const args = {
        data: {
          relationPush: 2,
          relationPushId: surveyId,
          projectId,
          finishFlag: filled,
          buildingIds:typeof(value) == "number" ? [value] : value.includes(',') ? value.split(',') : value || [],
          keyword: keywords,
        },
        pathParams: `/${size}/${current}`,
        hideLoading: true,
      };
      this.load.status = 'loading';

      pushPage(args)
        .then((res) => {
          if (pullDown) uni.stopPullDownRefresh();
          this.load.status = 'nomore';
          if (res.success) {
            const { records } = res.data || {};
            const tempList = [];
            records.forEach((item) => {
              const { name, phone, finishFlag, addresses } = item;
              const d = {
                ...item,
                name,
                phone,
                addresses,
                filled: !!finishFlag,
                checked: [],
              };
              tempList.push(d);
            });
            this.load.status = records.length < size ? 'nomore' : 'loadmore';
            this.dataList = this.dataList.concat(tempList);
          }
        })
        .catch((_) => {
          if (pullDown) uni.stopPullDownRefresh();
          this.load.status = 'nomore';
        });
    },
    // 点击批量发送
    batchSendClick() {
      const nonfilled = this.dataList.some((item) => !item.filled);
      if (nonfilled) {
        this.batchSend = true;
      } else {
        uni.showToast({
          title: '暂无未填写数据',
          duration: 2000,
          icon: 'none',
        });
      }
    },
    // 点击复选框
    checkedChange() {
      setTimeout(() => {
        const nonFilledData = this.dataList.filter((item) => !item.filled);
        const allChecked = nonFilledData.every((item) => !!item.checked.length && item.checked[0] !='');
        this.allChecked = [allChecked ? 'allChecked' : ''];
      }, 0);
    },
    // 全选
    allcheckedChange() {
      setTimeout(() => {
        const allChecked = this.allChecked.length;
        this.dataList.forEach((item) => {
          const { filled } = item;
          if (!filled) item.checked = [allChecked ? 'checked' : ''];
        });
      }, 0);
    },
    // 发送问卷
    sendQuestionnair() {
      wx.qy.sendChatMessage({
        msgtype: 'miniprogram', //消息类型，必填
        enterChat: true, //为true时表示发送完成之后顺便进入会话，仅移动端3.1.10及以上版本支持该字段
        miniprogram: {
          appid: item.appId, //小程序的appid
          title: item.materialTitle, //小程序消息的title
          imgUrl: item.materialPicUrl, //小程序消息的封面图
          page: 'pages-visit/questionnaire/detail.html?id=279', //小程序消息打开后的路径，注意要以.html作为后缀，否则在微信端打开会提示找不到页面
        },
        success: function (res) {
          //todo:
        },
      });
    },
    // 跳转
    navigate(params) {
      const { surveyId } = this.options;
      uni.navigateTo({ url: `/pages-visit/questionnaire/detail?surveyId=${surveyId}&args=${encodeURIComponent(JSON.stringify(params))}` });
    },
    // 取消全选
    cancelChecked() {
      this.dataList.forEach((item) => {
        item.checked = [];
      });
      this.allChecked = [];
      this.batchSend = false;
    },
    // 会话、发卷
    chatAndMassage(key, data) {
      if (key == 'chat') {
        this.$refs.chatMessage.startChat(data)
      } else if (key == 'message') {
        if (!this.shareConfig.materialUrl) {
          uni.showToast({ title: '请联系管理员配置常用链接', icon: 'none' })
          return
        }

        const queryStr = '&id=' + data.relationPushId

        shareToExternalContact({
          type: this.shareConfig.type,
          appid: this.shareConfig.appId,
          title: this.shareConfig.materialTitle,
          desc: this.shareConfig.materialDesc,
          imgUrl: this.shareConfig.materialPicUrl,
          pageUrl: this.shareConfig.materialUrl + queryStr
        })
      }
    },
    // 批量发送
    batchSendFn() {
      const nonFilled = this.dataList.some((item) => !item.filled && item.checked.length);
      if (nonFilled) {
        this.chatAndMassage('chat', this.dataList[0])
      } else {
        uni.showToast({
          title: '请选择数据',
          duration: 2000,
          icon: 'none',
        });
      }
    }
    
  },
  onPullDownRefresh() {
    this.resetCondition();
    this.getListData({ pullDown: 1 });
  },
  onReachBottom() {
    const { pending, status } = this.load;
    if (!pending && status != 'nomore') {
      this.load.current += 1;
      this.getListData();
    }
  },
  onLoad(options) {
    this.options = options;
    if (options.buildingValue) {
      this.building = {
        value: options.buildingIdList.toString()
      }
    }

    getShareConfig('分享问卷').then((res) => {
      this.shareConfig = res
    })
  },
  mounted() {
    if (!this.options.buildingValue) {
      this.getListData(); 
    }else {
      this.load.status = 'loading'
    }
  }
};
</script>
