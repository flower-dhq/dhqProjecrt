import Vue from 'vue';
import utils from '@/js/utils';
import constant from '@/js/constant';
import defaultProps from '@/theme-skin/u-view-props';
import commLogic from '@/js/comm-logic';
const md5 = require('js-md5')
const { getAppConfig, storageAction, formatDate} = utils;
const { URL_PROJECT_TYPE, O_USER_INFO, PROJECT_TYPE,COMPLANY_ID} = constant;

/**
 * @description: 获取皮肤主题
 * @return {object} 返回主题对象
 */
const getThemeData = () => {
  const { THEME_NAME, IMG_BASE_URL, IMG_BASE_FOLDER} = getAppConfig();
  const themeClassName = THEME_NAME || 'theme-default';
  const themeName = THEME_NAME.replace(/^theme-/, '');
  const themeSkinModule = require(`@/theme-skin/${themeName}/index.js`);
  const themeCssVar = themeSkinModule?.default?.themeCssVar || {};
  const primaryColor = themeCssVar['--u-view-primary__theme-color'];
  const availablePrefix = typeof IMG_BASE_URL === 'string' && typeof IMG_BASE_FOLDER === 'string' && IMG_BASE_URL && IMG_BASE_FOLDER;
  const production = process.env.NODE_ENV === 'production';
  const imgBaseUrl = production && availablePrefix ? `${IMG_BASE_URL}/${IMG_BASE_FOLDER}` : ''
  // 小程序动态设置样式（顶部导航栏自定义相关）
  const isMini = process.env.VUE_APP_PLATFORM === 'mp-weixin';
  let topBarObj = {}
  if(isMini){
    const topBarH = getTopBarH()
    topBarObj = {
      position: 'relative',
      top: `${topBarH}px`
    }
  }
  
  return {
    THEME_CSS_VAR: themeCssVar, // 主题css变量
    THEME_NAME: themeClassName, // 主题类名
    THEME_COLOR: primaryColor, // 主色
    IMG_BASE_URL: '', //不使用线上图片
    // IMG_BASE_URL: imgBaseUrl, // 图片前缀，方便统一更换图片地址放到线上
    MINI_BAR:topBarObj, //需要重置顶部导航页面，动态设置页面与顶部的距离
  };
};

//获取导航组件高度
const getTopBarH=() => {
  let h = 0
  uni.getSystemInfo({
    success(res){
      h = res.statusBarHeight + 46;
    }
  })
  return h
}

/**
 * @description: 设置tabbar 仅设置图标及颜色
 * @return {*}
 */
const setTabbar = () => {
  const { THEME_COLOR } = getThemeData();
  const tabbarStyle = {
    selectedColor: THEME_COLOR,
  };

  // 初始化配置组件PROPS(主题颜色或者其他属性)
  uni.$u.setConfig({
    props: defaultProps({ primaryColor: THEME_COLOR }),
  });

  uni.setTabBarStyle(tabbarStyle);
};

/**
 * @description: 获取配置信息 projectType、companyId等，会区分web端
 * @return {object}
 */
const getProjectConfig = () => {
  const { PROJECT_TYPE, COMPLANY_ID } = Vue.prototype.$appConfig;
  const { uniPlatform } = uni.getSystemInfoSync();
  const isWeb = uniPlatform === 'web';
  const isWxBrowser = isWeixinBrowser();
  let URL_PROJECT_TYPE = ''
  let URL_COMPLANY_ID = ''
  if(isWeb){
    URL_PROJECT_TYPE = uni.getStorageSync(constant.PROJECT_TYPE)
    URL_COMPLANY_ID = uni.getStorageSync(`APP_${constant.COMPLANY_ID}_${URL_PROJECT_TYPE}`)
  }
  const webProjectType = URL_PROJECT_TYPE?URL_PROJECT_TYPE:PROJECT_TYPE; // uni.getStorageSync(URL_PROJECT_TYPE); // web暂时固定死 
  const webCompanyId = URL_COMPLANY_ID?URL_COMPLANY_ID:COMPLANY_ID; // web暂时固定死
  const projectType = isWeb ? webProjectType : PROJECT_TYPE; // App、小程序有隔离环境
  const companyId = isWeb ? webCompanyId : COMPLANY_ID; // App、小程序有隔离环境

  return {
    projectType,
    companyId,
  };
};

