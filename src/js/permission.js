let whiteList = [
    '/pages/index/index',
    '/pages-kanban/kanban/index',
    '/pages-a/auth'

] //白名单

//待办和公告
let todoTask=[
    '/pages-todoTask/todo-task/todoTask',
    '/pages-todoTask/system-notice/systemNotice',
    '/pages-todoTask/system-notice/mySystemNotice',
    '/pages-todoTask/system-notice/noticeDetail'
]

import Vue from 'vue';

import constant from '@/js/constant';
import utils from '@/js/utils';
import { staffLogin } from '@/service/wechatguanjia';
const { COMPILATION_ENV = {} } = utils.getAppConfig()
const { module = '' } = COMPILATION_ENV
const { uniPlatform } = uni.getSystemInfoSync();
const isOvertimePushed = module.includes('KANBAN') && uniPlatform == 'web'

if (isOvertimePushed) whiteList = whiteList.concat(todoTask)

export default function () { 
    const list = ['navigateTo', 'redirectTo', 'reLaunch']
    list.forEach(item => {
        uni.addInterceptor(item, {
            invoke(args) {
                // 去除参数便于判断
                let path = args.url.split('?')[0];
                // 根据缓存中的isAuth条件判断是否授权  
                // 无值或者0 未授权  1已授权
                const { IS_AUTH } = constant;
                const auth = utils.storageAction({ key: IS_AUTH, action: 'get' });
                // #ifdef MP-WEIXIN
                const res = wx.getSystemInfoSync();
                if (res.environment) {
                    whiteList = [];
                }
                // #endif 
                if ((!auth || auth == 0) && whiteList.indexOf(path) === -1) {
                    // #ifdef MP-WEIXIN
                    const res = wx.getSystemInfoSync()
                    if (res.environment) {
                        console.log('企微');
                        wx.qy.login({
                            success: function (res) {
                                if (res.code) {
                                    const { COMPLANY_ID } = Vue.prototype.$appConfig;

                                    var params = {
                                        data: {
                                            code: res.code,
                                            companyId: COMPLANY_ID,
                                            type: 'mini',
                                            agentName: ''
                                        },
                                        hideLoading: true,
                                        responseToast: false,
                                    }
                                    staffLogin(params).then(res => {
                                        if (res.status == 200) {
                                            const { IS_AUTH, TOKEN, O_USER_INFO } = constant;
                                            utils.storageAction({ key: IS_AUTH, action: 'set', value: '1' });
                                            utils.storageAction({ key: TOKEN, action: 'set', value: res.data.token });
                                            utils.storageAction({ key: O_USER_INFO, action: 'set', value: res.data });
                                            return args;
                                        }
                                    })
                                } else {
                                    console.log('登录失败！' + res.errMsg)
                                    return false;

                                }
                            }
                        });
                    } else {
                        if (process.env.NODE_ENV == 'development') {
                            return args
                        } else {
                            uni.navigateTo({
                                url: `/pages-a/auth`
                            })
                            return false;
                        }
                    }
                    // #endif   
                    // 钉钉小程序授权                    
                    // #ifdef MP-DINGTALK
                    dd.getAuthCode({
                        success: function (res) {
                            console.log('钉钉登录', res);
                            const { COMPLANY_ID } = Vue.prototype.$appConfig;

                            var params = {
                                data: {
                                    code: res.code,
                                    companyId: COMPLANY_ID,
                                    // type: 'mini',
                                    agentName: 'dingaqcjh4mbvarfttui'
                                },
                                hideLoading: true,
                                responseToast: false,
                            }
                            staffLogin(params).then(res => {
                                if (res.status == 200) {
                                    const { IS_AUTH, TOKEN, O_USER_INFO } = constant;
                                    utils.storageAction({ key: IS_AUTH, action: 'set', value: '1' });
                                    utils.storageAction({ key: TOKEN, action: 'set', value: res.data.token });
                                    utils.storageAction({ key: O_USER_INFO, action: 'set', value: res.data });
                                    return args;
                                }
                            })
                        },
                        fail: function (err) {
                            console.log('登录失败！' + res.errMsg)
                            return false;
                        }
                    });
                    // #endif                    
                    // #ifdef H5
                    uni.navigateTo({
                        url: `/pages-a/auth`
                    })
                    return false;
                    // #endif   
                }
                return args
            },
            success(args) {

            },
            fail(err) {
                console.log('interceptor-fail', err)
            },
            complete(res) {
                console.log('interceptor-complete', res)
            }
        })
    })
}
