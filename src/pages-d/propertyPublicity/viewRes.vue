<style lang="scss" scoped>
.page_bg {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  overflow-x: hidden;

}
.article-container {
  margin: 10px;
  border-radius: 5px;
  // padding: 12px 12px 18px;
}
.article-title{
  background-color: #fff;
  padding: 12px;
  h4{
    font-style: inherit;
    padding: 5px 0px;
    font-size: 32rpx;
    line-height:150%;
    font-weight: 400;
  }
}
.article-title2{
  padding: 12px;
  margin-bottom: 8px;
  background-color: #fff;
  h4{
    font-style: inherit;
    padding: 5px 0px;
    font-size:16px;
    line-height:150%;
  }
  .article-bottom{
    font-size: 3.52px;
    display: flex;
    p{
      width: 30%;
    }
    span{
      flex: 1;
    }
    div{
      padding: 2px 8px;
      color: #fff;
      text-align: center;
      border-radius: 3px;
      background-color: #C8924B;
    }
  }
}
.article-content{
  background-color: #fff;
  padding: 12px;
  font-weight: 400;
  font-size: 28.7rpx;
}
.video{
  height: calc(100vh - 80rpx);
  
}
</style>

<template>
  <view class="page_bg">
      <view class="article-container">
        <view  class="article-title">
          <h4>{{articleData.title}}</h4>
          <p style="font-size: 24rpx">{{createDateStr}}</p>
        </view>
        <view v-if="articleData.bindType!=3" class="article-content" v-html="articleData.content"></view>
        <view v-if="articleData.bindType===3" class="video">
          <object :data="articleData.content" width="100%" height="100%" type="text/html">
            Alternative Content
          </object>
        </view>
        <view class="bottom-button-container">
          <view class="praise-button" @click.stop="addLike"></view>
        </view>
      </view>
  </view>
</template>

