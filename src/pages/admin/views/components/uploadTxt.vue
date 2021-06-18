<template>
  <div>
    <a-upload
      name="avatar"
      :show-upload-list="false"
      action="file"
      :before-upload="beforeUpload"
      @change="handleChange"
    >
      <span >本地上传</span>
    </a-upload>
  </div>
</template>

<script>
import * as qiniu from "qiniu-js";
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}
export default {
  // props: ["initImg",'cIndex','bIndex'],
  data() {
    return {
      loading: false,
      // imageUrl: "",
      config: {
        useCdnDomain: true,
        region: qiniu.region.z0,
      },
      putExtra: {
        fname: "",
        params: {},
        mimeType: [] || null,
      },
    };
  },
  mounted() {
    // this.imageUrl = this.initImg;
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
    async beforeUpload(file) {
      const _self = this;
      let qn_token = localStorage.getItem("qiniu");
      let qn_token_time = localStorage.getItem("qiniu-time");
      if (!qn_token || Number(qn_token_time) < new Date().getTime()) {
        qn_token = await this.getQINIUToken();
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function (e) {
        _self.loading = true;
        const urlData = this.result;
        const blobData = _self.base64ToBlob(urlData);
        let name = file.name
        let fileType = name.substr(0, file.name.lastIndexOf("."))
        let new_name = "oa_showshow_" + new Date().getTime() + "_" + fileType;

        const observable = qiniu.upload(
          blobData,
          new_name,
          qn_token,
          _self.putExtra,
          _self.config
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
              _self.$emit('uploaded',res, _self.cIndex, _self.bIndex)
            }
            console.log("succ");
          },
        };
        observable.subscribe(observer);
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
      let res = await this.yznReq("get", "/api/admin/setting/getUploadToken", {})
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
  // watch: {
  //   initImg() {
  //     this.imageUrl = this.initImg
  //   }
  // }
};
</script>