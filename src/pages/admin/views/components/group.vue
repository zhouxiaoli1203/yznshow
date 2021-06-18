<template>
  <div>
    <group-base v-slot="slotProps" ref="groupBase">
      <div>
        <a-row>
          <p>课程设置</p>
          <div
            class="course"
            v-for="(item, index) in getGroupItem(
              'courseInfo',
              slotProps.groupPackageIndex
            )"
            :key="index"
          >
            <set-course
              ref="setCourse"
              :courseIndex="index"
              :index="slotProps.groupPackageIndex"
              :isNew="getIsNew(slotProps.groupPackageIndex, index)"
            />
          </div>
        </a-row>
        <div class="add-course">
          <a-button
            icon="plus"
            type="primary"
            ghost
            :disabled='(getActivityStatus == 2 || getActivityStatus == 3) && (getMode != 1) '
            @click="addCourse(slotProps.groupPackageIndex)"
            >新增课程</a-button
          >
          <span class="txt">共{{getGroupItem("courseInfo",slotProps.groupPackageIndex).length}}个课程 | 总价{{getTotal( slotProps.groupPackageIndex)}}元</span>
        </div>
      </div>
    </group-base>
  </div>
</template>

<script>
import groupBase from "./groupBase";
import SetCourse from "./base/setCourse.vue";
import { mapActions, mapGetters, mapMutations } from "vuex";
export default {
  created() {
    this.getNews();
  },
  data() {
    return {};
  },
  methods: {
    getNews() {
      let copy = JSON.parse(JSON.stringify(this.getGroup));
      for (let i of copy) {
        for (let item in i) {
          if (Array.isArray(i[item])) {
            for (let one of i[item]) {
              for (let j in one) {
                one[j] = true;
              }
            }
          } else {
            i[item] = true;
          }
        }
      }
      this.isNew = copy;
    },
    getIsNew(groupIndex, courseIndex) {
      if (this.isNew && this.isNew.length) {
        let p = this.isNew[groupIndex];
        if (p && p.courseInfo && p.courseInfo.length) {
          return p.courseInfo[courseIndex];
        }
      }
    },
    addCourse(index) {
      this.addCourseByIndex(index);
    },
    validate() {
      let checkStatus = true;
      let refs = this.$refs.setCourse;
      if (refs && refs.length) {
        for (let r of refs) {
          if (!r.validate()) {
            checkStatus = false;
          }
        }
      }

      let c = this.$refs.groupBase.validate();
      if (!c) {
        checkStatus = false;
      }
      return checkStatus;
    },
    ...mapActions("group", ["addCourseByIndex", "addRuleByIndex"]),
  },
  computed: {
    ...mapGetters(["getGroup", "getGroupItem", "getActivityStatus", "getMode"]),
    getTotal () {
      return (index) => {
        let t = 0
        let c = this.getGroupItem("courseInfo", index)
        for (let cour of c) {
          t+= cour.coursePrice * 1
        }
        return t.toFixed(2)
      }
    }
  },
  watch: {
    getGroup() {
      this.getNews();
    },
  },
  components: {
    groupBase,
    SetCourse,
  },
};
</script>

<style lang="less" scoped>
.course-package {
  .context {
    margin: 0 20px 16px;
    p {
      margin-bottom: 6px;
      margin-top: 16px;
      color: #262626;
      font-size: 16px;
      font-weight: 500;
      span {
        font-weight: normal;
        font-size: 12px;
        color: #595959;
      }
    }
    .course {
      &:not(:last-child) {
        margin-bottom: 20px;
      }
      .course-item {
        padding: 0 20px;
      }
      background: #f9f9f9;
      // padding-bottom: 17px;
      .title {
        height: 32px;
        font-size: 14px;
        font-weight: 500;
        color: #595959;
        line-height: 32px;
        border-bottom: 1px solid #ededed;
        background: #f9f9f9;
        margin-bottom: 24px;
      }

      .courseTitle {
        font-size: 16px;
        line-height: 22px;
        margin-right: 24px;
      }
    }

    .courseTitleRow {
      font-size: 16px;
      margin-bottom: 3px;
      display: block;
      b {
        font-weight: normal;
        color: #f84f43;
      }
    }
  }
}
.add-course {
  padding-bottom: 16px;
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #f0f0f0;
  .txt {
    font-size: 13px;
    color: #595959;
    text-align: right;
  }
}
.tips {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: inline-block;
  background: #13c2c2;

  margin-left: 4px;

  color: #fff;
  line-height: 16px;
  text-align: center;
  text-decoration: none;
}
.row-top {
  margin-top: 16px;
  display: flex;
  align-items: center;
}
.col-title {
  margin-right: 28px;
  line-height: 22px;
  display: inline-block;
  //margin-top: 18px;
}
</style>