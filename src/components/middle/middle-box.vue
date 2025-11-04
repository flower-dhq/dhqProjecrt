<style scoped>
view {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
}

.tabbar-container {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    /* height: 100rpx; */
    /* box-shadow: 0 0 5px #999; */
    /* dadbde */
    display: flex;
    align-items: center;
    padding: 8rpx 0;
    /* color: #999999; */
    color: #737B91;
    background-color: #FFFFFF;
    height: 100rpx;
    font-size: 24rpx;
    border-top-style: solid;
    border-top-color: #F5F5F5;
    border-top-width: 16rpx;
}

.tabbar-container .tabbar-item {
    width: 33.33%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    color: #737B91;
}

.tabbar-container .center-item {
    display: block;
    position: relative;
}

.tabbar-container .tabbar-item .item-top {
    width: 44rpx;
    height: 44rpx;
    /* padding: 5rpx; */
}

.tabbar-container .center-item .item-top {
    flex-shrink: 0;
    width: 130rpx;
    height: 130rpx;
    position: absolute;
    top: -72rpx;
    left: calc(50% - 66rpx);
    border-radius: 50%;
    /* box-shadow: 0 0 5px #999;
      background-color: #FFFFFF; */
}

.tabbar-container .tabbar-item .item-top image {
    width: 100%;
    height: 100%;
}

.tabbar-container .tabbar-item .item-bottom {
    font-size: 24rpx;
    width: 100%;
    /* flex: 1;   */
    height: 42rpx;
    font-family: Arial, 'Microsoft YaHei', 'PingFangSC-Regular', 'Hiragino Sans GB', 'Droid Sans Fallback', 'WenQuanYi Micro Hei', sans-serif;
}

.tabbar-container .tabbar-item .item-bottom>text {
    vertical-align: middle;
}

.tabbar-container .center-item .item-bottom {
    position: absolute;
    bottom: 0;
    height: 42rpx;
}

.tabbar-container .item-active {
    color: var(--app-primary-color);
}

/* 适配iPhone X */
.IpxBot {
    padding-bottom: 30rpx !important;
}
</style>
<template>
    <view>
        <view class="tabbar-container" :class="isIpx ? 'IpxBot' : ''">
            <template v-for="(item, index) in showTabList">
                <view class="tabbar-item" v-if="item.isShow" :class="[item.centerItem ? 'center-item' : '']"
                    @click="changeItem(item)" :key="index">
                    <!-- <view class="item-top" :style="{ paddingBottom : item.id == 2 ? 0 :'10rpx' } " > -->
                    <view class="item-top">

                        <image :src="tabId == item.id ? item.selectIcon : item.icon" mode="aspectFit"></image>
                    </view>
                    <view class="item-bottom" :class="[tabId == item.id ? 'item-active' : '']">
                        <text> {{ item.text }}</text>
                    </view>
                </view>
            </template>
        </view>
        <custom-modal ref="customModal"></custom-modal>
    </view>
</template>