/**
 * @description: 是否微信浏览器
 * @return {boolean}
 */
const isWeixinBrowser = () => {
  const { uniPlatform } = uni.getSystemInfoSync();
  const isWeb = uniPlatform === 'web';
  const judge = () => {
    const ua = navigator.userAgent.toLowerCase();
    return ua.indexOf('micromessenger') != -1;
  };
  return isWeb && judge();
};
/**
 * @description: 单纯判断是否微信中打开
 * @return {boolean}
 */
const isWeixinOpen = () => {
  const { hostName  } = uni.getSystemInfoSync(); 
  return hostName == 'WeChat' || hostName == 'wxwork'
};

/**
 * @description: web端从url取projectTpe、xappletid
 * @return {*}
 */
const setProjectType = () => {
  const { uniPlatform } = uni.getSystemInfoSync();
  const isWeb = uniPlatform === 'web';
  if (isWeb) { 
    const matchReg = location.href.match(/xd(\d+)nt21\/mall/); // 页面路径前缀xdxxx(id)nt21
    const [matchStr, id] = matchReg || [];
    uni.setStorageSync(URL_PROJECT_TYPE, id || '');
    // 业主端公众号缓存
    if (isWeixinBrowser()) {
      wx.miniProgram.getEnv((res) => {
        if (res.miniprogram) {          
        } else {
          let t = getUrlParams2(location.href);
          if(t && t.projectType){
             storageAction({ key: PROJECT_TYPE, action: 'set', value: t.projectType });
          }
        }
      })
    }else{
       storageAction({ key: PROJECT_TYPE, action: 'set', value: Vue.prototype.$appConfig.PROJECT_TYPE});
       storageAction({ key: COMPLANY_ID, action: 'set', value: Vue.prototype.$appConfig.COMPLANY_ID});
    }
     
  
    
  }
}; 
const getUrlParams2 = (url)=> {
	let urlStr = url.split('?')[1]
	const urlSearchParams = new URLSearchParams(urlStr)
	const result = Object.fromEntries(urlSearchParams.entries())
	return result
} 
/**
 * @description: uni拦截器
 * @return {*}
 */
const setInterceptor = () => {
  // 拦截tabbar商城跳转
  uni.addInterceptor('switchTab', {
    invoke({ url, from }) {
      const blockMall = from == 'tabBar' && url === '/pages/common/mall';
      if (blockMall) {
        uni.navigateTo({ url: '/pages-mall/index/index' });
        return false;
      } else {
        return true;
      }
    },
  });
};

/**
 * @description: 处理社区用户的信息：登录、微信授权接口返回数据结构字段不一样，需要处理成一致字段
 * @param {*} plaform
 * @param {*} data 登录/授权返回的数据
 * @return {object}
 */
