<style lang="scss" scoped>
.vehicle-container{
  width: 100vw;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
	background-color: #f5f5f5;
  .healthy-list-box{
    padding: 20rpx 20rpx 0 20rpx;
    overflow: auto;
    .healthy-title{
      padding: 20rpx;
      color: #666666;
      font-size: 28rpx;
    }
    .healthy-card{
      padding: 30rpx;
      margin-bottom: 20rpx;
      background: #FFFFFF;
      border-radius: 10rpx;
      display: flex;
      align-items: center;
      .healthy-portrait{
        width: 130rpx;
        height: 130rpx;
        margin-right: 24rpx;
        border-radius: 50%;
        overflow: hidden;
        flex: none;
      }
      .healthy-info{
        flex: 1;
        .healthy-name{
          margin-bottom: 12rpx;
          // font-size: 30rpx;
          // font-weight: bold;
          // line-height: 44rpx;
          // color: #333333;
          display: flex;
          align-items: center;
          view{
            font-size: 30rpx;
            font-weight: bold;
            line-height: 44rpx;
            color: #333333;
          }
          span{
            height: 36rpx;
            padding: 0px 10rpx;
            margin-left: 20rpx;
            background: #ffeee7;
            border-radius: 2px;
            font-size: 24rpx;
            color: #FE5D1D;
            display: flex;
            align-items: center;
            flex:none;
          }
        }
        .healthy-phone{
          font-size: 24rpx;
          font-family: PingFang SC;
          font-weight: 400;
          line-height: 32rpx;
          color: #666666;
        }
      }
      .healthy-arrow{
        font-size: 24rpx;
        color: #333333;
        display: flex;
        align-items: center;
        ::v-deep .van-button{
          margin-left: 20rpx;
          padding: 0 30rpx;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: center;
          .van-button__content{
            display: flex;
            align-items: center;
            justify-content: center;
            line-height: normal !important;
          }
        }
      }
    }
  }
  .no-data{
    margin-top: 180rpx;
    text-align: center;
    .no-data-label{
      font-size: 28rpx;
      font-family: PingFang SC;
      font-weight: 400;
      line-height: 40rpx;
      color: #666666;
    }
    .no-data-tip{
      margin-top: 2px;
      font-size: 24rpx;
      font-family: PingFang SC;
      font-weight: 400;
      line-height: 36rpx;
      color: #999999;
    }
  }
  .handle-box{
    width: 100%;
    padding: 40rpx;
    background: #ffffff;
    position: fixed;
    bottom: 0;
  }
  .agreen-title {
    font-weight: bold;
    font-size: 32rpx;
    margin-bottom: 20rpx;
  }
  .agreen-main {
    padding: 40rpx 40rpx 0 40rpx;
  }
  .agreen-content {
    max-height: 450px;
    overflow-y: auto;
  }
  ::v-deep .van-popup{
    // width: 6rem;
    // border-radius: 32rpx;
    .van-field__label{
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }
    .van-cell__title{
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }
    .van-cell::after {
        position: absolute;
        box-sizing: border-box;
        content: ' ';
        pointer-events: none;
        right: 0px;
        bottom: 0;
        left: 0px;
        border-bottom: 1px solid #ebedf0;
        -webkit-transform: scaleY(.5);
        transform: scaleY(.5);
    }
    .van-field--disabled .van-field__label{
      color: #646566;
    }
    .van-field__control:disabled{
        color: #323233;
        cursor: not-allowed;
        opacity: 1;
        -webkit-text-fill-color: #323233;
    }
    .van-cell::after {
      display: none;
    }
    .van-loading{
      color: var(--maincolor);
    }
  }
  .id-confirm{
    position: relative;
    background-color: #fff;
    $bdc: #ebedf0;
    border-radius: 32rpx;
    &__loading{
      position: absolute;
      top: 0;
      left: 0;
      z-index: 9;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
    }
    &__title{
      position: relative;
      text-align: center;
      line-height: 88rpx;
      font-size: 30rpx;
      &::before{
        position: absolute;
        box-sizing: border-box;
        content: ' ';
        pointer-events: none;
        bottom: 0;
        left: 0;
        width: 100%;
        border-bottom: 1px solid #ebedf0;
        -webkit-transform: scaleY(.5);
        transform: scaleY(.5);
      }
    }
    &__body{
      position: relative;
      &::after {
        position: absolute;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        content: ' ';
        pointer-events: none;
        right: 0px;
        bottom: 0;
        left: 0px;
        border-bottom: 1px solid #ebedf0;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
      }
    }
    &__footer{
      display: flex;
      button{
          flex: 1;
          height: 88rpx;
          background-color: transparent;
      }
      button:first-child{
        position: relative;
        &::before{
          position: absolute;
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          content: ' ';
          pointer-events: none;
          top: 0;
          right: 0;
          width: 1px;
          height: 100%;
          border-right: 1px solid #ebedf0;
          -webkit-transform: scaleX(0.5);
          transform: scaleX(0.5);
        }
      }
      
      & > view{
        width: 100%;
        display: flex;
      }
    }
    &__button{
        
        &-cf{
          
        }
        &-auth{
          button:nth-child(1) {

          }
          button:nth-child(2) {
            color: var(--maincolor);
          }
        }
    }
  }
}

