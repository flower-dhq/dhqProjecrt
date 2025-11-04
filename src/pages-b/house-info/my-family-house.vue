<style lang="scss" scoped>
.my-family-page{
  padding: 0 28rpx 68rpx;
}
.nodata {
    height: 100vh;
    background: url("@/static/theme-default/multiplexing/tips.png");
    background-position: center;
    background-repeat: no-repeat;
    background-size: 175px;
    position: relative;
    background-position: center 25%;
    background-color: #ffffff;
}
.nodata::after {
    content: "暂无数据~";
    color: #999;
    font-size: 14px;
    text-align: center;
    margin-top: 10px;
    margin-bottom: 50px;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
} 
</style>
<template>
  <view class="my-family-page" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
    <my-family-item v-for="(item,i) in familyList" :key="i" :familyData ='item' @openModal='openModal'></my-family-item>
    <u-modal :show="modalShow" :content='modalCont' :showCancelButton='true' @confirm='confirm' @cancel='cancel'></u-modal>
    <view v-if="familyList.length==0" class="nodata"></view>

  </view>
</template>
<script>
import utils from '@/js/utils';
import { getMyFamilyList, findLocations, DeleteFamily } from '../../service/community'
import { updateIsWarn } from '../../service/doorService'
import MyFamilyItem from './components/my-family-item.vue'
import commLogic from '@/js/comm-logic';
export default {
  components:{
    MyFamilyItem
  },
  data(){
    return{
      memberId:'',
      companyId:'',
      projectType:'',
      userTypesNum:'',
      familyList:[],
      modalShow:false,
      modalCont:'',
      selectObj: {},
      selectType:null,
    }
  },

  onLoad(){
    this.getMemberInfo()
    this.initData()
  },

  methods:{

    openModal(item,type){
      this.modalShow = true
      if(type == '0'){
        this.modalCont = '确定删除家人吗？'
      }else{
        this.modalCont = '确定解除人文关怀消息提醒吗？'
      }
      this.selectObj = item
      this.selectType = type
    },

    confirm(){
      this.modalShow = false
      if(this.selectType==0){
        this.delFamily()
      }else{
        this.relieveMessage()
      }
    },

    cancel(){
      this.modalShow = false
      this.selectObj = {}
      this.selectType = null
    },

    //删除家人
    delFamily(){
      let item = this.selectObj
      let params = {
        data:{
          operateMemberId: item.memberInfoId,
          relateId: item.relateId,
          customerGuid: item.customerGuid
        }
      }
      DeleteFamily(params).then(res =>{
        if(res.status == '200'){
          this.showToast('删除成功！')
          this.initData()
        }else{
          this.showToast(res.message)
        }
      })
    },

    //解除消息提醒
    relieveMessage(){
      let item = this.selectObj
      let params = {
        data:{
          relateId: item.relateId,
          isWarn: 0
        }
      }
      updateIsWarn(params).then(res =>{
        if(res.status == '200'){
          this.showToast('解除成功！')
          this.initData()
        }else{
          this.showToast(res.message)
        }
      })
    },

    //初始化数据
    async initData(){
      let houseArr = await this.getHouselist()
      let familyArr =await this.getMyFamilyList()
      console.log('输出数组',houseArr,familyArr)
      let tempList = []
      houseArr.forEach(item =>{
        familyArr.forEach(data =>{
          if(item.addrId == data.addrId && item.houseState ==2 && data.houseState!=2){
            data.isFlag = true
            tempList.push(data)
          } else if (item.addrId == data.addrId && item.houseState ==2 && data.houseState==2){
            data.isFlag = false
            tempList.push(data)
          }else if(item.addrId == data.addrId && item.houseState !=2 && data.authType==1){
            data.isFlag = false
            tempList.push(data)
          }
        })
      })
      this.familyList = tempList
    },

    //获取房屋列表
    getHouselist(){
      let params = {
        data:{
          companyId: this.companyId,
          memberId: this.memberId,
          projectType: this.projectType
        },
        pathParams:'/1',
        "hideLoading": true
      }
      return findLocations(params).then(res =>{
        if(res.status=='200'){
          let tempArr = res.data.authBuildings
          let list = tempArr.filter(item => item.authType==1)
          return list
        }else{
          return []
        }
      })
    },
    
    //获取家人列表
    getMyFamilyList(){
      let params = {
        data:{
          memberId:this.memberId,
          companyId:this.companyId,
          houseState:this.userTypesNum
        },
        // pathParams:'/0'
      }
      return getMyFamilyList(params).then(res =>{
        if(res.status == '200'){
          let arr = res.data;
          if(arr.length>0){
            arr.forEach(item => {

              //认证状态
              let status = ''
              switch(item.authType){
                case 1:
                  status = '已认证';
                  break;
                case 2:
                  status = '待认证';
                  break;
                case 3:
                  status = '拒绝认证';
                  break;
                case 4:
                  status = '已取消';
                  break;
                case 5:
                  status = '异常';
                  break;
                default:
                  status = '未知状态';
                  break;
              }
              item.status = status

              // 是否是业主

            });
            return arr
          }else{
            return []
          }
        }else{
          return []
        }
      })
    },

    // 提示
    showToast (tips) {
      uni.showToast({ title: tips, icon: 'none' });
    },

    //获取缓存信息
    getMemberInfo(){
      const { O_USER_INFO, URL_PROJECT_TYPE, USER_TYPE_NUM } = this.$constant;
      const { companyId, id } = utils.storageAction({ key: O_USER_INFO, action: 'get' });
      this.userTypesNum = utils.storageAction({ key: USER_TYPE_NUM, action: 'get' });
      this.companyId = companyId;
      this.memberId = id;
      const { projectType } = commLogic.getProjectConfig();
      this.projectType = projectType
    },
  }
}
</script>