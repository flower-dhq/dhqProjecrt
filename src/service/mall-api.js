/**
 * 接口文档
 * 商城订单服务文档：https://ebeitest.wuyeface.com:1188/ebei-gateway/mall-order-service/swagger-ui.html
 * 商城商品服务文档：https://ebeitest.wuyeface.com:1188/ebei-gateway/mall-goods-service/swagger-ui.html
 * 商城核心服务文档：https://ebeitest.wuyeface.com:1188/ebei-gateway/mall-core-service/swagger-ui.html
 */
import { loginByMemberId, getUserInfo,getTokenLogin } from '@/service/api-gateway';
import uniHttp from './uni-request';
const servicePath = '/api-gateway'; // 接口服务路径名

// 接口集合
const apiModule = {}

// 大模块
apiModule.data = {
	// 统计流量
	addNumberOfVisits: () => {
		const arg = {
			url: servicePath + '/mall-core-service/app/numberOfVisits/addNumberOfVisits',
			params: {responseToast: false},
			method: 'GET'
		}
		return uniHttp.request(arg)
	},
	getBanner: (postParams) => {
		const arg = {
			url: servicePath + '/mall-core-service/app/advert/list',
			params: postParams || {},
			method: 'POST'
		}
		return uniHttp.request(arg)
	},
	getApecialArea: (postParams) => {
		const arg = {
			url: servicePath + '/mall-core-service/app/sysConfig/getMallFunctionalAreaConfig',
			params: postParams || {},
			method: 'GET'
		}
		return uniHttp.request(arg)
	},
	userAuth(postParams) {
		const arg = {
			url: servicePath + '/mall-core-service/app/member/login',
			params: postParams || {},
			method: 'POST',
		}
		return uniHttp.request(arg)
	},
	getUserInfo,
	getPayResult: (postParams) => {
		const arg = {
			url: servicePath + '/mall-order-service/app/order/order-result',
			params: postParams || {},
			method: 'GET'
		}
		return uniHttp.request(arg)
	},
	submitOrder: (postParams) => {
		const arg = {
			url: servicePath + '/mall-order-service/app/order/submit-order',
			params: postParams || {},
			method: 'POST'
		}
		return uniHttp.request(arg)
	},
	cancelOrder: (postParams) => {
		const arg = {
			url: servicePath + '/mall-order-service/app/order/order-cancel',
			params: postParams || {},
			method: 'GET'
		}
		return uniHttp.request(arg)
	},
	payOrder: (postParams) => {
		const arg = {
			url: servicePath + '/mall-order-service/app/order/order-pay',
			params: postParams || {},
			method: 'POST'
		}
		return uniHttp.request(arg)
	},
	goodsConfirmReceipt: (postParams) => {
		const arg = {
			url: servicePath + '/mall-order-service/app/order/order-confirm-receipt',
			params: postParams || {},
			method: 'GET'
		}
		return uniHttp.request(arg)
	},
	getGoodsOrderList: (postParams) => {
		const arg = {
			url: servicePath + '/mall-order-service/app/order/page',
			params: postParams || {},
			method: 'POST'
		}
		return uniHttp.request(arg)
	},
	getGoodsOrderTotal: (postParams) => {
		const arg = {
			url: servicePath + '/mall-order-service/app/order/total',
			params: postParams || {},
			method: 'POST'
		}
		return uniHttp.request(arg)
	},
	getOrderById: (postParams) => {
		const arg = {
			url: servicePath + '/mall-order-service/app/order/byId',
			params: postParams || {},
			method: 'GET'
		}
		return uniHttp.request(arg)
	},
	getPromotionGoods: (postParams) => {
		const arg = {
			url: servicePath + '/mall-goods-service/app/mgdGoodsModule/getPromotionGoods',
			params: postParams || {},
			method: 'POST'
		}
		return uniHttp.request(arg)
	},
	getLogisticsInfo: (postParams) => {
		const arg = {
			url: servicePath + '/mall-order-service/app/order/express-list',
			params: postParams || {},
			method: 'GET'
		}
		return uniHttp.request(arg)
	},
	getRecommendGoods: (postParams) => {
		const arg = {
			url: servicePath + '/mall-goods-service/app/mgdGoodsCustom/recommendToYou/page',
			params: postParams || {},
			method: 'POST'
		}
		return uniHttp.request(arg)
	},
	getProvince: (postParams) => {
		const arg = {
			url: servicePath + '/mall-core-service/app/tsregioninfo/getProvince',
			params: postParams || {},
			method: 'POST'
		}
		return uniHttp.request(arg)
	},
	getCity: (postParams) => {
		const arg = {
			url: servicePath + '/mall-core-service/app/tsregioninfo/getCity',
			params: postParams || {},
			method: 'POST'
		}
		return uniHttp.request(arg)
	},
	getArea: (postParams) => {
		const arg = {
			url: servicePath + '/mall-core-service/app/tsregioninfo/getArea',
			params: postParams || {},
			method: 'POST'
		}
		return uniHttp.request(arg)
	},
	getStreet: (postParams) => {
		const arg = {
			url: servicePath + '/mall-core-service/app/tsregioninfo/getStreet',
			params: postParams || {},
			method: 'POST'
		}
		return uniHttp.request(arg)
	},
	getAllProvince: () => {
		const arg = {
			url: servicePath + '/mall-core-service/app/regionInfo/getProvince',
			params:  {
				hideLoading: true,
			},
			method: 'GET'
		}
		return uniHttp.request(arg)
	},
	getChildrenCity: (params) => {
		const arg = {
			url: servicePath + `/mall-core-service/app/regionInfo/getChildren/${params}`,
			params: {
				hideLoading: true,
			},
			method: 'GET'
		}
		return uniHttp.request(arg)
	},
	getIpAddress(postParams = {}) {
		const { hideLoading, loadingText } = postParams;
		return new Promise((resolve) => {
				const showLoading = hideLoading === false;
				if (showLoading) uni.showLoading({ title: loadingText || '加载中' });
				uniHttp.request({
					url: servicePath + '/mall-core-service/ip/getIpAddr',
					method: 'GET',
					params: {}
				}).then(res => {
					resolve(res)
				}).finally(() => {
					if (showLoading) uni.hideLoading();
				})
			})
	},
	getShopList: (postParams) => {
		const arg = {
			url: servicePath + '/mall-core-service/app/sellerInfo/page',
			params: postParams || {},
			method: 'POST'
		}
		return uniHttp.request(arg)
	},
	addrList: (postParams) => {
		const arg = {
			url: servicePath + '/mall-core-service/app/receivingAddress/select',
			params: postParams || {},
			method: 'GET'
		}
		return uniHttp.request(arg)
	},
	creatAddr: (postParams) => {
		const arg = {
			url: servicePath + '/mall-core-service/app/receivingAddress/add',
			params: postParams || {},
			method: 'POST'
		}
		return uniHttp.request(arg)
	},
	editAddr: (postParams) => {
		const arg = {
			url: servicePath + '/mall-core-service/app/receivingAddress/update',
			params: postParams || {},
			method: 'POST'
		}
		return uniHttp.request(arg)
	},
	deleteAddr: (postParams) => {
		const arg = {
			url: servicePath + '/mall-core-service/app/receivingAddress/del',
			params: postParams || {},
			method: 'GET'
		}
		return uniHttp.request(arg)
	},
	setDefaultAddr: (postParams) => {
		const arg = {
			url: servicePath + '/mall-core-service/app/receivingAddress/update',
			params: postParams || {},
			method: 'POST'
		}
		return uniHttp.request(arg)
	},
	getGoodsByShopId: (postParams) => {
		const arg = {
			// url: servicePath + '/mall-goods-service/app/mgdGoodsModule/getGoodsBySellerId',
			url: servicePath + '/mall-goods-service/app/mgdGoodsModule/seller/search',
			params: postParams || {},
			method: 'POST'
		}
		return uniHttp.request(arg)
	},
	getCommentByShopId: (postParams) => {
		const arg = {
			url: servicePath + '/mall-goods-service/app/mgdGoodsReviews/getAllCommentBySellerId',
			params: postParams || {},
			method: 'GET'
		}
		return uniHttp.request(arg)
	},
	//是否支持线下支付
	supportOfflinePay: (postParams) => {
		const arg = {
			url: servicePath + '/mall-core-service/app/sellerInfo/getSellerIsSupportOfflinePayBySellerId',
			params: postParams || {},
			method: 'GET',
		}
		return uniHttp.request(arg)
	},
	getShopDetail: (postParams) => {
		const arg = {
			url: servicePath + '/mall-core-service/app/sellerInfo/byId',
			params: postParams || {},
			method: 'GET'
		}
		return uniHttp.request(arg)
	},
	// APP会员管理模块——绑定商家账号
	bindSellerUser(params) {
		const arg = {
			url: servicePath + '/mall-core-service/app/member/bindSellerUser',
			params: params || {},
			method: 'POST'
		}
		return uniHttp.request(arg)
	},
	getMemberIntegralValue: (postParams) => {
		const arg = {
			url: servicePath + '/mall-core-service/app/member/getMemberIntegralValue',
			params: postParams || {},
			method: 'GET'
		}
		return uniHttp.request(arg)
	},
	getCustomBarGoods: (postParams) => {
		const arg = {
			url: servicePath + '/mall-goods-service/app/mgdGoodsCustom/page',
			params: postParams || {},
			method: 'POST'
		}
		return uniHttp.request(arg)
	},
	getRecommendGoodsList: (postParams) => {
		const arg = {
			url: servicePath + '/mall-goods-service/app/mgdGoodsCustom/recommendGoodsList',
			params: postParams || {},
			method: 'POST'
		}
		return uniHttp.request(arg)
	},
	getProjectCity: (postParams) => {
		const arg = {
			url: servicePath + '/mall-core-service/app/project/getCityList',
			params: postParams || {},
			method: 'GET'
		}
		return uniHttp.request(arg)
	},
	getProjectListByCity: (postParams) => {
		const arg = {
			url: servicePath + '/mall-core-service/app/project/getProjectListByCity',
			params: postParams || {},
			method: 'GET'
		}
		return uniHttp.request(arg)
	},
	loginByMemberId,
	getTokenLogin,
	// 获取系统消息列表
	getSystemMsgList: (postParams) => {
		const arg = {
			url: servicePath + '/mall-core-service/app/message/page',
			params: postParams || {},
			method: 'POST'
		}
		return uniHttp.request(arg)
	},
	// 系统消息置顶
	systemMsg2top: (postParams) => {
		const arg = {
			url: servicePath + '/mall-core-service/app/message/topSession',
			params: postParams || {},
			method: 'GET'
		}
		return uniHttp.request(arg)
	},
	// 删除系统消息
	delSystemMsg: (postParams) => {
		const arg = {
			url: servicePath + '/mall-core-service/app/message/topSession',
			params: postParams || {},
			method: 'GET'
		}
		return uniHttp.request(arg)
	},
	// 根据id获取消息列表(类型会话)
	getSessionMsgListByType: (postParams) => {
		const arg = {
			url: servicePath + '/mall-core-service/app/message/byType',
			params: postParams || {},
			method: 'GET'
		}
		return uniHttp.request(arg)
	},
	// 获取首页未读消息数量
	getUnreadMsgNum: (postParams) => {
		const arg = {
			url: servicePath + '/mall-core-service/app/message/getTotalUnread',
			params: postParams || {},
			method: 'GET'
		}
		return uniHttp.request(arg)
	},
	getUnreadMsgNum: (postParams) => {
		const arg = {
			url: servicePath + '/mall-core-service/app/message/getTotalUnread',
			params: postParams || {},
			method: 'GET'
		}
		return uniHttp.request(arg)
	},
	getExpressFee: (postParams) => {
		const arg = {
			url: servicePath + '/mall-goods-service/app/mgdGoodsModule/queryDeliveryPrice',
			params: postParams || {},
			method: 'POST'
		}
		return uniHttp.request(arg)
	},
	querySeckillSn: (postParams) => {
		const arg = {
			url: servicePath + '/mall-seckill-service/app/goods/seckill',
			params: postParams || {},
			method: 'POST'
		}
		return uniHttp.request(arg)
	}, 
	// 获取分享海报参数
	getShareContent: (postParams) => {
		const arg = {
			url: servicePath + '/mall-core-service/app/share/getShareContent',
			params: postParams || {},
			method: 'POST'
		}
		return uniHttp.request(arg)
	}, 
	// 获取小程序分享海报参数
	getShareMiniParams: (postParams) => {
		const arg = {
			url: servicePath + '/mall-core-service/app/share/getParamsByCode',
			params: postParams || {},
			method: 'GET'
		}
		return uniHttp.request(arg)
	},
	// 存储海报二维码打开小程序的参数
	setShareMiniParams: (postParams) => {
		const arg = {
			url: servicePath + '/mall-core-service/app/share/setParams',
			params: postParams || {},
			method: 'GET'
		}
		return uniHttp.request(arg)
	},
	// 获取上次填写的发票信息
	getInvoiceInfo: (params) => {
		const arg = {
			url: servicePath + '/mall-order-service/app/order/getInvoiceInfo',
			params: params || {},
			method: 'GET'
		}
		return uniHttp.request(arg)
	}, 
	// 员工认证——获取公司列表
	getCompany: (params) => {
		const arg = {
			url: servicePath + '/mall-core-service/app/project/getCompany',
			params: params || {},
			method: 'GET'
		}
		return uniHttp.request(arg)
	}, 
	// 员工认证——获取岗位列表
	getJobArchList: (params) => {
		const arg = {
			url: servicePath + `/mall-core-service/app/project/getJobArchList/${params}`,
			params: {},
			method: 'GET'
		}
		return uniHttp.request(arg)
	}, 
	// 员工认证——获取项目
	getProject: (params) => {
		const arg = {
			url: servicePath + `/mall-core-service/app/project/getProject/${params}`,
			params: {},
			method: 'GET'
		}
		return uniHttp.request(arg)
	}, 
	// 员工认证——提交
	staffAuth: (params) => {
		const arg = {
			url: servicePath + '/mall-core-service/app/member/staffAuth',
			params: params || {},
			method: 'POST'
		}
		return uniHttp.request(arg)
	}, 
	// 获取手机验证码（绑定手机）
	getSmsCode: (params) => {
		const arg = {
			url: servicePath + '/mall-core-service/app/member/getSmsCode',
			params: params || {},
			method: 'POST'
		}
		return uniHttp.request(arg)
	}, 
	// 绑定手机号码
	bindPhoneNumber: (params) => {
		const arg = {
			url: servicePath + '/mall-core-service/app/member/bindPhone',
			params: params || {},
			method: 'POST'
		}
		return uniHttp.request(arg)
	},
	// 获取公众号id
	getMpAppIdById: (params) => {
		const arg = {
			url: servicePath + '/mall-core-service/app/member/getMpAppIdById',
			params: params || {},
			method: 'GET'
		}
		return uniHttp.request(arg)
	}, 
	// 获取积分明细
	getIntegralDetailList: (params) => {
		const arg = {
			url: servicePath + '/mall-core-service/app/member/page',
			params: params || {},
			method: 'POST'
		}
		return uniHttp.request(arg)
	}, 
	// 获取会员可用积分
	getMemberIntegralValue: (params) => {
		const arg = {
			url: servicePath + '/mall-core-service/app/member/getMemberIntegralValue',
			params: params || {},
			method: 'GET'
		}
		return uniHttp.request(arg)
	}, 
	// 获取搜索历史记录
	getSearchHistoryRecord: (params) => {
		const arg = {
			url: servicePath + '/mall-goods-service/app/mgdHistorySearch/getByMemberId',
			params: params || {},
			method: 'GET'
		}
		return uniHttp.request(arg)
	}, 
	// 删除搜索记录
	deleteSearchHistory: (params) => {
		const arg = {
			url: servicePath + '/mall-goods-service/app/mgdHistorySearch/deleteByIds',
			params: params || {},
			method: 'POST'
		}
		return uniHttp.request(arg)
	}, 
	// 获取热门关键词
	getHotKeywordList: (params) => {
		const arg = {
			url: servicePath + '/mall-goods-service/app/mgdRecommended/hotSearchPage',
			params: params || {},
			method: 'GET'
		}
		return uniHttp.request(arg)
	}, 
	// 获取可用优惠券
	getUsableCoupon: (params) => {
		const arg = {
			url: servicePath + '/mall-goods-service/app/coupon/getUsable',
			params: params || {},
			method: 'POST'
		}
		return uniHttp.request(arg)
	}, 
	// 确认使用优惠券
	useCoupon: (params) => {
		const arg = {
			url: servicePath + '/mall-goods-service/app/coupon/useCoupon',
			params: params || {},
			method: 'POST'
		}
		return uniHttp.request(arg)
	}, 
	// 分享海报——获取系统配置的系统logo图
	getConfigByCode: (params) => {
		const arg = {
			url: servicePath + `/mall-core-service/app/sysConfig/getConfigByConfigCode`,
			params,
			method: 'GET'
		}
		return uniHttp.request(arg)
	}, 
	// 获取业主房产信息
	getOwnerHouseInfo: (params) => {
		const arg = {
			url: '/community/ownerAuthInfo/getListByMemberId',
			params: params || {},
			method: 'POST'
		}
		return uniHttp.request(arg)
	},
	// 获取优惠券活动详情
	getCouponDetail: (params) => {
		const arg = {
			url: servicePath + '/mall-goods-service/app/mgdCouponActivity/byId',
			params: params || {},
			method: 'GET'
		}
		return uniHttp.request(arg)
	},
	// 领取优惠券活动详情
	receiveActivityCoupon: (params) => {
		const arg = {
			url: servicePath + '/mall-goods-service/app/coupon/receiveCouponByActivity',
			params: params || {},
			method: 'POST'
		}
		return uniHttp.request(arg)
	},
	// 读取系统消息
	readSystemMessage: (params) => {
		const arg = {
			url: servicePath + '/mall-core-service/app/message/readMessage',
			params: params || {},
			method: 'POST'
		}
		return uniHttp.request(arg)
	},
	// 读取聊天记录
	findSessionMessage: (params) => {
		const arg = {
			url: servicePath + '/mall-core-service/app/message/findSessionMessage',
			params: params || {},
			method: 'POST'
		}
		return uniHttp.request(arg)
	},
	// 创建会话
	createSession: (params) => {
		const arg = {
			url: servicePath + '/mall-core-service/app/message/createSession',
			params: params || {},
			method: 'GET'
		}
		return uniHttp.request(arg)
	},
	// 读取会话消息
	readSessionMessage: (params) => {
		const arg = {
			url: servicePath + '/mall-core-service/app/message/readMessageBySessionId',
			params: params || {},
			method: 'GET'
		}
		return uniHttp.request(arg)
	},
	// 注销登录
	logout: (params) => {
		const arg = {
			url: servicePath + '/mall-core-service/app/member/logout',
			params: params || {},
			method: 'GET'
		}
		return uniHttp.request(arg)
	},
	// 查询会员绑定商家账号
	sellerUserPage: (params) => {
		const arg = {
			url: servicePath + '/mall-core-service/app/sellerInfo/SellerUserPage',
			params: params || {},
			method: 'POST'
		}
		return uniHttp.request(arg)
	},
	// 解绑商家账号
	unbindSellerUser: (params) => {
		const arg = {
			url: servicePath + '/mall-core-service/app/sellerInfo/unbindSellerUser',
			params: params || {},
			method: 'GET'
		}
		return uniHttp.request(arg)
	},
	// 售后条件前置校验
	afterSalePreCheck: (params) => {
		const arg = {
			url: servicePath + '/mall-order-service/app/afterSale/preCheck',
			params: params || {},
			method: 'GET'
		}
		return uniHttp.request(arg)
	},
	// 获取评价列表
	getEvaluation: (params) => {
		const arg = {
			url: servicePath + '/mall-order-service/app/order/order-goods/page',
			params: params || {},
			method: 'GET'
		}
		return uniHttp.request(arg)
	},
	// 业主登录
	appletLogin: (params) => {
		const arg = {
			url: '/community/wechatInfo/appletLogin',
			params: params || {},
			method: 'POST'
		}
		return uniHttp.request(arg)
	},
	// 根据ip获取城市
	getCityByIp: (params) => {
		const arg = {
			url: servicePath + '/mall-core-service/ip/getCityByIp',
			params: params || {},
			method: 'GET'
		}
		return uniHttp.request(arg)
	},

}

