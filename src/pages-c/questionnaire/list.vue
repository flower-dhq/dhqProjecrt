<style scoped lang="scss">
.page_box {
    padding: 20rpx;
    background: rgb(247, 247, 247);
    height: 100%;
    box-sizing: border-box;
}
.list {
    background: #ffffff;
    margin: 40rpx 0 40rpx 0;
    position: relative;
    .box-time {
        @include flx-dsp($jsc: center, $ali: center);
        height: 60rpx;
        background: rgba(245, 245, 245, 1);
        border-radius: 38rpx;
        // width: 40%;
        width: 330rpx;
        position: absolute;
        left: 0;
        right: 0;
        // top: -14%;
        margin: auto;

        font-size: 24rpx;
        // color: #767676;
        border: 1px solid #e7e6ea;
        top: -34rpx;
        box-sizing: border-box;
    }
    .box-content {
        padding: 60rpx 20rpx 40rpx;
        .title {
            font-size: 28rpx;
            font-weight: bold;
            line-height: 34rpx;
            color: rgba(0, 0, 0, 0.8);
            border-bottom: 1px solid #e4e4e4;
            padding-bottom: 20rpx;
        }
        .Details {
            padding: 20rpx 0;
            font-size: 28rpx;
            font-weight: 400;
            // color: rgba(0, 0, 0, 0.8);
            color: #666666;

        }
        .box-btn {
            text-align: center;
        }
        .btn {
            width: 175rpx;
            height: 65rpx;
            line-height: 65rpx;
            background: rgba(255, 255, 255, 0.39);
            border: 1px solid var(--app-primary-color);
            color: var(--app-primary-color);
            opacity: 1;
            border-radius: 46rpx;
            display: inline-block;
            padding: 0 60rpx;
            font-size: 28rpx;
        }
        .results {
            border: 1px solid #d7d7d7;
            background: #d7d7d7;
            color: #fff;
            border-radius: 40rpx;
        }
    }
}
.ulist {
    height: calc(100vh - 40rpx) !important;
}
.ykodList {
    height: calc(100vh - 10px);
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
    <view v-if="!shopNodata" class="nodata"></view>
    <view v-else class="page_box"  :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
             <u-list @scrolltolower="scrolltolower" class="ulist" >
                <u-list-item v-for="(item, index) in questionList" :key="index">
                    <view class="list">
                        <view class="box-time">{{item.createDate}}</view>
                        <view class="box-content">
                            <view class="title">{{item.name}}</view>
                            <view class="Details">{{item.description}}</view>
                            <view class="box-btn" style="position: relative;">
                                <view style="width: 8px;height: 8px;background: #FF2300;border-radius: 50%;position: absolute;right: 30%;top: -6px;" v-if="item.clickState == 0"></view>
                                <view class="btn" v-if="item.answered==0 && item.formatStatus !='已结束'" @click="toDetail(item)">点击参与</view>
                                <view class="btn results" v-if="item.answered==1 && (item.formatStatus =='已结束' || item.formatStatus !='已结束')" @click="showResult(item)">查看结果</view>
                                <view class="btn results" v-if="item.answered==0 && item.formatStatus =='已结束'" @click="showToast(item)">已过期</view>
                            </view>

                        </view>

                    </view>
                </u-list-item>
            </u-list> 
    </view>
</template>

<script>
import util from '../../js/utils';

import { selectQuestionnaireByPage ,changeUpdateStatus} from '../../service/wxmanage'
import { findLocations } from '../../service/community'
export default {
    data() {
        return {
            list: [],
            indexList: [],
            current: 1,
            pageSize: 10,
            total: 0,
            pageNum: 1,
            buildingIds: '',
            questionList:[]
        }
    },
    onLoad() {
        this.init()
 
    },
    onShow(){

    },
    onReady() {
        let routes = getCurrentPages(); // 获取当前打开过的页面路由数组
        let curParam = routes[routes.length - 1].options; //获取路由参数 
        uni.setNavigationBarTitle({
            title: curParam.menuTitle
        })
    },
       computed: { 
        "shopNodata"(){
            console.log('11',this.list.length>0)
            return this.list.length>0
        }
    },
    methods: {
        async init() {
            await this.loadAddress();
            this.loadmore();
        },
        scrolltolower() {
            if (this.current < this.pageNum) {
                this.current++;
                this.loadmore()

            }
        },
        loadmore() {
             const { MEMBER_ID, AREA_ID, PROJECT_ID, O_USER_INFO } = this.$constant;
            let memberId = util.storageAction({ key: MEMBER_ID, action: 'get' });
            const areaId = util.storageAction({ key: AREA_ID, action: 'get' })
            let projectId = util.storageAction({ key: PROJECT_ID, action: 'get' });
            let {companyId} = util.storageAction({ key: O_USER_INFO, action: 'get' });
            let { phoneNumber } = util.storageAction({ key: O_USER_INFO, action: 'get' });
            var params = {
                data: {
                    buildingIds: this.buildingIds ? this.buildingIds.join(',') : '',
                    companyId: companyId,
                    current: this.current,
                    isSendMsg: 1,
                    areaId,
                    projectId: projectId,
                    size: this.pageSize,
                    souseFlag: "0",
                    userId: memberId,
                    phone: phoneNumber,
                    from:"1", //业主端标识
                },
                // hideLoading: true,
            }
            selectQuestionnaireByPage(params).then(res => {
                if (res.statusCode == 200) {
                    if (this.current == 1) {
                        this.list = res.data.list || [];
                         this.pageNum = res.data.pages || 0;

                    } else {
                        this.list = this.list.concat(res.data.list)

                    }
                    this.questionList = JSON.parse(JSON.stringify(this.list))
                }

            })
        },
        // 加载认证地址
        loadAddress() {
            return new Promise((resolve, reject) => {
                const { MEMBER_ID,PROJECT_TYPE } = this.$constant;
 
                let memberId = util.storageAction({ key: MEMBER_ID, action: 'get' });
                let projectType = util.storageAction({ key: PROJECT_TYPE, action: 'get' });
                console.log('memberId', memberId);
                console.log('PROJECT_TYPE', projectType);
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
        toDetail(item) {
            if(item.clickState == '0'){
             this.changeUpdateStatus(item)
             item.clickState = '1'
           }
            uni.navigateTo({ url: `/pages-c/questionnaire/detail?id=${item.id}` });

        },
        showResult(item) {
            if(item.clickState == '0'){
              this.changeUpdateStatus(item)
              item.clickState = '1'
           }
            uni.navigateTo({ url: `/pages-c/questionnaire/viewResults?id=${item.id}` });

        },
        showToast(item){
            uni.showToast({ title: "问卷已过期", icon: 'none' })
            if(item.clickState == '0'){
              this.changeUpdateStatus(item)
              item.clickState = '1'
           }
        },
         //推阅
         changeUpdateStatus(item) {
        const { O_USER_INFO } = this.$constant;
            let { phoneNumber } = util.storageAction({ key: O_USER_INFO, action: 'get' });
            let params = {
                data: {
                    phone:phoneNumber,
                    relationPush:"2",  //关联推送1-通知公告，2-问卷调查，3-活动，4-群发通知
                    relationPushId:item.id //关联推送ID
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
    },

}
</script>
 