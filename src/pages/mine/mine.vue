<style lang="scss" scoped>
.content {
    background-image: url("@/static/theme-default/index/index_bg.png");
    background-repeat: no-repeat;
    background-size: 100%;
    background-color: #f5f5f5;
    min-height: 100%;
    padding-bottom: var(--window-bottom);
    // padding-bottom:calc(var(--window-bottom) + 100rpx);
    overflow: hidden;
}

.user-box {
    height: 288rpx;
    @include flx-dsp($jsc: flex-start, $ali: center);
    padding: 0 40rpx;
    padding-bottom: 54rpx;
    box-sizing: border-box;

    .user-icon {
        height: 120rpx;
        width: 120rpx;
        border-radius: 120rpx;

        image {
            width: 120rpx;
            height: 120rpx;
            border-radius: 60rpx;

        }
    }

    .user-info {
        margin-left: 40rpx;
        height: 120rpx;
        display: grid;
        align-items: center;
        justify-content: center;

        &__top {
            @include flx-dsp($jsc: flex-start, $ali: flex-start);

            .edit-profile {
                width: 28rpx;
                height: 28rpx;
                padding-left: 20rpx;
                padding-top: 14rpx;
            }
        }


        .info-name {
            max-width: 400rpx;
            font-size: 40rpx;
            font-weight: bold;
            color: #FFFFFF;
            @include ellipsis(1);
        }

        .info-state {
            display: flex;
            align-items: center;
            justify-content: left;
            .state1 {
                font-size: 24rpx;
                color: #FFFFFF;
                float: left;
            }

            .state2 {
                margin-left: 20rpx;
                padding: 2rpx 20rpx;
                background-color: rgba($color: #F2EAE3, $alpha: 0.43);
                border-radius: 20rpx;
                font-size: 16rpx;
                color: #ffffff;
                float: left;
            }
        }
    }
}

.mine-bottom-box {
    box-shadow: 0px 0px 20rpx rgba(0, 0, 0, 0.08);
    background-color: #ffffff;
    padding-top: 40rpx;
    padding-left: 30rpx;
    padding-right: 30rpx;
    border-radius: 20rpx;
    margin: 0 20rpx;
    margin-top: -70rpx;
    margin-bottom: 128rpx;

    .box {
        
        .box-title {
            font-size: 28rpx;
            font-weight: bold;
            color: #333333;
        }

        .menu-box {
            padding: 40rpx 0;
            display: grid;
            grid-template-columns: 1fr 1fr 1fr 1fr;
            gap: 40rpx 20rpx;
            .menu-grid {
                display: grid;
                align-items: center;
                justify-content: center;
                text-align: center;
                // width: 170rpx;
            }

            .menu-icon {
                height: 52rpx;
                width: 52rpx;
                background-repeat: no-repeat;
                background-size: 60rpx;
                margin: auto;
            }

            .menu-title {
                font-size: 26rpx;
                color: #333333;
                margin-top: 10rpx;
            }


        }
    }
}
::v-deep .u-modal__content .u-modal__content__text {
	text-align: center !important;
}
</style>

<template>
    <view class="content" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
        <view class="user-box">
            <view class="user-icon">
                <image :src="headimg ? headimg : require(`@/static/${[THEME_NAME]}/index/default-photo.png`)"
                    mode="scaleToFill"></image>
            </view>
            <view class="user-info">
                <view class="user-info__top" @click="editProfile">
                    <view class="info-name">{{ nickname }}</view>
                    <image src="@/static/custom_edit_pen.png" class="edit-profile"></image>
                </view>
                <view class="info-state">
                    <text class="state1">{{ userType }}</text>

                    <view class="state2" v-if="phoneNumber">{{ isAssociation == 0 ? '未认证' : '已认证' }}</view>
                    <view class="state2" v-else @click="phoneAuth">未登录</view>
                </view>
            </view>
        </view>
        <view class="mine-bottom-box">
            <view class="box" v-for="(listItem, listindex) in list" :key="listindex">
                <template v-if="menuList[listItem.id]">
                    <view class="box-title">{{ listItem.name }}</view>
                    <view class="menu-box">
                        <view class="menu-grid" v-for="(item, index) in menuList[listItem.id]" :key="index"
                            @click="menuJump(item)">
                            <image class="menu-icon" :src="item.icon.indexOf('http') > -1 ? item.icon : require(`@/static/${[THEME_NAME]}/menu/${item.icon}.png`)">
                            </image>
                            <view class="menu-title">{{ item.configName }}</view>
                        </view>
                    </view>
                </template>
            </view>
        </view>
        <uniPop ref="rzModal"></uniPop>
        <middle-box :current-page="4" ref="child"></middle-box>
        <custom-modal ref="customModal"></custom-modal>
    </view>
</template>

<script>
import commLogic from '@/js/comm-logic';
import util from '../../js/utils';
import { menu } from '../../js/menu'
import { getAppByCode, GetMemberInfoByMemberId, selectTboMemberInfo,getCompanyConfig } from '../../service/community';
import { mapMutations } from 'vuex'
import { savePageTitle } from '@/js/router/router-utils'
import tabBarFun from '../../js/utils/tabBarCommon'
import MiddleBox from '@/components/middle/middle-box.vue';
import { unit } from 'postcss-value-parser';

export default {
    components: {
        'middle-box': MiddleBox,
    },
    data() {
        return {
            areaId: '',
            projectId: '',
            memberId: '',
            nickname: '',
            headimg: '',
            isAssociation: 0,
            token: '',
            userType: '游客',
            menuList: [],
            phoneNumber: '',
            list: [{
                name: '我的房产/家人',
                id: "1"
            },
            {
                name: '我的企业',
                id: "6"
            },
             {
                name: '物业报事报修',
                id: "2"
            }, {
                name: '物业投诉建议',
                id: "3"
            }, {
                name: '我的订单',
                id: "4"
            }, {
                name: '我的功能',
                id: "5"
            }, {
                name: '我的钱包',
                id: "7"
            }],
            authType:[],
            userTypeNum:'',
            showFWQY:Number
        };
    },
    methods: {
        ...mapMutations({
            catchTabbarPagePath: 'catchTabbarPagePath'
        }),
        // 授权登录
        phoneAuth() {
            const { PROGRAM_TYPE } = this.$appConfig;
             if (!this.phoneNumber) {
                if(PROGRAM_TYPE == 'wechat' || PROGRAM_TYPE == 'appH5'){
                    uni.navigateTo({ url: '/pages-a/authorization/bindingMobile' });
                    return false
                }else{
                    uni.navigateTo({ url: '/pages-a/authorization/bindingMobile' });
                    return false
                } 
            }

            return true
        },
        menuJump(item) {
             // item.auth=='1'表示需要去授权
            const { PROGRAM_TYPE } = this.$appConfig;
 
            if (!this.phoneNumber && item.auth == '1') {
                if(PROGRAM_TYPE == 'wechat' ||  PROGRAM_TYPE == 'appH5'){
                    uni.navigateTo({ url: '/pages-a/authorization/bindingMobile' });
                    return
                }else{
                    uni.navigateTo({ url: '/pages-a/authorization/bindingMobile' });
                    return
                } 
            }


            if ((this.isAssociation == '0' && item.registered) || (this.isAssociation == '-1' && item.registered)) {
                if (!item.page && !item.url) {
                    this.$refs.customModal.show({
                        title: '提示',
                        content: '此功能暂未开放，敬请期待~',
                        showConfirmButton: true,
                        confirmText: "好的",
                    })
                    return
                } else if(item.detailCode != 'enterpriseAuth' && item.detailCode != 'houseManage'){
                switch(this.showFWQY){
                    case 0:
                    // this.$refs.customModal.show({
                    //          title: '提示',
                    //          content: '请选择房屋认证或企业认证',
                    //          showConfirmButton: true,
                    //          confirmText: "确认",
                    //     }) 
                    this.$refs.rzModal.showModal({ modalType: 'rz' });
                    this.$refs.rzModal.showCompanyConfig();
                       break;
                    case 1:
                    this.$refs.customModal.show({
                          title: '提示',
                          content: '您还未认证，请先去认证',
                          showConfirmButton: true,
                          showCancelButton: true,
                           confirmText: "去认证",
                           cancelText: '取消',
                           onConfirm: () => {
                               uni.navigateTo({url:'/pages-b/house-info/add-house-address'})
                        }
                     })
                        break;
                    case 2:
                    this.$refs.customModal.show({
                          title: '提示',
                          content: '您还未认证，请先去认证',
                          showConfirmButton: true,
                          showCancelButton: true,
                           confirmText: "去认证",
                           cancelText: '取消',
                           onConfirm: () => {
                               uni.navigateTo({url:'/pages-d/enterprise-info/join-company'})
                        }
                     })
                        break;
                    default:
                        break;
                }
                return
                }
            }
            if (!item.page && !item.url) {
                this.$refs.customModal.show({
                    title: '提示',
                    content: '此功能暂未开放，敬请期待~',
                    showConfirmButton: true,
                    confirmText: "好的",
                })
                return;
            }
            const { USER_TYPE_NUM } = this.$constant
            let userTypesNum = util.storageAction({ key: USER_TYPE_NUM, action: 'get' });
            let houseInvite = [4,6] //企业联系人，企业员工无房屋房产
            // console.log(313,this.isAssociation,houseInvite.includes(userTypesNum),item.detailCode)
            if(this.isAssociation != 0 && (item.detailCode =='familyManage' || item.detailCode =='inviteFamilyOrTenant') && houseInvite.includes(userTypesNum)) {
                this.$refs.customModal.show({
                        title: '提示',
                        content: '您还未房屋认证，请先去认证',
                        showConfirmButton: true,
                        showCancelButton: true,
                        confirmText: "去认证",
                        cancelText: '取消',
                        onConfirm: () => {
                            uni.navigateTo({ url: '/pages-b/house-info/add-house-address' })
                        }
                    })
                    return;
             }
             let enterpriseInvite = [1,2,3,5]//房屋身份，无企业房产
            // console.log(329,this.isAssociation,enterpriseInvite.includes(userTypesNum),item.detailCode)
             if(this.isAssociation != 0 &&(item.detailCode =='myStaff' || item.detailCode =='inviteStaff')  && enterpriseInvite.includes(userTypesNum)) {
                this.$refs.customModal.show({
                        title: '提示',
                        content: '您还未企业认证，请先去认证',
                        showConfirmButton: true,
                        showCancelButton: true,
                        confirmText: "去认证",
                        cancelText: '取消',
                        onConfirm: () => {
                            uni.navigateTo({ url: '/pages-d/enterprise-info/join-company' })
                        }
                    })
                    return;
             }

              // 判断身份是否可以使用--邀请家人（业主专属）和邀请员工（企业联系人）
               if(item.userTypeNum && this.phoneNumber){
                const { USER_TYPE_NUM } = this.$constant
                let userTypesNum = util.storageAction({ key: USER_TYPE_NUM, action: 'get' }); 
                let houserUser = [2,10,14]
                let enterpriseUser = [4,9,10,11,12]
                if(!houserUser.includes(userTypesNum) && item.detailCode =='inviteFamilyOrTenant') {
                    if(!item.userTypeNum.includes(userTypesNum)){
                    this.$refs.customModal.show({
                    title: '提示',
                    content: '此功能为业主专享功能~',
                    showConfirmButton: true,
                    confirmText: "好的",
                     })
                    return;
                   }
                }
                if(!enterpriseUser.includes(userTypesNum) && item.detailCode =='inviteStaff'){
                    this.$refs.customModal.show({
                    title: '提示',
                    content: '此功能为企业联系人专享功能~',
                    showConfirmButton: true,
                    confirmText: "好的",
                     })
                    return;
                }
            }

            if (item.isTabbar) {
                uni.switchTab({ url: item.page })
            } else {
                if (item.url) {
                    uni.navigateTo({
                        url: `/pages-d/webview/webview?url=${encodeURIComponent(item.url)}`
                    })
                } else {
                    item.configName && savePageTitle({ title:item.title || item.configName })
                    uni.navigateTo({ url: item.page });
                }
            }
        },
      async  init() {
       await  tabBarFun.setIdentity() //获取用户角色
       await  tabBarFun.isJoinEnterprise() //获取用户认证状态
            this.myInformation();
            this.GetMemberInfoByMemberId();
            this.getMenuConfig();
            this.showCompanyConfig();
           
        },
        // 获取用户信息
    async    getProfile() {
            const { MEMBER_ID } = this.$constant;
            const memberId = util.storageAction({ key: MEMBER_ID, action: 'get' });
            const args = {
                pathParams: `/${memberId}`,
                hideLoading: true,
            };
       await     selectTboMemberInfo(args).then((res) => {
                if (res.success) {
                    const { nickname, headimg ,isAssociation} = res.data;
                   const { MEMBER_ID, AREA_ID, PROJECT_ID, USER_TYPE, O_USER_INFO, IS_ASSOCIATION } = this.$constant;
                    this.nickname = nickname;
                    this.headimg = headimg;
                   util.storageAction({ key: IS_ASSOCIATION, action: 'set', value: isAssociation });
                }
            });
        },
        myInformation() {
            //   个人信息
            let that = this;
            let { O_USER_INFO, IS_ASSOCIATION, TOKEN } = that.$constant;
            let { nickname, STRG_headImg, phoneNumber } = util.storageAction({ key: O_USER_INFO, action: 'get' });
            that.isAssociation = util.storageAction({ key: IS_ASSOCIATION, action: 'get' });
            that.token = util.storageAction({ key: TOKEN, action: 'get' });
            // that.nickname = nickname;
            // that.headimg = STRG_headImg;
            this.phoneNumber = phoneNumber
        },
        GetMemberInfoByMemberId() {
            let self = this
            let { MEMBER_ID, O_USER_INFO } = this.$constant;
            this.memberId = util.storageAction({ key: MEMBER_ID, action: 'get' });
            let params = {
                data: {
                    id: `/${this.memberId}`,
                },
                hideLoading: true,
            };
            GetMemberInfoByMemberId([this.memberId], params, "我的", "验证当前用户认证类型失败").then(res => {
                // console.log(288,res)
                //   self.hideLoading();
                //判断网络报错或者网络超时状态
                //   networkStartType(res);
                //   if(res.token_code=='-1'||res.token_code=='-2'){
                //     tokenCheck(res.token_code,res.code);
                //     return
                //   }
                if (res.status === '200') {
                    let { headimg, nickname, fullName, sex, birthDay, phoneNumber } = res.data
                     this.nickname = nickname;
                    this.headimg = headimg;
                    this.phoneNumber = phoneNumber
                    this.form = {
                        headImg: headimg || '',
                        nickname: nickname || '',
                        realName: fullName || '',
                        sex: sex || '',
                        birthday: birthDay || '',
                        phone: phoneNumber || '',
                    };
                    const { O_USER_INFO } = this.$constant;
                    const userInfo = commLogic.setOwerUserInfo('profile', this.form)
                    util.storageAction({ key: O_USER_INFO, action: 'set', value: userInfo });
                 }
            });

        },
        //动态增加分组
        dynamicallyAddinGroups(arr){
          this.list = [{
                name: '我的房产/家人',
                id: "1"
            },
            {
                name: '我的企业',
                id: "6"
            },
             {
                name: '物业报事报修',
                id: "2"
            }, {
                name: '物业投诉建议',
                id: "3"
            }, {
                name: '我的订单',
                id: "4"
            }, {
                name: '我的功能',
                id: "5"
            }, {
                name: '我的钱包',
                id: "7"
            }]
          // 获取所有第三方分组名称
          let allName = []
          arr.map(item=>{
            if(item.detailCode.indexOf('tionalFea') > -1){
              allName.push(item.groupName)
            }
          })
          allName = [...new Set(allName)]
          allName.map((item,index)=>{
            if(!this.isHasThatCon(item)){
                this.list.push({name:item,id:(index+8)+''})
            }
          })
          console.log(this.list,'list========')
        },
        //判断是否已存在
        isHasThatCon(title){
            let flag = false
            this.list.map(item=>{
                if(item.name == title){
                    flag = true
                }
            })
            return  flag
        },
        //动态给新数组排序,按新的分组
        dynamicallyAddSort(list){
          list.map(item=>{
            this.list.map(tab=>{
              if(item.groupName == tab.name){
                item.mine = tab.id
              }
            })
          })
          console.log(list,'list============')
          return list
        },
        getMenuConfig() {
            let that = this;
            var params = {
                data: {
                    configCode: "minePage",
                    projectId: that.projectId,
                    memberId: that.memberId
                },
                hideLoading: true
            }
            getAppByCode(params).then(res => {
                if (res.statusCode == 200) { 
                    let configDesc = res.data.configDesc;
                    // let configDesc = [];  
                    // 默认菜单
                    var defaultMenu = [
                        { detailCode: 'houseManage' },
                        { detailCode: 'inviteFamilyOrTenant' },
                        { detailCode: 'familyManage' }]
                    if (!configDesc || configDesc.length == 0) {
                        configDesc = defaultMenu;
                    } else {
                        let bx = [];
                        configDesc.forEach(item => {
                            if (item.detailCode == 'myRepair' || item.detailCode == 'mySuggest') {
                                bx.push({ detailCode: item.detailCode + '-wwc' }, { detailCode: item.detailCode + '-ywc' })
                            }
                        })
                        configDesc = configDesc.concat(bx);
                    }
                    // #ifdef APP-PLUS  
                    configDesc.push({ detailCode: 'set' })
                    // #endif 
                    this.dynamicallyAddinGroups(configDesc)
                    configDesc = this.dynamicallyAddSort(configDesc)

                    let showMenu = util.intersection(configDesc, menu, 'detailCode',true,'minePage');
                    let setMenu = [];
                    configDesc.forEach(item => {
                        setMenu[item.detailCode] = item.configName;
                    }) 
                    showMenu.forEach(item => {
                        item.configName = setMenu[item.detailCode] ? setMenu[item.detailCode] : item.configName;
                    })
                    var responseObj = that.arrayGroupBy(showMenu, 'mine');
                     that.menuList = responseObj

                }
            })
        },
        arrayGroupBy(list, groupId) {
            let groups = {};
            list.forEach(item => {
                let group = item[groupId];
                groups[group] = groups[group] || [];
                if(item.detailCode == 'bWallet'){
                    if(this.userTypeNum == 9 || this.userTypeNum == 10){
                        groups[group].push(item)
                    }
                }else{
                    groups[group].push(item)
                }
            })
            console.log(433,list)

            return groups;
        },
        editProfile() {
            savePageTitle({ title:'个人信息' })

            const isAuth = this.phoneAuth()
            if (!isAuth) return

            uni.navigateTo({ url: '/pages-a/profile/profile' })
        },
        async  showCompanyConfig() { 
            const {COMPLANY_ID , O_USER_INFO} = this.$constant
            this.companyId = util.storageAction({ key: COMPLANY_ID, action: 'get' })
            const { companyId} = util.storageAction({ key: O_USER_INFO, action: 'get' });
             var params = {
                data:{
                    companyId: this.companyId || companyId,
                }
             };
           getCompanyConfig(params).then(result=>{ 
               if (result.status == 200) {
                this.authTypes= result.data.authType ? JSON.parse(result.data.authType).filter(f => { return f != '' }) : [];
                this.authTypes.forEach(item=>{ 
                   let val = item ? parseInt(item) : 0
                   if(this.authTypes.length==1){
                     switch(val){
                      case 1:
                         this.showFWQY = val;
                        break
                       case 2:
                       this.showFWQY = val;
                         break;
                       default :
                       break;
                     }
                  }
                  if(this.authTypes.length==2){
                       this.showFWQY = 0;
                  }
               })
               }else{
                 this.showFW = 0; 
               }
     });
    },
    },
     async onShow(e) {
        // 保存跳转商城tabbar前的页面
        this.catchTabbarPagePath('/pages/mine/mine');
        const { MEMBER_ID, AREA_ID, PROJECT_ID, USER_TYPE, O_USER_INFO, IS_ASSOCIATION } = this.$constant;
        this.memberId = util.storageAction({ key: MEMBER_ID, action: 'get' });
        this.areaId = util.storageAction({ key: AREA_ID, action: 'get' });
        this.projectId = util.storageAction({ key: PROJECT_ID, action: 'get' });
        await   this.init();
        await   this.getProfile()
        this.userType = util.storageAction({ key: USER_TYPE, action: 'get' });
        const isAssociations = util.storageAction({ key: IS_ASSOCIATION, action: 'get' });
        const { phoneNumber ,isAssociation } = util.storageAction({ key: O_USER_INFO, action: 'get' });
        let isAssociationss = isAssociations || isAssociation
        //未认证，有手机号码的，就是会员
        // if ((isAssociationss == '0' || isAssociationss == '-1') && phoneNumber) {
        //     this.userType = '会员'
        // }

        // const { O_USER_INFO } = that.$constant;
        // const { headimg } = util.storageAction({ key: O_USER_INFO, action: 'get' });
        // this.headimg = headimg
        // this.init();
        // this.getProfile()
    },
    onLoad(){
        const { MEMBER_ID, AREA_ID, PROJECT_ID, USER_TYPE, O_USER_INFO, IS_ASSOCIATION,USER_TYPE_NUM } = this.$constant;
        this.userTypeNum = util.storageAction({ key: USER_TYPE_NUM, action: 'get' });
        this.userType = util.storageAction({ key: USER_TYPE, action: 'get' });
        const isAssociations = util.storageAction({ key: IS_ASSOCIATION, action: 'get' });
        const { phoneNumber ,isAssociation } = util.storageAction({ key: O_USER_INFO, action: 'get' });
        let isAssociationss = isAssociations || isAssociation
        //未认证，有手机号码的，就是会员
        // if ((isAssociationss == '0' || isAssociationss == '-1') && phoneNumber) {
        //     this.userType = '会员'
        // }
    }
};
</script>
