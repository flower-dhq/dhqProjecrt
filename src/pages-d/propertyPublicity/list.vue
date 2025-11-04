<style scoped>
  .bg{
    background-color: white;
    width: 100%;
    border: 1px solid white;
  }
  .divlist{
    margin-top: 10px;
  }

  .divx{
    /* width: 100%; */
    height: 434rpx;
    margin: 10px;
  }
  .imglist{
    /* width: 95%; */
    height: 320rpx;
    border-radius: 8px;
    overflow: hidden;
  }
  .defalut_img{
    width: 0rpx;
    height: 0rpx;
    opacity: 0;

  }
  .divy{
    font-weight:900;
    margin-top: 10px;
    font-size: 30rpx;
    color:#333;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2; /* 可以显示的行数，超出部分用...表示*/
    -webkit-box-orient: vertical;
  }
    .base-lien {
      position: relative;
      /*margin: .3rpx auto .2rpx auto;*/
      margin: 10px auto;
      width: 4.76rpx;
      height: .8rpx;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      font-size: .3rpx;
    }

  .base-lien p{
    width: 100%;
    height: 1px;
    background-color: #e0e0e0;
  }
  .base-lien span{
    position: absolute;
    top: 50%;
    left: 50%;
    width: 1.8rpx;
    height: .4rpx;
    text-align: center;
    background-color: #f5f5f5;
    transform: translate(-50%, -50%);
    display: block;
    color: #ACACAC;
  }
  .page_box {
    /* padding: 20rpx; */
    background: rgb(247, 247, 247);
    height: 100%;
    box-sizing: border-box;
}

.nodata {
    height: calc(100vh - 100rpx);
    background: url("@/static/theme-default/multiplexing/tips.png");
    background-position: center;
    background-repeat: no-repeat;
    background-size: 175px;
    position: relative;
    top:0;
    background-position: center 25%;
    background-color: #ffffff;
}
.nodata::after {
    content: "暂无数据~";
    color: #999;
    font-size: 28rpx;
    text-align: center;
    margin-top: 20rpx;
    margin-bottom: 100rpx;
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
  <view  :class=" [THEME_NAME,shopNodata ? '' : 'nodata' ]" :style="[THEME_CSS_VAR]" class="page_box">
    <view class="bg">
      <view class="divlist" v-for="(item,index) in announcementList"  @click="preview(item)"  :key="index">
        <view class="divx" >
          <view v-if="!defalutImg" class="imglist">
                <image :src=" require(`@/static/${[THEME_NAME]}/activity/big-photo.png`)" style="width:100%;height: 100%;"></image>
          </view>
          <view :class=" [ defalutImg ? 'imglist' :'defalut_img' ] ">
                <image :src=" item.imgIds ? item.imgIds[0] : require('@/static/theme-default/sunHome/no-pictures.jpg')"  style="width:100%" @load="wanc"></image>
          </view>
          <view class="divy" >
            {{item.title}}
          </view>
        </view>
      </view>
    </view>
    <!-- // <view v-if="haveFamily" style="height: 100vh;background-color: #FFFFFF;text-align: center;">
    //   <image  style="width: 175px;height: 175px;margin-top: 30vh;  background-size: 100%" :src="`@/static/${[THEME_NAME]}/multiplexing/tips.png`"/>
    //   <view style="text-align: center;height: 20px;
    //     font-size: 14px;
    //     font-family: PingFang SC;
    //     font-weight: 400;
    //     line-height: 33px;
    //     color: #999999;
    //     opacity: 1;">
    //     <span>暂无数据</span>
    //   </view>
    // </view> -->
    <view style="padding-top:15px;padding-bottom:15px;color:#999999">
      <u-loadmore  v-if=" announcementList && announcementList.length!=0"  :status="status" :nomore-text="nomoreText" background-color="#fbf9fe" 
				line color="#999999" ></u-loadmore>
    </view>
      <u-loading-icon :show="loading" text="加载中" mode="circle"></u-loading-icon>
      <u-toast ref="uToast"></u-toast>
  </view>
</template>

<script>
import util from '../../js/utils';
import {queryArticalList,addClickCountByIds} from "../../service/wxmanage";
import { findLocations } from '../../service/community'
  export default {
    name: "propertyPublicity",
    data () {
      return {
        status:'nomoreText',
        nomoreText:"已无其它内容",
        announcementList: [],
        loading:false,
        haveFamily:false,
        params: {
          page:1,
          limit: 20,
        },
        defalutImg:false
      }
    },
    onLoad(){
      const { MEMBER_ID, PROJECT_ID } = this.$constant;
      let projectId = util.storageAction({ key: PROJECT_ID, action: 'get' });
      this.params.page = 1;
      this.params.colId = 18;
      this.params.projectId=projectId;
      this.init();
    },
    computed: { 
        "shopNodata"(){
            // console.log('11',this.announcementList.length>0)
            return this.announcementList.length>0
        }
    },
    methods:{
      wanc(e){
            this.defalutImg =true
        },
      async init() {
            // await this.loadAddress(); // 暂时没用到先注释
            this.initialize();
        },
      initialize(){
        let self = this;
        self.fetching = true;
        self.loading = true;
        var params ={
          data:{
            colId:'18',
            limit:20,
            page:1,
            projectId:this.params.projectId
          }
        }
        queryArticalList(params).then(res => {
          self.loading = false;
          self.fetching = false;
          if (res.status === '200') {
            var tmpArray = res.data.records;
            tmpArray = tmpArray.map(self.convertTime);
            if (self.params.page === 1) {
              self.announcementList = tmpArray;
            }
            else {
              self.announcementList = self.announcementList.concat(tmpArray);
            }
            if (self.announcementList.length < res.data.total) {
              self.showLoadMore = true;
            }
            else {
              self.showLoadMore = false;
            }
            self.haveFamily = self.announcementList.length > 0 ? false:true;

          }
          else {
            this.$refs.uToast.show({
                   message:'res.message',
                   position: 'bottom'
                  })
          }
        }).catch(e => {
          console.log(e);
          self.haveFamily = true;
          self.fetching = false;
        });


      },    
        // 加载认证地址
      loadAddress() {
        return new Promise((resolve, reject) => {
            const { MEMBER_ID,PROJECT_TYPE } = this.$constant;
             let memberId = util.storageAction({ key: MEMBER_ID, action: 'get' });
             let projectType = util.storageAction({ key: PROJECT_TYPE, action: 'get' });
            var params = {
                data: {
                    "memberId": memberId,
                    "projectType": projectType
                    },
                hideLoading: true,
                 pathParams: '/1'
            }
                findLocations(params).then(res => {
                    if (res.statusCode == 200) {
                        let list = res.data.authBuildings;
                        let ids = [];
                        list.forEach(item => {
                            if (item.authType === 1) {
                                ids.push(item.buildingId)
                            }
                        });
                        this.buildingIds = Array.from(new Set(ids));
                        resolve()
                    }

                })
            })
        },
      convertTime (item) {
        var timeStr = item.createTime + ':00';
        var yearMonthDay = timeStr.split(' ')[0];
        var month = yearMonthDay.split('-')[1];
        var day = yearMonthDay.split('-')[2];
        item.formatTime = month+'月'+day+'日';
        return item;
      },
      preview (item) {
          uni.navigateTo({ url: `/pages-d/propertyPublicity/viewRes?id=${item.articleId}` });
      },
    }
  }
</script>

