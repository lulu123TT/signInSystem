<template>
  <div id="app">
    
    <el-config-provider  size="default" :locale="locale" >
    <el-container style="height:100%">
      <el-header style="height:180px; padding:0">
        <Header/>
      </el-header>
      <el-main style="height:92%; display:flex; align-items:center;justify-content:center">
        <router-view style="height:100%"></router-view>
      </el-main>
      <el-footer style="height:7%; padding:0">
        <Footer></Footer>
      </el-footer>
    </el-container>
    </el-config-provider>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import Header  from "./components/Header/index.vue"
import Footer  from "./components/Footer/index.vue"
import { ElContainer, ElHeader, ElMain, ElFooter,ElConfigProvider } from 'element-plus'
// import screenfull from "screenfull" 
import screenfull from 'screenfull/dist/screenfull'
import zh from 'element-plus/lib/locale/lang/zh-cn'

export default {
  name: 'App',
  components: {
    // HelloWorld,s
    Header,
    Footer,ElContainer, ElHeader, ElMain, ElFooter,ElConfigProvider
  },
  setup() {
    function toggleFullScreen() {
      if (screenfull.isEnabled) {
        screenfull.toggle()
      }
    }
    toggleFullScreen()
    return{
      locale:zh
    }
  }
}
</script>

<style lang="less">
html,
body,
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  // font-size: 110%;
  min-width: 900px;
  min-height: 800px;
}
</style>
