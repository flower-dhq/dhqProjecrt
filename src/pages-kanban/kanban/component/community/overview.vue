<!--  -->
<template>
    <view class='block'>
        <view class="bigTitle">
            <view class="jz">
                <text>{{$t('运营概览')}}</text>
            </view>
        </view>
        <view class="content">
            <view class="content-item">
                <view class="item-box item-margin">
                    <view class="text-greyA0 view-marginBottom">{{$t('服务客户数')}}</view>
                    <view class="text-bold">{{clientTotal}}</view>
                </view>
                <view class="item-box">
                    <view class="text-grey20 view-marginBottom">
                        <image :src="require(`@/static/${[THEME_NAME]}/kanban/icon-man.png`)"
                            style="width:28rpx;height:28rpx;"></image>
                        <text class="item-sides">{{$t('男性')}}</text>
                    </view>
                    <view class="text-bold32">{{menNum}}</view>
                </view>
                <view class="item-box">
                    <view class="text-grey20 view-marginBottom">
                        <image :src="require(`@/static/${[THEME_NAME]}/kanban/icon-woman.png`)"
                            style="width:28rpx;height:28rpx;"></image>
                        <text class="item-sides">{{$t('女性')}}</text>
                    </view>
                    <view class="text-bold32">{{girlNum}}</view>
                </view>
                <view class="item-box">
                    <view class="text-grey20 view-marginBottom">
                        <image :src="require(`@/static/${[THEME_NAME]}/kanban/icon-qy.png`)"
                            style="width:28rpx;height:28rpx;"></image>
                        <text class="item-sides">{{$t('企业')}}</text>
                    </view>
                    <view class="text-bold32">{{enterpriseNum}}</view>
                </view>
            </view>
            <view class="content-item">
                <view class="item-box">
                    <view class="text-greyA0 view-marginBottom">{{$t('服务资产数')}}</view>
                    <view class="text-bold">{{assetsNum}}</view>
                </view>
                <view class="item-box">
                    <view class="text-grey20 view-marginBottom">
                        <image :src="require(`@/static/${[THEME_NAME]}/kanban/icon-fj.png`)"
                            style="width:28rpx;height:28rpx;"></image>
                        <text class="item-sides">{{$t('房间')}}</text>
                    </view>
                    <view class="text-bold32">{{roomNum}}</view>
                </view>
                <view class="item-box">
                    <view class="text-grey20 view-marginBottom">
                        <image :src="require(`@/static/${[THEME_NAME]}/kanban/icon-cw.png`)"
                            style="width:28rpx;height:28rpx;"></image>
                        <text class="item-sides">{{$t('车位')}}</text>
                    </view>
                    <view class="text-bold32">{{drivewayNum}}</view>
                </view>
                <view class="item-box">
                    <view class="text-grey20 view-marginBottom">
                        <image :src="require(`@/static/${[THEME_NAME]}/kanban/icon-dj.png`)"
                            style="width:28rpx;height:28rpx;"></image>
                        <text class="item-sides">{{$t('多经')}}</text>
                    </view>
                    <view class="text-bold32">{{verseNum}}</view>
                </view>
            </view>
        </view>

    </view>
</template>

<script>
import i18n from '../../../../lang/index'

import {
    getOperational
} from '@/service/datawarehouse'
export default {
    components: {},
    data() {
        return {
            "enterpriseNum":0,
            "assetsNum":0,
            "clientTotal":0,
            "menNum":0,
            "roomNum":0,
            "drivewayNum":0,
            "girlNum":0,
            "verseNum":'',
            areaId:'',
            projectId:'',
            currentMonth:'',
            startTime:'',
            endTime:''
        };
    },
    computed: {},
    watch: {},
    methods: {
        getOperationalData(){
            let { O_USER_INFO } = this.$constant;
            let userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' });
            let companyId = userInfo.companyId ? userInfo.companyId : this.$appConfig.COMPLANY_ID;
            let params = {
                data:{
                    companyId: companyId,
                    areaId:this.areaId,
                    projectId:this.projectId,
                    startTime: this.startTime,
                    endTime: this.endTime
                }
            }
            getOperational(params).then(res=>{
                if(res.status == '200' && res.data){
                    this.enterpriseNum = res.data.enterpriseNum
                    this.assetsNum = res.data.assetsNum
                    this.clientTotal = res.data.clientTotal
                    this.menNum = res.data.menNum
                    this.roomNum = res.data.roomNum
                    this.drivewayNum = res.data.drivewayNum
                    this.girlNum = res.data.girlNum
                    this.verseNum = res.data.verseNum
                }
            })
        },
        init(params){
            this.areaId = params.areaId
            this.projectId = params.projectId
            this.startTime = params.startTime
            this.endTime = params.endTime
            this.getOperationalData()
        }
    },
    mounted() {
    },
}
</script>
<style scoped lang="scss">
@import url(../../css/kanban.sass);

.content-item {
    display: grid;
    grid-template-columns: repeat(4,1fr);
     grid-row-gap: 20rpx;
 
}

.text-grey20 {
    font-size: 20rpx;
    color: #666666; 
    display: flex;
    align-items: center;
}

.text-bold32 {
    font-size: 32rpx;
    font-family: 'DIN';
    color: #333333;
}</style>