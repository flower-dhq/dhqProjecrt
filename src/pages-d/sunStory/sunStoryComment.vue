<style scoped lang="scss">
  @mixin flx-dsp($jsc, $ali, $drt:row) {
    display: flex;
    flex-direction: $drt;
    justify-content: $jsc;
    align-items: $ali;
  }
    .comment-item{
      background-color: #fff;
     display: flex;
     padding: 0 30rpx;
    align-items: center;
    justify-content: flex-start;
     .item-one {
      display: flex;
    border-bottom: 1px solid #e4e4e4;
    padding: 24rpx 0;
    width: 100%;
           image {
           width: 120rpx;
           margin-right: 40rpx;
           border-radius: 8rpx;
           height: 120rpx;
          }
          .item-text {
            display: flex;
           align-items: center;
          justify-content: space-between;
          margin-bottom: 30rpx;
          }
          .item-content {
            font-size: 28rpx;
            color: #999999ff;
          }
     }
    }
  .nodata {
    height: calc(100vh - 100rpx);
    background: url("@/static/theme-default/multiplexing/tips.png");
    background-position: center;
    background-repeat: no-repeat;
    background-size: 175px;
    position: relative;
    background-position: center 25%;
    background-color: #ffffff;
  }
  .nodata::after {
    content: "暂无数据~";
    color: #999;
    font-size: 14px;
    text-align: center;
    margin-top: 10px;
    margin-bottom: 50px;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>

<template>
  <view  id="app-page"  :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
    <!-- 故事 -->
    <u-list :border="false"  @scrolltolower="scrolltolower">
      <view>
        <view class="comment-item" v-for="(cm, index) in commentList" :key="index">
         <view class="item-one">
           <image :src="cm.img ? cm.img :require(`@/static/${[THEME_NAME]}/sunHome/avatar.png`)" alt=""/>
           <view style="flex: 1;">
             <view class="item-text">
               <view style="font-size: 30rpx;font-weight: bold;color: #000;">{{cm.name}}</view>
               <view style="color: #999999ff;font-size: 26rpx;">{{cm.time}}</view>
             </view>
             <view class="item-content">{{cm.content}}</view>
           </view>
         </view>
        </view>
        <view v-if="commentList.length == 0" class="nodata"></view>
      </view>
    </u-list>

  </view>
</template>

<script>
  import {getCommentList} from '@/service/wxmanage';

  export default {
    name: "sunStoryComment",
    data() {
      return {
        commentList: [],
        pullDownConfig: {
          content: '上拉加载数据',
          pullUpHeight: 60,
          height: 40,
          autoRefresh: true,
          downContent: '释放后加载',
          upContent: '上拉加载数据',
          loadingContent: '加载中...',
          clsPrefix: 'xs-plugin-pullup-'
        },
        isNoData:false,
        scrollerStatus: {
          pullupStatus: 'default'
        },
        currentPage: 1,
        pageSize: 10,
      }
    },
    computed: {},
    methods: {
      // 下拉加载更多数据
      loadMore() {
        if (this.isNoData) {
          uni.showToast({
            title: '已经到底了',
            type: 'text',
            icon: 'none',
            position: 'center'
          })
        } else {
          this.getArticleList();
        }
      },
      // 获取列表
      getCommentList() {
        const params = {
          data:{
            colId: "33",
          articleId: this.articleId,
          limit: this.pageSize,
          page: this.currentPage
          }
         
        };
        uni.showLoading({ title: '加载中'})
        getCommentList(params).then(res => {
          uni.hideLoading()
          if (res.status === '200'){
            const list = res.data && res.data.records && Array.isArray(res.data.records) && res.data.records || [];
            const totalCount = Number(res.total) || 0;
            if (list.length === this.pageSize) this.currentPage = this.currentPage + 1;
            if (this.commentList.length === totalCount) {
              this.isNoData = true;
            }
            list.forEach(item => {
              const {content, createTime, userName, headImgUrl} = item;
              const str = {
                img: headImgUrl ,
                name: userName || '用户名称',
                time: createTime,
                content: content,
              };
              this.commentList.push(str);
            });
          }
        }).catch(_ => {
          uni.hideLoading()
        })
      },
      onReachBottom() {
       console.log("已经到底了");
       this.loadMore()
     },
     scrolltolower(){
      console.log("已经到底了");
       this.loadMore()
     },
    },
    onLoad(option) {
      this.articleId = option.articleId
      this.getCommentList();
    },
  }
</script>


