<template>
    <!-- 钥匙借用 -->
    <view :class="[THEME_NAME,'keyPage']" :style="[THEME_CSS_VAR]">
      <view class="title-container">请完成如下信息后提交给物业中心</view>
      <view class="form-cont" style="background:#fff;">
        <u-form :model="formData" ref="uForm" labelWidth="80">
          <u-form-item label="用途*" border-bottom @click="isShow = true">
            <u-input v-model="formData.popuse" placeholder="家人使用" type="select" border="false"/>
            <u-icon slot="right" name="arrow-right"></u-icon>
          </u-form-item>
          <u-form-item label="借用人*" border-bottom>
            <u-input v-model="formData.borrower" placeholder="请填写"  border="false" clearable/>
          </u-form-item>
          <u-form-item label="手机号" border-bottom>
            <u-input v-model="formData.phoneNum" placeholder="请填写"  border="false" clearable/>
          </u-form-item>
          <u-form-item label="身份证" border-bottom>
            <u-input v-model="formData.IDCardNum" placeholder="请填写"  border="false" clearable/>
          </u-form-item>
          <u-form-item label="备注" border-bottom>
            <u-input v-model="formData.remark" placeholder="请填写"  border="false" clearable/>
          </u-form-item>
        </u-form>
      </view>
      <view class="tip-container">
        <text>1.已在物业服务中心签订钥匙授权委托书的业主方可使用此功能。</text>
        <text>2.物业服务中心收到钥匙借用信息后对借用人信息进行核实，如借用人信息与授权信息不一致，物业服务中心有权拒绝借出钥匙。</text>
        <text>3.钥匙借出后借用人的使用行为，与物业服务中心无关。</text>
        <text>4.授权人需告知钥匙借用人，钥匙需在借用当日17:00前进行归还，如因钥匙未按时归还产生的后果与物业服务中心无关。</text>
        <text>5.物业服务中心提供钥匙借用服务的时间为当日9:00-17:00，本次服务预约仅当日有效，如超过时间，请重新预约。</text>
      </view>
      <u-button class="notice-btn" type="primary" text="通知物业" @click="submitKeyCollection">通知物业</u-button>
      <view class="record-container">
        <view class="record-content">
          <view class="cell-title vux-1px-b">我的钥匙</view>
          <view v-for="(item, index) in records" :key="index" :class="['cell', index === records.length - 1 ? '' : 'vux-1px-b']">
            <view class="cell-icon">
              <image class="image" src="/static/housekeeper/keyBorrowRed.png" width="40" height="40">
            </view>
            <view class="cell-content">
              <view class="status-time">
                <view class="status">{{judgeStatus(item)}}</view>
                <view class="time">{{item.operateDate}}</view>
              </view>
              <view class="remark" v-if="item.status === 2" >{{'借用人: '+item.borrowerName+'('+item.borrowerPhone+')'}}</view>
              <view class="remind" v-if="item.status === 3 && records.length < 4">{{judgeTime(item)}}</view>
            </view>
          </view>
        </view>
      </view>
      <u-picker :show="isShow" :columns="popuseList" @cancel="isShow=false" @confirm="complayConfirm"></u-picker>
      <u-notify message="网络错误" ref="uNotify"></u-notify>
      <u-modal 
        ref="uModal" 
        :show="isFlag" 
        title="提交成功" 
        content="是否返回上一页" 
        @confirm="onConfirm"
        :asyncClose="true" :showCancelButton="isShowCancelButton" @cancel="onCancel"
        width="300"
      >
      </u-modal>
      <uniPop ref="rzModal" />
    </view>
</template>

