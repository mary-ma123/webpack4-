#webpack4-Multiple-page 多页面配置 打包压缩
----------------------------------------------------------------------------------------------------
**[Markdown语法](https://www.mdeditor.com/)**
#配置分离 参考： [配置分离](https://www.cnblogs.com/wangtong111/p/11197313.html) npm install webpack-merge --save-dev
*随着我们业务逻辑的增多，图片、字体、css、ES6以及CSS预处理器和后处理器逐渐的加入到我们的项目中来，进而导致配置文件的增多，
*使得配置文件书写起来比较繁琐，更严重者（书写特定文件的位置会出现错误）。更由于项目中不同的生产环境和开发环境的配置，
*使得配置文件变得更加糟糕。使用单个的配置文件会影响到任务的可重用性，随着项目需求的增长，我们必须要找到更有效地管理配置文件的方法。

#管理配置文件的几种方法:
*在每个环境的多个文件中维护配置，并通过--config参数将webpack指向每个文件，通过模块导入共享配置。
*将配置文件推送到库，然后引用库。
*将配置文件推送到工具。
*维护单个配置文件的所有配置并在那里进行分支并依赖--env参数

#使用
1、npm install  启动npm run dev 打包 npm run build

--以上 2020年02月26日 13：37  更新----------------------------------------------------------------------------------------------------------------


--以上更新----------------------------------------------------------------------------------------------------------------