.agreen-all{
  width: 100%;
  box-sizing: border-box;
  padding: 0 44rpx;
  .agreen-top{
    font-size: 30rpx;
    font-weight: bold;
    text-align: center;
    padding: 32rpx 0 24rpx;
  }
  .agreen-txt{
    font-size: 26rpx;
    font-weight: bold;
    text-align: center;
  }
  .agreen-subtitle{
    padding: 40rpx 0 16rpx;
    font-size: 24rpx;
    font-weight: bold;
  }
  view{
    font-size: 24rpx;
    color: #333;
    line-height: 36rpx;
    padding-bottom: 16rpx;
  }
}
.Btn-box{
  width: 100%;
  height: 146rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 76rpx;
  box-sizing: border-box;
  .btn{
    width: 270rpx;
    height: 68rpx;
    border-radius: 34rpx;
    font-size: 28rpx;
		text-align: center;
		line-height: 68rpx;
  }
  .btn-cancel{
    border:1px solid #00C6D2;
    color: #00C6D2;
  }
  .btn-submit{
    background: #00C6D2;
    color: #fff;
  }
}
.faceImg{
	width: 130rpx;
	height:130rpx;
}
.custom-style{
	padding: 0 30rpx;
	height: 64rpx;
	color:var(--app-primary-color);
	border: 1px solid var(--app-primary-color);
	border-radius: 30rpx;
	font-size: 28rpx;
	line-height: 64rpx;
}
</style>