<script>
    import util from '../../js/utils'
    import {
    getOwnerBuildingListComm,
    judgeAuthOwner,
    getOwnerKeyList,
    saveKey,
    getCompanyConfig
  } from '../../service/community'
    export default {
      name: 'keyCollection',
      data () {
        return {
          isShow: false,
          isFlag: false,
          isShowCancelButton: true,
          memberId: '',
          companyId: '',
          formData: {
             popuse: ['家人使用'],
             popuse: '',
             useType: 0,
             borrower: '',    //借用人
             phoneNum: '',   //手机号
             IDCardNum: '',   //身份证
             remark: '',    //备注
          },
          popuseList: [['家人使用', '装修', '清洁', '维修', '家政', '家教', '其他']],
          records: [],
          pageSize: 10,   //每页数量
          page: 1,  // 页码
          totalCount: 0,    // 消息总数
          isAuthOwnerInfo:false,
          relateAddress: {},//关联的地址

          /** 是否还有更多数据 */
          noMoreData: false,
          keyStatus: 0,
          isAuthOwnerInfo:false,
          focusInputIndex: -1,
          isShowFWQY: 0
        }
      },

      onLoad() {
        const { MEMBER_ID, COMPLANY_ID } = this.$constant
        this.memberId = util.storageAction({ key: MEMBER_ID, action: 'get' })
        this.companyId = util.storageAction({ key: COMPLANY_ID, action: 'get' })
      },
      created () {
        this.judgeIsAuth()
      },
     async onShow() {
        const { PROGRAM_TYPE } = this.$appConfig
        const { O_USER_INFO} = this.$constant
           //  分享后，打开授权，memberId
			  const { phoneNumber } = util.storageAction({ key: O_USER_INFO, action: 'get' });
			  if(!phoneNumber){
          if (['wechat', 'appH5'].includes(PROGRAM_TYPE)) {
             uni.navigateTo({ url: '/pages-a/authorization/bindingMobile' })
				     return
          } else {
             uni.navigateTo({ url: '/pages-a/authorization/bindingMobile' })
					   return
          }
			  }
        const hasAuth = await this.setAuthType()
        if (!hasAuth) return
     },
      methods : {
        checkTel (input) {
          if(/^((0\d{2,3}-?\d{7,8})|(1\d{10}))$/.test(input)){
            return true;
          }
          else {
            return false;
          }
        },
        checkIDNumber (input) {
          if(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(input)){
            return true;
          }
          else {
            return false;
          }
        },
        showLoading(){
           this.loading = true;
        },
         hideLoading(){
           this.loading = false;
        },
        close() {
          this.$router.go(-1);
        },
        judgeIsAuth(){
          //判断是否业主认证
          let params = {
            data: {
              memberId:this.memberId
            }
          }
          judgeAuthOwner(params).then(res=>{
            if(res.status == 200 && res.data && res.data.isAuthUser == 1) {
              this.isAuthOwnerInfo = true
              this.toGetAllApprovalList()
            }else if(res.status == 200 && res.data && res.data.isAuthUser == 0){
              const hasAuth =  this.setAuthType()
              if (!hasAuth) return 
              // this.$refs.uNotify.error('网络错误')
            }
          })
        },
        toGetAllApprovalList() {
          let params = {
            data: {
              companyId: this.companyId,
              memberId: this.memberId
            },
            "hideLoading": true
          }
          getOwnerBuildingListComm(params).then(response => {
            if (response.status == '200') {
              var houseList = response.data ? response.data : [];
              let tempReleaseList1 = [];
              if (houseList.length > 0) {
                for (let index = 0; index < houseList.length; index++) {
                  const item = houseList[index];
                  if (item.authType === 1) {
                    if (item.isDefault === 1) {
                      tempReleaseList1 = item;
                      break;
                    } else {
                      tempReleaseList1 = item;
                      break;
                    }
                  } else {
                    tempReleaseList1 = item;
                    break;
                  }
                }
              }
              console.log(tempReleaseList1, '2')
              this.relateAddress = tempReleaseList1;

              console.log(self.relateAddress)
              this.initData();

            } else {
              this.$refs.uNotify.error('无法获取到房产信息')
            }
          })
        },
        initData(){
          let params = {
            data: {
              trusteeId: this.relateAddress.ownerId,
              pageSize :this.pageSize,
              pageNum: this.page,
              companyId: this.companyId,
            },
            "hideLoading": true
           }
           getOwnerKeyList(params).then(res => {
             if (res.status === '200') {
              let array = res.data.records
              let recordsOriginal = array[0].keyRecords
              var compare = function (obj1, obj2) {
               var val1 = obj1.operateDate;
               var val2 = obj2.operateDate;
               if (val1 < val2) {
                   return -1;
                } else if (val1 > val2) {
                   return 1;
                } else {
                   return 0;
                 }
               }
               this.records = recordsOriginal.sort(compare)
             }
          }).catch(error => {

          })
        },
        submitKeyCollection () {
          if (this.formData.popuse[0] === '') {
            this.$refs.uNotify.error('请填写用途')
            return
          }
          if(this.formData.borrower === ''){
            this.$refs.uNotify.error('请填写借用人')
            return
          }
          if (this.formData.phoneNum.length !== 0 && !this.checkTel(this.formData.phoneNum)) {
            this.$refs.uNotify.error('电话号码格式不正确')
            return
          }
          if (this.formData.IDCardNum.length !== 0 && !this.checkIDNumber(this.formData.IDCardNum)) {
            this.$refs.uNotify.error('身份证号码格式不正确')
            return
          }
          /***
           * {
              "areaId": 0,
              "areaName": "string",              区域名称
              "borrowerIdCard": "string",        借用人身份证
              "borrowerName": "string",     *    借用人名称
              "borrowerPhone": "string",         借用人电话
              "buildingId": "string",       *    楼栋id
              "buildingName": "string",     *    楼栋名称
              "creator": "string",               创建人
              "id": "string",
              "operator": "string",         *    操作人
              "projectId": "string",        *    项目id
              "projectName": "string",      *    项目名称
              "remark": "string",                备注
              "roomId": "string",           *    房间id
              "roomName": "string",         *    房间名称
              "trusteeId": "string",        *    托管人id
              "trusteeName": "string",      *    托管人名称
              "trusteePhone": "string",     *    托管人联系方式
              "useType": 0                       钥匙用途
              }
           */
          let params = {
            data: {
              areaId: this.relateAddress.areaId,     //*    区域id
              areaName: '',
              borrowerIdCard: this.formData.IDCardNum,
              borrowerName: this.formData.borrower,
              borrowerPhone: this.formData.phoneNum,
              buildingId: this.relateAddress.buildingId,
              buildingName: this.relateAddress.houseBuiding,
              creator: this.relateAddress.regName,
              id: '',
              operator: this.relateAddress.regName,
              projectId: this.relateAddress.projectId,
              projectName: this.relateAddress.projectName,
              remark: this.formData.remark,
              roomId: this.relateAddress.addrId,
              roomName: this.relateAddress.houseRoom,
              trusteeId: this.relateAddress.ownerId,
              trusteeName: this.relateAddress.regName,
              trusteePhone: this.relateAddress.regNumber,
              useType: this.formData.useType,
              flag: 1,
            }
          }
          saveKey(params).then(response => {
            if (response && response.status == '200') {
              this.isFlag = true
            }else if(response && response.status == '400'){
              this.$refs.uNotify.error(response.message)
            }else {
              this.$refs.uNotify.error('提交失败')
            }
            }).catch(error => {
              this.$refs.uNotify.error('提交失败')
            })
        },
        judgeStatus(value){
          switch (value.status) {
            case 0:
              return '已通知'
              break;
            case 1:
              return '已托管'
              break;
            case 2:
              return '已借用'
              break;
            case 3:
              return '已送还'
              break;
            case 4:
              return '已收回'
              break;
            default:
              break;
          }

        },
        judgeTime(value){
           let date1 = value.operateDate
           let s1 = new Date(date1.replace(/-/g, "/"))
           let s2 = new Date()
           let days = s2.getTime() - s1.getTime()
           var time = parseInt(days / (1000 * 60 * 60 * 24));
           if (time > 2) {
              return '已归还超'+time+'天'
           }else{
             return ''
           }
        },
        // 点击快递公司确定
        complayConfirm(columnIndex) {
          this.formData.useType = columnIndex.indexs[0]
          this.formData.popuse = columnIndex.value[0]
          this.isShow = false
        },
        onConfirm() {
          history.back(-1)
        },
        onCancel() {
          this.isFlag = false
          this.toGetAllApprovalList()
        },
        // 如果未认证，则设置认证类型
        async setAuthType() {
          if (this.hasAuth()) return Promise.resolve(true)

          const { COMPLANY_ID } = this.$constant
          const companyId = util.storageAction({ key: COMPLANY_ID, action: 'get' })
          const params = {
            data: {
              companyId
            }
          }
          const res = await getCompanyConfig(params)
          const authTypes = this.parseStr2JSON(res.data?.authType).filter(Boolean)

      // 设置认证类型
          let temp = 0
          if (authTypes.length == 1) {
            const num = parseInt(authTypes[0])
            temp =  isNaN(num) ? 0 : num
          } else if (authTypes.length == 2) {
            temp = 0
          }
          this.showFWQY = temp

          this.showAuthModal()

          return Promise.resolve(false)
        },
        // 将字符串转换为数组，例如 "["2", "1"]" => ["2", "1"]
        parseStr2JSON(val) {
          try {
            return JSON.parse(val)
          } catch (error) {
           return []
          }
        },
       // 弹出认证窗口
       showAuthModal() {
           this.$refs.rzModal.showModal({ modalType: 'rz' })
           this.$refs.rzModal.showCompanyConfig()
       },
       // 判断业主是否认证
       hasAuth() {
         const { IS_ASSOCIATION } = this.$constant
         const isAssociation = util.storageAction({ key: IS_ASSOCIATION, action: 'get' })
         return (isAssociation != void 0 && isAssociation != '0' && isAssociation != '-1')
       }

      },
    }
