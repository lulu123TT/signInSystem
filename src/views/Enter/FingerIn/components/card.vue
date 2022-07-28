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
        <!-- </div> -->
        <el-form-item label="事由">
          <el-checkbox-group v-model="selectedTodo" placeholder="请选择事由" @change="onConfirmTodo">
            <el-checkbox v-for="item in checkList" :key="item.id"  :label="item.id" >{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="finger.comment" placeholder="请填写备注"></el-input>
        </el-form-item>
      </el-form>
    </el-card>
    <div class="button">
      <!-- <el-button color="#9A0000" plain @click="signIn">确认</el-button> -->
      <!-- <el-button color="#9A0000" plain @click="exit">退出</el-button> -->
      <el-button color="#9A0000" style="color: white;width:88px;height:46px" :disabled="submitState"  @click="signIn">确认</el-button>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, watch, ref } from "vue";
import { ElMessage } from "element-plus"
import { useStore } from "vuex";
import { useRouter } from "vue-router";
// getThingList, 
import { postUserInByFace, getTodoByUserType } from "@/api/sign.js";
import { ElCard, ElForm, ElFormItem, ElCheckbox, ElInput, ElButton } from 'element-plus'


export default {
  props: {
    personInfo: {
      type: Object
    }
  },
  components: {
    ElCard, ElForm, ElFormItem, ElCheckbox, ElInput, ElButton
  },
  setup(props) {
    const identifyState = ref('')
    const checkList = ref([])
    const router = useRouter();
    const store = useStore();
    const submitState = ref(true)
    const state = reactive({
      finger: {
        unit: "",
        user_type: "",
        real_name: "",
        id:0,
        unit_type:"",
        class_group:"",
        comment:"",
        user_type_id: "",
      },
      selectedTodo: [],
    });
    
    // 监听指纹识别是否成功
    watch(
      // , oldValue
      props.personInfo, (newValue) => {
        state.finger.unit = newValue.unit
        state.finger.user_type = newValue.userType
        state.finger.id = newValue.id
        state.finger.real_name = newValue.realName
        state.finger.unit_type = newValue.unitType
        state.finger.class_group = newValue.classGroup
        state.finger.user_type_id = newValue.userTypeId
        identifyState.value = "识别成功"
        // 获取事由
        getTodoList(state.finger.user_type_id)
      }
    );
    const getTodoList = async(userTypeId) => {
      // 首先清空数组
      checkList.value = []
      let params = {
        userTypeId: userTypeId
      }
     getTodoByUserType(params)
      .then(res => {
        res = res.data
        checkList.value = res.data
        console.log(checkList.value)
      })   
    }
    // 选择事由
    const onConfirmTodo = (value) => {
      if (value.length == 0) {  
        submitState.value = true
      } else {
        submitState.value = false
      }
    }
    //提交签到
    const signIn = async()=>{
      try {
        const params = {
          id: state.finger.id,
          real_name: state.finger.real_name,
          class_group: state.finger.class_group,
          todo: state.selectedTodo.join(","),
          unit: state.finger.unit,
          unit_type: state.finger.unit_type,
          user_type: state.finger.user_type,
          comment: state.finger.comment
        }
        console.log(params)
        if(params.comment === undefined) {
          console.log("null")
          params.comment = ""
        }
        console.log(params)
        const {data} = await postUserInByFace(params)
        console.log(data)
        if(data.code === 200) {
          ElMessage({
            message: '恭喜你！登记成功',
            type: 'success',
          })
        }
        store.dispatch("cleardata");
        setTimeout(function () {
          router.push("/");
        }, 1000);   
      } catch (error) {
        ElMessage({
          message: '签到程序错误！！！！',
          type: 'warning',
        })
        console.log(error)
      }
    };
    const exit = () => {
      router.push("/");
    };
    //多选事由
    
  //获取对应待办事项
  // const todo = []
  

  return{
    ...toRefs(state),
    exit,
    signIn,
    checkList,
    submitState,
    onConfirmTodo,
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
    display: flex;
    justify-content:space-evenly
  }
  
  .el-button{
    width:150px !important;
  }
}
</style>