<script>
import util from '../../js/utils';
import {
  loadArticleDetails,
  updateStatus,
} from "../../service/wxmanage";
export default {
  name: "articleDetailNew",

  data() {
    return {
      articleId: "",
      title: "",
      articleData: {
        content: "",
        isCollect:0
      },
      showShareSheet: false,
      shareMenus: {
        0: "分享给朋友",
        1: "分享到朋友圈",
      },
      praised: false,
      isCollect:false,
    };
  },

  computed: {
    createDateStr: function () {
      let self = this;
      var str = "";
      try {
        var timeStr = self.articleData.createTime;
        var yearMonthDay = timeStr.split(" ")[0];
        var month = yearMonthDay.split("-")[1];
        var day = yearMonthDay.split("-")[2];
        str = month + "月" + day + "日";
      } catch (e) {
        console.log(JSON.stringify(e));
      }
      return str;
    },
  },

  onLoad(e) {
    // this.articleId = this.$route.params.articleId;
    //造成公告阅读点击次数多加了一次
    // this.readStoryCount()
    this.articleId = e.id
    console.log(94,e.id)
    this.loadArticleDetail();
    // this.updateArticle();
  },
  methods: {
    // 收藏
    collection(){
      let status = this.articleData.isCollect
      let text = status==1 ? '取消收藏！' : '收藏成功！';
      let params ={
        articleId : this.articleId,
        userId : localStorage.memberId,
        collectStatus : status==1 ? '0' : '1',
      }
      updateCollect(params).then(res =>{
        if(res.status == '200'){
          this.articleData.isCollect = status==1 ? 0 : 1,
          this.showToast(text)
        }else{
          this.showToast('操作失败！')
        }
      })
    },

    // 提示
    showToast (tips) {
      this.$vux.toast.show({
        type: 'text',
        text: tips,
        position: 'center'
      })
    },

    updateArticle() {
      let self = this;
      let data = {
        relationPush: 1,
        relationPushId: self.articleId,
        // phone: localStorage.getItem("phoneNumber"),
        phone: phoneNumber,
      };
      updateStatus(data).then((res) => {
          if (res.status === "200") {
          } else {
            // this.$vux.toast.text(res.message, "bottom");
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    // 阅读计数
    readStoryCount() {
      readStoryCount({ articleId: this.articleId, userId: this.memberId });
    },
    loadArticleDetail() {
      console.log(163,this.$constant)
      const { MEMBER_ID } = this.$constant;
      const memberId = util.storageAction({ key: MEMBER_ID, action: 'get' });
      let params = {
             pathParams: `/${this.articleId}/${memberId}`
            }
      loadArticleDetails(params).then((res) => {
          console.log(179,res);
          if (res.status === "200") {
            this.articleData = res.data;
            console.log(182,this.articleData)
            var title = this.articleData.title;
            if (title) {
              //self.title = title;
            }
            if (this.articleData.likeFlag === 1) {
              this.praised = true;
            }
            this.$forceUpdate();
            // util.title(this.title);
            // self.settingShare()
            //设置微信分享
            this.setWxShare(this.articleData);
            // self.addReadRecord();
          } else {
            uni.showToast({
                title: 'res.message',
                icon: 'none',
                position:'bottom'
              }) 
          }
        }).catch((e) => {
          console.log(e);
        });
    },
    setWxShare(articleData) {
      this.$wxShare({
        desc: articleData.title,
        link: window.location.href + "?isWxShare=1",
      });
    },
    settingShare() {
      var self = this;
      let hostConfig = process.env.hostConfig;
      let url = findAddr(hostConfig, "article");
      url = url + "/knowledge/article/detail/" + this.articleData.articleId;
      var doms = document.getElementsByTagName("span");
      var desc = "";
      for (var i = 0; i < doms.length; i++) {
        var dom = doms[i];
        desc = desc + dom.innerText;
        if (desc.length > 30) {
          break;
        }
      }

      self.$wechat.ready(function () {
        //需在用户可能点击分享按钮前就先调用
        self.$wechat.updateAppMessageShareData({
          title: this.articleData.title, // 分享标题
          desc: desc.substr(30), // 分享描述
          link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: "../assets/images/uploadFile/icon_camera.png", // 分享图标
          success: function () {
            // 设置成功
            console.log("设置成功");
          },
        });
      });

      self.$wechat.ready(function () {
        //需在用户可能点击分享按钮前就先调用
        self.$wechat.updateTimelineShareData({
          title: this.articleData.title, // 分享标题
          link: desc.substr(30), // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: "../assets/images/uploadFile/icon_camera.png", // 分享图标
          success: function () {
            // 设置成功
            console.log("设置成功");
          },
        });
      });
    },

    addReadRecord() {
      let self = this;
      var name = "访客";
      if (localStorage.getItem("fullName")) {
        name = localStorage.getItem("fullName");
      } else if (localStorage.getItem("nickname")) {
        name = localStorage.getItem("nickname");
      }
      let params = {
        articleId: self.articleData.articleId,
        userId: localStorage.memberId,
        userName: name,
        userType: 0,
      };
      addArticleReadRecord(params)
        .then((res) => {
          console.log(res);
        })
        .catch((e) => {
          console.log(e);
        });
    },

    addLike() {
      if (this.praised) {
        this.$vux.toast.show({
          type: "text",
          text: "您已经点过赞了",
          position: "bottom",
        });
        return;
      }
      var name = "访客";
      if (localStorage.getItem("fullName")) {
        name = localStorage.getItem("fullName");
      } else if (localStorage.getItem("nickname")) {
        name = localStorage.getItem("nickname");
      }
      var userType = localStorage.getItem("isAuthUser") === "1" ? 1 : 0;
      let params = {
        businessId: this.articleData.articleId,
        userId: localStorage.getItem("memberId"),
        userName: name,
        userType: userType,
        likeType: 1,
      };
      let self = this;
      PraiseArticle(params)
        .then((res) => {
          console.log(res);
          if (res.status !== "200") {
            self.$vux.toast.show({
              type: "text",
              text: res.message,
              position: "bottom",
            });
          } else {
            self.articleData.likeCount = self.articleData.likeCount + 1;
            self.articleData.likeFlag = 1;
            self.praised = true;
          }
        })
        .catch((e) => {
          console.log(JSON.stringify(e));
        });
    },

    clickShare() {
      this.showShareSheet = true;
    },

    actionSheetClicked(menuKey, menuItem) {
      try {
        let hostConfig = process.env.hostConfig;
        let url = findAddr(hostConfig, "article");
        url = url + "/knowledge/article/detail/" + this.articleData.articleId;
        var doms = document.getElementsByTagName("span");
        var desc = "";
        for (var i = 0; i < doms.length; i++) {
          var dom = doms[i];
          desc = desc + dom.innerText;
          if (desc.length > 30) {
            break;
          }
        }
        if (this.util.isWeixin()) {
        } else {
          EbeiPlugins.shareURLToWeixin(
            menuKey,
            this.articleData.title,
            desc.substr(30),
            url,
            function () {},
            function () {}
          );
        }
      } catch (e) {
        console.log(JSON.stringify(e));
      }
    },
  },
};
</script>

