<!--  -->
<template>
    <view class='box'>
        <view class="title">
            <view class="jz">
                <text>{{$t('管理概览')}}</text>
            </view>
        </view>
        <view class="contentBox">
            <view>
                <view class="view-cell text-item1">{{$t('在管项目数')}}</view>
                <view class="view-flex">
                    <view> <text class="text-blod">{{projectNum}}</text></view>
                    <view class="left-padding" v-if="0">
                        <text :class="['project-num', projectDynamics]">{{addProjectNum}}</text>
                        <image v-if="projectDynamics == 'green'" :src="require(`@/static/${[THEME_NAME]}/kanban/icon-up.png`)" style="width:16rpx;height:16rpx;"></image>
                        <image v-else :src="require(`@/static/${[THEME_NAME]}/kanban/icon-down1.png`)" style="width:16rpx;height:16rpx;"></image>
                    </view>

                </view>
            </view>
            <view class="box-bg">
                <view class="view-cell view-bgcell">
                    <image :src="require(`@/static/${[THEME_NAME]}/kanban/icon-home.png`)"
                        style="width:28rpx;height:28rpx;"></image>
                    <view class="box-bgtext left-padding">{{$t('房间数')}}</view>
                </view>
                <view class="box-bgNumber">{{roomNum}}</view>
            </view>
            <view class="box-bg">
                <view class="view-cell view-bgcell">
                    <image :src="require(`@/static/${[THEME_NAME]}/kanban/icon-car.png`)"
                        style="width:28rpx;height:28rpx;"></image>
                    <view class="box-bgtext left-padding">{{$t('车位数')}}</view>
                </view>
                <view class="box-bgNumber">{{parkingNum}}</view>
            </view>  
            <view>
                <view class="view-cell text-item1">{{$t('在管面积(m²)')}}</view>
                <view class="view-flex">
                    <view> <text class="text-blod">{{projectSquare}}</text></view>  
                </view>
            </view>
            <view class="box-bg">
                <view class="view-cell view-bgcell">
                    <image :src="require(`@/static/${[THEME_NAME]}/kanban/icon-owner.png`)"
                        style="width:28rpx;height:28rpx;"></image>
                    <view class="box-bgtext left-padding">{{$t('客户数')}}</view>
                </view>
                <view class="box-bgNumber">{{ customerNum }}</view>
            </view>
            <view class="box-bg">
                <view class="view-cell view-bgcell">
                    <image :src="require(`@/static/${[THEME_NAME]}/kanban/icon-people.png`)"
                        style="width:28rpx;height:28rpx;"></image>
                    <view class="box-bgtext left-padding">{{$t('员工数')}}</view>
                </view>
                <view class="box-bgNumber">{{staffNum}}</view>
            </view>  
        </view>

    </view>
</template>

<script>
import i18n from '../../../lang/index'

import {
    getSysBasicDataCount ,
} from '@/service/datawarehouse'
import {
    getParkinglotNum ,
} from '@/service/leasingbi_new'
export default {
    components: {},
    data() {
        return {
            list: [{
                name: i18n.t('房间数'),
                icon: 'icon-home',
                number: 154567
            }, {
                name: i18n.t('车位数'),
                icon: 'icon-car',
                number: 34567
            }, {
                name: i18n.t('业主数'),
                icon: 'icon-owner',
                number: 4578789
            }, {
                name: i18n.t('员工数'),
                icon: 'icon-people',
                number: 32870
            }],
            roomNum:'0',
            parkingNum:'0',
            ownerFemale:'0',
            projectNum:'0',
            ownerMale:'0',
            customerNum:'0',
            staffNum:'0',
            projectSquare:'0',
            ownerEnterprises:'0',
            addProjectNum:'0',
            areaId:'',
            projectId:'',
            currentMonth:'',
            startTime:'',
            endTime:'',
            projectDynamics: 'red'
        };
    },
    computed: {},
    watch: {},
    methods: {
        getSysBasicDataCountData(){
            let { O_USER_INFO } = this.$constant;
		    let userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' });
            let companyId = userInfo.companyId?userInfo.companyId:this.$appConfig.COMPLANY_ID;
            let params = {
                data:{
                    companyId:companyId,
                    areaId:this.areaId,
                    projectId:this.projectId,
                    startTime: this.startTime,
                    endTime: this.endTime
                }
            }
            getParkinglotNum({
                data:{
                    companyId: companyId,
                    areaIds: this.areaId,
                    projectIds: this.projectId,
                }
            }).then(res => {
                if(res.status=='200'){
                    this.parkingNum = res.data || 0
                }
            })
            getSysBasicDataCount(params).then(res=>{
                if(res.status == '200' && res.data){
                    this.roomNum = res.data.roomNum
                    // this.parkingNum = res.data.parkingNum
                    this.ownerFemale = res.data.ownerFemale
                    this.projectNum = res.data.projectNum
                    this.ownerMale = res.data.ownerMale
                    this.customerNum = res.data.customerNum
                    this.staffNum = res.data.staffNum
                    this.projectSquare = res.data.projectSquare
                    this.ownerEnterprises = res.data.ownerEnterprises
                    this.addProjectNum = res.data.projectNumIncrement  
                }
            })
        },
        init(params){
            this.areaId = params.areaId
            this.projectId = params.projectId
            this.startTime = params.startTime
            this.endTime = params.endTime
            this.getSysBasicDataCountData()
        }
    },
    created() {

    },
    mounted() {
        // this.getSysBasicDataCountData()
    },
}
</script>
<style scoped lang="scss">
.box {
    background-color: #FFFFFF;
    padding: 20rpx;
    margin: 0 20rpx;
    border-radius: 12rpx;
}

.title {
    font-size: 32rpx;
    font-weight: bold;
    color: #222222;
    margin-bottom: 10px;

}

.jz {
    display: flex;
    align-items: center;
}

.jz::before {
    content: "";
    height: 32rpx;
    width: 6rpx;
    background: #2761FF;
    margin: 0 10rpx 0 0;
    position: absolute;
    left: 20rpx;
}

.view-flex {
    display: flex;
    align-items: baseline;
}

.left-padding {
    padding-left: 8rpx;
}

.contentBox {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 20rpx;

    .view-cell {
        margin: 0 0 8rpx 0;
    }

    .box-bg {
        background-color: #F6F9FF;
        // display: flex;
        // align-items: center;
        // justify-content: center;
        padding: 14rpx 32rpx;

        .view-bgcell {
            display: flex;
            align-items: center;
         }

        .box-bgtext {
            font-size: 20rpx;
            color: #666666;
        }

        .box-bgNumber {
            font-size: 32rpx;
            font-family: 'DIN';
            color: #333333;
        }
    }

    .text-item1 {
        font-size: 20rpx;
        color: #A0A0A0;
    }

    .text-blod {
        font-size: 40rpx;
        font-family: 'DIN';
        font-weight: bold;
        color: #333333;
    }

    .project-num {
        font-size: 20rpx;
        &.green {
            color: #33BA73;
        }
        &.red {
            color: #FC0B0B;
        }
    }
}
</style>