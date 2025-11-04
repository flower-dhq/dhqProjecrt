<!--  -->
<template>
    <view class='page' v-if="loading" :style="[THEME_CSS_VAR]">
        <view class="page-box" :style="{ height: taskDetail.warningStatus != 2 ? 'calc(100% - 80rpx)' : '100%' }">
            <view class="content">
                <view class="item-title">
                    <view class="item-caption">
                        <text :class="{ 'textred': item == taskDetail.sensitiveWords }"
                            v-for="(item, index) in taskDetail.warningContentList" :key="index">{{ item ? item :
                                taskDetail.sensitiveWords }}</text>
                    </view>
                    <view class="item-status" :style="[{ color: getTypeStyle.color }]"> {{
                        taskDetail.warningStatus == '0' ? '待确认' : taskDetail.warningStatus == 1 ? '处理中' :
                        taskDetail.warningStatus ==
                            2 ? '已完结' : '' }}</view>
                </view>
                <view class="tag-addr">
                    <view :class="['level-label', `${styleColor()}`]">
                        <text>{{ taskDetail.levelName }}</text>
                    </view>
                    <view class="item-addr">
                        <text v-if="taskDetail.projectName && taskDetail.projectName != '-'" decode> {{ taskDetail.projectName
                        }}</text>
                    </view>
                </view>
                <view class="func-button">
                    <view v-if="triggerPerson.ownerPhoneNumber"><u--text prefixIcon="phone" text="联系触发人" type="primary" size="28rpx" :iconStyle="{fontSize: '34rpx', color: THEME_COLOR, marginRight: '12rpx'}" @click="dial" /></view>
                   <view> <u--text :prefixIcon="require(`@/static/${THEME_NAME}/workorder/icon-chat.png`)" text="发起会话" type="primary" size="28rpx" :iconStyle="{fontSize: '34rpx', color: THEME_COLOR, marginRight: '12rpx'}" @click="startChat" /></view>
                </view>
            </view>
            <u-gap height="12" bg-color="#F3F4F7"></u-gap>
            <!-- 预警信息 -->
            <view class="card-section warning-info"> 
                <view class="card-header">
                    <text>预警信息</text>
                </view>
                <view class="card-body">
                    <view class="cell-row">
                        <text class="cell-row__label">预警编码:</text>
                        <view class="cell-row__cont">
                            <text class="txt">{{ taskDetail.warningCode }}</text>
                        </view>
                    </view>
                    <view class="cell-row">
                        <text class="cell-row__label">预警时间:</text>
                        <view class="cell-row__cont">
                            <text class="txt">{{ taskDetail.createDate }}</text>
                        </view>
                    </view>
                    <view class="cell-row">
                        <text class="cell-row__label">跟进人:</text>
                        <view class="cell-row__cont">
                            <text class="txt">{{ taskDetail.operatorName }}</text>
                        </view>
                    </view>
                    <view class="cell-row">
                        <text class="cell-row__label">触发位置:</text>
                        <view class="cell-row__cont">
                            <text class="txt">{{ taskDetail.triggerPosition }}</text>
                        </view>
                    </view>
                    <view class="cell-row">
                        <text class="cell-row__label">触发关键词:</text>
                        <view class="cell-row__cont">
                            <text class="txt">{{ taskDetail.sensitiveWords }}</text>
                        </view>
                    </view>
                    <view class="cell-row">
                        <text class="cell-row__label">预警概要:</text>
                        <view class="cell-row__cont">
                            <text class="txt">{{ taskDetail.warningContent }}</text>
                        </view>
                    </view>
                    <view class="view-more"><text @click="viewChatRecord">查看上下文</text></view>
                </view>
            </view>
            <u-gap height="12" bg-color="#F3F4F7"></u-gap>
            <!-- 触发人信息 -->
             <view class="card-section trigger-person"> 
                <view class="card-header">
                    <text>触发人信息</text>
                </view>
                <view class="card-body">
                    <view class="cell-row">
                        <text class="cell-row__label">微信昵称:</text>
                        <view class="cell-row__cont">
                            <text class="txt">{{ triggerPerson.wechatNickName }}</text>
                        </view>
                    </view>
                    <view class="cell-row">
                        <text class="cell-row__label">微信账号:</text>
                        <view class="cell-row__cont">
                            <text class="txt">{{ triggerPerson.wechatAccount }}</text>
                        </view>
                    </view>
                    <view class="cell-row">
                        <text class="cell-row__label">姓名:</text>
                        <view class="cell-row__cont btn-dsp">
                            <text class="txt">{{ triggerPerson.ownerUserName || '--' }}</text>
                            <text class="btn" @click="go2archive">业户档案</text>
                        </view>
                    </view>
                    <view class="cell-row">
                        <text class="cell-row__label">联系电话:</text>
                        <view class="cell-row__cont">
                            <text class="txt">{{ triggerPerson.ownerPhoneNumber || '' }}</text>
                        </view>
                    </view>
                    <view class="cell-row">
                        <text class="cell-row__label">预警记录:</text>
                        <view class="cell-row__cont btn-dsp">
                            <text class="txt">{{ triggerPerson.warningRecordTotal || 0 }}条</text>
                            <text class="btn" @click="viewWarningRecord">查看</text>
                        </view>
                    </view>
                </view>
            </view>
            <u-gap height="12" bg-color="#F3F4F7"></u-gap>
            <!-- 预警工单 -->
            <view class="card-section warning-order"> 
                <view class="card-header">
                    <text>预警工单</text>
                </view>
                <view class="card-body">
                    <view class="work-order" v-for="(item, index) in orderList" :key="index" >
                        <view class="cell-row">
                            <text class="cell-row__label">跟进编码:</text>
                            <view class="cell-row__cont color-dsp">
                                <text class="txt code" @click="gotoWorkerDetail(item.quesTaskId)">{{ item.quesTaskCode }}</text>
                                <text class="txt sc">{{ item.quesTaskState }}</text>
                            </view>
                        </view>
                        <view class="cell-row">
                            <text class="cell-row__label">跟进人:</text>
                            <view class="cell-row__cont">
                                <text class="txt">{{ item.followUpProcessor }}</text>
                            </view>
                        </view>
                        <view class="cell-row">
                            <text class="cell-row__label">跟进时间:</text>
                            <view class="cell-row__cont">
                                <text class="txt">{{ item.startDate }}</text>
                            </view>
                        </view>
                    </view>
                </view>
            </view>

            <view class="progress progress-content" v-if="false">
                <view class="progress-content">
                    <view class="pc-item">
                        <view>
                            <text class="pc-name">预警编码:</text>
                            <text class="pc-name-val colorB">{{ taskDetail.warningCode }}</text>
                        </view>
                    </view>
                    <view class="pc-item">
                        <view>
                            <text class="pc-name">预警跟进人:</text>
                            <text class="pc-name-val">{{ formatName(taskDetail.operatorName) }}</text>
                        </view>
                    </view>
                </view>
            </view>
            <!-- <u-gap height="12" bg-color="#F3F4F7"></u-gap> -->

            <view class="progress" v-if="false">
                <view class="progress-title">工单进度</view>
                <u-gap height="0.5" bg-color="#F3F4F7"></u-gap>
                <view v-for="(item, index) in orderList" :key="index" class="progress-content"
                    @click="operation(item, 'orderDetail')">
                    <view class="pc-item">
                        <view>
                            <text class="pc-name">跟进编码:</text>
                            <text class="pc-val">{{ item.quesTaskCode }}</text>
                        </view>
                        <view class="pc-Status">{{ item.quesTaskState }}</view>
                    </view>
                    <view class="pc-item">
                        <view>
                            <text class="pc-name">跟进人:</text>
                            <!-- <text class="pc-name-val">{{ item.handleUsers }}</text> -->
                            <text class="pc-name-val">{{ item.followUpProcessor }}</text>
                        </view>
                    </view>
                    <view class="pc-item">
                        <view>
                            <text class="pc-name">跟进时间:</text>
                            <text class="pc-name">{{ item.startDate }}</text>
                        </view>
                    </view>
                    <u-gap height="0.5" bg-color="#F3F4F7"></u-gap>
                </view>
            </view>
            <u-gap height="12" bg-color="#F3F4F7"></u-gap>
            <view class="log">
                <view class="log-title">操作记录</view>
                <view class="log-steps">
                    <u-steps :current="0" dot direction="column" activeColor="#2761FF">
                        <u-steps-item v-for="(item, index) in logList" :key="item.id">
                            <view slot="desc">
                                <view class="logLeft">
                                    <view class="logcell1">{{ item.type }}</view>
                                    <view class="logcell2">{{ changeDateFormat(item.createDate, 'MM-DD h:m') }}</view>
                                </view>
                                <view style="margin-left:20rpx;">
                                    <view class="logcell1">{{ formatName(item.creatorName) }}</view>
                                    <view class="logcell2">
                                        <view class="text">{{ identifyText(item.content).content }}</view>
                                        <view class="logUrl">
                                              <view v-if="identifyText(item.content).urls && identifyText(item.content).urls.length > 0"
                                            :key="index" style="width: 447rpx;">
                                            <u-upload :fileList="identifyText(item.content).urls" :deletable="false"
                                                name="4" :maxCount="identifyText(item.content).urls.length" sizeType="compressed"
                                                multiple></u-upload>
                                              </view>
                                            <view v-if="item.urls && item.urls.length > 0" style="width: 447rpx;">
                                                <view v-for="(ite, index) in item.urls" :key="index">
                                                    <a :href="ite.url">{{ ite.url }}</a>
                                                </view>
                                            </view>
                                        </view>
                                    </view>
                                </view>

                            </view>
                        </u-steps-item>
                    </u-steps>

                </view>
            </view>
            <u-gap height="12" bg-color="#F3F4F7"></u-gap>
        </view>
        <view class="page-footer" v-if="taskDetail.warningStatus != 2">
            <view v-if="taskDetail.warningStatus == 1" @click="addOrder">
                <image class="footer-img" :src="require(`@/static/${[THEME_NAME]}/common/add.png`)" />
                <text>创建工单</text>
            </view>
            <view v-if="taskDetail.warningStatus == 1" @click="operation(2)">
                <image class="footer-img" :src="require(`@/static/${[THEME_NAME]}/common/progress.png`)" />
                <text>汇报进展</text>
            </view>
            <view v-if="taskDetail.warningStatus == 0" @click="operation(1)">
                <image class="footer-img" :src="require(`@/static/${[THEME_NAME]}/common/add.png`)" />
                <text>预警处理</text>
            </view>
            <view v-if="taskDetail.warningStatus != 2" @click="operation(3)">
                <image class="footer-img" :src="require(`@/static/${[THEME_NAME]}/common/close.png`)" />
                <text>关闭预警</text>
            </view>
        </view>

        <!-- 关闭预警 -->
        <u-modal :show="closeShow" content="确认关闭预警" showCancelButton @confirm="closeShow = false"
            @cancel="closeShow = false" />
        <!-- 汇报进展 -->
        <!-- <opinion-model :show.sync="reportShow" /> -->

        <u-modal :show="unAuthorizedShow" title="提示" content="未添加业主为外部联系人，暂无法发起会话，您可选择其他联系人发起" confirmText="选择联系人" showCancelButton @confirm="chooseExternal" @cancel="unAuthorizedShow = false" />
        <yb-complete ref="completeEl" />
    </view>