// 商品详情模块
apiModule.shop = {
	/**************
	 * 商品信息
	 **************/
	getGoodsById(params) {
		const arg = {
			url: servicePath + '/mall-goods-service/app/mgdGoodsModule/byId',
			params: params || {},
			method: 'GET'
		}
		return uniHttp.request(arg)
	},
	getGoodsDetailByGmId(params) {
		const arg = {
			url: servicePath + '/mall-goods-service/app/mgdGoodsModule/getDeliveriesByGmId/' + params.gmId,
			params: params || {},
			method: 'GET'
		}
		return uniHttp.request(arg)
	},
	// 地址参数 /size/current
	getGoodsList(params) {
		const arg = {
			// url: servicePath + '/mall-goods-service/app/mgdGoodsModule/page',
			url: servicePath + '/mall-goods-service/app/mgdGoodsModule/search',
			params: params || {},
			method: 'POST'
		}
		return uniHttp.request(arg)
	},
	// 不配送的区域   gmId
	queryGoodsNoDeliveryArea(params) {
		const arg = {
			url: servicePath + '/mall-goods-service/app/mgdGoodsModule/queryGoodsNoDeliveryArea/' + params.gmId,
			params: params || {},
			method: 'GET'
		}
		return uniHttp.request(arg)
	},

	/**************
	 * 商品评论
	 **************/
	getCommentbyGmId(params) {
		const arg = {
			url: servicePath + '/mall-goods-service/app/mgdGoodsReviews/getCommentbyGmId',
			params: params || {},
			method: 'GET'
		}
		return uniHttp.request(arg)
	},
	getCountOfComment(params) {
		const arg = {
			url: servicePath + '/mall-goods-service/app/mgdGoodsReviews/getCountDataByGmId',
			params: params || {},
			method: 'GET'
		}
		return uniHttp.request(arg)
	},
	addShopComment(params) {
		const arg = {
			url: servicePath + '/mall-goods-service/app/mgdGoodsReviews/saveOrUpdate',
			params: params || {},
			method: 'POST'
		}
		return uniHttp.request(arg)
	},

	/**************
	 * 购物车
	 **************/
	addShopCart(params) {
		const arg = {
			url: servicePath + '/mall-goods-service/app/shoppingCart/addShoppingCart',
			params: params || {},
			method: 'POST'
		}
		return uniHttp.request(arg)
	},
	// 地址参数 /userId
	getShopCartList(params) {
		const arg = {
			url: servicePath + '/mall-goods-service/app/shoppingCart/list',
			params: params || {},
			method: 'GET'
		}
		return uniHttp.request(arg)
	},
	delShopCart(params) {
		const arg = {
			url: servicePath + '/mall-goods-service/app/shoppingCart/delete',
			params: params || {},
			method: 'POST'
		}
		return uniHttp.request(arg)
	},
	editShopNum(params) {
		const arg = {
			url: servicePath + '/mall-goods-service/app/shoppingCart/editShoppingCart',
			params: params || {},
			method: 'POST'
		}
		return uniHttp.request(arg)
	},

	/**************
	 * 商品收藏夹
	 **************/
	editorFavorites(params) {
		const arg = {
			url: servicePath + '/mall-goods-service/app/mgdFavoritesForGoods/favorites',
			params: params || {},
			method: 'POST'
		}
		return uniHttp.request(arg)
	},
	getFavoritesList(params) {
		const arg = {
			url: servicePath + '/mall-goods-service/app/mgdFavoritesForGoods/selectGoodsFavorites',
			params: params || {},
			method: 'GET'
		}
		return uniHttp.request(arg)
	},
	
	/**************
	 * 售后订单
	 **************/
	// 地址参数 /asId(售后订单id)
	getAfterSaleById(params) {
		const arg = {
			url: servicePath + '/mall-order-service/app/afterSale/byId',
			params: params || {},
			method: 'GET'
		}
		return uniHttp.request(arg)
	},
	// 地址参数 /asId(售后订单id)
	delAfterSaleById(params) {
		const arg = {
			url: servicePath + '/mall-order-service/app/afterSale/delete',
			params: params || {},
			method: 'GET'
		}
		return uniHttp.request(arg)
	},
	// 地址参数 /asId(售后订单id)
	cancelAfterSaleById(params) {
		const arg = {
			url: servicePath + '/mall-order-service/app/afterSale/cancel',
			params: params || {},
			method: 'GET'
		}
		return uniHttp.request(arg)
	},
	// 地址参数 /size/current
	getAfterSaleByPage(params) {
		const arg = {
			url: servicePath + '/mall-order-service/app/afterSale/page',
			params: params || {},
			method: 'POST'
		}
		return uniHttp.request(arg)
	},
	// 地址参数 /memberId(用户id)
	getAfterSaleCount(params) {
		const arg = {
			url: servicePath + '/mall-order-service/app/afterSale/countNum',
			params: params || {},
			method: 'GET'
		}
		return uniHttp.request(arg)
	},
	addAfterSale(params) {
		const arg = {
			url: servicePath + '/mall-order-service/app/afterSale/addAfterSale',
			params: params || {},
			method: 'POST'
		}
		return uniHttp.request(arg)
	},
	// 地址参数 /asId(售后id)
	getOperationRecord(params) {
		const arg = {
			url: servicePath + '/mall-order-service/app/afterSale/operationRecord',
			params: params || {},
			method: 'GET'
		}
		return uniHttp.request(arg)
	},
	submitOrderNum(params) {
		const arg = {
			url: servicePath + '/mall-order-service/app/afterSale/updateExpressState',
			params: params || {},
			method: 'POST'
		}
		return uniHttp.request(arg)
	},
	getAfterSaleReason() {
		const arg = {
			url: servicePath + '/mall-order-service/app/afterSale/getAfterSaleReason/afterSaleReason',
			params: {},
			method: 'GET'
		}
		return uniHttp.request(arg)
	},

	/**************
	 * 商品分类
	 **************/
	getFirstLevelCategory(params) {
		const arg = {
			url: servicePath + '/mall-goods-service/app/mgdGoodsCategory/getFirstLevelCategory',
			params: params || {},
			method: 'GET'
		}
		return uniHttp.request(arg)
	},
	// 地址参数 /id(分类id)
	getCategoryChildById(params) {
		const arg = {
			url: servicePath + '/mall-goods-service/app/mgdGoodsCategory/getCategoryChildrenTree',
			params: params || {},
			method: 'GET'
		}
		return uniHttp.request(arg)
	}
	,

	/**************
	 * 商品拼团
	 **************/
	// 地址参数 /size/current
	 getGroupOrder(params) {
		const arg = {
			url: servicePath + '/mall-order-service/app/order/group-order-page',
			params: params || {},
			method: 'POST'
		}
		return uniHttp.request(arg)
	},

	// 查询店铺关注状态
	querySellerFavoritesState(params) {
		const arg = {
			url: servicePath + '/mall-goods-service/app/mgdFavoritesForGoods/querySellerFavoritesState',
			params: params || {},
			method: 'GET'
		}
		return uniHttp.request(arg)
	},
	// 查询收藏店铺列表
	selectSellersFavorites(params) {
		const arg = {
			url: servicePath + '/mall-goods-service/app/mgdFavoritesForGoods/selectSellersFavorites',
			params: params || {},
			method: 'GET'
		}
		return uniHttp.request(arg)
	},
	// 查询三个月内商品浏览记录
	selectBrowsingRecords(params) {
		const arg = {
			url: servicePath + '/mall-goods-service/app/mgdGoodsBrowsingRecords/selectRecords',
			params: params || {},
			method: 'GET'
		}
		return uniHttp.request(arg)
	},

	/**************
	 * 优惠券
	 **************/
	// 地址参数 /size/current
	getMineCouponList(params) {
		const arg = {
			url: servicePath + '/mall-goods-service/app/coupon/page',
			params: params || {},
			method: 'POST'
		}
		return uniHttp.request(arg)
	},
	// 地址参数 /size/current
	getShopCouponList(params) {
		const arg = {
			url: servicePath + '/mall-goods-service/app/coupon/available',
			params: params || {},
			method: 'POST'
		}
		return uniHttp.request(arg)
	},
	// 领券中心
	getCouponManageList(params) {
		const arg = {
			url: servicePath + '/mall-goods-service/app/mgdCouponActivity/couponCenter',
			params: params || {},
			method: 'GET'
		}
		return uniHttp.request(arg)
	},
	// 地址参数 /originId/identifyParam 
	receiveCoupon(params) {
		const arg = {
			url: servicePath + '/mall-goods-service/app/coupon/receiveCoupon',
			params: params || {},
			method: 'GET'
		}
		return uniHttp.request(arg)
	},
	// 地址参数 /originId
	receiveCouponByCouponCenter(params) {
		const arg = {
			url: servicePath + '/mall-goods-service/app/coupon/receiveCouponByCouponCenter',
			params: params || {},
			method: 'GET'
		}
		return uniHttp.request(arg)
	},
	// 降价通知
	setMgdGoodsDiscountNotice(params) {
		const arg = {
			url: servicePath + '/mall-goods-service/app/mgdGoodsDiscountNotice/save',
			params: params || {},
			method: 'POST'
		}
		return uniHttp.request(arg)
	},
	// 是否开启了降价通知
	getNoticetype(params) {
		const arg = {
			url: servicePath + '/mall-goods-service/app/mgdGoodsDiscountNotice/queryNoticeState',
			params: params || {},
			method: 'POST',
		}
		return uniHttp.request(arg)
	},
}

// 文件模块 
apiModule.file = {
	uploadFormData(postParams) {
		const arg = {
			url: '/upload/files',
			params: postParams || {},
			apiType: 'upload'
		}
		return uniHttp.request(arg);
	},
	uploadSingleFile({ fileType, filePath, name }) {
		const arg = {
			url: servicePath + '/mall-core-service/file/uploadSingleFile',
			params: {
				hideLoading: true,
				fileType: fileType || 'image,video,audio',
				filePath, // 文件的本地路径
				name, // 文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容
			},
			apiType: 'upload',
		}
		return uniHttp.request(arg)
	},
	uploadSingleFileByBase64(postParams) {
		const arg = {
			url: servicePath + '/mall-core-service/file/uploadSingleFileByBase64',
			params: postParams || {},
			method: 'POST'
		}
		return uniHttp.request(arg);
	}
}

export default apiModule
