import uniHttp from "./uni-request";
const servicePath = '/wycrm_6.0'; // 接口服务路径名

const wycrmApi = {}

// 获取自定义表单
wycrmApi.getQuesTaskServerSettingList = (params) => {
    const args = {
        url: servicePath + "/rest/quesTaskServerSetting/getQuesTaskServerSettingList",
        method: "POST",
        params: {
            ...params,
            header: {
                "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
            },
        },
    };
    return uniHttp.request(args);
};
wycrmApi.getFormDetailByFormId = (params) => {
    const args = {
        url: servicePath + "/rest/quesOaForm/getFormDetailByFormId",
        method: "POST",
        params: {
            ...params,
            header: {
                "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
            },
        },
    };
    return uniHttp.request(args);
};

// 获取业务分类
wycrmApi.getServerSettingTreeByServerId = (params) => {
    const args = {
        url: servicePath + "/rest/quesTaskServerSetting/getServerSettingTreeByServerId",
        method: "POST",
        params: {
            ...params,
            header: {
                "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
            },
        },
    };
    return uniHttp.request(args);
}

// 获取报价单
wycrmApi.quotationList = (params = {}) => {
    const args = {
        url: servicePath + '/rest/quesProjectSetting/quotationList',
        method: 'POST',
        params: {
            ...params,
            header: {
                "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
            }
        },
    }
    return uniHttp.request(args)
}


// 下单
wycrmApi.saveAndUpdateQuestionTask = (params = {}) => {
    const args = {
        url: servicePath + '/rest/questionTask/saveAndUpdateQuestionTask',
        method: 'POST',
        params: params,
    }
    return uniHttp.request(args)
}


// 下单
wycrmApi.getSystemSettingList = (params = {}) => {
    const args = {
        url: servicePath + '/rest/quesProjectSetting/getSystemSettingList',
        method: 'POST',
        params: {
            ...params,
            header: {
                "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
            }
        },

    }
    return uniHttp.request(args)
}



export default wycrmApi;