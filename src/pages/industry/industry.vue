<style lang="scss" scoped>
.parking-cont{
  padding: 44rpx;
  .menu-box {
    // padding: 40rpx 0;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 40rpx 20rpx;
    .menu-grid {
        display: grid;
        align-items: center;
        justify-content: center;
        text-align: center;
    }
    .menu-icon {
        height: 64rpx;
        width: 64rpx;
        background-repeat: no-repeat;
        background-size: 64rpx;
        margin: auto;
    }
    .menu-title {
        font-size: 26rpx;
        color: #333333;
        margin-top: 10rpx;
    }
  }
}
</style>
<template>
  <view class="parking-cont">
    <view class="menu-box">
      <view class="menu-grid" v-for="(item, index) in menuList" :key="index" @click="menuJump(item)">
        <image class="menu-icon" :src="require(`@/static/${[THEME_NAME]}/menu/${item.icon}.png`)"></image>
        <view class="menu-title">{{item.configName}}</view>
      </view>
    </view>
    <middle-box :current-page="5" ref="child"></middle-box>
  </view>
</template>
<script>
import MiddleBox from '@/components/middle/middle-box.vue';
export default {
  components: {
    'middle-box':MiddleBox,
  },
  data(){
    return{
      menuList:[
        {
          configName: '产业Link',
          detailCode: 'link',
          icon: "icon-cyLink",
          service: "3", 
          url:'/pages/expo/expo', //小程序目标页面
          appId:'wx6faf6cc1e8b83bc7', //第三方小程序appId
          originalId:'gh_b76a9caa50df', //第三方小程序原始Id
        },
        {
          configName: '产投动态',
          detailCode: 'chantou',
          icon: "icon-ctdt",
          service: "1", 
          url:'https://xyd-visit-web.9zdata.cn/mp/homepage?__biz=Mzg5NjU4MTY2OQ==&hid=7&sn=9bd24d3a372c6cc9bff1bd69ee3f6551&scene=18#wechat_redirect'
        },
        {
          configName: '产业政策',
          detailCode: 'zhengce',
          icon: "icon-zc",
          service: "3",
          url:"https://tg1.chacewang.com/api/home/Guest?act=tgn&name=next"
        },
        {
          configName: '空间对接',
          detailCode: 'duijie',
          icon: "icon-kjdj",
          service: "3", 
          url:'https://xyd-visit-web.9zdata.cn/wechat/map'
        }
      ]
    }
  },
  methods:{
    menuJump(item){
      if(item.appId){
        this.jumpMini(item)
      }else{
        uni.navigateTo({
          url: `/pages-d/webview/webview?url=${encodeURIComponent(item.url)}&code=${item.detailCode}`
        })
      }
    },

    // 跳转第三方小程序方法
    jumpMini(item){
      // #ifdef MP-WEIXIN
      uni.navigateToMiniProgram({
        appId:item.appId,// 第三方小程序appid
        path:item.url,// 
        envVersion:"release",
        success: res => {
            // 打开成功
            console.log("打开成功", res);
        },
        fail: err => {
            console.log(err);
        }
      })
      // #endif

      // #ifdef APP-PLUS
      plus.share.getServices((res) => {
      let weixin = res.find(i => i.id === 'weixin');
        if (weixin) {
          weixin.launchMiniProgram({
            id: item.originalId,
            path: item.url,
            type: 0
          }, (res) => {
          }, (err) => {
          });
        }
      }, (err) => {
        console.log("获取分享服务列表失败： " + JSON.stringify(e));
      });
      // #endif
    },
  }
  
}
</script>