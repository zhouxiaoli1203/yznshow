const fs = require('fs')
const Timestamp = new Date().getTime();
module.exports = {
    publicPath: './',
    // 输出文件目录
    outputDir: 'front',
    lintOnSave: false,
    // 多页配置
    pages: {
        admin: {
            // 应用入口配置，相当于单页面应用的main.js，必需项
            entry: 'src/pages/admin/main.js',
            // 应用的模版，相当于单页面应用的public/index.html，可选项，省略时默认与模块名一致
            template: 'public/admin.html',
            // 编译后在dist目录的输出文件名，可选项，省略时默认与模块名一致
            filename: 'admin.html'
        },
        app: {
            entry: 'src/pages/app/main.js',
            template: 'public/app.html',
            filename: 'app.html'
        },
        weChat: {
            entry: 'src/pages/weChat/main.js',
            template: 'public/weChat.html',
            filename: 'weChat.html'
        }
    },
    // webpack-dev-server 相关配置
    devServer: {
        // 本地端口
        port: 9090,
        // 代理
        proxy: '',
        // eslint-loader警告配置
        overlay: {
            warnings: false,
            errors: false
        }
    },
    // webpack相关配置
    configureWebpack: {
        devtool: 'source-map',
        output: { // 输出重构  打包编译后的 文件名称  【模块名称.版本号.时间戳】
            filename: `js/[name].${Timestamp}.js`,
            chunkFilename: `js/[name].${Timestamp}.js`
        },
    },
    css: {
        // 启用 CSS modules
        // modules: false,
        // 是否使用css分离插件
        extract: true,
        // 开启 CSS source maps?
        sourceMap: false,
        // css预设器配置项

        loaderOptions: {
            less: {
                modifyVars: {
                    'primary-color': '#13C2C2',
                    'text-color': '#1F1F1F',
                    'link-color': '#1DA57A',
                    'success-color': '#54D045',
                    'warning-color': '#FFB316',
                    'error-color': '#D45656',
                    'font-size-base': '16px',
                    'error-color': '#FF9537'
                },
                javascriptEnabled: true,
            },
            postcss: {
                plugins: [
                    //remUnit这个配置项的数值是多少呢？？？ 通常我们是根据设计图来定这个值，原因很简单，便于开发。
                    //假如设计图给的宽度是750，我们通常就会把remUnit设置为75，这样我们写样式时，可以直接按照设计图标注的宽高来1:1还原开发。
                    require('postcss-px2rem-exclude')({
                        remUnit: 37.5,
                        exclude: /admin|node_modules|assets/,
                    })
                ]
            }
        },
    },
    runtimeCompiler: true
}