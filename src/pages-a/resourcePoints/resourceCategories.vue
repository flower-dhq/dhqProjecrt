<!--资源分类 -->
<template>
    <view class="page-col">
        <view v-for="(item, index) in dataList" :key="index" class="page-row">
            <view :class="{ 'row-cell-action': selectCellList[index] == childList.resourceMenuId }"
                v-for="(childList, cindex) in item.list" :key="childList.resourceMenuId" class="row-cell"
                @click="selectCell(childList, index)">
                <text>{{ childList.resourceMenuName }}</text>
            </view>
        </view>
    </view>
</template>

<script>
import { getLastLevelList } from '../../service/leasing'
export default {
    components: {},
    data() {
        return {
            projectId: '',
            dataList: [],
            childList: [],
            isChild: false,
            selectIndex: 0,
            selectCellList: [],
            lastlevel: 0,
        };
    },
    computed: {},
    watch: {},
    methods: {
        async getList(pId) {
            var params = {
                data: {
                    projectId: this.projectId,
                }
            }
            this.isChild = false;
            let result = await getLastLevelList(params);
            if (result.status == 200) {
                this.dataList = [{
                    PID: '0',
                    list: result.data
                }]
                // if (pId == 0) {
                //     this.dataList.push({
                //         pId: '0',
                //         list: result.data
                //     })
                // } else {
                //     this.childList = result.data;
                //     await this.formatTree(this.dataList, this.childList[0]);
                // }
            }
        },
        async selectCell(item, index) {
            this.selectIndex = index;
            this.$set(this.selectCellList, index, item.resourceMenuId);
            this.selectCellList.splice(index + 1, this.selectCellList.length);
            uni.$emit('select-category', { data: item })
            uni.navigateBack()



        },
        formatTree(data, item) {
            if (!item) {
                this.dataList.splice(this.selectIndex + 1, this.dataList.length);
                return;
            }
            let flag = false;
            for (let index = 0; index < data.length; index++) {
                const element = data[index];
                if (element.pId == item.pId + '') {
                    flag = true;
                    this.dataList[index].list = this.childList;
                }
            }
            if (!flag) {
                this.dataList.push({
                    pId: item.pId,
                    list: this.childList
                })
            }
            return;

        }

    },
    created() {

    },
    onLoad(option) {
        this.projectId = option.projectId;
    },
    mounted() {
        this.getList(0);
    },
}
</script>
<style scoped lang="scss">
.page-col {
    display: flex;
    height: 100%;

    .page-row:nth-child(1) {
        background: #F7F7F7;
    }

    .page-row:nth-child(2) {
        background: #F3F3F3;
    }

    .page-row:nth-child(3) {
        background: #FFFFFF;

        .row-cell {
            border-bottom: 1px solid #EBEBEB;
        }
    }

    .page-row {
        flex: 1;
        max-width: calc(100%);
        // padding: 0 10px;
        // text-align: center;
        height: 100%;
        overflow: auto;

        .row-cell {
            height: 102rpx;
            line-height: 102rpx;
            font-size: 30rpx;
            color: #333333;
            padding: 0 10px;
        }

        .row-cell-action {
            padding: 0 10px;
            font-size: 30rpx;
            color: #1989F7;
            background: #FFFFFF;
        }
    }
}
</style>