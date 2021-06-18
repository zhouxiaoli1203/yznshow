/**axios封装
 * 请求拦截、相应拦截、错误统一处理
 */
import axios from 'axios';
import { Toast } from 'vant';
import { message } from 'ant-design-vue'
import Vue from 'vue';
// import * as appRouter  from '../pages/app/router.js'
// import * as adminRouter  from '../pages/admin/router.js'
let url = window.location.href
let isApp, isWechat, yznmessage;

// 错误拦截并上报，但是ajax请求promise异步异常无法捕获
Vue.config.errorHandler = function(err, vm, info) {
    console.error(err)

    let stack = err.stack;
    if (stack && stack.length > 500) {
        stack = stack.substr(0, 500);
    }
    let jsLog = {
        stack: stack,
        url: window.location.href
    };
    jsLog.userAgent = navigator.userAgent;

    yznReq("post", "api/oa/commitJsException", jsLog);
};

// 环境的切换
if (process.env.NODE_ENV == 'development') {
    axios.defaults.baseURL = 'https://test.yizhiniao.com/';
    isApp = /app.html/.test(url)
    isWechat = /weChat.html/.test(url)
        //axios.defaults.baseURL = 'http://192.168.1.8:8080/';//小东
} else if (process.env.NODE_ENV == 'debug') {
    axios.defaults.baseURL = '';
} else if (process.env.NODE_ENV == 'production') {
    // if (process.env.NODE_HOST == 'production') {
    //     axios.defaults.baseURL = 'https://www.yizhiniao.com/';
    // } else {
    //     axios.defaults.baseURL = 'https://test.yizhiniao.com/';
    // }
    axios.defaults.baseURL = 'https://www.yizhiniao.com/';
} else if (process.env.NODE_ENV == 'test') {
    isApp = /show_app/.test(url)
    isWechat = /show_h5/.test(url)
    axios.defaults.baseURL = 'https://test.yizhiniao.com/';
}

let token_invalid = false;
yznmessage = isApp || isWechat ? Toast : message.error;
// 请求超时时间
axios.defaults.timeout = 15000;

// post请求头
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';

// 请求拦截器
axios.interceptors.request.use(
    config => {
        config.headers.token = localStorage.getItem('show_token');
        config.yzn_f_a = config[config.method == 'post' ? 'data' : 'params'].yzn_f_a;
        delete config[config.method == 'post' ? 'data' : 'params'].yzn_f_a;
        if (config.method == 'post') {
            config.data = JSON.stringify(config.data);
        }
        return config;
    },
    error => {
        return Promise.error(error);
    });

// 响应拦截器
axios.interceptors.response.use(
    response => {
        if (response.data.status == 200 || (response.config.yzn_f_a && response.config.yzn_f_a.indexOf(response.data.status) != -1)) {
            token_invalid = false;
            return Promise.resolve(response);
        } else {
            yznmessage(response.data.message);
            if (response.data.status == '20001') {
                if (!token_invalid) {
                    localStorage.removeItem('show_token');
                }
                token_invalid = true;
            }
            return Promise.reject(response);
        }
    },
    // 服务器状态码不是200的情况
    error => {
        let tip = '';
        if (error.response && error.response.status) {
            switch (error.response.status) {
                case 400:
                    tip = '数据填写有误，请检查后重新填写';
                    break;
                default:
                    tip = '发生了未知错误，请联系客服人员帮助您解决'
            }
        } else {
            if (error.code == 'ECONNABORTED' && error.message.indexOf('timeout') != -1) {
                tip = '请求超时，请稍后再试';
            } else {
                tip = '网络异常，请检查网络后再试！';
            }
        }
        yznmessage(tip);
        return Promise.reject({
            data: { status: error.response && error.response.status || '500', message: tip || '发生了未知错误，请联系客服人员帮助您解决' }
        });
    }
);
/**
 * 请求
 */
export function yznReq(methods, url, params, yzn_f_a, needCatch) {
    /*
    yzn_f_a分为两种：
    1.特殊状态码 类型为string 例如'205,206';
    2.是否需要catch 类型为boolean;
    */
    // 需要同时处理特殊code和catch错误时，yzn_f_a和needCatch都传
    return new Promise((resolve, reject) => {
        params.yzn_f_a = typeof yzn_f_a === 'string' ? yzn_f_a : '';
        const r = methods == 'post' ? axios.post(url, params) : axios.get(url, { params: params });
        r.then(res => {
            resolve(res.data);
        }).catch(err => {
            console.log(`%c【Status Code:${err.data.status}, Message:${err.data.message}${err.config&&err.config.url?', Request URL:'+err.config.url:''}】`, 'color: #ee0a24;font-size: 12px;font-weight: 400;');
            //业务代码需要catch 主要避免Uncaught (in promise)的错误报错
            (needCatch || (typeof yzn_f_a === 'boolean' && yzn_f_a)) && reject(err);
        })
    });
}

export const baseUrl = window.location.protocol + '//' + window.location.host