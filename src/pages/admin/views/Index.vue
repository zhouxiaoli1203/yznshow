<template>
  <div class="bg">
    <div class="nav">
      
      <div>
        <div class="icon"></div>
        <!-- <span class="name">易知独秀</span> -->
      </div>
    </div>
    <div class="main">
      <div class="preview" ref="preview">
        <div style="width: 100%; position: absolute; overflow: scroll">
          <div class="in">
            <preview />
          </div>
        </div>
      </div>
      <div class="design" ref="des">
        <div class="design-top">
          <div class="step">
            <a-steps
              v-model="current"
              size="small"
              labelPlacement="vertical"
              class="s"
            >
              <a-step title="活动设置" disabled>
                <span slot="icon" class="ing" v-if="current == 0">ing</span>
              </a-step>
              <a-step title="页面设置" disabled>
                <span slot="icon" class="ing" v-if="current == 1">ing</span>
              </a-step>
              <a-step title="分销设置" disabled>
                <span slot="icon" class="ing" v-if="current == 2">ing</span>
              </a-step>
              <a-step title="其他设置" disabled>
                <span slot="icon" class="ing" v-if="current == 3">ing</span>
              </a-step>
            </a-steps>
          </div>
        </div>
        <!-- <yznUpload
          v-if="false"
          :options="{
            type: 1,
            multiple: true,
            accept: '*',
            hide: false,
            cropper: false,
            count: 5,
          }"
        /> -->
        <set-active v-if="current == 0" :goNext="goNext" />
        <set-page
          v-if="current == 1"
          :goNext="goNext"
        />
        <set-sell v-if="current == 2" />
        <set-other v-if="current == 3" />
      </div>
    </div>
  </div>
</template>

<script>
// import yznUpload from "./components/yznUpload.vue";
// import moment from "moment";
import setPage from "./setPage.vue";
import preview from "@/components/Preview.vue";
import setActive from "./setActive.vue";
import setSell from "./setSell.vue";
import setOther from "./setOther.vue";
import { mapActions, mapMutations } from "vuex";
export default {
  components: {
    setActive,
    preview,
    setPage,
    setSell,
    setOther,
    setOther,
    // yznUpload,
  },
  name: "Index",
  data() {
    return {
      current: 0,
      left: 0,
    };
  },
  created() {
    let token = this.$route.query.token;
    localStorage.setItem("show_token", token);
    let systemType = this.$route.query.systemType;
    let id = this.$route.query.id;
    let mode = this.$route.query.mode;

    this.setMode(mode);
    this.setSystemType(systemType);
    this.setActivityId(id);

    if (id) {
      this.getPreviewTemp({ id, systemType, mode });
    }
  },
  mounted() {
    this.resizeEvent();
    window.addEventListener("resize", this.resizeEvent, false);
  },
  methods: {
    movePreview(type) {
      if (type == 1) {
        // 滚动右侧到顶部
        this.$nextTick(() => {
          let errForm = document.getElementsByClassName("form-err");
          if (errForm && errForm[0]) {
            let err = errForm[0].getBoundingClientRect();
            let top = err.top;
            let oldTop = this.$refs.des.scrollTop;
            let targetTop = oldTop + top - 100;
            let that = this
            if (oldTop >= targetTop) {
              const timeTop = setInterval(() => {
                oldTop = oldTop - 50
                that.$refs.des.scrollTop  = oldTop;
                if (oldTop  <= targetTop) {
                  clearInterval(timeTop);
                }
              }, 10);
            } else {
              const timeTop = setInterval(() => {
                oldTop = oldTop + 50
                that.$refs.des.scrollTop = oldTop;
                if (oldTop > targetTop) {
                  clearInterval(timeTop);
                }
              }, 10);
            }
          }
        });
      } else if (type == 2) {
      }
    },
    resizeEvent() {
      let w = this.$refs.preview.clientWidth;
      this.left = (w - 375) / 2 + "px";
    },
    goNext(v) {
      this.current = v;
    },
    ...mapMutations("common", [
      "setSystemType",
      "setActivityId",
      "setMode",
      "setEndTime",
      "setStartTime",
    ]),
    ...mapActions("common", ["getPreviewTemp"]),
  },
  computed: {},
  destroyed() {
    window.removeEventListener("resize");
  },
};
</script>

<style lang="less" scoped>
.bg {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.nav {
  width: 100%;
  height: 40px;
  background: #fff;
  padding: 0 98px 0 65px;
  border-bottom: 1px solid #f0f0f0;
  // display: flex;
  // justify-content: space-between;
  position: fixed;
  z-index: 99;
  top: 0;
  .aicon {
    font-size: 22px;
  }
  .icon {
    width: 106px;
    height: 30px;
    margin-top: 5px;
    background: url("~@/assets/icon.png") center center/100% 100% no-repeat;
  }
  // .backIcon {
  //   font-size: 16px;
  //   color: #595959;
  // }
  > div {
    display: flex;
    align-items: center;
  }
  .name {
    font-size: 18px;
    color: #1f1f1f;
  }
}
.main {
  display: flex;
  flex: 1;
  margin-top: 40px;
  background: #fff;
  .preview {
    flex: 1;
    padding-top: 24px;
    position: relative;
    background: #f8f8f8;
    .in {
      width: 375px;
      //margin: 20px auto 20px;
      // box-shadow: 0px 2px 10px #ddd;
      background: #fff;
      //min-height: 100px;

      max-height: calc(100vh - 90px);
      // overflow-y: scroll;
      //left: 50%;
      margin: auto;
      // position: fixed;
    }
  }
  .design {
    max-height: calc(100vh - 60px);
    overflow-y: scroll;
    width: 823px;
    position: relative;
    box-shadow: 0px 10px 10px #ddd;
    background: #fff;
  }
}
.design-top {
  border-bottom: 1px solid #f1f1f1;
  background: #f6ffff;
}
.step {
  margin: 0 110px;
  height: 94px;
  background: #f6ffff;

  .s {
    padding-top: 19px;
  }
}
::-webkit-scrollbar {
  width: 2px;
}
.ing {
  width: 24px;
  height: 24px;
  display: block;
  font-size: 10px;
  color: #fff;
  line-height: 24px;
  text-align: center;
  border-radius: 50%;
  background: #13c2c2;
}
.design
  /deep/
  .ant-steps-item-wait
  > .ant-steps-item-container
  > .ant-steps-item-content
  > .ant-steps-item-title {
  color: #595959;
  font-size: 14px;
}
.design
  /deep/
  .ant-steps-item-process
  > .ant-steps-item-container
  > .ant-steps-item-content
  > .ant-steps-item-title {
  color: #13c2c2;
  font-size: 18px;
  font-weight: 600;
}
</style>
