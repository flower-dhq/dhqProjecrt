
<style lang="scss" scoped>
.list-page {
    background-color: #f5f5f5;
}
.end_state_class_block{
    display: block;
}
.activity_list {
    // border: 1px solid;
    padding: 32rpx;
    @include flx-dsp($jsc: flex, $ali: flex-start);
    .list_img {
        image {
            width: 200rpx;
            height: 120rpx;
        }
    }
    .list_content {
        margin-left: 20rpx;
        .content_state {
            border-radius: 16rpx;
            font-size: 26rpx;
            color: #ffffff;
            padding: 2rpx 10rpx;
            margin-right: 10rpx;
        }
        .activity_time_notStart_orange {
            background-color: var(--app-primary-color);
        }
        .activity_time_notStart_green {
            background-color: var(--app-primary-color);
        }
        .activity_time_notStart_gray {
            background-color: #aaa;
        }
        .content_title {
            font-size: 28rpx;
            line-height: 40rpx;
            color: #555555;
        }
        .content_time {
            font-size: 24rpx;
            line-height: 17px;
            color: #999999;
            margin-top: 10rpx;
        }
    }
}
.ykodList {
    height: calc(100vh - 200px);
}
.ykodList2 {
    // height: calc(100vh - 10px);
    height: 100vh ;

}

