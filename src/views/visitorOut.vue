<template>
  <el-card class="box-card">
    <el-table :data="state.tableData" style="width: 100%" stripe max-height="100%">
      <el-table-column prop="real_name" label="姓名" width="380" />
      <el-table-column prop="unitName" label="单位" width="480" />
      <el-table-column  label="操作">
        <template #default="scope">
          <el-button color="#9A0000" plain class="white_btn btn" @click="sign(scope.row.id)">签退</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
    <el-dialog
    v-model="dialogVisible"
    title="Tips"
    width="30%"
    @closed="handleClose"
  >
    <el-form-item label="事由">
      <el-select v-model="state.value" multiple placeholder="请选择事由" @change="onConfirm">
        <el-option
          v-for="item in todoList"
          :key="item.value"
          :label="item.lable"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="备注">
      <el-input v-model="state.params.comment" placeholder="请输入备注"></el-input>
    </el-form-item>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="sign"
          >Confirm</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { reactive, onMounted, ref, } from 'vue'
import { ElMessage, ElDialog, ElButton, ElFormItem, ElInput, ElSelect, ElOption, ElCard, ElTable, ElTableColumn } from "element-plus"
import {getOutVisitor,postVisitorOut} from "@/api/visitorout.js";
import {  getThingList } from "@/api/sign.js";
import { useRouter } from "vue-router";

export default {
    components:{ElDialog, ElButton, ElFormItem, ElInput, ElSelect, ElOption, ElCard, ElTable, ElTableColumn},
  setup() {
    const state = reactive({
      value:"",
      tableData:[],
      params:{
        id:0,
        todo:'',
        comment:'',
      },
      columnsdata:''
    })
	
	const router = useRouter();
    const todoList = [];
    // const visible = ref(false)
    const dialogVisible = ref(false)
    const handleClose = () =>{
      state.params = {
        id:0,
        todo:'',
        comment:'',
      }
      state.value = ""
      // console.log("嘿嘿嘿")
    }
    const getvisitor = async () => {
      try {
        const { data } = await getOutVisitor();
        console.log("invisitor info", data)
        state.tableData = data.data
        console.log(state.tableData)
        // data.forEach((item, index) => {
        //   item.number = index + 1;
        // });
        // state.tableDate.push(...data);
        // state.show = false;
      } catch {
        ElMessage({
          massage:"",
          type:'error'
        })
      }
    };
    const getTodoList = async () =>{
      try {
        const { data } = await getThingList();
        // let tempList = []
        data.data.forEach(element => {
          todoList.push({value:element.id,lable:element.name})
        });
        // console.log("ctyprint",data)
        // todoList = tempList
        state.columnsdata = data.data
        // console.log(data)
        console.log('todolist',todoList)
      } catch (error) {
        ElMessage({
          massage:"",
          type:'error'
        })
      }
    };
    const showSign = async (value) => {
      // console.log("麻了为啥拿不到", todoList)
      dialogVisible.value = true
      state.params.id = value
    };
    // const signBtn = async () => {
    //   visible = true
    // }
    //多选事由
    const onConfirm = async (value) => {
      state.value = value
    };
    const sign = async (id) => {
      try {
        state.params.todo = state.value.toString()
        state.params.id = id
        console.log(state.params)
        const { data } = await postVisitorOut(state.params);
        console.log(data)
        dialogVisible.value = false
        getvisitor();
        setTimeout(function () {
			console.log("go out")
          router.push("/");
        }, 1000);
		// router.push("/");
      } catch (error) {
        ElMessage({
          massage:"",
          type:'error'
        })
      }
    }
    onMounted(() => {
      getvisitor();
      getTodoList();
      setTimeout(function () {
          router.push("/");
        }, 6000);
    });
    return {
      todoList,
      sign,
      state,
      onConfirm,
      // signBtn
      dialogVisible,
      showSign,
      handleClose
    }
  }
}
</script>

<style lang="less">
        .box-card{
        height:90%;
        width: 90%;
        overflow:auto;
      }
      .el-table .el-table__cell{
        text-align: center;
      }
</style>