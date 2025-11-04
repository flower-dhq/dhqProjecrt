<template>
    <!-- 选择车场 -->
        <view class="page" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
            <u-sticky offsetTop="0" customStyle="padding: 11px;" bgColor="#f5f5f5">
                <view class="centerbg-item">
                    <u-row
                        justify="space-between"
                        gutter="10"
                    >
                        <u-col span="9">
                            <u--input
                                placeholder="输入项目名称检索"
                                border="none"
                                v-model="searchName"
                                prefixIcon="search"
                                prefixIconStyle="font-size: 22px;color: #909399"
                                customStyle="padding: 8px 11px;background: #f5f5f5;height: 30px;"
                            ></u--input>
                        </u-col>
                        <u-col span="3">
                            <u-button text="搜索" color="var(--app-primary-color)" @click="geProjectList()"></u-button>
                        </u-col>
                    </u-row>
                </view>
            </u-sticky>
            <view class="centerbg">
                <view class="flexBody">
                    <view 
                        class="flexItem" 
                        v-for="(item, index) in projectList"
                        :key="index"
                        @click="changeProject(item)"
                    >{{item.projectName}}</view>
                </view>
            </view>
        </view>
</template>

<script>
import {
    geProjectsByCompanyId, //获取项目
} from "@/service/leasing.js";
import util from "../../js/utils";
export default {
    data(){
        return{
            searchName: "", // 项目名称
            companyId: "" ,   //公司id
            projectList: [],
        }
    },

    onLoad(){
        const {O_USER_INFO } = this.$constant;
        let { companyId} = util.storageAction({ key: O_USER_INFO, action: 'get' });
        this.companyId = companyId;
        this.geProjectList();
    },

    onShow(){

    },

    methods:{
        geProjectList(){
            let self = this;
            self.projectList = [];
            let data = {
                //companyId:438,
                companyId: self.companyId,
                projectName: self.searchName,
            }
            let params = {
                data: data,
            }
            geProjectsByCompanyId(params).then(res=>{
                if(res.status == 200){
                    if(res.data && res.data.length > 0){
                        self.projectList = res.data;
                    }
                }
            })
        },
        changeProject(item){
            let self = this;
            uni.setStorageSync('DEFAULT_PROJECT_ID',item.projectId);   //存在缓存里，车场页面使用
            uni.setStorageSync('DEFAULT_PROJECT_NAME',item.projectName);
            uni.navigateBack();
        },
    }
}
</script>
  
<style lang="scss" scoped>
.page {
    min-height: 100vh;
    background-color: #f5f5f5;
}
.page ::v-deep .u-sticky{
    top: 0px !important;
    border-bottom: 1px solid #f5f5f5;
}
.centerbg {
    padding: 0 22rpx 22rpx;
}
.centerbg-item{
    padding: 11px;
    border-radius: 14rpx;
    background-color: #fff;
}
.flexBody{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    // margin-top: 22rpx;
}
.flexItem{
    padding: 22rpx;
    margin-bottom: 22rpx;
    background-color: #ffffff;
    border-radius: 8px;
    width: 42.8%;
    text-align: center;
    word-break: break-word;
    align-items: center;
    display: flex;
    justify-content: center;
}
.flexItem:hover{
    color: var(--app-primary-color);
}
</style>