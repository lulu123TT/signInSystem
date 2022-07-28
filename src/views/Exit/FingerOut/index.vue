<template>
  <!-- <div class="sign"> -->
     <!-- <el-alert title="对准仪器，以便快速读取指纹！" type="warning"  center show-icon style="font-size:90px;" /> -->
      <div class="main">
          <finger :flag="flag" :state="state"></finger>
          <information :personInfo="personInfo"></information>
      </div>
  <!-- </div> -->
</template>

<script>
import finger from "@/components/Finger/index.vue";
import information from "./components/card.vue";
import { ElAlert } from "element-plus"
import { ref, reactive } from 'vue' 
import { searchFinger } from "@/api/sign.js"
import useSocket from "@/utils/use-socket.js"

const flag = ref(0)
const state = ref('扫描中')


// websocket与后台进行交互的函数
function handleMessage(e) {
  // 直接调用指纹识别api
  state.value = e.data
}

// 初始化函数
function init(flag, state){
  flag.value = 0
  state.value = "正在准备指纹仪"
  const { ws } = useSocket(handleMessage) 
  return {
    ws
  }
}

// 关闭websocket连接
function closeSocket(ws) {
  ws.close()
}

// 指纹识别函数
function fingerIdent(ws, personInfo) {
  searchFinger()
  .then(res => {
    res = res.data
    state.value = res.msg
    flag.value = 1
    closeSocket(ws)
    personInfo.id = res.data.id
    personInfo.classGroup = res.data.class_group
    personInfo.realName = res.data.real_name
    personInfo.unit = res.data.unit
    personInfo.unitType = res.data.unit_type
    personInfo.userType = res.data.user_type
    personInfo.userTypeId = res.data.user_type_id 
  }).catch(err => {
    state.value = "系统异常，请刷新后重试"
    closeSocket(ws)
  })
}

export default {
    components:{
        finger,
        information, 
        ElAlert
    },
    setup() {
      const personInfo = reactive({
        id: 0,
        realName: '',
        unit: '',
        unitType: '',
        userType: '',
        userTypeId: '',
        classGroup: ''
      })
      const { ws } = init(flag, state)
      fingerIdent(ws, personInfo)
      return {
        flag,
        state,
        personInfo
      }
    }
}
</script>
<style>
/* .sign {
  height: calc(100% - 400px);
} */

.el-alert{
  /* margin-top: 0%; */
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