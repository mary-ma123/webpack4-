var webpack = require('webpack');//引入webpack
// https://github.com/johnagan/clean-webpack-plugin#options-and-defaults-optional
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
var path = require('path');//引入nodejs路径模块，处理路径用的
var glob = require('glob');//glob，这个是一个全局的模块，动态配置多页面会用得着
var HtmlWebpackPlugin = require('html-webpack-plugin'); //这个是通过html模板生成html页面的插件，动态配置多页面用得着
var MiniCssExtractPlugin = require("mini-css-extract-plugin");//分离css，webpack4推荐的分离css的插件
var TransferWebpackPlugin = require('transfer-webpack-plugin');//原封不动的把assets中的文件复制到dist文件夹中
var autoprefixer = require('autoprefixer');//给css自动加浏览器兼容性前缀的插件
var os = require('os');//这个nodejs模块，会帮助我们获取本机ip
var portfinder = require('portfinder');//这个帮助我们寻找可用的端口，如果默认端口被占用了的话
var fs = require('fs');//处理文件用的
var ports = fs.readFileSync('./port.json', 'utf8');
ports = JSON.parse(ports);
portfinder.basePort = "8080";
portfinder.getPort(function(err, port) {
    ports.data.port = port;
    ports = JSON.stringify(ports,null,4);
    fs.writeFileSync('./port.json',ports);
});
///////////////////获取本机ip///////////////////////
function getIPAdress(){  
    var interfaces = os.networkInterfaces();  
    for(var devName in interfaces){  
        var iface = interfaces[devName];  
        for(var i=0;i<iface.length;i++){  
            var alias = iface[i];  
            if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal){  
                return alias.address;  
            }  
        }  
    }  
} 
var host = getIPAdress();

//动态添加入口
function getEntry(){
    var entry = {};
    //读取src目录所有page入口
    glob.sync('./src/js/**/*.js').forEach(function(name){
        var start = name.indexOf('src/') + 4;
        var end = name.length - 3;
        var eArr = [];
        var n = name.slice(start,end);
        n= n.split('/')[1];
        eArr.push(name);
        eArr.push('babel-polyfill');
        entry[n] = eArr;
    })
    return entry;
}
//动态生成html
//获取html-webpack-plugin参数的方法
var getHtmlConfig = function(name,chunks){
    return {
        template:`./src/pages/${name}.html`,
        filename:`pages/${name}.html`,
        inject:true,
        hash:false,
		//chunkhash:false,
        chunks:[name,'commons']
    }
}

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


