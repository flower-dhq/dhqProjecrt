
const requireContext = require.context('.', false, /\.js$/)
const excluedFile = ['./index.js', './utils.js', './mall.js'] // 忽略文件
const files = requireContext.keys().filter(name => !excluedFile.includes(name))

// 引入所有项目pages.js配置

module.exports = files.reduce((prev, cur) => {
    return prev.concat(requireContext(cur));
}, [])