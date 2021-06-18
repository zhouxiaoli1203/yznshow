<template>
  <div>
    <a-upload
      name="avatar"
      class="avatar-uploader"
      :show-upload-list="false"
      :before-upload="beforeUpload"
      @change="handleChange"
      :multiple="multiple"
      :customRequest="() => {}"
      accept='image/gif, image/jpeg, image/png'
    >
      <a class="imgTxt">
        <img src="../../../../assets/imgbtn.png" />
        <span>新增图片</span>
      </a>

      <!-- <a-modal
        v-model="visible"
        title="裁剪图片"
        @ok="handleOk"
        @cancel="cancel"
        okText="确定"
        cancelText="取消"
        :maskClosable="false"
      >
        <div>
          <img id="image" :src="curBlob" ref="imgs" />
        </div>
      </a-modal> -->
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
  props: ["initImg", "type", "cIndex"],
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
      //visible: false,
      curBlob: "",
      fileName: "",
      multiple: true
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

    
    
    async beforeUpload(file,fileList) {
      const _self = this;
      
      let qn_token = localStorage.getItem("qiniu");
      let qn_token_time = localStorage.getItem("qiniu-time");
      if (!qn_token || Number(qn_token_time) < new Date().getTime()) {
        qn_token = await this.getQINIUToken();
      }
      let name = file.name
      let fileName =  name.substring(name.lastIndexOf('.') + 1);
      let ma = Math.floor(Math.random() * (10000));
      this.fileName = "oa_showshow_" + new Date().getTime() + ma + "." + fileName;


      let uploadFileToQiniu = function(base64Data) {
          let fileData = file;
          if (base64Data) {
            fileData = _self.base64ToBlob(base64Data);
          }

          let name = file.name
          let fileType = name.substring(name.lastIndexOf('.') + 1);
          let ma = Math.floor(Math.random() * (10000));
          let new_name = "oa_showshow_" + new Date().getTime() + ma + "." + fileType;

          const observable = qiniu.upload(
            fileData,
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
                _self.$emit('uploaded', {res,cIndex: _self.cIndex} )
              }
              console.log("succ");
            },
          };
          observable.subscribe(observer);
      }


      //如果是图片上传走图片上传的渠道
      //如果图片大小小于2M直接上传否则图片压缩后上传，gif文件不压缩
      var maxSize = 2 * 1024 * 1024; //默认图片文件最大2M
      if (file.type.indexOf('image') == 0 && file.type.indexOf('gif') == -1 && file.size > maxSize) {
          photoCompress(file, {
              'quality': 0.7,
          }, function(base64Codes) {
              uploadFileToQiniu(base64Codes);
          });
      } else {
        //直接文件上传
        uploadFileToQiniu();
      }

      /*
       *三个参数
       *file：一个是文件(类型是图片格式)，
       *w：一个是文件压缩的后宽度，宽度越小，字节越小
       *objDiv：一个是容器或者回调函数
       *photoCompress()
       */

      function photoCompress(file, w, objDiv) {
        var ready = new FileReader();
        /*开始读取指定的Blob对象或File对象中的内容. 当读取操作完成时,readyState属性的值会成为DONE,如果设置了onloadend事件处理程序,则调用之.同时,result属性中将包含一个data: URL格式的字符串以表示所读取文件的内容.*/
        ready.readAsDataURL(file);
        ready.onload = function () {
          var re = this.result;
          canvasDataURL(re, w, objDiv);
        };

        // canvasDataURL(URL.createObjectURL(file), w, objDiv);
      }

      //canvas处理旋转和压缩图片
      function canvasDataURL(path, obj, callback) {
        var img = new Image();
        img.src = path;
        img.onload = function () {
          var that = this;
          // 默认按比例压缩
          var MAX_IMAGE_LEGTH = 1440.0;
          var w = that.width;
          var h = that.height;

          var min = Math.min(w, h);

          if (min > MAX_IMAGE_LEGTH) {
            if (that.width == min) {
              w = MAX_IMAGE_LEGTH;
              h = that.height / (that.width / MAX_IMAGE_LEGTH);
            } else {
              h = MAX_IMAGE_LEGTH;
              w = that.width / (that.height / MAX_IMAGE_LEGTH);
            }
          }

          w = parseInt(w);
          h = parseInt(h);

          // var w = that.width > 1920?1920:that.width,  //如果图片的宽度大于1920px则缩小图片的宽度至1920px，高等比例缩小
          //     h = that.width > 1920?parseInt(1920 / that.width * that.height):that.height,
          //     scale = w / h;
          // w = obj.width || w;
          // h = obj.height || (w / scale);
          var quality = 0.7; // 默认图片质量为0.7
          //生成canvas
          var canvas = document.createElement("canvas");
          var ctx = canvas.getContext("2d");
          // 创建属性节点
          var anw = document.createAttribute("width");
          var anh = document.createAttribute("height");
          anw.nodeValue = w;
          anh.nodeValue = h;
          canvas.setAttributeNode(anw);
          canvas.setAttributeNode(anh);
          ctx.drawImage(img, 0, 0, w, h);
          // 图像质量
          if (obj.quality && obj.quality <= 1 && obj.quality > 0) {
            quality = obj.quality;
          }
          // quality值越小，所绘制出的图像越模糊
          var base64 = canvas.toDataURL("image/jpeg", quality);
          // 回调函数返回base64的值
          callback(base64);
        };
      }
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
a:hover {
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