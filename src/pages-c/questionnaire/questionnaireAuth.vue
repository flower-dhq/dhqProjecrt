<template>
    <view class="">
        <view class="showMessage nodata" v-if="!showQuestion">{{ message }}</view>
        <view v-else class="pollBox">
            <view> 尊敬的客户您好，为了改善您的服务体验，诚邀您对物业镜像评价！</view>
            <view class="line2"></view>
            <view class="question-box">
                <visit-question ref="customersQuestionnaire" :subjectList="subjectList"
                    :groupFlag="groupFlag"></visit-question>
            </view>
            <view class="btn-box">
                <button type="primary" @click="submitEvent">提交</button>
            </view>
        </view>

    </view>
</template>
<script>
import commLogic from '@/js/comm-logic';
import { appletLogin } from '@/service/community';
import { getVisitPlanCustomer, getQuestionnaireByIdNew, saveQuestionnaireAnswerNew } from '@/service/returnVisit';

import util from '@/js/utils';
import VisitQuestion from './modules/visit-question.vue';
export default {
    components: {
        VisitQuestion
    },
    data() {
        return {
            id: '',
            showQuestion: false,
            message: '正在加载...',
            subjectList: [],//不分组 普通题
            groupFlag: 0,
            mpqId: '',
            taskId: '',//访问计划id

        }
    },
    onLoad(e) {
        if (e.scene) {
            this.id = e.scene
        }

        this.login();




    },
    methods: {
        async login() {
            const { companyId } = commLogic.getProjectConfig();
            const { PROJECT_TYPE } = this.$appConfig;
            const { errMsg: loginMsg, code } = await this.getWxCode().catch(_ => { });
            let params = {
                data: {
                    code: code,
                    appletId: PROJECT_TYPE,
                    companyId: companyId,
                    source: 'wxMini'
                }
            }
            const res = await appletLogin(params)
            if (res.status == '200') {
                let data = {}
                let obj = res.data
                // 有手机号码就是授权过，没有则需要授权
                if (res.data.memberPhone) {
                    data = res.data.appMemberJson ? JSON.parse(res.data.appMemberJson) : {}
                    data.wxUserId = res.data.wxUserId
                } else {
                    setTimeout(() => {
                        uni.showToast({
                            title: '请先绑定手机号！',
                            duration: 2000,
                            icon: 'none',
                        });
                        setTimeout(() => {
                            uni.navigateTo({ url: '/pages-a/authorization/bindingMobile' });
                            return
                        }, 2000)
                    }, 1000)
                    return;
                }

                const { token, id, wxUserId, phoneNumber } = data
                // 有手机号码，设置缓存
                const { TOKEN, MEMBER_ID, O_USER_INFO, WX_USERID } = this.$constant;
                const combineData = { ...obj, ...data }
                // 用的是微信小程序登录接口，用mpWeixin方法处理
                const storage = commLogic.setOwerUserInfo('mpWeixin', combineData)
                util.storageAction({ key: TOKEN, action: 'set', value: token });
                util.storageAction({ key: MEMBER_ID, action: 'set', value: id });
                util.storageAction({ key: O_USER_INFO, action: 'set', value: storage });
                util.storageAction({ key: WX_USERID, action: 'set', value: wxUserId });
                // 判断扫码客户是否在该计划范围内
                var pm = {
                    data: {
                        id: this.id,
                        ownerTel: phoneNumber,
                        // ownerInfoId: res.data.ownerId?res.data.ownerId:''
                    }

                }
                getVisitPlanCustomer(pm).then(res => {
                    console.log('nih ', res)
                    if (res.status == 200) {
                        this.showQuestion = true;
                        this.mpqId = res.data.mpqId;
                        this.taskId = res.data.visitId
                        let jsonData = {
                            id: this.mpqId,
                        };
                        getQuestionnaireByIdNew(jsonData).then(res => {
                            let { groupFlag, subjectsList, subjectGroupList } = res.data;
                            this.groupFlag = groupFlag;
                            this.subjectList = groupFlag == 1 ? subjectGroupList : subjectsList;

                        })
                    } else {
                        this.message = res.message;
                    }

                })

            }

            // getVisitPlanCustomer
        },
        // 获取微信授权code
        getWxCode(pvd) {
            return new Promise((resolve) => {
                uni.getProvider({
                    service: 'oauth',
                    success: (provider) => {
                        uni.login({
                            provider: pvd || provider,
                            onlyAuthorize: !!pvd, // 微信登录仅请求授权认证
                            success: (res) => {
                                resolve(res);
                            },
                            fail: (error) => {
                                resolve(error);
                            },
                        });
                    },
                    fail: (error) => {
                        resolve(error);
                    },
                });
            });
        },
        submitEvent() {
            const subValid = this.$refs.customersQuestionnaire.getSubjectAnswer();
            console.log('答案', subValid);
            if (!subValid.success) {
                this.$refs.uToast.show({
                    type: 'default',
                    message: subValid.message
                })
                return
            }
            let arrList = subValid.data;
            let dn = []
            if (arrList) {
                for (let key in arrList) {

                    let element = arrList[key];
                    console.log('题目', element);

                    let { type, value, elementList, id } = element;
                    var answer = {
                        result: '',
                        elements: '',
                        remarks: '',
                        subjectsId: id,
                        text: '',
                    };

                    if ((type == 0 || type == 3) && value) { //单选
                        let list = elementList.filter(item => item.id == value)[0];
                        answer.elements = value;
                        answer.result = list.title;
                        dn.push(answer)

                    } else if (type == 1 && value) { //多选
                        let list = elementList.filter(item => value.includes(item.id));
                        list.forEach(item => {
                            var answer1 = {
                                result: item.title,
                                elements: item.id,
                                remarks: '',
                                subjectsId: id,
                                text: '',
                            };
                            dn.push(answer1)

                        })

                        // answer.elements = value;
                        // answer.result = list.map(item => item.title);
                    } else if (type == 2 && value) { //文本
                        answer.text = value;
                        // answer.result = value;
                        dn.push(answer)
                    }
                    // if (value) { dn.push(answer) }
                }
                console.log('提交答案', dn);
            }
            const { O_USER_INFO } = this.$constant
            const userInfo = util.storageAction({ key: O_USER_INFO, action: 'get' });

            var params = {
                data: {
                    companyId: userInfo.companyId,
                    userId: userInfo.memberId,
                    userName: userInfo.memberName,
                    name: userInfo.memberName,
                    mpqId: this.mpqId,
                    answerValueList: dn,
                    ownerInfoId: userInfo.ownerId,
                    phone: userInfo.phoneNumber,
                    taskId: this.taskId,
                }

            } 
            saveQuestionnaireAnswerNew(params).then(res => {
                if(res.status == 200){                  
                    uni.showToast({ title: '提交成功', icon: 'none' });

                }else{
                    uni.showToast({ title: res.message, icon: 'none' });

                    // this.$refs.uToast.show({
                    //    message: res.message
                    // })
                }

            })


        }
    }
}
</script>
<style scoped lang='scss'>
.showMessage {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    font-size: 16px;
}

.nodata {
    background: url("@/static/theme-default/multiplexing/tips.png");
    background-position: center;
    background-repeat: no-repeat;
    background-size: 175px;
    position: relative;
    background-position: center 25%;
    background-color: #ffffff;
}

.pollBox {
    position: relative;
    height: 100vh;
    // height: calc(100vh - 60px);
    padding: 0 10px;

    .line2 {
        background: linear-gradient(to left, transparent 0%, transparent 50%, #ccc 50%, #ccc 100%);
        background-size: 10px 1px;
        background-repeat: repeat-x;
        margin: 10px 0;
        height: 1px;
    }
}

.question-box {
    height: 83%;
    overflow: auto;
}

.btn-box {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 10px;
    text-align: center;
}
</style>