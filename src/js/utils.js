import commLogic from '@/js/comm-logic';

const getAppConfig = () => {
  // 优先取node 环境变量，若不使用npm run script，直接执行原本uni-app命令， 需要执行npm run switch切换项目配置
  return (process.env.VUE_APP_CONFIG && JSON.parse(process.env.VUE_APP_CONFIG)) || require('../app-config/env.json') || {};
};

// 判断是否对象
const paramIsObject = (param) => typeof param === 'object' && param !== null && !Array.isArray(param);

/**
 * @description: 格式化时间
 * @param {object} params{value: 要转换时间值(时间格式、时间戳), type: 转换类型，d(时间格式) s(时间戳), d -> s, s -> d, d -> d, format: 时间格式YY-MM-DD}
 * @return {string | number}
 */
const formatDate = (params) => {
  const valueString = typeof params.value === 'string' ? params.value.replace(/-/g, '/') : params.value;
  let Y, M, D, h, m, s;
  let date = params.type === 'd2s' ? new Date(valueString).getTime() : params.type === 's2d' ? new Date(valueString) : params.type === 'd2d' ? new Date(new Date(valueString).getTime()) : new Date();
  if (params.type === 'd2s') return date;
  Y = date.getFullYear();
  M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
  D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
  m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
  s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
  return params.format === 'YY-MM-DD' ? `${Y}-${M}-${D}` : params.format === 'YY-MM-DD h:m' ? `${Y}-${M}-${D} ${h}:${m}` : params.format === 'h:m' ? `${h}:${m}` : `${Y}-${M}-${D} ${h}:${m}:${s}`;
};

/**
 * @description: 存储localstoage，云环境会存在键名冲突问题，
 * @param {*} params：{action: 'get：获取，set：存储， remove：删除', key: '键名', value: '存储值'}
 * @return {*}
 */
const storageAction = (params) => {
  const { action, key, value } = params || {};
  const { projectType } = commLogic.getProjectConfig();
  const storeKey = `APP_${key}_${projectType}`; // 云环境多个项目共用一套代码一个环境，通过projecType区分键名；
  let data = null;
  try {
    if (action === 'get') data = uni.getStorageSync(storeKey);
    if (action === 'set') uni.setStorageSync(storeKey, value);
    if (action === 'remove') uni.removeStorageSync(storeKey);
  } catch (e) { }
  return data;
};

/**
 * @description: 两个对象数组取交集 
 * @param {object} arr1，arr2对象数组 
 * @param {string} id  需要对比的属性名称
 * @param {Boolean} flag 是否需要按arr1排序
 * @return {Array} 返回arr2中的数据
 */

 const intersection = (arr1, arr2, id, flag = true,type) => {
  if(type == 'wyAuthModules' || type == 'paymentAuthModules' || type == 'minePage'){
    // arr1 = addDynamicRes(arr1)//接口增加动态code
    arr2 = addDynamic(arr1,arr2)//本地增加动态菜单
  }
  // console.log(arr1,arr2,'showMenu=====================arrshowMenu=====================arr')
  let arr = arr1.map((item) => {
    return item[id];
  });
  // console.log(arr2,'showMenu=====================arr')
  if (!flag) {
    let newArray = arr2.filter(item => {
      return arr.includes(item[id])
    })
    return newArray
  } else {
    let newArray = new Array(arr.length);
    arr2.forEach(element => {
      if (arr.includes(element[id])) {
        let index = arr.findIndex(item => item == element[id]);
        newArray[index] = (element);
      }
    });

    return newArray.filter(f => { return f });
  }

};

/**
 * @description: 动态添加第三方增加的按钮
 * @return {string}
 */
const addDynamicRes = (arr1) => {
  arr1.map(item=>{
    if(item.detailCode=='tionalFea'){
      item.detailCode = item.detailCode+(item.configId+'')
    }
  })
  return arr1
};

/**
 * @description: 动态添加第三方增加的按钮
 * @return {string}
 */
