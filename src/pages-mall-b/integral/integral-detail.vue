<style scoped lang="scss">
.integral-detail{
    width: 100%;
    min-height: 100%;
    background-color: #f7f7f7;
    $pd: 70rpx;
    .total-integral{
        @include flx-dsp($jsc: flex-start, $ali: center);
        width: 100%;
        height: 150rpx;
        padding: 0 $pd;
        box-sizing: border-box;
        text{
            font-size: 70rpx;
            color: $cl-color-primary;
        }
    }
    .tab-bar{
        $h: 86rpx;
        width: 100%;
        height: $h;
        padding: 0 $pd;
        box-sizing: border-box;
        margin-bottom: 30rpx;
        .fixed{
            &.tab-fixed{
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                padding: 0 $pd;
                box-sizing: border-box;
                background-color: #fff;
                border-bottom: 1rpx solid #f7f7f7;
            }
            width: 100%;
            height: $h;
        }
        .tab-container{
            @include flx-dsp($jsc: flex-start, $ali: center);
            & > text{
                $bdl: 4rpx;
                width: 33.33%;
                &:nth-child(2) {
                    text-align: center;
                }
                &:nth-child(3) {
                    text-align: right;
                }
                .active-tab{
                    color: $cl-color-primary;
                    border-bottom: $bdl solid $cl-color-primary;
                }   
                text{
                    border-bottom: $bdl solid transparent;
                    font-size: 32rpx;
                    padding: 20rpx 0;
                }
            }
        }
    }
    .integral-list{
        width: 690rpx;
        margin:  auto;
        border-radius: 20rpx;
        box-sizing: border-box;
        padding: 0 30rpx;
        background-color: #fff;
        .integral-item{
            &:last-child{
                border-bottom: none;
            }
            &.sum-item{
                border-bottom: none;
                padding: 20rpx 0 0 0;
            }
            width: 100%;
            border-bottom: 1rpx solid #f2f2f2;
            padding: 20rpx 0;
            .cont-row{
                @include flx-dsp($jsc: space-between, $ali: center);
                text{
                    &.int-got{
                        color: $cl-color-primary;
                    }
                    font-size: 28rpx;
                }
            }
            .create-time{
                color: #d8d8d8;
                font-size: 24rpx;
            }
            .summary{
                @include flx-dsp($jsc: flex-start, $ali: center);
                padding-bottom: 20rpx;
                .got{
                    color: $cl-color-primary;
                    padding: 0 10rpx;
                }
                .used{
                    padding-left: 10rpx;
                }
                text{
                    font-size: 30rpx;
                }
            }
            .mgl{
                margin-left: 4rpx;
            }
        }
    }
    ::v-deep .cl-divider__line{
		background: #d6d6d6 !important;
	}
}
</style>

<template>
	<view class="integral-detail">
        <!-- 总积分 -->
        <view class="total-integral">
            <text>{{allIntegral}}</text>
        </view>
        <!-- tab栏 -->
        <view class="tab-bar">
            <view class="fixed" :class="{'tab-fixed': isFixed}">
                <view class="tab-container">
                    <text v-for="(item, index) in tabData" :key="index">
                        <text @tap="switchTab(index)" :class="{'active-tab': index === tabIndex}" >{{item.tabName}}</text>
                    </text>
                </view>
            </view>
        </view>
        <!-- 积分明细列表 -->
        <view class="integral-list">
            <view class="integral-item" :class="{'sum-item': item.summary}" v-for="(item, i) in listData" :key="i">
                <template v-if="item.summary">
                    <view class="summary">
                        <text>
                            {{item.dateStr}}<text class="mgl" v-if="tabIndex !== 2">获取<text class="got">{{item.get}}</text> </text>
                            <text class="mgl" v-if="tabIndex !== 1">已使用<text class="used">{{item.used}}</text></text>
                        </text>
                    </view>
                </template>
                 <template v-else>
                     <view class="cont-row">
                        <text>{{item.title}}</text>
                        <text :class="{'int-got': item.type}">{{item.integral}}</text>
                    </view>
                    <text class="create-time">{{item.time}}</text>
                </template>
            </view>
        </view>
        <!-- 加载更多 -->
        <cl-loadmore v-if="inited" :text="tabLoad.text" :finish-text="tabLoad.finishText" :finish="!tabLoad.hasData" :loading="tabLoad.pending"></cl-loadmore>
        
	</view>
</template>

