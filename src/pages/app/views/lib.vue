<template>
  <div style="background-color: #f8f8f8; over-flow: auto">
    <!-- https://cdntest.yizhiniao.com/admin_new_16110433967071379.mp3 -->
    <van-pull-refresh
      v-model="refreshing"
      @refresh="onRefresh"
      style="min-height: 100vh"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        loading-text="加载中"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <ul class="popup" v-if="type == 2">
          <li
            class="c_f_between mb10 mt10"
            @click="sel()"
            :class="[!libId ? 'active' : '']"
          >
            <span class="fblod">无</span>
            <var></var>
          </li>
          <li
            v-for="(item, index) in list"
            :key="index"
            @click="sel(item, index, true)"
            :class="[item.libId == libId ? 'active' : '']"
          >
            <span class="fblod">{{ item.fileName }}</span>
            <var></var>
          </li>
        </ul>
        <ul class="bg" v-if="type == 0">
          <li
            v-for="(item, index) in list"
            :key="index"
            @click="sel(item, index)"
            :class="[item.libId == libId ? 'active' : '']"
          >
            <van-image
              fit="cover"
              :src="item.fileUrl"
              width="100%"
              height="100%"
            />
          </li>
        </ul>
        <ul class="bg" v-if="type == 1 || type == 3">
          <li
            v-for="(item, index) in list"
            :key="index"
            @click="sel(item, index)"
            :class="[item.libId == libId ? 'active' : '']"
          >
            <van-image
              fit="cover"
              :src="item.fileUrl"
              width="100%"
              height="100%"
            />
          </li>
        </ul>
      </van-list>
    </van-pull-refresh>

    <van-image-preview
      v-model="previewImg.show"
      :images="previewImg.images"
      :start-position="previewImg.start"
      :loop="false"
      @change="previewEvent('change', $event)"
      @close="previewEvent('close', $event)"
    >
      <template v-slot:index>
        <van-button color="#13c2c2" size="normal" @click="confirmClick()"
          >选择{{
            type == 0 ? "背景" : type == 3 ? "区块" : "顶部图"
          }}</van-button
        >
      </template>
    </van-image-preview>
  </div>
</template>

<script>
export default {
  name: "lib",
  components: {},
  data() {
    return {
      titles: ["选择背景图", "选择顶部图", "选择背景音乐", "选择区块样式"],
      previewImg: {
        show: false,
        images: [],
        start: "",
        data: {},
      },
      start: 0,
      count: 50,
      loading: false,
      finished: false,
      refreshing: false,
      clalk: false,
      list: [],
      libId: "",
      type: "", //0：背景图 1:顶部图 2：音乐 3：区块
      audio: "",
    };
  },
  destroyed: function () {
    if (this.audio) this.audio.pause();
    this.audio = null;
  },
  methods: {
    confirmClick() {
      localStorage.setItem(
        "show_lib_data",
        JSON.stringify(this.previewImg.data)
      );
      this.$router.go(-1);
    },
    sel(d, i, fl) {
      if (fl) {
        this.libId = d.libId;
        this.audio.src = d.fileUrl;
        let playPromise;
        playPromise = this.audio.play();
        //选择音乐
        localStorage.setItem("show_lib_data", JSON.stringify(d));
        return;
      }
      if (!d) {
        if (this.audio) this.audio.pause();
        this.audio.src = "";
        this.libId = "";
        //音乐不选
        localStorage.setItem("show_lib_data", "nomusic");
        return;
      }
      this.previewImg = Object.assign({}, this.previewImg, {
        show: true,
        start: i,
        data: d,
      });
      document.title = i + "/" + this.previewImg.images.length;
    },
    previewEvent(type, index) {
      if (type == "change") {
        document.title = index + 1 + "/" + this.previewImg.images.length;
      } else {
        document.title = this.titles[this.type];
      }
    },
    onLoad() {
      let cloak = false; //防闪屏
      this.loading = true;
      if (this.refreshing) {
        cloak = true;
        this.refreshing = false;
      }
      this.start = cloak ? 0 : this.list.length;
      this.getList(cloak);
    },
    getList(cloak) {
      this.yznReq("get", "api/oa/show/listLib", {
        fileType: this.type,
        status: 1,
        start: this.start,
        count: this.count,
      }).then((res) => {
        if (res.status == 200) {
          this.loading = false;
          this.list = cloak
            ? res.context.items
            : this.list.concat(res.context.items);
          // 数据全部加载完成
          if (this.list.length >= res.context.totalNum) {
            this.finished = true;
          }
          let previewArr = [];
          this.list.map((item) => {
            previewArr.push(item.fileUrl);
          });
          this.previewImg.images = previewArr;
        }
      });
    },
    onRefresh() {
      // 清空列表数据
      this.finished = false;
      this.onLoad();
    },
  },
  mounted() {
    this.audio = new Audio();
    console.log(this.$route.query);
    this.type = this.$route.query.tp;
    this.libId = this.$route.query.id;
    document.title = this.titles[this.type];
  },
};
</script>
<style lang="less" scoped>
/deep/.van-image-preview__index {
  bottom: 30px;
  top: auto;
}
ul.popup {
  max-height: inherit;
}
ul.popup li {
  background-color: #fff;
  height: 50px;
}
.bg {
  padding: 0 9px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  li {
    display: block;
    width: 178px;
    height: 168px;
    padding: 0 5px;
    margin-top: 10px;
    position: relative;
    > div {
      border: 2px solid transparent;
      border-radius: 4px;
      overflow: hidden;
      width: 100%;
      height: 100%;
    }
    &.active {
      &:after {
        content: "";
        display: block;
        position: absolute;
        top: 1px;
        right: 6px;
        background: url("../../../assets/img/app/selected_fff.png") no-repeat
          #ff9537;
        background-size: 24px 18px;
        border-radius: 0 0 0 4px;
        background-position: center;
        width: 38px;
        height: 38px;
      }
      > div {
        border-color: #ff9537;
      }
    }
  }
}
</style>
