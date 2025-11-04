<template>
  <view></view>
</template>

<script>
import commLogic from '@/js/comm-logic'
import util from '@/js/utils'
import { menu } from '@/js/menu'
import { appletLogin, findCompanyAuthInfoList, getOwnerBuildingListComm, getListByMap, wxOauthNew } from '@/service/community'

/**
 * 跳转到指定页面之前，先进行授权认证
 */
export default {
  data() {
    return {
      pathCode: '', // 需要跳转的页面（顺序是在认证后）
      authType: 'fw', // 认证类型（顺序是在绑定手机号码操作后）。qy: 跳转到企业认证。fw: 跳转到房屋认证。none: 不进行认证，跳转到指定页面。默认 fw
      otherQuery: {}, // 其他参数
      companyId: '',
      memberId: '',
    }
  },
  async onLoad(options) {
    const { pathCode, authType, code, projectType, ...tempOther } = options || {}

    /**
     * 注意，所有跳转，都会先判断手机号码，没有则跳转到手机绑定页面
     * 注意，默认跳转到首页
     * 
     * authType=fw&pathCode=xxx
     * 表示先检查有没有房产认证，没有则跳到（fw: 房屋认证; qy: 企业认证）页面，然后再跳到指定页面
     * 
     * authType=fw
     * 表示只跳转到房产认证页面
     * 
     * authType=none&pathCode=xxx
     * 表示不检查房产认证，直接跳到指定页面
     */

    this.pathCode = pathCode || ''
    this.authType = ['qy', 'fw', 'none'].includes(authType) ? authType : 'none'

    if (['qy', 'fw'].includes(this.authType) && ['enterpriseAuth', 'houseAuth'].includes(this.pathCode)) {
      // 如果选择了认证页面，但是 pathCode 跳转的也是认证页面，则会产生冲突
      this.pathCode = ''
    }

    this.otherQuery = tempOther


    // #ifdef MP-WEIXIN
    this.wxMiniLogin()
    // #endif

    // #ifdef H5
    if (!code) {
      projectType && this.getWxH5Code(projectType)
      return
    }

    if (code && projectType) {
      await Promise.all([
        this.wechatSetCompany(projectType),
        this.wxH5Login(code, projectType)
      ])
    }
    // #endif

    await this.registerAndJumpPage()
  },
  methods: {
    // 获取微信授权code
    getWxMiniCode(pvd) {
      return new Promise((resolve) => {
        uni.getProvider({
          service: 'oauth',
          success: (provider) => {
            uni.login({
              provider: pvd || provider,
              onlyAuthorize: !!pvd, // 微信登录仅请求授权认证
              success: (res) => resolve(res),
              fail: (error) => resolve(error),
            })
          },
          fail: (error) => resolve(error),
        })
      })
    },
    // 小程序登录
    async wxMiniLogin() {
      this.companyId = commLogic.getProjectConfig().companyId
      const { PROJECT_TYPE } = this.$appConfig
      const { errMsg: loginMsg, code } = await this.getWxMiniCode().catch(_ => { })

      const params = {
        data: {
          code,
          appletId: PROJECT_TYPE,
          companyId: this.companyId,
          source: 'wxMini'
        }
      }
      const res = await appletLogin(params)
      if (res.status != 200) return

      const data = res.data
      let combineData = {}
      try {
        combineData = JSON.parse(data.appMemberJson)
      } catch (error) {
        combineData = {
          companyId: data.companyId,
          id: data.memberId,
          token: data.token,
          nickname: data.wxUserName
        }
      }
      combineData.wxUserId = data.wxUserId
      // 用的是微信小程序登录接口，用mpWeixin方法处理
      const userInfo = commLogic.setOwerUserInfo('mpWeixin', Object.assign({}, data, combineData))

      const { TOKEN, MEMBER_ID, O_USER_INFO, WX_USERID } = this.$constant
      util.storageAction({ key: TOKEN, action: 'set', value: combineData.token })
      util.storageAction({ key: MEMBER_ID, action: 'set', value: combineData.id })
      util.storageAction({ key: O_USER_INFO, action: 'set', value: userInfo })
      util.storageAction({ key: WX_USERID, action: 'set', value: combineData.wxUserId })
    },
    /**
     * 获取公众号授权code
     * 先调用“https://open.weixin.qq.com”，拿到code经过“/oauth.html”页面，再经过当前页面，从而拿到code
     */
    getWxH5Code(projectType) {
      const domain = this.getH5Domain()
      if (!domain) return

      const appId = this.$appConfig.OA_APP_ID ? this.$appConfig.OA_APP_ID : 'wx2252d10072e5ac93'
      const query = uni.$u.queryParams(Object.assign(
        {
          authType: this.authType,
          pathCode: this.pathCode || '',
          projectType
        },
        this.otherQuery
      ))
      const redirectUrl = encodeURIComponent(`${domain}oauth.html${query}`)
      window.location.replace(`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${redirectUrl}&response_type=code&scope=snsapi_userinfo&state=code#wechat_redirect`)
    },
    // 微信公众号登录
    async wxH5Login(code, projectType) {
      const params = {
        data: {
          code,
          projectType
        },
        hideLoading: true,
        responseToast: false
      }
      const res = await wxOauthNew(params)
      if (res.status != 200) return

      const data = res.data
      let combineData = {}
      try {
        const temp1 = JSON.parse(data.memberJsonObject)
        const temp2 = JSON.parse(data.wxUserJsonObject)
        combineData = Object.assign({}, temp1, temp2, { companyId: '', id: data.memberId })
      } catch(error) {
        combineData = {
          companyId: '',
          id: data.memberId,
          token: data.token,
          nickname: data.wxUserName
        }
      }
      combineData.wxUserId = data.wxUserId
      // 用的是微信公众号登录接口，用h5Weixin方法处理
      const userInfo = commLogic.setOwerUserInfo('h5Weixin', Object.assign({}, data, combineData))

      const { TOKEN, MEMBER_ID, O_USER_INFO, WX_USERID, PROJECT_TYPE } = this.$constant
      util.storageAction({ key: TOKEN, action: 'set', value: data.token });
      util.storageAction({ key: MEMBER_ID, action: 'set', value: data.memberId })
      util.storageAction({ key: O_USER_INFO, action: 'set', value: userInfo })
      util.storageAction({ key: WX_USERID, action: 'set', value: data.wxUserId })
      util.storageAction({ key: PROJECT_TYPE, action: 'set', value: projectType || '' })
    },
    // 先判断是否注册过手机号码，然后设置默认房产，最后再跳转到指定页面
    async registerAndJumpPage() {
      const { O_USER_INFO } = this.$constant
      const userInfo = util.storageAction({ key: O_USER_INFO, action: 'get' })

      // 如果没有手机号码，则进行绑定操作
      const phoneNumber = userInfo?.STRG_phone ?? ''
      if (!phoneNumber) {
        this.toBindPhone()
        return
      }
      
      this.memberId = userInfo.id

      // 设置默认房产
      await this.getUserAssets()
      const { USER_ADDR_INFO } = this.$constant
      const hasHouse = !!util.storageAction({ key: USER_ADDR_INFO, action: 'get' })

      if (!this.pathCode) {
        // 不需要跳转到指定页面
        const query = uni.$u.queryParams(Object.assign(
          {
            authType: 'none',
            pathCode: '',
          },
          this.otherQuery
        ))

        if (this.authType == 'qy') {
          // 只需要跳转到企业认证
          uni.reLaunch({ url: '/pages-d/enterprise-info/enterprise-auth-list' + query })
        } else if (this.authType == 'fw') {
          // 只需要跳转到房屋认证
          uni.reLaunch({ url: '/pages-b/house-info/add-house-address' + query })
        } else {
          // 默认跳转到首页
          this.toPage()
        }
      } else {
        // 需要跳转到指定页面
        const query = uni.$u.queryParams(Object.assign(
          {
            authType: this.authType,
            pathCode: this.pathCode,
          },
          this.otherQuery
        ))

        if (!this.authType || this.authType == 'none') {
          // 不需要经过认证页面，跳转到指定页面
          this.toPage()
        } else if (!hasHouse && this.authType == 'qy') {
          // 没有房产，则跳转到企业认证
          uni.reLaunch({ url: '/pages-d/enterprise-info/enterprise-auth-list' + query })
        } else if (!hasHouse && this.authType == 'fw') {
          // 没有房产，则跳转到房屋认证
          uni.reLaunch({ url: '/pages-b/house-info/add-house-address' + query })
        } else {
          // 默认跳转到首页
          this.toPage()
        }
      }
    },
    /**
     * 例如：'https://ebeitest50.wuyeface.com/uniwechat/#/pages-a/authorization/auth-certify' => 'https://ebeitest50.wuyeface.com/uniwechat/'
     */
    getH5Domain() {
      const url = window.location.href
      const domainIndex = url.indexOf('#')
      if (domainIndex == -1) return

      let domain = url.substring(0, domainIndex)
      domain = /\/$/.test(domain) ? domain : (domain + '/')

      return domain
    },
    // 跳转到绑定手机号码页面
    toBindPhone() {
      const query = uni.$u.queryParams(Object.assign(
        {
          authentication: this.authType,
          pathCode: this.pathCode || '',
        },
        this.otherQuery
      ))
      uni.reLaunch({ url: '/pages-a/authorization/bindingMobile' + query })
    },
    // 跳转到指定页面
    toPage() {
      const query = uni.$u.queryParams(this.otherQuery)
      const index = this.pathCode ? menu.findIndex(item => item.detailCode == this.pathCode) : -1
      if (index == -1 || !menu[index].page) {
        // 默认跳转到首页
        uni.switchTab({ url: '/pages/index/index' + query })
      } else {
        // 跳转到指定页面
        let pageUrl = menu[index].page
        const hasQuery = pageUrl.lastIndexOf('?') > -1 // 地址里已经有参数了
        uni.reLaunch({ url: hasQuery ? `${pageUrl}&${query.substring(1)}` : (pageUrl + query) })
      }
    },
    // 获取用户房产项目
    async getUserAssets() {
      let data = []

      const companyData = await this.getCompanyAuthInfoList().catch(_ => {})
      if (companyData.data) data = data.concat(companyData?.data || [])

      const ownerData = await this.getOwnerHouse().catch(_ => {})
      if (ownerData.data) data = data.concat(ownerData?.data || [])

      // 根据默认房产设置默认区域，项目
      let selectInfo = null
      const defEnterpriseIndex = data.findIndex(item => item.employeeStatus == 1)
      selectInfo = defEnterpriseIndex > -1 ? data[defEnterpriseIndex] : null
      if (!selectInfo) {
        const defHouseIndex = data.findIndex(item => item.isDefault == 1)
        selectInfo = defHouseIndex > -1 ? data[defHouseIndex] : null
      }
      if (!selectInfo) {
        const defListIndex = data.filter(item => item.authType == 1)
        selectInfo = defListIndex > -1 ? data[defListIndex] : null
      }
      if (selectInfo) {
        const { USER_ADDR_INFO } = this.$constant
        util.storageAction({ key: USER_ADDR_INFO, action: 'set', value: selectInfo })
      } else {
        selectInfo = await this.getCity()
      }

      const { areaId, projectId, areaName, projectName } = selectInfo
      const { AREA_ID, PROJECT_ID, AREA_NAME, PROJECT_NAME } = this.$constant
      util.storageAction({ key: AREA_ID, action: 'set', value: areaId })
      util.storageAction({ key: PROJECT_ID, action: 'set', value: projectId })
      util.storageAction({ key: AREA_NAME, action: 'set', value: areaName })
      util.storageAction({ key: PROJECT_NAME, action: 'set', value: projectName })
    },
    // 获取企业房产
    getCompanyAuthInfoList() {
      const params = {
        data: {
          companyId: this.companyId,
          memberId: this.memberId,
          applyStatus: 9  //已通过企业
        },
        hideLoading: true,
        responseToast: false
      }
      return findCompanyAuthInfoList(params)
    },
    //获取房产
    async getOwnerHouse() {
      const params = {
        data: {
          companyId: this.companyId,
          memberId: this.memberId
        },
        hideLoading: true,
        responseToast: false
      }
      return getOwnerBuildingListComm(params)
    },
    async getCity() {
      const { projectType } = commLogic.getProjectConfig()
      const params = {
          data: {
            projectType: projectType,
          },
          hideLoading: true
      }
      const res = await getListByMap(params).catch(_ => {})
      const data = res?.data || []
      const defItem = data.find(item => item.isDefaultProject) || data[0] || null

      return defItem || null
    },
    // 公众号需要设置 companyId
    async wechatSetCompany(projectType) {
      const params = {
        data: {
          projectType,
        },
        hideLoading: true
      }
      const res = await getListByMap(params)
      const data = res?.data?.[0] ?? {}
      const { COMPLANY_ID } = this.$constant

      if (data.companyId) {
        util.storageAction({ key: COMPLANY_ID, action: 'set', value: data.companyId })
      }
    }
  }
}
</script>

<style>

</style>