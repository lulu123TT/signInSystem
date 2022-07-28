<template>
  <!-- <div class="sign"> -->
     <!-- <el-alert title="对准镜头，缓慢摇动面部以便系统快速捕捉人脸!" type="warning"  center show-icon /> -->
      <div class="main">
          <scan></scan>
          <information></information>
      </div>
  <!-- </div> -->
</template>

<script>
import scan from "@/components/Scan/index.vue";
import information from "./components/card.vue";
import { ElAlert } from "element-plus"
export default {
    components:{
        scan,
        information,ElAlert
    },
}
</script>
<style>
.el-alert {
  position: absolute;
  top:13%;
}
.main {
  height: calc(100% - 130px);
  display: flex;
  justify-content: space-around;
  align-items: center;
}
</style>