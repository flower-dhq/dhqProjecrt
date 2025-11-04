<!--  -->
<template>
    <view class='pageIndex'>
        <view class="box">
            <view class="t-title">二维码开门</view>
            <view class="line"></view>
            <view class="code">
                <canvas id="qrcode" canvas-id="qrcode" style="width: 200px;height: 200px;"></canvas>
            </view>
            <u-divider :dashed="true" lineColor="#000000"></u-divider>
            <view class="t-tips">出示开门二维码，扫码开门</view>
        </view>
    </view>
</template>

<script>
import UQRCode from 'uqrcodejs'
import { huaYeGetDoorQrCode } from '@/service/doorService';
import { getOwnerBuildingListComm } from '@/service/community';
import util from '../../js/utils';

export default {
    components: {},
    data() {
        return {
            QrCodeUrl: '',
            ownerId: '',
            addrId: ''
        };
    },
    computed: {},
    watch: {},
    onLoad(query) { 
         
        if (query.scene) {
              // 从访客邀请过来的二维码开门 
            const scene = decodeURIComponent(decodeURIComponent(query.scene || ''))
             const [ownerId = '', addrId = ''] = scene.split('&')
            this.ownerId = ownerId
            this.addrId = addrId
            // 表示从二维码开门的进来。访客邀请 -> 一键开门 -> 二维码开门           
            this.getCode()
        } else {
            this.getOwner()
        }
    },
    methods: {
        getOwner() {
            const { COMPLANY_ID, MEMBER_ID } = this.$constant
            let companyId = util.storageAction({ key: COMPLANY_ID, action: 'get' })
            let memberId = util.storageAction({ key: MEMBER_ID, action: 'get' });
            var params = {
                data: {
                    companyId: companyId,
                    memberId: memberId,
                    authState: 1
                },
                hideLoading: true,
                responseToast: false
            }
            getOwnerBuildingListComm(params).then(res => {
                if (res.status == 200) {
                    let list = res.data;
                    if (list && list.length > 0) {
                        let itemList = list.filter(f => { f.isDefault == 1 });
                        let owner = itemList.length > 0 ? itemList[0] : list[0];
                        this.ownerId = owner.ownerId;
                        this.addrId = owner.addrId;
                        this.getCode();
                    }


                }
            })
        },
        getCode() { 
            var params = {
                data: {
                    newOwnerInfoId: this.ownerId,
                    addrId: this.addrId
                },
                hideLoading: true,
                responseToast: false
            }
 
            uni.showLoading({ title: '加载中' });
            huaYeGetDoorQrCode(params).then(res => {
                uni.hideLoading(); 
                if (res.status == 200) {
                    let data = res.data;
                    // 获取uQRCode实例
                    var qr = new UQRCode();
                    // 设置二维码内容
                    qr.data = data;
                    // 设置二维码大小，必须与canvas设置的宽高一致
                    qr.size = 200;
                    // 调用制作二维码方法
                    qr.make();
                    // 获取canvas上下文
                    var canvasContext = uni.createCanvasContext('qrcode', this); // 如果是组件，this必须传入
                    // 设置uQRCode实例的canvas上下文
                    qr.canvasContext = canvasContext;
                    // 调用绘制方法将二维码图案绘制到canvas上
                    qr.drawCanvas();

                }


            })
        }
    },
}
</script>
<style scoped lang="scss">
.pageIndex {
    background: #F5F5F5;
    padding: 82rpx 50rpx 0;
    height: 100vh;
    box-sizing: border-box;
}

.box {
    background: #FFFFFF;
    text-align: center;
    border-radius: 20rpx;
    padding: 40rpx 30rpx;
}

.t-title {
    font-size: 48rpx;
    font-weight: bold;
    color: #000000;
}

.t-tips {
    font-size: 28rpx;
    font-weight: bold;
    color: #333333;
}

.line {
    width: 80rpx;
    height: 6rpx;
    background: #EEEEEE;
    opacity: 1;
    border-radius: 0rpx;
    margin: 20rpx auto 0;

}

.code {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 40rpx;
}
</style>