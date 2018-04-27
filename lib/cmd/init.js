const exec = require('child_process').exec
const co = require('co')
const ora = require('ora')
const prompt = require('co-prompt')

const tpls = require('../../tpl')
const logger = require('../utils').logger
const spinner = ora('运行中...')

const execRemove = (err, projectName) => {
  spinner.stop()
  if (err) {
    logger.fail(err)
    logger.fail('请重新运行')
    process.exit(0)
  }

  logger.success('初始化完成！')
  logger.info(`请执行
  cd ${projectName} && npm install
  完成项目依赖安装
  `)
}

const download = (err, projectName) => {
  if (err) {
    logger.fail(err)
    logger.fail('请从新运行')
    process.exit(0)
  }
  // 执行
  exec(`cd ${projectName} && rm -rf .git`, (err) => {
    execRemove(err, projectName)
  })
}

const resolve = (result) => {
  const {url, branch, projectName} = result
  const cmdStr = `git clone ${url} ${projectName} && cd ${projectName} && git checkout ${branch}`
  spinner.start()
  exec(cmdStr, (err) => {
    download(err, projectName)
  })
}

module.exports = () => {
  co.(function *() {
    const tplName = yield prompt('模板名字：')
    const projectName = yield prompt('项目名字：')

    if (!tpls[tplName]) {
      logger.fail('模板不存在！')
      process.exit(0)
    }
    return new Promise((resolve, reject) => {
      resolve({
        tplName,
        projectName,
        ...tpls[tplName]
      })
    })
  }).then(resolve)
}