.nodata {
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
.item-content {
    padding: 16px;
    display: flex;
    flex-direction: column;
}

.item-middle{
    background-color: #fff;
    position: relative;
}
.item-img-style{
    width: 100%;
    height: 190px;
}
.defalut_img{ 
            width: 0rpx;
            height: 0rpx;
            opacity: 0;
    }
.item-content-top{
    vertical-align: middle;
    /*padding-top: 4px;*/
    background-color: #fff;
    padding:13px 15px 0 15px;
}
.item-content-top .textTitle {
    @include ellipsis($line: 2);
  
}
.community_sign_up{
    padding:16.4rpx 0 16.2rpx 0;
    overflow: hidden;
    border-top: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .community_sign_up .left{
    // line-height: 42.6rpx;
    padding-bottom: 8rpx;
  }
.community_sign_up .left text{
    color:#999;
    font-size: 12px;
}
.community_sign_up_date{
    margin-right: 34px;
}
.community_sign_up_number text{
    color: #D8A42F;
}
.community_sign_up view.view_details_a{
    color:#A1A6BB;
    position: relative;
    padding-right: 10px;
    font-size: 12px;
    display: inline-block;
}
.community_sign_up view.right i.view_details_i{
    width: 6px;
    height: 10px;
    /* background: url('../../assets/images/communityActivities/view_details_icon.png') no-repeat; */
    display: inline-block;
    position: absolute;
    top:5px;
    right: 0px;
}
.common-button-btn-center {
    font-size: 24rpx;
    color: #fff;
    /* background: #00C6D2; */
    background: var(--app-primary-color);
    // padding: 4px;
    padding: 8rpx 24rpx;
    border-radius: 15px;
}
.common-button-btn-center text {
    font-size: 24rpx;
}
</style>
<template>
    <view class="list-page" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
         <scroll-view :class="['ykodList2',shopNodata?'':'nodata']" scroll-y="true" @scrolltolower="scrolltolower">
            <view v-for="(item,index) in list" :key="index">
                <view class="item-content">
                    <view style="border-radius: 20px;">
                    <view class="item-content-middle" @click="jump(item)">
                    <view class="item-middle">
                        <image v-if="!defalutImg"  class="item-img-style" :src=" require(`@/static/${[THEME_NAME]}/activity/big-photo.png`)"></image>
                        <image :class=" [ defalutImg ? 'item-img-style' :'defalut_img' ] "  :src="item.coverUrl" alt="" @load="wanc"></image>
                        <view class="end_state_class" :class="{'end_state_class_block':endDateJudge(item)}" >
                        </view>
                    </view>
                    </view>
                    <view class="item-content-top">
                        <view style="padding-bottom: 10px;">
                            <text style="color: #333;vertical-align:middle; font-size: 18px; color:#333;font-weight: bold;" class="textTitle">
                                {{item.title}}
                            </text>
                        </view>
                        <view style="padding:0 0 15px 0; display: none;color: #666; font-size: 28rpx;" v-if="!item.description">
                            <view>{{item.description}}</view>
                        </view>
                        <view style="padding:0 0 15px 0;color: #666; font-size: 28rpx;" v-else>
                            <text>{{item.description}}</text>
                        </view>
                        <view class="community_sign_up">
                            <view class="left" stlye="display: inline-block;">
                                <text class="community_sign_up_date">
                                    {{item.createDate}}
                                </text>
                                <text class="community_sign_up_number">
                                    <text >{{item.signUpNum}}</text>人已参加
                                </text>
                            </view>
                            <view v-if="endDateJudge(item)" class="right view_details_a" @click="jump(item)">点击查看<i class="view_details_i"></i></view>
                            <view v-else class="common-button-btn-center community_sign_up_button right" @click="jump(item)">
                                <text>{{item.signUpStart}}</text>
                            </view>
                        </view>
                    </view>
                    </view>
                </view>
            </view>
        </scroll-view>
     </view>
</template>

<script>
import { myActivities } from '../../service/wxmanage'
import util from '../../js/utils'
export default {
    data() {
        return {
            isimage: false,
            list: [],
            pageSize: 10,
            pageIndex: 1,
            areaId: '',
            memberId: '',
            projectId: '',
            page: 1,//总页数
            defalutImg:false
        }
    },
    onLoad() {
        const { AREA_ID, PROJECT_ID, MEMBER_ID } = this.$constant;
        this.areaId = util.storageAction({ key: AREA_ID, action: 'get' });
        this.projectId = util.storageAction({ key: PROJECT_ID, action: 'get' });
        this.memberId = util.storageAction({ key: MEMBER_ID, action: 'get' });
        this.getActivityList();
    },
    computed: {
        "shopNodata"(){
            console.log('11',this.list.length>0)
            return this.list.length>0
        }
    },
    methods: {
        wanc(e){
            this.defalutImg =true
        },
        jump(item) {
            uni.navigateTo({ url: `/pages-d/activity/activityDetail?aid=${item.aid}` });
        },
        scrolltolower() {
            if (this.pageIndex < this.page) {
                this.pageIndex++;
                this.getActivityList()

            }

        },
        getActivityList() {
            let that = this;
            var params = {
                data: {
                    pageSize: that.pageSize,
                    pageNum: that.pageIndex,
                    memberId: that.memberId,
                    // projectId: that.projectId
                },
                "hideLoading": true
            }
            myActivities(params).then(res => {
                if (res.statusCode == 200) {
                    if (that.pageIndex == 1) {
                        that.list = res.data.records;
                    } else {
                        that.list = that.list.concat(res.data.records)
                    }
                    for (let i = 0; i < res.data.records.length; i++) {
                        res.data.records[i].createDate = that.getDateDiff(res.data.records[i].createDate)
                    }
                    that.page = res.data.pages
                    that.activitiesSignUpStart(that.list);


                }

            })
        },
        /**
         *activitiesSignUpStart():报名按钮状态切换方法
        * item:获取接口数据
        * **/
        activitiesSignUpStart(item){
            let self=this;
            for(var j=0;j<item.length;j++){
                var onSignUpData = item[j].signUpData;
                var onSignUpDataStart = (JSON.stringify(onSignUpData) == "{}");
                if(onSignUpDataStart==true){
                item[j].signUpStart="去参加"
                }else{
                item[j].signUpStart="已参加"
                }
            }
        },
        /**
        *activitiesSignUpStart():报名按钮状态切换方法
        * item:获取接口数据
        * **/
        // activitiesSignUpStart(item) {
        //     var onRegistrationEndDate = [];
        //     for (var j = 0; j < item.length; j++) {
        //         onRegistrationEndDate.push(item[j].signUpEndDate);
        //         var onDate = new Date();
        //         var onActivityData = item[j];
        //         var onSignUpStartDate = new Date(onActivityData.signUpStartDate.replace(/-/g, '/'));
        //         var onSignUpEndDate = new Date(onRegistrationEndDate[j].replace(/-/g, '/'))
        //         var onStartDate = new Date(onActivityData.startDate.replace(/-/g, '/'))
        //         var onEndDate = new Date(onActivityData.endDate.replace(/-/g, '/'))

        //         if (onSignUpStartDate > onDate && onSignUpEndDate > onDate) {
        //             onActivityData.activityButtonStart = false;//未到报名时间
        //             onActivityData.activityStart = "未开始"
        //         } else if (onSignUpStartDate < onDate && onSignUpEndDate > onDate) {
        //             onActivityData.activityButtonStart = true;
        //             var onSignUpData = onActivityData.signUpData;
        //             var onSignUpDataStart = (JSON.stringify(onSignUpData) == "{}");
        //             if (onSignUpDataStart == true) {
        //                 onActivityData.signUpStart = "去参加";
        //             } else {
        //                 onActivityData.signUpStart = "已参加"
        //             }
        //             onActivityData.activityStart = "进行中"
        //         } else if (onSignUpEndDate < onDate && onEndDate > onDate) {
        //             onActivityData.activityButtonStart = false;//报名截止
        //             onActivityData.activityStart = "已截止"
        //         } else if (onEndDate < onDate) {
        //             onActivityData.activityButtonStart = false;//已经结束
        //             onActivityData.activityStart = "已结束";
        //         }
        //     }
        // },
        getDateDiff(setdateTimeStamp) {
            let minute = 1000 * 60;
            let hour = minute * 60;
            let day = hour * 24;

            let dateTimeStamp = new Date(setdateTimeStamp.replace(/-/g, "/"));
            let now = new Date().getTime();
            let diffValue = now - dateTimeStamp;
            if (diffValue < 0) {
                //若日期不符则弹出窗口告之
                return "结束日期不能小于开始日期！";
            }
            let dayC = diffValue / day;
            let hourC = diffValue / hour;
            let minC = diffValue / minute;
            let result = '';
            let checkDate = (date) => {
                return date < 10 ? '0' + date : date
            }
            if (dayC >= 1) {
                // result=(dateTimeStamp.getMonth()+1)+'-'+dateTimeStamp.getDate();
                result = dateTimeStamp.getFullYear() + '-' + checkDate(dateTimeStamp.getMonth() + 1) + '-' + checkDate(dateTimeStamp.getDate());
            }
            else if (hourC >= 1) {
                result = parseInt(hourC) + "个小时前";
            }
            else if (minC >= 1) {
                result = parseInt(minC) + "分钟前";
            } else {
                result = "刚刚发表";
            }
            return result;
        },
        /**
         * 判断活动报名未开始
         * **/
        notStarted(item) {
            return new Date(item.signUpStartDate.replace(/-/g, '/')) > new Date();
        },

        /**
         * 判断活动报名已开始
         * **/
        haveBegun(item) {
            return item.activityButtonStart == true && item.activityStart != '';
        },
        /**
        * 判断结束日期
        * **/
        endDateJudge(item) {
            // if (new Date(item.signUpEndDate.replace(/-/g, '/')) < new Date() && new Date(item.endDate.replace(/-/g, '/')) > new Date()) {
            //     return true
            // } else if (new Date(item.endDate.replace(/-/g, '/')) < new Date()) {
            //     return true
            // }
             return new Date(item.endDate.replace(/-/g, '/'))<new Date();
        },
    }
}
</script>
 