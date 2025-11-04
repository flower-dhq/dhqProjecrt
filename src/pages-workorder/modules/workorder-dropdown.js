/**区域项目 */
export const projectList = () => ({
  name: '全部',
  type: 'hierarchy-column',
  submenu: [
    {
      name: '一碑-无锡区',
      value: '一碑-无锡区',
      submenu: [
        { name: '全部', value: '全部' },
        { name: '一碑-科技产业园', value: '一碑-科技产业园' }
      ]
    }
  ]
})

/**任务状态 */
export const taskStateList = () => ({
  name: '任务状态',
  type: 'hierarchy',
  submenu: [
    { name: '待接单', value: '待接单' },
    { name: '处理中', value: '处理中' },
    { name: '待确认', value: '待确认' }
  ]
})

/**筛选受理人，关闭时限，支付状态 */
export const filterList = () => ({
  name: '筛选',
  type: 'hierarchy-column',
  submenu: [
    {
      name: '受理人',
      value: '受理人',
      submenu: [
        { name: '张三', value: '张三' }
      ]
    },
    {
      name: '关闭时限',
      value: '关闭时限',
      submenu: []
    },
    {
      name: '支付状态',
      value: '支付状态',
      submenu: []
    }
  ]
})

/**任务类型 */
export const tastTypeList = () => ({
  name: '任务状态',
  type: 'hierarchy',
  submenu: [
    { name: '全部', value: '全部' },
    { name: '报修', value: '报修' },
    { name: '报事', value: '报事' },
    { name: '咨询', value: '咨询' },
    { name: '表扬', value: '表扬' }
  ]
})

/**专业 */
export const specialList = () => ({
  name: '专业',
  type: 'hierarchy',
  submenu: []
})

/**起单来源 */
export const orderOriginList = () => ({
  name: '起单来源',
  type: 'hierarchy',
  submenu: []
})

/**是否房修 */
export const houseRepairList = () => ({
  name: '是否房修',
  type: 'hierarchy',
  submenu: []
})

/**提交时间 */
export const submitTimeList = () => ({
  name: '提交时间',
  type: 'hierarchy',
  submenu: []
})

/**处理时间 */
export const handleTimeList = () => ({
  name: '处理时间',
  type: 'hierarchy',
  submenu: []
})