
module.exports = {
    entry: 'src/pages-kanban/kanban', // 编译入口文件夹,默认是 src
    outdir: 'src/lang', // i18n 输出文件夹 默认是 src/lang
    exclude: ['src/lang', 'src/assets'], // 不重写的文件夹, 默认是 ['src/lang']
    extensions: ['.vue', '.js', '.ts'], // 重写的文件类型，默认是 ['.js', '.vue', '.ts']
    single: false, // 是否为单文件编译, 默认为 false. 如果为 true, 则 entry 需为文件而不是文件夹, 如 entry: 'src/index.vue'
    filename: 'kanban_zh', // 输入的中文 json 文件名,默认为 zh
    useChineseKey: true // 是否使用中文作为key值，默认为false
  }
