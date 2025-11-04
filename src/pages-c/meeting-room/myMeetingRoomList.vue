<style lang="scss" scoped>
.page {
    background-color: #f7f9fc;
    height: 100%;
    overflow: auto;
}
.list-box {
    padding: 20rpx;
}
.box {
    background: #ffffff;
    border-radius: 16rpx;
    padding: 20rpx;
    margin-bottom: 20rpx;
}
.box-content {
    margin: 20rpx 0;
    font-size: 28rpx;
    color: #666666;
    .data-time {
        display: flex;
        justify-content: space-between;
    }
}
.header-state {
    font-size: 14px;

    &.blue {
        color: #44bcfe;
    }
    &.pink {
        color: #ff0167;
    }
    &.green {
        color: #21c743;
    }
    &.yellow {
        color: #C8924B;
    }
    &.grey {
        color: #999999;
    }
    &.red {
        color: #ff0101;
    }
}
.sticky-box {
    top: 0 !important;
}
// flex，水平
.flex-row {
    display: flex;
}
// flex，自由伸缩
.flex-stretch {
    flex: 1;
    overflow: hidden;
    font-size: 28rpx;
    font-weight: bold;
}
// flex，固定大小
.felx-fixed {
    flex-grow: 0;
    flex-shrink: 0;
}
// 一行省略
.ellipsis-one {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.line {
    border-top: 1px solid #e4e4e4;
    margin: 20rpx;
}

.card-footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
}
.mini-btn {
    margin: 0;
    /* #ifdef MP-WEIXIN */
    background-color: #007aff !important;
    /* #endif */
}

