<template>
    <view class="searchPopupStyle" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
        <u-row customStyle="padding-bottom: 12rpx;" v-if="isShowSearch">
            <u-col span="9" customStyle="font-size: 24rpx;color: #ff3300;">仅展示近一年的账单，请至物业中心查看更多</u-col>
            <u-col span="3" class="text-right">
                <u-button 
                    type="default" 
                    @click="openPopupBtn" 
                    customStyle="padding: 6rpx 16rpx;height: auto;vertical-align: top;color: #323233;background-color: #fff;border: 1px solid #ebedf0;"
                >账单筛选</u-button>
            </u-col>
        </u-row>
        <u-popup 
            :show="showPopup" 
            mode="right"
            closeable
            closeIconPos="top-left"
            @close="closePopup"
            :customStyle="{ height: '100%'}"
        >
            <view style="margin-top: 100rpx;height: calc( 100vh - 220rpx);overflow-y: scroll;">
                <view class="search-item" style="padding-bottom: 0;" v-if="roomCodesList.length > 0 && searchType != 1">
                    <view class="itemNameStyle">房间</view>
                    <view class="select-list">
                        <button :class="{'active': item.selected}" v-for="(item, index) in roomCodesList" :key="index"
                            @click="selectClick({key: 'roomCodesList', index})"
                        >{{item.Name}}</button>
                    </view>
                </view>
                <view class="search-item">
                    <view class="itemNameStyle">冻结状态</view>
                    <view class="select-list">
                        <button :class="{'active': item.selected}" v-for="(item, index) in frozenStateList" :key="index"
                            @click="selectClick({key: 'frozenStateList', index})"
                        >{{item.Name}}</button>
                    </view>
                </view>
                <view class="search-item">
                    <view class="itemNameStyle">欠费状态</view>
                    <view class="select-list">
                        <button :class="{'active': item.selected}" v-for="(item, index) in arrearsStateList" :key="index"
                            @click="selectClick({key: 'arrearsStateList', index})"
                        >{{item.Name}}</button>
                    </view>
                </view>
                <view class="search-item">
                    <view class="itemNameStyle">账期筛选</view>
                    <view class="select-list">
                        <view class="time">
                            <span class="start-time" @click="showTimePlugin({key:'startTime'})">{{startTime}}</span>
                            <span style="border: none;min-width: 24rpx;">——</span>
                            <span class="end-time" @click="showTimePlugin({key:'endTime'})">{{endTime}}</span>
                            <u-datetime-picker
                                :show="showTime"
                                v-model="timeValue"
                                mode="year-month"
                                :closeOnClickOverlay="true"
                                @confirm="confirmTime"
                                @cancel="cancelTime"
                            ></u-datetime-picker>
                        </view>
                    </view>
                </view>
            </view>
            <!-- <view class="btn-cont">
                <u-button type="default" @click="resetBtn">重置</u-button>
                <u-button type="primary" @click="confirmBtn">确定</u-button>
            </view> -->
            <view class="footer-btn">
                <view>
                    <text class="resetBtnStyle" @click="resetBtn()">重置</text>
                </view>
                <view>
                    <text class="confirmBtnStyle" @click="confirmBtn()">确定</text>
                </view>
            </view>
		</u-popup>
    </view>
</template>

