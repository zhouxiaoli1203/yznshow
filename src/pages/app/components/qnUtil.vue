<template>
  <div class="uploadWrap" :class="[options.hide ? 'hide' : '']">
    <div class="clearfix qnUtil">
      <!-- 九宫格 -->
      <template v-if="options.type == 1">
        <div class="fileItem" v-for="(item, i) in fileList" :key="i">
          <van-image
            class="vimg"
            fit="cover"
            :src="item.imageUrl"
            @click="previewImg(previewList, i)"
          />
          <div class="msk" v-if="item.percent != 100">{{ item.percent }}</div>
          <span class="del" @click="del(i)"></span>
        </div>
      </template>
      <!-- 上传组件 -->
      <van-uploader
        ref="myUpload"
        :after-read="afterRead"
        :max-count="options.count"
        :multiple="options.multiple"
        :accept="options.accept"
      />
      <!-- 裁切图片 -->
      <van-overlay :show="cropperInfo.show" style="z-indx: 1994">
        <div class="container">
          <div class="img-container">
            <img :src="cropperInfo.src" ref="image" />
          </div>
        </div>
        <div class="cut c_f_center">
          <van-button class="c_f_center mr10" @click="cropperInfo.show = false">
            <span>取消</span>
          </van-button>
          <van-button color="#13c2c2" class="c_f_center" @click="sureSava">
            <span>确认裁剪</span>
          </van-button>
        </div>
      </van-overlay>
    </div>
  </div>
</template>

<script>
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";
import { Toast } from "vant";
import { ImagePreview } from "vant";
import * as qiniu from "qiniu-js";
/*
 * fileList 上传源数据
 * previewList 预览数组
 * uploadObserver 上传监听回调
 * imgData 后台所需格式字段
 * options {
 *   type 1、九宫格形式 2、返回数据
 *   multiple 是否多选
 *   accept 上传文件格式
 *   hide 是否隐藏上传组件
 *   count 最大文件数
 *   cropper 是否裁切  基于cropperJs
 * }
 */
