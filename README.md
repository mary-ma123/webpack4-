### webpack4-Multiple-page 多页面配置 打包压缩
----------------------------------------------------------------------------------------------------
**[Markdown语法](https://www.mdeditor.com/)**
### 配置分离 参考： [配置分离](https://www.cnblogs.com/wangtong111/p/11197313.html) npm install webpack-merge --save-dev
*随着我们业务逻辑的增多，图片、字体、css、ES6以及CSS预处理器和后处理器逐渐的加入到我们的项目中来，进而导致配置文件的增多，
*使得配置文件书写起来比较繁琐，更严重者（书写特定文件的位置会出现错误）。更由于项目中不同的生产环境和开发环境的配置，
*使得配置文件变得更加糟糕。使用单个的配置文件会影响到任务的可重用性，随着项目需求的增长，我们必须要找到更有效地管理配置文件的方法。

### 管理配置文件的几种方法:
*在每个环境的多个文件中维护配置，并通过--config参数将webpack指向每个文件，通过模块导入共享配置。
*将配置文件推送到库，然后引用库。
*将配置文件推送到工具。
*维护单个配置文件的所有配置并在那里进行分支并依赖--env参数

### cross-env
*cross-env能跨平台地设置及使用环境变量
*大多数情况下，在windows平台下使用类似于: NODE_ENV=production的命令行指令会卡住，windows平台与POSIX在使用命令行时有许多区别（例如在POSIX，使用$ENV_VAR,在windows，使用%ENV_VAR%。。。）
*cross-env让这一切变得简单，不同平台使用唯一指令，无需担心跨平台问题
*安装：npm i --save-dev cross-env

### 使用
1、npm install  启动npm run dev 打包 npm run build

***以上 2020年02月26日 13：37  更新
------------------------------------------------------------------------------------------------------

### 新增环境配置
*通过webpack.DefinePlugin配置不同环境的参数
webpack.config.js中修改
```javascript
	//获取环境配置
	var envType = process.env.NODE_ENV; //环境类型
	var env = {}; //当前使用的环境对应的配置
	switch (envType){
		case 'dev':
			//开发
			env = require('./dev.env.js');
			break;
		case 'prod':
			//生产
			env = require('./prod.env.js');
			break;
		case 'test':
			//测试
			env = require('./test.env.js');
			break;		
		default:
			break;
	}

	plugins:[
		....
		new webpack.DefinePlugin({ //多环境配置
			'process.env': env
		})
	]
	
	package.json中如下运行或打包
	"scripts": {
		"dev": "cross-env NODE_ENV=dev webpack-dev-server",
		"test": "cross-env NODE_ENV=test webpack-dev-server",
		"build:test": "cross-env NODE_ENV=test webpack --config webpack.config.js",
		"build:prod": "cross-env NODE_ENV=prod webpack --config webpack.config.js"
	},
```	
***以上 2020年02月26日 15：57  更新
------------------------------------------------------------------------------------------------------