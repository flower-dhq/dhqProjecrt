<template>
    <view :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
        <view class="payPageStyle" :style="[boxStyle.heightStyle, boxStyle.overflowStyle]">
            <u-empty
                mode="data"
                icon="data"
                marginTop="20"
                textSize="16"
                v-if="bills.length < 1 && showEmpty"
                text="暂无账单"
            ></u-empty>
            <u-loading-icon
                color="var(--app-primary-color)"
                size="36"
                text="加载中，请稍等..."
                textSize="14"
                :vertical="true"
                v-if="bills.length < 1 && billLoading"
                style="margin-top: 48rpx;"
            ></u-loading-icon>
            <view>
                <uni-collapse  v-for="(item, index) in bills" :key="index" ref="collapseRef">
                    <view v-if="depositType == '3'" class="house-title">保证金</view>
                    <view v-else class="house-title">
                        <u-checkbox
                            v-model="roomChecked[item.id]"
                            :checked="roomChecked[item.id]"
                            :label="item.title"
                            shape="circle"
                            activeColor="var(--app-primary-color)"
                            @change="checkRoom(item, item.id)"
                            :disabled="isSupports == '0' ? true : false"
                        ></u-checkbox>
                    </view>
                    <uni-collapse-item
                        title-border="none"
                        :border="false"
                        v-for="(item2, index2) in item.datadArr"
                        :key="item2.id"
                        :name="item2.id"
                    >
                        <view slot="title">
                            <uni-list>
                                <uni-list-item >
                                    <view slot="header">
                                        <view style="float: left;width: 30px;">
                                            <u-checkbox
                                                v-model="checked[item2[0].billDetailIdList[0]]"
                                                :checked="checked[item2[0].billDetailIdList[0]]"
                                                :disabled="isDisabled || isSupports == '0' ? true : false"
                                                shape="circle"
                                                activeColor="var(--app-primary-color)"
                                                @change="checkPeriod(item.datadArr[index2], item)"
                                                style="float: left;width: 30px;"
                                            ></u-checkbox>
                                        </view>

                                        <view style="white-space: nowrap;">{{ruleType == 1 ? item2[0].typeName : item2[0].dateRange}} 合计：{{item2[0].groupMoneyTotal}}</view>
                                    </view>
                                </uni-list-item>
                            </uni-list>
                        </view>
                        <view class="content">
                            <uni-list>
                                <uni-list-item
                                    v-for="(item3, index3) in item2"
                                    :key="index3"
                                >
                                    <template v-slot:header>
                                        <view style="float: left;width: 30px;display: flex;overflow: hidden;flex-direction: row;margin-left: 15px;">
                                            <u-checkbox
                                                v-model="checkChild[item3.id]"
                                                :checked="checkChild[item3.id]"
                                                shape="circle"
                                                activeColor="var(--app-primary-color)"
                                                @change="checkFee(item.datadArr[index2][index3], item.datadArr[index2],item)"
                                                :disabled="chargeUnit == 0 || isSupports == '0' ? true : false"
                                                ></u-checkbox>
                                        </view>
                                    </template>
                                    <template v-slot:body>
                                        <text
                                            class="slot-box slot-text"
                                            style="font-size: 12px;color:#333;line-height: 56rpx;"
                                        >{{item3.fiName}}  ({{item3.periodText}}) ￥{{item3.fiSeasonArrearAmount}}元</text>
                                        <text @click="showEnergyPopup(item.datadArr[index2][index3])" class="more-btn" v-if="item3.isPark || item3.isEnergy">更多</text>
                                        <view @click="showFeePopup(item.datadArr[index2][index3])" class="more-btn" v-if="ruleType == 1" style="height: 56rpx;display: flex;">
                                            <u-icon name="arrow-right" size="12" color="var(--app-primary-color)"/>
                                        </view>
                                    </template>
                                </uni-list-item>
                            </uni-list>
                        </view>
                    </uni-collapse-item>
                </uni-collapse>
            </view>
        </view>

        <u-popup
            :show="energyPopup"
            :closeable="true"
            mode="bottom"
            @close="closePopup"
        >
            <view style="padding-top: 45px;height: 45vh;overflow-y: scroll;">
                <view style="padding-left: 16px;font-size: 12px;">
                    <text>费项：{{feeDetail.fiName}}</text>
                    <text class="ml-10">账期：{{feeDetail.periodText}}</text>
                    <text class="ml-10">金额：{{feeDetail.fiSeasonArrearAmount}}</text>
                </view>
                <view v-if="feeDetail.isEnergy && feeDetail.energyList.length > 0">
                    <view v-for="(item,index) in feeDetail.energyList" :key="index">
                        <u-cell-group :border="false">
                            <u-cell style="border-top: 1px solid #ccc;margin-top: 10px;">
                                <view
                                    slot="title"
                                    class="u-slot-title"
                                >
                                    <text class="energy-item">表号：{{item.number}}</text>
                                    <text class="energy-item ml-10">底数：{{item.lastRead}}</text>
                                    <text class="energy-item ml-10">用量：{{item.dosage}}</text>
                                    <text class="energy-item ml-10">{{item.createDate}}</text>
                                </view>
                            </u-cell>
                        </u-cell-group>
                    </view>
                </view>
                <view v-if="feeDetail.isPark">
                    <u-cell-group :border="false">
                        <u-cell style="border-top: 1px solid #efefef;margin-top: 10px;">
                            <view
                                slot="title"
                                class="u-slot-title"
                            >
                                <text class="fee-item">车位编号：{{feeDetail.parkingNumber}}</text>
                            </view>
                        </u-cell>
                    </u-cell-group>
                </view>

            </view>
        </u-popup>

        <u-popup
            :show="feePopup"
            :closeable="true"
            mode="bottom"
            @close="closePopup"
        >
            <view style="padding-top: 45px;height: 45vh;overflow-y: scroll;">
                <view v-for="(item, index) in billDetailInfo" :key="index">
                    <u-cell-group :border="false">
                        <u-cell style="border-top: 1px solid #efefef;font-size: 12px;">
                            <view
                                slot="title"
                                class="u-slot-title"
                            >
                                <text class="fee-item">{{item.fiName}}({{item.periodText}}) ￥{{item.arrearsAmount}}元</text>
                            </view>
                        </u-cell>
                    </u-cell-group>
                </view>

            </view>
        </u-popup>

    </view>
