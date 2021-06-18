import {yznReq} from "./yznhttp";
import {Toast} from "vant";

let payUrl = "/api/onlinePayment/hfPay";
let userAgent = navigator.userAgent.toLowerCase();
(function () {
  if (getParam("authorize")) {
    let paymentBillId = getParam("paymentBillId");
    let appid = getParam("appid");
    let openid = localStorage.getItem('yzn_openid');
    let userId = localStorage.getItem('user_id');
    if (userAgent.match(/MicroMessenger/i) == "micromessenger") {
      if (openid) {
        wxPay(paymentBillId, openid, appid);
      } else {
        getWxUserInfo({'code': getParam('code')}, appid, paymentBillId);
      }
    } else if (userAgent.match(/Alipay/i) == "alipay") {
      if (userId) {
        aliPay(paymentBillId, userId);
      } else {
        getAliUserInfo({'authCode': getParam('auth_code')}, paymentBillId);
      }
    } else {
      Toast("请用微信或支付宝打开!");
      return false;
    }
  }
})();

//获取url后面的参数
function getParam(name) {
  let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  let r = decodeURI(window.location.search).substr(1).match(reg);
  if (r != null)
    return unescape(r[2]);
  return null
}

//判断是微信app的浏览器还是支付宝
export function ysbPay(paymentBillId, appid, paymentUrl) {
  if (paymentUrl) {
    payUrl = paymentUrl;
  }
  if (userAgent.match(/MicroMessenger/i) == "micromessenger") {
    getWxAuthorize(paymentBillId, appid);
  } else if (userAgent.match(/Alipay/i) == "alipay") {
    getAliAuthorize(paymentBillId);
  } else {
    Toast("请用微信或支付宝打开!");
    return false;
  }
}

// 首入授权
export function wxAuthorize() {
  let appid = "wx89b83cc142b989d5";
  let jumpUrl = null;
  let states = "hf";
  let redirect_uri = encodeURIComponent(window.location.href);
  if (window.location.host == 'm.yizhiniao.com') {
    jumpUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?' + 'appid=' + appid + '&redirect_uri=' + redirect_uri + '&response_type=code' + '&scope=snsapi_base&state=' + states + '#wechat_redirect';
  } else {
    //解决微信授权只能设置一个域名的问题
    jumpUrl = 'https://m.yizhiniao.com/h5/show_template/get-weixin-code.html?appid=' + appid + '&scope=snsapi_base&state=' + states + '&redirect_uri=' + redirect_uri;
  }

  if (!getParam('code')) {
    window.location.href = jumpUrl;
  } else {
    wxUserInfo({'code': getParam('code')});
  }
}

function wxUserInfo(data) {
  yznReq("get", "/api/wx/getOpenId", data).then(res => {
    if (res.status == 200) {
      localStorage.setItem('yzn_openid', res.context);
    } else {
      localStorage.setItem('yzn_openid', '');
    }
  });
}

//获取微信授权
function getWxAuthorize(paymentBillId, appid) {
  let jumpUrl = null;
  let states = "hf";
  let href = window.location.href;
  let url = href.split("#")[0] + "?paymentBillId=" + paymentBillId + "&appid=" + appid + "&authorize=authorize/#" + href.split("#")[1];
  let redirect_uri = encodeURIComponent(url);
  if (window.location.host == 'm.yizhiniao.com') {
    jumpUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?' + 'appid=' + appid + '&redirect_uri=' + redirect_uri + '&response_type=code' + '&scope=snsapi_base&state=' + states + '#wechat_redirect';
  } else {
    //解决微信授权只能设置一个域名的问题
    jumpUrl = 'https://m.yizhiniao.com/h5/show_template/get-weixin-code.html?appid=' + appid + '&scope=snsapi_base&state=' + states + '&redirect_uri=' + redirect_uri;
  }
  let openid = localStorage.getItem('yzn_openid');

  if (openid) {
    wxPay(paymentBillId, openid, appid);
  } else {
    if (!getParam('code')) {
      window.location.href = jumpUrl;
    } else {
      getWxUserInfo({'code': getParam('code')}, appid, paymentBillId);
    }
  }
}

