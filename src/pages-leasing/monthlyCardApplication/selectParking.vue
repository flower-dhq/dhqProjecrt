<template>
    <!-- 选择车场 -->
        <view id="element" class="page" ref="element" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
            <u-sticky ref="element1" offsetTop="0" customStyle="padding: 11px 11px 0;" bgColor="#f5f5f5" zIndex="99999">
                <view class="centerbg-item">
                    <u-row
                        justify="space-between"
                        gutter="10"
                    >
                        <u-col span="9">
                            <u--input
                                placeholder="请输入内容"
                                border="none"
                                v-model="searchName"
                                prefixIcon="search"
                                prefixIconStyle="font-size: 22px;color: #909399"
                                customStyle="padding: 8px 11px;background: #f5f5f5;height: 30px;"
                            ></u--input>
                        </u-col>
                        <u-col span="3">
                            <u-button 
                                text="搜索" 
                                color="var(--app-primary-color)"
                                @click="searchBtn()"
                            ></u-button>
                        </u-col>
                    </u-row>
                </view>
                <view class="searchBody"  ref="element2">
                    <view 
                        class="searchItem"
                        :class="{'activeBorder1': isShowPopup && searchType == 'parklotFunctionList'}"
                        @click="openParklotType('parkingTypeList')"
                    >
                        <view
                            :class="{'activeColor':searchType == 'parkingTypeList'|| parkingTypeIdsArr.length > 0}"
                        >车位位置</view>
                        <u-icon 
                            name="arrow-down-fill"
                            :color="searchType == 'parkingTypeList' || parkingTypeIdsArr.length > 0  ? 'var(--app-primary-color)' : '#333'"
                        ></u-icon>
                    </view>
                    <view 
                        class="searchItem"
                        :class="{'activeBorder2': isShowPopup && searchType == 'parkingTypeList'}" 
                        @click="openParklotType('parklotFunctionList')"
                    >
                        <view
                        :class="{'activeColor': searchType == 'parklotFunctionList'|| parklotFunctionIdsArr.length > 0}"
                        >车位功能</view>
                        <u-icon 
                            name="arrow-down-fill"
                            :color="searchType == 'parklotFunctionList'|| parklotFunctionIdsArr.length > 0 ? 'var(--app-primary-color)' : '#333'"
                        ></u-icon>
                    </view>
                </view>
            </u-sticky>
            <scroll-view
                scroll-y="true"
                @scrolltolower="loadMore"
                class="scroll-box"
                ref="scrollView"
                :show-scrollbar="true"
                :scroll-top="scrollerHeight"
                :scroll-into-view="scrollId"
            >
                <view id="scrollToId" class="centerbg">
                    <view class="centerbg-item" style="padding: 11px 0;">
                        <!-- <view id="scrollToId" class="scrollToId" style="height:1px"></view> -->
                        <view class="flexBody3">
                            <view 
                               @click="changeparkingNumber(item)"
                                class="flexItem3"
                                v-for="(item, index) in parklotList"
                                :key="index"
                                :id="'scrollId'+item.parkingId"
                            >{{item.parkingNumber}}</view>
                        </view>
                    </view>
                    <view style="margin-top: 20px;">
                        <u-loadmore
                            loadingText= '努力加载中' 
                            loadmoreText="上拉加载更多~" 
                            nomoreText='我是有底线的~'
                            :status="loadingStatus"
                            line
                        />
                    </view>
                </view>
            </scroll-view>
            <u-popup 
                :show="isShowPopup" 
                mode="right"
                :customStyle="{top: popupTopHeight,padding: '0 22rpx',left: '0px'}"
                :overlayStyle="{top: popupTopHeight2}"
                bgColor="transparent"
            >
                <view class="popupBody" ref="element3">
                    <view class="flexBody2">
                        <view 
                            class="flexItem2"
                            v-for="(item, index) in popupSearchList"
                            :class="{'activeColor': item.selected}"
                            :key="index"
                            @click="selectClick(index)"
                        >{{item.detailName}}</view>
                    </view>
                    <view class="flexBody2">
                        <view class="flexItem2" style="margin-bottom: 11px">
                            <u-button 
                                plain 
                                text="重置" 
                                @click="resetData"
                            ></u-button>
                        </view>
                        <view class="flexItem2" style="margin-bottom: 11px">
                            <u-button 
                                text="确定" 
                                color="var(--app-primary-color)"
                                @click="submit"
                            ></u-button>
                        </view>
                    </view>
                </view>
            </u-popup>
        </view>
</template>