</template>

<script>
import OpinionModel from '@/pages/modules/opinion-model.vue'
import YbComplete from '@/components/yb-complete/yb-complete.vue'
import { getEarlyWarningDetailById, getLogList, getTriggerUserInfo, getOwnerInfoByUserId} from '@/service/wechatguanjia';
import { findQuestionTaskList } from '@/service/landcrm'
import { getQYInfoByOwnerId, syncOwnerInfo } from '@/service/api-gateway';
import utils from '@/js/utils';
import pageRefresh from '@/js/pageRefresh'
import Utils from '@/js/utils'

export default {
    components: {
        OpinionModel,
        YbComplete
    },
    data() {
        return {
            value1: 0,
            logCurrent: 0,
            logList: [],
            recordId: '',
            taskDetail: {},
            closeShow: false,
            reportShow: false,
            orderList: [],
            loading: false,
            isRefresh: false,
            triggerPerson: {},
            unAuthorizedShow: false
        };
    },
    computed: {
        getTypeStyle() {
            switch (this.taskDetail.warningStatus) {
                case '0':
                    return {
                        color: '#FA6400',
                        id: 0
                    }
                case '1':
                    return {
                        color: '#2761FF',
                        id: 1
                    }
                case '2':
                    return {
                        color: '#33BA73',
                        id: 2
                    }
                default:
                    return {
                        color: '#33BA73',
                        id: -1
                    }
            }
        }
    },
    async onLoad(options) {
        this.recordId = options.recordId || ''
        Promise.all([
            this.getTaskDetail(),
            this.handleLog(),
            this.getOrder()
        ]).then((results) => {
            setTimeout(() => {
                this.loading = true;

            }, 300);

        })
    },
    created() {
    pageRefresh.restore('YQWORK_DETAIL')
    },
    onShow() {
        // 如果是提交状态返回isRefresh=1，才刷新页面，从详情过来无需刷新
        let pages = getCurrentPages();
        let currPage = pages[pages.length - 1];
        let isRefresh = false;
        // #ifdef MP-WEIXIN
        isRefresh = currPage.data.isRefresh;
        // #endif
        // #ifdef H5 
        isRefresh = currPage._data.isRefresh;
        // #endif
        if (isRefresh) {
            this.loading = false;
            // 重新获取数据
            Promise.all([
                this.getTaskDetail(),
                this.handleLog(),
                this.getOrder()
            ]).then((results) => {
                setTimeout(() => {
                    this.loading = true;

                }, 300);

            })
            // 每一次需要清除，否则会参数会缓存
            // #ifdef H5 
            currPage._data.isRefresh = false
            // #endif
            // #ifdef MP-WEIXIN
            currPage.data.isRefresh = false
            // #endif
        }
        if (pageRefresh.isRefresh('YQWORK_DETAIL', true)) {
            // this.loading = false;
             // 重新获取数据
             Promise.all([
                this.getTaskDetail(),
                this.handleLog(),
                this.getOrder()
            ]).then((results) => {
                setTimeout(() => {
                    this.loading = true;

                }, 300);

            })
        }

    },
    methods: {
        formatName(name) {
            return name ? decodeURIComponent(name) : ''
        },
        customFun(obj) {
            if (obj) {
                // 将打印出 { name: '周某某', sex: '女' }
                this.isRefresh = true;
            }
        },
        async getTaskDetail() {
            if (!this.recordId) return

            const params = {
                data: {},
                pathParams: `/${this.recordId}`,
                hideLoading: true
            }
            const res = await getEarlyWarningDetailById(params)
            const triggerUserId = res.data?.triggerUserId || ''
            this.taskDetail = res.data ?? {};
            this.taskDetail.warningContentList = [];
            if (this.taskDetail.warningContent) {
                let warningContent = this.taskDetail.warningContent;
                let key = this.taskDetail.sensitiveWords;
                let list = this.splitStr(warningContent, key)
                // let arr = warningContent.split(key);
                // if (arr[arr.length - 1] == '') {
                //     arr.pop()
                // }
                // let list = []
                // if (warningContent == key) {
                //     list.push('')
                // } else {
                //     for (let index = 0; index < arr.length; index++) {

                //         list.push(arr[index]);
                //         if (index < arr.length - 1 && arr[index] != '') {
                //             list.push('');

                //         }
                //     }
                // }
                this.taskDetail.warningContentList = list;
            }
            if (triggerUserId) {
                this.getTriggerUserInfo(triggerUserId)
                this.getOwnerInfoByUserId(triggerUserId)
            }
        },
        splitStr(text, key) {
            let arr = [];
            let keyLength = key.length;
            let index = text.indexOf(key);
            if (index == -1) {
                if(text){
                  arr.push(text)
                }
            } else if (index == 0) {
                arr.push(key);
                let str = text.slice(keyLength, text.length);
                let rA = this.splitStr(str, key);
                arr = arr.concat(rA);
            } else if ((index + keyLength) == text.length) {
                // 结尾
                let startVal
                //  var reg = new RegExp("[A-Za-z]+")
                //  if(index + 1 == text.length && reg.test(text)){
                 startVal = text.slice(0, index);
                //  }else {
                //   startVal = text.slice(0, index - 1);
                //  }
                let endVal = text.slice(index, text.length);
                arr.push(startVal);
                arr.push(endVal);
            } else {
                // 中间部分
                let startVal = text.slice(0, index);
                let endVal = text.slice(index, text.length);
                arr.push(startVal);
                let rA = this.splitStr(endVal, key)

                arr = arr.concat(rA);
            }
            return arr;
        },
        async getOrder() {
            let { O_USER_INFO } = this.$constant;
            let userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' });
            const params = {
                data: {
                    startIndex: 1,
                    pageSize: 5,
                    areaId: '',
                    projectId: this.taskDetail?.projectId ?? '',
                    exportFlag: 0,
                    userId: userInfo.userId,
                    yqWarningId: this.recordId
                },
                hideLoading: true,
                responseToast: false,
            }
            const res = await findQuestionTaskList(params);
            this.orderList = res.data ?? []

        },
        // 操作记录
        handleLog() {
            this.logList = [];
            var params = {
                data: {
                    recordId: this.recordId
                }
            }
            getLogList(params).then(res => {
                if (res.status == 200) {
                    // this.logList = res.data;
                    this.logCurrent = res.data && res.data.length > 0 ? (res.data.length - 1) : 0;
                    let logList = res.data
                    if (Array.isArray(logList)) {
                        logList.forEach((item, index) => {
                      const {companyId, content, createDate,creatorName, id, operateDate, operator, operatorName, state, type, warningRecordId} = item;
                      let url = []
                      let urlss = []
                      if (content && content.indexOf('http') != '-1') {
                        let text1 = content.substring(0, content.indexOf('http'));
                        let urls = content.substring(content.indexOf('http'), content.length - 1).split(';');
                        if (urls.length > 0) {
                                 urls.forEach(element => {
                                    if(element.includes('.jpg' || 'jpeg' || 'png')){
                                        url.push({ url: element})
                                      }else {
                                        urlss.push({ url: element})
                                      }
                             }) 
                          }
                        }
                      const logLists = {
                                companyId,
                                content,
                                createDate,
                                creatorName,
                                id,
                                operateDate,
                                operator,
                                operatorName,
                                state,
                                type,
                                warningRecordId,
                                url: url,
                                urls:urlss
                               };
                      this.logList.push(logLists);
                     })
                     }
            }
            })
        },
        changeDateFormat(val, type) {
            if (val) {
                return utils.formatDate({ type: 's2d', value: val, format: type ? type : 'YYYY-MM-DD HH:mm:ss' })

            }
        },
        identifyText(value) {
            let list = {
                content: '',
                url: []
            };
            if (value && value.indexOf('http') != '-1') {
                let text1 = value.substring(0, value.indexOf('http'));
                let urls = value.substring(value.indexOf('http'), value.length - 1).split(';');
                list.content = text1;
                list.urls = [];
                if (urls.length > 0) {
                    urls.forEach(element => {
                        if(element.includes('.jpg'|| 'jpeg' || 'png')){
                            list.urls.push({ url: element })
                        }
                    });
                }
            } else {
                list.content = value;
            }
            return list;
        },
        addOrder() {
            const recordId = this.recordId
            uni.navigateTo({ url: `/pages/workorder/index?recordId=${recordId}` });

        },
        operation(type, pageCode) {
            if (pageCode == 'orderDetail') {
                uni.navigateTo({ url: `/pages-workorder/workorder-detail/detail?taskId=${type.quesTaskId}` });

            }
            else if(type == 1){
                uni.navigateTo({ url: `/pages-workorder/opinion/earlyWarningModel?recordId=${this.recordId}&type=${type}&areaId=${this.taskDetail.areaId}&areaName=${this.taskDetail.areaName}&projectId=${this.taskDetail.projectId}&projectName=${this.taskDetail.projectName}` });
            }
             else {
                uni.navigateTo({ url: `/pages-workorder/opinion/earlyWarningModel?recordId=${this.recordId}&type=${type}` });

            }

        },
        styleColor() {
            const { level } = this.taskDetail
            return `l-${level >=4 ? 4 : level}`
        },
        getTriggerUserInfo(triggerUserId) {
            const params = {
                data: {
                    triggerUserId
                },
                hideLoading: true
            }
            getTriggerUserInfo(params).then(res => {
                if (res.success) {
                    this.triggerPerson = res.data || {}
                }
            })
        },
        async getOwnerInfoByUserId(userId) {
            const params = {
                data: {},
                pathParams: `/${userId}`,
                hideLoading: true,
                responseToast: false,
            }
            // 需要先根据企微外部联系人id同步业主信息
            await syncOwnerInfo(userId)
            const res = await getOwnerInfoByUserId(params)
            this.userInfo = res.data || {}
        },
         // 会话
        async startChat(params) {
            const { ownerId } = this.userInfo || {};
            const { uniPlatform } = uni.getSystemInfoSync();

            if (uniPlatform !== 'mp-weixin' && false) return;

            if (!ownerId) return (this.unAuthorizedShow = true);

            const res = await getQYInfoByOwnerId(ownerId); // 获取反馈人在企微上的信息
            const data = res.data || {};
            // memberIsAssociation   int类型   1-已认证 0-未认证 2-预认证
            if(data.userId != '' && data.memberIsAssociation !=1) return (this.unAuthorizedShow = true);

            // 需要先根据外部联系人id同步企微外部联系人信息
            await syncOwnerInfo(data.userId);
            // 打开与客户的单聊会话
            wx.qy.openEnterpriseChat({
                externalUserIds: data.userId,
                success: (res) => {},
            });
        },
        // 选择外部联系人（客户）
        chooseExternal() {
            wx.qy.selectExternalContact({
                filterType: 0,
                success: (res) => {
                const data = res.userIds || [];
                // 客户id
                const userItem = data[0] || '';
                this.unAuthorizedShow = false;
                wx.qy.openEnterpriseChat({
                    externalUserIds: userItem,
                });
                },
            });
        },
        dial() {
            const phone = this.triggerPerson.ownerPhoneNumber
            uni.makePhoneCall({
                phoneNumber: phone
            });
        },
        viewWarningRecord() {
            const { triggerUserId } = this.taskDetail
            uni.navigateTo({url: `/pages-workorder/opinion/list?triggerUserId=${triggerUserId}`})
        },
        go2archive() {
            const { unionMemberId, ownerId } = this.userInfo
            if (Utils.isEmpty(ownerId)) {
                this.$refs.completeEl.showMessage('业主未认证，请同步到业主信息再试，或者邀请业主认证后再试')
            } else {
                uni.reLaunch({ url: `/pages-archives/owner-document/detail?unifiedMemberId=${unionMemberId}&ownerId=${ownerId}` }) 
            }
        },
        viewChatRecord() {
            const { wxMsgId,groupId } = this.taskDetail
            uni.navigateTo({url: `/pages-workorder/opinion/session-list?wxMsgId=${wxMsgId}&groupId=${groupId}`})
        },
        gotoWorkerDetail(quesTaskId) {
            uni.navigateTo({ url: `/pages-workorder/workorder-detail/detail?taskId=${quesTaskId}` });
        }

    },
}
</script>
<style scoped lang="scss">
.page {
    box-sizing: border-box;
    background-color: #F3F4F7;
    width: 100%;
    height: 100%;
    padding: 24rpx 0;
}

