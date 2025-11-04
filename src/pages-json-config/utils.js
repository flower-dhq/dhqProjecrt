/**
 * @description: 获取APP配置信息
 * @return {Object} 配置信息
 */
 const getAppConfig = () => {
    // 优先取node 环境变量，若不使用npm run script，直接执行原本uni-app命令， 需要执行npm run switch切换项目配置
    return process.env.VUE_APP_CONFIG && JSON.parse(process.env.VUE_APP_CONFIG) || require('../app-config/env.json') || {}
}

/**
 * @description: 获取项目pages.json 配置
 * @param {*} pagesConfig 所有项目pages.json
 * @param {*} projectCode 项目编码
 * @return {Object} 项目的pages.json
 */
const getProjectPagesJson = (pagesConfig, projectCode) => {
    const list = Array.isArray(pagesConfig) ? pagesConfig : []
    const [ config ] = list.filter(item => item.PROJECT_CODE === projectCode && item.PAGES_JSON)
    return config || {}
}
// 获取对应的基础page.json 跟 按需的page.json
const getModuleCode = () => {
  
  const {COMPILATION_ENV = {}} = JSON.parse(process.env.VUE_APP_CONFIG || '{}')
  const {module = ''} = COMPILATION_ENV
  const [base, moduleCode = ''] = module.split(',')
  // base：基础page.json的PROJECT_CODE
  // moduleCode：按需的page.json的PROJECT_CODE
  return {basicCode: base || 'COMMON', moduleCode}
}


/**
 * @description: 合并当前项目跟通用pages.json
 * @return {object} pages.json 对象
 */
const mergePagesJson = () => {
    const pagesConfig = require('./index.js')
    const { PROJECT_CODE } = getAppConfig()
    const {basicCode, moduleCode} = getModuleCode()
    const {PAGES_JSON: commPages} = getProjectPagesJson(pagesConfig, basicCode)
    const finalPages = JSON.parse(JSON.stringify(commPages))
    const {PAGES_JSON: currentPages, CALL_BACK} = getProjectPagesJson(pagesConfig, moduleCode || PROJECT_CODE)

    const isInstance = (d) => typeof d === "object" && d !== null;
    const hasOwnProp = (obj, k) => obj.hasOwnProperty(k);
    
    // 递归合并及修改
    const recursion = (prjPgsJs, cmmPgsJs) => {
      if (isInstance(prjPgsJs)) {
        for (const k in prjPgsJs) {
          const prjPgsJsVal = prjPgsJs[k];
          if (hasOwnProp(prjPgsJs, k) && isInstance(prjPgsJsVal)) {
            if (!hasOwnProp(cmmPgsJs, k)) {
              const isArray = Array.isArray(prjPgsJsVal);
              cmmPgsJs[k] = isArray ? [] : {};
            }
            recursion(prjPgsJsVal, cmmPgsJs[k], k);
          } else {
            cmmPgsJs[k] = prjPgsJsVal;
          }
        }
      }
    };

    recursion(currentPages, finalPages)
    // 如果有CALL_BACK，就用CALL_BACK对pages.js做最后修改
    return typeof CALL_BACK == 'function' && CALL_BACK(finalPages) || finalPages
}


module.exports = {
    getAppConfig,
    getProjectPagesJson,
    mergePagesJson
  };