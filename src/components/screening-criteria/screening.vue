<!--  -->
<template>
    <view class=''>
        <view v-if="show" class='uni-calendar__mask' :class="{ 'uni-calendar--mask-show': aniMaskShow }" @click="maskClick">
        </view>
        <!-- 区域项目筛选 -->
        <view v-if="showArea" class="uni-calendar__content"
            :class="{ 'uni-calendar--fixed': !insert, 'uni-calendar--ani-show': aniMaskShow }" :style="{ top: top }">
            <view class="areaBox">
                <view class="areaBox-left">
                    <view class="col_ul" :class="{ 'ul_active': searchForm.areaId == item.areaId }"
                        v-for="(item, index) in areaList" :key="index" @click="changeArea(item)">{{
                            item.areaName }} </view>
                </view>
                <view class="areaBox-right">
                    <view class="col_ul" :class="{ 'ul_active': searchForm.projectId == item.projectId }"
                        v-for="(item, index) in projectList" :key="index" @click="changeProject(item)">{{ item.projectName
                        }}</view>
                </view>
            </view>
            <view class="area_submit" > 
                <view @click="resetArea">{{ $t('重置') }}</view>
                <view @click="queryData">{{ $t('查询') }}</view>
            </view>
        </view>
        <!-- 群组 -->
        <view v-if="showData" class="uni-calendar__content"
            :class="{ 'uni-calendar--fixed': !insert, 'uni-calendar--ani-show': aniMaskShow }" :style="{ top: top }">
            <view class="cell-box">
                <view class="col_ul" :class="{ 'ul_active': searchForm.selectData == item[keyName] }"
                    v-for="(item, index) in dataList" :key="index" @click="selectData(item)">{{
                        item[keyValue] }} </view>
            </view>
            <!-- <view class="area_submit" @click="selectArea"> 确认 </view> -->
        </view>
        <view v-if="cascade" class="uni-calendar__content"
            :class="{ 'uni-calendar--fixed': !insert, 'uni-calendar--ani-show': aniMaskShow, 'page-col': true }"
            :style="{ top: top }">
            <view v-for="(item, index) in dataList" :key="index" class="page-row">
                <view :class="{ 'row-cell-action': selectCellList[index] == childList.resourceMenuId }"
                    v-for="(childList, cindex) in item.list" :key="childList.resourceMenuId" class="row-cell"
                    @click="selectCell(childList, index)">
                    <text>{{ childList.resourceMenuName }}</text>
                </view>
            </view>
        </view>


    </view>
</template>

<script>
import mpMixin from '@/js/mixin/mpMixin'
import { getAreaList, getProjectList, getWorkTypeListAll } from '../../service/landcrm'
import { getContactGroupList } from '../../service/wechatguanjia';

