<template>
  <div class="video_box">
    <div id="video-background" class="bk-radius" v-show="flag === true">
      <video
        v-show="base64Str === ''"
        id="video"
        class="video-camera"
        preload
        autoplay
        loop
        muted/>
    </div>
    <div>
      <canvas v-show="flag === false" id="canvas1" width="300" height="300" />
    <!-- <el-alert title="对准镜头，缓慢摇动面部以便系统快速捕捉人脸!" type="warning"  center show-icon /> -->
    <p></p>
    <span style="color:#e67e22;font-size:1.3em;">请对准镜头，缓慢摇动面部！</span>
    </div>
    <div v-show="flag === false">
      <!-- <van-button
        style="margin-top: 30px; text-align: center"
        type="primary"
        @click="resetTracking"
      >
        重启
      </van-button> -->

    </div>
  </div>
</template>

<script>
require("tracking/build/tracking-min.js");
require("tracking/build/data/face-min.js");
require("tracking/build/data/mouth-min.js");
import { ElAlert } from "element-plus"
export default {
  name: "TrackingDemo",
  components:{
    ElAlert
  },
  data() {
    return {
      trackerTask: "",
      tracker: {},
      mediaStreamTrack: {},
      video: {},
      count: 0,
      flag: true,
      base64Str: "",
    };
  },
  mounted() {
    this.initTracking();
  },
  watch: {
    $route(to) {
      if (to.path != "/facein") {
        this.closeCamera();
      }
    },
  },
  methods: {
    resetTracking() {
      this.flag = true;
      this.base64Str = "";
      this.trackerTask = "";
      this.tracker = {};
      this.mediaStreamTrack = {};
      this.video = {};
      this.count = 0;
      this.initTracking();
    },
    initTracking() {
      const _this = this;
      const video = (this.video = document.getElementById("video"));
      _this.tracker = new window.tracking.ObjectTracker("face");
      _this.tracker.setInitialScale(4);
      _this.tracker.setStepSize(2);
      // 转头角度影响识别率
      _this.tracker.setEdgesDensity(0.1);
      _this.openCamera();
      _this.trackerTask = window.tracking.track("#video", _this.tracker);
      _this.tracker.on("track", function (event) {
        if (event.data.length) {
          // 会不停的去检测人脸，所以这里需要做个锁
          if (_this.flag) {
            _this.flag = false;
            // 裁剪并绘制
            const canvasUpload = document.getElementById("canvas1");
            const contextUpload = canvasUpload.getContext("2d");
            contextUpload.drawImage(video, 0, 0, 300, 300);
            // 人脸 base64
            _this.base64Str = canvasUpload.toDataURL("image/jpeg");
            // console.log("face info")
            // console.log(_this.base64Str);
            _this.$store.dispatch("getdata", _this.base64Str);

            // const imgUrl = _this.base64Str;
            // // 这里就按照chrome等新版浏览器来处理
            // let a = document.createElement("a");
            // a.href = imgUrl;
            // a.setAttribute("download", "chart-download");
            // a.click();

            // 关闭摄像头
            _this.closeCamera();
            // 直接获取 base64 不显示画布可开启
            // _this.flag = true
          }
        }
      });
      _this.closeCamera();
    },
    openCamera() {
      if (navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {};
      }
      if (navigator.mediaDevices.getUserMedia === undefined) {
        navigator.mediaDevices.getUserMedia = function (constraints) {
          // 首先，如果有getUserMedia的话，就获得它
          const getUserMedia =
            navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia;
          // 一些浏览器根本没实现它 - 那么就返回一个error到promise的reject来保持一个统一的接口
          if (!getUserMedia) {
            return Promise.reject(new Error("getUserMedia 浏览器不支持摄像头"));
          }
          // 否则，为老的navigator.getUserMedia方法包裹一个Promise
          return new Promise(function (resolve, reject) {
            getUserMedia.call(navigator, constraints, resolve, reject);
          });
        };
      }
      const constraints = {
        video: true,
        audio: false,
      };
      const promise = navigator.mediaDevices.getUserMedia(constraints);
      promise
        .then((stream) => {
          this.mediaStreamTrack = stream.getTracks()[0];
          window.stream = stream;
          const video = document.getElementById("video");
          // 旧的浏览器可能没有srcObject
          if ("srcObject" in video) {
            video.srcObject = stream;
          } else {
            video.src = window.URL.createObjectURL(stream);
          }
          video.onloadedmetadata = function () {
            video.play();
          };
        })
        .catch((err) => {
          console.error(err.name + ": " + err.message);
          console.error("获取权限失败");
        });
    },
    closeCamera() {
      if (typeof window.stream === "object") {
        if ("srcObject" in this.video) {
          this.video.srcObject = null;
        }
        window.stream.getTracks().forEach((track) => track.stop());
      }
    },
  },
};
</script>

<style lang="less" scoped>
.bk-radius {
  width: 300px;
  height: 300px;
  overflow: hidden;
  background-color: #42b983;
  border-radius: 50%;
}
#canvas1 {
  border-radius: 50%;
}
.video-camera {
  width: 400px;
  height: 400px;
  margin-top: -50px;
  margin-left: -50px;
}
.video_box {
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content:center
}
</style>
