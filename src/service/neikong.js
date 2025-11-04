import uniHttp from './uni-request'
import appConfig from '@/app-config';
const servicePath = appConfig.NEIKONG_V6 ? '/neikong-60' : "/neikong"; // 接口服务路径名

// 获取发票详情
export const getInvoiceDetailById = (pathArr, params = {}) => {
    const args = {
        url: servicePath + "/customerInfo/getInvoiceInfoByInfoId",
        method: "GET",
        params
    };
    return uniHttp.request(args);
};