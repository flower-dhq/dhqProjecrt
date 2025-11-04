export default (() => {
  // 常量格式：以为大写英文单词，下划线_ 拼接
  // 常量不要以APP_开头，storageAction方法已加了APP_前缀

  // 商城：若社区已有同个键名，还想用那个键名，在前面加上 M_ 前缀区分
  const mall = {
    USER_INFO: 'M_USER_INFO', // 商城用户登录信息
    X_APPLET_ID: 'X_APPLET_ID', // 等于projectType
    M_TOKEN: 'M_TOKEN', // 商城接口token
    PROJECT_INFO: 'M_PROJECT_INFO', // 商城首页所选项目
    OA_APP_ID: 'OA_APP_ID', // 公众号appid
    SHARE_ID: 'SHARE_ID', // 分享人ID
    OPEN_AD: 'OPEN_AD', // 商城首页开屏页广告
  }

  // 社区：若商城已有同个键名，还想用那个键名，在前面加上 O_ 前缀区分
  const constant = {
    ...mall,
    IS_AUTH:'IS_AUTH',//是否已经登录或者微信已经授权
    URL_PROJECT_TYPE: 'URL_PROJECT_TYPE', // 从url获取projectType 或者叫 xAppletId
    O_USER_INFO: 'O_USER_INFO', // 登录成功的用户数据
    TOKEN: 'TOKEN', // token 本地储存的键名
    THEME: 'THEME', // 主题储存的键名
    PROJECT_TYPE: 'PROJECT_TYPE', // 项目id
    COMPLANY_ID: 'COMPLANY_ID', // 公司id
    MEMBER_ID: 'MEMBER_ID', // 会员id
    AREA_ID:'AREA_ID',//区域ID
    PROJECT_ID:'PROJECT_ID',//项目ID
    USER_TYPE:'USER_TYPE', //用户角色 业主、家人、租户等
    USER_TYPE_NUM:'USER_TYPE_NUM', //用户角色代表的数字
    PROJECT_NAME:'PROJECT_NAME',//项目名称
    AREA_NAME:'AREA_NAME',//区域名称
    IS_ASSOCIATION:'IS_ASSOCIATION', //是否认证
    WX_USERID:'WX_USERID',  //wxUserId, 授权接口需要
    APPID_ENTIFIER: 'APPID_ENTIFIER', //  业主端appId/业主端UR
    APP_TYPE: 'APP_TYPE', // 业主端类型,1、微信公众号H5、2、微信小程序  
  };

  return constant;
})();
