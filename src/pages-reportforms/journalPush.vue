<!--  -->
<template>
    <view class='pagesbox'>
        <u-list @scrolltolower="scrolltolower">
            <template v-if="dataList.length > 0">
                <view class="box" v-for="(item, index) in dataList" :key="index">
                    <view class="cell">
                        <view class="cell-title">订阅名称：</view>
                        <view class="cell-value">{{ item.subscribeName }}</view>
                        <view class="cell-status" :class="{ 'cell-status2': item.isRead == 1 }">{{ item.isRead ==
                            1 ? '已读' : '未读' }}</view>
                    </view>
                    <view class="cell">
                        <view class="cell-title">统计组织：</view>
                        <view class="cell-value">{{ item.archName }}</view>
                    </view>
                    <view class="cell">
                        <view class="cell-title">统计时间：</view>
                        <view class="cell-value">{{ item.statisticDate }}</view>
                    </view>
                    <view class="cell">
                        <view class="cell-title">统计类型：</view>
                        <view class="cell-value">{{ item.pushType }}</view>
                    </view>
                    <u-gap height="1" bgColor="#EBEBEB"></u-gap>
                    <view class="cell" style="line-height: 88rpx;" @click="jumpDetail(item)">
                        <text class="cell-btn">查看详情</text>
                        <u-icon name="arrow-right" color="#2761FF" size="12"></u-icon>
                    </view>
                </view>
            </template>
            <view v-else style=" margin: 30px 0 0; text-align: center;">
                <image :src="require(`@/static/${[THEME_NAME]}/common/icon-noData.png`)"></image>
            </view>
        </u-list>
    </view>
</template>

<script>

export default {
    components: {},
    props: {
        dataList: {
            type: Array,
            default: () => {
                return []
            }
        },
        total: {
            type: Number,
            default: 0
        },
        pageIndex: {
            type: Number,
            default: 1
        },
        pages: {
            type: Number,
            default: 1
        },

    },
    data() {
        return {

        };
    },
    computed: {},
    watch: {},
    methods: {
        scrolltolower() {
            if (this.pages > this.pageIndex) {
                let num = this.pageIndex + 1;
                this.$emit('changePage', { num: num })

            }
        },
        jumpDetail(item) { 
            uni.navigateTo({ url: `/pages-reportforms/main-report-forms?pushLogId=${item.pushLogId}&statisticDate=${item.statisticDate}` })
        }
    },
    created() {

    },
    mounted() {

    },
}
</script>
<style scoped lang="scss">
.pagesbox {
    box-sizing: border-box;
    width: 100%;
    background-color: #f5f6f8;
    // padding: 20rpx;
    // overflow: auto;
    // height: calc(100% - 100rpx);
    // overflow: auto;

}
.pagesbox ::v-deep .u-list{
    height: calc(100vh - 204px) !important;
}
.box {
    background: #FFFFFF;
    padding: 30rpx 30rpx 0;
    margin: 0 0 24rpx 0;
    box-sizing: border-box;

    .cell {
        display: flex;
        font-size: 28rpx;
        font-weight: 500;
        padding: 10rpx 0;
        // line-height: 60rpx;
        align-items: unset;
        box-sizing: border-box;

        .cell-title {
            color: #666666;
            width: 140rpx;
        }

        .cell-value {
            color: #333333;
            flex: 1;
        }

        .cell-status {
            color: #2761FF;
            text-align: right;
            width: 80rpx;
        }

        .cell-status2 {
            color: #999999;
        }

        .cell-btn {
            color: #2761FF;
        }
    }
}
</style>