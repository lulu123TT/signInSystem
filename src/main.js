import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css' //!!!

// 引入音频文件
// import audio from './assets/success.mp3'

// 注册播放音频事件到Vue实例上
// Vue.prototype
const app = createApp(App)
    // app.use(globalRegister)
app.config.globalProperties.$ELEMENT = {
    size: 'large'
}
app.provide("menuIndex", "1")
app.use(router).use(store).mount('#app')
    // .use(ElementPlus)
    // app.config.globalProperties.playAudio = () => {
    //     let buttonAudio = document.getElementById('eventAudio');
    //     buttonAudio.setAttribute('src', audio)
    //     buttonAudio.play()
    // }