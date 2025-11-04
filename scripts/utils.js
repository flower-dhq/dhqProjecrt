const fs = require("fs");
const path = require("path");
const hjson = require("hjson");
const inquirer = require("inquirer");
const { spawn } = require("child_process");

// 判断是否对象
const paramIsObject = (param) => typeof param === "object" && param !== null && !Array.isArray(param);


/**
 * @description: 返回用户选择项目配置文件
 * @return {*} Promise
 */
const selectProjectByMenu = () => {
  const projectPath = "../src/app-config";
  const configPath = path.resolve(__dirname, projectPath);
  const files = fs.readdirSync(configPath);
  const menu = files.map((file) => hjson.parse(fs.readFileSync(path.resolve(configPath + "/" + file), "utf-8"))).filter((item) => item.NAME);
  const choices = menu.map((item, index) => ({
    name: item.NAME,
    value: index,
  }));
  const questions = [
    {
      type: "rawlist",
      name: "index",
      message: "请选择项目序号：",
      choices,
    },
  ];
  return new Promise((resolve) => {
    inquirer
      .prompt(questions)
      .then(({ index }) => {
        const result = menu[index];
        resolve({ result });
      })
      .catch((error) => {
        resolve({ error });
      });
  });
};


/**
 * @description: 转换project配置到env
 * @param {*} project APP_CONFIG对象
 * @return {*} void
 */
const convert2EnvFile = (project, compilationEnv) => {
  const isObject = paramIsObject(project && project.APP_CONFIG);
  const appConfig = isObject ? project.APP_CONFIG : {};
  const COMPILATION_ENV = paramIsObject(compilationEnv) ? compilationEnv : {}
  appConfig.COMPILATION_ENV = COMPILATION_ENV
  const envConfig = isObject ? `VITE_APP_CONFIG=${JSON.stringify(appConfig)}` : "";
  fs.writeFileSync(path.resolve(__dirname, "../src/app-config/.env"), envConfig);
};

/**
 * @description: 获取npm run scrip 参数
 * @param {Array} argv node 环境变量
 * @return {object} 参数对象
 */
const parseRunScriptArgs = (argv) => {
  const [nodeExec, scriptPath, ...args] = Array.isArray(argv) ? argv : [];
  const params = {};
  args.forEach((str) => {
    const [key, value] = str.split("=");
    params[key] = value;
  });
  return params;
};

const execScriptCmd = (cmd) => {
  spawn(cmd, { stdio: "inherit", shell: true });
};

/**
 * 判断文件是否存在
 * @param {string} url
 * @param {object} options
 * @param {'file'|'directory'} options.mode
 */
function existFile(url = '', options = {}) {
  const mode = options.mode || 'file'

  const isExist = fs.existsSync(url)
  if (!isExist) return false

  const stat = fs.statSync(url)
  return mode === 'file' ? stat.isFile : mode === 'directory' ? stat.isDirectory : false
}

/**
 * 获取json文件内容
 */
function getJsonFile(url = '') {
  return hjson.parse(fs.readFileSync(url, "utf-8"))
}


module.exports = {
  paramIsObject,
  selectProjectByMenu,
  convert2EnvFile,
  parseRunScriptArgs,
  execScriptCmd,
  existFile,
  getJsonFile,
};