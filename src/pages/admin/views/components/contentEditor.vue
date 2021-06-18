<template>
  <div @click="movetoContent">
    <transition-group name="list" tag="div">
      <div class="editbox" v-for="(item, index) in currentContent" :key="item && item.index !== undefined ? item.index : index">
        <div class="titTop">区块标题</div>
        <div class="title">
          <a-input
            class="input"
            :maxLength="10"
            :value="item.title"
            placeholder="请输入标题"
            @change="
              setContentTitle({
                val: $event.target.value,
                cIndex: index,
                category,
              })
            "
          />
          <div
            class="move"
            v-if="
              !isDisable(currentContent.length) ||
              index != 0 ||
              index != currentContent.length - 1
            "
          >
            <a-popconfirm
              v-if="!isDisable(currentContent.length)"
              title="确定删除吗?"
              :disabled="isDisable(currentContent.length)"
              ok-text="是"
              cancel-text="否"
              @confirm="deleteContent({ index, category })"
            >
              <a-icon type="delete" />
            </a-popconfirm>
            <div
              class="icons"
              v-if="index != 0"
              @click="moveContent(index, 'up')"
            >
              <i class="triangle-up"></i>
              <span>上移</span>
            </div>
            <div
              class="icons"
              v-if="index != currentContent.length - 1"
              @click="moveContent(index, 'down')"
            >
              <i class="triangle-down"></i>
              <span>下移</span>
            </div>
          </div>
        </div>
        <div class="titTop">内容描述</div>
        <transition-group name="list" tag="div">
          <div
            class="content"
            v-for="(one, i) in item.body"
            :key="(one && one.index)"
          >
            <div class="content-txt" v-show="one && one.content !== undefined ">
              <div
                class="move"
                v-show="
                  !isDisable(item.body.length) ||
                  i != 0 ||
                  i != item.body.length - 1
                "
              >
                <a-popconfirm
                  title="确定删除吗?"
                  ok-text="是"
                  cancel-text="否"
                  v-if="!isDisable(item.body.length)"
                  :disabled="isDisable(item.body.length)"
                  @confirm="deleteBody({ index, i, category })"
                >
                  <a-icon type="delete" />
                </a-popconfirm>
                <div
                  class="icons"
                  v-if="i != 0"
                  @click="moveBody(index, i, 'up')"
                >
                  <i class="triangle-up"></i>
                  <span>上移</span>
                </div>
                <div
                  class="icons"
                  v-if="i != item.body.length - 1"
                  @click="moveBody(index, i, 'down')"
                >
                  <i class="triangle-down"></i>
                  <span>下移</span>
                </div>
              </div>
              <a-textarea
                placeholder="请输入文字"
                :rows="4"
                @change="
                  setContentBody({
                    val: $event.target.value,
                    cIndex: index,
                    bIndex: i,
                    category,
                  })
                "
                :value="one.content"
              />
            </div>
            <div class="content-img" v-if="one && one.url !== undefined ">
              <div class="img-suggest">
                <span>(建议尺寸750:420像素，图片支持JPG、PNG格式)</span>
                <div
                  class="move"
                  v-if="
                    !isDisable(item.body.length) ||
                    i != 0 ||
                    i != item.body.length - 1
                  "
                >
                  <a-popconfirm
                    title="确定删除吗?"
                    ok-text="是"
                    cancel-text="否"
                    v-if="!isDisable(item.body.length)"
                    :disabled="isDisable(item.body.length)"
                    @confirm="deleteBody({ index, i, category })"
                  >
                    <a-icon type="delete" />
                  </a-popconfirm>
                  <div
                    class="icons"
                    v-if="i != 0"
                    @click="moveBody(index, i, 'up')"
                  >
                    <i class="triangle-up"></i>
                    <span>上移</span>
                  </div>
                  <div
                    class="icons"
                    v-if="i != item.body.length - 1"
                    @click="moveBody(index, i, 'down')"
                  >
                    <i class="triangle-down"></i>
                    <span>下移</span>
                  </div>
                </div>
              </div>
              <div class="img-box">
                <img :src="one.url" />
              </div>
            </div>
          </div>
        </transition-group>
        <div class="box-btns">
          <a-button @click="addBody({ type: 'content', index, category })">
            <img src="../../../../assets/txtbtn.png" class="imgT" />
            新增文字
          </a-button>
          <div class="box-btns-addPic" style="position: relative">
            <upload-imgs @uploaded="uploaded" :cIndex="index" />
          </div>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script>
