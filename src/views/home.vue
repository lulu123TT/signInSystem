
<template>
  <div class="main">
    <div class="left">
      <el-button color="#9A0000" style="color: white" class="red_btn btn" @click="getAll">总人数:{{btnData.allUser}}</el-button>
      <el-button color="#9A0000" style="color: white" class="red_btn btn" @click="getStay">当前人数:{{btnData.nowUser}}</el-button>
      <el-button color="#9A0000" style="color: white" class="red_btn btn" @click="getLeave">离开人数:{{btnData.leaveUser}}</el-button>
      <el-button color="#9A0000" style="color: white" class="red_btn btn" @click="visitorIn">访客进入</el-button>
      <el-button color="#9A0000" style="color: white" class="red_btn btn" @click="visitorOut">访客离开</el-button>
      <el-button color="#9A0000" style="color: white" class="red_btn btn" @click="enterBack">后台管理</el-button>
      <!-- white_btn -->
    </div>
    <div class="right">
      <el-card class="box-card">
        <el-table 
        :data="tabledata" 
        style="width: 100%;" 
        max-height="680"
        :row-class-name="tableRowClassName"
        >
          <el-table-column label="序号" type="index" width="75"/> 
          <el-table-column prop="name" label="姓名"  width="100"/>
          <el-table-column prop="classGroup" label="课题组"/>
          <el-table-column prop="todo" label="事由" />
          <el-table-column prop="unitType" label="单位类型" width="120"/>
          <el-table-column prop="inTime" label="进入时间"   width="120"/>
          <el-table-column prop="outTime" label="离开时间"   width="120"/>
          <el-table-column prop="stayTime" label="时长/h"  width="100"></el-table-column>
          <el-table-column prop="userType" label="身份" width="140"/>
          <el-table-column prop="comment" label="备注"  />
        </el-table>
      </el-card>
        <div class="bottom">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pageNum"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="queryInfo.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            background>
        </el-pagination>
        </div>
    </div>
  </div>
</template>

