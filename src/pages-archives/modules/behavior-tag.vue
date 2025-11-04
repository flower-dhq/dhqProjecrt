<template>
  <u-popup :show="isShow" :customStyle="{ height: '1200rpx', flex: 'initial' }" @close="closeEvent">
    <view :class="['behavior-tag', getCustomClass]" :style="[getCustomStyle, THEME_CSS_VAR]">
      <!-- 标题 -->
      <view class="title-panel">
        <u-icon name="close-circle" size="40rpx" color="#999999" @click="closeEvent" />
        <text class="title">客户标签</text>
        <text class="btn-confirm" @click="confirmEvent">确定</text>
      </view>
      <!-- 内容 -->
      <scroll-view :scrollTop="0" scroll-y style="flex: 1 1 auto; overflow: hidden;">
        <view class="content-panel">
          <block v-for="(item, i) in tagList" :key="i">
            <!-- 标题 -->
            <text class="kind-title">{{ item.label }}</text>
            <view class="kind-list">
              <text
                :class="['kind-item', { selected: child.selected }]"
                :style="[child.selected ? { backgroundColor: $u.colorToRgba(THEME_COLOR, 0.1) } : {}]"
                v-for="(child, j) in item.children" :key="j" @click="kindItemEvent(child, item)"
              >{{ child.label }}</text>
            </view>
          </block>
        </view>
      </scroll-view>

      <u-toast ref="messageEl" />
    </view>
  </u-popup>
</template>

<script>
import mpMixin from '@/js/mixin/mpMixin'
import { getPeopleTags } from '@/service/community'
import { updateCustomerTagForMoreIds } from '@/service/community'

/**
 * 客户标签
 */
export default {
  name: 'BehaviorTag',
  mixins: [mpMixin],
  props: {
    show: Boolean,
    // 默认标签
    defaultTag: {
      type: Array,
      default: () => []
    },
    // 统一会员id
    unifiedMemberId: {
      type: String,
      default: ''
    }
  },
  data() {
    let { O_USER_INFO } = this.$constant;
    let userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' });
    let companyId = userInfo.companyId ? userInfo.companyId : this.$appConfig.COMPLANY_ID;

    return {
      companyId:companyId,
      tagList: [
        // {
        //   label: '会员等级',
        //   name: 'level',
        //   children: [
        //     { label: '青铜会员', name: 1, selected: false },
        //   ]
        // }
      ]
    }
  },
  computed: {
    isShow: {
      get() {
        this.setDefaultSelect()
        return this.show
      },
      set(val) {
        this.$emit('update:show', val)
      }
    },
  },
  created() {
    this.getPeopleTags()
  },
  methods: {
    closeEvent() {
      this.isShow = false
      this.tagList = this.tagList.map((parent) => ({
        ...parent,
        children: parent.children.map((child) => ({
          ...child,
          selected: false
        }))
      }))
    },
    confirmEvent() {
      const params = this.getSelectedNode()
      if (params.length == 0) {
        this.$refs.messageEl.show({
          type: 'default',
          message: '至少选择一个标签'
        })
        return
      }
      this.updateTag(params)
    },
    // 获取被选中节点
    getSelectedNode() {
      const res = this.tagList.reduce((store, parent) => {
        const childItem = parent.children
          .filter((child) => child.selected)
          .map((child) => ({ tagId: child.name, tagName: child.label, dimensionId: parent.name }))

        return store.concat(childItem)
      }, [])

      return res
    },
    kindItemEvent(item, parent) {
      const isSel = item.selected

      if (parent.dimensionType == '0') {
        // 单选
        parent.children.forEach(child => {
          this.$set(child, 'selected', false)
        })
      } else if (parent.dimensionType == '1') {
        // 多选
      }

      this.$set(item, 'selected', !isSel)
    },
    // 设置默认被选中的节点
    setDefaultSelect() {
      this.defaultTag.forEach((item) => {
        this.tagList.some((parent) => {
          if (parent.name === item.dimensionId) {
            parent.children.some((child) => {
              if (child.name === item.tagId) {
                // 被选中的节点
                this.$set(child, 'selected', true)
                return true
              }
              return false
            })
            return true
          }
          return false
        })
      })
    },
    // 获取标签列表
    async getPeopleTags() {
      const params = {
        data: {
          companyId: this.companyId,
        },
        hideLoading: true,
        responseToast: false
      }
      const res = await getPeopleTags(params)
      this.tagList = (res.data || []).map((item) => {
        const children = (item.tagList || []).map((child) => ({
          label: child.tagName,
          name: child.tagId,
          selected: false
        }))

        return {
          dimensionType: item.dimensionType, // 0: 单选; 1: 多选
          label: item.dimensionName,
          name: item.dimensionId,
          children
        }
      })
    },
    // 更新业主的标签
    async updateTag(tagList) {
      let { O_USER_INFO } = this.$constant
      let userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' })
      const params = {
        data: {
          unifiedMemberId: this.unifiedMemberId,
          userId: userInfo.userId,
          companyId: this.companyId,
          labelList: tagList,
          originSystem: 1, // 0: 客户系统, 1: 小程序, 2: 社区
        },
        hideLoading: true,
        responseToast: false
      }
      const res = await updateCustomerTagForMoreIds(params)
      if (res.status == 200) {
        this.closeEvent()
        this.$emit('confirm')
      } else {
        this.$refs.messageEl.show({
          type: 'default',
          message: res.message
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.behavior-tag {
  display: flex;
  flex-direction: column;
  font-family: "PingFang SC";
  width: 100%;
  flex: 1 1 auto;
  overflow: hidden;
}
.title-panel {
  display: flex;
  align-items: center;
  flex: 0 0 auto;
  padding: 26rpx 40rpx;
  box-sizing: border-box;
  border-bottom: 1px solid #EAEAEA;

  .title {
    flex: 1 1 auto;
    color: #333;
    font-weight: bold;
    font-size: 32rpx;
    text-align: center;
  }
  .btn-confirm {
    flex: 0 0 auto;
    color: var(--app-primary-color);
    font-size: 30rpx;
  }
}
.scroll-panel {
  flex: 0 0 auto;
}
.content-panel {
  display: flex;
  flex-direction: column;
  padding: 0 40rpx 40rpx;
  box-sizing: border-box;
}
.kind-title {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
  padding-top: 40rpx;
  padding-bottom: 16rpx;
}
.kind-list {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16rpx 24rpx;
}
.kind-item {
  min-height: 36rpx;
  text-align: center;
  padding: 12rpx;
  background-color: #F2F2F2;
  font-size: 24rpx;
  color: #666;
  border-radius: 4rpx;
  box-sizing: border-box;
  border: 1px solid #F2F2F2;

  &.selected {
    border: 1px solid var(--app-primary-color);
    color: var(--app-primary-color);
  }
}
</style>