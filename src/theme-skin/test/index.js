// 主题色
const primaryColor = '#13C3BF'

// uView组件样式变量
const uViewCssVar = {
    '--u-view-primary__theme-color': primaryColor,
    '--u-tag__error__theme-color': '#ff3c3c',
}

// uni-ui组件样式变量
const uniUiCssVar = {
   
}

const globalCssVar = {
    '--app-primary-color': primaryColor
}

// test/test.vue 页面样式值变量
const testTestCssVar = {
    '--skin-shape__bd-color': primaryColor
}


export default {
    themeCssVar: {
        ...uViewCssVar,
        ...uniUiCssVar,
        ...globalCssVar,
        ...testTestCssVar,
    },
    themeName: 'theme-test' // 主题以theme-开头
}