<script>
import { getSignNum, getSignOutNum, getStayNum } from "@/api/home"
import { inject} from 'vue'
import { useRouter } from "vue-router";
import { getSignPerson, getSignOutPerson, getStayPerson} from "@/api/home"
import { reactive, toRefs } from '@vue/reactivity'
import {onBeforeUnmount, onMounted, ref} from "vue"
import { ElPagination, ElCard, ElTableColumn, ElTable, ElButton } from "element-plus"
import dayjs from "dayjs"
export default {
  components:{ElPagination, ElCard, ElTableColumn, ElTable,ElButton},
  setup() {
    const menuIndex = inject('name')
    const router = useRouter();
    const state = reactive({
      btnData:{
        allUser:0,
        leaveUser:0,
        nowUser:0
      },
      total:0,
      nowTime:'',
      //表格数据
      tabledata:[
      ],
      show:true,
      queryInfo:{
        pageNum:1,
        pageSize:10,
      },
      unitInfo:[],
      userType:[],
      tempClass:'',
      tableHeight:0,
      timer:null
    })
    
    const tableRowClassName = (row) => {
      if(row.row.outTime === '未签退') {
        return "warning-row"
      }
      if(row.rowIndex === 0) {
        return "first_row"
      }
      return '';
    }


    const getAll = async() => {
      state.nowTime = dayjs().format("YYYY-MM-DD")
      let params= {
        pageNum:state.queryInfo.pageNum,
        pageSize:state.queryInfo.pageSize,
        signLogDate:state.nowTime
      };
      try {
        const {data} = await getSignPerson(params);
        processData(data,1)
      }catch{
        console.log("get all person error")
      }
    };

    const getStay = async() => {
      try {
        const {data} = await getStayPerson(state.queryInfo);    
        processData(data,2)
      }catch{
        console.log("get stay person error")
      }
    };

    const getLeave = async() => {
      try {
        const {data} = await getSignOutPerson(state.queryInfo);
        processData(data,3)
      }catch{
        console.log("get leave person error")
      }
    };

    const processData =(data,params)=>{
        let temp = data.data.records
        for(let i = 0; i < temp.length; i++) {
          temp[i].inTime = dayjs(temp[i].inTime).format("HH:mm:ss")
          if(temp[i].outTime === null) {
            temp[i].outTime = "未签退"
          }else {
            temp[i].outTime = dayjs(temp[i].outTime).format("HH:mm:ss")
          }
        }
        state.tabledata = temp
        state.tabledata.type =params
        state.total = data.data.total
    }

    const processChange =()=>{
      if(state.tabledata.type === 1) {
        getAll();
      }else if(state.tabledata.type === 2) {
        getStay();
      }else if(state.tabledata.type === 3){
        getLeave();
      }
    }

    const handleSizeChange = async(newSize)=>{
      state.queryInfo.pageSize = newSize
      processChange();
      // await gettabledata();
    };
    const handleCurrentChange = async(newPage) => {
      state.queryInfo.pageNum = newPage
      processChange();
      // await gettabledata();
    };
    
    //获取总人数
    const getAllNum = async() => {
      try {
        const {data} = await getSignNum();
        state.btnData.allUser = data.data.total_num
      }catch{
        console.log("get sign num error")
      }
    };

    //获取当前在实验室人数
    const getstaynum = async() => {
      try {
        const {data} = await getStayNum();
        state.btnData.nowUser = data.data.total_signing_num
      }catch{
        console.log("get stay num error")
      }
    };

    //获取离开人数
    const getLeaveNum  = async() => {
      try {
        const {data} = await getSignOutNum();
        state.btnData.leaveUser = data.data.total_signOut_num
      }catch{
        console.log("get sign out num error")
      }
    };

    //路由跳转
    const direct = (path) => {
            router.push(path)
        }
    const visitorIn  = async() => {
      await direct("visitorin")
    };
    const visitorOut  = async() => {
       await direct("visitorout") 
    };
    const enterBack  = async() => {
      // router.push("/");
      window.location.href = "http://localhost:3003/#/login"
      // window.location.href = "http://192.168.1.102:8848/js-i18n/dist/"
      // this.$forceUpdate()
    };

    const getData = () => {
      getAllNum();
      getstaynum();
      getLeaveNum();
      getAll();
    };


    onMounted(() => {
      getData();
      //设置定时器
      state.timer = setInterval(getData, 60*60*1000)
    });
    onBeforeUnmount(() => {
        //销毁定时器
        clearInterval(state.timer);
    });

    return {
      getAll,
      getStay,
      getLeave,
      handleSizeChange,
      handleCurrentChange,
      ...toRefs(state),
      visitorIn,
      visitorOut,
      enterBack,
      tableRowClassName
    }
  }
}
</script>

<style lang="less" scope>
  .main{
    width: 98%;
    height:88%;
    display: flex;
    .left{
      width: 10%;
      display: flex;
      height:100%;
      flex-direction: column;
      justify-content:space-evenly;
      .btn{
        width: 85%;
        height: 7%;
        font-size: 1.0rem;
        margin: 0px;
        // border-radius: 10px;
        box-shadow: .3rem .3rem 1rem 0px rgba(0, 0, 0, 0.4);
      }
        .red_btn{
          box-shadow:inset -.0rem .7rem 1rem #e13737,
                   inset -.0rem -.7rem 1rem #e23939,
                   .6rem .8rem 1rem 0px rgba(0, 0, 0, 0.4);
        }
    }
    .right{
      width:90%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .box-card{
        height:95%;
        width:95%;
        // margin-left:4%; 
        // position:relative;
      }
		.bottom{
			width:100%;
			margin:5px;
			// align:center;
			display: flex;
			justify-content: center;
		}	
    }
  }
</style>>

//自定义element plus样式
<style>
  /* .el-pagination:{
	  justify-content: center;
		text-align: center; 
		margin-top: 10px;
	} */
  .warning-row {
      background-color: #fef0f0 !important;
   }

  /* .first_row{
    color:black;
  } */
  .el-table, .el-button, .el-form-item__label{
    font-size: 1.4rem !important;
    margin: 15px;
  }
  .el-card .el-button{
    width: 200px !important;
  }
  .el-checkbox{
    zoom:109% !important;
  }
  .el-form-item__content .el-input__inner, .el-checkbox__label {
    font-size: 1.3rem !important;
  }
  .el-table thead {
    color: #000000 !important;
    align-items: center;
    font-size:1.2rem !important;
  }
  .cell{
    text-align: center;
  }
</style>

