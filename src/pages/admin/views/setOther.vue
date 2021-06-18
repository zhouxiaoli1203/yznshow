<template>
  <div style="position: relative">
    <div class="all">
      <a-row>
        <a-col :span="24" class="picBox">
          <p>
            封面图<b>*</b>
            <span class="tip">(封面显示在微信分享窗口)</span>
          </p>
          <div>
            <div class="imgChoice">
              <img :src="getShareImageUrl" alt="" />
              <div class="imgBtn">
                <span v-if="!isFirst" @click="recovery">恢复默认</span>
                <!-- <a-button type="link" class="link"> -->
                <upload-img type="txt" @uploaded="uploaded" />
                <!-- </a-button> -->
              </div>
            </div>
            <span class="top-tips"
              >建议尺寸200:200像素图片支持JPG、PNG格式</span
            >
          </div>
        </a-col>
      </a-row>
      <p>分享标题<span>（20字）</span><b>*</b></p>
      <div
        :class="{
          'form-err-group': !getValidate('title') && !isValueNew('title'),
        }"
      >
        <a-input
          size="large"
          @change="setValue('title', $event.target.value)"
          :value="getShareTitle"
          :maxLength="20"
        />
        <div
          class="form-err"
          v-if="!getValidate('title') && !isValueNew('title')"
        >
          请填写分享标题
        </div>
      </div>

      <p>分享内容<b>*</b></p>
      <div class="text">
        <div
          :class="{
            'form-err-group': !getValidate('desc') && !isValueNew('desc'),
          }"
        >
          <a-textarea
            placeholder="请填写分享内容"
            :rows="4"
            :maxLength="50"
            @change="setValue('desc', $event.target.value)"
            :value="getShareDesc"
          />
          <span
            ><s>{{ getShareDesc.length }}</s
            >/50</span
          >
          <div
            class="form-err"
            v-if="!getValidate('desc') && !isValueNew('desc')"
          >
            请填写分享内容(50字符以内)
          </div>
        </div>
      </div>
      <!-- <div class="setRow" v-if="$store.state.common.systemType == 2">
        <p>发布选择</p>
        <a-radio-group
          @change="setUpDownStatus($event.target.value)"
          :value="getUpDownStatus"
        >
          <a-radio :value="0">

            <span :class="{ 'ac-text': getUpDownStatus == 0 }">保存至待发布</span>
          </a-radio>
          <a-radio :value="1">
             <span :class="{ 'ac-text': getUpDownStatus == 1 }">直接发布活动</span>
          </a-radio>
        </a-radio-group>
      </div> -->
      <div class="setRow" v-if="$store.state.common.systemType == 2">
        <p>同步至微官网</p>
        <a-switch
          @change="setSyncWebStatus($event)"
          :checked="Boolean(getSyncWebStatus)"
        ></a-switch>
      </div>
      <!-- <div class="setRow" v-if="$store.state.common.systemType == 1"> -->

      <!-- </div> -->
      <div
        class="setRow"
        style="height: auto"
        v-if="$store.state.common.systemType == 1"
      >
        <p style="width: 100px">添加标签</p>
        <div>
          <template v-for="tag in tags">
            <a-checkable-tag
              :key="tag.tagId"
              :checked="selectedTags.indexOf(tag.tagId) > -1"
              @change="(checked) => handleChange(tag.tagId, checked)"
            >
              {{ tag.tagName }}
            </a-checkable-tag>
          </template>
        </div>
      </div>

      <p v-if="$store.state.common.systemType == 1" class="setRow">
        排序<b>*</b>
      </p>
      <div
        v-if="$store.state.common.systemType == 1"
        :class="{
          'form-err-group': !getValidate('order') && !isValueNew('order'),
        }"
      >
        <a-input
          size="large"
          @change="setValue('order', $event.target.value)"
          :value="getActivityOrder"
        />
        <div
          class="form-err"
          v-if="!getValidate('order') && !isValueNew('order')"
        >
          请填写顺序(正整数)
        </div>
      </div>
    </div>
    <div class="botBtn">
      <a-button
        type="primary"
        ghost
        size="large"
        class="next-btn"
        @click="goPrev"
      >
        上一步
      </a-button>
      <a-button type="primary" size="large" class="next-btn" @click="goNext"
        >保存</a-button
      >
    </div>

    <div class="pre-modal" v-if="getShowSuccModal">
      <div class="head">
        <span v-if="getUpDownStatus == 1">
          <a-icon type="check-circle" class="head-icon" theme='filled'/>
          活动发布成功
        </span>
        <span v-else>
          <a-icon type="check-circle" class="head-icon" theme='filled'/>
          活动保存成功
        </span>
      </div>
      <div class="body">
        <div v-if="systemType == 2">
          <h6>微信分享</h6>
          <div class="wx_share">
            <div class="wx_tab">
              <img :src="getShareImageUrl" />
              <div>
                <h5>{{ getShareTitle }}</h5>
                <span>{{ getShareDesc }}</span>
              </div>
            </div>
            <div class="wx_code">
              <qrcode-vue
                id="myCode"
                :value="
                  webEnv == 'prod'
                    ? prodUrl + '/show_h5/#/index?id=' + getActivityId
                    : BASEURL + '/show_h5/#/index?id=' + getActivityId
                "
              ></qrcode-vue>
              <span v-if="getUpDownStatus == 0">微信扫一扫预览活动</span>
              <span v-if="getUpDownStatus == 1">微信扫一扫分享活动</span>
            </div>
          </div>
          <h6>分享链接</h6>
          <div class="wx_link">
            <div class="site" id="wx_link_site">
              {{ BASEURL }}/show_h5/#/index?id={{ getActivityId }}
            </div>
            <a-button
              type="primary"
              size="small"
              class="site_bt"
              ghost
              @click="copyUrl"
              >复制链接</a-button
            >
          </div>
        </div>
        <div class="b-box">
          <a-button
            type="primary"
            ghost
            size="large"
            class="btn"
            @click="backEditor"
          >
            继续编辑
          </a-button>
          <a-button
            type="primary"
            v-if="getUpDownStatus == 1"
            size="large"
            class="btn"
            @click="goList"
          >
            查看活动列表
          </a-button>
          <a-button
            type="primary"
            v-if="getUpDownStatus == 0"
            size="large"
            class="btn"
            @click="upStatusActive"
          >
            发布活动
          </a-button>
        </div>
      </div>
    </div>

    <div class="pre-temp-modal" v-if="getShowSuccTemp">
      <a-button
        type="primary"
        ghost
        size="large"
        class="btn"
        @click="backEditor"
      >
        编辑
      </a-button>
      <a-button type="primary" size="large" class="btn" @click="goList">
        查看模板列表
      </a-button>
    </div>
  </div>
