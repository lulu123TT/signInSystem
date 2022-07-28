<template>

  <div class="person">
    <el-card class="info">
      <div class="title"></div>
      <el-form v-model="face">
        <!-- <div class="form"> -->
        <el-form-item label="单位" >
          <el-input v-model="face.unit" placeholder="正在读取数据 ... ... 请稍等" ></el-input>
        </el-form-item>
        <el-form-item label="身份">
          <el-input v-model="face.user_type" placeholder="正在读取数据 ... ... 请稍等" ></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="face.real_name" placeholder="正在读取数据 ... ... 请稍等"></el-input>
        </el-form-item>
      </el-form>
    </el-card>
    <div class="button">
      <!-- <el-button color="#9A0000" plain @click="signIn">确认</el-button> -->
      <!-- <el-button color="#9A0000" style="color: white" @click="signIn">确认</el-button> -->
      <!-- <el-button color="#9A0000" plain @click="exit">退出</el-button> -->
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, watch } from "vue";
import { ElMessage } from "element-plus"
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { postUserOut } from "@/api/out.js";
import { ElCard, ElForm, ElFormItem, ElInput } from "element-plus"

    // const todoList = [];
export default {
  components:{
    ElCard, ElForm, ElFormItem, ElInput
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    const state = reactive({
      show: false,
      value: "",
      showPicker: false,
      face: {
              unit: "",
              user_type: "",
              real_name: "",
              id:0,
              unit_type:"",
              class_group:""
      },
      param: {
        faceId: "",
        to_do: "",
      },
      columnsdata: "",
    });

    watch(
      () => store.state.img.face,
      (val) => {
        if (val) {
          state.face = val;
          state.param.faceId = val.faceId;
          state.show = true;
          signIn();
        } else {
          ElMessage.error('读取数据失败！请重试！')
        }
      }
    );
    const signIn = async()=>{
      if(state.face.id == 0){
        return 
      }
      // console.log("run signIn")
      try {
        let params = {
          id:state.face.id
        }
        const {data} = await postUserOut(params)
        if(data.code === 200) {
          ElMessage({
            message: '签退成功',
            type: 'success',
          })
		      store.commit("SET_INDEX",1)
        } else {
          console.log("sign out error")
        }
      } catch (error) {
        ElMessage({
          message: '签退程序错误！！！！',
          type: 'warning',
        })
        console.log(error)
      }
        setTimeout(function () {
          router.push("/");
          store.commit("SET_INDEX",1)
          // store.dispatch("cleardata");
          // setTimeout(()=>{window.location.reload()}, 200)
        }, 3000);
    };
    return{
      ...toRefs(state),
      signIn
    }
  }
}
</script>

<style lang="less">
.person{
  display: flex;
  flex-direction:  column;
  // width:360px;
  // height: 280px;
  .info{
    background-color: rgb(255, 255, 255);
    width: 760px;
    // height: 220px;
    padding-left: 10px;
    padding-right: 10px;
    border-radius: 5px;
    // box-shadow: 2px 2px 6px 0px rgba(154, 0, 0, 100);
    .title{
      padding-top: 20px;
      padding-bottom: 10px;
    }
    .el-input__inner {
      border: 0;
    }
  }
  .button{
    margin-top:20px;
    margin-right:15px;
  }
}
</style>