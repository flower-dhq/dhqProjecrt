/**
 * 将接口获取的附件数据转为统一格式，即转换为 share-attachments.vue 组件 props.data 需要的格式
 * @returns {Array<{ msgtype: string, data: { name: string, title: string, url: string, desc: string, appId: string, page: string } }>}
 */
export function formatAttachments(data = []) {
  const res = data.map(item => {
    const type = item.msgType

    if (['image', 'file', 'video'].includes(type)) {
      const data = item[type]
      return {
        msgType: type,
        data: {
          name: data.name || '',
          url: data.url || '', // 文件url地址
        }
      }
    } else if (type == 'link') {
      const data = item.link
      return {
        msgType: 'link',
        data: {
          title: data.title || '',
          imgUrl: data.imgUrl || '', // 图文消息封面图片URL
          url: data.url || '', // 图文消息
          desc: data.desc || '',
        }
      }
    } else if (item.msgType === 'miniprogram') {
      const data = item.miniprogram
      return {
        msgType: 'miniprogram',
        data: {
          title: data.title || '',
          imgUrl: data.imgUrl || '', // 小程序消息封面的URL
          appId: data.appId || '',
          page: data.page || ''
        }
      }
    }
  })
  return res
}