</template>

<script>
import moment from "moment";
import {
    getBillDetailRecordByConfig,    //根据客户ID获取季度账单列表
    getPayOnlineSetting,  //根据线上缴费配置
    selectReminderBySerialNumberAndRoomId,//根据催缴来获取数据
} from "@/service/leasing.js";
export default {
    props:{
        isFromReminder:{
          type: Boolean,
          default: false,
        },
        customerId:{
            type: Number,
            default: '',
        },
        depositType:{
            type: String,
            default: "",
        },
        roomIds:{
            type: String,
            default: "",
        },
        isDisabled:{
            type: Boolean,
            default: "",
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
        isShowIntegralTips:{
            type: Boolean,
            default: "",
        },
    },

    data(){
        return{
            feeName:[], //费项名称
            feeList:[], //费项数组，小程序支付要用
            activeArr: [],
            roomChecked: {},
            checked: {},
            checkChild: {},
            checkSon: [],
            bills: [],  //账单
            chargeUnit: 0,   //0--账单缴费，1--明细缴费
            energyPopup: false,  //车位费、能源费用详情弹框
            feeDetail: {},
            feePopup: false,  //费项明细弹框
            billDetailInfo: [],  //费项明细
            ruleType: 0,  //展示规则
            totalAmount: 0,
            billLoading: false,
            showEmpty: false,
            boxStyle: {
                heightStyle: {
                    height: uni.getSystemInfoSync().windowHeight - 380 + "px"
                },
                overflowStyle: {
                    overflow: 'auto',
                },
            },
            checkType: "1",  //勾选截至, 1-当月，2-当季，3-当年，4-全部，5-不勾
            isSupports: 1,   //是否支持房产/账期/费项勾选,0-否，1-是
        }
    },

    methods: {
        //初始化数据
        async initData(){
            let self = this;
            self.energyPopup = false;
            self.billLoading = false;
            self.showEmpty = false;
            await self.getPayOnlineSettingFun();
            await self.getBillDetailList();
        },

        getPayOnlineSettingFun(){
            let self = this;
            let data = {
                projectId: self.projectId,
                authType: 2,
            };
            let params = {
                data: data,
            }
            getPayOnlineSetting(params).then(res=>{
                if(res.status == 200){
                    if(res.data && res.data.length > 0){
                        res.data.forEach(item=>{
                            if(item.channelCode == "public_account"){
                                self.chargeUnit = item.chargeUnit;
                                self.ruleType = item.ruleType;
                                self.checkType = item.checkType;
                                self.isSupports = item.isSupports;
                            }
                        })
                    }
                }
            })
        },

        //获取账单-按季度展示
        getBillDetailList(){
            let self = this;
            let data = {
                projectId: self.projectId,
                customerId: self.customerId,
                depositType: self.depositType == "3" ? self.depositType : "",
                roomIds: self.roomIds,
                customerIds: self.customerIdArr.join(","),
                searchType: self.searchType,
            };
            let fun = getBillDetailRecordByConfig;
            if(this.isFromReminder){
              data = {
                  reminderSerialNumber: this.$route.query.reminderSerialNumber,
                  roomId : this.$route.query.roomId,
                  originalPrint :  this.$route.query.originalPrint,
              }
              fun = selectReminderBySerialNumberAndRoomId;
            }
            self.bills = [];
            let params = {
                data: data,
            }
            self.billLoading = true;
            self.showEmpty = false;
            fun(params).then(res=>{
                if(res.status == 200 && res.data.data){
                    if(self.isFromReminder){
                      self.$emit('loadedData', {
                        customerName: res.data.customerName,
                        ownerCalls: res.data.customerPhone,
                      })
                    }
                    self.activeArr = [];
                    self.checkSon = [];
                    self.feeName = new Map();
                    self.feeList = new Map();
                    self.checked = {};
                    if(self.depositType != "3"){
                        if(res.data.data.length > 0){
                            res.data.data.forEach(item => {
                                if(item.title.indexOf("其他") == -1){
                                    item.title = "房间号：" + item.title;
                                }
                                item.datadArr = [];
                                item.roomGroupBDIds = [];  //一个房间下的所有账单明细id
                                for(let key in item.dataObject) {
                                    item.id = item.dataObject[key][0].billDetailIdList[0];
                                    // self.roomChecked[item.id] = true;
                                    item.dataObject[key].title = item.dataObject[key][0].dateRange;
                                    item.dataObject[key].groupMoneyTotal = item.dataObject[key][0].groupMoneyTotal;
                                    item.dataObject[key].typeName = item.dataObject[key][0].typeName;
                                    item.dataObject[key].id = item.dataObject[key][0].billDetailIdList[0];
                                    // self.checked[item.dataObject[key].id] = true;
                                    item.datadArr.push(item.dataObject[key]);
                                    item.datadArr.forEach(item2=>{
                                        item2.forEach(item3=>{
                                            item3.id = item3.billDetailIdList[0];
                                            // self.checkChild[item3.id] = true;
                                            self.feeList = self.feeList.set(item3.id,{assetsId:item3.assetId,expenditure:item3.typeName,totalAmount:item3.fiSeasonArrearAmount})
                                            self.feeName =  self.feeName.set(item3.assetId,item3.typeName)
                                            // self.checkSon = Array.from(new Set([...self.checkSon, ...item3.billDetailIdList]));
                                            item3.isPark = false;
                                            item3.isEnergy = false;
                                            item.roomGroupBDIds = Array.from(new Set([...item.roomGroupBDIds, ...item3.billDetailIdList]));
                                            if(item3.parkingNumber){
                                                item3.isPark = true;
                                            }
                                            if(item3.energyList && item3.energyList.length > 0){
                                                item3.isEnergy = true;
                                            }
                                            /*
                                            *默认勾选截至 字段的初始值 跟 缴费周期保持联动，
                                            *如果缴费周期选择月，默认勾选截至切换为当月，可以调整，依次类推
                                            *checkType  1-当月，2-当季，3-当年，4-全部，5-不勾
                                            */
                                            if(self.checkType == 1){
                                                let nowMonth = moment().format("YYYY-MM")
                                                if(moment(item3.endDate).isSameOrBefore(nowMonth)){
                                                    self.checkChild[item3.id] = true;
                                                    self.checkSon = Array.from(new Set([...self.checkSon, ...item3.billDetailIdList]));
                                                }
                                            }else if(self.checkType == 2){
                                                let nowQuarter = moment().quarter();
                                                let nowYear = moment().format("YYYY");
                                                let date = "";
                                                if(nowQuarter == 1){
                                                    date = nowYear+"-03"
                                                }else if(nowQuarter == 2){
                                                    date = nowYear+"-06"
                                                }else if(nowQuarter == 3){
                                                    date = nowYear+"-09"
                                                }else if(nowQuarter == 4){
                                                    date = nowYear+"-12"
                                                }
                                                let billMonth = moment(item3.endDate).format("YYYY-MM");
                                                if(moment(billMonth).isSameOrBefore(date)){
                                                    self.checkChild[item3.id] = true;
                                                    self.checkSon = Array.from(new Set([...self.checkSon, ...item3.billDetailIdList]));
                                                }
                                            }else if(self.checkType == 3){
                                                let nowYear = moment().format("YYYY");
                                                let billYear = moment(item3.endDate).format("YYYY");
                                                if(billYear <= nowYear){
                                                    self.checkChild[item3.id] = true;
                                                    self.checkSon = Array.from(new Set([...self.checkSon, ...item3.billDetailIdList]));
                                                }
                                            }else if(self.checkType == 4){
                                                //全部选中
                                                self.roomChecked[item.id] = true;
                                                self.checked[item.dataObject[key].id] = true;
                                                self.checkChild[item3.id] = true;
                                                self.checkSon = Array.from(new Set([...self.checkSon, ...item3.billDetailIdList]));
                                            }
                                            let flag = true;
                                            if(!self.checkSon.includes(item.id)){
                                                flag = false;
                                            }
                                            if(flag){
                                                self.checked[item.dataObject[key].id] = true;    //如果费用全选，账期为全选状态
                                            }
                                        })
                                        let flag1 = true;
                                        if(!self.checked[item.id]){
                                            flag1 = false;
                                        }
                                        if(flag1){
                                            self.roomChecked[item.id] = true;      //如果房间下的费用全选，则房间维选择状态
                                        }
                                    })
                                }
                            });
                            self.bills = res.data.data;
                            console.log(self.bills);
                            console.log(self.checkSon);
                            console.log('缴费项目',self.feeName)
                            console.log('季度账单',self.feeList)

                        }else{
                            self.showEmpty = true;
                        }
                    }else{
                        res.data.data.datadArr = [];
                        for(let key in res.data.data) {
                            if (key != "datadArr") {
                                // if(key.slice(4,5) == '1'){
                                //     res.data.data[key].title = key.slice(0,4) + "一季度";
                                // }else if(key.slice(4,5) == '2'){
                                //     res.data.data[key].title = key.slice(0,4) + "二季度";
                                // }else if(key.slice(4,5) == '3'){
                                //     res.data.data[key].title = key.slice(0,4) + "三季度";
                                // }else if(key.slice(4,5) == '4'){
                                //     res.data.data[key].title = key.slice(0,4) + "四季度";
                                // }
                                res.data.data[key].title = res.data.data[key][0].dateRange;
                                res.data.data[key].groupMoneyTotal = res.data.data[key][0].groupMoneyTotal;
                                res.data.data[key].id = res.data.data[key][0].billDetailIdList[0];
                                self.checked[res.data.data[key].id] = true;
                                res.data.data.datadArr.push(res.data.data[key]);
                                res.data.data.datadArr.forEach(item=>{
                                    item.forEach(item2=>{
                                         self.feeList = self.feeList.set(item2.id,{assetsId:item2.assetId,expenditure:item2.typeName,totalAmount:item2.fiSeasonArrearAmount})
                                         self.feeName = self.feeName.set(item2.assetId,item2.typeName)
                                         self.checkSon = Array.from(new Set([...self.checkSon, ...item2.billDetailIdList]));
                                    })
                                })
                            }
                        }
                        self.bills[0] = res.data.data;
                        console.log(self.bills);
                        console.log(self.checkSon);
                    }
                    self.billLoading = false;
                }else{
                    self.bills = [];
                    self.billLoading = false;
                    self.showEmpty = true;
                }
            })
            console.log(self.bills);
        },

        //选择费项
        checkFee(data, periodData, roomFee){
            let self = this;
            let id = data.id;
            self.checkChild[id] = !self.checkChild[id];
            self.checkChild = JSON.parse(JSON.stringify(self.checkChild));
            if(self.checkChild[id]){
                self.checkSon = Array.from(new Set([...data.billDetailIdList, ...self.checkSon]));
                self.feeName = self.feeName.set(data.assetId,data.typeName)
                self.feeList = self.feeList.set(data.id,{assetsId:data.assetId,expenditure:data.typeName,totalAmount:data.fiSeasonArrearAmount})

               let flag = true;
                periodData.forEach(item=>{
                    if(!self.checkSon.includes(item.id)){
                        flag = false;
                    }
                    if(flag){
                        self.checked[periodData.id] = true;    //如果费用全选，账期为全选状态
                    }else{
                        self.checked[periodData.id] = false;
                    }
                })

                let flag1 = true;
                roomFee.datadArr.forEach(item=>{
                    if(!self.checked[item.id]){
                        flag1 = false;
                    }
                })
                if(flag1){
                    self.roomChecked[roomFee.id] = true;      //如果房间下的费用全选，则房间维选择状态
                }else{
                    self.roomChecked[roomFee.id] = false;
                }
            }else{
                data.billDetailIdList.forEach(item=>{
                    self.checkSon.forEach((item2, index2)=>{
                        if(item == item2){
                            self.checkSon.splice(index2, 1);
                            self.feeName.delete(item)
                            self.feeList.delete(item)

                        }
                    })
                })
                self.checked[periodData.id] = false;
                self.roomChecked[roomFee.id] = false;
            }
            self.checked = JSON.parse(JSON.stringify(self.checked));
            console.log(self.checkSon)
            console.log('费项名称',self.feeName)
            console.log('选择费项合并账单',self.feeList)
        },

        //选择季度账单
        checkPeriod(data, roomFee){
            let self = this;
            let id = data[0].billDetailIdList[0];
            self.checked[id] = !self.checked[id];
            self.checked = JSON.parse(JSON.stringify(self.checked));
            let ids = [];
            data.forEach(item=>{
                ids = Array.from(new Set([...ids, ...item.billDetailIdList]));
             })
            if(self.checked[id]){
                self.checkSon = Array.from(new Set([...ids, ...self.checkSon]));

                data.forEach(item=>{
                    self.checkChild[item.id] = true;
                })
                let flag = true;
                roomFee.datadArr.forEach(item=>{
                    if(!self.checked[item.id]){
                        flag = false;
                    }
                })
                if(flag){
                    self.roomChecked[roomFee.id] = true;      //如果房间下的费用全选，则房间维选择状态
                }else{
                    self.roomChecked[roomFee.id] = false;
                }
            }else{
                data.forEach(item=>{
                    self.checkChild[item.id] = false;
                })
                ids.forEach(item=>{
                    self.checkSon.forEach((item2, index2)=>{
                        if(item == item2){
                            self.checkSon.splice(index2, 1);
                            self.feeName.delete(item);
                            self.feeList.delete(item)
                        }
                    })
                })
                self.roomChecked[roomFee.id] = false;
            }
            // self.$nextTick(()=>{
            //     self.checked[id] = self.checked[id];
            // })
            console.log(ids),
            console.log(self.checkSon)
        },

        //选择房间
        checkRoom(data, id){
            let self = this;
            self.roomChecked[id] = !self.roomChecked[id];
            self.roomChecked = JSON.parse(JSON.stringify(self.roomChecked));
            if(self.roomChecked[id]){
                self.checkSon = Array.from(new Set([...data.roomGroupBDIds, ...self.checkSon]));
                self.feeName = self.feeName.set(data.assetId,data.typeName)
                self.feeList = self.feeList.set(data.id,{assetsId:data.assetId,expenditure:data.typeName,totalAmount:data.fiSeasonArrearAmount})
                 console.log(self.feeName)
                console.log('选择房间费项列表',self.feeList)
                data.datadArr.forEach(item=>{
                    self.checked[item.id] = true;
                    item.forEach(item2=>{
                        self.checkChild[item2.id] = true;
                    })
                })
            }else{
                data.roomGroupBDIds.forEach(item=>{
                    self.checkSon.forEach((item2, index2)=>{
                        if(item == item2){
                            self.checkSon.splice(index2, 1);
                        }
                    })
                })
                data.datadArr.forEach(item=>{
                    self.checked[item.id] = false;
                    item.forEach(item2=>{
                        self.checkChild[item2.id] = false;
                    })
                })
            }
            console.log("房间："+JSON.stringify(self.roomChecked))
        },

        //显示能源费用详情
        showEnergyPopup(data){
            let self = this;
            self.energyPopup = true;
            if(data.energyList && data.energyList.length > 0){
                data.energyList.forEach(item=>{
                    item.createDate = moment(item.createDate).format("YYYY-MM-DD")
                })
            }
            self.feeDetail = data;
        },

        //显示费项明细
        showFeePopup(data){
            let self = this;
            self.feePopup = true;
            self.billDetailInfo = data.billDetailInfo;
        },

        setNum() {
            let self = this;
            self.totalAmount = 0;
            let totalMoney = 0;
            let feeName = new Map();
            let feeList = new Map();
            self.bills.forEach(item=>{
                item.datadArr.forEach(item2=>{
                    item2.forEach(item3=>{
                        if(self.checkSon.indexOf(item3.id) > -1){
                            totalMoney = self.accAdd(item3.fiSeasonArrearAmount, totalMoney)
                            feeName.set(item3.assetId,item3.typeName)
                            feeList.set(item3.id,{assetsId:item3.assetId,expenditure:item3.typeName,totalAmount:item3.fiSeasonArrearAmount})

                       }
                    })
                })
            })
            self.feeName = feeName;
            self.feeList = feeList;
            console.log('初始化分支列表',self.feeList)
            console.log('初始化物业缴费',self.feeName)
            self.totalAmount = totalMoney;
            self.$emit("sendNumFun", totalMoney)
        },

        //关闭弹出层
        closePopup(){
            let self = this;
            self.energyPopup = false;
            self.feePopup = false;
        },

        // 两个浮点数求和
        accAdd(num1,num2){
            var r1,r2,m;
            try{
                r1 = num1.toString().split('.')[1].length;
            }catch(e){
                r1 = 0;
            }
            try{
                r2=num2.toString().split(".")[1].length;
            }catch(e){
                r2=0;
            }
            m=Math.pow(10,Math.max(r1,r2));
            // return (num1*m+num2*m)/m;
            return Math.round(num1*m+num2*m)/m;
        },

    },

    watch: {
        checkSon: {
            handler() {
                this.setNum();
            },
            deep: true
        },

        isShowIntegralTips:{
            handler(val){
                if(val){
                    this.$nextTick(() => {
                        self.boxStyle.heightStyle = {
                            height: uni.getSystemInfoSync().windowHeight - 380 + "px"
                        }
                    })
                }
            },
            deep: true
        }
    },
}
</script>

<style lang="scss" scoped>
.house-title{
    padding: 10px 16px;
    background-color: #f5f5f5;
}
.payPageStyle ::v-deep .u-collapse-item{
    background: #ffffff;
}
.payPageStyle ::v-deep .u-cell-group .u-cell__body{
    padding: 5px 0;
    border-top: 1px solid #f0f0f0;
    margin-left: 15px;
}
.payPageStyle ::v-deep .u-collapse-item__content__text{
    padding: 10rpx 0;
    margin: 0 30rpx;
}
.more-btn{
    font-size: 24rpx;
    margin-left: 24rpx;
    float: right;
    color: var(--app-primary-color);
    line-height: 58rpx;
}
.more-btn ::v-deep .u-icon--right{
    height: 58rpx;
}
.energy-item, .fee-item{
    font-size: 12px;
    color: var(--app-primary-color);
}
.ml-10{
    margin-left: 10px;;
}
</style>
