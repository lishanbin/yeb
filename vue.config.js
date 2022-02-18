let proxyObj = {}

proxyObj['/'] = {
    //websocket
    ws: false,
    target: 'http://localhost:5000',
    //发送请求头host会被设置target
    changeOrigin: true,
    //不重写请求地址
    pathReWrite: {
        '^/': '/'
    }
}


module.exports = {
    devServer: {
        host: 'localhost',
        port: 8080,
        proxy: proxyObj
    }
}