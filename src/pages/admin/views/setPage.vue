<template>
  <div>
    <div class="all" >
      <a-row :gutter="20" class="topBlock">
        <a-col :span="8">
          <p>顶部图<b>*</b></p>
          <div class="imgChoice">
            <img :src="getTopItem.url || undefined" alt="" />
            <div class="imgBtn">
              <a-button type="link" class="link" @click="openChoice(1)"
                >图库选择</a-button
              >
              <div style="flex: 1" v-if="systemType != 1">
                <upload-img type="txt" @uploaded="uploaded" :ratio="1" />
              </div>
            </div>
          </div>
          <!-- <span class="top-tips"
            >自定义上传图片建议尺寸800*800图片支持png、jpg格式</span
          > -->
        </a-col>
        <a-col :span="8">
          <p>区块样式<b>*</b></p>
          <div class="imgChoice">
            <img :src="getBlockItem.url || undefined" alt="" />
            <div class="imgBtn">
              <a-button type="link" class="link" @click="openChoice(3)"
                >选择区块样式</a-button
              >
            </div>
          </div>
        </a-col>
        <a-col :span="8">
          <p>背景图<b>*</b></p>
          <div class="imgChoice">
            <img :src="getBgItem.url || undefined" alt="" />
            <div class="imgBtn">
              <a-button type="link" class="link" @click="openChoice(0)"
                >选择背景图</a-button
              >
            </div>
          </div>
          <!-- <span class="top-tips"
            >自定义上传图片建议**M以内图片支持png、jpg格式</span
          > -->
        </a-col>
      </a-row>
      <p>背景音乐</p>
      <div class="music">
        <a-select
          class="select"
          size="large"
          @change="choiceMusic($event)"
          :value="currentMusic.id"
        >
          <a-select-option
            v-for="item in list"
            :value="item.libId"
            :key="item.libId"
            >{{ item.fileName }}</a-select-option
          >
        </a-select>
        <div class="video" @click="play">
          <a-icon type="play-circle" class="icon" v-if="!isPlay" />
          <a-icon type="pause-circle" class="icon" v-if="isPlay" />
        </div>
      </div>
      <audio loop :src="currentMusic.url" ref="audioRef"></audio>
      <p>
        机构电话
        <span
          >（设置机构电话后，学员可快速拨打电话进行咨询，不设置则不显示）</span
        >
      </p>
      <a-input size="large" @blur="setPhone" :value="getShopPhone" />
      <p>
        报名必填信息
        <span>（必填项最多5项）</span>
      </p>
      <a-row>
        <a-checkbox-group
          @change="onChangeRequired"
          class="checkbox"
          :value="selectCheck"
        >
          <a-row>
            <a-col :span="5">
              <a-checkbox value="name" disabled checked>学员姓名</a-checkbox>
            </a-col>
            <a-col :span="5">
              <a-checkbox value="phone" disabled checked>联系电话</a-checkbox>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="5">
              <a-checkbox
                value="sex"
                :disabled="checkboxDisable && notSelect('sex')"
                >性别</a-checkbox
              >
            </a-col>
            <a-col :span="5">
              <a-checkbox
                value="age"
                :disabled="checkboxDisable && notSelect('age')"
                >年龄</a-checkbox
              >
            </a-col>
            <a-col :span="5">
              <a-checkbox
                value="birthday"
                :disabled="checkboxDisable && notSelect('birthday')"
                >出生日期</a-checkbox
              >
            </a-col>
            <a-col :span="5">
              <a-checkbox
                value="schoolname"
                :disabled="checkboxDisable && notSelect('schoolname')"
                >在读学校</a-checkbox
              >
            </a-col>
            <a-col :span="4">
              <a-checkbox
                value="grade"
                :disabled="checkboxDisable && notSelect('grade')"
                >年级</a-checkbox
              >
            </a-col>
          </a-row>
        </a-checkbox-group>
      </a-row>
      <div class="line"></div>
      <p>内容编辑</p>
      <content-editor category="content" />
      <a-button class="addEdit" @click="addContent"
        ><a-icon type="plus" />新增内容区块</a-button
      >
    </div>
    <div class="botBtn">
      <a-button
        type="primary"
        ghost
        size="large"
        class="next-btn"
        @click="goPrev"
        >上一步</a-button
      >
      <a-button type="primary" size="large" class="next-btn" @click="goNext"
        >下一步</a-button
      >
    </div>

    <choice-img
      :type="choiceType"
      @onClose="oncloseChoice"
      v-if="showChoiceImg"
      :class="{ showChoice: showChoiceImg }"
    />
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import settingVue from "../../app/views/setting.vue";
import ChoiceImg from "./components/choiceImg.vue";
import ContentEditor from "./components/contentEditor.vue";
import UploadImg from "./components/uploadImg.vue";
import cloneDeep from "lodash/cloneDeep";

