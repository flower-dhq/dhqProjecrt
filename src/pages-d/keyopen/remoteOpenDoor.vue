<!--  -->
<template>
     <view class='pageIndex'>
          <view class="tj-box" v-if="false">
               <view>
                    <view class="tj-title">推荐门禁</view>
                    <view class="tj-name">{{ RecommendedDevice.name }}</view>
               </view>
               <view class="radio">
                    <view style="text-align:center;">
                         <image :src="require(`@/static/aKeyOpenDoor/icon-door.png`)" style="width: 48rpx;height: 48rpx;">
                         </image>
                         <view class="radio-text">点击开门</view>
                    </view>

               </view>
          </view>
          <view class="box-name">门禁列表</view>
          <view class="list">

               <view class="list-item" v-for="(item, index) in deviceList" :key="index"
                    :class="{ 'bottom-line': index < deviceList.length - 1 }" @click="openDoor(item)">
                    <view class="item-name">{{ item.deviceName }}</view>
                    <view class="item-btn">点击开门</view>
               </view>
          </view>
          <u-modal width="470rpx" :show="show" title="确认打开" :showCancelButton="true" cancelColor="#999999"
               confirmColor="#333333" @confirm="submit" @cancel="show = false">
               <view class="slot-content">
                    <text class="modaltext">{{ openItem.deviceName }}门</text>
                    <text class="modaltext modaltext-color">吗？</text>
               </view>
          </u-modal>

     </view>
</template>

<script>
import { getAllDrivesByOwnerId, huaYeRemoteOpenDoor } from '@/service/doorService';
import { getOwnerBuildingListComm, insertAccessDeviceLog } from '@/service/community';
import Util from '@/js/utils';

export default {
     components: {},
     data() {
          return {
               show: false,
               openItem: {
                deviceId: '', // 设备id
                deviceName: '', // 设备名称
                devicePwd: '', // 设备密码
                deviceType: '', // 1: 蓝牙; 2: 网络; 3: 二维码
                deviceVendor: '',
                deviceMac: '', // 设备MAC
                type: '', // 1: 业主； 2: 访客
                ownerId: '',
                projectId: '',
                address: '', // 房产地址
                ownerName: '', // 姓名
                nickname: '', // 昵称
                ownerPhone: '',
                recordId: ''
               },
               ownerId: '',
               addrId: '',
               deviceList: [],
               RecommendedDevice: {
                    name: '中央庭院A1-2001'
               },
          };
     },
     onLoad(query) {
          if (query.isFromVisitor == '1') {
               // 表示从二维码开门的进来。访客邀请 -> 一键开门 -> 远程开门
               this.ownerId = query.ownerId || ''
               this.addrId = query.addrId || ''
               this.getList()
          } else {
               this.getOwner()
          }
     },
     methods: {
          openDoor(item) {
               this.openItem = item;
               this.show = true;
          },
          submit() {
            const openTime = uni.$u.timeFormat(new Date(), 'yyy-mm-dd hh:MM:ss')

               this.show = false;
               var params = {
                    data: {
                         newOwnerInfoId: this.ownerId,
                         deviceId: this.openItem.deviceCode
                    },
                    "hideLoading": true,
                    responseToast: false
               }
               huaYeRemoteOpenDoor(params).then(res => {
                    if (res.status == 200) {
                      this.saveDoorLog(true, openTime, '开门成功')
                         uni.showToast({
                              icon:'none',
                              title: res.message,
                              duration: 2000
                         });
                         // uni.showLoading({
                         //      title: res.message
                         // });
                         // setTimeout(() => {
                         //      uni.hideLoading();
                         // }, 2000);
                    } else {
                      this.saveDoorLog(false, openTime, '开门失败')
                    }

               }).catch(err => {
                this.saveDoorLog(false, openTime, '开门失败')
               })
          },
          getOwner() {
               const { COMPLANY_ID, MEMBER_ID } = this.$constant
               let companyId = Util.storageAction({ key: COMPLANY_ID, action: 'get' })
               let memberId = Util.storageAction({ key: MEMBER_ID, action: 'get' });

               var params = {
                    data: {
                         companyId: companyId,
                         memberId: memberId,
                         authState: 1
                    },
                    "hideLoading": true,
                    responseToast: false
               }
               getOwnerBuildingListComm(params).then(res => {
                    if (res.status == 200) {
                         let list = res.data;
                         let ownerIds = list.map(m => {
                              return m.ownerId
                         });
                         this.ownerId = Array.from(new Set(ownerIds)).join(","); // 利用Array.from将Set结构转换成数组
                         this.getList();

                    }
               })
          },
          getList() {
               var params = {
                    data: {
                         ownerId: this.ownerId
                    }
               }
               getAllDrivesByOwnerId(params).then(res => {
                    if (res.status == 200) {
                         this.deviceList = res.data;
                    }
               })
          },
        // 门禁记录
        saveDoorLog(isSuccess, openTime, logDesc) {
          const createDate = uni.$u.timeFormat(new Date(), 'yyy-mm-dd hh:MM:ss')
          const { O_USER_INFO } = this.$constant
          const userInfo = Util.storageAction({ key: O_USER_INFO, action: 'get' })
          const userName = this.openItem.ownerName || userInfo?.fullName || userInfo?.memberName || ''
          const nickName = userInfo?.nickname || userInfo?.wxUserName || ''
          const telephone = userInfo?.phoneNumber ?? ''

          const params = {
            data: {
              deviceId: this.openItem.deviceId,
              deviceType: 2, // 1: 蓝牙; 2: 网络; 3: 二维码
              createDate,
              openTime, // 开门时间
              whetherSuccess: isSuccess ? 1 : 0, // 是否开门成功
              type: 1, // 1: 业主； 2: 访客
              newOwnerInfoId: this.ownerId, // ownerId
              userName,
              nickName,
              telephone,
              address: this.openItem.address,
              projectId: this.openItem.projectId,
              projectName: this.openItem.projectName,
              logDesc
            }
          }
          insertAccessDeviceLog(Object.assign(params, this.openItem))
        }
     },
}
</script>
<style scoped lang="scss">
.pageIndex {
     background: #F5F5F5;
     height: 100vh;
     box-sizing: border-box;
     padding-top: 40rpx;
}

