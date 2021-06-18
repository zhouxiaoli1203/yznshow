import { yznReq } from "@/utils/yznhttp";
import wx from 'weixin-js-sdk';
import QrcodeVue from "qrcode.vue";
import moment from 'moment'

export function getParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = decodeURIComponent(window.location.search).substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}



//微信分享方法封装(在接口获取数据后调用: 默认调用)
export async function getShareData(title, desc, imgsrc, joinInfo, fn) {
    try {
        let res = await yznReq('post', "/api/wx/getWxToken", {
            linkUrl: (window.location.href).split('#')[0]
        })
        if (res) {
            WXConfig(res.context, title, desc, imgsrc, joinInfo, fn);
        }
    } catch (err) {
        console.log(err)
        alert('网络错误');
    }
}

export function WXConfig(data, title, desc, imgsrc, joinInfo, fn) { //配置微信
    wx.config({
        debug: false,
        appId: data.appId,
        timestamp: data.timestamp,
        nonceStr: data.nonceStr,
        signature: data.signature,
        jsApiList: [
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'onMenuShareWeibo',
            'onMenuShareQZone',
            'chooseImage',
            'previewImage',
            'uploadImage',
            'downloadImage'
            // 'hideMenuItems'
        ]
    });
    wx.ready(function () {
        var shareDataUrl = null;
        // if (joinInfo.activityJoinId) {
        //     shareDataUrl = (window.location.href).split('#')[0] + '#/wx?id=' +
        //         joinInfo.activityId + '&url_openid=' +
        //         joinInfo.openid + '&contentId=' + joinInfo.contentId

        //         +
        //         '&activityJoinId=' + joinInfo.activityJoinId; //  分享的URL，必须和当前打开的网页的URL是一样的
        // } else {
        //     shareDataUrl = (window.location.href).split('#')[0] + '#/wx?id=' +
        //         joinInfo.activityId + '&url_openid=' +
        //         joinInfo.openid + '&contentId=' + joinInfo.contentId
        // };
        shareDataUrl = (window.location.href).split('#')[0] + '#/index?id=' +
            joinInfo.activityId + '&url_openid=' + joinInfo.openid +
            '&groupId=' + joinInfo.groupId
        if (joinInfo.referralDataId) { //分销id
            shareDataUrl += '&referralDataId=' + joinInfo.referralDataId
        }
        var shareData = {
            title: title, //  标题
            desc: desc, //  描述
            link: shareDataUrl,
            imgUrl: imgsrc, //  缩略图地址
            success: function () { // 用户确认分享后执行的回调函数(默认调用分享之后后台统计的数据接口)
                yznReq('post', '/api/oa/show/createShareLog', {
                    'activityId': joinInfo.activityId,
                    'openId': joinInfo.openid
                }).then(res => {
                    var myEvent = new CustomEvent("shareEvent");
                    if (window.dispatchEvent) {
                        window.dispatchEvent(myEvent);
                    } else {
                        window.fireEvent(myEvent);
                    }
                    console.log(res)
                })
            },
        };
        wx.onMenuShareAppMessage(shareData); //分享给朋友
        wx.onMenuShareQQ(shareData); //分享到qq
        wx.onMenuShareWeibo(shareData); //分享到腾讯微博
        wx.onMenuShareQZone(shareData); //分享到qq空间

        // shareData.link = changeShowUrlHost(shareData.link);

        wx.onMenuShareTimeline(shareData); //分享到朋友圈
        if (fn) fn();
        // wx.hideMenuItems({
        //   menuList: [ "menuItem:share:timeline"],
        //   success: function (res) {
        //    console.log('无法分享至朋友圈');
        //   },
        //   fail: function (res) {
        //     console.log(JSON.stringify(res));
        //   }
        // });

        //兼容自动播放音乐
        // setTimeout(function() {
        //     if (localStorage.getItem('yzn_music') != 'off') {
        //         $('#bacMusic')[0].play();
        //     }
        // }, 500);
    });
    // wx.miniProgram.getEnv(function(res) { //判断是否是小程序
    //     if (res.miniprogram) {
    //         if (!is_miniprogram) {
    //             wx.miniProgram.postMessage({ data: { 'title': title } });
    //         }
    //         is_miniprogram = true;
    //     }
    // });
    // wx.error(function(res) {
    //     console.log(res.errMsg); //错误提示
    // });
}

export function getAge(birthday) {
    let b_day = moment(birthday)
    let n_day = moment()
    let year = n_day.diff(b_day, 'years')
    let month = n_day.diff(b_day, 'months') % 12
    if (year) {
        return `${year}岁${month}个月`
    } else {
        return `${month}个月`
    }
}