</template>

<script>
import throttle from "lodash/throttle";
import { yznReq } from "@/utils/yznhttp";
import QrcodeVue from "qrcode.vue";
import { validateStringLen, validateInteger } from "../../../utils/validate.js";
import { mapActions, mapGetters, mapMutations } from "vuex";
import UploadImg from "./components/uploadImg.vue";
export default {
  data() {
    return {
      isNew: {
        title: true,
        desc: true,
        order: true,
      },
      selectedTags: [],
      tags: [],
      id: "",
      systemType: 1,
      //isDisabled: false,
      isFirst: true,

      webEnv: "base",
      prodUrl: "https://m.yizhiniao.com",
    };
  },
  mounted() {
    if (window.location.host == "www.yizhiniao.com") {
      this.webEnv = "prod";
      this.prodUrl = window.location.protocol + "//" + "m.yizhiniao.com";
    }
    this.systemType = this.$route.query.systemType;
    this.id = this.$route.query.id;
    if (this.getSystemType == 1) {
      this.getAllTags();
      let showTag = this.getShowTag;
      let selected = [];
      showTag &&
        showTag.length &&
        showTag.forEach((i) => {
          console.log(i);
          selected.push(i.tagId);
        });
      this.selectedTags = selected;
    }
    // if (this.getActiveType == 3 && this.getActivityStatus == 3) {
    //   this.isDisabled = true;
    // }
    // 如果分享图片没有设置默认取顶部头图
    if (!this.getShareImageUrl) {
      this.setShareImageUrl(this.$store.state.common.topItem.url);
    }
    // 分享标题默认取活动名称
    if (!this.getShareTitle) {
      this.setShareTitle(this.$store.state.common.name);
    }
    this.oldImg = this.getShareImageUrl;
  },
  methods: {
    async getAllTags() {
      let res = await this.yznReq("get", "api/admin/show/listTag", {});
      this.tags = res.context;
    },
    close() {
      this.setShowSuccModal(false);
    },
    goList() {
      if (this.systemType == 1) {
        let u = `https://tadmin.yizhiniao.com/#/template`;
        window.open(u, "_blank");
        window.close();
      } else if (this.systemType == 2) {
        let u = `${this.BASEURL}/index.html#/myshow`;
        window.open(u, "_blank");
        window.close();
      }
    },
    handleChange(tagId, checked) {
      const { selectedTags } = this;
      const nextSelectedTags = checked
        ? [...selectedTags, tagId]
        : selectedTags.filter((t) => t !== tagId);
      let arr = [];
      nextSelectedTags.map((i) => {
        arr.push({
          tagId: i,
        });
      });
      this.selectedTags = nextSelectedTags;
      this.setShowTagList(arr);
    },
    getValidate(name) {
      if (name == "title") {
        return validateStringLen(this.getShareTitle, 20);
      } else if (name == "desc") {
        return validateStringLen(this.getShareDesc, 200);
      } else if (name == "order") {
        return validateInteger(this.getActivityOrder);
      }
    },
    isValueNew(name) {
      return this.isNew[name];
    },
    uploaded({ res }) {
      this.setShareImageUrl(res.url);
      this.isFirst = false;
    },
    recovery() {
      this.setShareImageUrl(this.oldImg);
    },
    goPrev() {
      this.$parent.goNext(2);
    },
    goNext() {
      const self = this;
      this.isNew = {
        title: false,
        desc: false,
        order: false,
      };
      this.$forceUpdate();
      if (!validateStringLen(this.getShareTitle, 20)) {
        return;
      }
      if (!validateStringLen(this.getShareDesc, 200)) {
        return;
      }
      if (!this.getShareImageUrl) {
        this.$message.error("请选择封面图");
        return;
      }
      if (self.getSystemType == 1) {
        if (this.getMode == 1) {
          self.addTemp({ status: 0 });
        } else {
          self.addTemp();
        }
      } else if (self.getSystemType == 2) {
        if (this.getMode == 1) {
          self.addActivity({ status: 0 });
        } else {
          self.addActivity();
        }
      }
      return;
    },
    setValue(name, v) {
      if (name == "title") {
        this.setShareTitle(v);
      } else if (name == "desc") {
        this.setShareDesc(v);
      } else if (name == "order") {
        this.setActivityOrder(v);
      }
      this.isNew[name] = false;
    },
    copyUrl() {
      var clipBoardContent = document.getElementById("wx_link_site").innerText;
      console.log(clipBoardContent);
      let oInput = document.createElement("input");
      oInput.value = clipBoardContent;
      document.body.appendChild(oInput);
      oInput.select();
      document.execCommand("Copy");
      oInput.style.display = "none";
      document.body.removeChild(oInput);
      window.alert("复制成功");
    },
    // 继续编辑编辑
    backEditor() {
      this.setMode(2);
      if (this.getSystemType == 2) {
        let id = this.getActivityId;
        let url = window.location.href;
        url = url.replace(/id\=(\d*)\&/, `id=${id}&`);
        url = url.replace(/mode\=1/, "mode=2");
        window.location.replace(url);
        this.$parent.goNext(0);
        this.setShowSuccModal(false);
        window.location.reload()
      } else if (this.getSystemType == 1) {
        let id = this.getActivityId;
        let url = window.location.href;
        url = url.replace(/mode\=1/, `id=${id}&mode=2`);
        window.location.replace(url);
        this.$parent.goNext(0);
        this.setShowSuccTemp(false);
        window.location.reload()
      }
    },
    // 发布
    upStatusActive: throttle(async function (obj) {
      let params = {
        activityId: this.getActivityId,
        upDownStatus: 1,
        checkTime: obj.checkTime || undefined
      };
      let self = this
      let res = await yznReq("post", "api/oa/show/upDownActivity", params, "206205");
      
      if (res && res.status == 200) {
        this.setUpDownStatus(1)
      } else if (res && res.status == 206) {
        this.$confirm({
          content: "当前已过活动开始时间，活动一经发布即刻开始，确认发布活动？",
          onOk() {
            self.upStatusActive({checkTime: -1})
          },
          okText: "确定",
          cancelText: "取消",
          onCancel() { },
        });
      } else if (res && res.status == 205) {
        this.$message.error(res.message)
      }
    }, 700),

    ...mapMutations("common", [
      "setShareImageUrl",
      "setShareTitle",
      "setShareDesc",
      "setSyncWebStatus",
      "setUpDownStatus",
      "setActivityOrder",
      "setShowSuccModal",
      "setShowTagList",
      "setMode",
      "setShowSuccTemp",
    ]),
    ...mapActions("common", ["addTemp", "addActivity"]),
  },
  computed: {
    ...mapGetters([
      "getShareImageUrl",
      "getShareTitle",
      "getShareDesc",
      "getSyncWebStatus",
      "getUpDownStatus",
      "getActivityOrder",
      "getSystemType",
      "getShowTag",
      "getShowSuccModal",
      "getActivityId",
      "getStartTime",
      "getActiveType",
      "getActivityStatus",
      "getShowSuccTemp",
      "getMode",
    ]),
  },
  components: {
    UploadImg,
    QrcodeVue,
  },
  watch: {
    getShowSuccModal(val) {
      if (val && this.systemType == 1) {
        this.goList();
      }
    },
  },
};
</script>

