<template>
    <view>
        <u-modal :show="show" :title="title" :cancelText="cancelText" :confirmText="confirmText" :showConfirmButton="showConfirmButton" :showCancelButton="showCancelButton" @confirm="submit" @cancel="cancelBtn">
            <view class="slot-content">
                {{content}}
            </view>
        </u-modal>
        <u-modal :show="rzModal" title="请认证" width="252" :showConfirmButton="false">
            <view class="slot-content">
                <text class="rz-title">认证用户专享功能，请移步认证</text>
                <view class="rz-text rz-fwbox" @click="menuJump(1)"  v-if="showFW">
                    <image src="@/static/components/fwAuth.png"></image>点击房屋认证
                </view>
                <view class="rz-text rz-qybox" @click="menuJump(2)" v-if="showQy">
                    <image src="@/static/components/qyAuth.png"></image>点击企业认证
                </view>
                <view class="rz-no" @click="menuJump()">
                    暂不认证
                </view>
            </view>

        </u-modal>
    </view>
</template>

<script>
  import utils from '@/js/utils'
  import {getCompanyConfig} from '@/service/community';
export default {
    data() {
        return {
            show: false,
            title: '提示',
            content: '',
            cancelText: '取消',
            confirmText: '确认',
            showConfirmButton: true,
            showCancelButton: true,
            path: '',
            type: '',
            rzModal: false,
            showFW:true,
            showQy:true,
            companyId:'',
            authType:[]
        };
    },
    methods: {
        showModal(e) {
            //  document.body.style.overflow = "hidden";
            if (e.modalType == 'rz') {
                  this.rzModal = true;
            } else {
                this.content = e.content;
                this.path = e.path;
                this.show = true;
            }

        },
        submit() {
            // document.body.style.overflow = "auto";

            this.show = false;
            if (this.path) {
                uni.navigateTo({ url: this.path });
            }
        },
        cancelBtn() {
            this.show = false;
            // document.body.style.overflow = "auto";

        },
        menuJump(type) {
            // document.body.style.overflow = "auto";
            this.rzModal = false;
            if (type == 1) {
                uni.navigateTo({ url: '/pages-b/house-info/add-house-address' });
            } else if (type == 2) {
                uni.navigateTo({ url: '/pages-d/enterprise-info/join-company' });
            }
        },
        companyConfig() { 
            const {COMPLANY_ID , O_USER_INFO} = this.$constant
            this.companyId = utils.storageAction({ key: COMPLANY_ID, action: 'get' })
            const { companyId} = utils.storageAction({ key: O_USER_INFO, action: 'get' });
             var params = {
                data:{
                    companyId: this.companyId || companyId,
                }
             };
             try {  
                this.showFW = true;
                this.showQy = true;
            return  getCompanyConfig(params);
              } catch (error) {
                this.showFW = false; 
                this.showQy = false;
             }
         },
  async  showCompanyConfig(obj) { 
     await this.companyConfig().then(result=>{ 
           if (result.status == 200) {
            this.authType= result.data.authType ? JSON.parse(result.data.authType).filter(f => { return f != '' }) : [];
            this.authType.forEach(item=>{ 
              let val = item ? parseInt(item) : 0
              if(this.authType.length==1){
                switch(val){
                 case 1:
                    this.showFW = true;
                    this.showQy = false;
                   break
                  case 2:
                     this.showQy = true;
                     this.showFW = false;
                    break;
                  default :
                  break;
               }
              }
               if(this.authType.length==2){
                    this.showFW = true;
                    this.showQy = true;
               }
            })
        }else{
          this.showFW = true; 
          this.showQy = true;
        }
     });
    },
    }
};
</script>
<style scoped lang="scss">
::v-deep .u-modal .u-modal__title {
    font-size: 15px !important;
    padding-top: 40rpx !important;
}
.slot-content {
    width: 100%;
    min-height: 80rpx;
    font-size: 30rpx;
    line-height: 1.3;
    word-wrap: break-word;
    word-break: break-all;
    color: #999;
    text-align: center;
}

.rz-title {
    font-size: 12px;
    font-family: PingFang SC;
    font-weight: 400;
    line-height: 17px;
    color: #999999;
}
.rz-text {
    font-size: 24rpx;
    font-family: PingFang SC;
    font-weight: 400;
    line-height: 17px;
    display: flex;
    align-items: center;
    height: 94rpx;
    border-radius: 10rpx;
    margin: 24rpx 0;
    box-sizing: border-box;
    image {
        height: 64rpx;
        width: 64rpx;
        margin: 0 30rpx;
    }
}
.rz-fwbox {
    background: #fdf7f4;
    color: #fc510d;
}
.rz-qybox {
    background: #f5fbff;
    color: #1a9cf9;
}
.rz-no {
    height: 54rpx !important;
    line-height: 60rpx  !important;
    border: 2rpx solid #C8924B;
    border-radius: 26rpx  !important;
    font-size: 26rpx  !important;
    line-height: 52rpx  !important;
    color: #C8924B;
    box-sizing: border-box;
}
</style>