</script>

<style lang="scss" scoped>
  .keyPage{
    width: 100%;
    height: 100%;
    background-color: #f5f5f5;
    overflow-y: scroll;
  }

  .title-container {
    padding: 30rpx;
    font-size: 28rpx;
  }

  .tip-container {
    padding: 20rpx 30rpx;
    font-size: 24px;
    display: flex;
    flex-direction: column;
  }

  .tip-container text {
    color: #666666;
    font-size: 28rpx;
    margin: 10rpx 0rpx;
    width: 100%;
  }
  .record-content {
    margin: 20rpx;
    color: black;
    background: white;
    border-radius: 6rpx;
  }

  .cell-icon {
    padding: 0px 30rpx;
    .image {
      width: 80rpx;
      height: 80rpx;
    }
  }

  .cell-title {
    margin: 0px 30rpx;
    padding: 30rpx 0rpx;
  }

  .cell {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 0px 30rpx;
    padding: 16rpx 0px;
  }

  .cell-content {
    flex: 1;
    padding: 16rpx;
  }

  .status-time {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex: 1;
    padding: 8rpx 0rpx;
    color: gray;
    font-size: 28rpx;
  }
  .status{
    /* color: var(--app-primary-color); */
  }
  .remark {
    padding: 8rpx 0rpx;
    color: gray
  }
  .remind {
    padding: 8rpx 0rpx;
    color: red
  }

  .notice-btn {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 320rpx;
    height: 68rpx;
    /* background-color: #C8924B !important; */
    background-color: var(--app-primary-color);
    /* border-color: #C8924B; */
    border-color: var(--app-primary-color);
  }
  .form-cont {
    padding: 0 30rpx;
  }

</style>