export default {
    mixins: [mpMixin],
    props: {
        top: {
            type: String,
            default: 0
        },
        insert: {
            type: String,
            default: ''
        },
        defaultArea:{
            type:Boolean,
            default:true
        }
    },
    components: {},
    data() {
        return {
            userId: '',
            show: false,
            showArea: false,
            showData: false,
            cascade: false,
            aniMaskShow: false,
            areaList: [],
            projectList: [],
            searchForm: {
                areaId: '',
                areaName: '',
                projectId: '',
                projectName: '',
                workType: '',//专业
                orginSource: '',//起单来源
                isHouseFlag: '',//是否房修
                selectData: '',
            },
            groupDate: [],
            dataList: [],
            keyName: '',
            keyValue: '',
            selectCellList: []
            };
    },
    computed: {},
    watch: {},
    methods: {
        // 蒙版点击事件
        maskClick() {
            this.close()
            this.$emit('maskClose')
        },
        // 重置
        resetArea() {
            this.searchForm.areaId = ''
            this.searchForm.areaName = ''
            this.searchForm.projectId = ''
            this.searchForm.projectName = ''
            this.$emit('selectProject', this.searchForm)
            this.close()
        },
        /**
              * 打开日历弹窗
              */
        open(type, dataList) {
            //   默认打开区域项目
            this.show = true
            this.aniMaskShow = true
            this.showData = false;
            this.showArea = false;
            this.cascade = false;
            if (type == 'group') {
                this.dataList = dataList.data;
                this.keyName = dataList.keyName,
                    this.keyValue = dataList.keyValue,
                    this.searchForm.selectData = dataList.selectData,
                    this.showData = true;
            } else if (type == 'cascade') {
                this.dataList = dataList.data;
                this.selectCellList = dataList.selectCellList;
                // this.keyName = dataList.keyName,
                //     this.keyValue = dataList.keyValue,
                //     this.searchForm.selectData = dataList.selectData,
                this.cascade = true;
            } else {
                this.showArea = true;
            }


        },
        /**
        * 关闭日历弹窗
        */
        close() {
            this.show = false
            this.aniMaskShow = false
            this.showArea = false;
            this.showData = false;
            this.cascade = false;
            this.$nextTick(() => {
                setTimeout(() => {
                    this.$emit('close')
                }, 300)
            })
        },
        changeArea(item) {
            let that = this;
            that.searchForm.areaId = item.areaId;
            that.searchForm.areaName = item.areaName;
            that.searchForm.projectId = '';
            that.searchForm.projectName = '';
            that.getProjectData(that.searchForm.areaId);
        },
        getAreaData() {
            var params = {
                data: {
                    userId: this.userId
                },
                hideLoading: true,
                responseToast: false,
            }
            getAreaList(params).then(res => {
                this.areaList = res.items || [];
                this.$nextTick(() => {
                    if (this.areaList.length > 0) {
                        if(this.defaultArea){
                        //  this.changeArea(this.areaList[0]);
                        }
                     }
                })
            })
        },
        changeProject(item) {
            let that = this;
            that.searchForm.projectId = item.projectId;
            that.searchForm.projectName = item.projectName;
            that.$emit('selectProject', that.searchForm)
            that.close()
        },
        queryData(){
            this.$emit('selectProject', this.searchForm)
            this.close()
        },
        getProjectData(val) {
            /**
             * 根据城市公司id和userId查询项目列表
             */
            var self = this;
            if (val == '') {
                return false;
            }
            var params = {
                data: {
                    userId: this.userId,
                    areaId: val || ''
                },
                hideLoading: true,
                responseToast: false,
            }
            getProjectList(params).then(res => {
                self.projectList = []
                let list = Array.isArray(res.items) ? res.items : []
                // if (list) {
                //     if (list.length > 1) {
                //         self.projectList.push({ projectId: "-1", projectName: "全部" });
                //     }
                // }
                const { PROJECT_CODE } = this.$appConfig
                const zhupipati = PROJECT_CODE == 'ZHUPIPATI'
                const projectList = zhupipati ? list.filter(item => item.projectTypeName == '真实项目') : list

                self.projectList = projectList
								// 点击区域不自动选择项目
                // this.$nextTick(() => {
                //     this.changeProject(this.projectList[0])
                // }) 
            })
        },
        selectData(item) {
						let before = this.searchForm.selectData
            this.searchForm.selectData = item[this.keyName];
            this.$emit('selectData', item);

        },
        selectCell(item, index) {
					  let sameNum = false
						if(item.resourceMenuId == this.selectCellList[0]){
							sameNum = true
						}
            this.selectIndex = index;
            this.$set(this.selectCellList, index, item.resourceMenuId);
            this.selectCellList.splice(index + 1, this.selectCellList.length);
            console.log(this.selectCellList);
            item.index = index;
            this.$emit('selectCell', item,this.selectCellList,sameNum);
        },

    },
    created() {

    },
    mounted() {
        let { O_USER_INFO } = this.$constant;
        let userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' });
        this.userId = userInfo.userId || uni.getStorageSync('userId');
        console.log(256,userInfo.userId,uni.getStorageSync('userId'))
        this.getAreaData();
        // this.getWorkTypeData();
    },
}
</script>
<style scoped lang="scss">
.uni-calendar__mask {
    position: fixed;
    bottom: 0;
    top: 140px;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.4);
    // transition-property: opacity;
    // transition-duration: 0.3s;
    opacity: 0;
    /* #ifndef APP-NVUE */
    z-index: 99;
    /* #endif */
}

.uni-calendar--mask-show {
    opacity: 1
}

.uni-calendar--fixed {
    position: fixed;
    bottom: auto;
    left: 0;
    right: 0;
    // transition-property: transform;
    // transition-duration: 0.3s;
    // transform: translateY(0);
    /* #ifndef APP-NVUE */
    z-index: 99;
    /* #endif */
}

.uni-calendar--ani-show {
    transform: translateY(0);
}

.uni-calendar__content {
    background-color: #f7f7f7;
    margin: 0 0 100rpx 0;

    &::v-deep .u-cell {
        height: 300px;
        overflow: auto;
    }
}


// 区域弹出框样式
.areaBox {
    display: flex;
    height: 300px;
}

.areaBox-left {
    width: 40%;
    overflow: auto;


}

.areaBox-right {
    width: 60%;
    overflow: auto;


}

.col_ul {
    display: flex;
    align-items: center;
    min-height: 100rpx;
    line-height: 50rpx;
    background: #F7F7F7;
    font-size: 30rpx;
    color: #333333;
    padding: 0 30rpx;
}

.ul_active {
    color: #2761FF;
    background: #FFFFFF;
}

.area_submit {
    width: 100%;
    color: #FFFFFF;
    font-size: 14px;
    background: #2761FF;
    height: 38px;
    line-height: 38px;
    text-align: center;
    display: flex;
    view{
        flex: 1;
    }
    :first-child{
        border-right: 1px solid #fff;
    }
}

.cell-box {
    height: 300px;
    overflow-y: auto;
    margin-top: 24rpx;
}

// end
.page-col {
    display: flex;
    height: 300px;

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
        // text-align: center;
        // padding: 0 10px;
        height: 100%;
        overflow: auto;

        .row-cell {
            padding: 0 10px;
            height: 102rpx;
            line-height: 102rpx;
            font-size: 30rpx;
            color: #333333;
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