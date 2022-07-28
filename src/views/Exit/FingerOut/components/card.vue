<template>
  <div class="person">
    <el-card class="info">
      <div class="title">{{identifyState}}</div>
      <el-form v-model="finger">
        <!-- <div class="form"> -->
        <el-form-item label="单位" >
          <el-input v-model="finger.unit" placeholder="正在读取数据。。。请稍等" ></el-input>
        </el-form-item>
        <el-form-item label="身份">
          <el-input v-model="finger.user_type" placeholder="正在读取数据。。。请稍等" ></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="finger.real_name" placeholder="正在读取数据。。。请稍等"></el-input>
        </el-form-item>
      </el-form>
    </el-card>
    <div class="button">
      <!-- <el-button color="#9A0000" plain @click="signIn">确认</el-button> -->
      <el-button color="#9A0000" style="color: white" @click="signIn">确认</el-button>
      <!-- <el-button color="#9A0000" plain @click="exit">退出</el-button> -->
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, watch, ref } from "vue";
import { ElMessage } from "element-plus"
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { postUserOut } from "@/api/out.js";
import { ElCard, ElForm, ElFormItem, ElInput } from "element-plus"


export default {
  props: {
    personInfo: {
      type: Object
    }
  },
  components:{
    ElCard, ElForm, ElFormItem, ElInput
  },
  setup(props) {
    const router = useRouter();
    const store = useStore();
    // 请在指纹仪上进行指纹识别
    const identifyState = ref('')
    const state = reactive({
      finger: {
          unit: "",
          user_type: "",
          real_name: "",
          id:0,
          unit_type:"",
          class_group:"",
          unit_type_id: ""
      },
      param: {
        faceId: "",
        to_do: "",
      },
      columnsdata: "",
    });

    watch(
      props.personInfo, (newValue) => {
        state.finger.unit = newValue.unit
        state.finger.user_type = newValue.userType
        state.finger.id = newValue.id
        state.finger.real_name = newValue.realName
        state.finger.unit_type = newValue.unitType
        state.finger.class_group = newValue.classGroup
        state.finger.user_type_id = newValue.userTypeId
        identifyState.value = "识别成功"
      }
    );
    const signIn = async()=>{
      let params = {
        id:state.finger.id
      }
      await postUserOut(params)
      .then(res => {
        res = res.data
        if (res.code == 200) {
          ElMessage({
            message: res.msg,
            type: 'success',
          })
        } else {
          ElMessage({
            message: res.msg,
            type: 'warning',
          })
        }
        store.dispatch("cleardata");
        setTimeout(function () {
          router.push("/");
        }, 4000); 
      })
    };
    // .catch(err => {
      //   ElMessage({
      //     message: '系统异常，请刷新后重试',
      //     type: 'error',
      //   })
      // })
    return{
      ...toRefs(state),    
      signIn,
      identifyState
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