const setOwerUserInfo = (plaform, data) => {

  const local = storageAction({ key: O_USER_INFO, action: 'get'}) || {};

  // 新建其他字段时，在每个plaform里，要保持字段名的顺序！！！  其他接口不存在该字段用已存的！！！
  const useinfo = {
    // 登录页面接口
    loginPage() {
      const { id, headimg, fullName, nickname, sex, birthDay, phoneNumber } = data || {}
      const { STRG_openId = '', STRG_unionId = '', STRG_wxUserName = ''} = local

      return {
        STRG_memberId: id, // 会员id
        STRG_headImg: headimg, // 头像
        STRG_realName: fullName, // 真实姓名
        STRG_nickname: nickname, // 昵称
        STRG_sex: sex || '', // 性别
        STRG_phone: phoneNumber, // 联系电话
        STRG_birthDay: birthDay && formatDate({value: Number(birthDay), type: 's2d', format: 'YY-MM-DD'}) || '',
        STRG_openId, // 微信openId
        STRG_unionId, // 微信unionId
        STRG_wxUserName, // 微信用户名
        loginPage: data // 接口原数据
      }
    },
    // 公众号授权接口
    h5Weixin() {
      const { memberId, wxHeadImgUrl, memberName, openId, memberPhone, wxUserName, unionId} = data || {}
      // 对应接口暂无， 用已存在的
      const { STRG_nickname, STRG_sex, STRG_birthDay} = local

      return {
        STRG_memberId: memberId, // 会员id
        STRG_headImg: wxHeadImgUrl, // 头像
        STRG_realName: memberName, // 真实姓名
        STRG_nickname, // 昵称
        STRG_sex, // 性别
        STRG_phone: memberPhone, // 联系电话
        STRG_birthDay,
        STRG_openId: openId, // 微信openId
        STRG_unionId: unionId, // 微信unionId
        STRG_wxUserName: wxUserName, // 微信用户名
        h5Weixin: data, // 接口原数据
        phoneNumber: data.phone || data.memberPhone || ''
      }
    },
    // APP微信接口
    appWeixin() {
      const { memberId, wxHeadImgUrl, memberName, openId, memberPhone, wxUserName, unionId} = data || {}
      // 对应接口暂无， 用已存在的
      const { STRG_nickname, STRG_sex, STRG_birthDay} = local

      return {
        STRG_memberId: memberId, // 会员id
        STRG_headImg: wxHeadImgUrl, // 头像
        STRG_realName: memberName, // 真实姓名
        STRG_nickname, // 昵称
        STRG_sex, // 性别
        STRG_phone: memberPhone, // 联系电话
        STRG_birthDay,
        STRG_openId: openId, // 微信openId
        STRG_unionId: unionId, // 微信unionId
        STRG_wxUserName: wxUserName, // 微信用户名
        appWeixin: data // 接口原数据
      }
    },
    // 微信小程序接口
    mpWeixin() {
      const { memberId, wxHeadImgUrl, memberName, memberPhone, openId, unionId, wxUserName} = data || {}
      // 对应接口暂无， 用已存在的
      const { STRG_nickname, STRG_sex, STRG_birthDay} = local

      return {
        STRG_memberId: memberId, // 会员id
        STRG_headImg: wxHeadImgUrl, // 头像
        STRG_realName: memberName, // 真实姓名
        STRG_nickname, // 昵称
        STRG_sex, // 性别
        STRG_phone: memberPhone, // 联系电话
        STRG_birthDay,
        STRG_openId: openId, // 微信openId
        STRG_unionId: unionId, // 微信unionId
        STRG_wxUserName: wxUserName, // 微信用户名
        mpWeixin: data // 接口原数据
      }
    },
    // 更新编辑资料
    profile() {
      const { headImg, realName, nickname, sex, birthday, phone} = data || {}
      // 对应接口暂无， 用已存在的
      const { STRG_memberId, STRG_openId, STRG_unionId, STRG_wxUserName} = local
      return {
        STRG_memberId, // 会员id
        STRG_headImg: headImg, // 头像
        STRG_realName: realName, // 真实姓名
        STRG_nickname: nickname, // 昵称
        STRG_sex: sex, // 性别
        STRG_phone: phone, // 联系电话
        STRG_birthDay: birthday,
        STRG_openId: STRG_openId, // 微信openId
        STRG_unionId: STRG_unionId, // 微信unionId
        STRG_wxUserName, // 微信用户名
        phoneNumber: phone || data.memberPhone || ''
      }
    }
  }
  // 通用字段
  const commData = useinfo[plaform] && useinfo[plaform]() || {}

  // 更新本地数据：
  return {...local, ...data, ...commData}

};

/**
 * @description: 获取授权页面
 * @param {*} params
 * @return {string}
 */
