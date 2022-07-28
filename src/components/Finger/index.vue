<template>
<div class="scan">
  <div :class="[{'finger': flag == 0},{'pause': flag == 1}]">
      
  </div>
  <p>{{state}}</p>
</div>
</template>

<script>
export default {
  props: {
    flag: {
      type: Object
    },
    state: {
      type: Object
    }
  },
  setup() {
  }
}
</script>

<style lang="less" scoped>
.scan{
  height: 400px;
  width:400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items:center;
   .finger{
      position: relative;
      height: 250px;
      width:250px;
      background: url(../../assets/finger_a.png);
      // background: url(../../assets/right.png);
      background-size:250px;
    }
    .finger::before{
      content:'';
      position:absolute;
      top:0px;
      left: 0px;
      width:100%;
      height: 100%;
      background: url(../../assets/finger_c.png);
      background-size:250px;
      animation: animate 4s infinite;
      // animation-play-state: paused;
      // animation-delay:2s;
    }
    @keyframes animate{
      0%,100%
      {
        height: 0%;
      }
      50%
      {
        height: 100%;
      }
    }
    .finger::after{
      content:'';
      position: absolute;
      top:0px;
      left: 0px;
      width:100%;
      // height: 6px;
      background-color: #9A0000;
      border-radius: 6px;
      filter:drop-shadow(0 0 20px #9A0000) drop-shadow(0 0 20px #9A0000);
      animation: animateb 4s infinite;
      // animation-play-state: paused;
    }
    @keyframes animateb{
      0%,100%
      {
        top: 0%;
      }
      50%
      {
        top: 100%;
      }
    }
    p{
      font-size:1.5em;
      letter-spacing: 3px;
      // top:70px;
      color:#9A0000;
      filter:drop-shadow(0 0 20px red) drop-shadow(0 0 60px red);
    }
    .pause {
      position: relative;
      height: 250px;
      width:250px;
      background: url(../../assets/right.png);
      background-size:250px;
    }
} 

</style>