.scroll-content {
    height: calc(100vh - 70px);
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
::v-deep .u-tabs__wrapper__nav__item {
  position: relative;
}
::v-deep .u-badge{
	position: absolute;
	right: 0;
	top: 12rpx;    
}
::v-deep .cell-text-label text{
	font-size: 24rpx;  
}
::v-deep .u-tabs__wrapper__nav__item{
  flex:1;
}
.slot-content {
    ::v-deep .u-input {
        box-sizing: border-box !important;
        border: 1px solid #D6D7D9;
        padding: 6px 8px !important;
    }
}
</style>
<template>
    <view class="page" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
        <u-sticky bgColor="#fff" class="sticky-box" :offset-top="0">
            <!--  :scrollable="true" -->
            <u-tabs :list="list1" @change="change">
            </u-tabs>
        </u-sticky>
        <view class="list-box" :class="[showNodata?'':'nodata']">
            <scroll-view class="scroll-content" scroll-y="true" @scrolltolower="scrolltolower" :lower-threshold="10">
                <view class="box" v-for="(item,index) in meetingList" :key="index">
                    <view class='flex-row'>
                        <text class='flex-stretch ellipsis-one'>{{item.meetingName}}</text>
                        <span :class="['header-state',getOrderState(item).color]">{{getOrderState(item).text}}</span>
                    </view>
                    <view class="box-content" @click="jump(item)">
                        <view>参会人数：{{item.numberOfParticipants}}人</view>
                        <view class="data-time">
                            <text>
                                会议日期：{{getDate(item)}}
                            </text>
                            <div class='content-price flex-fixed flex-column' v-if="meetingState == 3">
                                <!-- 价格 -->
                                <meeting-price :number='getTotalPrice(item)' suffix='元' color="#00C6D2"/>
                            </div>
                        </view>
                        <view>会议时间：{{getTime(item)}}</view>
                    </view>
                    <!-- 底部按钮 -->

                    <view class='card-footer flex-row'>
                        <!-- 待审核，待支付，待开放(不包含审批拒绝和已取消) -->
                        <button v-if="item.orderState == 1 || item.orderState == 4 || (item.orderState != 7 && item.orderState != 2 && item.openState == 0)" class="mini-btn" size="mini" type="primary" @click="handleCancel(item)">取消</button>
                        <!-- 待支付 -->
                        <button v-if="item.orderState == 4" @click="handlePayment" type="primary" text="去支付" class="mini-btn" size="mini">去支付</button>
                        <!-- 待确认定损费用 -->
                        <button v-if="item.orderState == 6 && item.compensationState == 2" type="primary" text="确认费用" class="mini-btn" size="mini">确认费用</button>

                    </view>
                </view>
            </scroll-view>
        </view>
        <u-modal :show="showCancelRationale" title="请输入取消理由" width="300px" :showCancelButton="true" @confirm="submitLy" @cancel="cancelLy">
            <view class="slot-content">
                <!-- border="surround" -->
                <u--input v-model="rationale" border="none" clearable></u--input>
            </view>
        </u-modal>
    </view>
</template>

<script>
import { queryPageMyMeetingCount, queryPageMyMeeting, cancelMyMeeting } from '@/service/meeting'
import MeetingPrice from './components/meeting-price.vue'
export default {
    components: {
        MeetingPrice,
    },
    data() {
        return {
            meetingState: 1,
            list1: [{
                name: '进行中',
                index: 1,
                badge: { value: 0 }
            }, {
                name: '已完成',
                index: 3,
                badge: { value: 0 }
            },{
                name: '已驳回',
                index: 2,
                badge: { value: 0 }
            }, {
                name: '已取消',
                index: 4,
                badge: { value: 0 }
            }],
            meetingList: [],
            pageIndex: 0,
            page: 1,
            rationale: '',//取消理由
            showCancelRationale: false,

        }
    },
    onLoad() {
        this.statusCount();
        this.scrolltolower();        
    },
    // onShow() {
    //     // 从详情页取消返回该页面的获取数据
    //     uni.$on('refreshData',() => {
    //        this. list1 = [{
    //             name: '进行中',
    //             index: 1,
    //         }, {
    //             name: '已完成',
    //             index: 3,
    //         }, {
    //             name: '已驳回',
    //             index: 2,
    //         }, {
    //             name: '已取消',
    //             index: 4,
    //         }],
    //        this.meetingList= [],
    //         this.statusCount();
    //         this.scrolltolower();

    //     })
    // },
    computed: {
        "showNodata"() {
            return this.meetingList.length > 0
        }
    },
    methods: {
        jump(item) {
            uni.navigateTo({ url: `/pages-c/meeting-room/my-meeting-detail?orderId=${item.orderId}` });

        },
        scrolltolower() {
            if (this.pageIndex == 0 || this.pageIndex < this.page) {
                this.pageIndex++;
                if (this.pageIndex == 1) {
                    this.meetingList = [];
                }
                this.getList()

            }

        },
        statusCount() {
            queryPageMyMeetingCount().then(res => {
                if (res.data.status == 10000) {
                    let data = res.data.data;
                    this.list1.forEach(item => {
                        if (item.index == 1) {
                            // item.name = `${item.name}(${data.dfk || 0})`
                            item.badge.value = data.dfk
                        } else if (item.index == 2) {
                            // item.name = `${item.name}(${data.clz || 0})`
                            // item.name = `${item.name}(${data.ybh || 0})`
                            item.badge.value = data.ybh
                        } else if (item.index == 3) {
                            // item.name = `${item.name}(${data.ywc || 0})`
                            item.badge.value = data.ywc
                        } else if (item.index == 4) {
                            // item.name = `${item.name}(${data.yqx || 0})`
                            item.badge.value = data.yqx
                        }
                    });
                }
            })
        },
        async getList() {
            const params = {
                data: {
                    pageNum: this.pageIndex,
                    pageSize: 10,
                    state: this.meetingState


                }
            }
            const { data } = await queryPageMyMeeting(params);
            let arrTmp = data.data ? data.data.row : [];
            this.page = data.data.total ? Math.ceil(data.data.total / 5) : 1;
            if (this.pageIndex == 1) {
                this.meetingList = arrTmp;
            } else {
                this.meetingList = this.meetingList.concat(arrTmp)
            }
        },
        change(item) {
            if(item.index == 2){
                this.meetingState = 5
            }else if(item.index == 1){
                this.meetingState = 3;
            }else {
                this.meetingState = item.index + 1;
            }
            this.pageIndex = 0;
            this.scrolltolower();

        },
        /**
          * 获取订单状态
          * orderState: 订单状态 { 1: 待审核, 2: 已驳回, 3: 已完成, 4: 待支付, 5: 待确认收款, 6: 进行中, 7: 已取消 }
          * openState: 开放状态 { 0: 待开放, 1: 执行中, 2: 待定损, 3: 已执行 }
          * payState: 支付状态 { -1: 线下支付, 1: 待支付, 2: 待确认收款, 3: 已完成支付, 4: 已取消 }
          * compensationState: 定损状态 { -1: 未产生定损费用, 0: 未定损, 1: 已现场验收, 2: 财务部已定损 }
          */
        getOrderState(item) {
            if (item.orderState == 2) {
                return { text: '申请失败', color: 'red' }
            } else if (item.orderState == 7) {
                return { text: '已取消', color: 'grey' }
            } else if (item.orderState == 3) {
                return { text: '已完成', color: 'grey' }
            } else if (item.orderState == 6 && item.compensationState == 2) {
                // 待确认定损费用
                return { text: '待确认', color: 'yellow' }
            } else if (item.orderState == 6 && item.compensationState == 1) {
                return { text: '处理中', color: 'blue' }
            } else if (item.orderState == 1) {
                return { text: '审核中', color: 'pink' }
            } else if (item.orderState == 6 && item.openState == 0) {
                return { text: '待物业确认布场', color: 'green' }
            } else if (item.orderState == 4) {
                return { text: '待支付', color: 'yellow' }
            } else if (item.orderState == 5) {
                return { text: '待确认收款', color: 'yellow' }
            } else {
                return { text: '处理中', color: 'blue' }
            }
        },
        // 获取会议日期
        getDate(data) {
            const weeks = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
            // 例如 '2000-12-16 08:00~15:00'
            const date = data.reserveDate.split(' ')[0]
            const day = weeks[new Date(date.replace(/-/g, '/')).getDay()]

            // 例如 '2000-12-16 周四'
            return date + ' ' + day
        },
        // 获取会议时间，例如 '08:00~15:00'
        getTime(data) {
            return data.reserveDate.split(' ')[1]
        },
        getTotalPrice(item) {
            return (Number(item.payPrice || '') + Number(item.compensationPrice || '')).toFixed(2)
        },
        handleCancel(item) {
            this.rationale = "";
            this.orderId = item.orderId
            this.showCancelRationale = true;
        },
        submitLy() {
            var params = {
                data: {
                    orderId: this.orderId,
                    cancelReason: this.rationale
                }
            }
            cancelMyMeeting(params).then(res => {
                if (res.data.status == 10000) {
                    this.showCancelRationale = false;
                    uni.showToast({
                        title: '取消成功',
                        duration: 2000,
                        icon: 'none'
                    })
                    // setTimeout(() => {
                    //     uni.navigateBack({
                    //         delta: 1
                    //     });
                    // }, 2000)
                    this.statusCount();
                    this.pageIndex = 1
                    this.meetingState = 1
                    this.getList()
                    // this.scrolltolower();  

                } else {
                    uni.showToast({
                        title: res.data.message,
                        duration: 2000,
                        icon: 'none'
                    })

                }
            })
        },
        cancelLy() {
            this.showCancelRationale = false;
            this.rationale = "";
        }

    }

}
</script>
 