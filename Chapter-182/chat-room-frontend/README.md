## 前端组件库

https://ant.design/components/overview-cn/

## TODO

1. 主题配置
2. 聊天记录系统搭建
3. 个人信息配置页面 已完成

## 改造成 electron 客户端

安装electron

```javascript
npm install electron --save-dev
```

package.json 中指定的 [`main`](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#main) 文件是 Electron 应用的入口。 这个文件控制 **主程序 (main process)**，它运行在 Node.js 环境里，负责控制您应用的生命周期、显示原生界面、执行特殊操作并管理渲染器进程 (renderer processes)

因为 Electron 的主进程就是一个 Node.js 运行时，所以你可以直接用 `electron` 命令运行任意的 Node.js 代码（甚至还能把它当成 [REPL](https://www.electronjs.org/zh/docs/latest/tutorial/repl) 来用）。 要执行这个脚本，需要在 package.json 的 [`scripts`](https://docs.npmjs.com/cli/v7/using-npm/scripts) 字段中添加一个 `start` 命令，内容为 `electron .` 
