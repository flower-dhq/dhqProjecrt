<template>
  <div id="app-page">
    <scroller :lockX="true" :use-pulldown="true" :use-pullup="true"
              :pulldown-config="{downContent: '下拉刷新', upContent: '释放后更新'}"
              :pullup-config="{upContent: '上拉加载更多', downContent: '释放后加载'}"
              @on-pullup-loading="loadMoreData"
              @on-pulldown-loading="refreshData"
              ref="storyCommentInfo">
    <div style="margin: 0px 15px;">
      <div style="margin: 20px 15px; font-weight: bold; text-align: center;">邻居们的评价</div>
      <div class="detail-list">
        <div class="detail-list-infos" v-for="item in storyCommentInfo">
          <div class="detail-list-infos-image">
            <img v-if="item.url == undefined" src="../../assets/images/huiKing/hui_home_scene.png"/>
            <img v-else :src="item.url"/>
          </div>
          <div class="detail-list-info">
            <div style="height: 36px; line-height: 36px;">
              <span style="font-weight: bold; float: left;">{{item.fullName}}</span>
              <span style="color: #A1A6BB; float: right;">{{item.commentDate}}</span>
            </div>
            <div>
              <span style="color: #D8A42F;">#{{item.categoryType}}#&nbsp;&nbsp;</span>
              <span>{{item.content}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="content-no-more-data-tip" v-if="!hasMoreData">{{noMoreDataTips}}</div>
    </div>
    </scroller>
    <loading v-model="loading" text="加载中"></loading>
  </div>
</template>

<script>
  import {
    storyCommentList,//评论列表
  } from "@/service/getDataNew.js";
  import {ready, setTitleNameAndBackgroundColor, hideOptionMenu, setBackButtonState, showOrHideCloseButton,setRightButton} from '@/assets/js/mpaasTitleStyle.js';
  export default {
    name: "huiKingStoryDetail",
    data() {
      return {
        hasMoreData: true,
        noMoreDataTips: '没有更多的数据',
        loading: false,
        pageSize: 10,
        pageNum: 1,
        totalCount: 0,
        storyCommentInfo: [
          {
            fullName: '刘德华',
            commentDate: '2019-12-03 12:33',
            content: '作为一个人，我们每天都会面临不同的事情，都会有很多感受，其中的苦辣酸甜，都谱成了一首为业主服务的歌。而共建美好家园，是我们每一个物业人共同的心愿，工程部十年如一的服务。',
            categoryType: '1'
          }
        ],
        storyId: '',
        isMpaas:true,
      }
    },
    created() {
      let self = this;
      self.storyId = this.$route.query.storyId;
      //self.loadMoreData();

      setTitleNameAndBackgroundColor("更多评论", "E6B932");
      setRightButton("","#ff00ff00");
      hideOptionMenu();
      setBackButtonState(false);
      showOrHideCloseButton(false);
    },

    methods: {
      //加载更多数据
      loadMoreData() {
        let self = this;
        if (!self.hasMoreData) {
          return
        }
        self.loading = true;
        let params = {
          "storyId": self.storyId,
          "current": self.pageNum,
          "size": self.pageSize,
        };
        storyCommentList(params,'汇景故事详情','获取评论失败').then(res => {
          if(res.status === '200'){
            self.pageNum += 1;
            self.totalCount = res.data.total;
            let commentData = res.data.records;
            for(let i = 0; i < res.data.records.length; i++){
              commentData[i].commentDate = self.setTime(commentData[i].commentDate);
            }
            self.storyCommentInfo = self.storyCommentInfo.concat(commentData);
          }else{
            self.showTips("网络异常");
          }
          self.loading = false;
          self.donePullup();
          self.checkListData();
        }).catch((err) => {
          self.loading = false;
          self.util.debugLog(err);
          self.showTips('网络异常，获取数据失败');
          self.donePullup();
        });
      },


      // 刷新列表数据
      refreshData(){
        let self = this;
        self.pageNum = 1;
        self.loading = true;
        let params={
          "storyId": self.storyId,
          "size": self.pageSize,
          "current": self.pageNum
        };
        storyCommentList(params,'汇景故事详情','获取评论失败').then(res => {
          if(res.status === '200'){
            self.pageNum += 1;
            self.storyCommentInfo = res.data.records;
            self.totalCount = res.data.total;
            for(let i = 0; i < res.data.records.length; i++){
              self.storyCommentInfo[i].commentDate = self.setTime(res.data.records[i].commentDate);
            }
          }else{
            self.showTips("网络异常");
          }
          self.loading = false;
          self.donePulldown();
          self.checkListData();
        }).catch((err) => {
          self.loading = false;
          self.util.debugLog(err);
          self.showTips('网络异常，获取数据失败');
          self.donePulldown();
        });
      },

      showTips(tip) {
        this.$vux.toast.show({
          type: 'text',
          text: tip,
          position: 'bottom'
        });
      },
      donePulldown() {
        this.$refs.storyCommentInfo.donePulldown();
        this.$refs.storyCommentInfo.reset({ top: 0 });
      },
      donePullup() {
        this.$refs.storyCommentInfo.donePullup();
        this.$refs.storyCommentInfo.reset();
      },
      checkListData() {
        if(this.totalCount === this.storyCommentInfo.length){
          this.hasMoreData = false;
        }else{
          this.hasMoreData = true;
        }
      },

      // 将后台毫秒转换成时间和日期;
      setTime(time) {
        let currentTime = Date.parse(new Date());
        let dateTime = time;//后台传递来的时间
        let d_day = Date.parse(new Date(dateTime));
        let day = Math.abs(parseInt((d_day - currentTime) / 1000 / 3600 / 24));//计算日期
        let hour = Math.abs(parseInt((d_day - currentTime) / 1000 / 3600));//计算小时
        let minutes = Math.abs(parseInt((d_day - currentTime) / 1000 / 60));//计算分钟
        let seconds = Math.abs(parseInt((d_day - currentTime) / 1000));//计算秒
        if (day > 0 && day < 2) {
          return ("昨天").toString();
        } else if (hour > 0 && hour < 24) {
          return (parseInt(hour) + "小时前").toString();
        } else if (minutes > 0 && minutes < 60) {
          return (parseInt(minutes) + "分钟前").toString();
        } else if (seconds > 0 && seconds < 60) {
          return (parseInt(seconds) + "秒前").toString();
        }else if(day >= 2 && day <= 5) {
          return (parseInt(day) + "天前").toString();
        }else {
          let date = new Date(time);
          let month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
          let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
          return date.getFullYear() + "-" + month + "-" + day;
        }
      }
    },

    watch: {
      hasMoreData: function (newVal) {
        if (newVal) {
          this.$refs.storyCommentInfo.enablePullup()
        } else {
          this.$refs.storyCommentInfo.disablePullup()
        }
      }
    }
  }
</script>

<style scoped>
  #app-page {
    height: initial;
    min-height: 100vh;
    -webkit-overflow-scrolling: touch;
    overflow: scroll;
    background: #F6F7F9;
    position: relative;
  }
  .detail-list{
    -webkit-border-radius: 8px;
    -moz-border-radius: 8px;
    border-radius: 8px;
    background: #fff;
  }
  .detail-list-infos{
    min-height: 100px;
    padding: 20px 15px 30px;
    border-bottom: 1px solid #D9DCE7;
  }
  .detail-list-infos:last-child{
    border-bottom: none;
  }
  .detail-list-infos-image{
    width: 36px;
    height: 36px;
  }
  .detail-list-infos-image img{
    width: 36px;
    height: 36px;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
  }
  .detail-list-info{
    padding-left: 50px;
    margin-top: -36px;
  }
  .content-no-more-data-tip {
    width: 100%;
    height: 45px;
    font-size: 14px;
    color: #999;
    line-height: 45px;
    text-align: center;
  }
</style>
