const requireContext = require.context('.', true, /\.js$/);
const excluedFile = ['./index.js'];
const files = requireContext.keys().filter((name) => {
    return !excluedFile.some(path => path === name)
});

// 引入所有接口
const cssVarModule = {};

files.forEach((item) => {
  const { themeName, themeCssVar } = requireContext(item).default;
  cssVarModule[themeName] = themeCssVar;
});

export default cssVarModule;