export default {
  name: "qnUtil",
  data() {
    return {
      myCropper: null,
      cropperInfo: {
        show: false,
        afterImg: "",
        src: "",
      },
      fileList: [],
      previewList: [],

      globalData: [],

      qiniuToken: "",
      qiniuTokenTime: "",
      uploadObserver: {},
      imgData: [],
      once: false, //初始选择文件
      currentFiles: "", //上次选择的文件用于重新上传
    };
  },
  props: {
    options: {
      type: Object,
      default: () => ({
        type: 1,
        multiple: false,
        accept: "image/*",
        hide: false,
        count: "",
        cropper: false,
      }),
    },
    src: {
      type: String, //单独修改某一项
    },
    reup: {
      type: Object,
    },
  },
  watch: {
    reup: {
      handler(curVal, oldVal) {
        if (curVal) {
          this.reupload(curVal);
        }
      },
      deep: true,
    },
    fileList: {
      handler(curVal, oldVal) {
        if (curVal && this.fileList.length) {
          this.$emit("live-info", {
            push: this.once,
            list: this.fileList,
          });
          this.once = false;
        }
      },
      deep: true,
    },
    imgData(curVal, oldVal) {
      if (curVal) {
        this.$emit("child-event", this.getImgStr(this.imgData));
      }
    },
    // src(curVal, oldVal) {
    //   if (curVal) {
    //     this.fileList = [];
    //     this.previewList = [];
    //     let arr = this.src ? this.src.split(",") : [];
    //     arr.forEach((item) => {
    //       this.fileList.push({
    //         imageUrl: item,
    //         percent: 100,
    //       });
    //       this.previewList.push(item);
    //     });
    //     this.imgData = JSON.parse(JSON.stringify(this.previewList));
    //   } else {
    //     this.fileList = [];
    //     this.previewList = [];
    //     this.imgData = [];
    //   }
    // },
  },
  methods: {
    previewImg(arr, index) {
      ImagePreview({
        images: arr,
        startPosition: index,
      });
    },
    getImgStr(arr) {
      let str = "";
      if (arr) {
        arr.forEach((item, index) => {
          str += item + (index == arr.length - 1 ? "" : ",");
        });
      }
      return str;
    },
    del(index) {
      this.imgData.splice(index, 1);
      this.fileList.splice(index, 1);
      this.previewList.splice(index, 1);
    },
    // 重新传
    reupload(item) {
      let that = this;
      that.fileList.map((ceil) => {
        if (ceil.url == item.url) {
          that.fileList = [
            {
              percent: 0,
              t: ceil.t,
              fileName: ceil.fileName,
              fileType: ceil.fileType,
              url: ceil.url,
              uploadErr: "",
            },
          ];
        }
      });
      if (that.globalData) {
        that.globalData.map((ceil) => {
          if (ceil.fileUrl == item.url) {
            this.qn_upload([ceil], true);
          }
        });
      }
    },
    afterRead(files) {
      let that = this;
      if (this.options.cropper) {
        this.cropperInfo.src = files.content;
        setTimeout(function () {
          if(that.myCropper){
            that.myCropper.destroy();
          }
          that.cropperInit();
          that.cropperInfo.show = true;
        }, 100);
        this.once = false;
        this.$set(this, "fileList", []);
        this.fileList.push({
          key:'',
          url:''
        });
      } else {
        if (Object.prototype.toString.call(files) !== "[object Array]") {
          files = [files];
        }
        let that = this;
        that.currentFiles = files;
        this.$set(this, "fileList", []);
        that.uploadObserver = {
          filesSelected: function (files) {
            files.forEach(function (item) {
              let data = {
                percent: 0,
                t: new Date().getTime(),
                fileName: item.file.name.substr(
                  0,
                  item.file.name.lastIndexOf(".")
                ),
                fileType: item.fileType,
                url: item.fileUrl,
                uploadErr: "",
              };
              that.fileList.push(data);
              that.previewList.push(data.imageUrl);
            });
            that.once = true;
          }, //文件选择结果，返回文件列表
          fail: function (fileUrl, error) {
            that.fileList.forEach(function (item, index) {
              if (item.url == fileUrl) {
                console.log(error);
                // item.uploadErr = error;
                let change = that.fileList[index];
                change.uploadErr = error;
                that.$set(that.fileList, index, change);
              }
            });
          }, //文件上传失败
          success: function (fileUrl, key) {
            that.fileList.forEach(function (item) {
              if (item.url == fileUrl) {
                item.key = key;
              }
            });
          }, //文件上传成功
          progress: function (fileUrl, percent) {
            var found = false;
            // console.log(percent);
            that.fileList.forEach(function (item, index) {
              if (item.url == fileUrl) {
                // console.log(percent);
                item.percent = percent;
                found = true;
              }
            });
            //如果没找到就取消上传
            if (!found) {
              console.log("取消上传");
              return true;
            }
          }, //文件上传进度
        };
        this.qn_upload(files);
      }
    },
    qn_upload(files, fl) {
      this.globalData = [];
      let that = this;
      // console.log(files);
      var audioAndVideoFile = [];
      for (var i = 0; i < files.length; i++) {
        var file = files[i].file;
        var type = file.type;
        var fileSize = file.size ? file.size / 1024 : 0;
        var errorMsg;
        //视频文件大小不能超过500M，其他文件大小不能超过50M
        if (type.indexOf("video") == 0) {
          if (fileSize > 500 * 1024) {
            errorMsg = "上传视频文件不能超过500Mb";
          }
        } else if (fileSize > 50 * 1024) {
          errorMsg = "上传文件不能超过50Mb";
        }
        if (errorMsg) {
          Toast(errorMsg + ',"' + file.name + '"文件大小超出了限制');
          return;
        }
        var fileOject = {
          file: file,
          fileUrl: files[i].fileUrl || URL.createObjectURL(file),
          fileType: this.getFileType(file),
        };

        if (!fileOject.fileType) {
          Toast(file.name + '"文件类型不支持');
          return;
        }

        this.globalData.push(fileOject);

        if (fileOject.fileType == "audio" || fileOject.fileType == "video") {
          audioAndVideoFile.push(fileOject);
        }
      }

      var getDuration = function () {
        //如果没有语音或者视频需要获取时长，那么就开始上传文件
        var isEdge = navigator.userAgent.indexOf("Edge") > -1; //判断是否IE的Edge浏览器
        //Edge浏览器不支持获取时长方法
        if (audioAndVideoFile.length == 0 || isEdge) {
          if (that.uploadObserver.filesSelected && !fl) {
            that.uploadObserver.filesSelected(that.globalData);
          }
          // let options = {};
          for (var i = 0; i < files.length; i++) {
            that.upLoadQIniu_(files[i].file, i, that.options);
          }
          return;
        }

        // 语音视频处理
        var fileOject = audioAndVideoFile.shift();
        try {
          var audioElement = new Audio(fileOject.fileUrl);
          var duration;
          audioElement.addEventListener("loadedmetadata", function (_event) {
            duration = audioElement.duration;
            // console.log("duration=" + duration);
            if (duration > 0) {
              if (duration > 60 * 60) {
                layer.alert(
                  '"' + fileOject.file.name + '"文件时长不能超过1小时',
                  { title: "错误提示", shadeClose: true }
                );
                globalData.$imgInput.value = "";
                hasError = true;
                return;
              }
              fileOject.duration = duration;
            }

            getDuration();
          });
        } catch (e) {
          // console.log("exception" + e.message);
          getDuration();
        }
      };
      getDuration();
    },
    getFileType(file) {
      var fileType = file.type;
      fileType = fileType.toLowerCase();
      if (fileType.indexOf("image") == 0) {
        return "image";
      } else if (fileType.indexOf("audio") == 0) {
        return "audio";
      } else if (fileType.indexOf("video") == 0) {
        return "video";
      } else if (fileType.indexOf("pdf") >= 0) {
        return "pdf";
      } else if (fileType.indexOf("word") >= 0) {
        return "word";
      }
      return "";
    },
    //运用七牛上传文件
    upLoadQIniu_(data, orderNum, options) {
      let that = this;
      var filePath = data.name.split("."),
        fileVal = filePath[0].replace(/\\/g, "/"), //上传文件截取
        fileTypeName = "_picture";
      var key_,
        observable, //七牛上传对象
        subscription, //七牛上传状态方法回调
        putExtra = {
          //七牛上传自定义配置信息
          fname: "",
          params: {},
          mimeType: [] || null,
        },
        config = {
          //七牛上传配置
          useCdnDomain: true,
          region: qiniu.region.z2,
        },
        limitBackCall = true, //限制回调次数
        timerBackCall = true; //限制回调次数

      var fileType = that.getFileType(data);
      if (fileType === "image") {
        fileTypeName = "_picture";
      } else if (fileType === "audio") {
        fileTypeName = "_voice";
      } else {
        fileTypeName = "_" + fileType;
      }

      //如果是图片上传走图片上传的渠道
      //如果图片大小小于2M直接上传否则图片压缩后上传，gif文件不压缩

      var maxSize = 2 * 1024 * 1024; //默认图片文件最大2M
      if (options && options.maxSize) {
        maxSize = options.maxSize;
      }
      console.log(maxSize);
      if (
        data.type.indexOf("image") == 0 &&
        data.type.indexOf("gif") == -1 &&
        data.size > maxSize
      ) {
        photoCompress(
          data,
          {
            quality: 0.7,
          },
          function (base64Codes) {
            var imgSize =
              parseInt(base64Codes.length - (base64Codes.length / 8) * 2) /
              1024; //图片大小单位kb
            //如果压缩后的图片大小还大于2mb则不上传该图片
            if (imgSize > maxSize / 1024) {
              var errorMsg =
                "压缩后图片还是超过" +
                maxSize / 1024 / 1024 +
                "Mb,请手动压缩后再试";
              that.globalData[orderNum].error = errorMsg;
              if (that.uploadObserver.fail) {
                that.uploadObserver.fail(
                  that.globalData[orderNum].fileUrl,
                  errorMsg
                );
              }

              that.checkAllCompleted();
            } else {
              that.upLoadQIniu(base64Codes, orderNum);
            }
          }
        );
        return;
      }

      key_ = key_
        ? key_
        : "oa_showshow_" +
          "_" +
          (new Date().getTime() + orderNum) +
          fileTypeName; //上传文件名

      for (var i = 0; i < that.globalData.length; i++) {
        if (data == that.globalData[i].file) {
          var fileOject = that.globalData[i];
          if (fileOject && fileOject.duration) {
            key_ = key_ + "_" + Math.round(fileOject.duration);
          }
        }
      }

      console.log(data.name + "#key=" + key_ + "#type=" + data.type);
      this.upLoadQIniu2(data, orderNum, key_);

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
    checkAllCompleted() {
      var allFileCompelted = true,
        that = this;
      for (var i = 0; i < that.globalData.length; i++) {
        if (!that.globalData[i].key && !that.globalData[i].error) {
          allFileCompelted = false;
          break;
        }
      }
      if (allFileCompelted) {
        if (this.options.multiple) {
          var fileURLS = [];
          for (var i = 0; i < that.globalData.length; i++) {
            if (that.globalData[i].httpUrl) {
              fileURLS.push({
                url: that.globalData[i].httpUrl,
                key: that.globalData[i].key,
              });
            }
          }
          that.imgData = that.imgData.concat(fileURLS);
        } else {
          that.imgData = that.imgData.concat([
            {
              url: that.globalData[0].httpUrl,
              key: that.globalData[0].key,
            },
          ]);
          //   fn(that.globalData[0].httpUrl, that.globalData[0].key);
        }
        console.log(that.imgData);
        that.fileList.map((item) => {
          that.imgData.map((ceil) => {
            if (that.options.cropper) {
              this.once = true;
              item['key'] = ceil['key'];
              item['url'] = ceil['url'];
            } else {
              if (ceil.key == item.key) {
                item.url = ceil.url;
              }
            }
          });
        });
        console.log(that.fileList);
        // if (globalData.loading) {
        //   layer.close(globalData.loading);
        // }

        // globalData.$imgInput.value = "";

        // var errHtml = "";
        // for (var i = 0; i < that.globalData.length; i++) {
        //   if (that.globalData[i].error) {
        //     errHtml +=
        //       "<li><span>" +
        //       (i + 1) +
        //       "、" +
        //       that.globalData[i].file.name +
        //       "</span><em>【" +
        //       that.globalData[i].error +
        //       "】</em></li>";
        //   }
        // }

        // if (errHtml.length > 0) {
        //   $(".upload_img_err").html(errHtml);
        //   openPopByDiv("错误文件", ".upload_img_err", "560px");
        // }
      }
    },
    upLoadQIniu2(data, orderNum, key_) {
      let that = this;
      //因为超过4M以后文件会分片上传，所以要指定文件类型，不然七牛会根据算法自动个文件类型，那样文件大的word或excel会有问题
      var mimeTypes = [];
      mimeTypes.push(data.type);
      var putExtra = {
        mimeType: mimeTypes,
      };
      this.getQINIUToken(function (token) {
        var observable = qiniu.upload(data, key_, token, putExtra); //上传数据
        var subscription = observable.subscribe({
          //上传状态回调
          next: function (res) {
            //上传中
            if (that.uploadObserver.progress) {
              var isStoped = that.uploadObserver.progress(
                that.globalData[orderNum].fileUrl,
                parseInt(res.total.percent)
              );
              if (isStoped) {
                subscription.unsubscribe();
                that.globalData[orderNum].error = "用户取消";
              }
            } else {
              // $(".loadingHtml").html(parseInt(res.total.percent) + "/100");
            }
            // console.log(res);
          },
          error: function (err) {
            //上传失败
            that.qiniuToken = undefined;
            that.globalData[orderNum].error = "上传失败";

            if (that.uploadObserver.fail) {
              that.uploadObserver.fail(
                that.globalData[orderNum].fileUrl,
                that.globalData[orderNum].error
              );
            }
            that.checkAllCompleted();
          },
          complete: function (res) {
            //上传成功
            that.globalData[orderNum].key = res.key;
            that.globalData[orderNum].httpUrl = res.url;
            if (that.uploadObserver.success) {
              that.uploadObserver.success(
                that.globalData[orderNum].fileUrl,
                res.key
              );
            }
            if (that.options.cropper) {
              that.cropperInfo.show = false;
            }
            that.checkAllCompleted();
          },
        });
      });
    },
    //上传剪裁或者压缩后的图片
    upLoadQIniu(data, orderNum) {
      var buffer = atob(data.split(",")[1])
        .split("")
        .map((char) => char.charCodeAt(0));
      var blob = new Blob([new Uint8Array(buffer)], { type: "image/jpeg" });
      var key =
        "oa_showshow_" +
        localStorage.getItem("shopId") +
        "_" +
        new Date().getTime() +
        "_picture";
      if (!orderNum) {
        orderNum = 0;
      }
      this.upLoadQIniu2(blob, orderNum, key);
    },
    getQINIUToken(fn) {
      if (this.qiniuToken) {
        if (this.qiniuTokenTime) {
          if (
            new Date().getTime() - this.qiniuTokenTime.getTime() <
            3500 * 1000
          ) {
            if (fn) fn(this.qiniuToken);
            return;
          } else {
            this.qiniuToken = undefined;
          }
        }
      }
      this.yznReq("get", "api/oa/qiniu/getUploadToken", {}).then((res) => {
        if (res.status == 200) {
          this.qiniuToken = res.context;
          this.qiniuTokenTime = new Date();
          // console.log("qiniuToken=" + this.qiniuToken);
          // return qiniuToken;
          if (fn) fn(this.qiniuToken);
        }
      });
    },
    cropperInit() {
      this.myCropper = new Cropper(this.$refs.image, {
        viewMode: 1,
        dragMode: "none",
        initialAspectRatio: 1,
        aspectRatio: 1,
        checkCrossOrigin: false,
        // preview: ".before",
        background: false,
        // autoCropArea: 0.6,
        zoomOnWheel: false,
      });
    },
    sureSava() {
      // this.cropperInfo.show = false;
      this.cropperInfo.afterImg = this.myCropper
        .getCroppedCanvas({
          imageSmoothingQuality: "high",
        })
        .toDataURL("image/jpeg");
      this.globalData = [{}];
      this.upLoadQIniu(this.cropperInfo.afterImg);
    },
  },
  mounted() {},
};
</script>

<style  lang="less" scoped>
/deep/.van-overlay {
  z-index: 1994;
}
.container {
  display: flex;
}
.before {
  width: 100px;
  height: 100px;
  overflow: hidden;
  /* 这个属性可以得到想要的效果 */
}
.img-container {
  position: absolute;
  width: 100%;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  height: 400px;
  overflow: hidden;
}
.cut {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
}
.afterCropper {
  flex: 1;
  margin-left: 20px;
  border: 1px solid salmon;
  text-align: center;
}
.afterCropper img {
  width: 150px;
  margin-top: 30px;
}

.uploadWrap {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 1;
  &.hide {
    opacity: 0;
  }
  .qnUtil {
    background-color: aqua;
    width: 100%;
    height: 100%;
  }
}
.fileItem {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  float: left;
  margin: 0 4px 8px;
  position: relative;
  border: 1px solid #e5e5e5;
  box-sizing: border-box;
  overflow: hidden;
}
.msk {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgb(0, 0, 0, 0.6);
  color: #fff;
  font-size: 15px;
  font-weight: bold;
  text-align: center;
  line-height: 80px;
}
.fileItem .vimg {
  width: 100%;
  height: 100%;
}
.fileItem .del {
  position: absolute;
  top: 3px;
  right: 3px;
  width: 18px;
  height: 18px;
  /* background: url(../../../static/img/file_del.png) no-repeat;
  background-size: contain; */
}
</style>