<script>
	export default {
		data() {
			return {
				allIntegral: 0,
                tabIndex: 0,
                pageSize: 10,
                tabData: [
                    {
                        tabName: '全部积分',
                        tabKey: 'all'
                    },
                    {
                        tabName: '已获取',
                        tabKey: 'got'
                    },
                    {
                        tabName: '已使用',
                        tabKey: 'used'
                    }
                ],
                integralHeight: 0,
                isFixed: false,
                inited: false
			}
		},
        computed:{
            listData() {
                const tabIndex = this.tabIndex;
                return  this.tabData[tabIndex].list || [];
            },
            tabLoad() {
                const tabIndex = this.tabIndex;
                return this.tabData[tabIndex].load || {};
            }    
        },
		methods: {
            // 切换tab标签
			switchTab(index) {
                this.tabIndex = index;
                this.getDataList();
            },
            // 扩展数据结构
            expandDataField() {
				const list = this.tabData;
				list.forEach(item => {
					this.$set(item, 'list', []);
					this.$set(item, 'current', 1);
					this.$set(item, 'load', {
						pending: false,
						total: 0,
						hasData: true,
						text: '上拉滚动加载更多',
						refresh: false,
						finishText: '我的底线'
					});
				});
			},
            // 获取总积分节点高度
            getTotalIntegralDomInfo() {
                const query = uni.createSelectorQuery().in(this);
                query.select('.total-integral').boundingClientRect(data => {
                    this.integralHeight = data.height;
                }).exec();
            },
            // 获取积分明细
            getDataList(params) {
                const { init } = params || {};
                const tabIndex = this.tabIndex;
                const pageSize = this.pageSize;
                const curTab = this.tabData[tabIndex];
                const {current, list: lData} = curTab || {};
                const testPms = new Promise((resolve) => {
                    setTimeout(() => {
                        const total = tabIndex === 0 ? 18 : tabIndex === 1 ? 16 : 2;
                        const list = [];
                        const curNum = (current - 1) * pageSize;
                        const num = lData.length >= total ? total : total - lData.length >= pageSize ? pageSize : total - lData.length;
                        for (let i = 0; i < num; i++) {
                            const rd = Math.random();
                            const rdType = rd > .5 ? 1 : 0;
                            const type = tabIndex === 0 ? rdType : tabIndex === 1 ? 1 : 0;  
                            const rdTitle = rd > .3 ? '美食饮品' : rd > .6 ? '生活服务' : '交通出行';
                            const title = `${curNum + i + 1} ${tabIndex === 2 ? '积分过期' : rdTitle}`;
                            list.push({
                                title,
                                integral: `${type ? '+' : '-'}1`,
                                type: type,
                                time: "2021-08-16 11:50:23",
                            });
                        }
                        const res = {
                            statusCode: 200,
                            message: '请求成功',
                            data: {
                                records: list,
                                total
                            }
                        }
                        resolve(res)
                    }, 1000)
                });
                const canLoad = curTab.load.hasData || !lData.length;
                if (!canLoad) return;
                const {memberId} = this.$cmMth.getUserStatusInfo()
                const args = {
                    memberId
                }
                if (tabIndex) args.queryType = tabIndex === 1 ? 0 : 1;
                const prodPms = this.$mallApi.data.getIntegralDetailList({data: args, pathParams: `/${pageSize}/${current}`, hideLoading: true})  
                const pms = prodPms;
                curTab.load.pending = true;  
                return pms.then(res => {
                    curTab.load.pending = false;  
                    if (res.statusCode === 200) {
                        const list = res.data.records;
                        list.forEach(item => {
                            const {dataType, source, integralType, growthValue, createTime, desc} = item;
                            const [getInt, usedInt] = typeof desc === 'string' && desc.split(',') || []
                            const d = {
                                ...item,
                                summary: dataType === 0,
                                title: source,
                                integral: `${integralType ? '-' : '+'}${growthValue}`,
                                type: integralType ? 0 : 1,
                                time: createTime,
                                get: getInt,
                                used: usedInt
                            }
                            lData.push(d);
                        });
                        if (list.length) ++curTab.current;
                        if (init) this.inited = true;   
                        curTab.load.text = lData.length === 0 ? '暂无数据~' : '上拉滚动加载更多';
                        curTab.load.hasData = !(list.length < pageSize || list.length === 0);
                    }
                })
            },
		},
        onPageScroll(e) {
            const {scrollTop} = e || {}
            const integralHeight = this.integralHeight;
            this.isFixed = integralHeight && scrollTop >= integralHeight;
        },
        onReachBottom() {
            this.getDataList();
        },
		async onLoad(options) {
            const {myIntegral} = options;
            if (myIntegral) this.allIntegral = myIntegral; 
			this.expandDataField();
            uni.showLoading({title: '加载中'});
            await this.getDataList({init: 1}).catch();
            uni.hideLoading();
		},
        mounted() {
            this.getTotalIntegralDomInfo();
        }
	}
</script>


