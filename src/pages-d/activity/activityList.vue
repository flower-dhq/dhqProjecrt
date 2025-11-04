
<style lang="scss" scoped>
.indicator {
    @include flex(row);
    justify-content: center;

    &__dot {
        height: 6px;
        width: 6px;
        border-radius: 100px;
        background-color: rgba(255, 255, 255, 0.35);
        margin: 0 5px;
        transition: background-color 0.3s;

        &--active {
            background-color: #30aed6;
        }
    }
}
.activity_swiper {
    padding: 32rpx;
}
.activity_list {
    margin: 0 20rpx;
    background-color: #ffffff;
    padding: 16rpx 32rpx;
    @include flx-dsp($jsc: flex, $ali: flex-start);
    .list_img {
        image {
            width: 200rpx;
            height: 120rpx;
        }
    }
    .defalut_img{
        image {
            width: 0rpx;
            height: 0rpx;
            opacity: 0;
        }
    }
    .list_content {
        margin-left: 20rpx;
        .content-title{
            display: flex;
        }
        .content_state {
            height: 36rpx;
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
            width:300rpx;
            display: -webkit-box;
-webkit-box-orient: vertical;
-webkit-line-clamp: 2;
overflow: hidden;
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
    height: calc(100vh - 220px);
    background: #F5F5F5;
    padding: 20rpx 0 40rpx 0;
}
.ykodList2 {
    height: calc(100vh - 30px);
    background: #F5F5F5;
    padding: 40rpx 0;

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
</style>
<template>
    <view :class="[THEME_NAME]" :style="[THEME_CSS_VAR]"> 
        <view class="activity_swiper" v-if="swiperList.length>0">
            <u-swiper :height="160" :list="swiperList" keyName="picture" @change="e => current = e.current">
                <view slot="indicator" class="indicator">
                    <template v-if="swiperList.length>1">
                        <view class="indicator__dot" v-for="(item, index) in swiperList" :key="index" :class="[index === current && 'indicator__dot--active']">
                        </view>
                    </template>
                </view>
            </u-swiper>
        </view>
         <scroll-view :class="[showTopImg?'ykodList':'ykodList2',shopNodata?'':'nodata']" scroll-y="true" @scrolltolower="scrolltolower">
            <view v-for="(item,index) in activityList" :key="index">
                <view class="activity_list" @click="jump(item)" style="position: relative;">
                    <view v-if="!defalutImg" class="list_img">
                        <image :src=" require(`@/static/${[THEME_NAME]}/activity/small-photo.png`)"></image>
                    </view>
                    <view :class=" [ defalutImg ? 'list_img' :'defalut_img' ] ">
                        <image :src=" item.coverUrl" @load="wanc"></image>
                    </view>
                    <view class="list_content">
                        <view class="content-title" style="margin-bottom: 10px;"> <text class="content_state" :class="{'activity_time_notStart_orange':notStarted(item),'activity_time_notStart_green':haveBegun(item),'activity_time_notStart_gray':endDateJudge(item)}">{{item.activityStart}}</text> <text class="content_title">{{item.title}}</text> </view>
                        <view class="content_time">{{item.createDate}}</view>
                    </view>
                   <view style="width: 8px;height: 8px;background: #FF2300;border-radius: 50%;position: absolute;right: 30rpx;top: 24rpx;" v-if="item.clickState == 0"></view>
                </view>
            </view>
            <u-divider style="margin: 15px 40px;" v-if="page===pageIndex && shopNodata" text="已无其他内容"></u-divider>

        </scroll-view>
     </view>
</template>

<script>
import { activity , changeUpdateStatus } from '../../service/wxmanage'
import { getShelvesList } from '../../service/community'
import util from '../../js/utils'
export default {
    data() {
        return {
            current: 0,
            isimage: false,
            swiperList: [],
            list: [],
            pageSize: 10,
            pageIndex: 1,
            areaId: '',
            memberId: '',
            projectId: '',
            page: 1,//总页数
            defalutImg:false,
            activityList:[]
        }
    },
    onLoad() {
        const { AREA_ID, PROJECT_ID, MEMBER_ID } = this.$constant;
        this.areaId = util.storageAction({ key: AREA_ID, action: 'get' });
        this.projectId = util.storageAction({ key: PROJECT_ID, action: 'get' });
        this.memberId = util.storageAction({ key: MEMBER_ID, action: 'get' });
        this.getAdvertising();
        this.getActivityList();
    },
    computed: {
        "showTopImg"() {
            return  this.swiperList.length>0
        },
        "shopNodata"(){
            console.log('11',this.activityList.length>0)
            return this.activityList.length>0
        }
    },
    methods: {
        wanc(e){
            this.defalutImg =true
        },
        jump(item) {
            if(item.clickState == '0'){
             this.changeUpdateStatus(item)
             item.clickState = '1'
           }
            uni.navigateTo({ url: `/pages-d/activity/activityDetail?aid=${item.aid}` });
        },
         //推阅
         changeUpdateStatus(item) {
        const { O_USER_INFO } = this.$constant;
            let { phoneNumber } = util.storageAction({ key: O_USER_INFO, action: 'get' });
            let params = {
                data: {
                    phone:phoneNumber,
                    relationPush:"3",  //关联推送1-通知公告，2-问卷调查，3-活动，4-群发通知
                    relationPushId:item.aid //关联推送ID
                },
                hideLoading: true
            }
            changeUpdateStatus(params).then(res => {
                if (res.status == '200') {
                  console.log(144,res,'已阅')
                }else {
                  console.log(109,res)
                }
            })

        },
        scrolltolower() {
            if (this.pageIndex < this.page) {
                this.pageIndex++;
                this.getActivityList()

            }

        },
        getAdvertising() {
            let that = this;
            var params = {
                data: {
                    sort: "true",
                    projectId: that.projectId,
                    recommendType: "ns_activity"
                },
                "hideLoading": true
            }
            getShelvesList(params).then(res => {
                if (res.statusCode == 200) {
                    that.swiperList = res.data.records;

                }
            });
        },
        getActivityList() {
            let that = this;
            const { O_USER_INFO } = this.$constant;
           let { phoneNumber } = util.storageAction({ key: O_USER_INFO, action: 'get' });
            var params = {
                data: {
                    pageSize: that.pageSize,
                    pageNum: that.pageIndex,
                    memberId: that.memberId,
                    projectId: that.projectId,
                    phone: phoneNumber
                },
                "hideLoading": true
            }
            activity(params).then(res => {
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
                    this.activityList = JSON.parse(JSON.stringify(that.list))
                    that.activitiesSignUpStart(that.activityList);


                }

            })
        },
        /**
        *activitiesSignUpStart():报名按钮状态切换方法
        * item:获取接口数据
        * **/
        activitiesSignUpStart(item) {
            var onRegistrationEndDate = [];
            for (var j = 0; j < item.length; j++) {
                onRegistrationEndDate.push(item[j].signUpEndDate);
                var onDate = new Date();
                var onActivityData = item[j];
                var onSignUpStartDate = new Date(onActivityData.signUpStartDate.replace(/-/g, '/'));
                var onSignUpEndDate = new Date(onRegistrationEndDate[j].replace(/-/g, '/'))
                var onStartDate = new Date(onActivityData.startDate.replace(/-/g, '/'))
                var onEndDate = new Date(onActivityData.endDate.replace(/-/g, '/'))

                if (onSignUpStartDate > onDate && onSignUpEndDate > onDate) {
                    onActivityData.activityButtonStart = false;//未到报名时间
                    onActivityData.activityStart = "未开始"
                } else if (onSignUpStartDate < onDate && onSignUpEndDate > onDate) {
                    onActivityData.activityButtonStart = true;
                    var onSignUpData = onActivityData.signUpData;
                    var onSignUpDataStart = (JSON.stringify(onSignUpData) == "{}");
                    if (onSignUpDataStart == true) {
                        onActivityData.signUpStart = "去参加";
                    } else {
                        onActivityData.signUpStart = "已参加"
                    }
                    onActivityData.activityStart = "进行中"
                } else if (onSignUpEndDate < onDate && onEndDate > onDate) {
                    onActivityData.activityButtonStart = false;//报名截止
                    onActivityData.activityStart = "已截止"
                } else if (onEndDate < onDate) {
                    onActivityData.activityButtonStart = false;//已经结束
                    onActivityData.activityStart = "已结束";
                }
            }
        },
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
            if (new Date(item.signUpEndDate.replace(/-/g, '/')) < new Date() && new Date(item.endDate.replace(/-/g, '/')) > new Date()) {
                return true
            } else if (new Date(item.endDate.replace(/-/g, '/')) < new Date()) {
                return true
            }
        },
    }
}
</script>
 