<template>
  <view class="vehicle-container" :style="[THEME_CSS_VAR]" :class="[THEME_NAME]">
    <!-- <van-nav-bar title="我的人脸" left-arrow @click-left="goBack"/> -->
    <view class="healthy-list-box" style="height: 100%" v-if="showFaceTip == 1">
      <view class="healthy-title">我的人脸</view>
      <view class="healthy-card" v-for="(item, index) in myList" :key="item.ownerinfoId">
        <view class="healthy-portrait">
          <image v-if="item.empFace" :src="item.empFace" class="faceImg" mode="aspectFill"></image>
          <image v-else :src="faceDefaultHead" class="faceImg" mode="aspectFill"></image>
        </view>
        <view class="healthy-info">
          <view class="healthy-name">
            <view>{{item.userName}}</view>
          </view>
         <view class="healthy-phone">{{item.userPhone}}</view>
        </view>
        <view class="healthy-arrow">
          <view class="custom-style" @click="openAgreen({item}, {index, mineFace: 1})">{{item.empFace ? '重新录入' : '录入人脸'}}</view>
        </view>
      </view>
      <view class="no-data" v-if="showFaceTip == 2">
        <u-image :src="noVehicleXyd" height="150" fit="contain"/>
        <view class="no-data-label">您还没有录入人脸信息</view>
        <view class="no-data-tip">快去录入吧~</view>
      </view>
    </view>
    <u-popup :show="showAgreement" mode="bottom">
      <view class="agreen-all">
        <view class="agreen-top">免责声明</view>
        <view class="agreen-txt">《新一代产业园智慧园区人脸识别功能服务协议》</view>
        <view class="agreen-subtitle">在使用人脸录入功能之前，请您牢记一下注意事项:</view>
        <view>1、门禁可能会被容貌、外形与您相近的人或物品解锁；</view>
        <view>2、在暗光、强光、逆光或角度过于大的情况下，人脸识别功能概率会有所降低；</view>
        <view>3、您录入人脸必须是您本人，为保证社区安全以及您的隐私安全；</view>
        <view>4、切勿将人脸录入随意给他人使用，避免人脸识别功能被恶意利用；</view>
        <view>5、除以上场景外，现实中还可能会存在其他影响人脸识别功能正常使用的情况，需要对此予以注意。</view>
      </view>
      <view class="Btn-box">
        <view class="btn btn-cancel" @click="agreenCancel">取消</view>
        <view class="btn btn-submit" @click="agreenSubmit(faceData)">确定</view>
      </view>
    </u-popup>
  </view>
</template>

