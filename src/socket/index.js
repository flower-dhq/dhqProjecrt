export default class {
	
	constructor(options) {
		const {} = options || {};
		this.socketInstace = uni.connectSocket({
			...options,
			success: () => {},
			fail: () => {},
			complete: () => {},
		});
	}
	// 监听事件
	on(params) {
		const {eventName, callback} = params || {};
		const validEventName = typeof eventName === 'string' && eventName.trim() !== '';
		const cb = typeof callback === 'function' ? callback : () => {};
		const validEvent = this.socketInstace[eventName];
		if (validEventName && validEvent) {
			this.socketInstace[eventName](({data}) => {
				let res = null
				try {
					res = JSON.parse(data)
				} catch (error) {
					res = data || null
				}
				cb({data: res})
			});
		}
	}
	// 发送事件
	aciton(params) {
		const {acitonName, payload} = params || {};
		const validAcitonName = typeof acitonName === 'string' && acitonName.trim() !== '';
		const validAciton = this.socketInstace[acitonName];
		if (validAcitonName && validAciton) this.socketInstace[acitonName](payload);
	}
	
}