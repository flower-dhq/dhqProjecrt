<!--  -->
<template>
    <view>
    </view>
</template>

<script>
import commLogic from '@/js/comm-logic';
import util from '@/js/utils';
import { menu } from '../../js/menu'
import { appletLogin, findCompanyAuthInfoList, getOwnerBuildingListComm } from '../../service/community'
export default {
    components: {},
    data() {
        return {
            path: '',
            companyId: '',
            memberId: '',
            pathCode:'',
            authentication:''
        };
    },
    computed: {},
    watch: {},
    methods: {

    },
    onLoad(options) {
        console.log('options', options);
        if (options.scene) {
            const scene = decodeURIComponent(options.scene) ;
            let code = scene?scene.split('=')[1]:'';           
            
            this.pathCode =  code;
         } else {
            this.pathCode = options ? options.pathCode : '';
            this.authentication = options ? options.authentication : '';
        }
        console.log('取到的值',this.pathCode);


    },
    onReady() {
        this.wxMiniLogin();
    },
    created() {

    },
    mounted() {

    },
    methods: {
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
        // 小程序登录
        async wxMiniLogin() {
            const { companyId } = commLogic.getProjectConfig();
            this.companyId = companyId;
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
            appletLogin(params).then(res => {
                if (res.status == '200') {
                    let data = {}
                    let obj = res.data 
                    // 有手机号码就是授权过，没有则需要授权
                    if (res.data.memberPhone) {
                        data = res.data.appMemberJson ? JSON.parse(res.data.appMemberJson) : {}
                        data.wxUserId = res.data.wxUserId
                    } else {
                        data = {
                            companyId: obj.companyId,
                            id: obj.memberId,
                            token: obj.token,
                            wxUserId: obj.wxUserId,
                            nickname: obj.wxUserName
                        }
                    }
                    const { token, id, wxUserId } = data
                    // 有手机号码，设置缓存
                    const { TOKEN, MEMBER_ID, O_USER_INFO, WX_USERID } = this.$constant;
                    const combineData = { ...obj, ...data }
                    // 用的是微信小程序登录接口，用mpWeixin方法处理
                    const storage = commLogic.setOwerUserInfo('mpWeixin', combineData)
                    util.storageAction({ key: TOKEN, action: 'set', value: token });
                    util.storageAction({ key: MEMBER_ID, action: 'set', value: id });
                    util.storageAction({ key: O_USER_INFO, action: 'set', value: storage });
                    util.storageAction({ key: WX_USERID, action: 'set', value: wxUserId });
                    //   1、当业主在CRM已有房间，未注册过小程序：扫描二维码，调授权接口注册后成功匹配房产，进入缴费页面； 
                    // 2、当业主在CRM已有房间，已注册小程序：扫描二维码，调授权接口后直接进去缴费页面； 
                    // 3、当业主在CRM没有房产，未注册小程序：扫描二维码，调授权接口后直接进入小程序首页，业主自行进行房屋认证，认证成功后再扫码进去缴费页面；
                     if (this.pathCode == 'paymentCenterNew' && (!res.data.memberPhone || res.data.memberPhone == '')) {
                        // 跳到授权页面
                        uni.navigateTo({ url: `/pages-a/authorization/bindingMobile?authentication=paymentCenterNew` });
                        return;
                    }else{
                        this.memberId = id;
                    this.jump();
                    }
                     
                }
            })
        },

        async jump() {
            await this.getUserAssets();
            // 授权认证
            let url = ''
            if (this.pathCode == 'wxAuth') {
                const {PROGRAM_TYPE} = this.$appConfig;
                if(PROGRAM_TYPE == 'wechat'|| PROGRAM_TYPE == 'appH5'){ 
                    url = `/pages-a/authorization/bindingMobile?authentication=${this.authentication}`
                }else{
                    url = `/pages-a/authorization/bindingMobile?authentication=${this.authentication}`
                }
               

            } else if (this.pathCode == 'paymentCenterNew') {
                // 3、当业主在CRM没有房产，未注册小程序：扫描二维码，调授权接口后直接进入小程序首页，业主自行进行房屋认证，认证成功后再扫码进去缴费页面；
                const { USER_ADDR_INFO } = this.$constant;
                let addrInfo = util.storageAction({ key: USER_ADDR_INFO, action: 'get' });
                if (addrInfo && addrInfo != '') {
                    let info = menu.filter(f => { return f.detailCode == this.pathCode });
                    if (info && info.length > 0 && info[0].page) url = info[0].page;
                } else {
                    url = `/pages/index/index`
                }
            } else {
                let info = menu.filter(f => { return f.detailCode == this.pathCode });
                if (info && info.length > 0 && info[0].page) url = info[0].page;
            }
            // 跳转对应页面
            uni.reLaunch({
                url: url
            });
        },
        // 获取用户房产项目
        async getUserAssets() {
            let that = this;
            let companyData = await that.getCompanyAuthInfoList();
            let ownerData = await that.getOwnerHouse();
            new Promise((resolve, reject) => {
                let data = [];
                if (companyData.status == 200) {
                    data = companyData.data ? data.concat(companyData.data) : data;

                }
                if (ownerData.status == 200) {
                    data = ownerData.data ? data.concat(ownerData.data) : data;
                }
                // 根据默认房产设置默认区域，项目
                let defaultEnterprise = data.filter(item => { return item.employeeStatus && item.employeeStatus == 1 });
                let defaultHouse = data.filter(item => { return item.isDefault == 1 });
                let list = data.filter(f => { return f.authType == 1 });
                let selectInfo = {};
                if (defaultEnterprise.length > 0) {
                    selectInfo = defaultEnterprise[0];
                } else if (defaultHouse && defaultHouse.length > 0) {
                    selectInfo = defaultHouse[0];
                } else if (list.length > 0) {
                    selectInfo = list[0];
                } else {
                    that.getCity();
                    return;
                }
                const { areaId, projectId, areaName, projectName } = selectInfo;
                const { AREA_ID, PROJECT_ID, AREA_NAME, PROJECT_NAME, USER_ADDR_INFO } = this.$constant;
                util.storageAction({ key: AREA_ID, action: 'set', value: areaId });
                util.storageAction({ key: PROJECT_ID, action: 'set', value: projectId });
                util.storageAction({ key: USER_ADDR_INFO, action: 'set', value: selectInfo });
                util.storageAction({ key: AREA_NAME, action: 'set', value: areaName });
                util.storageAction({ key: PROJECT_NAME, action: 'set', value: projectName });
            })

        },
        // 获取企业房产
        getCompanyAuthInfoList() {
            return new Promise((resolve, reject) => {
                var params = {
                    data: {
                        companyId: this.companyId,
                        memberId: this.memberId,
                        applyStatus: 9  //已通过企业
                    },
                    hideLoading: true,
                    responseToast: false
                }
                findCompanyAuthInfoList(params).then(res => {
                    resolve(res);
                })
            })
        },
        //获取房产
        getOwnerHouse() {
            return new Promise((resolve, reject) => {
                var params = {
                    data: {
                        companyId: this.companyId,
                        memberId: this.memberId
                    },
                    hideLoading: true,
                    responseToast: false
                }
                getOwnerBuildingListComm(params).then(res => {
                    resolve(res);
                })
            })
        },
        getCity() {
            const { projectType } = commLogic.getProjectConfig();
            return new Promise((resolve, reject) => {
                var params = {
                    data: {
                        projectType: projectType,
                    },
                    hideLoading: true
                }
                getListByMap(params).then(res => {
                    if (res.status == 200) {
                        let defaultData = res.data
                        let defDate = defaultData.some(function (i) {
                            return i.isDefaultProject == true
                        });
                        let selectInfo = {};
                        if (defDate == true) {
                            for (var i = 0; i < defaultData.length; i++) {
                                if (defaultData[i].isDefaultProject == true) {
                                    selectInfo = defaultData[i];
                                }
                            }
                        } else {
                            selectInfo = res.data[0];
                        }
                        const { AREA_ID, PROJECT_ID, AREA_NAME, PROJECT_NAME } = this.$constant;
                        const { areaId, projectId, areaName, projectName } = selectInfo;
                        util.storageAction({ key: AREA_ID, action: 'set', value: areaId });
                        util.storageAction({ key: PROJECT_ID, action: 'set', value: projectId });
                        util.storageAction({ key: AREA_NAME, action: 'set', value: areaName });
                        util.storageAction({ key: PROJECT_NAME, action: 'set', value: projectName });
                        resolve();

                    } else {
                        reject();
                    }
                })
            })


        },
    }
}
</script>
<style scoped></style>