const getAuthUrl = (params) => {
  const { uniPlatform } = uni.getSystemInfoSync();
  const wxBrowser = isWeixinBrowser();
  const toWxAuth = wxBrowser || uniPlatform === 'mp-weixin'; // 微信小程序、公众号
  const queryArgs = uniPlatform === 'h5' ? getQuery() : '';
  // 获取 h5 url 参数
  const getQuery = () => {
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1] || {};
    const { __page__ } = currentPage;
    const herf = __page__?.fullPath || '';
    const splitArry = herf.split('?');
    // 例如： matchArgs：a=a&b=b&obj=%7B%22name%22%3A%22chen%22,%22age%22%3A18%7D
    const matchArgs = splitArry.length > 1 && splitArry[splitArry.length - 1] || null; 
    // 再通过 {} -> JSON.stringify -> encodeURIComponent
    return matchArgs ? `?lastPageArg=${encodeURIComponent(JSON.stringify({args: matchArgs}))}` : ''; 
  }
  // 暂时都去登录页
  return toWxAuth ? `/pages-a/authorization/wx-auth${queryArgs}` : '/pages-a/authorization/login';
}

/**
 * @description: 业主微信授权
 * @param {*} params
 * @return {Promise}
 */
const owerAuthByWX = (params) => {
  const { authCode } = Vue.prototype.$route.query;
  const { MEMBER_ID, TOKEN, O_USER_INFO } = Vue.prototype.$constant;
  const { projectType } = getProjectConfig();
  const args = {
    data: {
      projectType,
      code: authCode,
    },
    hideLoading: true,
  };
  return new Promise((resole) => {
    wxOauthNew(args).then((res) => {
      if (res.success) {
        const { token, memberId } = res.data;
        const userInfo = setOwerUserInfo('h5Weixin', res.data)

				utils.storageAction({ key: O_USER_INFO, action: 'set', value: userInfo });
        utils.storageAction({ key: TOKEN, action: 'set', value: token });
        utils.storageAction({ key: MEMBER_ID, action: 'set', value: memberId });
        resole({})
      } else {
        resole({failure: true})
      }
    }).catch(_ => {
      resole({failure: true})
    });
  });
}

/**
 * @description: 商城登录及获取用户数据
 * @return {Promise}
 */
const mallLoginByMbid = () => {
  const { MEMBER_ID, M_TOKEN ,TOKEN} = Vue.prototype.$constant;
  const { ENABLED_MALL } = Vue.prototype.$appConfig;
  const mbid = storageAction({ key: MEMBER_ID, action: 'get' });
  const wyToken = storageAction({ key: TOKEN, action: 'get' }); 
  const { platform } = Vue.prototype.$cmMth.getTerminalPlatformArg();
  const loginFail = '商城登录失败'
  const getUserinfoFail = '获取商城用户信息失败'
  const args = {
    data: {
      // memberId: mbid,
      // equipment: platform,
    },
    hideLoading: true,
    pathParams: `/${wyToken}`,
  };
  if (ENABLED_MALL) {
    return new Promise((resolve) => {
      Vue.prototype.$mallApi.data.getTokenLogin(args).then((res) => {
        if (res.success) {
          const { token,userId } = res.data;

          // 存商城token
          utils.storageAction({ key: M_TOKEN, action: 'set', value: token });
          // 获取商城用户信息
          const args = {
            pathParams: `/${userId}`,
            hideLoading: true,
          };
          // 获取商城用户数据
          Vue.prototype.$mallApi.data.getUserInfo(args).then((res) => {
            if (res.success) {
              const { memberId, headPortrait, nickname, phoneNumber } = res.data;
              const { USER_INFO } = Vue.prototype.$constant;
              const userInfo = {
                ...res.data,
                memberId: memberId,
                memberPhoto: headPortrait,
                memberName: nickname,
                memberPhone: phoneNumber,
              };
              utils.storageAction({ key: USER_INFO, action: 'set', value: userInfo });
              resolve({})
            } else {
              resolve({errMsg: getUserinfoFail})
            }
          }).catch(_ => {
            resolve({errMsg: getUserinfoFail})
          });

        } else {
          resolve({errMsg: loginFail})
        }
      }).catch(_ => {
        resolve({errMsg: loginFail})
      });
    });
  } else {
    return Promise.resolve({});
  }
};

