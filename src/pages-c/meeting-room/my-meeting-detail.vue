<template>
    <view class="page" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
        <view class="cell-box">
            <u-cell-group :border="false">
                <u-cell :title="roomInfo.meetingName" value="内容" :border="false">
                    <view slot="value" :class="[ getOrderState.color ]">{{ getOrderState.text }}</view>
                </u-cell>
            </u-cell-group>
            <view class="line"></view>
            <u-cell-group :border="false">
                <u-cell :border="false">
                    <view slot="title" class="u-slot-title">预约人</view>
                    <view slot="value" class="u-slot-title">{{ roomInfo.contactName }}</view>
                </u-cell>
                <u-cell :border="false">
                    <view slot="title" class="u-slot-title">会议议程</view>
                    <view slot="value" class="u-slot-title" v-html="roomInfo.agenda">
                    </view>
                </u-cell>
            </u-cell-group>
            <view class="line"></view>

            <u-cell-group :border="false">
                <u-cell title="参会人数" :border="false">
                    <view slot="value">{{ roomInfo.numberOfParticipants }}人</view>
                </u-cell>
                <u-cell title="预约时间" :border="false">
                    <view slot="value"> {{ getDateText }}</view>
                </u-cell>
                <!-- <u-cell title="是否需要物业协助" :border="false">
                    <view slot="value">{{ roomInfo.propertyAssistance ? '是' : '否' }}</view>
                </u-cell> -->

                <!-- S 德寰项目废除 布场时间，布场图（暂时保留该功能）。 -->
                <!-- <u-cell title="布场时间" :border="false">{{ roomInfo.propertyAssistance === 1 ? roomInfo.clothFieldTime : '' }}</u-cell> -->
                <!-- E -->

                <!-- <u-cell title="发票抬头" :border="false">
                    <view slot="value"> {{ invoiceInfo.invoiceLabel }}</view>
                </u-cell>
                <u-cell title="开票类型" :border="false">
                    <view slot="value">{{ invoiceInfo.invoiceType }}</view>
                </u-cell>
                <u-cell title="纳税人识别号" :border="false">
                    <view slot="value"> {{ invoiceInfo.taxpayerIdentNum }}</view>
                </u-cell>
                <u-cell title="注册地址" :border="false">
                    <view slot="value">{{ invoiceInfo.registeredAddress }}</view>
                </u-cell>
                <u-cell title="开户行名称" :border="false">
                    <view slot="value">{{ invoiceInfo.bankName }}</view>
                </u-cell>
                <u-cell title="开户行账号" :border="false">
                    <view slot="value"> {{ invoiceInfo.bankCode }}</view>
                </u-cell> -->
                <u-cell title="电话" :border="false">
                    <!-- <view slot="value">{{ invoiceInfo.telephone }}</view> -->
                    <view slot="value">{{ roomInfo.contactPhone }}</view>
                </u-cell>
                <u-cell title="电子邮箱" :border="false">
                    <view slot="value">{{ roomInfo.email || '' }}</view>
                </u-cell>
            </u-cell-group>
            <view class="line"></view>
            <!-- 会议费和定损费用 -->
            <u-cell-group style="margin-bottom: 10px; padding-bottom: 0px;">
                <u-cell title="会议费" :border="false">
                    <view slot="title"><span class="cell-title">费用明细</span><span class="cell-ftitle">增值服务费根据现场实际情况定价</span></view>
                </u-cell>
                <u-cell title="会议费" :border="false">
                    <view slot="value">{{ roomInfo.payPrice }}元</view>
                </u-cell>
                <!-- <cell-item title="物品损坏费" :border="false">
                <damage-item v-for="item in roomInfo.compensationList" :key="item.id" :label="item.itemName" :number="item.nums" :price="item.comPriceStr" :imgList="item.images"></damage-item>
            </cell-item> -->
            </u-cell-group>
            <view class="line"></view>

            <!-- 增值服务 -->
            <u-cell-group style="margin-bottom: 10px;" v-if="roomInfo.typeList && roomInfo.typeList.length">
                <u-cell class="loss-price-box" title="增值服务"></u-cell>
                <u-cell :title="item.dictName" v-for="(item, index) in roomInfo.typeList" :key="index" :border="false">
                    <view slot="value"> 
                        ￥{{ item.price }}
                        <text style="font-size: 22rpx;">
                            {{ item.unit }}
                        </text>
                    </view>
                </u-cell>
            </u-cell-group>
            <view class="line" v-if="roomInfo.typeList && roomInfo.typeList.length"></view>

            <!-- 审批拒绝原因，只有申请失败是否才显示 -->
            <view class="refuse-box" v-if="roomInfo.orderState == 2">
                <u-cell-group style="margin-bottom: 10px;">
                    <u-cell title="审批拒绝原因" :value="roomInfo.apvFlagText" titleStyle="width: 100px;"></u-cell>
                </u-cell-group>
            </view>
            <view class="line" v-if="roomInfo.orderState == 2"></view>

            <!-- 待确认状态的提示 -->
            <u-cell-group style="margin-bottom: 10px;" v-if="roomInfo.orderState == 6 && roomInfo.compensationState == 2">
                <u-cell value="三个工作日内不确认账单费用，系统自动确认"></u-cell>
            </u-cell-group>
            <view class="line" v-if="roomInfo.orderState == 6 && roomInfo.compensationState == 2"></view>
        </view>
        <!-- 底部按钮 -->
        <view class="footer" v-if="isShowFooter">
            <view style="padding-left: 20px">
                <p style="color: #C8924B; font-size: 16px;" v-if="isShowPriceText">
                    共：￥<span style="font-size: .35rem">{{ getTotalPrice.integer }}</span>.{{ getTotalPrice.decimal }}
                </p>
            </view>
            <view>
                <button class="van-button" type="primary" v-if="roomInfo.orderState == 1 || roomInfo.orderState == 4 || (roomInfo.orderState != 7 && roomInfo.orderState != 2 && roomInfo.openState == 0)" @click="handleCancel">取消</button>
                <button class="van-button" type="primary" v-if="roomInfo.orderState == 4" @click="handlePayment">去支付</button>
                <button class="van-button" type="primary" v-if="roomInfo.orderState == 6 && roomInfo.compensationState == 2" @click="isShowConfirm = true">确认费用</button>
            </view>
        </view>

        <!-- 弹窗，确认费用 -->
        <!-- <confirm-modal v-model="isShowConfirm" :orderId="roomInfo.orderId"></confirm-modal> -->
        <u-modal :show="showCancelRationale" title="请输入取消理由" width="300px" :showCancelButton="true" @confirm="submitLy" @cancel="cancelLy">
            <view class="slot-content">
                <u--input v-model="rationale" border="none" clearable></u--input>
            </view>
        </u-modal>

    </view>
