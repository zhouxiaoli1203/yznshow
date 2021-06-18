<template>
  <div
    :class="[acitivityParams.isedit ? 'edit' : '']"
    style="background-color: #f8f8f8; over-flow: auto; padding-bottom: 60px"
  >
    <!-- 进度 -->
    <div class="step_wrap c_f_center">
      <div
        class="step"
        :class="[step == index ? 'active' : index < step ? 'done' : '']"
        v-for="(item, index) in steps"
        :key="index"
      >
        <div class="c_f_column_c" @click="steped >= index && (step = index)">
          <!-- <div class="c_f_column_c" @click="step = index"> -->
          <span class="icon c_f_center"
            ><van-icon v-if="step > index" name="success" /><span
              v-if="step <= index"
              >{{ index + 1 }}</span
            ></span
          >
          <span class="text">{{ item.name }}</span>
        </div>
        <div
          class="border"
          :class="[step >= index || (step == 3 && index == 2) ? 'active' : '']"
          v-if="index != steps.length - 1"
        ></div>
      </div>
    </div>
    <!-- 步骤 -->
    <stepOne v-if="step == 0" ref="form_0" :acitivityParams="acitivityParams" />
    <stepTwo v-if="step == 1" ref="form_1" :acitivityParams="acitivityParams" />
    <stepThree
      v-if="step == 2"
      ref="form_2"
      :acitivityParams="acitivityParams"
    />
    <stepFour
      ref="form_3"
      v-if="step == 3"
      :acitivityParams="acitivityParams"
    />
    <!-- 提交预览 -->
    <div class="operateFixed">
      <!-- <div class="c_f_center" @click="preview"> -->
      <div
        class="c_f_center"
        @click="
          $activitySub(acitivityParams, {
            url: 'savePreview',
            upDownStatus: false,
            router: $router,
          })
        "
      >
        <van-icon name="browsing-history-o" class="mr5" />
        预览活动
      </div>
      <div
        class="c_f_center"
        v-if="step > 0"
        :class="[step > 0 ? 'border' : '']"
      >
        <van-button color="#13c2c2" @click="step--" class="c_f_center">
          <van-icon name="arrow-left" style="margin-top: -4px" /><span
            >上一步</span
          >
        </van-button>
      </div>
      <div class="c_f_center">
        <van-button color="#13c2c2" @click="formSub()" class="c_f_center">
          <span>{{ step == 3 ? "完成" : "下一步" }}</span>
          <van-icon v-if="step != 3" name="arrow" style="margin-top: -4px" />
        </van-button>
      </div>
    </div>
  </div>
</template>

