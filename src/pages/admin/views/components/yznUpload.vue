<template>
  <div class="uploadWrap" :class="[options.type == 2 ? 'hide' : '']">
    <!-- 宫格模式：在上传组件中显示上传信息 -->
    <template v-if="options.type == 1">
      <div v-for="(file, index) in WATCH_LIST" :key="index" class="Item">
        <img v-if="file.fileType == 'image'" :src="file.fileUrl" />
        <video v-if="file.fileType == 'video'" :src="file.fileUrl"></video>
        <div class="operateWrap">
          <div>
            <span>预览</span>
            <span>编辑</span>
            <span @click="operate('del', index)">删除</span>
          </div>
        </div>
        <div class="msk" v-if="!file.key || file.error">
          <template v-if="file.error">
            <div
              class="error"
              @click="
                file.error = '';
                CHANGE(file.UUID);
              "
            >
              <span>{{ file.error }}</span>
              <span>点击重试</span>
            </div>
          </template>
          <span v-else class="per">{{ file.per }}%</span>
          <div
            class="slider"
            :style="{
              transform: `translateY(${100 - file.per}%)`,
            }"
          ></div>
        </div>
      </div>
    </template>
    <div class="input_wrapper">
      <input
        ref="myInput"
        v-show="OPTIONS.count > FILE_LIST.length"
        class="myInput"
        type="file"
        :accept="OPTIONS.accept"
        :multiple="OPTIONS.multiple"
        @change="CHANGE"
        @click="CLICK"
      />
    </div>
  </div>
</template>

<script>
//易知鸟 文件统一文件上传
/*
 * options {
 *   type 1、九宫格形式 2、返回数据(包含错误信息、进度，此时九宫格、上传控件不可见)
 *   multiple 是否多选
 *   accept 上传文件格式
 *   count 最大文件数
 *   cropper 是否裁切  基于cropperJs
 *   count 上传文件最大值
 * }
 */