import * as qiniu from "qiniu-js";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";
import cloneDeep from "lodash/cloneDeep";
import { mapGetters, mapMutations } from "vuex";
import UploadImgs from "./uploadImgs.vue";
import yznUpload from "./yznUpload.vue";
let cropper;
export default {
  props: ["category"],
  created() {},
  data() {
    return {
      currentContent: [],
      //curIndex: "",
      curImg: {
        // url: "https://cdntest.yizhiniao.com/1606117154739_eg_tulip.jpg",
      },
      visible: false,
      config: {
        useCdnDomain: true,
        region: qiniu.region.z0,
      },
      putExtra: {
        fname: "",
        params: {},
        mimeType: [] || null,
      },
      isMoved: false,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    movetoContent() {
      if (!this.isMoved) {
        this.isMoved = true;
        this.$parent.$emit("movePreview", 2);
      }
    },
    // 文件选择返回信息
    infoLive(data, obj) {
      if (Object.prototype.toString.call(obj) == "[object Array]") {
        if (data.IS_ADD) {
          obj = obj || [];
          data.list.map((ceil) => {
            obj.push(ceil);
          });
        } else {
          obj.map((item) => {
            if (item.UUID) {
              data.list.map((ceil) => {
                if (ceil.UUID == item.UUID) {
                  item.per = ceil.per;
                  console.log(item.per);
                  if (item.per == 100) {
                    setTimeout(() => {
                      if (item.key) {
                        delete item.per;
                        delete item.UUID;
                        delete item.error;
                      }
                    }, 500);
                  }
                  item.error = ceil.error ? ceil.error : "";
                }
              });
            }
          });
        }
      }
    },
    init() {
      if (this.category == "content") {
        this.currentContent = cloneDeep(this.getContent);
      } else if (this.category === "distContent") {
        this.currentContent = cloneDeep(this.getDistContent);
      }
    },
    isDisable(l) {
      if (l <= 1) {
        return true;
      } else {
        return false;
      }
    },
    uploaded(payload) {
      const { res, cIndex } = payload;
      let len = this.currentContent[cIndex].body.length;
      this.addBody({
        type: "url",
        index: cIndex,
        category: this.category,
      });
      this.setContentBody({
        val: res.url,
        cIndex: cIndex,
        bIndex: len,
        category: this.category,
      });
    },
    handleOk() {
      const canvas = cropper.getCroppedCanvas();
      const da = canvas.toDataURL("image/jpeg", 0.92);
      this.beforeUpload(da, "bsbs");
    },

    moveContent(index, type) {
      this.moveInContent({ type, index, category: this.category });
    },
    moveBody(index, i, type) {
      this.moveInBody({ type, index, i, category: this.category });
    },

    ...mapMutations("common", [
      "setContentTitle",
      "setContentBody",
      "addBody",
      "moveInContent",
      "moveInBody",
      "deleteContent",
      "deleteBody",
    ]),
  },
  computed: {
    ...mapGetters(["getContent", "getDistContent"]),
  },
  components: {
    UploadImgs,
    yznUpload,
  },
  watch: {
    getContent: {
      handler: function (v, nv) {
        this.init();
      },
      deep: true,
    },
    getDistContent: {
      handler: function (v, nv) {
        this.init();
      },
      deep: true,
    },
  },
};
</script>

<style lang="less" scoped>
.editbox {
  width: 100%;
  background: #ffffff;
  box-shadow: 0px 2px 10px 0px rgba(228, 228, 228, 0.54);
  border-radius: 4px;
  border: 1px solid #f0f0f0;
  padding: 15px 24px;
  &:not(:nth-child(1)) {
    margin-top: 20px;
  }
  .input {
    width: 250px;
    line-height: 32px;
  }
  .title {
    padding-bottom: 15px;
    border-bottom: 1px solid #f0f0f0;
  }
  .move {
    height: 25px;
    background: #f8f8f8;
    border-radius: 2px;
    float: right;
    margin-top: 3px;
    display: flex;
    align-items: center;
    padding: 0 21px 0 17px;
    > div {
      margin-left: 16px;
    }
    .anticon {
      color: #acacac;
      font-size: 14px;
      padding-left: 4px;
      cursor: pointer;
    }
    span {
      color: #595959;
      font-size: 12px;
    }
    .icons {
      display: flex;
      align-items: center;
      cursor: pointer;
    }
  }
  .content-img {
    font-size: 14px;
    color: #bfbfbf;
    .img-suggest {
      // margin-top: 18px;
      line-height: 25px;
      .move {
        margin-top: 0;
      }
    }
    .img-box {
      height: 163px;
      border-radius: 4px 0px 4px 4px;
      border: 1px solid #dbdbdb;
      /deep/ img {
        height: 147px;
        width: 343px;
        margin: 8px 0 0 8px;
        border-radius: 4px;
        object-fit: cover;
      }
    }
  }
  .content-txt {
    margin-top: 8px;
    margin-bottom: 15px;
  }
  .box-btns {
    margin-top: 16px;
    display: flex;
    .ant-btn {
      margin-right: 12px;
      color: #595959;
      font-size: 14px;
      display: flex;
      align-items: center;
      padding: 0 40px;
    }
    .imgT {
      width: 16px;
      height: 18px;
      margin-right: 10px;
    }
    .imgP {
      width: 16px;
      margin-right: 10px;
      height: 16px;
    }
    .box-btns-addPic {
      width: 168px;
      height: 32px;
      border-radius: 4px;
      border: 1px solid #dbdbdb;
      &:hover {
        border: 1px solid #36cfc9;
      }
    }
  }
}
.editbox /deep/ .ant-upload.ant-upload-select-picture-card > .ant-upload {
  padding: 0;
}
.editbox /deep/ .ant-upload.ant-upload-select-picture-card {
  margin: 0;
  border: none;
}
.triangle-down {
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 8px solid #13c2c2;
  // margin-bottom: 2px;
  margin-right: 2px;
}
.triangle-up {
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 8px solid #13c2c2;
  margin-bottom: 2px;
  margin-right: 2px;
}
#image {
  display: block;
  max-width: 100%;
  /deep/ .ant-modal-body {
    padding: 5px;
  }
}
.list-item {
  transition: all 1s;
  //display: inline-block;
  margin-right: 10px;
}
.list-enter-active,
.list-leave-active {
  transition: all 1s;
}
.list-enter,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
.list-move {
  transition: transform 1s;
}
.titTop {
  font-size: 16px;
  margin-top: 8px;
  margin-bottom: 6px;
  line-height: 22px;
  font-weight: 500;
}
</style>