.page-box {
    height: calc(100% - 80rpx);
    overflow: auto;
    margin: 0 20rpx;
}

.content {
    background: #FFFFFF;
    border-radius: 12rpx;

    .item-title {
        display: flex;
        padding: 24rpx 30rpx;
        justify-content: space-between;



        .item-caption {
            font-size: 30rpx;
            font-family: PingFang SC;
            font-weight: bold;
            color: #222222;
            @include ellipsis(2);
            .textred {
                color: red;
            }
        }

        .item-status {
            font-size: 28rpx;
            color: #33BA73;
            width: 20%;
            padding-top: 2px;
            margin-left: 26rpx;
            text-align: right;
            display: inline-block;
            white-space: nowrap;
        }
    }

    .item-content {
        padding: 12rpx 30rpx;

        font-size: 30rpx;
        font-weight: bold;
        color: #222222;
    }

    .tag-addr{
        @include flx-dsp($jsc: flex-start, $ali: center);
        box-sizing: border-box;
        padding: 0 30rpx 16rpx 30rpx;
    }
    .level-label{
        @include flx-dsp($jsc: center, $ali: center);
        width: 60rpx;
        height: 40rpx;
        color: #fff;
        font-size: 24rpx;
        margin-right: 16rpx;
        &.l-1{
            background-color: var(--app-primary-color);
        }
        &.l-2{
            background-color: #ebcb4f;
        }
        &.l-3{
            background-color: #ff8115;
        }
        &.l-4{
            background-color: #fc0b0b;
        }
    }
    
    .func-button{
        @include flx-dsp($jsc: space-around, $ali: center);
        position: relative;
        width: 100%;
        height: 80rpx;
        &::before{
            display: block;
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 1rpx;
            background-color: #eee;
        }
    }
    .item-addr {
        font-size: 28rpx;
        color: #666;

    }
}
.card-section{
    box-sizing: border-box;
    background-color: #fff;
    border-radius: 12rpx;
   .card-header{
    @include flx-dsp($jsc: flex-start, $ali: center);
    position: relative;
    &::before{
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 1rpx;
        display: block;
        content: '';
        transform: scaleY(.5);
        background-color: #ddd;
    }
    height: 100rpx;
    padding-left: 30rpx;
    box-sizing: border-box;
    color: #333;
    font-size: 30rpx;
   } 
   .card-body{
    box-sizing: border-box;
    padding: 30rpx;
    .cell-row {
        @include flx-dsp($jsc: flex-start, $ali: flex-start);
        margin-bottom: 16rpx;
        &__label{
            min-width: 120rpx;
            margin-right: 24rpx;
            display: inline-block;
            color: #666;
            font-size: 28rpx;
        }
        &__cont{
            .txt{
                color: #333;
                font-size: 28rpx;
                word-break: break-all;
            }
            &.btn-dsp{
                width: 100%;
                @include flx-dsp($jsc: space-between, $ali: flex-start);
                .txt{
                    width: 80%;
                }
                .btn{
                    @include flx-dsp($jsc: center, $ali: center);
                    width: 120rpx;
                    height: 50rpx;
                    color: var(--app-primary-color);
                    border: 1px solid var(--app-primary-color);
                    border-radius: 4rpx;
                    font-size: 24rpx;
                }
            }
        }

    }
   }
}
.warning-info{
    .cell-row__label {
        width: 148rpx;
    }
    .view-more{
        @include flx-dsp($jsc: center, $ali: center);
        width: 100%;
        margin-top: 38rpx;
        text{
            @include flx-dsp($jsc: center, $ali: center);
            width: 144rpx;
            height: 50rpx;
            border: 1px solid var(--app-primary-color);
            border-radius: 4rpx;
            font-size: 24rpx;
            color: var(--app-primary-color);
        }
    }
}
.warning-order{
    .work-order{
        position: relative;
        padding-bottom: 6rpx;
        &::before{
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            height: 1rpx;
            display: block;
            content: '';
            transform: scaleY(.5);
            background-color: #ddd;
        }
        &:last-child{
            &::before{
                display: none;
            }
        }
        .color-dsp{
            width: 100%;
            @include flx-dsp($jsc: space-between, $ali: flex-start);
            .code{
                color: var(--app-primary-color);
                font-size: 28rpx;
            }
            .sc{
                color: var(--app-primary-color);
            }
        }
    }
}
.progress {
    background: #FFFFFF;
    border-radius: 12rpx;

    .progress-title {
        padding: 24rpx 30rpx;
    }

    .progress-content {
        .pc-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10rpx 30rpx;
            font-size: 28rpx;
            // height: 38px;

            .pc-name {
                color: #666666;
                margin-right: 10rpx;
            }

            .pc-val {
                color: #2761FF;
            }

            .pc-name-val {
                color: #666666;
            }

            .pc-Status {
                color: #33BA73;
                display: inline-block;
                white-space: nowrap;

            }

            .colorB {
                color: #2761FF;
            }
        }
    }
}