import { mapGetters } from "vuex";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";
import { Toast } from "vant";
import * as qiniu from "qiniu-js";
export default {
  name: "yznUpload",
  props: {
    options: {
      type: Object,
    },
    src: {
      type: String, //单独修改某一项
    },
    reup: {
      type: Object,
    },
  },
  data() {
    return {
      TOKEN: "",
      TOKEN_TIME: "",
      FILE_LIST: [], //源数据
      WATCH_LIST: [], //监听数据
      OBSERVER: {}, //七牛监听回调
      IS_ADD: false, //是否为新上传文件
    };
  },
  watch: {
    WATCH_LIST: {
      handler(curVal, oldVal) {
        if (curVal) {
          this.$emit("info-live", {
            list: curVal,
            IS_ADD: this.IS_ADD,
          });
          this.IS_ADD = false;
        }
      },
      deep: true,
    },
  },
  methods: {
    reupload(UUID) {},
    operate(type, index) {
      switch (type) {
        case "del":
          this.WATCH_LIST.splice(index, 1);
          this.FILE_LIST.splice(index, 1);
          break;
      }
    },
    //上传唯一识别码
    $GenNonDuplicateID(randomLength) {
      return Number(
        Math.random().toString().substr(3, randomLength) + Date.now()
      ).toString(36);
    },
    //获取文件类型 image, audio ,video, pdf, word
    getFileType(file) {
      if (file.type) {
        let fileType = file.type.toLowerCase();
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
      } else {
        //因为部分安装了wps的系统会导致file.type为空的
        let fileName = file.name.toLowerCase();
        if (
          fileName.lastIndexOf(".doc") == fileName.length - 4 ||
          fileName.lastIndexOf(".docx") == fileName.length - 5
        ) {
          return "word";
        }
      }
      return "";
    },
    CLICK(e) {
      this.$refs.myInput.value = "";
    },
    // 选择文件
    CHANGE(e) {
      let that = this;
      // 是否裁切
      if (this.options.cropper) {
        this.cropperInfo.src = files.content;
        setTimeout(function () {
          if (that.myCropper) {
            that.myCropper.destroy();
          }
          that.cropperInit();
          that.cropperInfo.show = true;
        }, 100);
        this.IS_ADD = false;
        this.$set(this, "fileList", []);
        this.fileList.push({
          key: "",
          url: "",
        });
      } else {
        let files,
          audioAndVideoFile = [],
          that = this;
        if (!e.target) {
          //错误重传
          that.FILE_LIST.forEach((item, index) => {
            if (item.UUID == e) {
              that.beforeUpload(item.file, index);
            }
          });
          return;
        } else {
          //正常选择文件
          files = e.target.files;
          // 遍历源数据
          files.forEach((item) => {
            let fileSize = item.size ? item.size / 1024 : 0,
              errorMsg;
            if (item.type.indexOf("video") == 0) {
              if (fileSize > 500 * 1024) {
                errorMsg = "上传视频文件不能超过500Mb";
              }
            } else if (fileSize > 50 * 1024) {
              errorMsg = "上传文件不能超过50Mb";
            }
            if (errorMsg) {
              Toast(errorMsg + ',"' + item.name + '"文件大小超出了限制');
              e.target.value = "";
              return;
            }
            let fileOject = {
              file: item,
              fileUrl: URL.createObjectURL(item),
              fileType: this.getFileType(item),
              UUID: "",
            };

            if (fileOject.fileType.length == 0) {
              layer.alert(item.name + '"文件类型不支持');
              e.target.value = "";
              return;
            }

            this.FILE_LIST.push(fileOject);
            if (
              fileOject.fileType == "audio" ||
              fileOject.fileType == "video"
            ) {
              // audioAndVideoFile.push(fileOject);
            }
          });
        }
        // 七牛文件上传回调
        that.OBSERVER = {
          //文件选择结果，返回文件列表
          filesSelected(files) {
            console.log(that.WATCH_LIST);
            console.log(that.FILE_LIST);
            files.forEach((item) => {
              let UUID = that.$GenNonDuplicateID(), //文件唯一id
                data = {
                  per: 0, //上传进度
                  UUID: UUID,
                  fileName: item.file.name.substr(
                    0,
                    item.file.name.lastIndexOf(".")
                  ), //文件名称
                  fileType: item.fileType, //文件类型
                  fileUrl: item.fileUrl, //blob地址
                  error: "", //错误信息
                  key: "", //七牛返回key值
                  httpUrl: "", //全地址
                };
              //新增文件添加到监听队列且给源文件添加uuid
              if (!item.UUID) {
                that.WATCH_LIST.push(data);
                item.UUID = UUID;
              }
            });
            that.IS_ADD = true;
          },
          //文件上传失败
          fail(fileUrl, error) {
            that.WATCH_LIST.forEach((item, index) => {
              if (item.fileUrl == fileUrl) {
                console.log(error);
                item.error = error;
              }
            });
          },
          //文件上传成功
          success(UUID, res) {
            that.WATCH_LIST.forEach((item) => {
              if (item.UUID == UUID) {
                item.key = res.key;
                item.httpUrl = res.url;
              }
            });
          },
          //文件上传进度
          progress(UUID, per) {
            console.log(per);
            let isEx = false;
            that.WATCH_LIST.forEach((item, index) => {
              if (item.UUID == UUID) {
                item.per = per;
                isEx = true;
              }
            });
            if (!isEx) {
              //源文件已被删除 取消上传
              return true;
            }
          },
        };
        var getDuration = function () {
          //如果没有语音或者视频需要获取时长，那么就开始上传文件
          var isEdge = navigator.userAgent.indexOf("Edge") > -1; //判断是否IE的Edge浏览器
          //Edge浏览器不支持获取时长方法
          if (audioAndVideoFile.length == 0 || isEdge) {
            if (that.OBSERVER.filesSelected) {
              that.OBSERVER.filesSelected(that.FILE_LIST);
            }
            console.log(files);
            that.FILE_LIST.forEach((item, index) => {
              that.WATCH_LIST.forEach((ceil) => {
                // 错误文件不需要在选完文件后再次上传
                if (!ceil.key && !ceil.error && item.UUID == ceil.UUID) {
                  that.beforeUpload(item.file, index);
                }
              });
            });
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
      }
    },
    //上传七牛文件处理：文件名称拼接、是否压缩
    beforeUpload(data, orderNum) {
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

      let maxSize = 2 * 1024 * 1024; //默认图片文件最大2M
      if (that.OPTIONS && that.OPTIONS.maxSize) {
        maxSize = that.OPTIONS.maxSize;
      }
      // console.log(maxSize);
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
              that.FILE_LIST[orderNum].error = errorMsg;
              if (that.OBSERVER.fail) {
                that.OBSERVER.fail(that.FILE_LIST[orderNum].fileUrl, errorMsg);
              }

              that.checkAllCompleted();
            } else {
              // 压缩后上传
              let buffer = atob(base64Codes.split(",")[1])
                .split("")
                .map((char) => char.charCodeAt(0));
              let blob = new Blob([new Uint8Array(buffer)], {
                type: "image/jpeg",
              });
              let key = "oa_showshow_" + new Date().getTime() + "_picture";

              that.doUpload(blob, orderNum, key_);
              // that.upLoadQIniu(base64Codes, orderNum,key_);
            }
          }
        );
        return;
      }

      key_ = key_
        ? key_
        : "oa_showshow_" + (new Date().getTime() + orderNum) + fileTypeName; //上传文件名

      for (var i = 0; i < that.FILE_LIST.length; i++) {
        if (data == that.FILE_LIST[i].file) {
          var fileOject = that.FILE_LIST[i];
          if (fileOject && fileOject.duration) {
            key_ = key_ + "_" + Math.round(fileOject.duration);
          }
        }
      }

      // console.log(data.name + "#key=" + key_ + "#type=" + data.type);
      this.doUpload(data, orderNum, key_);

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
    //检查上传
    checkAllCompleted() {
      let allFileCompelted = true,
        that = this;
      for (var i = 0; i < that.WATCH_LIST.length; i++) {
        if (!that.WATCH_LIST[i].key && !that.WATCH_LIST[i].error) {
          allFileCompelted = false;
          break;
        }
      }
      if (allFileCompelted) {
        // if (this.options.multiple) {
        //   var fileURLS = [];
        //   for (var i = 0; i < that.FILE_LIST.length; i++) {
        //     if (that.FILE_LIST[i].httpUrl) {
        //       fileURLS.push({
        //         url: that.FILE_LIST[i].httpUrl,
        //         key: that.FILE_LIST[i].key,
        //       });
        //     }
        //   }
        //   that.imgData = that.imgData.concat(fileURLS);
        // } else {
        //   that.imgData = that.imgData.concat([
        //     {
        //       url: that.FILE_LIST[0].httpUrl,
        //       key: that.FILE_LIST[0].key,
        //     },
        //   ]);
        //   //   fn(that.FILE_LIST[0].httpUrl, that.FILE_LIST[0].key);
        // }
        // console.log(that.imgData);
        // that.WATCH_LIST.map((item) => {
        //   that.imgData.map((ceil) => {
        //     if (that.options.cropper) {
        //       this.IS_ADD = true;
        //       item["key"] = ceil["key"];
        //       item["url"] = ceil["url"];
        //     } else {
        //       if (ceil.key == item.key) {
        //         item.url = ceil.url;
        //       }
        //     }
        //   });
        // });
        // console.log(that.WATCH_LIST);

        console.log("上传完毕：");
        console.log(that.WATCH_LIST);
        that.$refs.myInput.value = "";
      }
    },
    //上传七牛
    doUpload(data, orderNum, key_) {
      let that = this;
      //因为超过4M以后文件会分片上传，所以要指定文件类型，不然七牛会根据算法自动个文件类型，那样文件大的word或excel会有问题
      that.getQINIUToken(function (token) {
        let observable = qiniu.upload(data, key_, token, {
          mimeType: [data.type],
        }); //上传数据
        let subscription = observable.subscribe({
          //上传状态回调
          next: function (res) {
            //上传中
            if (that.OBSERVER.progress) {
              let isStoped = that.OBSERVER.progress(
                that.FILE_LIST[orderNum] && that.FILE_LIST[orderNum].UUID,
                parseInt(res.total.percent)
              );
              if (isStoped) {
                subscription.unsubscribe();
                // that.FILE_LIST[orderNum].error = "用户取消";
              }
            }
          },
          error: function (err) {
            //上传失败
            that.TOKEN = undefined;
            that.FILE_LIST[orderNum] &&
              (that.FILE_LIST[orderNum].error = "上传失败");

            if (that.OBSERVER.fail) {
              that.OBSERVER.fail(
                that.FILE_LIST[orderNum].fileUrl,
                that.FILE_LIST[orderNum].error
              );
            }
            that.checkAllCompleted();
          },
          complete: function (res) {
            //上传成功
            that.FILE_LIST[orderNum].key = res.key;
            that.FILE_LIST[orderNum].httpUrl = res.url;
            if (that.OBSERVER.success) {
              that.OBSERVER.success(that.FILE_LIST[orderNum].UUID, res);
            }
            if (that.OPTIONS.cropper) {
              that.cropperInfo.show = false;
            }
            that.checkAllCompleted();
          },
        });
      });
    },
    // 七牛token
    getQINIUToken(fn) {
      if (this.TOKEN) {
        if (this.TOKEN_TIME) {
          if (new Date().getTime() - this.TOKEN_TIME.getTime() < 3500 * 1000) {
            if (fn) fn(this.TOKEN);
            return;
          } else {
            this.TOKEN = undefined;
          }
        }
      }
      let system = this.getSystemType;
      this.yznReq(
        "get",
        this.getSystemType == 2
          ? "api/oa/qiniu/getUploadToken"
          : "api/admin/setting/getUploadToken",
        {}
      ).then((res) => {
        if (res.status == 200) {
          this.TOKEN = res.context;
          this.TOKEN_TIME = new Date();
          if (fn) fn(this.TOKEN);
        }
      });
    },
  },
  computed: {
    OPTIONS: function () {
      // 默认配置项
      let OPTIONS = {
        type: 1,
        multiple: false,
        accept: "image/*",
        hide: false,
        cropper: false,
        count: Infinity,
      };
      return Object.assign({}, OPTIONS, this.options);
    },
    ...mapGetters(["getSystemType"]),
  },
};
</script>

