import appConfig from '@/app-config';
const { SOCKET_DEV, SOCKET_PRO } = appConfig;
const isDev = process.env.NODE_ENV === 'development';

export default {
	"baseUrl": `${isDev ? SOCKET_DEV : SOCKET_PRO}`,
	"im": "/api-gateway/mall-core-service/websocket/im",
}