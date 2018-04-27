#!/usr/bin/env node

const program = require('commander')
const init = require('../lib/cmd/init')
const list = require('../lib/cmd/list')
program
  .version(require('../package').version, '-v, --version')

program
  .command('init')
  .description('初始化项目')
  .alias('a')
  .action(() => {
      init()
  })
program
  .command('list')
  .description('查看列表')
  .alias('l') // 简写
  .action(() => {
    list()
  })
program
  .parse(process.argv);

if(!program.args.length){
  program.help()
}
