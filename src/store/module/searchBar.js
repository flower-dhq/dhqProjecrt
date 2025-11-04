import dayjs from 'dayjs'

const state = {
    data: {
        // 城市公司
        areaList: [],
        projectList: [],
        areaId: "",
        areaName:"",
        projectId: "",
        projectName:"",
        // 业务类别
        treeData: [],
        selectServerIds: [],
        // 工单性质
        orignSource: "",
        // 创建日期
        beginValue: [10, new Date().getMonth() - 1, 0],
        beginDate: dayjs().subtract(1, 'month').format("YYYY-MM-01"),
        endValue: [10, new Date().getMonth(), new Date().getDate() - 1],
        endDate: dayjs().format("YYYY-MM-DD"),
        // 工单类别
        tabType: "2", // 待我处理
        // 筛选
        filterData:{}
    },
}

const getters = {
    getDataInfo(state) {
        return JSON.parse(JSON.stringify(state.data))
    }
}

const mutations = {
    setDataInfo(state, params) {
        for (var key in params) {
            state.data[key] = params[key]
        }
    }
}

const actions = {
    actionData(context, params) {
        context.commit('setDataInfo', params)
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}