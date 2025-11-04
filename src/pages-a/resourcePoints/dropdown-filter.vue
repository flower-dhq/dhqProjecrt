<template>
    <dropdown-menu navHeight="88rpx" :navIndex="10" contentHeight="auto" maskTop="180rpx" :dataForm="filterForm"
        ref="dropdownEl" @showMask="showMenuEvent" @hideMask="hideMenuEvent">
        <template  v-slot="{ item }">
            <!-- 状态 -->
            <dropdown-radio :show="item.name == 'status'" :value="searchForm.usingState" :data="statusList"
                @confirm="confirmEvent('status', $event)" />
            <!-- 分类 -->
            <dropdown-radio :customClass="'classheight'" :show="item.name == 'classification'" :value="searchForm.resourceMenuIds" :data="zyList"
                @confirm="confirmEvent('classification', $event)" />
            <!--属性 -->
            <dropdown-radio :show="item.name == 'properties'" :value="searchForm.resourceType" :data="propertiesList"
                @confirm="confirmEvent('properties', $event)" />
        </template>
    </dropdown-menu>
</template>
  
<script>
import DropdownMenu from '@/components/dropdown-area/dropdown-menu.vue'
import DropdownRadio from '@/components/dropdown-area/dropdown-radio.vue'
export default {
    name: 'DropdownFilter',
    components: {
        DropdownMenu,
        DropdownRadio,
    },
    props: { 
        isZongFlag: {
            type: String,
            default: ''
        },
        // filterList: {
        //     type: Array,
        //     default: []
        // },
        zyList: {
            type: Array,
            default: []
        }
    },
    data() {
        return {
            filterForm:[
                { label: '状态', name: 'status', icon: 'down-icon' },
                { label: '分类', name: 'classification', icon: 'down-icon' },
                { label: '属性', name: 'properties', icon: 'down-icon' },
            ],
            statusList: [
                { label: '全部', name: '' },
                { label: '空置', name: '1' },
                { label: '出租', name: '3' }],
            propertiesList: [
                { label: '全部', name: '' },
                { label: '单一资源', name: '1' },
                { label: '公共资源', name: '2' },
            ],
            searchForm: {
                usingState: '',
                resourceType: '',
                resourceMenuIds: '',

            }
        }
    },
    methods: {

        // 显示菜单栏
        showMenuEvent(item) {
        },
        // 隐藏菜单栏
        hideMenuEvent() {
        },
        confirmEvent(name, item) {
            console.log('民资',name);
            this.$refs.dropdownEl.showMaskEvent(false) 

            if (name == 'status') {
                this.searchForm.usingState = item.name || '';
                this.filterForm[0].label = item.label || '状态';
            } else if (name == 'properties') {
                this.searchForm.resourceType = item.name || '';
                this.filterForm[2].label = item.label || '属性';
            } else if (name == 'classification') {
                this.searchForm.resourceMenuIds = item.name || '';
                this.filterForm[1].label = item.label || '分类';
            }

            this.$emit('confirm', this.searchForm)
        },
        // 请求子节点列表
        loadList(item, next) {
            setTimeout(() => {
                next([
                    // { label: '管理员', name: 'admin' },
                    // { label: '用户', name: 'user' }
                ])
            }, 2000)
        }
    }
}
</script>
  
<style lang="scss" scoped>
 .classheight{
    height: 260px !important;
 }
</style>