<script>
import util from '../../js/utils';
import tabBarFun from '../../js/utils/tabBarCommon'
import appConfig from '@/app-config';
export default {
    props: {
        currentPage: {
            type: Number,
            default: 0
        }
    },

    data() {
        const { IS_SHOW_DOOR } = this.$appConfig;
        const { DEFAULT_BAR_MENUS } = this.$constant;

        return {
            //适配IPhoneX
            isIpx: false,
            //底部Tab
            tabId: 0,
            tabList: [{
                id: 0,
                path: "/pages/index/index",
                icon: '/static/tabbar_home.png',
                selectIcon: '/static/theme-default/tabbar_home.png',
                text: "首页",
                centerItem: false,
                isShow: true,
                detailCode: 'index'
            }, {
                id: 5,
                path: "/pages-d/keyopen/selectOpenDoorType",
                icon: '/static/tabbar_door.png',
                selectIcon: '/static/theme-default/tabbar_home.png',
                text: "一键开门",
                centerItem: false,
                isShow: IS_SHOW_DOOR,
                detailCode: 'openDoor'
                //   isShow:false
            }, {
                id: 1,
                path: '/pages/service/service',
                icon: '/static/tabbar_service.png',
                selectIcon: '/static/theme-default/tabbar_service.png',
                text: '服务',
                centerItem: false,
                isShow: true,
                detailCode: 'wuyeHouseKeeper'
            }, {
                id: 3,
                path: '/pages/common/mall',
                icon: '/static/tabbar_mall.png',
                selectIcon: '/static/theme-default/tabbar_mall_y.png',
                text: '商城',
                centerItem: false,
                isShow: false,
                detailCode: 'shoppingMall'
            },
            {
                id: 4,
                path: '/pages/mine/mine',
                icon: '/static/tabbar_mine.png',
                selectIcon: '/static/theme-default/tabbar_mine.png',
                text: "我的",
                centerItem: false,
                isShow: true,
                detailCode: 'mine'
            }],
            memberId: '',
            projectId: '',
            isAssociation: 0,
            showTabList: util.storageAction({ key: DEFAULT_BAR_MENUS, action: 'get' }),

            wxMineInfo: {
                shop: {
                    currentApplet: ['wxc0f25fdbb36b57e2'],//当前小程序appId,需要跳转到商城小程序
                    jumpApplet: [{
                        applet: ['wxc0f25fdbb36b57e2'],//这个小程序 要跳转到一碑好物
                        appName: '一碑好物',
                        page: '/pages/index/index',
                        appId: 'wxca61b97190791539', //一碑好物APPID
                        envVersion: '',//要打开的小程序版本，有效值： develop（开发版），trial（体验版），release（正式版）。仅在当前小程序为开发版或体验版时此参数有效。如果当前小程序是正式版，则打开的小程序必定是正式版。
                    }],
                },
                // https://ebeitest-mp.wuyeface.com
                shopTest: {
                    currentApplet: ['wxfb0a5d7b3f8d7c43'],//当前小程序appId,需要跳转到商城小程序
                    jumpApplet: [{
                        applet: ['wxfb0a5d7b3f8d7c43'],//这个小程序 要跳转到一碑好物
                        appName: '一碑好物',
                        page: '/pages/index/index',
                        appId: 'wxc5236bebd2b90165', //一碑好物APPID
                        envVersion: '',//要打开的小程序版本，有效值： develop（开发版），trial（体验版），release（正式版）。仅在当前小程序为开发版或体验版时此参数有效。如果当前小程序是正式版，则打开的小程序必定是正式版。
                    }],
                },


            }
        };
    },
    mounted() {
        this.tabId = this.currentPage;
        //隐藏原生tab
        uni.hideTabBar();
        uni.$on('setNavbar', () => {
            this.showNarBar();
        });
        tabBarFun.getUserNarbar() //获取用户认证状态   

    },
    created() {
        // 判断为 iPhone X 给予底部距离
        // let that = this
        // uni.getSystemInfo({
        //     success: function(res) {
        //         if (res.model.indexOf('iPhone X') !== -1) {
        //             that.isIpx = true;
        //         }
        //     }
        // })
    },
    onLoad() {
        const { USER_TYPE, IS_ASSOCIATION } = this.$constant;
        const userType = util.storageAction({ key: USER_TYPE, action: 'get' });
        let isAssociation = util.storageAction({ key: IS_ASSOCIATION, action: 'get' });
        this.isAssociation = isAssociation
        console.log(183, this.this.isAssociation)
    },
    onShow() {
        this.init();
    },
    methods: {
        // 获取用户权限菜单
        showNarBar() {
            const { NAV_BAR_MENUS } = this.$constant;
            const menuList = util.storageAction({ key: NAV_BAR_MENUS, action: 'get' });
            if (menuList && menuList.length > 0) {
                let showDetailCode = [];
                let list = [];
                this.tabList.forEach(item => {
                    item.isShow = false;
                    menuList.forEach(menu=>{
                        if(menu.detailCode == item.detailCode){
                            item.isShow = true;
                            item.configUrl = menu.configUrl;
                            showDetailCode.push(item.detailCode);
                            list.push(item);
                        }
                    })
                    
                });
                if (this.showTabList) {
                    let defDetailCode = this.showTabList.map(m => { return m.detailCode });
                    if (defDetailCode.toString() != showDetailCode.toString()) {
                        const { DEFAULT_BAR_MENUS } = this.$constant;
                        util.storageAction({ key: DEFAULT_BAR_MENUS, action: 'set', value: this.tabList });
                        this.showTabList = this.tabList;

                    }
                } else {
                    const { DEFAULT_BAR_MENUS } = this.$constant;
                    util.storageAction({ key: DEFAULT_BAR_MENUS, action: 'set', value: this.tabList });
                    this.showTabList = this.tabList;
                }

            } else {
                this.showTabList = this.tabList;
            }

        },
        // 直接读本地

        // tab 切换
        changeItem(item) {
            /* #ifdef H5 */
            if(!!item.configUrl){
                window.location.href = item.configUrl;
            }
            /* #endif */
            tabBarFun.getUserNarbar();

            if (item.auth == '1') {
                //码上同行，需要授权
                const { O_USER_INFO } = this.$constant;
                const { phoneNumber } = util.storageAction({ key: O_USER_INFO, action: 'get' });
                if (!phoneNumber && item.auth == '1') {
                    uni.navigateTo({ url: '/pages-a/authorization/bindingMobile' });
                    return
                }
            }
            console.log(98, item)
            if (item.id == 3) {
                // #ifdef MP-WEIXIN
                console.log('准备打开小程序')
                uni.navigateToMiniProgram({
                    appId:"wx93f539e1620164e6",// 第三方小程序appid
                    path:"",// 
                    envVersion:"release",
                    success: res => {
                        // 打开成功
                        console.log("打开成功", res);
                    },
                    fail: err => {
                        console.log("打开失败",err);
                    }
                })
                // #endif

            } else if (item.id == 2) {
                const { USER_TYPE, IS_ASSOCIATION } = this.$constant;
                const userType = util.storageAction({ key: USER_TYPE, action: 'get' });
                let isAssociation = util.storageAction({ key: IS_ASSOCIATION, action: 'get' });
                this.isAssociation = isAssociation
                // if ( this.isAssociation =='0' && item.registered) {
                if (this.isAssociation == '0') {
                    this.$refs.customModal.show({
                        title: '提示',
                        content: '您还未认证，请先去认证',
                        showConfirmButton: true,
                        showCancelButton: true,
                        confirmText: "去认证",
                        cancelText: '取消',
                        onConfirm: () => {
                            uni.navigateTo({ url: '/pages-b/house-info/add-house-address' })
                        }
                    })
                } else {
                    uni.switchTab({
                        url: item.path,
                    });
                }
            } else if (item.id == 5) {
                uni.navigateTo({ url: item.path })
            } else {
                uni.switchTab({
                    url: item.path,
                });
            }
        },

        init() {
            const { USER_TYPE, IS_ASSOCIATION } = this.$constant;
            const userType = util.storageAction({ key: USER_TYPE, action: 'get' });
            let isAssociation = util.storageAction({ key: IS_ASSOCIATION, action: 'get' });
            this.isAssociation = isAssociation
            console.log(183, this.this.isAssociation)
            tabBarFun.setIdentity() //获取用户角色
            tabBarFun.isJoinEnterprise() //获取用户认证状态 

        },
        //   跳转小程序
        ToMiniProgram(item) {  
            // #ifdef MP-WEIXIN	
            // 需要在对应项目配置文件中的MANIFEST 填写appID
            var appid = uni.getAppBaseInfo().appId;
            if (item.currentApplet.includes(appid)) {
                let jumpApplet = item.jumpApplet;
                let applet = jumpApplet.filter(f => { return f.applet.includes(appid) })?.[0]; 
                if (applet) {
                    uni.navigateToMiniProgram({
                        appId: applet.appId,
                        path: applet.path,
                        extraData: {
                        },
                        success(res) {
                            // 打开成功
                        }
                    })
                } else {
                    uni.navigateTo({ url: '/pages-mall/index/index' })
                }
            }
            // #endif
            // #ifndef MP-WEIXIN	
            uni.navigateTo({ url: '/pages-mall/index/index' })
            //  #endif





        },
        //  跳转h5商城
        ToH5Program() {
            const { PROJECT_NAME, PROJECT_ID, TOKEN } = this.$constant;
            let pjNm = util.storageAction({ key: PROJECT_NAME, action: 'get' });
            const pjId = util.storageAction({ key: PROJECT_ID, action: 'get' });
            const authToken = util.storageAction({ key: TOKEN, action: 'get' });
            const [baseLink, page] = window.location.href.split('#') ||[];
            let { PROXY_PATH, DOMAIN_DEV, PROJECT_TYPE } = appConfig;
            // const backUrl = `${baseLink}@${page}`;
            // let backUrl = `${DOMAIN_DEV}/@${page}`;
            
            // 商城公众号 的返回按钮，配置 backUrl 可以返回到 业主端页面
            let backUrl = `${DOMAIN_DEV}/wechat/#/pages/index/index`;
            if (PROJECT_TYPE == '113' || PROJECT_TYPE == '105') {
               backUrl = `${DOMAIN_DEV}/uniwechat/#/pages/index/index`; 
            }
            pjNm = pjNm ? encodeURIComponent(pjNm) : ''
            backUrl = backUrl ? encodeURIComponent(backUrl) : ''
            let queryArgTmp = `?&authToken=${authToken}&` + (pjId && pjNm ? `pjId=${pjId}&pjNm=${pjNm}&` : '')
            let fullQueryArg = (queryArgTmp + 'backUrl=' + backUrl)
            
            let url = `${DOMAIN_DEV}/mall/#/${fullQueryArg}`
            console.log('h5==', pjNm, pjId, authToken, backUrl, DOMAIN_DEV, url)
            console.log('url===', url)
            window.location.href = url
        }
    }
}
</script>
