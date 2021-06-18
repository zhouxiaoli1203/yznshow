<template>
  <div class="iframeWrap">
    <template v-if="activityId">
      <qrcode-vue
        v-show="false"
        id="myCode"
        :value="BASEURL + '/show_h5/#/index?id=' + activityId"
      ></qrcode-vue>
    </template>
    <div class="iframeWar">
      <iframe
        v-if="activityId"
        id="myIframe"
        width="100%"
        height="100%"
        :src="
          BASEURL +
          '/show_h5/#/index?client=' +
          (istem ? 'tem' : 'oa') +
          '&id=' +
          activityId
        "
        frameborder="0"
      ></iframe>
    </div>
    <!-- 提交预览 -->
    <div class="operateFixed" v-if="!istem">
      <div
        class="c_f_center"
        @click="
          activityStatus == 4
            ? onSelect({ type: 'copy', router: 'setting' })
            : (show = true)
        "
      >
        {{ activityStatus == 4 ? "复制" : "更多设置" }}
      </div>
      <div class="c_f_center">
        <van-button
          color="#13c2c2"
          @click="
            onSelect(
              activityStatus == 0
                ? { type: 'on' }
                : activityStatus == 1
                ? { type: 'share' }
                : { router: 'myData', type: 'skip' }
            )
          "
        >
          {{
            activityStatus == 0
              ? "发布活动"
              : activityStatus == 1
              ? "分享活动"
              : "活动数据"
          }}
        </van-button>
      </div>
    </div>
    <!-- 马上制作 -->
    <div class="operateFixed" v-else>
      <template v-if="ispreview">
        <div class="c_f_center" @click="onSelect({ type: 'back' })">
          返回编辑
        </div>
        <div class="c_f_center">
          <van-button color="#13c2c2" @click="saveShow = true">
            保存
          </van-button>
        </div>
      </template>
      <template v-else>
        <div class="c_f_center" style="background-color: #13c2c2">
          <van-button
            color="#13c2c2"
            class="f18"
            @click="onSelect({ name: '复制', router: 'setting', type: 'copy' })"
          >
            马上制作
          </van-button>
        </div>
      </template>
    </div>

    <van-action-sheet
      v-model="show"
      :actions="actions"
      cancel-text="取消"
      close-on-click-action
      @select="onSelect"
    />
    <van-share-sheet
      title="分享至"
      v-model="shareShow"
      :options="options"
      @select="onSelect_share"
    />
    <van-dialog
      v-model="saveShow"
      title="发布选择"
      width="270"
      :showConfirmButton="false"
      :closeOnClickOverlay="true"
    >
      <div class="fbWrap">
        <!-- <div class="c_f_center" @click="operate(false)">保存至待发布</div>
        <div class="c_f_center" @click="operate(true)">直接发布活动</div> -->
        <div
          class="c_f_center"
          @click="
            $activitySub(currentData, {
              url: 'addActivity',
              upDownStatus: false,
              router: $router,
            })
          "
        >
          保存至待发布
        </div>
        <div
          class="c_f_center"
          @click="
            $activitySub(currentData, {
              url: 'addActivity',
              upDownStatus: true,
              router: $router,
            })
          "
        >
          直接发布活动
        </div>
      </div>
    </van-dialog>
  </div>