module.exports = {
    entry:getEntry(),
    output:{
		/**
		 * 打包为什么添加hash？
		 * 如果不加hash码，每次打包出来的文件名都是一样的，然而用户设备里是存在缓存的，除非用户清除缓存（这显然不现实）
		 * 所以添加hash码保证文件的唯一性，文件不被用户缓存。
		 * 有hash就够了，为什么还要用chunkhash
		 * 是的，只用hash完全能够满足需要，hash是工程级别的，如果项目里但凡有一个文件有改动，打包后的hash码就会更新，
		 * 所有文件的hash码都会更新，而且都是一样的hash码，所以问题来了，如果我们的项目很大，我们只是修改了一个bug或是一个页面，却需要用户重新更新所有文件，用户体验大大降低了。
		 * 这时候chunkhash出现了，他是文件级别的，一般我们在output的chunkFilename中使用它，在outpput的filename中使用hash，
		 * 在css分离的时候使用contenthash，当然事无绝对，我们应该见机行事，如果担心写错了，可以全部用hash代替，就是牺牲一些用户体验罢了，牺牲多少呢？项目越大，牺牲越大
		 * 关于hash的具体介绍参见我之前的文章 : https://www.qdtalk.com/2018/11/12/0webpack4/
		 * output中的filename用来配置打包出来的文件名，'[name]'表示文件名于入口文件保持一致，
		 * '[hash:9]'表示一个九位的hash字段。'[name]-[hash:9].js'表示出口文件的名字将是一个
		 * 在入口文件后面加上横杠和9位hash的js文件。别急等下就可以看到这个配置的效果。
		*/
		// 注意事项 chunkhash 会和 热更新 new webpack.HotModuleReplacementPlugin() 冲突，注释该选项并注释devServer里的hot：true，但是hash值不会
        path:path.resolve(__dirname,'dist'),
		filename:'js/[name].[chunkhash:8].js',
        // filename:'js/[name].[hash:9].js',
    },
    module:{
        rules:[
            {
                test:/\.js$/,
                exclude:/(node_modules)/,
                include: /src/,
                use:[
                    {
                        loader:'babel-loader',
                        options:{
                            presets:['@babel/preset-env',],
                            plugins:['@babel/transform-runtime']
                        }
                    }
                ]
            },
            {
                test:/\.css$/,
                //use:['style-loader','css-loader','postcss-loader']//css不分离写法
                //css分离写法
                use:[MiniCssExtractPlugin.loader,"css-loader",{
                    loader: "postcss-loader",
                    options: {
                        plugins: [
                            autoprefixer({
								//browsers已经不再使用，采用overrideBrowserslist.或者使用browserslist key in package.json or ,browserslistrc file.
                                overrideBrowserslist: ['ie >= 8','Firefox >= 20', 'Safari >= 5', 'Android >= 4','Ios >= 6', 'last 4 version']
                            })
                        ]
                    }
                }]
            },
            {
                test:/\.scss$/,
                //use:['style-loader','css-loader','sass-loader','postcss-loader']//css不分离写法
                //css分离写法
                use:[MiniCssExtractPlugin.loader,"css-loader",{
                    loader: "postcss-loader",
                    options: {
                        plugins: [
                            autoprefixer({
                                overrideBrowserslist: ['ie >= 8','Firefox >= 20', 'Safari >= 5', 'Android >= 4','Ios >= 6', 'last 4 version']
                            })
                        ]
                    }
                },"sass-loader"]
            },
			{
			    test:/\.less$/,
			    //use:['style-loader','css-loader','sass-loader','postcss-loader']//css不分离写法
			    //css分离写法
			    use:[MiniCssExtractPlugin.loader,"css-loader",{
			        loader: "postcss-loader",
			        options: {
			            plugins: [
			                autoprefixer({
			                    overrideBrowserslist: ['ie >= 8','Firefox >= 20', 'Safari >= 5', 'Android >= 4','Ios >= 6', 'last 4 version']
			                })
			            ]
			        }
			    },"less-loader"]
			},
            {
                test:/\.(png|jpg|gif|jpeg)$/,
                use:[
                    {
                        loader:'url-loader',
                        options:{
                            limit:5000
                        }
                    }
                ]
            }
        ]
    },
    //mode:"development",
    performance:{
        hints:false
    },
	devtool: envType=='prod' ? "" : "source-map",  // 开启调试模式
    //插件
    plugins:[
        new MiniCssExtractPlugin({
			/**对css使用了chunkhash之后，我们测试会发现，如果修改了js，css文件名的hash值确实没变，但这时要是我们修改css文件的话，
			* 我们就会发现css文件名的chunkhash值居然没变化，这样就导致我们的非覆盖发布css文件失效了。
			* 所以这里需要注意就是css文件必须使用contenthash。
			**/
            filename: "css/[name].[contenthash].css"
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            jquery: "jquery",
            "window.jQuery": "jquery"
        }),
        new TransferWebpackPlugin([
            {
                from: 'assets',
                to: 'assets'
            }
        ], path.resolve(__dirname,"src")),
        // new webpack.HotModuleReplacementPlugin(), //热更新
		//设置每一次build之前先删除dist
		new CleanWebpackPlugin(
			{
				root: path.resolve(__dirname, '..'),//root: __dirname, //根目录
				verbose: true, //开启在控制台输出信息
				dry: false ,//为false是删除文件夹的，为true是不删除的，默认值是false
				//在Webpack编译之前删除一次文件  使用!否定模式来排除文件 ['**/*', '!static-files*'] 
				cleanOnceBeforeBuildPatterns: ['*'],
				/**在每次构建(包括监视模式)之后删除与此模式匹配的文件。用于非由Webpack直接创建的文件。使用!否定模式来排除文件  ['dist*.*', '!static1.js']*/
				cleanAfterEveryBuildPatterns: ['dist*.*'],
				cleanStaleWebpackAssets: false, //自动删除所有未使用的webpack资产重建
			}
		),
		new webpack.DefinePlugin({ //多环境配置
			'process.env': env
		})
    ],
	/**
	 * 公共模块的引入
	 * 因为 SplitChunksPlugin 是 webpack 4+ 版本内置的插件, 所以无需安装, 只需在 webpack.config.js 中配置
	 * 还要在每一个页面的 HtmlWebpackPlugin 的 chunks 加上 commons, 因为提取之后的 commons 需要被打包出来的页面引用!
	 * 在本配置中的getHtmlConfig 中 chunks:[name,'commons'] 即可*/
	optimization: {
		splitChunks: {
			cacheGroups: {
				//打包公共模块
				commons: {
					chunks: 'initial', //initial表示提取入口文件的公共部分
					minChunks: 2, //表示提取公共部分最少的文件数
					minSize: 0, //表示提取公共部分最小的大小
					name: 'commons' //提取出来的文件命名
				}
			}
		}
	},
    devServer:{
        contentBase:path.resolve(__dirname,'dist'), //最好设置成绝对路径
        historyApiFallback: false,
        //hot: true,
        inline: true,
        stats: 'errors-only',
        host: host,
        port: ports.data.port,
        overlay: true,
        open:true
    }
}


//配置页面
var entryObj = getEntry();
var htmlArray = [];
Object.keys(entryObj).forEach(function(element){
    htmlArray.push({
        _html:element,
        title:'',
        chunks:[element]
    })
})
//自动生成html模板
htmlArray.forEach(function(element){
    module.exports.plugins.push(new HtmlWebpackPlugin(getHtmlConfig(element._html,element.chunks)));
})
