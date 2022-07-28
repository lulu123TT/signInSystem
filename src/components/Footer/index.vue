<template>
  <div class="footer">
         <button :class="[{'check': activeIndex ==1},{'item':activeIndex != 1}]" id="item1" @click="goHome" >
          <span>首页</span>
        </button>
        <button :class="[{'check':activeIndex ==2},{'item':activeIndex != 2}]" id="item2" @click="goEnter"  >
          <span>进入登记</span>
        </button>
        <button :class="[{'check':activeIndex ==3},{'item':activeIndex != 3}]" id="item3" @click="goOut"  >
          <span>离开登记</span>
        </button>
  </div>
</template>

<script>
import { ref } from '@vue/reactivity'
import { useRouter} from 'vue-router'
import { useStore } from "vuex";
import { getRecoWay } from '@/api/home.js'
import {onMounted,watch} from "vue"
import { ElMessage } from 'element-plus'
export default {
    setup() {
        
    const store = useStore();
        const activeIndex = ref(1)
        const router = useRouter()
        const hasRouter = ref(true)
        const enterWay = ref("")
        const outWay = ref("")
        const flag = ref(1)
        watch( 
            store.state.footer,
            (val)=> {
                activeIndex.value = val.menuIndex
            }
        );

        const getWay = async()=>{
            try {
            const {data} = await getRecoWay();
            if(data.data.active_mode === 1) {
                enterWay.value = "/fingerin"
                outWay.value = "/fingerout"
            }
            else if(data.data.active_mode === 0) {
                enterWay.value = "/facein"
                outWay.value = "/faceout"
            }
            } catch (error) {
                ElMessage({
                    message: '系统异常，请刷新后重试',
                    type: 'warning',
                })
                console.log(error)
            }
        }
        const direct = (path) => {
            router.push(path)
        }
        const goHome = ()=>{
            store.commit("SET_INDEX",1)
            direct("/home") 
        }
        const goEnter = ()=>{
            store.commit("SET_INDEX",2)  
            direct(enterWay.value)    
        }
        const goOut = ()=>{
            store.commit("SET_INDEX", 3)   
            direct(outWay.value)    
        }
        onMounted(() => {
            getWay()
        })
        return {
            direct,activeIndex,hasRouter,enterWay,outWay,flag,
            goHome,goEnter,goOut
        }
    }
}
</script>

<style lang="less">
.footer{
    width:100%;
    height: 100%;
    background-color:#9A0000;
    display: flex;
    bottom:0px;
    justify-content: space-evenly;
    align-items: center;

    .item{
        width:33.1%;  
        height:100%;
        border:0px;
        span{
            font-size: 1.6rem;
        }
        color:white;

        background-color: #9A0000;
        box-shadow:inset .2rem .8rem 1rem #e13737, 
                   inset -.2rem -.8rem 1rem #e23939;
    }
    .check{
        width:33.3%;  
        height:100%;
        border:0px;
        span{
            font-size: 1.6rem;
        }
        color:white;
        background-color: #9A0000;
        box-shadow:inset .0rem .8rem 1rem #840303, 
                   inset -.0rem -.8rem 1rem #800d0d;
    }
    .item:active{
        background: #9A0000;
    }
}
img{
    height:30px;width:30px;
}
.el-menu{
    height: 100%;
}
.el-menu-item{
    width:30%;
    margin-right: 4px !important;
}
.el-menu--horizontal {
    border-bottom-width: 0px!important;

}
</style>