</template>
<script>
import { Dialog } from "vant";
import QrcodeVue from "qrcode.vue";
import { Toast } from "vant";
export default {
  name: "preview",
  components: { QrcodeVue },
  data() {
    return {
      saveShow: false,
      istem: false, //从模板库进入
      ispreview: false, //从制造活动进入
      currentData: {}, //从制造活动进入缓存中当前活动数据 无解
      activityInfo: {},
      options: [
        {
          name: "朋友圈",
          type: 2,
          className: "myOption",
          icon: require("../../../assets/img/app/share_pyq.png"),
        },
        {
          name: "微信好友",
          type: 1,
          className: "myOption",
          icon: require("../../../assets/img/app/share_user.png"),
        },
        {
          name: "生成海报",
          type: 3,
          className: "myOption",
          icon: require("../../../assets/img/app/share_pic.png"),
        },
      ],
      shareShow: false,
      show: false,
      activityId: "",
      activityStatus: "",
      setting: [{}],
      actions: [
        { name: "编辑", router: "setting", type: "edit" },
        { name: "复制" },
        { name: "删除", type: "del" },
      ],
    };
  },
  methods: {
    getDetail() {
      this.yznReq("get", "api/oa/show/tempDetail", {
        activityId: this.activityId,
      }).then((res) => {
        if (res.status == 200) {
          this.activityInfo = res.context;
          if (
            res.context.activityStatus == 3 &&
            res.context.activityType == 3
          ) {
            this.actions = [
              { name: "复制", router: "setting", type: "copy" },
              { name: "下架", type: "off" },
            ];
          }
        }
      });
    },
    onSelect_share(data) {
      if (data.type < 3) {
        this.callAPP({
          type: data.type,
          shareTitle: this.activityInfo.shareTitle,//分享标题
          shareImageUrl: this.activityInfo.shareImageUrl,//分享标题图片
          shareDesc: this.activityInfo.shareDesc,//分享描述
          shareUrl: this.BASEURL + "/show_h5/#/index?id=" + this.activityId,//分享目标url
        });
      } else {
        // 生成图片
        this.makePost((src) => {
          console.log("图片生成成功 唤起app");
          this.callAPP({ type: data.type, url: src });
        });
      }
      this.shareShow = false;
    },
    onSelect(data) {
      if (data.type == "skip" || data.type == "copy") {
        this.$store.commit("MODIFY", {
          key: "STEP1_INIT",
          value: true,
        });
      }
      switch (data.type) {
        case "skip":
          this.$router.push({
            path: "/" + data.router,
            query: Object.assign(
              { id: this.activityId },
              data.router == "setting"
                ? { edit: 1, type: data.acivityType }
                : {}
            ),
          });
          break;
        case "copy":
          this.$router.push({
            path: "/" + data.router,
            query: Object.assign({ id: this.activityId }, {}),
          });
          break;
        case "del":
          Dialog.confirm({
            title: "提示",
            message: "确认删除该活动吗？",
          })
            .then(() => {
              this.yznReq("post", "api/oa/show/deleteActivity", {
                activityId: this.activityId,
              }).then((res) => {
                if (res.status == 200) {
                  this.$router.go(-1);
                }
              });
            })
            .catch(() => {});
          break;
        case "share":
          this.shareShow = true;
          break;
        case "off":
          Dialog.confirm({
            title: "提示",
            message: "确认下架该活动吗？",
          })
            .then(() => {
              this.yznReq("post", "api/oa/show/upDownActivity", {
                activityId: this.activityId,
                upDownStatus: -1,
              }).then((res) => {
                if (res.status == 200) {
                  this.$router.go(-1);
                }
              });
            })
            .catch(() => {});
          break;
        case "on":
          Dialog.confirm({
            title: "提示",
            message: "活动发布后内容无法更改，确认正式发布此活动吗？",
          })
            .then(() => {
              this.upDownActivity();
            })
            .catch(() => {});
          break;
        case "back":
          this.$store.commit("MODIFY", {
            key: "STEP1_INIT",
            value: false,
          });
          this.$router.go(-1);
          break;
      }
    },
    upDownActivity(checkTime) {
      let params = {
        activityId: this.activityId,
        upDownStatus: 1,
      };
      if (checkTime) {
        params["checkTime"] = -1;
      }
      this.yznReq("post", "api/oa/show/upDownActivity", params, "206").then(
        (res) => {
          if (res.status == 200) {
            this.$router.go(-1);
          }
          if (res.status == 206) {
            Dialog.confirm({
              title: "提示",
              message:
                "当前已过活动开始时间，活动一经发布即刻开始，确认发布活动？",
            })
              .then(() => {
                this.upDownActivity("checkTime");
              })
              .catch(() => {});
          }
        }
      );
    },
    callAPP(param) {
      // type:1,//1分享到朋友 2分享到朋友圈 3保存图片 url:'海报地址'
      this.shareShow = false;
      console.log("唤起app");
      this.$bridge.callHandler("JSCallApp_wx_share", param, (res) => {
        alert("获取app响应数据:" + res);
      });
    },
    appCall() {
      console.log("注册事件");
      this.$bridge.registerHandler(
        "appCallJS_wx_share_res",
        (datas, responseCallback) => {
          console.log("app响应");
          alert("手机端返回数据：" + datas);
        }
      );
    },
    // 生成海报
    makePost(fn) {
      let that = this;
      try {
        function canvasTextAutoLine(str, canvas, initX, initY, lineHeight) {
          let ctx = canvas.getContext("2d");
          let lineWidth = 0;
          let canvasWidth = canvas.width;
          let lastSubStrIndex = 0;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          for (let i = 0; i < str.length; i++) {
            lineWidth += ctx.measureText(str[i]).width;
            if (lineWidth > (canvasWidth / 8) * 6.1) {
              ctx.fillText(
                str.substring(lastSubStrIndex, i),
                canvasWidth / 2,
                initY
              );
              initY += lineHeight;
              lineWidth = 0;
              lastSubStrIndex = i;
            }
            if (i == str.length - 1) {
              ctx.fillText(
                str.substring(lastSubStrIndex, i + 1),
                canvasWidth / 2,
                initY
              );
            }
          }
          return initY;
        }
        function convertCanvasToImage(canvas) {
          let img_ = new Image();
          img_.src = canvas.toDataURL("image/png", 1);
          return img_;
        }
        //默认canvas宽高为 300 * 500;
        let currentW = ((300 * 2) / 375) * document.documentElement.clientWidth,
          currentH = (currentW * 500 * 2) / (300 * 2),
          imgone = new Image(),
          imgQrcode = new Image(),
          imgArrow = new Image(),
          zoom = document.documentElement.clientWidth / 375,
          qrcode = document.createElement("div");
        let mycanvas = document.createElement("canvas"); //海报画布
        imgone.crossOrigin = "Anonymous";
        imgQrcode.crossOrigin = "Anonymous";
        imgArrow.crossOrigin = "Anonymous";
        // 获取二维码地址
        imgQrcode = convertCanvasToImage(document.getElementById("myCode"));
        imgone.src = that.activityInfo.shareImageUrl;
        imgArrow.src = require("../../../assets/img/app/canvasArrow.png");
        mycanvas.width = currentW;
        mycanvas.height = currentH;
        mycanvas.style.display = "none";
        let ctx = mycanvas.getContext("2d");
        let promiseAll = [
          new Promise(function (resolve, reject) {
            imgone.onload = function () {
              resolve(imgone);
            };
          }),
          new Promise(function (resolve, reject) {
            imgQrcode.onload = function () {
              resolve(imgQrcode);
            };
          }),
          new Promise(function (resolve, reject) {
            imgArrow.onload = function () {
              resolve(imgArrow);
            };
          }),
        ];

        Promise.all(promiseAll).then((item) => {
          ctx.fillStyle = "#fff";
          ctx.fillRect(0, 0, currentW, currentH);
          ctx.stroke();
          ctx.drawImage(imgone, 0, 0, currentW, currentW);
          ctx.fillStyle = "#FE9A0E"; // 文字填充颜色
          console.log(that.activityInfo.activityName);
          console.log(that.activityInfo.shareImageUrl);
          ctx.font = 32 * zoom + "px PingFang-SC-Bold";
          let topH = canvasTextAutoLine(
            that.activityInfo.activityName,
            mycanvas,
            34 * 2 * zoom,
            currentW + 30 * 2 * zoom,
            24 * 2 * zoom
          );
          ctx.textAlign = "start";
          ctx.textBaseline = "alphabetic";
          ctx.drawImage(
            imgQrcode,
            48 * 2 * zoom,
            topH + 18 * 2 * zoom,
            90 * 2 * zoom,
            90 * 2 * zoom
          );

          ctx.fillStyle = "#F91D06";
          ctx.font = 28 * zoom + "px PingFang-SC-Heavy";
          ctx.fillText("长按", 156 * 2 * zoom, topH + 50 * 2 * zoom);

          ctx.fillStyle = "#8D5A4C";
          ctx.fillText("识别二维码", 184 * 2 * zoom, topH + 50 * 2 * zoom);

          ctx.lineWidth = 3;
          ctx.strokeStyle = "#F9B52F";

          ctx.moveTo(176 * 2 * zoom, topH + 68 * 2 * zoom);
          ctx.lineTo(234 * 2 * zoom, topH + 68 * 2 * zoom);
          ctx.stroke();

          ctx.fillStyle = "#8D5A4C";
          ctx.fillText("进入活动", 176 * 2 * zoom, topH + 68 * 2 * zoom);

          ctx.drawImage(
            imgArrow,
            161 * 2 * zoom,
            topH + 80 * 2 * zoom,
            84 * 2 * zoom,
            5 * 2 * zoom
          );

          ctx.fillStyle = "#AFAFAF";
          ctx.font = 20 * zoom + "px PingFang-SC-Medium";
          canvasTextAutoLine(
            "此二维码已安全认证，可以放心扫描",
            mycanvas,
            68 * 2 * zoom,
            topH + 18 * 2 * zoom + 122 * 2 * zoom,
            12 * 2 * zoom
          );
          // 生成base64海报地址
          let img = convertCanvasToImage(mycanvas);
          fn(img.src);
          // document.body.insertBefore(img, document.body.firstElementChild);
        });
      } catch (e) {
        Toast("生成海报失败，请重试！");
      }
    },
    operate(fl, checkTime) {
      console.log(this.currentData);
      this.saveShow = false;
      let params = JSON.parse(this.currentData),
        url = params.editType
          ? "api/oa/show/modifyActivity"
          : "api/oa/show/addActivity",
        rejectParam = [
          "limitNum_",
          "content_1",
          "content_2",
          "content_copy_1",
          "content_copy_2",
          "bg",
          "content_1",
          "block",
          "music",
          "top",
          "isedit",
          "editType",
          "percent",
          "shareImage",
        ];
      if (
        params.activityType < 4 ||
        params["content_" + params.contentType][0].paySet == 1
      ) {
        rejectParam = rejectParam.concat(["payDeadline"]);
      } else {
        params["payDeadline"] = params["payDeadline"] + " 23:59:59";
      }
      // 砍价拼团剔除参数
      if (params.activityType > 3) {
        rejectParam = rejectParam.concat(["signUpLimit", "limitNum"]);
      }
      // 新增剔除activityId
      if (!params.editType) {
        rejectParam = rejectParam.concat(["activityId"]);
      }
      params["showContentList"] = params["content_" + params.contentType];
      // 拼团需转'虚拟拼团'字段，抢购助力需清除编辑时留下的额外字段places_
      params["showContentList"].map((item) => {
        if (params.activityType == 3) {
          // item.virtualGroup = item.virtualGroup ? 1 : 0;
        }
        if (params.activityType == 1) {
          item.paySwitch = item.paySwitch ? 1 : 0;
        }
        if (params.editType) {
          if (params.activityType != 1) {
            delete item.places_;
            delete item.placesLimit_;
          }
        }
      });
      // 课程活动 删除套餐列表
      if (params.contentType == 2) {
        params["showContentList"].map((item) => {
          item.showActivityCourseList.map((ceil) => {
            if (ceil.feeType == 2) {
              ceil.endTime =
                moment(ceil.beginTime).format("YYYY-MM-DD") + " 23:59:59";
            }
            delete ceil.packages;
          });
        });
      }
      params["distSwitch"] = params["distSwitch"] ? 1 : 0;
      params["signUpLimit"] = params["signUpLimit"] ? 1 : 0;
      params["syncWebStatus"] = params["syncWebStatus"] ? 1 : 0;
      params["beginTime"] = params["beginTime"] + " 00:00:00";
      params["endTime"] = params["endTime"] + " 23:59:59";
      params["bgId"] = params["bg"].libId;
      params["blockId"] = params["block"].libId;
      params["musicId"] = params["music"].libId;
      params["topId"] = params["top"].libId;
      params["content"] = JSON.stringify(params["content"]);
      params["distContent"] = JSON.stringify(params["distContent"]);
      params["upDownStatus"] = fl ? 1 : 0; //0 待发布 1已发布
      if (checkTime) params[checkTime] = -1;
      // 剔除接口外参数
      rejectParam.map((item) => {
        delete params[item];
      });
      this.yznReq("post", url, params, "206").then((res) => {
        if (res.status == 200) {
          console.log(res);
          this.$router.replace({ path: "/mine" });
        }
        if (res.status == 206) {
          Dialog.confirm({
            title: "提示",
            message:
              "当前已过活动开始时间，活动一经发布即刻开始，确认发布活动？",
          })
            .then(() => {
              this.operate(true, "checkTime");
            })
            .catch(() => {});
        }
      });
    },
  },
  destroyed: function () {
    localStorage.removeItem("previewData");
  },
  mounted() {
    this.istem = this.$route.query.tem == 1;
    this.ispreview = this.$route.query.pre == 1;
    this.appCall();
    this.activityId = this.$route.query.id;
    if (!this.ispreview) {
      this.getDetail();
    } else {
      this.currentData = JSON.parse(localStorage.getItem("previewData"));
    }
    this.activityStatus = this.$route.query.st;
    switch (this.activityStatus + "") {
      case "0": //待发布
        this.actions = [
          { name: "编辑", router: "setting", type: "skip" },
          { name: "复制", router: "setting", type: "copy" },
          { name: "删除", type: "del" },
        ];
        break;
      case "1": //未开始
        this.actions = [
          { name: "数据", router: "myData", type: "skip" },
          { name: "编辑", router: "setting", type: "skip" },
          { name: "复制", router: "setting", type: "copy" },
          { name: "下架", type: "off" },
        ];
        break;
      case "2": //进行中
        this.actions = [
          { name: "分享", type: "share" },
          { name: "编辑", router: "setting", type: "skip" },
          { name: "复制", router: "setting", type: "copy" },
          { name: "下架", type: "off" },
        ];
        break;
      case "3": //已结束
        this.actions = [
          { name: "编辑", router: "setting", type: "skip" },
          { name: "复制", router: "setting", type: "copy" },
          { name: "下架", type: "off" },
        ];
        break;
      case "4": //已下架
        this.actions = [];
        break;
    }
  },
};
</script>
<style lang="less" scoped>
.fbWrap {
  padding: 0 12px 20px;
  > div:nth-of-type(1) {
    width: 100%;
    height: 40px;
    color: #fff;
    background-color: #13c2c2;
    border-radius: 4px;
    margin-top: 10px;
  }
  > div:nth-of-type(2) {
    width: 100%;
    height: 40px;
    color: #13c2c2;
    border: 1px solid #13c2c2;
    background-color: #fff;
    border-radius: 4px;
    margin-top: 10px;
  }
}
/deep/.van-share-sheet__options {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  .myOption {
    &:nth-of-type(2) {
      margin: 0 20px 0;
    }
    text-align: center;
    color: pink;
    img {
      width: 38px;
      height: 38px;
    }
  }
}

.a_ct {
  padding: 40px 0;
  > div {
    padding: 0 20px;
    background-color: pink;
    color: #000;
  }
}
.iframeWrap {
  background-color: #f8f8f8;
  width: 100%;
  height: 100%;
  overflow: scroll;
  #myIframe {
    height: 100%;
    width: 100%;
    // pointer-events: none;
  }
}

.operateFixed {
  color: #595959;
  width: 100%;
  height: 50px;
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: row;
  font-size: 16px;
  z-index: 1993;
  > div:nth-of-type(1) {
    .van-button--normal {
      width: 100%;
      height: 100%;
    }
    flex: 1;
    background-color: #fff;
    border-top: 1px solid #f0f0f0;
  }
  > div:nth-of-type(2) {
    .van-button--normal {
      width: 100%;
      height: 100%;
      font-size: 16px;
    }
    background-color: #13c2c2;
    flex: 1;
    color: #fff;
  }
}
.iframeWar {
  height: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}
</style>
