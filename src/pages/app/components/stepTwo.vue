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
      <div style="width: 0; position: relative">
        <qn-util
          ref="topImg"
          :options="{
            type: 2,
            accept: 'image/jpeg, image/png',
            multiple: false,
            hide: false,
            cropper: true,
          }"
          @live-info="liveInfo($event)"
        ></qn-util>
      </div>
      <div class="temPicWrap">
        <div @click="checkDetail(acitivityParams.top, 1)">
          <van-image
            fit="cover"
            :src="acitivityParams.top.fileUrl"
            width="100%"
            height="100%"
          />
        </div>
        <div @click="checkDetail(acitivityParams.block, 3)">
          <van-image
            fit="cover"
            :src="acitivityParams.block.fileUrl"
            width="100%"
            height="100%"
          />
        </div>
        <div @click="checkDetail(acitivityParams.bg, 0)">
          <van-image
            fit="cover"
            :src="acitivityParams.bg.fileUrl"
            width="100%"
            height="100%"
          />
        </div>
      </div>
      <van-cell-group>
        <div
          class="custum_van-cell-group"
          @click="routerSkip('lib', acitivityParams.music.libId, 2)"
        >
          <span>背景音乐</span>
          <div class="c_f_center">
            <van-field
              v-model="acitivityParams.music.fileName"
              placeholder="选择背景音乐"
              readonly
              input-align="right"
              class="pr0"
            />
            <van-icon name="arrow" />
          </div>
        </div>
      </van-cell-group>
      <van-field
        label="机构电话"
        class="mt10"
        v-model="acitivityParams.shopPhone"
        type="tel"
        maxlength="20"
        placeholder="请填写机构电话"
        input-align="right"
      />
      <!-- 报名信息 -->
      <van-cell-group class="mt10">
        <div class="custum_van-cell-group">
          <div class="c_f_center">
            <span>报名必填信息</span>
            <span>（必填项最多5项）</span>
          </div>
        </div>
        <div class="requiredWrap fixed">
          <div>
            <span>学员姓名</span
            ><var class="c_f_center"><van-icon name="success" /></var>
          </div>
          <div>
            <span>联系电话</span
            ><var class="c_f_center"><van-icon name="success" /></var>
          </div>
        </div>
        <div class="requiredWrap">
          <div
            v-for="(item, index) in requireds"
            :key="index"
            @click="requiredClick(item)"
            :class="[item.checked ? 'active' : '']"
          >
            <span>{{ item.name }}</span
            ><var class="c_f_center"><van-icon name="success" /></var>
          </div>
        </div>
      </van-cell-group>
      <!-- 活动展示 -->

      <!-- 活动展示 -->
      <add-content
        :content="acitivityParams.content"
        @contentChange="change"
        :isedit="false"
      />
    </van-form>
    <van-image-preview v-model="previewImg.show" :images="previewImg.images">
      <template v-slot:index>
        <van-button
          color="#13c2c2"
          size="normal"
          @click="
            previewImg.type == 1
              ? ((show = true), (previewImg.show = false))
              : routerSkip('lib', previewImg.id, previewImg.type)
          "
          >更换{{ previewImg.type == 0 ? "背景" : "图片" }}</van-button
        >
      </template>
    </van-image-preview>
    <van-action-sheet
      v-model="show"
      :actions="actions"
      cancel-text="取消"
      close-on-click-action
      @select="onSelect"
    />
  </div>
</template>
<script>
import qnUtil from "../components/qnUtil";
import addContent from "../components/addContent";
import { Toast } from "vant";
export default {
  name: "stepTwo",
  components: { addContent, qnUtil },
  data() {
    return {
      show: false,
      actions: [
        { name: "从相册中选择", type: 1 },
        { name: "秀图库", type: 2 },
      ],
      previewImg: {
        show: false,
        images: [],
        type: "",
      },
      requireds: [
        {
          name: "年龄",
          key: "age",
          checked: false,
        },
        {
          name: "出生日期",
          key: "birthday",
          checked: false,
        },
        {
          name: "在读学校",
          key: "schoolname",
          checked: false,
        },
        {
          name: "性别",
          key: "sex",
          checked: false,
        },
        {
          name: "年级",
          key: "gradle",
          checked: false,
        },
      ],
    };
  },
  props: {
    acitivityParams: {
      type: Object,
    },
  },
  watch: {
    $route(to, from) {
      if (from.name === "lib") {
        if (localStorage.getItem("show_lib_data") == "nomusic") {
          this.acitivityParams.musicId = "";
          this.acitivityParams.music = {
            fileName: "无",
          };
          localStorage.removeItem("show_lib_data");
          return;
        }
        let item = JSON.parse(localStorage.getItem("show_lib_data"));
        if (item) {
          this.acitivityParams[
            item.fileType == 0
              ? "bgId"
              : item.fileType == 3
              ? "blockId"
              : item.fileType == 1
              ? "topId"
              : "musicId"
          ] = item ? item.libId : "";
          this.acitivityParams[
            item.fileType == 0
              ? "bg"
              : item.fileType == 3
              ? "block"
              : item.fileType == 1
              ? "top"
              : "music"
          ] = item;
          if (item.fileType == 1) {
            this.acitivityParams.shareImageUrl = this.acitivityParams.top.fileUrl;
          }
          localStorage.removeItem("show_lib_data");
        }
      }
    },
  },
  methods: {
    //自定义上传 顶部图
    addTopUrl(url) {
      this.yznReq("post", "api/oa/show/addTopUrl", {
        fileUrl: url,
      }).then((res) => {
        this.acitivityParams.top = res.context;
        this.acitivityParams.shareImageUrl = res.context.fileUrl;
      });
    },
    onSelect(data) {
      switch (data.type) {
        case 1:
          this.$refs.topImg.$refs.myUpload.chooseFile();
          break;
        case 2:
          this.routerSkip("lib", this.previewImg.id, this.previewImg.type);
          break;
      }
    },
    // 单选
    liveInfo(data) {
      if (data.push) {
        this.addTopUrl(data.list[0].url);
      }
    },
    change(val) {},
    requiredClick(data) {
      // if (this.acitivityParams.isedit) return;
      if (!data.checked) {
        let count = 0;
        this.requireds.forEach((item) => {
          if (item.checked) count++;
        });
        if (count == 3) return;
        data.checked = !data.checked;
      } else {
        data.checked = !data.checked;
      }
      let str = "name,phone,";
      this.requireds.map((item, index) => {
        if (item.checked) {
          str += item.key + ",";
        }
      });
      str = str.substring(0, str.length - 1);
      this.acitivityParams.info = str;
    },
    next() {},
    checkDetail(lib, type) {
      this.previewImg = {
        show: true,
        images: [lib.fileUrl],
        type: type,
        id: lib.libId,
      };
    },
    routerSkip(name, id, type) {
      // if (this.acitivityParams.isedit) return;
      this.previewImg.show = false;
      setTimeout(() => {
        this.$router.push({
          path: "/" + name,
          query: { id: id, tp: type },
        });
      });
    },
  },
  mounted() {
    this.requireds.forEach((item) => {
      item.checked = this.acitivityParams.info.indexOf(item.key) != -1;
    });
  },
};
</script>