<script>
import {
    getLeasingParklotList,   //获取车位
    getDictDetailByCode,
    getDictDetailByCompanyAndCode,
} from "@/service/leasing.js";
export default {
    data(){
        return{
            searchName: "", // 项目名称
            isShowPopup: false,
            popupTopHeight: 0,  //弹框距离顶部高度
            popupTopHeight2: 0,  //弹框遮罩层距离顶部高度
            searchType: "",  //筛选类型：车位位置-parkingTypeList，车位功能-parklotFunctionList
            popupSearchList: [],
            parkingTypeList: [],
            parklotFunctionList: [],
            parkingTypeIdsArr: '',  //车位位置id
            parklotFunctionIdsArr: '',   //车位功能id
            projectId: "",
            parklotList: [],  //车位数据
            pageSize: 45,
            currentPage: 1,
            totalCount: "",
            loading: false,
            refreshing: false,
            loadingStatus: "loading",  //列表加载状态
            isRefreshing: false,
            scrollerHeight: 0,
            scrollId: "",
            resourceMenuId:''
        }
    },

    onLoad(options){
        this.resourceMenuId = options.resourceMenuId
        if(uni.getStorageSync('DEFAULT_PROJECT_ID')){
            this.projectId = parseInt(uni.getStorageSync('DEFAULT_PROJECT_ID'));
        }
        this.getParklotTypeListFun();
        this.getParklotFunctionListFun();
        this.resetLoadData();
    },

    onShow(){

    },

    mounted(){
        this.popupTopHeight =  247+"rpx";
        // // this.scrollerHeight =  this.$refs.element.$el.offsetHeight - this.$refs.element1.$el.offsetHeight;
        // console.log(this.popupTopHeight)
    },

    methods:{

        getParklotTypeListFun(){
            let self = this;
            let data = {
                dictCode: "parklot_type",  //车位位置
            }
            let params = {
                data: data,
            }
            getDictDetailByCode(params).then(res=>{
                if(res.status == 200){
                    self.parkingTypeList = res.data;
                    if(self.parkingTypeList.length > 0){
                        self.parkingTypeList.forEach(item=>{
                            item.selected = false;
                        })
                    }
                }
            })
        },
        getParklotFunctionListFun(){
            let self = this;
            let data = {
                dictCode: "parklot_function",   //车位功能
            }
            let params = {
                data: data,
            }
            getDictDetailByCompanyAndCode(params).then(res=>{
                if(res.status == 200){
                    self.parklotFunctionList = res.data;
                    if(self.parklotFunctionList.length > 0){
                        self.parklotFunctionList.forEach(item=>{
                            item.selected = false;
                        })
                    }
                }
            })
        },
        getLeasingParklotListFun(flag){
            let self = this;
            if (self.refreshing) {
                self.parklotList = [];
                self.refreshing = false;
            }
            let data = {
                projectId: self.projectId,
                pageIndex: self.currentPage,
                pageSize: self.pageSize,
                parkingNumber: self.searchName,
                parklotFunction: self.parklotFunctionIdsArr.length>0?self.parklotFunctionIdsArr.toString(','):'',
                parklotType: self.parkingTypeIdsArr.length>0?self.parkingTypeIdsArr.toString(','):'',
                resourceMenuIds:self.resourceMenuId,
                parkingState:1,
            }
            let params = {
                data: data,
            }
            getLeasingParklotList(params).then(res=>{
                if(res.status == 200){
                    self.isRefreshing = false;
                    self.totalCount = res.data.total;
                    if (flag == 0) {
                        self.parklotList = res.data.records;
                    } else if (flag == 1) {
                        self.parklotList = self.parklotList.concat(res.data.records);
                    }
                    if (self.parklotList.length === self.totalCount) {
                        self.loadingStatus = "nomore";
                    }
                    if(self.totalCount > 0 && self.parklotList.length != self.totalCount ){
                        self.loadingStatus = "loadmore";
                    }
                }else{
                    self.parklotList = [];
                    self.isRefreshing = false;
                    self.loadingStatus = "nomore";
                    self.toastWord({ text: res.message })
                }
            })
        },
        //上拉加载数据
        loadMore() {
            this.loadingStatus = "loadmore";
            this.currentPage += 1;
            this.getLeasingParklotListFun(1);
        },
        onRefresh(e){
            let self = this;
            self.isRefreshing = false;
            this.getLeasingParklotListFun();
        },
        searchBtn(){
            this.scrollId = 'element'; // 设置需要滚动到的子元素的id
            uni.createSelectorQuery().in(this).select('#element').boundingClientRect(res => {
                this.scrollerHeight = res.top; // 设置滚动条距离顶部的距离
            }).exec();
            console.log("height: "+this.scrollerHeight)
            this.resetLoadData();
        },
        // 重置加载数据
        resetLoadData() {
            this.currentPage = 1;
            this.loadingStatus = "loading";
            this.isShowPopup = false;
            this.getLeasingParklotListFun(0);
        },

        openParklotType(flag){
            let self = this;
            self.popupSearchList = JSON.parse(JSON.stringify(self[flag]));
            if(self.searchType == flag){
                self.isShowPopup = !self.isShowPopup;
            }else{
                self.isShowPopup = true;
            }
            self.searchType = flag;
            // self.$nextTick(()=>{
            //     let top =  this.$refs.element1.$el.offsetHeight;
            //     this.popupTopHeight2 =  this.$refs.element3.$el.offsetHeight + top+"px";
            // })
        },

        selectClick(index) {
            let self = this;
            let list = self.popupSearchList;
            self.popupSearchList[index].selected = !list[index].selected;
        },

        //重置
        resetData(){
            let self = this;
            self.popupSearchList.forEach(item=>{
                item.selected = false;
            })
            self[self.searchType] = JSON.parse(JSON.stringify(self.popupSearchList));
            if(self.searchType == "parkingTypeList"){
                self.parkingTypeIdsArr = [];
            }else{
                self.parklotFunctionIdsArr = [];
            }
            self.searchType = "";
            self.isShowPopup = false;
            self.searchBtn();  //重新加载车位列表
        },

        submit(){
            let self = this;
            self[self.searchType] = JSON.parse(JSON.stringify(self.popupSearchList));
            let list = self[self.searchType];
            let idArr = [];
            list.forEach(item=>{
                if(item.selected){
                    idArr.push(item.detailId)
                }
            })
            if(self.searchType == "parkingTypeList"){
                self.parkingTypeIdsArr = idArr;
            }else{
                self.parklotFunctionIdsArr = idArr;
            }
            self.searchType = "";
            self.isShowPopup = false;
            self.searchBtn();  //重新加载车位列表
        },
        changeparkingNumber(item){
            uni.$emit('addparkingNumber', { 
                parkingId: item.parkingId,
                parkingNumber: item.parkingNumber
            });
            uni.navigateBack();
        },

        // 提示文字
        toastWord(params) {
            const { text } = params;
            if (!text) return;
            uni.showToast({ title: text, icon: 'none' });
        },
    },

    watch:{
        isShowPopup:{
            handler(val){
                if(val){
                    document.body.style.overflow = 'hidden';
                }else{
                    document.body.style.overflow = '';
                }
            }
        }
    }
}
</script>
  
