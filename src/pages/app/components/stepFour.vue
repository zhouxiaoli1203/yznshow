<template>
  <div>
    <van-form
      validate-first
      ref="form"
      @submit="next"
      error-message-align="right"
      :scroll-to-error="true"
      :show-error-message="false"
    >
      <van-cell-group class="mt10">
        <van-field
          style="display: none"
          v-model="acitivityParams.shareImageUrl"
          name="shareImageUrl"
          :rules="[{ required: true }]"
        />
        <div class="custum_van-cell-group hauto">
          <div class="c_f_column">
            <span class="required">封面图</span>
            <span class="f13 l25" style="color: #bfbfbf"
              >封面显示在微信分享窗口</span
            >
          </div>

          <div class="dom_r uploadWrap" @click="actionShow = true">
            <van-image
              v-show="acitivityParams.shareImageUrl"
              fit="cover"
              :src="acitivityParams.shareImageUrl"
              width="100%"
              height="100%"
            >
              <!-- <span
                class="imageDel"
                @click="
                  acitivityParams.shareImageUrl = '';
                  acitivityParams.shareImage = '';
                "
                ><i class="close"></i
              ></span> -->
              <!-- <template v-if="acitivityParams.shareImage">
                <van-overlay
                  :show="acitivityParams.shareImage.percent < 100"
                  class-name="mask"
                  :lock-scroll="false"
                >
                  <span class="uploadText">{{
                    acitivityParams.shareImage.uploadErr
                      ? "上传失败"
                      : acitivityParams.shareImage.percent + "%"
                  }}</span>
                </van-overlay>
              </template> -->
            </van-image>
          </div>
        </div>
      </van-cell-group>
      <van-field
        v-model="acitivityParams.shareTitle"
        label="分享标题"
        class="mt10 custom_required"
        input-align="right"
        placeholder="请输入分享标题"
        :rules="[{ required: true, message: '请输入分享标题' }]"
      />
      <div class="custum_van-cell-group" style="height: 34px">
        <span class="required">分享内容</span>
      </div>
      <van-field
        v-model="acitivityParams.shareDesc"
        type="textarea"
        class="custom_required pt0"
        rows="2"
        autosize
        input-align="left"
        placeholder="请输入分享内容"
        :rules="[{ required: true, message: '请输入分享内容' }]"
      />
      <div class="custum_van-cell-group mt10" style="background-color: #fff">
        <span>同步微官网</span>
        <van-switch
          v-model="acitivityParams.syncWebStatus"
          active-color="#16C6C6"
          inactive-color="#E2E2E2"
          size="24px"
        />
      </div>
    </van-form>
    <van-dialog
      v-model="show"
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
            $activitySub(acitivityParams, {
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
            $activitySub(acitivityParams, {
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
    <van-action-sheet
      v-model="actionShow"
      :actions="actions"
      cancel-text="取消"
      close-on-click-action
      @select="onSelect"
    />
    <qn-util
      style="width: 0"
      ref="topImg_"
      :options="{
        type: 2,
        accept: 'image/jpeg, image/png',
        multiple: false,
        hide: false,
        cropper: true,
      }"
      @live-info="
        liveInfo($event, acitivityParams, 'shareImageUrl', 'shareImage')
      "
    ></qn-util>
  </div>
</template>
<script>
import qnUtil from "../components/qnUtil";
import moment from "moment";
import { Dialog } from "vant";
import { Toast } from "vant";
export default {
  name: "stepFour",
  data() {
    return {
      show: false,
      actionShow: false,
      actions: [
        { name: "从相册中选择", type: 1 },
        { name: "恢复默认图", type: 2 },
      ],
    };
  },
  components: { qnUtil },
  props: {
    acitivityParams: {
      type: Object,
    },
  },
  methods: {
    moment,
    onSelect(data) {
      switch (data.type) {
        case 1:
          this.$refs.topImg_.$refs.myUpload.chooseFile();
          break;
        case 2:
          this.acitivityParams.shareImageUrl = this.acitivityParams.top
            ? this.acitivityParams.top.fileUrl
            : "";
          break;
      }
    },
    operate(fl, checkTime) {
      console.log(this.acitivityParams);
      this.show = false;
      let params = JSON.parse(JSON.stringify(this.acitivityParams)),
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
        if (params.activityType == 1) {
          item.paySwitch = item.paySwitch ? 1 : 0;
        }
        if (params.activityType == 3) {
          // item.virtualGroup = item.virtualGroup ? 1 : 0;
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
        if (res.status == 206 && fl) {
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
    next() {
      if (this.acitivityParams.editType) {
        this.$activitySub(this.acitivityParams, {
          url: "modifyActivity",
          router: this.$router,
        });
        // this.operate(true);
        return;
      }
      this.show = true;
    },
    // 单选
    liveInfo(data, obj, key, temKey) {
      // if (data.push) {
      //   this.$set(obj, temKey, data.list[0]);
      //   obj[key] = data.list[0].url;
      //   console.log(obj[temKey].percent);
      // } else {
      //   console.log(obj[temKey].percent);
      //   if (obj[temKey] && obj[temKey].t == data.list[0].t) {
      //     obj[temKey].percent = data.list[0].percent * 1;
      //     obj[temKey].uploadErr = data.list[0].uploadErr
      //       ? data.list[0].uploadErr
      //       : "";
      //     if (obj[temKey].percent == 100) {
      //       obj[key] = data.list[0].url;
      //       if (data.list[0].url.indexOf("yizhiniao") != -1) {
      //         delete obj[temKey];
      //       }
      //     }
      //   }
      // }
      if (data.push) {
        this.acitivityParams.shareImageUrl = data.list[0].url;
      }
      // this.$forceUpdate();
    },
  },
};
</script>

<style scoped lang="less">
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
.mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.uploadText {
  font-size: 12px;
  font-weight: bold;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
}
</style>