export default {
  data() {
    return {
      choiceType: 1,
      showChoiceImg: false,
      list: [],
      imageUrl: "",
      loading: false,
      selectCheck: [],
      currentMusic: {
        id: "",
      },
      isPlay: false,
      systemType: 1,
      // isDisabled: false,
      checkboxDisable: false,
    };
  },
  mounted() {
    let info = this.getInfo;
    this.selectCheck = info.split(",");
    this.getMusic();
    this.currentMusic = this.getMusicItem;
    this.systemType = this.$route.query.systemType;
    // if (this.getActiveType == 3 && this.getActivityStatus == 3) {
    //   this.isDisabled = true;
    // }
  },
  methods: {
    getMusic() {
      let url = "";
      if (this.getSystemType == 1) {
        url = "api/admin/show/listMusicLib";
      } else if (this.getSystemType == 2) {
        url = "api/oa/show/listMusicLib";
      }
      this.yznReq("get", url, {
        fileType: 2,
      }).then((res) => {
        if (res.status == 200) {
          let list = res.context.filter((i) => i.status);
          list.unshift({
            libId: "",
            fileName: "无音乐",
          });
          this.list = list;
        }
      });
    },
    choiceMusic(id) {
      let item = this.list.find((i) => i.libId == id);
      this.setMusicItem({
        id: item.libId,
        url: item.fileUrl,
      });

      this.currentMusic = {
        id: item.libId,
        url: item.fileUrl,
      };

      setTimeout(() => {
        if (this.currentMusic.id) {
          this.isPlay = true;
          this.$refs.audioRef.play();
        }
      }, 800);
    },
    pasue() {
      this.isPlay = false;
      this.$refs.audioRef.play();
    },
    play() {
      if (this.isPlay) {
        this.isPlay = false;
        this.$refs.audioRef.pause();
      } else {
        if (!this.currentMusic.url) {
          return;
        }
        this.isPlay = true;
        this.$refs.audioRef.play();
      }
    },
    goPrev() {
      this.$parent.goNext(0);
    },
    checkContent () {
      let con = cloneDeep(this.getContent)
      for (let i of con) {
        if (!i.title) {
          this.$message.error("请输入区块标题");
          return 1
        } else if (i.body) {
          let b = i.body
          for (let body of b) {
            if (!body.content && !body.url) {
              this.$message.error("请输入区块内容描述");
              return 1
            }
          }
        }
      }
    },
    goNext() {
      if (!this.getTopItem.id) {
        this.$message.error("请选择顶部图");
        return;
      } else if (!this.getBlockItem.id) {
        this.$message.error("请选择区块");
        return;
      } else if (!this.getBgItem.id) {
        this.$message.error("请选择背景图");
        return;
      } else if (this.checkContent()) {
        return;
      }
      this.$parent.goNext(2);
    },
    oncloseChoice() {
      this.showChoiceImg = false;
    },
    openChoice(type) {
      this.choiceType = type;
      this.showChoiceImg = true;
    },
    onChangeRequired(v) {
      if (v.length == 5) {
        this.checkboxDisable = true;
      } else {
        this.checkboxDisable = false;
      }
      if (v.length > 5) {
        return;
      } else {
        this.selectCheck = v;
        let str = v.join(",");
        this.setInfo(str);
      }
    },
    notSelect(name) {
      if (this.selectCheck.includes(name)) {
        return false;
      } else {
        return true;
      }
    },
    uploaded(re) {
      const { res } = re;
      console.log("res", res);
      this.yznReq("post", "api/oa/show/addTopUrl", {
        fileUrl: res.url,
      }).then((resAdd) => {
        this.setTopItem({
          id: resAdd.context.libId,
          url: resAdd.context.fileUrl,
          type: 1,
        });
        this.setShareImageUrl(resAdd.context.fileUrl);
      });
    },
    setPhone(e) {
      let n = e.target.value;
      let reg1 = /^1\d{10}$/;
      let reg2 = /^([0-9]{3,4}-)?[0-9]{6,9}$/;
      if (!n) {
        this.setShopPhone();
      } else if (reg1.test(n) || reg2.test(n)) {
        this.setShopPhone(e.target.value);
      } else {
        this.$message.error("请输入正确电话号码");
      }
    },
    ...mapMutations("common", [
      "setMusicItem",
      "setShopPhone",
      "setInfo",
      "addContent",
      "setTopItem",
      "setShareImageUrl",
    ]),
  },
  components: {
    ChoiceImg,
    ContentEditor,
    UploadImg,
  },
  computed: {
    ...mapGetters([
      "getShopPhone",
      "getInfo",
      "getTopItem",
      "getBlockItem",
      "getContent",
      "getBgItem",
      "getMusicItem",
      "getSystemType",
      "getActiveType",
      "getActivityStatus",
    ]),
  },
};
</script>

