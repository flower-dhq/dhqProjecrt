import {debounce} from "@/js/utils";

/**
 * 异步保存数据到缓存中
 */
const setStorage = (key,value,successCb,errCb) => {
    uni.setStorage({
        key: key,
        value: value,
        success: function (res) {
            console.log(`${key}保存成功`);
            if(successCb){
                successCb(res);
            }
        },
        fail: function (res) {
            console.log(`${key}保存失败，失败原因`,res);
            if(errCb){
                errCb(res);
            }
        }
    })
}

/**
 * 同步保存数据到缓存中
 */
const setStorageSync = (key,value) => {
    try {
        uni.setStorageSync(key, value);
        console.log(`${key}保存成功`);
        return {'data':1,'status':200,'msg':`${key}保存成功`}
    } catch (e) {
        console.log(`${key}保存失败，失败原因`,e);
        return {'data':0,'status':-1,'msg':`${key}保存失败，失败原因:${JSON.stringify(e)}`}
    }
}

/**
 * 异步查询缓存中的数据
 */
const getStorage = (key,successCb,errCb) => {
    uni.getStorage({
        key: key,
        value: value,
        success: function (res) {
            console.log(`${key}查询到的信息`,res);
            if(successCb){
                successCb(res);
            }
        },
        fail: function (res) {
            console.log(`${key}查询信息，失败原因`,res);
            if(errCb){
                errCb(res);
            }
        }
    })
}

/**
 * 同步查询缓存中的数据
 */
const getStorageSync = (key) => {
    try {
        const value = uni.getStorageSync(key);
        if (value) {
            console.log(`${key}查询到的信息为`,value);
            return {'data':value,'status':200,'msg':'查询成功'};
        }else{
            console.log(`${key}查询不到信息`);
            return {'data':null,'status':-1,'msg':`${key}查询不到信息`};
        }
    } catch (e) {
        console.log(`${key}查询报错`,e);
        return {'data':null,'status':-1,'msg':`${key}查询报错，报错信息：${JSON.stringify(e)}`};
    }
}

/**
 * 异步查询缓存Storage 的相关信息
 */
const getStorageInfo = (successCb,errCb) => {
    uni.getStorageInfo({
        success: function (res) {
            console.log(`当前缓存信息信息为`,res);
            if(successCb){
                successCb(res);
            }
        },
        fail: function (res) {
            console.log(`当前缓存信息查询报错`,res);
            if(errCb){
                errCb(res);
            }
        }
    });
}

/**
 * 同步查询缓存Storage 的相关信息
 */
const getStorageInfoSync = () => {
    try {
        const res = uni.getStorageInfoSync();
        console.log(`当前缓存信息信息为`,res);
        return {'data':res,'status':200,'msg':'查询成功'};
    } catch (e) {
        console.log(`当前缓存信息查询报错`,e);
        return {'data':null,'status':-1,'msg':`缓存信息查询报错，报错信息${JSON.stringify(e)}`};
    }
}

/**
 * 异步删除缓存中的数据
 */
const removeStorage = (key,successCb,errCb) => {
    uni.removeStorage({
        key: key,
        success: function (res) {
            console.log(`从缓存中删除${key}成功`)
            if(successCb){
                successCb(res);
            }
        },
        fail: function (res) {
            console.log(`从缓存中删除${key}失败`,res)
            if(errCb){
                errCb(res);
            }
        }
    });
}

/**
 * 同步删除缓存中的数据
 */
const removeStorageSync = (key) => {
    try {
        uni.removeStorageSync(key);
        console.log(`从缓存中删除${key}成功`)
        return {'data':null,'status':200,'msg':`${key}清除成功`};
    } catch (e) {
        console.log(`从缓存中删除${key}失败`,e)
        return {'data':null,'status':-1,'msg':`${key}清除失败,报错信息${JSON.stringify(e)}`};
    }
}

/**
 * 异步清除缓存
 */
const clearStorage = (successCb,errCb) => {
    uni.clearStorage();
    console.log(`清除缓存成功`);
    if(successCb){
        successCb();
    }
}

/**
 * 同步清除缓存
 */
const clearStorageSync = () => {
    try {
        uni.clearStorageSync();
        console.log(`清除缓存成功`)
        return {'data':null,'status':200,'msg':`缓存清除成功`};
    } catch (e) {
        console.log(`清除缓存失败`,e)
        return {'data':null,'status':-1,'msg':`缓存清除失败，失败原因${JSON.stringify(e)}`};
    }
}

export default {
    setStorage,
    setStorageSync,
    getStorage,
    getStorageSync,
    getStorageInfo,
    getStorageInfoSync,
    removeStorage,
    removeStorageSync,
    clearStorage,
    clearStorageSync
};