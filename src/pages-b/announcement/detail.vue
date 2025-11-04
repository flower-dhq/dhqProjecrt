<template>
  <view class="page-panel" :style="[THEME_CSS_VAR]">
    <u--text :text="detailData.title" bold :size="20" lineHeight="20px" wordWrap="anywhere" />
    <text class="time-box">{{createDateStr}}</text>
    <!-- <u--text :text="createDateStr" :size="14" lineHeight="17px" color="#8f9ca2" /> -->
    <rich-text :nodes="detailData.content" />
  </view>
</template>

<script>
import { loadArticleDetail, updateStatus } from '@/service/wxmanage'
import Utils from '@/js/utils'

export default {
  name: 'Detail',
  data() {
    const { MEMBER_ID } = this.$constant

    return {
      memberId: Utils.storageAction({ key: MEMBER_ID, action: 'get' }),
      detailData: {
        title: '',
        createTime: '',
        content: ''
      }
    }
  },
  created() {
    this.updateStatus()
    this.getDetail()
  },
  onLoad(options){
    if(options.type == "guide"){
      uni.setNavigationBarTitle({
      	title: '指南详情'
      });
    }
  },
  computed: {
    createDateStr: function() {
      let self = this;
      var str = "";
      if(self.detailData.createTime){
        try {
          var timeStr = self.detailData.createTime;
          var month = timeStr.split("-")[0];
          var day = timeStr.split("-")[1];
          str = month + "月" + day + "日";
        } catch (e) {
          console.log(JSON.stringify(e));
        }
      }
      return str;
    }
  },
  methods: {

    async getDetail() {
      const { articleId } = await Utils.getPageQuery()
      const params = {
        pathParams: `/${articleId}/${this.memberId}`
      }
      const res = await loadArticleDetail(params)
      this.detailData = Object.assign({}, res.data || {}, {
        createTime: uni.$u.timeFormat(res.data?.createTime || '', 'mm-dd')
      })

      this.setWXShare(res.data)
    },
    async updateStatus() {
      let { O_USER_INFO} = this.$constant;
      let {  phoneNumber } = Utils.storageAction({ key: O_USER_INFO, action: 'get' }); 

      const { articleId } = await Utils.getPageQuery()
      const params = {
        data:{
          relationPush: 1,
          relationPushId: articleId,
          phone: phoneNumber
        } 
      } 
      await updateStatus(params)
    },
    /**
     * 设置微信分享给朋友
     */
    setWXShare(data) {
      // #ifdef APP-PLUS
      // 配置再开启
      // uni.share({
      //   provider: 'weixin',
      //   scene: 'WXSceneSession',
      //   type: 0,
      //   href: data.url,
      //   title: data.title,
      //   summary: '',
      //   imageUrl: data.imgUrl
      // })
      // #endif
      // #ifdef H5

      // #endif
    }
  }
}
</script>

<style lang="scss" scoped>
.page-panel {
  display: flex;
  flex-direction: column;
  padding: 10px;
}
uni-rich-text {
  padding: 30px 0 10px;
  font-size: 16px;
}
.time-box{
  padding: 20rpx 0 40rpx;
  color: #8f9ca2;
  font-size: 28rpx;
}
</style>