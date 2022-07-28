<template>
  <div class="person">
    <el-config-provider  size="default" >
    <el-card class="info">
      <div class="title"></div>
      <el-form v-model="face">
        <!-- <div class="form"> -->
        <el-form-item label="单位" >
          <el-input v-model="face.unit" placeholder="正在读取数据。。。请稍等" ></el-input>
        </el-form-item>
        <el-form-item label="身份">
          <el-input v-model="face.user_type" placeholder="正在读取数据。。。请稍等" ></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="face.real_name" placeholder="正在读取数据。。。请稍等"></el-input>
        </el-form-item>
        <!-- </div> -->
        <el-form-item label="事由">
          <el-checkbox-group v-model="checkList" @change="onConfirm">
            <el-checkbox v-for="item in todoList" :key="item.id" :label="item.id">{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="face.comment" placeholder="请填写备注"></el-input>
        </el-form-item>
      </el-form>
    </el-card>
    <div class="button">
      <el-button color="#9A0000" style="color: white;width:88px;height:46px" @click="signIn">确认</el-button>
    </div>
  </el-config-provider>
  </div>
</template>

<script>
import { reactive, toRefs, watch, ref } from "vue";
import { ElMessage } from "element-plus"
import { useStore } from "vuex";
import { useRouter } from "vue-router";
// , getThingList, getTodo
import { postUserInByFace, getTodoByUserType } from "@/api/sign.js";
import { ElCard, ElForm, ElFormItem, ElCheckbox, ElInput, ElButton,ElConfigProvider } from 'element-plus'
export default {
  components: {
    ElCard, ElForm, ElFormItem, ElCheckbox, ElInput, ElButton,ElConfigProvider
  },
  setup() {
    const checkList = ref([])
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
              class_group:"",
              user_type_id: 0,
              comment:"",
      },
      param: {
        faceId: "",
        to_do: "",
      },
      columnsdata: "",
      todoList:[]
    });

    watch(
      () => store.state.img.face,
      (val) => {
        if (val) {
          state.face = val;
          state.show = true;
          console.log(state.face)
          if ( val.user_type_id != 0 )
            getTodoList(val.user_type_id)
        } else {
          ElMessage.error('人脸验证失败！请重试！')
          
        }
      },
    );
    const signIn = async()=>{
      try {
        const params = {
          id: state.face.id,
          real_name: state.face.real_name,
          class_group: state.face.class_group,
          todo: checkList.value.join(","),
          unit: state.face.unit,
          unit_type: state.face.unit_type,
          user_type: state.face.user_type,
          comment: state.face.comment
        }
        if(params.comment === undefined) {
          params.comment = ""
        }
        const {data} = await postUserInByFace(params)
        if(data.code === 200) {
          ElMessage({
            message: '恭喜你！登记成功',
            type: 'success',
          })
		      store.commit("SET_INDEX",1)
        } else {
          // ElMessage({
          //   message: data.msg,
          //   type: 'error'
          // })
          console.log("sign error")
        }
      } catch (error) {
        ElMessage({
          message: '签到程序错误！！！！',
          type: 'warning',
        })
      }
      setTimeout(function () {
        store.commit("SET_INDEX",1)
        router.push("/");
      }, 1000);
    };

    const exit = () => {
      store.commit("SET_INDEX",1)
      router.push("/");
    };
    //多选事由
    const onConfirm = async (value) => {
      console.log(value)
    };

  //获取对应待办事项
  const getTodoList = async(userTypeId) => {
    let params = {
      userTypeId: userTypeId
    }
    getTodoByUserType(params)
    .then(res => {
      res = res.data
      if ( res.code == 200 ) {
        state.todoList = res.data
      } else {
        ElMessage({
          type: 'error',
          message: res.msg
        })
      }
    })
  };
    return{
      ...toRefs(state),
      exit,
      signIn,
      onConfirm,
      checkList
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
    // .todo {
    //   display: flex;
    //   align-items: center;
    //   justify-content: flex-start;
    //   flex-wrap: wrap;
    //   // float: left;
    // }
    .el-checkbox-group {
      text-align: left; 
      /* //这个很关键，否则最后一行是居中状态 */ 
    
      .el-checkbox {
        margin-left: 0px;
        margin-right: 25px;
        width: 100px;        
        /* //根据内容设置宽度 */
        padding-left: 0px;
        text-align: left;  
      }
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
