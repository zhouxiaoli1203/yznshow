<template>
  <div>
    <div class="main" >
      <p>
        开启分销
        <a-tooltip>
          <template slot="title">通过设置奖励说明，吸引老学员转发邀请新学员参与活动</template>
          <a-icon type="question-circle" theme="filled" class="icon" />
        </a-tooltip>
        <a-switch
          :disabled='isDisable()'
          class="switch"
          @change="setDistSwitch(Number($event))"
          :checked="Boolean(getDisSwitch)"
        />
      </p>
      <h4>
        开启分销后，系统会记录推荐人邀请了多少个新学员参与活动以及多少个被推荐学员最终完成报课。
      </h4>
      <content-editor category="distContent" v-if="getDisSwitch" />
      <a-button class="addEdit" @click="addDistContent" v-if="getDisSwitch"
        ><a-icon type="plus" />新增区块</a-button
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
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import ContentEditor from "./components/contentEditor.vue";
import cloneDeep from "lodash/cloneDeep";
export default {
  data() {
    return {
      //isDisabled: false,
    };
  },
  mounted() {
    // if (this.getActiveType == 3 && this.getActivityStatus == 3) {
    //   this.isDisabled = true;
    // }
  },
  methods: {
    goNext() {
      if (this.checkContent()) {
        return;
      }
      this.$parent.goNext(3);
    },
    goPrev() {
      this.$parent.goNext(1);
    },
    checkContent () {
      if (!this.getDisSwitch) {
        return false
      }
      let con = cloneDeep(this.getDistContent)
      for (let i of con) {
        if (!i.title) {
          this.$message.error("请输入区块标题");
          return 1
        } else if (i.body) {
          let b = i.body
          for (let body of b) {
            if (!body.content) {
              this.$message.error("请输入区块内容描述");
              return 1
            }
          }
        }
      }
    },
    isDisable() {
      if (this.getMode == 1) {
        return false;
      }
      if (this.getActivityStatus == 1) {
        return true;
      } else if (this.getActivityStatus == 2 || this.getActivityStatus == 3) {
        return true;
      } else if (this.getActivityStatus == 0) {
        return false;
      }
    },
    ...mapMutations("common", ["addDistContent", "setDistSwitch"]),
  },
  computed: {
    ...mapGetters(["getDisSwitch", "getActiveType", "getActivityStatus", "getDistContent", "getMode"]),
  },
  components: {
    ContentEditor,
  },
};
</script>

<style lang="less" scoped>
.detail-bg {
  max-height: calc(100vh - 200px);
  overflow: scroll;
}
.disabled {
  pointer-events: none;
  cursor: default;
  opacity: 0.6;
}
p {
  color: #262626;
  font-size: 16px;
  line-height: 27px;
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  .icon {
    font-size: 14px;
    color: #d8d8d8;
    margin: 0 14px 0 6px;
  }
}
h4 {
  font-size: 14px;
  font-weight: 400;
  color: #bfbfbf;
  line-height: 20px;
}
.main {
  margin: 16px 100px 68px;
}
.addEdit {
  border: 1px solid #13c2c2;
  margin-top: 16px;
  .anticon {
    color: #13c2c2;
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
</style>