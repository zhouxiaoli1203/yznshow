<template>
  <div>
    <a-upload
      name="avatar"
      class="avatar-uploader"
      :show-upload-list="false"
      :before-upload="beforeUpload"
      @change="handleChange"
      :customRequest="()=>{}"
      accept='image/gif, image/jpeg, image/png'
    >
      <a v-if="type == 'img'" class="imgTxt">
        <img src="../../../../assets/imgbtn.png" />
        <span>新增图片</span>
      </a>

      <a v-else-if="type == 'txt'" class="txt">本地上传</a>
      <a-modal
        v-model="visible"
        title="裁剪图片"
        @ok="handleOk"
        @cancel="cancel"
        okText="确定"
        cancelText="取消"
        :maskClosable="false"
      >
        <div>
          <img id="image" :src="curBlob" ref="imgs" style="width:100%" />
        </div>
      </a-modal>
    </a-upload>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import * as qiniu from "qiniu-js";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";
// let cropper;
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}
export default {
  props: ["initImg", "cIndex", "bIndex", "type", "ratio"],
  mounted() {
    this.imageUrl = this.initImg;
  },
  data() {
    return {
      loading: false,
      imageUrl: "",
      config: {
        useCdnDomain: true,
        region: qiniu.region.z0,
      },
      putExtra: {
        fname: "",
        params: {},
        mimeType: [] || null,
      },
      visible: false,
      curBlob: "",
      fileName: "",
    };
  },
  methods: {
    handleChange(info) {
      if (info.file.status === "uploading") {
        this.loading = true;
        return;
      }
      if (info.file.status === "done") {
      }
    },
    cancel() {
      this.visible = false;
      this.curBlob = "";
      this.fileName = "";
      this.cropper.destroy();
    },
    async handleOk() {
      const _self = this;
      let qn_token = localStorage.getItem("qiniu");
      let qn_token_time = localStorage.getItem("qiniu-time");
      if (!qn_token || Number(qn_token_time) < new Date().getTime()) {
        qn_token = await this.getQINIUToken();
      }

      const canvas = this.cropper.getCroppedCanvas();
      const da = canvas.toDataURL("image/jpeg", 0.92);
      const blobData = this.base64ToBlob(da);

      const observable = qiniu.upload(
        blobData,
        this.fileName,
        qn_token,
        this.putExtra,
        this.config
      );
      const observer = {
        next(res) {
          console.log(res);
        },
        error(err) {
          localStorage.removeItem("qiniu");
          console.log(err);
        },
        complete(res) {
          if (res) {
            _self.cropper.destroy();
            _self.visible = false;
            _self.curBlob = "";
            _self.fileName = "";
            _self.$emit("uploaded", {res, cIndex: _self.cIndex, bIndex: _self.bIndex});
          }
        },
      };
      observable.subscribe(observer);
    },
    async beforeUpload(file) {
      const _self = this;
      let name = file.name
      let fileType = name.substr(0, file.name.lastIndexOf("."))
      this.fileName = "oa_showshow_" + new Date().getTime() + "_" + fileType;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function (e) {
        const urlData = this.result;
        _self.curBlob = urlData;
        _self.visible = true;
        setTimeout(() => {
          _self.cropper = new Cropper(_self.$refs.imgs, {
            viewMode: 1,
            dragMode:'move',
            aspectRatio: _self.ratio,
            crop(event) {},
          });
        }, 300);
      };
    },
    base64ToBlob(dataurl) {
      var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    },
    async getQINIUToken() {
      let system = this.getSystemType
      let url = '/api/admin/setting/getUploadToken'
      if (system == 2) {
        url = '/api/oa/qiniu/getUploadToken'
      }
      let res = await this.yznReq(
        "get",
        url,
        {}
      );
      let token_res;
      if (res.status == 200) {
        token_res = res.context;
      }

      let qiniuToken, qiniuTokenTime;
      if (token_res) {
        qiniuToken = token_res;
        qiniuTokenTime = new Date();
        let expired = qiniuTokenTime.getTime() + 3500 * 1000;
        localStorage.setItem("qiniu-time", expired);
        localStorage.setItem("qiniu", qiniuToken);
        return qiniuToken;
      }
    },
  },
  watch: {
    initImg() {
      this.imageUrl = this.initImg;
    },
  },
   computed: {
    ...mapGetters(["getSystemType"]),
  },
};
</script>
<style lang="less" scope>
.txt {
  color: #fff;
  display: inline-block;
  width: 100%;
}
a:hover{
  color: #36cfc9;
}
.avatar-uploader {
  width: 100%;
  flex: 1;
}
.ant-modal-body {
  padding: 5px;
}
.cropper-bg {
  margin: auto;
}
// .ant-upload.ant-upload-select {
//   display: block;
// }
// .ant-upload {
//   width: 100%;
//   display: block;
//   text-align: center;
// }
.imgTxt {
  font-size: 14px;
  color: #595959;
  text-align: center;
  display: inline-block;
  width: 168px;
  height: 32px;
  line-height: 32px;
  a {
    color: #595959;
  }
  &:hover {
    color: #595959;
  }
  img {
    width: 18px;
    height: 18px;
    margin-right: 10px;
  }
}
</style>