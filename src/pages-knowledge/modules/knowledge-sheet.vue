<template>
  <view :class="['know-sheet', getCustomClass]" >
    <view class="sheet-content-wrap" @click="linkTo(data.quesId)">
      <cell-text labelWidth="0" padding="24rpx 30rpx 0" isRight border="none">
        <text class="content-title">{{ data.quesTitle }}</text>
      </cell-text>
       <view class="content-info" v-html="richText"></view>
       <view style="display: flex;padding: 0 30rpx;width: 77%;">
        <u-text
            :text="data.quoteNum || '0'" prefixIcon="share-square" 
            :iconStyle="{ fontSize: '18px', color: '#666666' }"
            :customStyle="{ fontSize: '13px', color: '#666666',marginTop: '1.6rpx' }"
          />
        <u-text
            :text="data.likeCount" prefixIcon="star"
            :iconStyle="{ fontSize: '18px', color: '#666666' }"
            :customStyle="{ fontSize: '13px', color: '#666666',marginTop: '1.6rpx' }"
          />
       </view>
    </view>
    <view class="sheet-footer-wrap">
      <view class="sheet-left">
        <u--text :text="data.top==1 ?'取消置顶':'置顶'" :prefixIcon="data.top==1 ? require(`@/static/${THEME_NAME}/common/top.png`) : require(`@/static/${THEME_NAME}/common/untop.png`)" 
          size="28rpx" color="#666666" iconStyle="width: 30rpx; height: 30rpx;" 
          :customStyle="{ fontSize: '14px', color: data.top == 1 ? '#2761FF ' : '#666666' ,opacity: '1'}"
          margin="26rpx 30rpx 26rpx 0" opacity ='1' @click="topQues(data.quesId,data.top ==1 ? 0 : 1)" />

      <u-text
          text="收藏"  prefixIcon="star-fill"
          :iconStyle="{ fontSize: '18px', color: data.praised == 1 ? '#FF0000' : '#666666' }"
          :customStyle="{ fontSize: '14px', color: data.praised == 1 ? '#FF0000' : '#666666' ,opacity: '1',marginTop: '2rpx'}"
          @click="collectQues(data.quesId,data.praised ==1 ? 0 : 1)"
        ></u-text>
      </view>
      <button :class="['footer-btn', 'active']" @click.native.stop="handleShare">发送</button>
    </view>

  </view>
</template>

<script>
import mpMixin from '@/js/mixin/mpMixin'
import CellText from '@/components/cell-text.vue'

/**
 * 会员活动列表下的子项目
 */
export default {
  name: 'KnowledgeSheet',
  mixins: [mpMixin],
  components: {
    CellText,
  },
  props: {
    // 数据
    data: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    richText() {
      return `<div style="height:38px; overflow: hidden;text-overflow: ellipsis; display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical; word-break: break-all;">${this.data.externalReply}</div>`
    }
  },
  methods: {
    linkTo(quesId) {
      uni.navigateTo({ url: '/pages-knowledge/knowledge-base/detail?quesId=' + quesId })
    },
    handleShare() {
      let self = this;
      const miniprogram = {
        appid: self.$appConfig.OWNER_APPID,
        title: self.data.quesTitle,
        imgUrl:'https://saas60.wuyeface.com/qw-online-assets/static/theme-default/common/shareKnowledge.png',
        page: 'pages-b/knowledgeBase/messageContent.html?quesId=' + self.data.quesId, // 小程序消息打开后的路径，注意要以.html作为后缀，否则在微信端打开会提示找不到页面
      }
      wx.qy.getContext({
        success: (res) => {
          if (res.entry == 'single_chat_tools') {
            // 从单聊进入
            wx.qy.sendChatMessage({
              msgtype: "miniprogram", //消息类型，必填
              enterChat: true, //为true时表示发送完成之后顺便进入会话，仅移动端3.1.10及以上版本支持该字段 
              miniprogram,
              success: function(res) {
                   // 分享成功后 res 返回的数据：
                   //{err_code: 0, err_msg: "qy.sendChatMessage:ok"}
                  if(res.err_msg == 'qy.sendChatMessage:ok'){
                    self.$emit('addQuesQuoteNum', self.data.quesId)
                	}   
                }
            })
          } else {
            wx.qy.shareToExternalContact({
              text: {
                content: self.data.quesTitle,
              },
              attachments: [
                {
                  msgtype: 'miniprogram',
                  miniprogram
                }
              ],
              success: function(res) {
                self.$emit('addQuesQuoteNum', self.data.quesId)
              }
            })
          }
        }
      })
    },
    collectQues(id,data){
      this.$emit('collectQues', id,data)
    },
    topQues(id,data){
      this.$emit('topQues', id,data)

    }
  }
}
</script>

<style lang="scss" scoped>
.know-sheet {
  @include flx-dsp(flex-start, flex-start, column);
  background-color: #fff;
  border-radius: 10rpx;
  font-family: "PingFang SC";
	margin: 24rpx 20rpx;
}
.sheet-content-wrap {
  width: 100%;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid #ebebeb;
  padding-bottom:20rpx;
}
.content-title {
  font-size: 30rpx;
  color: #222;
  font-weight: bold;
  @include ellipsis(1);
}
.content-info {
  padding: 24rpx 30rpx 18rpx;
  font-size: 28rpx;
  color: #666;
 ::v-deep  rich-text {
  @include ellipsis(2);
  }
}

.sheet-footer-wrap {
  display: flex;
  justify-content:space-between;
  width: 100%;
  padding: 2rpx 30rpx;
  box-sizing: border-box;
  align-items: center;
  .sheet-left {
  display: flex;
  width: 70%;

  }
}
.footer-btn {
  width: 120rpx;
  height: 60rpx;
  border-radius: 8rpx;
  text-align: center;
  line-height: 60rpx;
  font-size: 26rpx;
  color: #fff;
  margin: 0;
  border-width: 0;

  &.active {
    background-color: var(--app-primary-color);
  }
  &.disabled {
    background-color: #ccc;
  }
  &::after {
    border-width: 0;
  }
}
::v-deep .u-text {
  flex: initial !important;
  width: 32% !important;
  margin-left: 43rpx;
}
</style>