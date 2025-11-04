<template>
  <view class="page-panel" :style="[THEME_CSS_VAR]">
    <u--text :text="detailData.title" bold :size="15" lineHeight="15px" wordWrap="anywhere"/>
    <!-- <text class="time-box">{{createDateStr}}</text> -->
    <!-- <u--text :text="createDateStr" :size="14" lineHeight="17px" color="#8f9ca2" /> -->
    <rich-text :nodes="detailData.content" />
  </view>
</template>

<script>
import { loadArticleDetail } from '@/service/wxmanage'
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
    this.getDetail()
  },
  onLoad(options){
      uni.setNavigationBarTitle({
      	title: '消息详情'
      });
  },
  onShow(){
    
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
      if(res.status != '200'){
        this.detailData.title = '资源不存在'
      }
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
::v-deep .u-text__value {
  margin-bottom: 4px;
}
uni-rich-text {
  padding: 30px 0 10px;
  font-size: 16px;
}

</style>