const addDynamic = (arr1,arr2) => {
  let list = arr1.filter(item=>item.detailCode.indexOf('tionalFea') > -1)
  if(list.length > 0){
    list.map(getResData=>{
      let newItem = {
        configName: getResData.detailName,
        detailCode: getResData.detailCode,
        icon: getResData.imgUrl,
        auth: '',
        mine: getResData.mine?getResData.mine:'',
        service: getResData.service?getResData.service:'',
        // page: getResData.configUrl,
        registered: false,//是否注册
        // url:'', //小程序目标页面
      }
      if(getResData.linkType == 3){
        newItem.url = getResData.configUrl
        newItem.appId = getResData.appId
        newItem.originalId = getResData.originalId
      }else if(getResData.linkType == 2){
        newItem.url = getResData.configUrl
      }else{
        newItem.page = getResData.configUrl
      }
      if(!removal(arr2,newItem.detailCode)){
        arr2.push(newItem)
      }
    })
  }
  console.log(list,'showMenu=====================')
  return arr2
};

/**
 * @description: 避免重复push
 * @return {string}
 */
const removal = (list,key) => {
  let isRper =false
  list.map(item=>{
    if(item.detailCode==key){
      isRper = true
    }
  })
  return isRper
};

/**
 * @description: 数据拼接回去
 * @return {string}
 */
const backMenuData = (ritem,arr) => {
  let getResData = arr.filter(item=>item.detailCode == 'tionalFea')[0]
  // console.log('showMenus99999999999999999999',getResData)
  let newItem = {
    configName: getResData.detailName?getResData.detailName:'随便功能',
    detailCode: 'tionalFea',
    icon: getResData.imgUrl,
    auth: '',
    mine: '',
    service: "",
    // page: getResData.configUrl,
    registered: false,//是否注册
    // url:'', //小程序目标页面
  }
  if(getResData.linkType == 3){
    newItem.url = getResData.url
    newItem.appId = getResData.appId
    newItem.originalId = getResData.originalId
  }else if(getResData.linkType == 2){
    newItem.url = getResData.url
  }else{
    newItem.page = getResData.configUrl
  }
  // console.log('showMenushowMenushowMenushowMenushowMenu',newItem)
  return newItem
};

/**
 * @description: 生成uuid
 * @return {string}
 */
const uuid = () => {
  var s = [];
  var hexDigits = '0123456789abcdef';
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = '-';

  var uuid = s.join('');
  return uuid;
};

/**
 * 获取类型
 */
function kindOf(val) {
  const str = Object.prototype.toString.call(val)
  return str.replace(/\[[a-z]+\s([a-z]+)\]/i, '$1').toLocaleLowerCase()
}

/**
 * 判断是否为 null 或者 undefined
 */
function isEmpty(val) {
  const type = kindOf(val)
  return ['null', 'undefined'].includes(type)
}

/**
 * 用于GET请求，拼接url和参数
 */
function spliceGetUrl(url = '', data = {}) {
  const [pathTmp, queryStr] = url.split('?')
  let queryObj = {}

  if (queryStr) {
    queryObj = queryStr.split('&').reduce((store, item) => {
      const [key, value] = item.split('=')
      store[key] = value
      return store
    }, {})
  }
  data = Object.assign({}, queryObj, data)

  const res = Object.entries(data).map(([key, value]) => isEmpty(value) ? key + '=' : `${key}=${value}`).join('&')
  return res ? pathTmp + '?' + res : pathTmp
}

//乘
const floatMul = (arg1, arg2) => {
  var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
  try { m += s1.split(".")[1].length } catch (e) { }
  try { m += s2.split(".")[1].length } catch (e) { }
  return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}

/**
 * 获取多少天后的日期
 * @param {number} date 天数
 * @param {'forward'|'back'} direction forward：往前数多少天；back：往后数多少天
 */
function getFutureDate(date, direction, type) {
  direction = direction || 'back'
  date = date || 0
  
  const curDate = new Date()
  let mdate = curDate.getDate()

  mdate = direction === 'forward' ? mdate - date : direction === 'back' ? mdate + date : mdate
  curDate.setDate(mdate)

  return curDate
}

// 校验手机号码
const checkPhone = (value) => {
  return /^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(value);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
}

// 校验身份证号码
const checkIDNumber = (value) => {
  return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value);
}

/**
 * 获取页面路由参数
 * @returns {object}
 */
function getPageQuery() {
  return Promise.resolve().then(() => {
    const routes = getCurrentPages()
    let currentPage = routes[routes.length - 1]

    return currentPage?.$route?.query || currentPage?.options || {}
  })
}

export default {
  paramIsObject,
  formatDate,
  getAppConfig,
  storageAction,
  intersection,
  uuid,
  spliceGetUrl,
  floatMul,
  getFutureDate,
  checkPhone,
	checkIDNumber,
  kindOf,
  getPageQuery
};