<style lang="less" scoped>
.topBlock {
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 22px;
  margin-bottom: 14px;
}
// .disabled {
//   pointer-events: none;
//   cursor: default;
//   opacity: 0.6;
// }
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
.all {
  margin: 6px 100px 80px;
  p {
    margin-bottom: 6px;
    margin-top: 16px;
    color: #262626;
    font-size: 16px;
    font-weight: 500;
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
  .imgChoice {
    height: 194px;
    border-radius: 4px;
    position: relative;
    background-color: #f8f8f8;
    img {
      width: 100%;
      height: 100%;
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
      .link {
        flex: 1;
        padding: 0;
      }
    }
  }
  .top-tips {
    color: #bfbfbf;

    line-height: 20px;
    font-size: 12px;
    text-align: center;
    display: block;
    margin-top: 4px;
  }
  .music {
    display: flex;
    justify-content: space-between;
    .ant-select {
      width: calc(100% - 91px);
    }
    .video {
      border: 1px solid #dbdbdb;
      border-radius: 5px;
      width: 75px;
      height: 40px;
      margin-left: 16px;
      display: flex;
      justify-content: center;
      align-items: center;
      .icon {
        color: #1ed1d1;
        text-align: center;
        font-size: 22px;
        cursor: pointer;
      }
    }
  }
  .checkbox {
    width: 100%;
  }
  .ant-checkbox-wrapper {
    font-size: 14px;
  }
}
.line {
  width: 100%;
  height: 0;
  margin-top: 18px;
  border-bottom: 1px solid #f0f0f0;
}
.iconDown {
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 10px solid #13c2c2;
  margin-right: 3px;
}
.iconUp {
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-bottom: 10px solid #13c2c2;
  margin-right: 3px;
}
.addEdit {
  border: 1px solid #13c2c2;
  margin-top: 16px;
  .anticon {
    color: #13c2c2;
  }
}
textarea.ant-input {
  height: 200px;
}
.imgBtn /deep/ .ant-upload {
  width: 100%;
  display: block;
  flex: 1;
  text-align: center;
}
</style>