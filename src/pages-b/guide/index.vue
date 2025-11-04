<!--  -->
<template>
    <view v-if="listData.length" class="guidePage" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
        <view class="search-box" >
            <u-search placeholder="输入名称" bgColor="#FFFFFF" shape="round" :showAction="false" v-model="keyword"
                @search="getList" @clear="getList"></u-search>
        </view>
        <view class="list-box">
            <view class="box-item" v-for="(item, index) in listData" :key="index" @click="j(item)">
                <view class="item-img">
                    <image :src="item.imgIds ? item.imgIds[0] : ''"></image>
                </view>
                <view class="item-text">
                    <view class="title">{{ item.title }}</view>
                    <view class="time">{{ FormattingDate(item.createTime) }}</view>
                </view>
            </view>

        </view>
    </view>
    <view v-else class="nodata">
            <image class="nodataImage"  :src="noDataImg"></image>
            <text class="nodataText" >暂无数据~</text>
        </view>
</template>

<script>
import { queryArticalList } from "@/service/wxmanage";
import util from '../../js/utils';

export default {
    components: {},
    data() {
        return {
            keyword: '',
            listData: [],
            areaId: '',
            projectId: '',
            colId: '',
        };
    },
    onLoad(options) {
        this.colId = options.colId;
    },
    onShow() {
        this.getList();
    },
    computed: {
        noDataImg() {
  return `${this.IMG_BASE_URL}/static/theme-default/multiplexing/tips.png`;
}
    },
    watch: {},
    methods: {
        sumbit() {
            this.getList();
        },
        cancel() {

        },
        getList() {
            const { AREA_ID, PROJECT_ID } = this.$constant;
            this.areaId = util.storageAction({ key: AREA_ID, action: 'get' });
            this.projectId = util.storageAction({ key: PROJECT_ID, action: 'get' });
            var params = {
                data: {
                    colId: this.colId,
                     page: 1,
                    limit: 20,
                    areaId: this.areaId,
                    projectId: this.projectId,
                    title: this.keyword
                }
            }
            queryArticalList(params).then(res => {
                if (res.status == 200) {
                    this.listData = res.data.records;                    
                 }
            })
        },
        FormattingDate(item) {
            if (item && item != '') {
                return item.split(' ')[0]
            }
        },
        j(item) {
            uni.navigateTo({
                url: `/pages-b/announcement/detail?articleId=${item.articleId}&type=guide`
            })

        }

    },
    created() {

    },
    mounted() {

    },
}
</script>
<style scoped lang="scss">

.nodata {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    height: 100%;;
}
.nodataImage{
    height: 175px;
    width: 175px;
}
.nodataText {
    color: #999;
    font-size: 14px;
    text-align: center;
    margin-top: 10px;
    margin-bottom: 50px;
    max-width: fit-content;
    max-height: fit-content;
} 
.guidePage {
    background: #F1F1F1;
    height: 100%;
}

.search-box {
    // margin: 20rpx;
    padding: 30rpx;
}

.list-box {
    background: #FFFFFF;
    overflow: auto;
    height: calc(100% - 128rpx);
  
    .box-item {
        display: flex;
        border-bottom: 1px solid #E4E4E4;
        margin: 30rpx 24rpx;
        padding: 0 0 24rpx 0;

        .item-img {
            border-radius: 10rpx;
            width: 206rpx;
            height: 130rpx;

            image {
                width: 100%;
                height: 100%;
                border-radius: 10rpx;
            }
        }

        .item-text {
            padding: 0 30rpx;
            display: grid;

            .title {
                font-size: 28rpx;
                color: rgba(0, 0, 0, 0.8);
            }

            .time {
                font-size: 24rpx;
                color: #999999;
            }

        }
    }
}
</style>