<script>
		import { getFaceListById } from '@/service/doorService.js'
		import Utils from '@/js/utils'
    export default {
      name: 'faceList',
      data() {
        return {
          showAgreement: false,
          agreenChecked:false,
          faceList: [],
          myList: [], // 我的人脸
          familyList: [], // 我的家人
          ownerId: '',
          relateId: '',
          faceItem: {},
          idConfirm: {
            show: false,
            type: 1, // 1 确认 2 修改
            idV: '', // 显示id
            idE: '', // 修改id
            nameV: '', // 显示姓名
            nameE: '', // 修改姓名
            ownerId: '',
            loading: false,
            tkLoading: false,
            data: null,
          },
          faceData:'',//人脸信息
					phoneNumber:'',
					showFaceTip:0,//1有列表2无列表
        }
      },
			computed:{
				noVehicleXyd(){
					return `${this.IMG_BASE_URL}/static/${this.THEME_NAME}/multiplexing/no_vehicle_xyd.png`
				},
				faceDefaultHead(){
					return `${this.IMG_BASE_URL}/static/${this.THEME_NAME}/multiplexing/face_default_head.png`
				},
			},
      onReady() {
				const { O_USER_INFO, USER_TYPE, USER_TYPE_NUM } = this.$constant
				let data = Utils.storageAction({ key: O_USER_INFO, action: 'get' })
				console.log('-------------->',data)
				this.phoneNumber = data.ownerPhone || data.phoneNumber || data.contactPhone || data.STRG_phone || '' 
        // this.relateId = 'bc61bb1d-505a-4e4c-9e91-52aba4a76d40'
        // this.getFamilyList()
        this.getNewFamilyList()
      },
			onShow(){
				if(this.phoneNumber){
					this.getNewFamilyList()
				}
			},
      onLoad(){
        // 从详情页返回该页面的获取数据
            uni.$on('refreshData',() => {
              this.getNewFamilyList();
            })
      },
      methods: {
        // 获取人脸列表
        getNewFamilyList() {
					let params = {
						data:{
            type:'0',
            userPhone: this.phoneNumber,
          }
					}
          getFaceListById(params).then(res => {
            if (res.status == 200) {
              this.faceList = [res.data]
              this.myList = [res.data]
							this.showFaceTip = 1
            } else {
							this.showFaceTip = 2
							uni.showToast({title:res.message,duration:1000,icon: 'none',})
            }
          })
        },
        agreenCancel(){
          this.showAgreement = false
        },
        agreenSubmit(item){
					this.showAgreement = false
					uni.navigateTo({
						url:'/pages-b/xinyidaiFaceManage/faceIdentity?userName='+item.userName+'&userIdcard='+item.userIdcard+'&userPhone='+item.userPhone
					})
        },
        // 展示协议
        openAgreen(item, opt) {
					let data = item.item
          this.idConfirm.data = {...data, ...opt}
          this.faceData = data
          if (!data.empFace) {
            this.showAgreement = true
            return
          }else{
            this.agreenSubmit(this.faceData)
          }
        },
        //  跳转模块
        goToModule(item, idCfArgs) {
          this.showAgreement = false
          this.$router.push({
            path: '/faceForm',
            query: {
              ownerName: item.ownerName,
              ownerinfoId: item.ownerinfoId,
              relateId: item.relateId,
              idFace: encodeURIComponent(JSON.stringify(idCfArgs || {}))
            }
          });
        },
        // 获取人员列表
        getFamilyList() {
          getOwnerListByHouseId(
            {
              relateId: this.relateId,
            }
          ).then(res => {
            if (res.status == 200) {
              if (res.data.length) {
                this.faceList = res.data
                this.myList = this.faceList.filter(v=>v.ownerinfoId == this.ownerId)
                this.familyList = this.faceList.filter(v=>v.ownerinfoId != this.ownerId)
              } else {
                Toast.fail('暂无人员信息')
              }
            } else {
              Toast.fail('获取人员列表失败')
            }
          })
        },
        // 确认身份信息
        showConfirmIdInfo() {
          const params = this.idConfirm.data;
          const {idConfirm} = params || {};
          if (idConfirm) {
            const {ownerId, ownerIDCard, nameSb, idSb} = idConfirm;
            const idString = idSb || '';
            const idV = idString.replace(/^(.{6})(?:\d+)(.{4})$/,"$1******$2");
            const usIf = {
              show: true,
              idV, // 显示id
              idE: idString, // 修改id
              idSb, 
              nameE: nameSb, // 显示姓名
              nameV: nameSb,
              nameSb,
              ownerId              
            }
            Object.assign(this.idConfirm, usIf);
          } else {
            this.getUserIdInfo(params);
          }
        },
        // 获取用户信息
        getUserIdInfo(params) {
          const {ownerPhone, index, mineFace, ownerinfoId} = params || {};
          this.idConfirm.loading = true;
          this.idConfirm.show = true;
          getIdInfoByPhone({ownerPhone, ownerId: ownerinfoId}).then(async res => {
            this.idConfirm.loading = false;
            if (res.status == '200') {
              const resp = res.data || {};
              const {ownerName, ownerIDCard, ownerId} = resp;
              const item = this[mineFace ? 'myList': 'familyList'][index];
              const idV = ownerIDCard && ownerIDCard.replace(/^(.{6})(?:\d+)(.{4})$/,"$1******$2") || '';
              const usIf = {
                idV, // 显示id
                idE: ownerIDCard, // 修改id
                idSb: ownerIDCard,
                nameE: ownerName, // 显示姓名
                nameV: ownerName,
                nameSb: ownerName,
                ownerId,
              }
              item.idConfirm = {...resp, ...usIf};
              Object.assign(this.idConfirm, usIf, {show: true})
            } else {
              Toast.fail(res.message || '获取身份信息失败');
            }
          }).catch(_ => {
            this.idConfirm.loading = false;
          })
        },
        // 协议确认
        protocolCf() {
          this.idConfirm.show = true;
          this.showConfirmIdInfo(this.idConfirm.data || {})
        },
        // 确认身份事件
        confirmIdEvt(params) {
          const {action} = params || {};
          if (action === 'inputFace' || action === 'confirmModify') {
            const type = action === 'inputFace' ? 1 : 2; 
            this.modifyConfirmIdInfo({type}); 
          } else if (action === 'openModify' || action === 'cancelModify') {
            this.idConfirm.type = action === 'cancelModify' ? 1 : 2;
            if (action === 'cancelModify') {
              this.idConfirm.idE = this.idConfirm.idSb;
              this.idConfirm.nameE = this.idConfirm.nameSb;
            }
          }
        },
        getFaceToken() {
          this.idConfirm.tkLoading = true;
          return new Promise(resolve => {
            getFaceVerificationToken().then(res => {
              const {status, data} = res
              this.idConfirm.tkLoading = false;
              if (status != 200) Toast.fail(res.message || '获取token失败');
              resolve(data ? data : null)
            }).catch(_ => {
              this.idConfirm.tkLoading = false;
              resolve(null)
            })
          })
        },
        // 校验身份认证表单
        idFormVerify(type) {
          const {idE, nameE, idSb, nameSb} = this.idConfirm;
          let isReturn = false, nEp = false, idEp = false, nameString, idString;
          if (type === 1) { // 确认提交身份信息
            nEp = typeof nameSb === 'string' && nameSb.trim() === '';
            idEp = typeof idSb === 'string' && idSb.trim() === '';
            nameString = nameSb;
            idString = idSb;
          } else { // 2 修改
            nEp = typeof nameE === 'string' && nameE.trim() === '';
            idEp = typeof idE === 'string' && idE.trim() === '';
            nameString = nameE;
            idString = idE;
          }
          if (nEp || !nameString)  {
            Toast.fail('身份证姓名不能为空');
            isReturn = true
          } else if (idEp || !idString) {
            Toast.fail('身份证号码不能为空');
            isReturn = true
          }
          return isReturn;
        },
        // 修改身份信息
        async modifyConfirmIdInfo(params) {
          const {type} = params || {};
          const {ownerId, data, idE, nameE, idSb, nameSb} = this.idConfirm;
          const isInvalid = this.idFormVerify(type);
          if (isInvalid) return;
          const token = await this.getFaceToken();
          const args = {
            ownerId,
            ownerIDCard: type === 1 ? idSb : idE,
            type,
            ownerName: type === 1 ? nameSb: nameE,
            verifyToken: token
          }
          if (type === 1) {
             this.goToModule(data, args);
             this.resetIdConfirmModel();
             return;
          } else {
            this.idConfirm.loading = true;
          }
          updateIdInfoByOwnerId(args).then(res => {
            this.idConfirm.loading = false;
            if (res.status == 200) {
              if (type == 1) {
                // this.goToModule(data, args);
                // this.resetIdConfirmModel();
              } else {
                const {mineFace, index} = this.idConfirm.data;
                const item = this[mineFace ? 'myList': 'familyList'][index];
                item.idConfirm.idSb = idE;
                item.idConfirm.nameSb = nameE;
                this.idConfirm.type = 1;
                this.idConfirm.idV = idE.replace(/^(.{6})(?:\d+)(.{4})$/,"$1******$2");
                this.idConfirm.nameV = nameE;
                this.idConfirm.idSb = idE;
                this.idConfirm.nameSb = nameE;
              }
            } else {
              const tips = type == 1 ? '上传身份信息失败' : '保存身份信息失败';
              Toast.fail(res.message || tips);
            }
          }).catch(_ => {
            this.idConfirm.loading = false;
          })
        },
        // 重置IdConfirm
        resetIdConfirmModel() {
          this.idConfirm = {
            show: false,
            type: 1, // 1 确认 2 修改
            idV: '', // 显示id
            idE: '', // 修改id
            nameV: '', // 显示姓名
            nameE: '', // 修改姓名
            ownerId: '',
            loading: false,
            tkLoading: false,
            data: null
          }
        }
       
      }
    }
</script>