/**
 * @description: 微信授权 或者 手动登录、注册-完善资料之后，重定向会原先跳过的页面
 * @param {object} params
 * @return {*}
 */
const authPageRedirect = () => {
  const lastPageArg = commLogic.getQueryVariable('lastPageArg')
  const redirectPage = decodeURIComponent(commLogic.getQueryVariable('redirectPage'))
  const tabbarPage = ['/pages/index/index', '/pages/service/service', '/pages/mine']
  const isTabbarPage = tabbarPage.includes(redirectPage);
  const query = () => {
    let parseArgs = ''
    if (lastPageArg) {
      const decodeArgs = decodeURIComponent(lastPageArg)
      try {
        const { args } = JSON.parse(decodeArgs)
        parseArgs = `?${args}` // args 原本的参数 例如：a=a&b=b&obj=%7B%22name%22%3A%22chen%22,%22age%22%3A18%7D
      } catch (error) {
        console.log('arguments parsing was failure.')
      }
    }
    return parseArgs
  }
  const url = `${redirectPage}${query}`
  uni[ isTabbarPage ? 'switchTab' : 'redirectTo']({url})
}

/**
 * @description: 获取url参数
 * @param {*} key 参数名
 * @return {string}
 */
const getQueryVariable = (key) => {
  const { uniPlatform } = uni.getSystemInfoSync();
  if (uniPlatform == 'h5') {
    const splitArry = window.location.href.split('?');
    const vars = splitArry[1] && splitArry[1].split("&") || '';
    for (var i = 0; i< vars.length; i++) {
      const pair = vars[i].split("=");
      if (pair[0] == key) return pair[1];
    }
  }
  return '';
}


/**
 * @description: 关闭Splashs
 * @return {*}
 */
const closeSplashscreen = () =>{
  /* #ifdef APP-PLUS  */
  plus.navigator.closeSplashscreen(); 
  /* #endif */
}

/**
 * @description: 去授权页面：登录或者授权
 * @return {*}
 */
const toAuth = () => {
  const url = getAuthUrl()
  uni.navigateTo({ url });
}

// post 转换 数组对象 [key: key, value: value]
const parseQueryPostArr = (arrObj) =>{
  let newArr = []
  Object.keys(arrObj).forEach(key => {
    let value = arrObj[key];
    if (Array.isArray(value) || typeof value === 'object') {
      value = encodeURIComponent(JSON.stringify(value))
    }
    newArr.push({key: key, value: value}) // 解码 URL 编码的值
  });

  return newArr;
  // return paramsObject;
}
const sortByKeyold = (array, key = 'key') =>{

  // 使用 sort() 方法按照指定键进行排序
  array.sort((a, b) => {
    if (a[key] && b[key]) {
      return a[key].toString().localeCompare(b[key].toString());
    }
    return 0;
  });

  return array;
}
// 根据字母大小，字母顺序排序
const getThatValue = (key,list) => {
  let value = ''
  list.map(item=>{
    if(item.key == key){
      value = item.value
    }
  })
  return value
}


const sortByKey = (array,obj) =>{

  let nameList = []
  array.map(tab=>{
    nameList.push(tab.key)
  })
  var sortNameList = nameList.sort();
  let newArray = []
  sortNameList.map(item=>{
    newArray.push({
      key:item,
      value:getThatValue(item,array)
    })
  })

  return newArray;
}