<style scoped lang="less">
/deep/.van-image-preview__index {
  bottom: 30px;
  top: auto;
}
.temPicWrap {
  padding: 14px 8px;
  display: flex;
  flex-direction: row;
  > div {
    box-sizing: border-box;
    position: relative;
    &:after {
      content: "";
      color: #fff;
      text-align: center;
      line-height: 26px;
      position: absolute;
      font-size: 12px;
      left: 6px;
      right: 6px;
      bottom: 0;
      height: 26px;
      background-color: #2a2a2a;
      opacity: 0.71;
    }
    &:nth-of-type(1):after {
      content: "顶部图";
    }
    &:nth-of-type(2):after {
      content: "选择区块样式";
    }
    &:nth-of-type(3):after {
      content: "背景图";
    }
    width: 120px;
    height: 108px;
    padding: 0 6px;
    img {
      width: 100%;
      display: block;
    }
  }
}
.requiredWrap {
  &.fixed {
    padding-bottom: 0;
    > div {
      background-color: #f0f0f0;
      border-color: #f0f0f0;
      var {
        background-color: #13c2c2;
      }
    }
  }
  padding: 0 14px 8px;
  overflow: auto;
  > div {
    margin-right: 8px;
    margin-bottom: 8px;
    float: left;
    display: flex;
    width: auto;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 0 3px 0 9px;
    height: 26px;
    font-size: 15px;
    border: 1px solid #d6d6d6;
    border-radius: 3px;
    span {
      margin-right: 4px;
    }
    var {
      width: 13px;
      height: 13px;
      display: inline-block;
      background-color: #d6d6d6;
      color: #fff;
      border-radius: 50%;
      font-size: 13px;
    }
    &.active {
      border-color: #13c2c2;
      color: #13c2c2;
      var {
        background-color: #13c2c2;
      }
    }
  }
}
.contentWrap {
  padding: 0 14px 10px;
  margin-top: 10px;
  background-color: #fff;
  .contentTitle {
    .c_f_shrink {
      .c_f_center:nth-of-type(2) {
        margin-left: 10px;
      }
    }
    .titleInput {
      width: 200px;
      padding-left: 0;
      /deep/.van-field__value {
        background-color: #f0f0f0;
        border-radius: 4px;
        padding: 0 6px;
      }
    }
    widows: 100%;
    height: 40px;
    border-bottom: 1px solid #f8f8f8;
  }
  .content {
    .contentItem {
      video {
        width: 100%;
        display: block;
      }
      margin-top: 10px;
      position: relative;
      .c_f_center {
        width: 52px;
        height: 28px;
        border: 1px solid #f0f0f0;
        border-bottom: none;
      }
      .contentTextarea {
        border: 1px solid #f0f0f0;
      }
    }
  }

  .down {
    transform: rotate(90deg);
    color: #13c2c2;
  }
  .up {
    transform: rotate(-90deg);
    color: #13c2c2;
  }

  .contentBtns {
    display: flex;
    flex-direction: row;
    > div {
      color: #595959;
      &:nth-of-type(1) {
        margin-right: 14px;
        span {
          display: inline-block;
          width: 24px;
          height: 24px;
          background: url("../../../assets/img/app/add_text.png") no-repeat;
          background-size: contain;
        }
      }
      &:nth-of-type(2) {
        position: relative;
        .myupload {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          /deep/.van-uploader__upload {
            width: 100%;
            height: 100%;
            margin: 0;
            height: 40px;
          }
        }
        span {
          display: inline-block;
          width: 24px;
          height: 24px;
          background: url("../../../assets/img/app/add_media.png") no-repeat;
          background-size: contain;
        }
      }
      flex: 1;
      height: 40px;
      border: 1px solid #f0f0f0;
      border-radius: 4px;
    }
  }
}
.del {
  display: inline-block;
  width: 15px;
  height: 16px;
  background: url("../../../assets/img/app/setting_del.png") no-repeat;
  background-size: contain;
}
.mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
/deep/.van-circle__text {
  color: #fff;
}
</style>
