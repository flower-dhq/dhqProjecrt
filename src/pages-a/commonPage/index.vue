<!-- 常用素材 -->
<template>
    <view class="page">
        <view class="page-search"> 
        <u-search  placeholder="输入标题/描述关键词搜索"  :showAction="false" @search="getData"
            v-model="keyword"></u-search>
        </view>
        <u-list @scrolltolower="scrolltolower" height="calc(100% - 128rpx)">
            <view class="list-row" v-for="(item, index) in dataList" :key="index">
                <view>
                    <image class="img" :src="item.materialPicUrl"></image>
                </view>
                <view class="list-cell">
                    <view class="list-text">{{ item.materialTitle }}</view>
                    <view class="list-desc">{{ item.materialDesc }}</view>
                    <view>
                        <text class="list-type">{{ item.type == 1 ? 'H5' : '小程序' }}</text>
                    </view>

                </view>
                <view class="list-btn" @click="share(item)">发送</view>
            </view>
            
            <u-loadmore v-if="dataList.length == 0" status="nomore" line />
        </u-list>
    </view>
</template>

<script>
import { getCompanyAgentMaterialList } from '@/service/wechatguanjia'
import Utils from '@/js/utils'
import { sendChatMessage } from '@/js/sharePage'

export default {
    components: {},
    data() {
        return {
            keyword: '',
            dataList: []
        };
    },
    computed: {},
    watch: {},
    async onLoad() { 
        // #ifdef MP-WEIXIN
        const res = wx.getSystemInfoSync();
        if (res.environment) {
            await this.$onLaunched;
            let flag =await Utils.toolbarPermissions();   
            if(!flag){
                return;
            }
        }
        // #endif
        this.getData();
    },
    methods: { 
        async getData() {
            const params = {
                data: {
                    pageNum: 1,
                    pageSize: 10,
                    title: this.keyword,
                    desc: this.keyword
                }
            }
            const res = await getCompanyAgentMaterialList(params).catch(_ => {})
            
            const data = res.data?.records ?? []
            // 标题为“分享xxx”的菜单，不显示出来，因为已经被页面的分享按钮占用了，也就是说需要带出参数才能使用这个菜单页面
            this.dataList = data.filter(item => !(item.materialTitle || '').startsWith('分享'))
        },
        share(item) {
            sendChatMessage({
                type: item.type,
                title: item.materialTitle,
                desc: item.materialDesc,
                imgUrl: item.materialPicUrl,
                pageUrl: item.materialUrl,
                appid: item.appId
            })
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
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    background: #F5F5F5;
     
}
.page-search{
    background: #FFFFFF;
    padding: 10px;
} 

::v-deep .u-list {
    overflow: auto;
     margin-top: 20rpx;
     .list-row {
         display: flex;
        align-items: center;
        gap: 20rpx;
        border-bottom: 1px solid #EBEBEB;
        padding: 20rpx 20rpx;
        background: #FFFFFF;
    }

    .img {
        height: 128rpx;
        width: 160rpx;
    }

    .list-btn {
        position: absolute;
        right: 30rpx;
        font-size: 26rpx; 
        color: #FFFFFF;
        background: #197AFA;
        border-radius: 8rpx;
        padding: 10rpx 20rpx;
    }

    .list-cell {
        display: grid;
        gap: 3px;
    }

    .list-text {
        font-size: 28rpx;
        font-weight: bold;
        color: #333333;
    }

    .list-desc {
        font-size: 26rpx;
        color: #999999;
     }

    .list-type { 
        padding: 2rpx 8rpx;  
        font-size: 22rpx;
        color: #1989F7;
        border-radius: 4rpx;
        border: 1px solid #1989F7;
    }
}
</style>