//获取微信授权
export function getWxAuthorize(id, url_openid, referralDataId, groupId, isInvite) {
    let env = process.env.NODE_ENV;

    var appid = "wx89b83cc142b989d5";
    var jumpUrl = null;
    var states =
        id +
        "$" +
        url_openid +
        "$" +
        referralDataId +
        "$" +
        groupId
        ;
    var redirect_uri;
    if (env == "test") {
        redirect_uri = encodeURIComponent(
            window.location.protocol +
            "//" +
            window.location.host +
            "/show_h5/#/index"
        );
    } else if (env == "development") {
        redirect_uri = encodeURIComponent(
            window.location.protocol +
            "//" +
            window.location.host +
            "/weChat.html#/index"
        );
    }

    if (window.location.host == "m.yizhiniao.com") { } else {
        //解决微信授权只能设置一个域名的问题
        jumpUrl =
            "https://m.yizhiniao.com/h5/show_template/get-weixin-code.html?appid=" +
            appid +
            "&scope=snsapi_userinfo&state=" +
            states +
            "&redirect_uri=" +
            redirect_uri +
            "#wechat_redirect";
    }
    if (localStorage.getItem("yzn_openid")) {
        let params = states;
        params = params.split("$");
        let arr = ["", ""];
        params.concat(arr);
        if (env == "test") {
            jumpUrl =
                "/show_h5/#/index?id=" +
                params[0] +
                "&url_openid=" +
                params[1] +
                "&referralDataId=" +
                params[2] +
                "&groupId=" +
                params[3]
                ;
            if (isInvite) {
                jumpUrl =
                    "/show_h5/#/invite?id=" +
                    params[0] +
                    "&url_openid=" +
                    params[1] +
                    "&referralDataId=" +
                    params[2] +
                    "&groupId=" +
                    params[3];
            }
        } else if (env == "development") {
            jumpUrl =
                "/weChat.html#/index?id=" +
                params[0] +
                "&url_openid=" +
                params[1] +
                "&referralDataId=" +
                params[2] +
                "&groupId=" +
                params[3];
            if (isInvite) {
                jumpUrl =
                    "/weChat.html#/invite?id=" +
                    params[0] +
                    "&url_openid=" +
                    params[1] +
                    "&referralDataId=" +
                    params[2] +
                    "&groupId=" +
                    params[3];
            }
        }
        getWxUserInfo({ openid: localStorage.getItem("yzn_openid") },
            jumpUrl
        );
    } else {
        if (!getParam("code")) {
            window.location.replace(jumpUrl);
        } else {
            let params = getParam("state");
            params = params.split("$");
            let arr = ["", ""];
            params.concat(arr);
            if (env == "test") {
                jumpUrl =
                    "/show_h5/#/index?id=" +
                    params[0] +
                    "&url_openid=" +
                    params[1] +
                    "&referralDataId=" +
                    params[2] +
                    "&groupId=" +
                    params[3];;
                if (isInvite) {
                    jumpUrl =
                        "/show_h5/#/invite?id=" +
                        params[0] +
                        "&url_openid=" +
                        params[1] +
                        "&referralDataId=" +
                        params[2] +
                        "&groupId=" +
                        params[3];;
                }
            } else if (env == "development") {
                jumpUrl =
                    "/weChat.html#/index?id=" +
                    params[0] +
                    "&url_openid=" +
                    params[1] +
                    "&referralDataId=" +
                    params[2] +
                    "&groupId=" +
                    params[3];;
                if (isInvite) {
                    jumpUrl =
                        "/weChat.html#/invite?id=" +
                        params[0] +
                        "&url_openid=" +
                        params[1] +
                        "&referralDataId=" +
                        params[2] +
                        "&groupId=" +
                        params[3];;
                }
            }
            getWxUserInfo({ code: getParam("code") }, jumpUrl);
        }
    }
}

//获取微信用户信息
async function getWxUserInfo(data, jumpUrl) {
    let res = await yznReq("post", "api/wx/wxAuth", data, "205");
    if (res && res.status == 200) {
        localStorage.setItem("userInfo", JSON.stringify(res.context));
        localStorage.setItem("wx_img", res.context.headimgurl);
        localStorage.setItem("yzn_openid", res.context.openid);
        window.location.replace(jumpUrl);
    } else {
        localStorage.removeItem("yzn_openid");
        this.getWxAuthorize();
    }
}



export function uuid() {
    var s = [];
    var hexDigits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * hexDigits.length), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";
    var uuid = s.join("");
    return uuid;
}