<style lang="scss" scoped>
.page {
    height: 100vh;
    background-color: #f5f5f5;
}
.page ::v-deep .u-sticky{
    top: 0px !important;
}
.centerbg {
    padding: 0 22rpx 22rpx;
}
.centerbg-item{
    padding: 11px;
    border-radius: 0 0 14rpx 14rpx;
    background-color: #fff;
}
.flexBody3{
    display: flex;
    flex-wrap: wrap;
    // justify-content: space-between;
    padding: 0 22rpx;
}
.flexItem3{
    padding: 22rpx;
    margin-bottom: 22rpx;
    border-radius: 8px;
    width: 24.6%;
    text-align: center;
    border: 1px solid #ececec;
    word-break: break-word;
    align-items: center;
    display: flex;
    justify-content: center;
}
.flexItem3:hover{
    color: var(--app-primary-color);
    border: 1px solid var(--app-primary-color);
}
.flexItem3:nth-child(3n+2){
    margin-left: 2.5%;
    margin-right: 2.5%;
}
.searchBody{
    display: flex;
    justify-content: center;
    // margin-bottom: 22rpx;
    margin-top: 22rpx;
    background: #fff;
    border-radius: 14rpx 14rpx 0 0;
}
.searchItem{
    text-align: center;
    width: 50%;
    display: flex;
    justify-content: center;
    z-index: 99999;
    padding: 22rpx;
}
.popupBody{
    padding: 22rpx;
    background: #fff;
}
.flexBody2{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}
.flexItem2{
    margin-bottom: 52rpx;
    border-radius: 8px;
    width: 40%;
    text-align: center;
    word-break: break-word;
    align-items: center;
    padding: 0 22rpx;
}
.activeColor{
    color: var(--app-primary-color);
}
.activeBorder1{
    border-right: 1px solid #ececec;
    border-bottom: 1px solid #ececec;
}
.activeBorder2{
    border-left: 1px solid #ececec;
    border-bottom: 1px solid #ececec;
}
.page ::v-deep.u-popup .u-transition{
    width: 100% !important;
}
.scroll-box{
  height: calc(100vh - 230rpx);
  background-color: #f5f5f5;
}
</style>