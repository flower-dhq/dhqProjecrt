<template>
    <view :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
        <view class="bill-page" style="height: calc(100vh - 280rpx);">
            <bill-search-popup 
                ref="billSearchPopupRef"
                :customerId="customerId"
                :customerIdArr="customerIdArr"
                @resetLoadData="resetLoadData"
                :searchType="searchType"
                :projectId="projectId"
            ></bill-search-popup>
            <view class="text-center row-header">
                <u-row>
                    <u-col span="2">
                        <view class="text-center">房号</view>
                    </u-col>
                    <u-col span="3">
                        <view class="text-center">账单账期</view>
                    </u-col>
                    <u-col span="3">
                        <view class="text-center">账单金额</view>
                    </u-col>
                    <u-col span="2">
                        <view class="text-center">是否结清</view>
                    </u-col>
                    <u-col span="2">
                        <view class="text-center">操作</view>
                    </u-col>
                </u-row>
            </view>
            
            <u-empty
                mode="data"
                icon="data"
                marginTop="20"
                textSize="16"
                v-if="billList.length < 1"
                text="暂无账单数据"
            ></u-empty>
            <view class="row-body" style="height: calc(100vh - 440rpx);" v-if="billList.length > 0">
                <scroll-view  scroll-y="true" @scrolltolower="loadMore" style="background-color: #F5F5F5">
                    <u-row 
                        v-for="(item, index) in billList" 
                        :key="index"
                        customStyle="padding: 12px 0;border-bottom: 1px solid #ececec;background: #fff;font-size: 28rpx;text-align: center;"
                    >
                        <u-col span="2">
                            <view 
                                class="text-center text-ellipsis" 
                                :class="item.frozenState == 1 ? 'color-gray' : ''"
                            >{{item.code}}</view>
                        </u-col>
                        <u-col span="3">
                            <view 
                                class="text-center" 
                                :class="item.frozenState == 1 ? 'color-gray' : ''"
                            >{{item.chargePeriod}}</view>
                        </u-col>
                        <u-col span="3">
                            <view 
                                class="text-center" 
                                :class="item.frozenState == 1 ? 'color-gray' : ''"
                            >{{item.totalReceivableAmount}}</view>
                        </u-col>
                        <u-col span="2">
                            <view class="text-center" :class="item.frozenState == 1 ? 'color-gray' : ''">
                                <span v-if="item.settlementStatus == '1'">是</span>
                                <span v-else>否</span>
                            </view>
                        </u-col>
                        <u-col span="2">
                            <view 
                                class="text-center" 
                                :class="item.frozenState == 1 ? 'color-gray' : 'fontColor'" 
                                @click.native="goToDetail(item)"
                            >查看</view>
                        </u-col>
                    </u-row>
                </scroll-view>
            </view>

        </view>
    </view> 
</template>

<script>
import {
    selectBillRecordByCustomerId,    //账单记录查询
} from "@/service/leasing.js";
import billSearchPopup from "./billSearchPopup.vue";
export default {
    components:{
        "bill-search-popup": billSearchPopup,
    },
    props:{
        customerId:{
            type: Number,
            default: null,
        },
        customerIdArr:{
            type: Array,
            default: [],
        },
        searchType:{
            type: Number,
            default: null,
        },
        roomIds:{
            type: String,
            default: "",
        },
        projectId:{
            type: String,
            default: "",
        },
    },
    data(){
        return{
            billList: [],
            isShowSearch: true,
            pageSize: 100,
            currentPage: 0,
            totalCount: "",
            loading: false,
            finished: false,
        }
    },

    methods: {
        //初始化数据
        initData(){
            let self = this;
            self.resetLoadData();
            self.$refs.billSearchPopupRef.isShowSearch = true;
            this.$nextTick(() => {
                self.$refs.billSearchPopupRef.getRoomCodesList();
            })
        },

        //上拉加载数据
        loadMore() {
            this.currentPage += 1
            this.getListData(1)
        },

        // 重置加载数据
        resetLoadData () {
            this.currentPage = 1;
            this.finished = false;
            this.loading = true;
            this.getListData(0);
        },

        //获取列表数据
        getListData(flag){
            let self = this;
            self.billList = [];
            let data = {
                projectId: self.projectId,
                customerId: self.customerId,
                pageIndex: self.currentPage,
                pageSize: self.pageSize,
                customerIds: self.customerIdArr.join(","),
                searchType: self.searchType,
                roomIds: self.searchType == 1 ? self.roomIds : "", 
            };
            let searchData = self.$refs.billSearchPopupRef.searchData;
            if(searchData.roomCodes){
                data.roomCodes = searchData.roomCodes;
            }
            if(searchData.frozenState){
                data.frozenState = searchData.frozenState;
            }
            if(searchData.arrearsState){
                data.arrearsState = searchData.arrearsState;
            }
            if(searchData.startPeriod){
                data.startPeriod = searchData.startPeriod;
            }
            if(searchData.endPeriod){
                data.endPeriod = searchData.endPeriod;
            }
            var params = {
                data:data,
                "hideLoading": true
            }
            selectBillRecordByCustomerId(params).then(res=>{
                if(res.status == 200){
                    self.totalCount = res.data.total;
                    self.loading = false;
                    if(flag == 0){
                        self.billList = res.data.records;
                    }else if(flag == 1){
                        self.billList = self.billList.concat(res.data.records);
                    }
                    if (self.billList.length === self.totalCount) {
                        self.finished = true;
                    }
                }else{
                    self.billList = [];
                    self.finished = true;
                    self.toastWord({text: res.message})
                }
            })
        },

        goToDetail(data){
            let billChargePeriod = data.chargePeriod;
            let settlementStatus = data.settlementStatus;
            let billFeeDetailData = JSON.stringify(data.detail);
            uni.setStorageSync('billChargePeriod',billChargePeriod);
            uni.setStorageSync('settlementStatus',settlementStatus);
            uni.setStorageSync('billFeeDetailData',billFeeDetailData);
            uni.navigateTo({
                url: '/pages-leasing/paymentinfo/components/billFeeDetail'
            })
            // uni.navigateTo({
            //     url: "/pages-leasing/paymentinfo/WXSharePage?key=28&userName=xyw",
            // });
        },

        // 提示文字
        toastWord(params) {
            const {text} = params;
            if (!text) return;
            uni.showToast({ title: text, icon: 'none' });
        },
    }
}
</script>

<style scoped lang="scss">
.text-center{
    text-align: center;
}
.bill-page{
    margin: 12px 12px;
}
.row-header{
    padding: 12px 0;
    background: #ececec;
    font-size: 28rpx;
}
.row-header ::v-deep .u-col,
.row-body ::v-deep .u-col{
    text-align: center !important;
}
.row-body{
    border-left: 1px solid #ececec;
    border-right: 1px solid #ececec;
    border-bottom: 1px solid #ececec;
    overflow-y: scroll;
}
.row-body ::v-deep .u-row{
    padding: 12px 0;
    border-bottom: 1px solid #ececec;
    background: #fff;
    font-size: 28rpx;
}
.text-ellipsis{
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    width: 100%;
    // padding: 0 16rpx;
    display: inline-block;
}
.fontColor{
    color: var(--app-primary-color);
}
.color-gray{
    color: #ccc;
}
</style>