.tj-box {
     margin: 0 40rpx;
     background: #FFFFFF;
     display: flex;
     align-items: center;
     justify-content: space-between;
     padding: 40rpx 30rpx;
     box-shadow: 0rpx 10rpx 40rpx rgba(19, 53, 69, 0.04);
     border-radius: 8rpx;

     .tj-title {
          font-size: 30rpx;
          line-height: 28rpx;
          color: #666666;
     }

     .tj-name {
          font-size: 36rpx;
          font-weight: bold;
          color: #333333;
          margin: 12rpx 0 0;
     }

     .radio {
          width: 160rpx;
          height: 160rpx;
          background: #C8924B;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;

          .radio-text {
               font-size: 26rpx;
               color: #F4FEFF;
          }
     }
}

.box-name {
     font-size: 28rpx;
     color: #666666;
     margin: 30rpx 40rpx;

}

.list {
     background: #FFFFFF;
     // height: calc(100vh - 380rpx);
     height: calc(100vh - 140rpx);
     overflow: auto;
     padding: 0 46rpx;

     .list-item {
          display: flex;
          padding: 40rpx 0;
          align-items: center;
          justify-content: space-between;

          .item-name {
               font-size: 28rpx;
               font-weight: bold;
               color: #333333;
          }

          .item-btn {
               width: 160rpx;
               height: 64rpx;
               line-height: 63rpx;
               text-align: center;
               border: 1px solid #C8924B;
               border-radius: 34rpx;
               font-size: 28rpx;
               color: #C8924B;
          }

     }

     .bottom-line {
          border-bottom: 1px solid #E4E4E4;
     }
}

.modaltext {
     font-size: 30rpx;
     line-height: 48rpx;
     color: #C8924B;
}

.modaltext-color {

     color: #333333;
}
</style>