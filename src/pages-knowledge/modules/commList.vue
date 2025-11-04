<!-- 常用素材 -->
<template>
  <view class="page">
      <view class="page-search"> 
      <u-search  placeholder="输入标题、描述关键词搜索"  :showAction="false" @search="getDataLink" color="#999999"
          v-model="keyword"></u-search>
      </view>
      <u-list @scrolltolower="scrolltolower" height="calc(100vh - 180rpx)">
          <view class="list-row" v-for="(item, index) in dataList" :key="index">
              <view>
                  <image class="img" :src="item.materialPicUrl"></image>
              </view>
              <view class="list-cell">
                  <view class="list-text">{{ item.materialTitle }}</view>
                  <view class="list-desc">{{ item.materialDesc }}</view>
                  <view>
                      <text class="list-type">{{ item.type == 1 ? 'H5' : '小程序' }}</text>
                  </view>

              </view>
              <view class="list-btn" @click="share(item)">发送</view>
          </view>
      </u-list>
  </view>
</template>

<script>
import { getCompanyAgentMaterialList } from '@/service/wechatguanjia'
import Utils from '@/js/utils'

export default {
  components: {},
  data() {
      return {
          keyword: '',
          dataList: []
      };
  },
  computed: {},
  watch: {},
  async onLoad() { 
      // #ifdef MP-WEIXIN
      const res = wx.getSystemInfoSync();
      if (res.environment) {
          await this.$onLaunched;
          let flag =await Utils.toolbarPermissions();   
          if(!flag){
              return;
          }
      }
      // #endif
      this.getDataLink();
  },
  methods: { 
      getDataLink() {
          var params = {
              data: {
                  pageNum: 1,
                  pageSize: 10,
                  title: this.keyword,
                  desc: this.keyword
              }
          }
          getCompanyAgentMaterialList(params).then(res => {
              if (res.status == 200) {
                  this.dataList = res.data.records;
              }

          })
      },
      share(item) {
          wx.qy.getContext({
              success: (res) => {
                if (res.entry == 'single_chat_tools') {
                  // 从单聊进入
                  wx.qy.sendChatMessage({
                    msgtype: "miniprogram", //消息类型，必填
                    enterChat: true, //为true时表示发送完成之后顺便进入会话，仅移动端3.1.10及以上版本支持该字段 
                    miniprogram:
                    {
                        appid: item.appId,//小程序的appid
                        title: item.materialTitle, //小程序消息的title
                        imgUrl: item.materialPicUrl,//小程序消息的封面图
                        page: item.materialUrl, //小程序消息打开后的路径，注意要以.html作为后缀，否则在微信端打开会提示找不到页面
                    },
                    success: function (res) {
                        //todo:
                    }
                })
              } else {
                  wx.qy.shareToExternalContact({
                    text: {
                      content: item.materialTitle,
                    },
                    attachments: [
                      {
			      	  msgtype: "miniprogram",    // 消息类型，必填
		      		  miniprogram: {
			      		    appid: item.appId,    // 小程序的appid
			      		    title: item.materialTitle,        // 小程序消息的title
			      		    imgUrl :item.materialPicUrl,    //小程序消息的封面图。
			      		    page: item.materialUrl,        //小程序消息打开后的路径，注意要以.html作为后缀，否则在微信端打开会提示找不到页面
			      	  },
			            },
                      ],
                       success: function(res) {
                       }
                    })
                  }
                }
              })
             },

  },
  created() {

  },
  mounted() {

  },
}
</script>
<style  lang="scss" scoped>
.page {
  width: 100%;
  background: #F5F5F5;
  box-sizing: border-box;
    overflow: hidden;
    height: calc(100vh - 110rpx);
}
.page-search{
  background: #FFFFFF;
  // padding: 10px;
 
} 
::v-deep .u-list {
    height: calc(100% - 128rpx) !important;
    overflow: auto;
     margin-top: 20rpx;
     .list-row {
         display: flex;
        align-items: center;
        gap: 20rpx;
        border-bottom: 1px solid #EBEBEB;
        padding: 20rpx 20rpx;
        background: #FFFFFF;
    }

    .img {
        height: 128rpx;
        width: 160rpx;
    }

    .list-btn {
        position: absolute;
        right: 30rpx;
        font-size: 26rpx; 
        color: #FFFFFF;
        background: #197AFA;
        border-radius: 8rpx;
        padding: 10rpx 20rpx;
    }

    .list-cell {
        display: grid;
        gap: 3px;
    }

    .list-text {
        font-size: 28rpx;
        font-weight: bold;
        color: #333333;
    }

    .list-desc {
        font-size: 26rpx;
        color: #999999;
     }

    .list-type { 
        padding: 2rpx 8rpx;  
        font-size: 22rpx;
        color: #1989F7;
        border-radius: 4rpx;
        border: 1px solid #1989F7;
    }
}

</style>