<script>
import moment from "moment";
import {
    selectRoomCodesByCustomerId,    //根据客户ID查询服务号账单页需要显示的房间号集合
} from "@/service/leasing.js";
export default {
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
        projectId:{
            type: String,
            default: "",
        },
    },
    data(){
        return{
            isShowSearch: true,
            showPopup: false,
            roomCodesList: [],
            frozenStateList: [
                {
                    Id: "0",
                    Name: "未冻结",
                    selected: false,
                },
                {
                    Id: "1",
                    Name: "已冻结",
                    selected: false,
                }
            ],
            arrearsStateList: [
                {
                    Id: "0",
                    Name: "未结清",
                    selected: false,
                },
                {
                    Id: "1",
                    Name: "已结清",
                    selected: false,
                }
            ],
            startTime: "开始账期",
            endTime: "结束账期",
            searchData:{
                startPeriod: "",  //开始账期
                endPeriod: "",  //结束账期
                roomCodes: "",   //房间号
                frozenState: "",  //冻结状态
                arrearsState: "",  //欠费状态
            },
            timeValue: Number(new Date()),
            showTime: false,
        }
    },

    methods:{
        //获取房间号
        getRoomCodesList(){
            let self = this;
            self.roomCodesList = [];
            let data = {
                projectId: self.projectId,
                customerId: self.customerId,
                customerIds: self.customerIdArr.join(","),
            };
            var params = {
                data:data,
            }
            selectRoomCodesByCustomerId(params).then(res=>{
                if(res.status == 200){
                    if(res.data && res.data.length > 0){
                        res.data.forEach(item=>{
                            let obj = {
                                Name: item,
                                selected: false,
                            }
                            self.roomCodesList.push(obj);
                        })
                    }
                    console.log("房间"+self.roomCodesList.length, self.searchType)
                }else{
                    console.log("获取房间号失败：" + res.message)
                }
            })
        },

        //打开账单筛选弹框
        openPopupBtn(){
            let self = this;
            if(!self.searchData.roomCodes && self.roomCodesList.length > 0){
                self.roomCodesList.forEach(item=>{
                    item.selected = false;
                })
            }
            if(!self.searchData.frozenState && self.searchData.frozenState != 0){
                self.frozenStateList.forEach(item=>{
                    item.selected = false;
                })
            }
            if(!self.searchData.arrearsState && self.searchData.arrearsState != 0){
                self.arrearsStateList.forEach(item=>{
                    item.selected = false;
                })
            }
            if(!self.searchData.startPeriod){
                self.startTime = '开始账期';
            }
            if(!self.searchData.endPeriod){
                self.endTime = '结束账期';
            }
            self.showPopup = true;
        },
        //关闭弹出层
        closePopup(){
            let self = this;
            self.showPopup = false;
        },

        // 房间、冻结状态、欠费状态
        selectClick(params) {
            const {key, index} = params || {};
            const list = this[key];
            list.forEach((item, index1) => {
                if(key != "roomCodesList" && index1 != index){
                    item.selected = false
                }
            });
            list[index].selected = !list[index].selected;
            this[key] = list;
        },

        // 选择时间
        showTimePlugin(params) {
            const {key} = params;
            // this.timeValue =  Number(new Date());
            this.showTime = true;
            this.key = key;
        },

        confirmTime(res){
            let {value} = res;
            this[this.key] = moment(value).format('YYYY-MM');
            const st = this.startTime;
            const et = this.endTime;
            if (st !== '开始账期' && et !== '结束账期' && moment(et).isBefore(st)) {
                this.toastWord({text: '结束账期不能小于开始账期'})
            }
            this.showTime = false;
        },

        cancelTime(){
            this.showTime = false;
        },

        //重置
        resetBtn(){
            let self = this;
            self.searchData = {
                startPeriod: "",  //开始账期
                endPeriod: "",  //结束账期
                roomCodes: "",   //房间号
                frozenState: "",  //冻结状态
                arrearsState: "",  //欠费状态
            };
            if(self.roomCodesList.length > 0){
                self.roomCodesList.forEach(item=>{
                    item.selected = false;
                })
            }
            self.frozenStateList.forEach(item=>{
                item.selected = false;
            })
            self.arrearsStateList.forEach(item=>{
                item.selected = false;
            })
            self.startTime = '开始账期';
            self.endTime = '结束账期';
            self.showPopup = false;
            self.$emit('resetLoadData');   //调用父组件方法，重新加载数据
        },

        //确定
        confirmBtn(){
            let self = this;
            self.searchData = {
                startPeriod: "",  //开始账期
                endPeriod: "",  //结束账期
                roomCodes: "",   //房间号
                frozenState: "",  //冻结状态
                arrearsState: "",  //欠费状态
            };
            if (self.startTime !== '开始账期' && self.endTime !== '结束账期' 
                && moment(self.endTime).isBefore(self.startTime)) {
                self.toastWord({text: '结束账期不能小于开始账期'});
                return false;
            }
            if(self.roomCodesList && self.roomCodesList.length > 0){
                let roomCodesArr = [];
                self.roomCodesList.forEach(item=>{
                    if(item.selected){
                        roomCodesArr.push(item.Name);
                    }
                })
                self.searchData.roomCodes = roomCodesArr.join(",");
            }
            self.frozenStateList.forEach(item=>{
                if(item.selected){
                    self.searchData.frozenState = item.Id;
                }
            })
            self.arrearsStateList.forEach(item=>{
                if(item.selected){
                    self.searchData.arrearsState = item.Id;
                }
            })
            if(self.startTime !== '开始账期'){
                self.searchData.startPeriod = self.startTime;
            }else{
                self.searchData.startPeriod = "";
            }
            if(self.endTime !== '结束账期'){
                self.searchData.endPeriod = self.endTime;
            }else{
                self.searchData.endPeriod = "";
            }
            console.log(self.searchData);
            self.showPopup = false;
            self.$emit('resetLoadData');   //调用父组件方法，重新加载数据
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

<style scoped>
.defauleBtnStyle{
    padding: 6rpx 16rpx;
    height: auto;
    vertical-align: top;
    color: #323233;
    background-color: #fff;
    border: 1px solid #ebedf0;
}
.searchPopupStyle ::v-deep .u-slide-right-enter-active{
    width: 80%;
}
.search-item{
    padding: 12px 12px 0;
    margin-inline-start: 14px;
}
.search-item .itemNameStyle {
    margin-bottom: 10px;
    font-size: 28rpx;
}
</style>
<style scoped lang="scss">
    .select-list {
        @include flx-dsp($jsc: flex-start, $ali: center);
        margin-bottom: 10rpx;
        overflow: initial;
        flex-flow: row wrap;
        & > button {
            min-width: 144rpx;
            height: 64rpx;
            margin-right: 24rpx;
            line-height: 64rpx;
            text-align: center;
            color: rgba(170, 170, 170, 1);
            border: 1px solid rgba(215, 215, 215, 1);
            font-size: 24rpx;
            background-color: #fff;
            margin-bottom: 24rpx;
            margin-left: 0;
            border-radius: 0;
        }
        button.active {
            border: 1px solid var(--app-primary-color);
            color: var(--app-primary-color);
        }
    }
    .time {
        @include flx-dsp($jsc: flex-start, $ali: center);
        & > span {
            min-width: 144rpx;
            height: 64rpx;
            line-height: 64rpx;
            display: inline-block;
            border: 1px solid #d7d7d7;
            font-size: 24rpx;
            background-color: #fff;
            text-align: center;
            color: #999;
        }
    }
    .footer-btn{
        // position: absolute;
        // width: 100%;
        padding: 20rpx 32rpx;
        bottom: 0;
        text-align: center;
        display: flex;
        view{
            flex: 1;
            text{
                width: 168rpx;
                height: 72rpx;
                margin: auto;
                display: flex;
                align-items: center; 
                justify-content: center;
                border-radius: 34rpx;
                font-size: 28rpx;
            }
            .resetBtnStyle{
                border:1px solid var(--app-primary-color);
                color: var(--app-primary-color);
            }
            .confirmBtnStyle{
                background: var(--app-primary-color);
                color: white;
            }
        }
    }
</style>