.log {
    background: #FFFFFF;
    border-radius: 12rpx;
    padding: 24rpx 30rpx;

    .log-title {
        font-size: 30rpx;
        font-weight: bold;
        line-height: 60rpx;
        color: #333333;
    }
}

.logLeft {
    position: absolute;
    left: -80px;
    text-align: center;
}

.logcell1 {
    font-size: 28rpx;
    color: #333333;
    // padding: 16rpx 0;
    min-height: 60rpx;
}

.logcell2 {
    // margin-bottom: 40rpx;
    font-size: 26rpx;
    color: #999999;
    min-height: 60rpx;

    .text {
        width: 447rpx;
        word-break: break-all;
    }

    .logUrl {
        color: #2761FF;
        word-wrap: break-word;
        image {
            width: 140rpx;
            height: 140rpx;
        }
    }
}

.log-steps {
    margin-left: 80px;
    margin-top: 20rpx;
}

.page-footer {
    color: #2761FF;
    height: 100rpx;
    line-height: 100rpx;
    flex: 0 0 100rpx;
    background-color: #FFFFFF;
    font-size: 30rpx;
    display: flex;
    justify-content: space-around;
    align-items: center;

    .footer-img {
        height: 32rpx;
        width: 32rpx;
        margin: 0 10rpx 0 0;
    }

    view {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 65%;
    }

    .view-border {
        border-left: 1px solid #F3F4F7;
        border-left: 1px solid #F3F4F7;
    }

}

::v-deep .u-steps {
    .u-steps-item__wrapper {
        height: 20rpx;
    }

    .u-steps-item:first-child {
        .u-steps-item__line {
            background: #2761FF !important;
            ;
        }
    }
}
</style>