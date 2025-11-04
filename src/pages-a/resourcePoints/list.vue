<!-- 资源点位  -->
<template>
    <view class="page" :style="[THEME_CSS_VAR]">
        <view class="head">
            <view class="searchBox">
                <dropdown-btn ref="btnEl" maskTop="90rpx" :navIndex="11" contentTop="16rpx" contentHeight="612rpx;"
                    @confirm="areaProjectEvent" @showMask="hideMenuEvent('btn')" :isAll="isAll" />
                <u-search shape="square" v-model="searchItem.resourceName" @search="getList" placeholder="资源编码、资源名称"
                    height="30" :showAction="false" style="margin-left: 20rpx;"></u-search>
            </view>
            <u-gap height="1" bg-color="#F3F4F7"></u-gap>
            <dropdown-filter ref="navigatorEl" :zyList="categoryData" @confirm="dropdownEvent"></dropdown-filter>
            <u-gap height="1" bg-color="#F3F4F7"></u-gap>
        </view>
        <u-list @scrolltolower="scrolltolower" height="calc(100% - 160px)">
            <view class="content-item" v-for="(item, index) in dataList" :key="index" @click="jump(item)">
                <view class="item-cell">
                    <view class="item-text-bold">{{ item.resourceName }}</view>
                    <view class="item-text-color" :class="item.usingState == 1 ? 'text-color-Orange' : 'text-color-blue'">
                        {{ item.usingStateText }}</view>
                </view>
                <view class="item-cell-box">
                    <view class="item-cell-box-left">
                        <image :src="require(`@/static/${[THEME_NAME]}/resourcePoints/icon-jdh.png`)"
                            style="width:32rpx;height:32rpx;"></image>
                        <text>{{ item.resourceCode }}</text>
                    </view>
                    <view>
                        <image :src="require(`@/static/${[THEME_NAME]}/resourcePoints/icon-dh.png`)"
                            style="width:32rpx;height:32rpx;"></image>
                        <text>{{ item.resourceTypeName }}</text>
                    </view>
                </view>
                <view class="item-cell-box">
                    <image :src="require(`@/static/${[THEME_NAME]}/resourcePoints/icon-ct.png`)"
                        style="width:32rpx;height:32rpx;">
                    </image>
                    <text>{{ item.resourceMenuPath }}</text>
                </view>
                <view v-if="item.usingState == 3" class="item-cell-box"
                    style="border-top:1px solid #F3F4F7;padding-top: 16rpx;">
                    <view class="item-cell-box-left">
                        <image :src="require(`@/static/${[THEME_NAME]}/resourcePoints/icon-rq.png`)"
                            style="width:32rpx;height:32rpx;">
                        </image>
                        <text>{{ item.period }}</text>
                    </view>
                    <view>
                        <image :src="require(`@/static/${[THEME_NAME]}/resourcePoints/icon-kh.png`)"
                            style="width:32rpx;height:32rpx;">
                        </image>
                        <text>{{ item.customerName }}</text>
                    </view>
                </view>
            </view>
        </u-list>
        <view class="foot-btn">
            <u-button text="新增资源" color="#1989F7" @click="jump"></u-button>

        </view>
    </view>
</template>

<script>
import menuAuthMixin from '@/js/mixin/menuAuthMixin'
import DropdownBtn from '@/components/dropdown-area/dropdown-btn.vue'
import { getResourceList, getLastLevelList, getCustomerTree } from '@/service/leasing';
import DropdownFilter from './dropdown-filter.vue';

