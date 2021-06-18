<template>
  <div>
    <div v-for="(item, index) in content" :key="index" class="contentWrap">
      <div class="contentTitleWrap">
        <div class="contentTitle c_f_between">
          <span class="titleItem">区块标题</span>
          <div class="c_f_shrink c_f_center" v-if="!isedit">
            <span
              class="del mr15"
              @click="operate('del', content, index, true)"
            ></span>
            <div
              class="c_f_center"
              v-if="index > 0"
              @click="updown(content, false, index)"
            >
              <van-icon class="up mr5" name="play" />
              <span>上移</span>
            </div>
            <div
              class="c_f_center"
              v-if="index != content.length - 1"
              @click="updown(content, true, index)"
            >
              <van-icon class="down mr5" name="play" />
              <span>下移</span>
            </div>
          </div>
        </div>
        <van-field
          v-model="item.title"
          placeholder="标题"
          maxlength="10"
          :readonly="isedit"
          :rules="[{ required: true, message: '请填写标题' }]"
          class="titleInput"
        />
      </div>

      <div v-for="(ceil, index_) in item.body" :key="index_" class="content">
        <!-- 图片视频 -->
        <div class="contentItem" v-if="ceil.url !== undefined">
          <div class="clearfix" v-if="!isedit">
            <span class="titleItem" v-if="index_ == 0">内容描述</span>
            <div
              class="c_f_center pr"
              v-if="index_ != item.body.length - 1"
              @click="updown(item.body, true, index_)"
            >
              <van-icon class="down mr5" name="play" />
              <span>下移</span>
            </div>
            <div
              class="c_f_center pr"
              v-if="index_ > 0"
              @click="updown(item.body, false, index_)"
            >
              <van-icon class="up mr5" name="play" />
              <span>上移</span>
            </div>
            <div class="c_f_center pr">
              <span
                class="del"
                @click="operate('del', item.body, index_, true)"
              ></span>
            </div>
          </div>
          <!-- 图片 -->
          <van-image fit="cover" :src="ceil.url" width="100%">
            <van-overlay
              :show="ceil.percent < 100"
              class-name="mask"
              :lock-scroll="false"
              @click="reUpload(ceil)"
            >
              <van-circle
                class="a_ct"
                v-model="ceil.percent"
                :color="ceil.uploadErr ? '#fa575d' : '#13c2c2'"
                :text="ceil.uploadErr ? '上传失败' : ceil.percent + '%'"
              />
            </van-overlay>
          </van-image>
          <!-- 视频 -->
          <div
            v-if="ceil.fileType == 'video'"
            style="width: 100%; min-height: 200px"
          >
            <video :src="ceil.url" controls></video>
            <van-overlay
              :show="ceil.percent != 100"
              class-name="mask"
              :lock-scroll="false"
              @click="reUpload(ceil)"
            >
              <van-circle
                class="a_ct"
                v-model="ceil.percent"
                :color="ceil.uploadErr ? '#fa575d' : '#13c2c2'"
                :text="ceil.uploadErr ? '点击重传' : ceil.percent + '%'"
              />
            </van-overlay>
          </div>
        </div>

        <!-- 文字描述 -->
        <div class="contentItem" v-if="ceil.content !== undefined">
          <div class="clearfix" v-if="!isedit">
            <span class="titleItem" v-if="index_ == 0">内容描述</span>
            <div
              class="c_f_center pr"
              v-if="index_ != item.body.length - 1"
              @click="updown(item.body, true, index_)"
            >
              <van-icon class="down mr5" name="play" />
              <span>下移</span>
            </div>
            <div
              class="c_f_center pr"
              v-if="index_ > 0"
              @click="updown(item.body, false, index_)"
            >
              <van-icon class="up mr5" name="play" />
              <span>上移</span>
            </div>
            <div class="c_f_center pr">
              <span
                class="del"
                @click="operate('del', item.body, index_, true)"
              ></span>
            </div>
          </div>
          <van-field
            class="contentTextarea"
            v-model="ceil.content"
            placeholder="请输入文字内容"
            type="textarea"
            :readonly="isedit"
            autosize
            rows="2"
            :rules="[{ required: true, message: '请输入文字内容' }]"
          />
        </div>
      </div>

      <div class="contentBtns mt10" v-if="!isedit">
        <div class="c_f_center f15" @click="item.body.push({ content: '' })">
          <span class="mr6"></span>新增文字
        </div>
        <div class="f15">
          <qn-util
            :options="{
              type: 2,
              accept: 'image/*',
              multiple: true,
              hide: true,
            }"
            :reup="reup"
            @live-info="liveInfo($event, item.body)"
          ></qn-util>
          <div class="c_f_center" style="height: 100%">
            <span class="mr6"></span>新增图片
          </div>
        </div>
      </div>
    </div>
    <div class="pl14 pr14" v-if="!isedit">
      <div
        class="common_btn mt10"
        @click="content.push({ title: '', body: [{ content: '' }] })"
      >
        <span class="add mr8"></span>新增区块
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
import { Dialog } from "vant";
import qnUtil from "../components/qnUtil";
export default {
  name: "addContent",
  components: { qnUtil },
  data() {
    return {
      reup: {},
    };
  },
  props: {
    content: {
      type: Array,
    },
    isedit: {
      type: Boolean,
    },
  },
  watch: {
    content: {
      handler(newV, oldV) {
        if (newV) {
          this.$emit("contentChange", this.content);
        }
      },
      deep: true,
    },
  },
  methods: {
    liveInfo(data, obj) {
      // 多选
      if (Object.prototype.toString.call(obj) == "[object Array]") {
        if (data.push) {
          obj = obj || [];
          data.list.map((ceil) => {
            obj.push(ceil);
          });
        } else {
          obj.map((item) => {
            if (item.t) {
              data.list.map((ceil) => {
                if (ceil.t == item.t) {
                  item.percent = ceil.percent;
                  console.log(item.percent);
                  if (item.percent == 100) {
                    setTimeout(() => {
                      if (item.url.indexOf("yizhiniao") != -1) {
                        delete item.percent;
                        delete item.t;
                        delete item.uploadErr;
                      }
                    }, 500);
                  }
                  item.uploadErr = ceil.uploadErr ? ceil.uploadErr : "";
                }
              });
            }
          });
        }
      }
      this.$forceUpdate();
    },
    updown(arr, type, index) {
      let tem = arr[index],
        index_ = type ? index + 1 : index - 1;
      arr[index] = arr[index_];
      arr[index_] = tem;
      this.$forceUpdate();
    },
    operate(type, data, val, val_) {
      switch (type) {
        case "del":
          if (data) {
            if (val_ && data.length == 1) {
              return Toast("最少存在一项");
            }
            Dialog.confirm({
              title: "提示",
              message: "确认删除？",
            })
              .then(() => {
                data.splice(val, 1);
              })
              .catch(() => {});
          }
          break;
      }
    },
  },
};
</script>

<style  lang="less" scoped>
.contentWrap {
  padding: 0 14px 10px;
  margin-top: 10px;
  background-color: #fff;
  .contentTitleWrap {
    border-bottom: 1px solid #f8f8f8;
    .titleInput {
      width: 200px;
      padding-left: 0;
      padding-top: 0px;
      /deep/.van-field__value {
        background-color: #f0f0f0;
        border-radius: 4px;
        padding: 0 6px;
      }
    }
    .contentTitle {
      .titleItem {
        padding: 0;
        font-size: 16px;
      }
      .c_f_shrink {
        .c_f_center:nth-of-type(2) {
          margin-left: 10px;
        }
      }
      widows: 100%;
      height: 40px;
      overflow: hidden;
    }
  }

  .content {
    .contentItem {
      .titleItem {
        padding: 0;
        font-size: 16px;
      }
      .van-image {
        border: 1px solid #f0f0f0;
      }
      video {
        width: 100%;
        display: block;
      }
      margin-top: 10px;
      position: relative;
      .c_f_center {
        width: 56px;
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
    font-size: 14px;
    transform: rotate(90deg);
    color: #13c2c2;
  }
  .up {
    font-size: 14px;
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
