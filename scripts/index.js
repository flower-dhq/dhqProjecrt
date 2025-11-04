
const { argv, cwd } = require("process");
const path = require("path");
const dotenv = require("dotenv");
const chalk = require("chalk");
const { convert2EnvFile, selectProjectByMenu, parseRunScriptArgs, execScriptCmd, existFile, getJsonFile } = require("./utils");

// 执行
async function exec() {
  // env路径
  const envPath = "../src/app-config/.env";

  // 解析run script参数
  const { NPM_ARG, PROJECT, MODULE} = parseRunScriptArgs(argv);
  // 编译环境变量
  const compilationEnv = {
    module: MODULE
  }

  const cmd = `npm run ${NPM_ARG}`;

  let result = ''
  let error = ''

  let projectPath = path.join(cwd(), 'src/app-config', PROJECT + '.json')
  if (PROJECT && existFile(projectPath)) {
    result = getJsonFile(projectPath)
  } else {
    // 选择项目
    const selRes = await selectProjectByMenu()
    result = selRes.result
    error = selRes.error
  }


  // 转换配置到 ENV文件
  convert2EnvFile(result, compilationEnv);

  // 设置到Node环境变量
  dotenv.config({ path: path.resolve(__dirname, envPath) });

  // 执行script命令
  execScriptCmd(cmd);
}

exec();