export default {
    mixins: [menuAuthMixin],
    components: { DropdownBtn, DropdownFilter },
    authName: '资源点位',
    data() {
        return {
            isAll: false, // 关闭下拉框全部选项
            projectName: '公司项目',
            searchText: {
                projectName: '公司项目',
                status: '状态',
                type: '分类',
                properties: '属性'

            },
            searchItem: {
                areaId: '',
                projectId: '',
                resourceName: '',
                usingState: '',
                resourceType: '',
                resourceMenuIds: ''
            },
            pages: 1, //总页数
            pageIndex: 1,//第几页
            total: 0,//总数
            dataList: [],
            categoryData: [],
            childList: [],
            selectCategory: {}

        };
    },
    onLoad() {
    },
    onShow: function () {
    },
    computed: {},
    watch: {},
    methods: {
        scrolltolower() {
            if (this.pages > this.pageIndex) {
                this.pageIndex++;
                this.getList()
            }
        },
        areaProjectEvent(data) {
            this.pageIndex = 1;
            this.searchItem.projectId = data.projectId
            this.getLevelList('0')
            this.getList()
        },
        hideMenuEvent(type) {
            if (type == 'btn') {
                this.$refs.navigatorEl?.$refs?.dropdownEl?.showMaskEvent(false)
            } else if (type == 'navigator') {
                this.$refs.btnEl.showMaskEvent(false)
            }
        },
        jump(item) {
            let url = `/pages-a/resourcePoints/newResourcesDetail`
            if (item) {
                url = url + `?resourceId=${item.resourceId}&resourceMenuId=${item.resourceMenuId}`
            } else {
                url = `/pages-a/resourcePoints/newResources`
            }
            uni.navigateTo({ url: url });

        },
        getList() {
            var params = {
                data: {
                    pageIndex: this.pageIndex,
                    keyword: this.searchItem.resourceName,
                    resourceMenuId: '',
                    projectId: this.searchItem.projectId,
                    usingState: this.searchItem.usingState,
                    resourceType: this.searchItem.resourceType,
                    resourceMenuIds: this.searchItem.resourceMenuIds
                },
                hideLoading: true,
                responseToast: false,
            }
            getResourceList(params).then(res => {
                if (res.status == 200) {
                    if (this.pageIndex == 1) {
                        this.dataList = res.data.records;
                        this.total = res.data.total;
                        this.pages = res.data.pages;
                    } else {
                        this.dataList = this.dataList.concat(res.data.records)
                    }


                }
            })
        },

        dropdownEvent(data) {
            this.pageIndex = 1;
            this.searchItem = Object.assign(this.searchItem, {
                usingState: data.usingState ? data.usingState : '',
                resourceType: data.resourceType ? data.resourceType : '',
                resourceMenuIds: data.resourceMenuIds ? data.resourceMenuIds : ''
            })
            this.hideMenuEvent('navigator')
            this.getList();
        },

        async getLevelList(pId) {
            var params = {
                data: {
                    pId: pId,
                    nodeCategory: 4,
                    projectId: this.searchItem.projectId,
                    isQueryAbandonRoom: 1
                }
            }
            this.isChild = false;
            let result = await getLastLevelList(params);
            if (result.status == 200) {
                this.categoryData = result?.data.map(item => {
                    return {
                        label: item.resourceMenuName,
                        name: item.resourceMenuId
                    }
                })
                this.categoryData.unshift({ label: '全部', name: '' });
            }
        },

    },
    created() {

    },
    mounted() {

    },

}
</script>
<style scoped lang="scss">
.page {
    background: #F3F4F7;
    height: 100vh;
}

image {
    width: 32rpx;
    height: 32rpx;
    margin-right: 10rpx;
}

.searchBox {
    background: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14rpx 20rpx;

    .area {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 26rpx;
        font-family: 'PingFang SC';
        color: #FFFFFF;
        padding: 0 10rpx;
        background: #3F9EFF;
        height: 60rpx;
        margin-right: 5px;
        border-radius: 6rpx;

    }
}

.head-cell {
    display: flex;
    background: #FFFFFF;
    margin: 0 0 10px 0;

    .cell-item {
        color: #333333;
        font-size: 26rpx;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 80rpx;
    }

}

.listContents {
    height: calc(100% - 300px);
}

.u-list {
    height: calc(100% - 300px) !important;
    overflow: auto;
    padding-top: 20rpx;
    // ::v-deep .uni-scroll-view-content >view:nth-child(1){
    //   padding-top: 20rpx !important;
    // }
    .content-item {
        // margin: 0 20rpx 24rpx;
        margin: 20rpx 20rpx 4rpx;
        background: #FFFFFF;
        border-radius: 12rpx;
        padding: 30rpx 30rpx 14rpx;
        font-size: 28rpx;
        color: #666666;

        .item-cell {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin: 0 0 24rpx 0;

            .item-text-bold {
                font-size: 30rpx;
                font-weight: bold;
                line-height: 24rpx;
                color: #222222;
            }

            .item-text-color {
                font-size: 28rpx;
            }

            .text-color-blue {
                color: #1989F7;

            }

            .text-color-Orange {
                color: #FF8A15
            }
        }

        .item-cell-box {
            display: flex;
            // height: 56rpx;
            padding-bottom: 16rpx;
            align-items: center;

            view {
                flex: 1;
                display: flex;
                align-items: center;
            }

            view.item-cell-box-left {
                width: 405rpx;
                flex: unset;
            }
        }
    }
}

.foot-btn {
    position: absolute;
    left: 0;
    right: 0;
    padding: 10px;

}

::v-deep .u-search .u-search__content__input {
    font-size: 26rpx !important;
}

::v-deep .dropdown-btn {
    margin-right: 20rpx;
    /* flex: 0 0 auto;
    padding: 14rpx 0 14rpx 24rpx;
    box-sizing: border-box; */

    .content-panel {
        left: -20rpx;
    }
}
</style>