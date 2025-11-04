import uniHttp from "./uni-request";
import appConfig from '@/app-config';
const servicePath = appConfig.LEASING_V6 ? "/energy-charging-60" : "/energy-charging"; // 接口服务路径名

// 查询仪表查表数据
export const getHistoryReadRequest = (params = {}) => {
  const args = {
    url: servicePath + "/meterRead/getHistoryReadRequest",
    method: "POST",
    params: {
      header: {
        'content-type': 'application/json'
      },
      ...params
    }
  };
  return uniHttp.request(args);
};

//查询仪表详情
export const getDeviceDetail = (params = {}) => {
  const args = {
    url: servicePath + "/newMeter/getDeviceDetail",
    method: "GET",
    params: {
      header: {
        'content-type': 'application/json'
      },
      ...params
    }
  };
  return uniHttp.request(args);
};

// 根据表号获取读数
export const getMeterInfoByNumber = (params = {}) => {
  const args = {
    url: servicePath + "/meterRead/getMeterInfoByNumber",
    method: "GET",
    params: {
      header: {
        'content-type': 'application/json'
      },
      ...params
    }
  };
  return uniHttp.request(args);
};

// 新增抄表
export const saveMeterRead = (params = {}) => {
  const args = {
    url: servicePath + "/meterRead/save",
    method: "POST",
    params: {
      header: {
        'content-type': 'application/json'
      },
      ...params
    }
  };
  return uniHttp.request(args);
};

/**
 *
*/
export const getNoReadMeter = (params = {}) => {
  const args = {
    url: servicePath + "/meterRead/getNoReadMeter",
    method: "GET",
    params: {
      header: {
        'content-type': 'application/json'
      },
      ...params
    }
  };
  return uniHttp.request(args);
};

/**
 * @description  /meter/getList   仪表登记-列表
 * @param projectId       项目id
 * @param customerId      客户id
 * @param openFlag        是否开通标识  0-未开通 1-已开通
 * @param number          表号
 * @param meterKind       仪表种类
 * @param roomIdList      房间id集合 string []
 * @param customList      自定义节点参数 object []
 */

export const getMeterList = (params = {}) => {
  const args = {
    url: servicePath + "/meter/getList",
    method: "POST",
    params: {
      header: {
        'content-type': 'application/json',

        // 'userId': 2063435,
        // 'x-companyId-header': 300,
        // 'x-user-header': 2063435,
        // 'x-userAccount-header': 'ybwlkjadmin',
        // 'x-userId-header': 2063435,
        // 'x-userName-header': '%E7%AE%A1%E7%90%86%E5%91%98',
        // 'x-userPhone-header': 17899990000
      },
      ...params
    }
  };
  return uniHttp.request(args);
};

export const getTree = (params = {}) => {
  const args = {
    url: servicePath + "/meterProject/getTree",
    method: "GET",
    params: {
      header: {
        'content-type': 'application/json'
      },
      ...params
    }
  };
  return uniHttp.request(args);
};