const createMd5Key = (params) =>{
  const invokeOpt = JSON.parse(JSON.stringify(params));
  let dataStr = ''
  if(JSON.stringify(invokeOpt) != '{}' && ('data' in invokeOpt)){
    for(let key in invokeOpt.data){
      if(Array.isArray(invokeOpt.data[key]) || (typeof invokeOpt.data[key])=='object'){
        invokeOpt.data[key] = JSON.stringify(invokeOpt.data[key])
      }
      if((!invokeOpt.data[key] && invokeOpt.data[key] !== 0) || invokeOpt.data[key] == 'null'){
        invokeOpt.data[key] = ''
      }
    }
    // 统一转换数组对象    签名-start
    let dataList = parseQueryPostArr(invokeOpt.data)
  
    // 数组对象排序
    dataList = sortByKey(dataList,invokeOpt.data)
    // console.log('dataList-------',dataList)
  
    //拼接
    dataList.forEach(item =>{
      dataStr += `${item.key}=${decodeURIComponent(item.value)}&`
    })
    dataStr = dataStr + 'key=0127abceefinrtwyy'
    // console.log('dataStr==', dataStr,md5(dataStr),md5('key=0127abceefinrtwyy'))
  }

  return md5(dataStr).toLocaleUpperCase();
}

/**
 * @description: 是否已授权/登录，社区登录，商业也同时登录
 * @return {boolean}
 */
const isAuthorized = () => {
  const { O_USER_INFO } = Vue.prototype.$constant;
  const authorized = !!utils.storageAction({ key: O_USER_INFO, action: 'get'});
  if (!authorized) toAuth()
  return authorized
}
/**
 * @description: 是否已授权/登录，社区登录，商业也同时登录
 * @return {boolean}
 */
const isLogin = () => {
   //获取已保存在本地的用户信息，该内容在登录页面登录成功之后，才保存到本地的
   const { O_USER_INFO } = Vue.prototype.$constant;
   const userLoginInfo = !!utils.storageAction({ key: O_USER_INFO, action: 'get'});
   if (!userLoginInfo) {
       uni.reLaunch({
           url: "/pages-a/authorization/login",
           success: () => {
               //跳转完页面后再关闭启动页
              plus.navigator.closeSplashscreen();
           }
      })
   } else {
       plus.navigator.closeSplashscreen(); //关闭启动页，进入首页
   }
}

/**
 * @description: 获取APP权限
 * @param {*} params permissionKey：权限key
 * @return {Promise} code: -2-不存在权限检测方法 -1-报错  0-权限被永久拒绝  1-权限被允许  2-权限被临时拒绝
 */
const requestAppPermission = async (params = {}) => {
  const { permissionKey } = params
  const appPlatform = uni.getSystemInfoSync().platform
  const requestAndroidPermission = async (permissionIds) => {
    return new Promise((resolve) => {
      plus.android.requestPermissions(permissionIds, function(e){
        const {granted, deniedPresent, deniedAlways} = e || {}
        // granted:权限被允许  deniedPresent: 权限被临时拒绝 deniedAlways: 权限被永久拒绝 
        resolve({
          code: granted.length ? 1 : deniedPresent.length ? 2 : 0
        })  
      }, function(error){
        resolve({
          code: -1,
          message: error.message
        })
      });
    })
  }

  const requestIosPermission = (permissionId) => {
    return new Promise((resolve) => {
      const permission = uni.getAppAuthorizeSetting()
      const res = permission[permissionId]
      resolve({
        code: res === 'authorized' ? 1 : res === 'denied' ? 0 : -2
      }) 
    })
  }
  
  const permissions = {
    // 位置权限
    location: {
      permissionText: '位置',
      async get() {
        return appPlatform === 'android' ? await requestAndroidPermission(['android.permission.ACCESS_FINE_LOCATION']) : ''
      }
    },
    // 摄像头权限
    camera: {
      permissionText: '摄像头',
      async get() {
        return appPlatform === 'android' ? await requestAndroidPermission(['android.permission.CAMERA']) : await requestIosPermission('cameraAuthorized')
      }
    },
    // 外部存储(含相册)读取权限
    readStorage: {
      permissionText: '外部存储(含相册)读取',
      async get() {
        return appPlatform === 'android' ? await requestAndroidPermission(['android.permission.READ_EXTERNAL_STORAGE']) : await requestIosPermission('albumAuthorized')
      }
    },
    // 外部存储(含相册)写入权限
    writeStorage: {
      permissionText: '外部存储(含相册)写入',
      async get() {
        return appPlatform === 'android' ? await requestAndroidPermission(['android.permission.WRITE_EXTERNAL_STORAGE']) : await requestIosPermission('albumAuthorized')
      }
    },
    // 拨打电话权限
    callPhone: {
      permissionText: '拨打电话',
      async get() {
        return appPlatform === 'android' ? await requestAndroidPermission(['android.permission.CALL_PHONE']) : ''
      }
    },
  }

  const hasVerifyFn = permissions[permissionKey] && permissions[permissionKey].get
  const result = hasVerifyFn && await permissions[permissionKey].get() || { code: -2 }

  return  {...result, permissionText: hasVerifyFn ? permissions[permissionKey].permissionText: ''}
}