</template>

<script>
import { queryMyMeetingDetail, cancelMyMeeting } from '@/service/meeting'
import { getInvoiceDetailById } from '../../service/neikong'
export default {
    data() {
        return {
            state: null,
            payState: null,
            roomInfo: {
                contactName: "",
                contactPhone: "",
                orderDate: "",
                detailState: "",
                meetingName: "",
                orderId: "",
                enterpriseName: "",
                orderstate: null,
                payState: null,
                orderRemark: "",
                payPrice: "",
                reserveDate: '',
                reserveDays: 0,
                typeList: [],
                compensationList: [],
                invoice: {}
            },
            isShowConfirm: false, // 弹窗，显示确认费用
            invoiceInfo: {}, // 发票详情 
            rationale: '',//取消理由
            showCancelRationale: false,
        }
    },
    onLoad(e) {
        this.orderId = e.orderId;
        this.getOrderDetail();
    },
    computed: {
        // 获取 预定价格(包含会议费和服务费) + 定损价格
        getTotalPrice() {
            const [integer, decimal] = (Number(this.roomInfo.payPrice || '') + Number(this.roomInfo.compensationPrice || '')).toFixed(2).split(".")

            return { integer, decimal }
        },
        // 获取日期，例如 '2021-12-16 周四 08:30~10:00'
        getDateText() {
            const weeks = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
            // 例如 '2000-12-16 08:00~15:00'
            const arrTmp = this.roomInfo.reserveDate.split(' ')
            const date = arrTmp[0]
            const time = arrTmp[1]
            const day = weeks[new Date(date.replace(/-/g, '/')).getDay()]

            // 例如 '2000-12-16 周四 08:00~15:00'
            return date + ' ' + day + ' ' + time
        },
        isShowFooter() {
            return this.roomInfo.orderState == 1 || this.roomInfo.orderState == 4 || (this.roomInfo.orderState != 7 && this.roomInfo.orderState != 2 && this.roomInfo.openState == 0) || (this.roomInfo.orderState == 6 && this.roomInfo.compensationState == 2)
        },
        isShowPriceText() {
            // 已完成，待确认，待支付，待确认收款
            const finished = this.roomInfo.orderState == 3
            const confirm = this.roomInfo.orderState == 6 && this.roomInfo.compensationState == 2
            const payment = this.roomInfo.orderState == 4
            const confirmPay = this.roomInfo.orderState == 5
            return finished || confirm || payment || confirmPay
        },
        getOrderState() {
            if (this.roomInfo.orderState == 2) {
                return { text: '申请失败', color: 'red' }
            } else if (this.roomInfo.orderState == 7) {
                return { text: '已取消', color: 'grey' }
            } else if (this.roomInfo.orderState == 3) {
                return { text: '已完成', color: 'grey' }
            } else if (this.roomInfo.orderState == 6 && this.roomInfo.compensationState == 2) {
                // 待确认定损费用
                return { text: '待确认', color: 'yellow' }
            } else if (this.roomInfo.orderState == 6 && this.roomInfo.compensationState == 1) {
                return { text: '处理中', color: 'blue' }
            } else if (this.roomInfo.orderState == 1) {
                return { text: '审核中', color: 'pink' }
            } else if (this.roomInfo.orderState == 6 && this.roomInfo.openState == 0) {
                return { text: '待物业确认布场', color: 'green' }
            } else if (this.roomInfo.orderState == 4) {
                return { text: '待支付', color: 'yellow' }
            } else if (this.roomInfo.orderState == 5) {
                return { text: '待确认收款', color: 'yellow' }
            } else {
                return { text: '处理中', color: 'blue' }
            }
        },
    },
    methods: {
        // 获取订单详情
        async getOrderDetail() {
            const params = {
                data: { orderId: this.orderId }
            }
            const res = await queryMyMeetingDetail(params)
                .then(res => res.data.status == 10000 ? ({ success: true, data: res.data.data }) : ({ success: false, message: res.data.message }))
                .catch(res => ({ success: false, message: res }))

            if (!res.success) return

            this.roomInfo = {
                ...res.data,
                invoice: this.normalizeInvoice(res.data.invoice),
                clothFieldImg: res.data.clothFieldImg ? res.data.clothFieldImg.split(',') : [],
                compensationList: (res.data.compensationList || []).map(item => ({
                    ...item,
                    comPriceStr: (item.comPriceStr || '').slice(0, -1),
                    images: (item.images || '').split(',')
                })),
                agenda: (res.data.agenda || '').replace(/(\n)+/g, '<br>')
            }
            // 取发票最新的数据 
            this.getInvoiceInfoById(res.data)
        },
        // 去支付，线上支付方式，业务上不包含定损部分
        async handlePayment() {
            const orderId = this.orderId
            const res = await getPayDeadLine(orderId)

            if (res.status == 10000) {
                let deadLine = res.data.deadLine
                let url = location.href
                let returnUrl = url.substr(0, url.lastIndexOf('#') + 1) + "/myMeetingRoomInfo?orderId=" + orderId
                let orderInfo = {
                    orderId, //订单ID
                    totalAmount: this.roomInfo.totalPrice, //缴费金额
                    isCountdown: true, //是否倒计时
                    countdownDate: deadLine, //倒计时时间  2020-12-01 17:00:00
                    PaymentInfo: '会议厅预定', //支付信息 
                    returnUrl: returnUrl, //支付成功跳转页面 
                    model: 'meeting',
                    notifyUrl: res.data.notifyUrl, //不知道干甚么的url
                    banktransferUrl: res.data.banktransferUrl, //不知道干什么的url
                    other: '会议厅预定' + orderId //需要传过去,否则报错 add by davidhuang 20210610
                }
                this.$router.push({
                    path: '/toBePaid',
                    query: {
                        orderInfo: JSON.stringify(orderInfo)
                    }
                })
            }

            let deadLine = null
            getPayDeadLine(orderId).then(res => {
                if (res.status == 10000) {
                    deadLine = res.data.deadLine
                    let url = location.href;
                    let returnUrl = url.substr(0, url.lastIndexOf('#') + 1) + "/myMeetingRoomInfo?orderId=" + orderId;
                    let orderInfo = {
                        orderId, //订单ID
                        totalAmount: this.roomInfo.totalPrice, //缴费金额
                        isCountdown: true, //是否倒计时
                        countdownDate: deadLine, //倒计时时间  2020-12-01 17:00:00
                        PaymentInfo: '会议厅预定', //支付信息 
                        returnUrl: returnUrl, //支付成功跳转页面 
                        model: 'meeting',
                        notifyUrl: res.data.notifyUrl, //不知道干甚么的url
                        banktransferUrl: res.data.banktransferUrl, //不知道干什么的url
                        other: '会议厅预定' + orderId    //需要传过去,否则报错 add by davidhuang 20210610
                    }
                    this.$router.push({
                        path: '/toBePaid',
                        query: {
                            orderInfo: JSON.stringify(orderInfo)
                        }
                    })
                }
            })
        },
        // 取消订单
        handleCancel() {
            this.rationale = "";
            this.showCancelRationale = true;
        },
        // 转换 invoice(发票) 为标准化对象
        normalizeInvoice(invoice) {
            let tmp = invoice || ''

            try {
                tmp = JSON.parse(tmp)
            } catch (error) {
                tmp = {}
            }

            return Object.prototype.toString.call(tmp) === '[object Object]' ? tmp : {}
        },
        // 获取发票详情
        getInvoiceInfoById(data) {
            let invoice = {}
            try { invoice = JSON.parse(data.invoice) } catch (error) { }
            if (!invoice.invoiceInfoId) return;
            const params = {
                data: {
                    invoiceInfoId: invoice.invoiceInfoId
                },
                responseToast: false
            };
            return getInvoiceDetailById(params).then(res => {
                if (res.data.status == 200) {
                    this.invoiceInfo = res.data.data || {};
                }
            })
        },
        submitLy() {
            var params = {
                data: {
                    orderId: this.orderId,
                    cancelReason: this.rationale
                }
            }  
            cancelMyMeeting(params).then(res => {
                if (res.data.status == 10000) {
                    this.showCancelRationale = false;
                    uni.showToast({
                        title: '取消成功',
                        duration: 2000,
                        icon: 'none'
                    })
                    setTimeout(() => {
                        // uni.$emit('refreshData');
                        // uni.navigateBack({
                        //     delta: 1
                        // });
                        uni.navigateTo({
                            url: '/pages-c/meeting-room/myMeetingRoomList'
                        })
                    }, 2000)

                } else {
                    uni.showToast({
                        title: res.data.message,
                        duration: 2000,
                        icon: 'none'
                    })

                }
            })
        },
        cancelLy() {
          this.showCancelRationale = false;
          this.rationale = "";
        }
    }

}
</script>
 <style scoped lang="scss">
.line {
    border-top: 10px solid #f2f4f6;
}
.blue {
    color: #44bcfe;
}
.pink {
    color: #ff0167;
}
.green {
    color: #21c743;
}
.yellow {
    color: #C8924B;
}
.grey {
    color: #999999;
}
.red {
    color: #ff0101;
}
.cell-ftitle {
    color: #999;
    font-size: 13px;
    margin-left: 20rpx;
}
.cell-box {
    margin-bottom: 100rpx;
    overflow: auto;
    height: calc(100vh - 100rpx);
}
.footer {
    width: 100%;
    height: 100rpx;
    background: #fff;
    position: fixed;
    display: flex;
    justify-content: space-between;
    align-items: center;
    left: 0;
    bottom: 0;

    .van-button {
        width: 130px;
        height: 50px;
        line-height: 50px;
        font-size: 15px;
        border-radius: 0;
        padding: 0 20px;
        background-color: var(--app-primary-color);
        border-color: var(--app-primary-color);
    }
}
::v-deep .refuse-box .u-cell__value {
    text-align: left;
}
.slot-content {
    ::v-deep .u-input {
        box-sizing: border-box !important;
        border: 1px solid #D6D7D9;
        padding: 6px 8px !important;
    }
}
</style>