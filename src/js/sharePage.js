// 用于企微上的分享按钮
import { getCompanyAgentMaterialList } from '@/service/api-gateway'
import Vue from 'vue';
import utils from '@/js/utils';
import constant from '@/js/constant';

/**
 * 获取 会员活动分享链接  新版分享链接配置项目配置上，分h5链接和小程序链接
 * appType  1: h5  2: 小程序
 */
export function getActivitySheetUrl() {
  const { APP_TYPE, APPID_ENTIFIER } = constant;
  let url = ''
  let appType = utils.storageAction({ key: APP_TYPE, action: 'get' })
  if (appType == '1') {
    url = Vue.prototype.$appConfig.ACTIVITY_SHEET_H5_URL
  }else {
    url = Vue.prototype.$appConfig.ACTIVITY_SHEET_WX_URL
  }
  return url
}

/**
 * 获取 企微管理 -> 常用链接 的配置信息
 * @param {string} title 建议格式: "分享xxx" ，这样就不会在常用链接页面显示出来了，就可以单独用于分享按钮的配置
 * @returns 
 */
export async function getShareConfig(title = '') {
  const params = {
    data: {
      pageNum: 1,
      pageSize: 100,
      title
    },
    hideLoading: true,
    responseToast: false,
  }
  const res = await getCompanyAgentMaterialList(params).catch(_ => {})

  const data = res?.data?.records?.[0]
  return data || {}
}


/**
 * 只限于在聊天底部的工具栏或附件栏，分享页面到当前聊天窗口
 * @param {{type: number, appid: string, title: string, desc: string, imgUrl: string, pageUrl: string}} config 
 * @param {number} config.type 1: H5, 2: 小程序
 * @param {string} config.pageUrl 页面路径。如果是小程序，格式为 "pages/a/b.html?arg=123"
 * @returns {Promise}
 */
export async function sendChatMessage(config) {
  return new Promise((resolve) => {
    if (config.type == 1) {
      // 发送 H5
      wx.qy.sendChatMessage({
        msgtype: 'news',
        enterChat: true,
        news: {
          title: config.title || '',
          desc: config.desc || '',
          imgUrl: config.imgUrl || '',
          link: config.pageUrl || '', // 请注意，IOS上的URL不支持中文，需要进行编码
        },
        success: () => {
          resolve()
        },
        fail: (error) => {
          resolve(error)
        }
      })
    } else if (config.type == 2) {
      // 发送 小程序
      wx.qy.sendChatMessage({
        msgtype: 'miniprogram',
        enterChat: true,
        miniprogram: {
          appid: config.appid || '',
          title: config.title || '',
          imgUrl: config.imgUrl || '',
          page: fillHtmlStr(config.pageUrl || ''), // 请注意，IOS上的URL不支持中文，需要进行编码
        },
        success: () => {
          resolve()
        },
        fail: (error) => {
          resolve(error)
        }
      })
    }
  })
}

/**
 * 企业员工将页面分享给客户
 * @param {{externalUserIds: string[], type: number, appid: string, title: string, desc: string, imgUrl: string, pageUrl: string}} config 
 * @param {string[]} config.externalUserIds 分享给指定的客户ID列表
 * @param {number} config.type 1: H5, 2: 小程序
 * @@param {string} config.pageUrl 页面路径。如果是小程序，格式为 "pages/a/b.html?arg=123"
 * @returns {Promise}
 */
export async function shareToExternalContact(config) {
  return new Promise((resolve) => {
    let attachments = []
    if (config.type == 1) {
      // 发送 H5
      attachments.push({
        msgtype: 'link',
        link: {
          title: config.title || '',
          desc: config.desc || '',
          imgUrl: config.imgUrl || '',
          url: config.pageUrl || '', // 请注意，IOS上的URL不支持中文，需要进行编码
        }
      })
    } else if (config.type == 2) {
      // 发送 小程序
      attachments.push({
        msgtype: 'miniprogram',
        miniprogram: {
          appid: config.appid || '',
          title: config.title || '',
          imgUrl: config.imgUrl || '',
          page: fillHtmlStr(config.pageUrl || ''), // 请注意，IOS上的URL不支持中文，需要进行编码
        }
      })
    }

    wx.qy.shareToExternalContact({
      externalUserIds: config.externalUserIds || [],
      text: {
        content: config.content || '',
      },
      attachments,
      success: () => {
        resolve()
      },
      fail: (error) => {
        resolve(error)
      }
    })
  })
}

/**
 * 给页面路径补充 .html
 * @param {string} pageUrl
 */
function fillHtmlStr(pageUrl) {
  let page = (pageUrl || '')

  const index = page.indexOf('?')
  if (index == -1) {
    if (page && !/\.html$/i.test(page)) {
      // 例如，"pages/a/b" -> "pages/a/b.html"
      page = page + '.html'
    }
  } else {
    const domain = page.substring(0, index)
    if (domain && !/\.html$/i.test(domain)) {
      // 例如，"pages/a/b?type=1" -> "pages/a/b.html?type=1"
      page = domain + '.html' + page.substring(index)
    }
  }

  return page
}