/**
 * @description: 检查App权限及提示前往设置
 * @param {*} params permissionKeys<Array>：权限key
 * @return {Promise} code: -2-不存在权限检测方法 -1-报错  0-权限被永久拒绝  1-权限被允许  2-权限被临时拒绝
 */
const permissionCheckAndAlert = async (params = {},showTip = 1) => {
  const { permissionKeys = [] } = params
  const { uniPlatform } = uni.getSystemInfoSync()
  if (uniPlatform !== 'app') return Promise.resolve({code: 1})

  let result = {}
  for (let i = 0; i < permissionKeys.length; i++) {
    result = await requestAppPermission({permissionKey: permissionKeys[i]})
    if (result.code === 0 || result.code === 2) break
  }
  
  return new Promise((resolve) => {
    const {permissionText, code} = result
    if (code === 0 || code === 2) {
      const content = `请允许手机 ${permissionText} 权限，禁用可能会造成功能不可用`
      const { THEME_COLOR } = getThemeData()
			if(showTip == 1){
				uni.showModal({
				  title: '提示',
				  content,
				  confirmText: "前往设置",
				  cancelText: '取消',
				  confirmColor: THEME_COLOR,
				  success: function (res) {
				    if (res.confirm) uni.openAppAuthorizeSetting() 
				    resolve({ code })
				  }
				});
			}else{
				resolve({ code })
			}
      
    } else {
      resolve({ code })
    }
    
  })
} 

// h5 APP登录获取用户信息
const getLocalUserInfo = async () => {
  if (!window.EbeiPlugins) return new Promise((resolve, reject) => {
    resolve({ isNOLogin: true }) 

  });
  return new Promise((resolve, reject) => {
    console.log('native: getLocalUserInfo');
    window.EbeiPlugins.getLocalUserInfo(
      result => {
        console.log('native: getLocalUserInfo=' + JSON.stringify(result));
        const { TOKEN, MEMBER_ID, O_USER_INFO } = Vue.prototype.$constant;
        const { memberId, access_token:token } = result || {};
        result.token = result.access_token;
        result.id = result.memberId
        const storage = commLogic.setOwerUserInfo('loginPage', result)
        utils.storageAction({ key: TOKEN, action: 'set', value: token });
        utils.storageAction({ key: MEMBER_ID, action: 'set', value: memberId });
        utils.storageAction({ key: O_USER_INFO, action: 'set', value: storage });
        resolve(result)
      },
      error => {
        uni.showModal({
          title: '提示',
          content: '登录失败，请退出',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定');
            } else if (res.cancel) {
              console.log('用户点击取消');
            }
          }
        });
        reject(error)
      }
    )
  })
}

export default {
  getThemeData,
  setTabbar,
  isWeixinBrowser,
  getProjectConfig,
  setProjectType,
  setInterceptor,
  mallLoginByMbid,
  authPageRedirect,
  getQueryVariable,
  owerAuthByWX,
  getAuthUrl,
  setOwerUserInfo,
  closeSplashscreen,
  toAuth,
  isAuthorized,
  isLogin,
  requestAppPermission,
  permissionCheckAndAlert,
  isWeixinOpen,
  getLocalUserInfo,
  parseQueryPostArr,
  sortByKey,
  createMd5Key
};
