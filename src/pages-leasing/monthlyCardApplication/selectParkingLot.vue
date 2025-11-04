<template>
  <!-- 选择车场 -->
    <view class="page" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
        <view class="centerbg">
            <view class="centerbg-item">
                <u-cell-group :border="false">
                    <u-cell 
                        :title="projectName" 
                        isLink
                        url="/pages-leasing/monthlyCardApplication/selectProject"
                    ></u-cell>
                </u-cell-group>
                <u-cell-group :border="false">
                    <u-cell 
                        v-for="(item, index) in parkingLotList"
                        :key="index"  
                        :title="item.resourceName"
                        :label="item.monthCardApplyTip"
                        @click="changeparkingLot(item)"
                    >
                        <text
                            slot="value"
                            class="u-slot-value"
                        >{{item.monthCardDesc}}</text>
                    </u-cell>
                </u-cell-group>
            </view>
        </view>
        <u-popup :show="isshow" @close="isshow=false" mode="center" 
             customStyle="background-color: #fff; border-radius: 8px;width:85%;height:440rpx">
          <view class="ispopup">
              <text class="addcar">{{title}}</text>
              <text class="addkeysubmit" @click="isshow=false">确认</text>
          </view>
	   </u-popup>
    </view>
</template>

<script>
import {
    geProjectsByCompanyId, //获取项目
    getResourceMenuManger,  //获取车场
    checkMonthCardOpenCardTime
} from "@/service/leasing.js";
import util from "../../js/utils";
import { tr } from '@dcloudio/vue-cli-plugin-uni/packages/postcss/tags';
export default {
    data(){
        return{
            isshow:false,
            title:'',
            closable:true,
            companyId: "" ,   //公司id
            projectId: "", // 项目id
            projectName: "", // 项目名称
            parkingLotList: [],  //车场
        }
    },

    onLoad(){
        const {O_USER_INFO } = this.$constant;
        let { companyId} = util.storageAction({ key: O_USER_INFO, action: 'get' });
        this.companyId = companyId;
    },

    onShow(){
        this.geProjectList();
    },

    methods:{
        geProjectList(){
            let self = this;
            const { PROJECT_ID,} = this.$constant;
            let data = {
                companyId: self.companyId,
                //companyId:438
            }
            let params = {
                data: data,
            }
            geProjectsByCompanyId(params).then(res=>{
                if(res.status == 200){
                    if(res.data && res.data.length > 0){
                        let projectList = res.data;
                        let result = false;
                        let defaultPrijectId = "";
                        /**判断缓存里面有没有DEFAULT_PROJECT_ID，
                         * DEFAULT_PROJECT_ID有值，页面默认项目为DEFAULT_PROJECT_ID
                         * DEFAULT_PROJECT_ID为空，页面默认项目用接口返回的第一个项目*/
                        // self.projectId =self.projectId?self.projectId:projectList[0].projectId;
                        //  self.projectName = projectList.find(
                        //  item => item.projectId == self.projectId 
                        //  ).projectName;
                        if(uni.getStorageSync('DEFAULT_PROJECT_ID')){
                            defaultPrijectId = parseInt(uni.getStorageSync('DEFAULT_PROJECT_ID'));
                        }
                        if(defaultPrijectId){
                            projectList.forEach(item=>{
                                if(parseInt(item.projectId) == defaultPrijectId){
                                    result = true;
                                    return false;
                                }
                            })
                        }
                        if(result){
                            self.projectName = projectList.find(item => item.projectId == defaultPrijectId).projectName;
                            self.projectId = defaultPrijectId;
                        }else{
                            self.projectId = util.storageAction({ key: PROJECT_ID, action: 'get' });
                            self.projectName = projectList.find(
                            item => item.projectId == self.projectId 
                            ).projectName;
                            uni.setStorageSync('DEFAULT_PROJECT_ID',self.projectId);   //存在缓存里，车场页面使用
                            uni.setStorageSync('DEFAULT_PROJECT_NAME',self.projectName);
                        }
                        self.getParkingLotList();
                    }
                }else{
                    self.toastWord({ text: res.message })
                }
            })
        },
        changeparkingLot(item){
            let self = this;
            let data = {
                resourceMenuId: item.resourceMenuId,
            }
            let params = {
                data: data,
            }
            checkMonthCardOpenCardTime(params).then(res=>{
                if(res.status == 200){
                    let form = {
                        resourceMenuId: item.resourceMenuId,
                        resourceName: item.resourceName,
                        projectId:self.projectId,
                        projectName:self.projectName,
                        resourceMenuids: item.ids,
                        mcsettingId:item.mcsettingId,
                    }
                    uni.navigateTo({
                         url:'/pages-leasing/monthlyCardApplication/addmonthlyCardApplication?type=add&form=' + JSON.stringify(form)
                    });
                }else{
                    self.isshow = true
                    self.title = res.message
                }
            })
        },

        //获取车场
        getParkingLotList(){
            let self = this;
            self.parkingLotList = [];
            let data = {
                projectId: self.projectId
            }
            let params = {
                data: data
            }
            getResourceMenuManger(params).then(res=>{
                if(res.status == 200){
                    if(res.data && res.data.length > 0){
                        self.parkingLotList = res.data;
                    }
                }else{
                    self.toastWord({ text: res.message })
                }
            })
        },

        // 提示文字
        toastWord(params) {
            const { text } = params;
            if (!text) return;
            uni.showToast({ title: text, icon: 'none' });
        },
    }
}
</script>

<style lang="scss" scoped>
.page {
    min-height: 100vh;
    background-color: #f5f5f5;
}
.centerbg {
    padding: 22rpx;
}
.centerbg-item{
    border-radius: 14rpx;
    background-color: #fff;
}
.centerbg-item ::v-deep .u-slot-value{
    color: #ff3300;
}
.centerbg-item ::v-deep .u-cell__title-text{
    line-height: 60rpx;
}
.centerbg-item ::v-deep .u-line{
    border-bottom: 1px solid #e9e9e9 !important;
}
.addcar {
  color: #333333;
  font-weight: bold;
 // position: relative;
 // top: 20rpx;
//   left: 20rpx;
  font-size: 30rpx;
//   line-height: 50rpx;
  height:60rpx;
  line-height:60rpx
}
.addkeysubmit{
  padding: 20rpx 200rpx;
  color: #fff;
  background: var(--app-primary-color);
  border-radius: 14rpx;
  position: absolute;
  bottom: 40rpx;
  left: 15%;
}
.ispopup{
    // width:100%;
    text-align: center;
    padding: 40rpx;
    padding-top: 80rpx;

}
</style>