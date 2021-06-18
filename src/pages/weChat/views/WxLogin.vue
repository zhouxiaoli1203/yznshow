<template>
  <div></div>
</template>

<script>
import { yznReq } from "@/utils/yznhttp";
export default {
  data() {
    return {};
  },
  created() {
    // let invite_openid = this.$route.query.url_openid
    // // let invite_shop = this.$route.query.shopId
    // // let invite_joinid = this.$route.query.activityJoinId
    // let invite_contentId = this.$route.query.contentId
    // if (invite_openid) {
    //   localStorage.setItem('from_openid', invite_openid)
    // }
    // if (invite_contentId) {
    //    localStorage.setItem('from_contentId',invite_contentId)
    // }
    this.getWxAuthorize();
  },
  methods: {
    //获取微信授权
    getWxAuthorize() {
      let env = process.env.NODE_ENV;

      var appid = "wx89b83cc142b989d5";
      var jumpUrl = null;
      var states =
        this.$route.query.id +
        "$" +
        this.$route.query.url_openid 
        +
        "$" +
        this.$route.query.referralDataId;
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

      if (window.location.host == "m.yizhiniao.com") {
      } else {
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
            params[1] 
            +
            "&referralDataId=" +
            params[2];
        } else if (env == "development") {
          jumpUrl =
            "/weChat.html#/index?id=" +
            params[0] +
            "&url_openid=" +
            params[1] 
            +
            "&referralDataId=" +
            params[2];
        }
        this.getWxUserInfo(
          { openid: localStorage.getItem("yzn_openid") },
          jumpUrl
        );
      } else {
        if (!this.getParam("code")) {
          window.location.replace(jumpUrl);
        } else {
          let params = this.getParam("state");
          params = params.split("$");
          let arr = ["", ""];
          params.concat(arr);
          if (env == "test") {
            jumpUrl =
              "/show_h5/#/index?id=" +
              params[0] +
              "&url_openid=" +
              params[1]
               +
              "&referralDataId=" +
              params[2];
          } else if (env == "development") {
            jumpUrl =
              "/weChat.html#/index?id=" +
              params[0] +
              "&url_openid=" +
              params[1] 
              +
              "&referralDataId=" +
              params[2];
          }
          this.getWxUserInfo({ code: this.getParam("code") }, jumpUrl);
        }
      }
    },

    //获取微信用户信息
    async getWxUserInfo(data, jumpUrl) {
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
    },

    getParam(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      var r = decodeURIComponent(window.location.search).substr(1).match(reg);
      if (r != null) return unescape(r[2]);
      return null;
    },
  },
  computed: {},
};
</script>

<style>
</style>