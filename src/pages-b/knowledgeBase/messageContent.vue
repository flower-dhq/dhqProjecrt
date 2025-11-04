<template>
  <view class="page-panel" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
    <view class="content-panel " v-if="!showTip">
      <view class="content-info" v-html="quesDetail.externalReply"></view>
    </view>
    <u-modal :show="showTip" :showConfirmButton=false  width="300rpx" >
          <view class="slot-content">
                <text>该知识已无效</text>
          </view>
      </u-modal>
  </view>
</template>

<script>
import { getQuesDetail} from '@/service/knowledgeBase'

export default {
  components: {
    
  },
  data() {
    return {
      quesId:'',
      quesDetail:{},
      showTip:false
    }
  },
  computed: {
    
  
  },
  async onLoad(options) {
    uni.setNavigationBarTitle({title:'消息内容'})  
    // 获取页面传递的参数
    this.quesId = options.quesId || ''   
    await this.getDetail(this.quesId)
   
  },
  created() {
  },
  onShow() {
    uni.setNavigationBarTitle({title:'消息内容'})    
  },
  methods: {
    async  getDetail(quesId){
          const params = {
                data: {
                    quesId: quesId,
                },
                hideLoading: true,
                responseToast: false
           }
    const res = await getQuesDetail(params)
    const dataTmp = res.data || {}
    // 知识状态 0已作废  1已采纳  2草稿  3:审核中  4:不采纳
    // 除了已采纳，其他的提示，该知识已无效。
    if(dataTmp.quesStatus == 1 ){
      this.quesDetail = Object.assign({}, dataTmp)
      this.showTip = false;
    }else{
      this.showTip = true;
    }
  },
 }
}
</script>

<style lang="scss" scoped>
.page-panel {
  padding: 24rpx 20rpx;
  min-height: 100vh;
  background-color: #f3f5f9;
  box-sizing: border-box;
  font-family: "PingFang SC";
}
.content-panel {
  // padding: 24rpx 30rpx;
  // border-radius: 12rpx;
  background-color: #fff;
  box-sizing: border-box;
  margin-bottom: 24rpx;
  ::v-deep .cell-text-content {
    color: #333;
  }
  &.none-padding {
    padding: 0;
  }
}
.content-info {
  padding: 24rpx 30rpx;
}

</style>