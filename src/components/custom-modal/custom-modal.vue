
<template>
	<u-modal 
		:show="visible" 
		width="488rpx"
		:title="title" 
		:content="content" 
		:showConfirmButton="showConfirmButton" 
		:showCancelButton="showCancelButton" 
		:confirmText="confirmText"
		:cancelText="cancelText"
		:confirmColor="confirmColor"
		:cancelColor="cancelColor"
		@confirm="confirm" 
		@cancel="cancel" 
		@close="close">
	</u-modal>
</template>

<script>

export default {
	name: 'CustomModal',
	data() {
		return {
			visible: false,
			title: '',
			content: '',
			confirmText: '',
			cancelText: '',
			showConfirmButton: true,
			showCancelButton: false,
			confirmColor: this.THEME_COLOR,
			cancelColor: '#606266',
			onConfirm: '',
			onCancel: '',
			onClose: '',
		};
	},
	props: {
		
	},
	computed: {
		
	}, 
	created() {
		
	},
	methods: {
		show(params = {}) {
			const {
				title, 
				content, 
				confirmText, 
				cancelText, 
				showConfirmButton, 
				showCancelButton = false, 
				confirmColor, 
				cancelColor,
				onConfirm,
				onCancel,
				onClose
			} = params

			const isFunction = (fn) => typeof fn === 'function'

			const d = {
				visible: true,
				title,
				content,
				confirmText,
				cancelText,
				showConfirmButton,
				showCancelButton,
				confirmColor: confirmColor || this.THEME_COLOR,
				cancelColor
			}
			Object.assign(this, d)

			this.onConfirm = isFunction(onConfirm) ? onConfirm : ''
			this.onCancel = isFunction(onCancel) ? onCancel : ''
			this.onClose = isFunction(onClose) ? onClose : ''
		},
		confirm() {
			this.visible = false
			this.$emit('confirm')
			this.onConfirm && this.onConfirm()
		},
		cancel() {
			this.visible = false
			this.$emit('cancel')
			this.onCancel && this.onCancel()
		},
		close() {
			this.visible = false
			this.$emit('close')
			this.onClose && this.onClose()
		},
	}
};
</script>