<script>
import stepOne from "../components/stepOne";
import stepTwo from "../components/stepTwo";
import stepThree from "../components/stepThree";
import stepFour from "../components/stepFour";
import { Toast } from "vant";
import moment from "moment";
export default {
  name: "setting",
  components: { stepOne, stepTwo, stepThree, stepFour },
  data() {
    return {
      step: 0, //制作进度
      steped: 0, //已过进度
      steps: [
        { name: "活动设置" },
        { name: "页面设置" },
        { name: "分销设置" },
        { name: "其他设置" },
      ],
      activityId: "",
      acitivityParams: {
        dataBack: false,
        activityStatus: 0,
        isedit: false, //是否置灰输入框
        editType: false, //step4调接口判断
        activityId: "",
        activityName: "",
        endTime: "",
        beginTime: "",
        payDeadline: "",
        activityType: 1, //活动类型 1：微传单、2：抢购、3：拼团、4：砍价、5：助力
        contentType: "1", //前端字段 是否是课包 1自定义 2课程
        content_1: [], //自定义
        content_2: [], //课程
        content_copy_1: [],
        content_copy_2: [],
        top: {},
        block: {},
        bg: {},
        music: { fileName: "无" },
        shopPhone: "", //机构电话
        info: "", //报名必填信息
        content: [], //文字图片
        // STEP3
        distSwitch: true, //分销 1开 0关
        distContent: [], //分销内容 文字图片
        // STEP4
        shareImageUrl: "", // 分享封面图片地址
        shareTitle: "", // 分享标题
        shareDesc: "", // 分享描述
        syncWebStatus: "", //是否同步到微官网 1同步 0不同步
        upDownStatus: "", //发布状态 0待发布 1发布
      },
    };
  },
  watch: {
    // activityId(curVal, oldVal) {
    //   if (curVal) {
    //     this.getDetail();
    //   }
    // },
  },
  methods: {
    moment,
    //预览活动
    // preview(fl) {
    //   console.log(this.acitivityParams);
    //   let params = JSON.parse(JSON.stringify(this.acitivityParams)),
    //     rejectParam = [
    //       "limitNum_",
    //       "content_1",
    //       "content_2",
    //       "content_copy_1",
    //       "content_copy_2",
    //       // "bg",
    //       // "block",
    //       // "music",
    //       // "top",
    //       "isedit",
    //       "editType",
    //       "percent",
    //       "shareImage",
    //     ];
    //   if (params.activityType < 4) {
    //     rejectParam = rejectParam.concat(["payDeadline"]);
    //   } else {
    //     params["payDeadline"] =
    //       params["payDeadline"] && params["payDeadline"] + " 23:59:59";
    //   }
    //   // 砍价拼团剔除参数
    //   if (params.activityType > 3) {
    //     rejectParam = rejectParam.concat(["signUpLimit", "limitNum"]);
    //   }
    //   // 新增剔除activityId
    //   if (!params.editType) {
    //     rejectParam = rejectParam.concat(["activityId"]);
    //   }
    //   params["showContentList"] = params["content_" + params.contentType];
    //   // 拼团需转'虚拟拼团'字段，抢购助力需清除编辑时留下的额外字段places_
    //   params["showContentList"].map((item) => {
    //     if (params.activityType == 3) {
    //       // item.virtualGroup = item.virtualGroup ? 1 : 0;
    //     }
    //     if (params.activityType == 1) {
    //       item.paySwitch = item.paySwitch ? 1 : 0;
    //     }
    //     if (params.editType) {
    //       if (params.activityType != 1) {
    //         delete item.places_;
    //         delete item.placesLimit_;
    //       }
    //     }
    //   });
    //   // 课程活动 删除套餐列表
    //   if (params.contentType == 2) {
    //     params["showContentList"].map((item) => {
    //       item.showActivityCourseList.map((ceil) => {
    //         if (ceil.feeType == 2) {
    //           ceil.endTime =
    //             moment(ceil.beginTime).format("YYYY-MM-DD") + " 23:59:59";
    //         }
    //         delete ceil.packages;
    //       });
    //     });
    //   }
    //   params["distSwitch"] = params["distSwitch"] ? 1 : 0;
    //   params["signUpLimit"] = params["signUpLimit"] ? 1 : 0;
    //   params["syncWebStatus"] = params["syncWebStatus"] ? 1 : 0;
    //   params["beginTime"] = params["beginTime"] + " 00:00:00";
    //   params["endTime"] = params["endTime"] + " 23:59:59";
    //   params["bgId"] = params["bg"].libId;
    //   params["blockId"] = params["block"].libId;
    //   params["musicId"] = params["music"].libId;
    //   params["topId"] = params["top"].libId;
    //   params["content"] = JSON.stringify(params["content"]);
    //   params["distContent"] = JSON.stringify(params["distContent"]);
    //   params["upDownStatus"] = fl ? 1 : 0; //0 待发布 1已发布
    //   // 剔除接口外参数
    //   rejectParam.map((item) => {
    //     delete params[item];
    //   });
    //   this.yznReq("post", "api/oa/show/savePreview", params).then((res) => {
    //     if (res.status == 200) {
    //       // this.previewed = true;
    //       localStorage.setItem(
    //         "previewData",
    //         JSON.stringify(this.acitivityParams)
    //       );
    //       this.$router.push({
    //         path: "/preview",
    //         query: Object.assign({
    //           id: res.context.activityId,
    //           pre: 1,
    //           tem: 1,
    //           tl: "预览活动",
    //         }),
    //       });
    //     }
    //   });
    // },
    // 表单检验
    formSub() {
      let that = this;
      //非表单元素map表及额外判断
      let err_nont_form = {
        setErr(text) {
          if (!this.formErr[0]) this.formErr = [true, text];
        },
        formErr: [false, ""],
        shareImageUrl: "请选择上传封面图",
        //表单外额外检验
        step_0() {
          // 活动时间
          if (
            moment(that.acitivityParams.endTime) <
            moment(that.acitivityParams.beginTime)
          ) {
            this.setErr("活动结束时间须大于开始时间");
          }

          let temContent =
            that.acitivityParams[`content_${that.acitivityParams.contentType}`];
          // 活动内容判断
          if (that.acitivityParams.activityType < 4) {
            if (!temContent.length) {
              this.setErr("请添加活动内容");
            }
          } else {
            if (
              that.acitivityParams.contentType == 2 &&
              !temContent[0].showActivityCourseList.length
            ) {
              this.setErr("请添加活动课程");
            }
          }

          // 抢购报名限制判断
          if (
            that.acitivityParams.activityType == 2 &&
            that.acitivityParams.signUpLimit &&
            that.acitivityParams.limitNum * 1 > temContent.length
          ) {
            this.setErr("每个学员选报不能超过设置的商品种类");
          }

          // 拼团条件判断
          if (that.acitivityParams.activityType == 3) {
            that.acitivityParams[
              `content_${that.acitivityParams.contentType}`
            ].forEach((item) => {
              let lastOne =
                item.showContentRuleList[item.showContentRuleList.length - 1];
              if (!item.showContentRuleList.length) {
                this.setErr("请新增最少一个梯度");
              }
              if (that.acitivityParams.contentType == 2) {
                if (!item.showActivityCourseList.length) {
                  this.setErr("请新增课程");
                } else {
                  let str = "",
                    totalPrice = 0;
                  item.showActivityCourseList.forEach((ceil, index) => {
                    totalPrice +=
                      (ceil["coursePrice"] ? ceil["coursePrice"] : 0) * 1;
                    if (
                      !str &&
                      ceil.feeType == 2 &&
                      moment(ceil.endTime) < moment(ceil.beginTime)
                    ) {
                      str += `课程${index + 1}：课程结束时间不能小于开始时间`;
                    }
                  });
                  if (str) {
                    this.setErr(str);
                  }

                  if (lastOne && lastOne.price * 1 >= totalPrice) {
                    this.setErr(`课包总价不能小于最低梯度价`);
                  }
                }
              } else {
                if (
                  lastOne &&
                  lastOne.price * 1 >= temContent[0].originalPrice
                ) {
                  this.setErr(`商品原价不能小于最低梯度价`);
                }
              }
              if (
                item.paySet == 3 &&
                lastOne &&
                item.prepaidAmount * 1 >= lastOne.price * 1
              ) {
                this.setErr("商品预付金额须小于最低梯度价");
              }
            });
          }

          // 砍价助力课程活动判断
          if (that.acitivityParams.activityType > 3) {
            if (that.acitivityParams.contentType == 2) {
              //课包总价
              let totalPrice = 0;
              //按月时间
              let str = "";
              temContent[0].showActivityCourseList.forEach((item, index) => {
                totalPrice +=
                  (item["coursePrice"] ? item["coursePrice"] : 0) * 1;
                if (
                  !str &&
                  item.feeType == 2 &&
                  moment(item.endTime) < moment(item.beginTime)
                ) {
                  str += `课程${index + 1}：课程结束时间不能小于开始时间`;
                }
              });
              if (str) {
                this.setErr(str);
              }
              if (temContent[0].floorPrice >= totalPrice) {
                this.setErr(
                  `课包总价不能小于${
                    that.acitivityParams.activityType == 4
                      ? "砍价底价"
                      : "活动价"
                  }`
                );
              }
            } else {
              if (temContent[0].originalPrice <= temContent[0].floorPrice) {
                this.setErr(
                  `${
                    that.acitivityParams.activityType == 4
                      ? "砍价底价"
                      : "活动价"
                  }需小于原价`
                );
              }
            }
          }
          return this.formErr;
        },
        step_1() {
          return this.formErr;
        },
        step_2() {
          return this.formErr;
        },
        step_3() {
          return this.formErr;
        },
      };
      let form = this.$refs["form_" + this.step].$refs.form;
      form
        .validate()
        .then(() => {
          let err = err_nont_form["step_" + this.step]();
          if (err_nont_form["step_" + this.step] && err[0]) {
            Toast(err[1]);
            return;
          }
          form.submit();
          if (this.step < 3) {
            this.step++;
            this.step > this.steped && this.steped++;
          }
        })
        .catch((err) => {
          if (err[0].message) {
            return Toast(err[0].message);
          }
          if (err[0].name && err_nont_form[err[0].name]) {
            Toast(err_nont_form[err[0].name]);
          }
        });
    },
    getDetail() {
      this.yznReq("get", "api/oa/show/tempDetail", {
        activityId: this.activityId,
      }).then((res) => {
        if (res.status == 200) {
          this.acitivityParams["content_1"] = [];
          this.acitivityParams["content_2"] = [];
          // 未发布不限制
          // 已发布且为微传单只限制类型

          this.acitivityParams.editType = this.$route.query.edit == 1;
          if (this.acitivityParams.editType) {
            // activityStatus 0:待发布 1：未开始 2：进行中 3：已结束 4：已下架
            this.acitivityParams.isedit =
              res.context.activityStatus == 0 || res.context.activityStatus == 1
                ? false
                : true;
          } else {
            this.acitivityParams.isedit = false;
          }

          // 新增或者复制下  活动时间为 当前  --  +30天 付款截止时间 +37天
          if (!this.acitivityParams.editType) {
            res.context.beginTime = moment(new Date()).format("YYYY-MM-DD");
            res.context.endTime = moment(
              moment(res.context.beginTime).add(29, "d")
            ).format("YYYY-MM-DD");
            res.context.payDeadline = moment(
              moment(res.context.endTime).add(7, "d")
            ).format("YYYY-MM-DD");

            res.context.activityStatus = 0;
          }

          let case_ =
            this.acitivityParams.editType && res.context.activityStatus > 1;
          res.context["showContentList"].map((item) => {
            if (res.context.activityType == 1) {
              //新增或复制线上支付默认为关
              item.paySwitch = item.paySwitch == 1;
            }
            item.places = item.places + "";
            if (res.context.activityType == 3) {
              //拼团参与限制开关
              item.limitItems = item.limitItems == 1;
              item.showContentRuleList.forEach((item) => {
                item.number = item.number + "";
              });
            }

            delete item.activityId;
            if (case_) {
              item.placesLimit_ = item.placesLimit;
              item.places_ = item.places;
            } else {
              delete item.contentId;
              if (res.context.activityType == 3) {
                item.showContentRuleList.map((ceil) => {
                  delete ceil.ruleId;
                });
              }
            }
          });
          // Step1
          res.context.beginTime = moment(res.context.beginTime).format(
            "YYYY-MM-DD"
          );
          res.context.endTime = moment(res.context.endTime).format(
            "YYYY-MM-DD"
          );
          if (res.context.payDeadline) {
            res.context.payDeadline = moment(res.context.payDeadline).format(
              "YYYY-MM-DD"
            );
          }
          res.context["signUpLimit"] = res.context["signUpLimit"] == 1;
          res.context["limitNum_"] = res.context["limitNum"];
          res.context["syncWebStatus"] = res.context["syncWebStatus"] == 1;
          // 添加自定义课包默认值
          if (res.context.activityType > 2) {
            this.acitivityParams["content_1"].push(
              Object.assign(
                {
                  placesLimit: 1,
                  limitItems: 0,
                  places: "40",
                },
                res.context.activityType == 3
                  ? { showContentRuleList: [], limitItems: false, paySet: 3 }
                  : res.context.activityType == 5
                  ? { maxNumber: "8" }
                  : {}
              )
            );
            this.acitivityParams["content_2"].push(
              Object.assign(
                {
                  placesLimit: 1,
                  limitItems: 0,
                  places: "40",
                  showActivityCourseList: [],
                },
                res.context.activityType == 3
                  ? { showContentRuleList: [], limitItems: false, paySet: 3 }
                  : res.context.activityType == 5
                  ? { maxNumber: "8" }
                  : {}
              )
            );
          }
          res.context["content_" + res.context.contentType] =
            res.context["showContentList"];

          if (res.context.activityType < 4) {
            this.$set(this.acitivityParams, "signUpLimit", "");
            this.$set(this.acitivityParams, "limitNum", "");
            this.$set(this.acitivityParams, "limitNum_", ""); //用于编辑 比对默认值
          }
          // Step2
          res.context["content"] = JSON.parse(res.context["content"]);
          // Step3
          res.context["distSwitch"] = res.context["distSwitch"] == 1;
          res.context["distContent"] = JSON.parse(res.context["distContent"]);
          // console.log(Object.keys(this.acitivityParams));
          Object.keys(this.acitivityParams).forEach((key) => {
            if (res.context[key] !== undefined)
              this.acitivityParams[key] = res.context[key];
          });
          this.acitivityParams["dataBack"] = true;
          // 新建活动时多传个参数 "tempId": 9,// 模板id
          if (res.context.dataType == 1) {
            this.acitivityParams.tempId = res.context.activityId;
          }
          console.log(this.acitivityParams);
          // 初始内容compare
          this.acitivityParams["content_copy_1"] = JSON.parse(
            JSON.stringify(this.acitivityParams["content_1"])
          );
          this.acitivityParams["content_copy_2"] = JSON.parse(
            JSON.stringify(this.acitivityParams["content_2"])
          );
        }
      });
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (from.name == "factory" || from.name == "lib") {
        vm.$store.commit("MODIFY", {
          key: "STEP1_INIT",
          value: false,
        });
        document.body.scrollIntoView();
      }
    });
  },
  activated() {
    if (this.$store.state.STEP1_INIT) {
      this.step = 0;
      this.activityId = this.$route.query.id;
      this.getDetail();
    }
  },
};
</script>
<style lang="less" scoped>
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
    border-top: 1px solid #f8f8f8;
  }
  > div:nth-of-type(2) {
    &.border {
      border-right: 1px solid #fff;
    }
  }
  > div:nth-of-type(2),
  > div:nth-of-type(3) {
    .van-button--normal {
      width: 100%;
      font-size: 16px;
      height: 100%;
    }
    background-color: #13c2c2;
    flex: 1;
    color: #fff;
  }
}
.step_wrap {
  width: 100%;
  height: 60px;
  background-color: #f5ffff;
  color: #595959;
  .step {
    &.done {
      .c_f_column_c {
        .icon {
          width: 26px;
          height: 26px;
          border: 3px solid #f5ffff;
          box-shadow: 0 0 1px 1px #13c2c2 inset;
          background-color: #fff;
          color: #13c2c2;
        }
        // .text {
        //   color: #13c2c2;
        // }
      }
    }
    &.active {
      .c_f_column_c {
        .icon {
          width: 26px;
          height: 26px;
          border: 0px solid #f5ffff;
          background: -moz-linear-gradient(top, #2be3e3 0%, #13c2c2 100%);
          background: -webkit-gradient(
            linear,
            left top,
            left bottom,
            color-stop(0%, #2be3e3),
            color-stop(100%, #13c2c2)
          );
          background: -webkit-linear-gradient(top, #2be3e3 0%, #13c2c2 100%);
          background: -o-linear-gradient(top, #2be3e3 0%, #13c2c2 100%);
          background: -ms-linear-gradient(top, #2be3e3 0%, #13c2c2 100%);
          background: linear-gradient(to bottom, #2be3e3 0%, #13c2c2 100%);
        }
        .text {
          color: #13c2c2;
        }
      }
    }
    position: relative;
    width: 90px;
    height: 100%;
    .c_f_column_c {
      .icon {
        transition: all 0.3s;
        box-sizing: border-box;
        color: #fff;
        font-size: 15px;
        font-weight: bold;
        margin-top: 7px;
        width: 26px;
        height: 26px;
        border: 3px solid #f5ffff;
        border-radius: 50%;
        background-color: #d1d1d1;
      }
      .text {
        margin-top: 6px;
      }
    }
    .border {
      &.active {
        border-color: #13c2c2;
      }
      width: 56px;
      height: 0;
      border-top: 1px dashed #bfbfbf;
      position: absolute;
      top: 20px;
      right: -28px;
    }
  }
}
/deep/.van-button__text {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  .van-icon-arrow,
  .van-icon-arrow-left {
    margin-bottom: -3px;
  }
}
</style>