<style lang="less" scoped>
// .disabled {
//   pointer-events: none;
//   cursor: default;
//   opacity: 0.6;
// }
.all {
  position: relative;
  margin: 6px 100px 100px;
  p {
    margin-bottom: 6px;
    margin-top: 16px;
    color: #262626;
    font-size: 16px;
    font-weight: 500;
    align-self: flex-start;
    span {
      font-weight: normal;
      font-size: 14px;
      color: #bfbfbf;
    }
    b {
      font-weight: normal;
      color: #f84f43;
    }
  }
  .picBox {
    display: flex;
    flex-direction: column;
    align-items: self-end;
    > div {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .tip {
      color: #bfbfbf;
      font-size: 12px;
      text-align: center;
    }
  }
  .imgChoice {
    width: 195px;
    height: 195px;
    border-radius: 6px;
    position: relative;
    img {
      width: 100%;
      height: 100%;
      border-radius: 4px;
    }
    .imgBtn {
      width: 100%;
      height: 30px;
      color: #fff;
      position: absolute;
      bottom: 0;
      background: rgba(43, 43, 43, 0.8);
      display: flex;
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
      align-items: center;
      display: flex;
      .link {
        flex: 1;
      }
      > span {
        flex: 1;
        text-align: center;
        cursor: pointer;
        &:hover {
          color: #36cfc9;
        }
      }
      > div {
        margin: auto;
        width: 100%;
        flex: 1;
      }
    }
  }
  .top-tips {
    color: #bfbfbf;
    width: 136px;
    line-height: 20px;
    font-size: 12px;
    text-align: center;
    display: block;
    margin-top: 4px;
  }
  .text {
    position: relative;
    span {
      color: #bfbfbf;
      position: absolute;
      bottom: 4px;
      right: 10px;
      s {
        color: #13c2c2;
        text-decoration: none;
      }
    }
  }
  .setRow {
    display: flex;
    height: 24px;
    align-items: center;
    margin-bottom: 6px;
    margin-top: 16px;
    p {
      margin: 0 24px 0 0;
    }
    &:last-child {
      margin-bottom: 36px;
    }
  }
}
.botBtn {
  padding-top: 10px;
  border-top: 1px solid #f2f2f2;
  text-align: center;
  padding-bottom: 10px;
  position: fixed;
  right: 0;
  bottom: 0;
  width: 823px;
  background-color: #fff;
}
.next-btn {
  width: 125px;
  height: 40px;
  &:first-child {
    margin-right: 24px;
  }
}
.all /deep/ .ant-upload {
  width: 100%;
  display: block;
  text-align: center;
}
.pre-temp-modal {
  width: 821px;
  height: 100vh;
  background: #fff;
  position: fixed;
  top: 40px;
  display: flex;
  z-index: 999;
  justify-content: center;
  .btn {
    margin-top: 30px;
  }
  .btn:first-child {
    margin-right: 20px;
  }
}
.pre-modal {
  width: 100%;
  min-height: 100%;
  background: #fff;
  position: absolute;
  top: -104px;
  .head {
    height: 62px;
    border-bottom: 1px solid #f0f0f0;
    background: #F6FFFF;
    color: #13C2C2;
    display: flex;
    .head-icon {
      font-size: 20px;
      color: #2BE3E3;
      vertical-align: -4px;
    }
    .close {
      font-size: 20px;
      line-height: 62px;
      margin-left: 36px;
    }
    span {
      margin-right: 61px;
      flex-grow: 1;
      text-align: center;
      font-size: 16px;
      line-height: 62px;
    }
  }
  .body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: #fff;
    margin: 24px 43px 34px;
    flex-wrap: wrap;
    .btn:first-child {
      margin-right: 24px;
    }
    h6 {
      font-size: 16px;
      color: #262626;
      font-weight: 500;
    }
    .wx_share {
      border: 1px solid #f0f0f0;
      border-radius: 4px;
      padding: 24px;
      margin-bottom: 35px;
      width: 622px;
      h5 {
        font-size: 20px;
        color: #1f1f1f;
        font-weight: 500;
        margin-top: 10px;
        margin-bottom: 9px;
      }
      .wx_tab {
        background: #f8f8f8;
        height: 107px;
        padding: 8px;
        display: flex;
        img {
          width: 91px;
          height: 91px;
          border-radius: 4px;
          margin-right: 24px;
        }
        span {
          color: #595959;
          font-size: 16px;
        }
      }
    }
    .wx_code {
      height: 281px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      #myCode {
        width: 200px !important;
        height: 200px !important;
        margin-top: 24px;
        margin-bottom: 13px;
      }
      span {
        font-size: 14px;
        color: #595959;
      }
    }
    .wx_link {
      display: flex;
      margin-bottom: 60px;
      .site {
        background: #f8f8f8;
        font-size: 14px;
        line-height: 32px;
        padding-left: 17px;
        padding-right: 13px;
      }
      .site_bt {
        height: 32px;
        margin-left: 8px;
      }
    }
    .b-box {
      padding-top: 10px;
      border-top: 1px solid #f2f2f2;
      text-align: center;
      padding-bottom: 10px;
      position: fixed;
      right: 0;
      bottom: 0;
      width: 823px;
      background-color: #fff;
    }
  }
}
.ac-text {
  color: #36cfc9;
}
.ant-radio-wrapper-disabled /deep/ .ac-text {
  color: #d9d9d9;
}
</style>