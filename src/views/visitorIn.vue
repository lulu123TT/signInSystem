<template>
  <el-card class="box-card">
    <el-table :data="state.tableData" style="width: 100%" stripe  >
      <el-table-column prop="real_name" label="姓名" width="380" />
      <el-table-column prop="unitName" label="单位" width="480" />
      <el-table-column  label="操作">
        <template #default="scope">
          <el-button color="#9A0000" plain class="white_btn btn long_btn" @click="showSign(scope.row.id, scope.row.unitName, scope.row.unitType)">签到</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
  <el-dialog
    v-model="dialogVisible"
    title="事由列表"
    width="40%"
    
    @closed="handleClose"
  >
    <el-form-item label="">
        <el-checkbox-group v-model="checkList">
          <el-checkbox v-for="item in todoList" :key="item.value" :label="item.lable" @change="onConfirm"/>
        </el-checkbox-group>
    </el-form-item>
    <el-form-item label="备注">
      <el-input v-model="state.params.comment" placeholder="请输入备注"></el-input>
    </el-form-item>
    <template #footer>
      <span class="dialog-footer">
        <el-button class="btn" @click="dialogVisible = false">取消</el-button>
        <el-button class="btn" type="primary" @click="sign"
          >确定</el-button
        >
      </span>
    </template>
  </el-dialog> 
  <!-- <el-button @click="temp">temp</el-button> -->
</template>

<script>
import { reactive, onMounted, ref, watch,onUnmounted} from 'vue'
import { ElMessage, ElDialog, ElButton, ElFormItem, ElInput, ElCard, ElTable, ElTableColumn } from "element-plus"
import {getInVisitor,postVisitorIn,getVisitorThing} from "@/api/visitorin.js";
import {  getThingList } from "@/api/sign.js";
import { useRouter } from "vue-router";
export default {
  components:{ ElDialog, ElButton, ElFormItem, ElInput, ElCard, ElTable, ElTableColumn },
  setup() {
    const checkList = ref([])
	  const router = useRouter();
    const state = reactive({
      value:[],
      tableData:[],
      params:{
        id:0,
        todo:'',
        comment:'',
        unit: '',
        unitType: '',
      },
      columnsdata:''
    })
    const todoList = [];
    const isExit = ref(true)
    const dialogVisible = ref(false)
    var t1 = setTimeout(function () {
      router.push("/");
    }, 6000);

    // const temp = () => {
    //   try{
    //   isExit.value = !isExit.value
    //   } catch(e) {
    //     console.log(e)
    //   }
    // }
    const handleClose = () =>{
      state.params = {
        id:0,
        todo:'',
        comment:'',
        unit: '',
        unitType: '',
      }
      state.value = ""
    }
    watch( 
      dialogVisible,
      (newVal, oldVal)=> {
        //dialog显示时，清除定时器
        if(newVal === true) {
          clearTimeout(t1)
        }
        //dialog关闭，重新启用定时器
        else if(newVal === false) {
          t1 = setTimeout(function () {
            router.push("/");
          }, 6000);
        }
      }
    );
    const getvisitor = async () => {
      try {
        const { data } = await getInVisitor();
        // console.log("invisitor info", data)
        state.tableData = data.data
        // console.log(state.tableData)
      } catch {
        ElMessage({
          message:"get visitor error",
          type:'error'
        })
      }
    };
    const getAllTodoList = async () =>{
      try {
        const { data } = await getThingList();
        state.columnsdata = data.data
      } catch (error) {
        ElMessage({
          message:"获取事由失败",
          type:'error'
        })
      }
    };
        const visitorTodo = [];
    const getTodoList = async () =>{
      try {
        await getAllTodoList();
        const { data } = await getVisitorThing();
        visitorTodo.value = data.data.todoListId.split(",");
        //todoList.value = [];
        for(var i = 0; i < visitorTodo.value.length; i++) {
          for(var j = 0; j < state.columnsdata.length; j++) {
            if(state.columnsdata[j].id === Number(visitorTodo.value[i])) {
              todoList.push({value:state.columnsdata[j].id,lable:state.columnsdata[j].name})
            }
          }
        }
      } catch (error) {
        ElMessage({
          message:"get todo lisi error",
          type:'error'
        })
      }
    };
    const showSign = async (value, unit, unitType) => {
      // console.log("麻了为啥拿不到", todoList)
      dialogVisible.value = true
      state.params.id = value
      state.params.unit = unit
      state.params.unitType = unitType
	};
    //多选事由
    
    const onConfirm = async () => {
      state.value = []
      for(var i = 0; i < checkList.value.length; i++) {
        for(var j = 0; j < todoList.length; j++)
          if(checkList.value[i] === todoList[j].lable) {
            state.value.push(todoList[j].value)
          }
      }
      // checkList.value = [];
      // console.log("state.value" + state.value)
      // console.log(state.value.toString())
    };
    const sign = async () => {
      try {
        state.params.todo = state.value.toString()
        console.log("state.params")
        console.log(state.params)
        if(state.params.todo=== '' ) {
          ElMessage({
            message:'请先选择事由然后登陆！',
            type:'error'
          })
        }
        else{
          const { data } = await postVisitorIn(state.params);
          ElMessage({
            message: "登记成功",
            type: "success"
          })
          console.log(data)
          dialogVisible.value = false
          getvisitor();
          checkList.value = [];
        setTimeout(function () {
			console.log("go out")
          router.push("/");
        }, 1000);
        }
      } catch (error) {
        ElMessage({
          message:"出错啦",
          type:'error'
        })
      }
    }
    onMounted(() => {
      getvisitor();
      getTodoList();
      t1
    });
    onUnmounted(()=>{
      if(t1) { 
          clearTimeout(t1); 
      }
    })
    return {
      todoList,
      sign,
      state,
      onConfirm,
      dialogVisible,
      showSign,
      handleClose,
      checkList,
      // temp
    }
  }
}
</script>

<style lang="less">
        .box-card{
        height:93%;
        width: 93%;
        overflow:auto;
      }
      
      .el-table .el-table__cell{
        text-align: center;
      }

</style>

<style>

      /* .el-button{
        width: 200px !important;
      } */
</style>