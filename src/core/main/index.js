// 全局配置选项
const options = require('./config')

// 后台服务
require('./server')

// 日志记录模块
// Object.assign(options, {})

global.OPTIONS = options

// 创建窗口
require('./window')