<style lang="less" scoped>
.uploadWrap {
  // min-width: 80px;
  // min-height: 80px;
  position: relative;
  // padding: 30px 10px;
  // border: 1px dashed #e5e5e5;
  display: flex;
  &.hide {
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .Item {
    position: relative;
    width: 80px;
    height: 80px;
    box-shadow: 0 0 6px 2px #ebedf0;
    margin-right: 10px;
    border-radius: 4px;
    cursor: pointer;
    > img,
    > video {
      width: 100%;
      height: 100%;
      position: absolute;
      display: block;
      top: 0;
      left: 0;
      z-index: 1;
      background-color: #fff;
    }
    .msk {
      width: 100%;
      height: 100%;
      overflow: hidden;
      position: relative;
      z-index: 2;
      border-radius: 4px;
      .error {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #fff;
        font-size: 10px;
        padding: 0 12px;
        border-radius: 4px;
        z-index: 1;
        width: 90%;
      }
      .per {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #fff;
        font-size: 12px;
        font-weight: bold;
        background-color: rgba(0, 0, 0, 0.2);
        padding: 0 12px;
        border-radius: 4px;
        z-index: 1;
      }
      .slider {
        transform: translateY(100%);
        transition: ease transform 0.2s;
        background-color: rgba(0, 0, 0, 0.5);
        width: 100%;
        height: 100%;
      }
    }
    .operateWrap {
      background-color: rgba(0, 0, 0, 0.5);
      width: 100%;
      height: 22px;
      position: absolute;
      transform: translateY(0);
      top: 0;
      left: 0;
      transition: ease transform 0.2s;
      border-radius: 2px 2px 0 0;
      > div {
        height: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        span {
          font-size: 10px;
          color: #fff;
          &:hover {
            color: #13c2c2;
          }
        }
      }
    }
    &:hover .operateWrap {
      transform: translateY(-20px);
    }
  }
  .input_wrapper {
    width: 100%;
    height: 100%;
    background-color: #000;
    position: relative;
    border-radius: 4px;
    &:after {
      content: "上传";
      position: absolute;
      color: #fff;
      font-size: 12px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    .myInput {
      display: inline-block;
      width: 100%;
      height: 100%;
      opacity: 0;
      position: absolute;
      top: 0;
      left: 0;
      cursor: pointer;
      z-index: 1;
    }
  }
}
</style>
