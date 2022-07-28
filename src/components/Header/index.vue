<template>
  <div class="header">
      <div class="head1">
          <div class="left">
              <img src="../../assets/logo.jpg" alt="logo">
          </div>
          <div class="right">
              <!-- <i :class="nowIcon" >width="30" height="30"</i> -->
            <svg xmlns="http://www.w3.org/2000/svg"   :class="nowIcon" viewBox="0 0 16 16">
            <path d="M4.995 1.777a.516.516 0 0 0 .503.404.535.535 0 0 0 .112-.012.517.517 0 0 0 .392-.616L5.746.403A.516.516 0 0 0 4.74.627zM1.273 3.535l.994.633a.516.516 0 0 0 .555-.87l-.995-.633a.516.516 0 0 0-.554.87zM.878 8.043l1.15-.256a.516.516 0 1 0-.223-1.008l-1.15.256a.516.516 0 0 0 .111 1.02.535.535 0 0 0 .112-.012zm10.238-2.28a.535.535 0 0 0 .112-.012l1.15-.256a.516.516 0 1 0-.224-1.008l-1.15.256a.516.516 0 0 0 .112 1.02zM8.772 2.728a.516.516 0 0 0 .712-.158l.633-.994a.516.516 0 0 0-.87-.554l-.633.994a.516.516 0 0 0 .158.712zM3.07 7.032a3.506 3.506 0 0 0 .33.87 3.129 3.129 0 0 0 .909-.486 2.453 2.453 0 0 1-.233-.608 2.504 2.504 0 0 1 1.9-2.988 2.5 2.5 0 0 1 2.988 1.9c.003.013.002.026.005.038a5.42 5.42 0 0 1 1.063.25 3.509 3.509 0 0 0-.061-.512 3.535 3.535 0 1 0-6.902 1.536z"/>
            <path d="M12.715 8.48a3.236 3.236 0 0 0-.41.04 4.824 4.824 0 0 0-8.086 0 3.234 3.234 0 0 0-.409-.04 3.285 3.285 0 1 0 1.283 6.31 4.756 4.756 0 0 0 6.339 0 3.286 3.286 0 1 0 1.283-6.31zm0 5.539a2.238 2.238 0 0 1-.88-.179 1.032 1.032 0 0 0-1.083.173 3.724 3.724 0 0 1-4.98 0 1.032 1.032 0 0 0-1.082-.173 2.254 2.254 0 1 1-.88-4.329 1.265 1.265 0 0 1 .175.02l.105.014a1.031 1.031 0 0 0 .992-.459 3.792 3.792 0 0 1 6.36 0 1.031 1.031 0 0 0 .992.459l.105-.014a1.266 1.266 0 0 1 .176-.02 2.254 2.254 0 1 1 0 4.508z"/>
            </svg>
              <!-- <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/qweather-icons@1.1.0/font/qweather-icons.css"> -->
              <span class="weather">{{nowTemp}}℃</span>
            <!-- <div id="he-plugin-simple"></div> -->
              <div class="time">
                  <span class="moment">{{nowMoment}}</span>
                  <div class="detail">
                      <div class="week">{{nowWeek}}</div>
                      <div class="date">{{nowYear}}</div>
                  </div>
              </div>
          </div>
      </div>
      <div class="head2">
          <span>屏障环境动物实验室人员进出登记系统
            <!-- <div style="width:90%; height:100%; ">屏障环境动物实验室人员进出登记系统</div> -->
          </span>
      </div>
  </div>
</template>

<script>
window.WIDGET = {
  "CONFIG": {
    "modules": "02",
    "background": "5",
    "tmpColor": "000000",
    "tmpSize": "25",
    "cityColor": "FFFFFF",
    "citySize": "16",
    "aqiColor": "FFFFFF",
    "aqiSize": "16",
    "weatherIconSize": "24",
    "alertIconSize": "18",
    "padding": "10px 10px 10px 10px",
    "shadow": "0",
    "language": "auto",
    "fixed": "false",
    "vertical": "top",
    "horizontal": "left",
    "key": "09eb54e66aab4cc3b783f075cb101cc0",
  }
}
import { defineComponent, onBeforeUnmount, onMounted,reactive,ref} from 'vue'
// import { NowTime } from "@/utils/date.js";
import dayjs from "dayjs";
import http from "@/utils/http";
export default defineComponent({
    // name:'Header'
    setup() {
        const state = reactive({
            timer:null,
            weatherr:null
        })
        // const nowtime = ref("");
        // //显示当前时间（年月日时分秒）
        const nowMoment = ref("")
        const nowWeek = ref("")
        // const ch_week = ref("") 
        const nowYear = ref("")
        const nowTemp = ref("")
        const nowIcon = ref("")
        const getWeather = async () => {
            try{
                const {data} = await http.get(`https://devapi.qweather.com/v7/weather/now?key=7c5c4230122545479483bd5b23d17a29&location=101280601`)
                console.log("weather data")
                console.log(data)
                nowTemp.value = data.now.temp
                nowIcon.value = "qi-"+ data.now.icon
                console.log(nowIcon)
            }catch{
                console.log("get weather error")
            }
            console.log("更新weather")
        }
        const weather = async () => {
            const s = document.createElement("script");
            s.type = "text/javascript";
            s.src =
                "https://widget.qweather.net/simple/static/js/he-simple-common.js?v=2.0";
            
            document.body.appendChild(s);
        }
        const ch_week = ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"]
        const nowTimes = () => {
            nowMoment.value = dayjs().format('HH:mm');
            nowYear.value = dayjs().format('YYYY/MM/DD');
            nowWeek.value = ch_week[dayjs().day()]
        };
        onMounted(() => {
            weather();
            nowTimes();
            getWeather();
            //设置定时器
            state.timer = setInterval(nowTimes, 60000);
            // 60 * 60000
            state.weatherr = setInterval(getWeather, 60*60*1000);
        });
        onBeforeUnmount(() => {
            //销毁定时器
            clearInterval(state.timer);
            clearInterval(state.weatherr);
        });
        // getWeather();
        return {
            nowMoment,nowYear,nowWeek,nowTemp,nowIcon
        }
    }
})
</script>

<style lang="less" scope>
    .header {
        width:100%;
        height:100%;
        display: flex;
        flex-direction: column;
        .head1{
            width:100%;
            height: 58%;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            .left{
                height:100%;
                img{
                    float: left;
                    height:100%;
                    width:100%;
                }
            }
            .right{
                display: flex;
                align-items:center;
                flex-direction: row-reverse;
                .time{
                    height: 100%;
                    display: flex;
                    flex-direction: row;
                    align-items:center;
                    .moment{
                        font-size:30px;
                        font-weight: 100;
                        margin-right: 5px;
                    }
                    margin-right:15px;
                }
                .weather{
                    font-size:150%;
                    margin-right:5px;
                }
                svg{
                    width: 10%;
                    height: 50%;
                    margin-right:10px;
                }
            }
        }
        .head2{
            height: 42%;
            width:100%;
            background-color: rgba(154, 0, 0, 100);
            box-shadow: 0px 0px 10px rgba(154, 0, 0, 100);
            color:white;
            display: flex;
            justify-content: center;
            span{
                font-size:2rem;
                height:100%;
                display: flex;
                align-items: center;
            }
        }
    }
</style>