//获取微信用户信息
function getWxUserInfo(data, appid, paymentBillId) {
  yznReq("get", "/api/wx/getOpenId", data).then(res => {
    if (res.status == 200) {
      localStorage.setItem('yzn_openid', res.context);
      wxPay(paymentBillId, res.context, appid);
    } else {
      localStorage.setItem('yzn_openid', '');
    }
  });
}

// 微信下单
function wxPay(paymentBillId, openId, appid) {
  yznReq("get", payUrl, {
    'paymentBillId': paymentBillId,
    'payChannelType': 'W1',
    'openId': openId
  }).then(res => {
    localStorage.setItem('shopId', res.context.shopId);
    if (res.status == 200) {
      let context = res.context;
      if (typeof WeixinJSBridge == "undefined") {
        if (document.addEventListener) {
          document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
        } else if (document.attachEvent) {
          document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
          document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
        }
      } else {
        // 支付状态兼容后台代码  0：成功 1：失败 -1：取消
        let state = 1;
        WeixinJSBridge.invoke(
          'getBrandWCPayRequest', {
            "appId": appid,
            "timeStamp": context.payInfo.timeStamp,
            "nonceStr": context.payInfo.nonceStr,
            "package": context.payInfo.package,
            "signType": context.payInfo.signType,
            "paySign": context.payInfo.paySign
          },
          function (res) {
            if (res.err_msg == "get_brand_wcpay_request:ok") {
              state = 0;
            } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
              state = -1;
            }
          });
      }
    }
  });
}

// 获取支付宝用户ID
function getAliAuthorize(paymentBillId) {
  let href = window.location.href;
  let url = href.split("#")[0] + "?paymentBillId=" + paymentBillId + "&appid=" + appid + "&authorize=authorize/#" + href.split("#")[1];
  let redirect_uri = encodeURIComponent(url);
  let jumpUrl = "https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2018032802459928&scope=auth_base&redirect_uri=" + redirect_uri;
  let userId = localStorage.getItem('user_id');
  if (userId) {
    aliPay(paymentBillId, userId);
  } else {
    if (!getParam('auth_code')) {
      window.location.href = jumpUrl;
    } else {
      // 获取支付宝用户信息
      getAliUserInfo({'authCode': getParam('auth_code')}, paymentBillId);
    }
  }
}


// 获取支付宝用户信息
function getAliUserInfo(data, paymentBillId) {
  yznReq("post", "/api/onlinePayment/aliAuth", data).then(res => {
    if (res.status == 200) {
      localStorage.setItem('user_id', res.context);
      aliPay(paymentBillId, res.context);
    } else {
      localStorage.setItem('user_id', '');
    }
  });
}

// 支付宝下单
function aliPay(paymentBillId, buyerId) {
  yznReq("get", payUrl, {
    'paymentBillId': paymentBillId,
    'payChannelType': 'A1',
    'buyerId': buyerId
  }).then(res => {
    if (res.status == 200) {
      ready(function () {
        AlipayJSBridge.call("tradePay", {
          tradeNO: res.context.payInfo.tradeNO
        }, function (data) {
          // 支付状态兼容后台代码  0：成功 1：失败 -1：取消
          if ("9000" == data.resultCode) {
            // 跳转页面 9000成功
            window.location.href = getFrontCallBackUrl(res.context.frontCallBackUrl) + "state=0&orderId=" + paymentBillId + "&shopId=" + res.context.shopId;
          } else if ("6001" == data.resultCode) {
            // 6001 取消支付
          } else {
            // 跳转页面 支付失败
            window.location.href = getFrontCallBackUrl(res.context.frontCallBackUrl) + "state=1&orderId=" + paymentBillId + "&shopId=" + res.context.shopId;
          }
        });
      });
    }
  });
}

// 由于js的载入是异步的，所以可以通过该方法，当AlipayJSBridgeReady事件发生后，再执行callback方法
function ready(callback) {
  if (window.AlipayJSBridge) {
    callback && callback();
  } else {
    document.addEventListener('AlipayJSBridgeReady', callback, false);
  }
}

// 获取前端回调地址
function getFrontCallBackUrl(frontCallBackUrl) {
  if (frontCallBackUrl.indexOf('?') > 0) {
    frontCallBackUrl = frontCallBackUrl + "&";
  } else {
    frontCallBackUrl = frontCallBackUrl + "?";
  }

  return frontCallBackUrl;
}
