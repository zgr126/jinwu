<script setup lang="ts">
import { ref } from 'vue';
let show = ref(false)
let dom = ref<HTMLElement | null>(null);
let showFlash = ref(false)
let flash = ref<HTMLElement | null>(null);
const emit = defineEmits(['stop']);
class Ball {
  interval: number = 0
  startTime: number = 0
  ani: number = 0
  willEnd = false
  constructor(start: number, interval: number) {
    this.interval = interval
    this.startTime = start
  }
  setValue(start: number, interval: number) {
    console.log(interval)
    this.interval = interval
    this.startTime = Number(document.timeline.currentTime?.toString())//start
  }
  clear() {
    show.value = false
    cancelAnimationFrame(this.ani)
  }
  startRun = () => {
    this.ani = requestAnimationFrame((time: number) => {
      let left = ((time - this.startTime) % this.interval) / this.interval
      if (dom.value) {
        dom.value.style.left = `calc(${left * 100}% - 18px)`
      }
      this.startRun()
      if (this.willEnd) {
        this.willEnd = false
        setTimeout(() => {
          this.clear()
          emit('stop')
        }, this.interval - ((time - this.startTime) % this.interval))
      }
    })
  }
  hide() {
    show.value = false
  }
  show() {
    show.value = true
  }
  getStatus(): number {
    let v = ((Number(document.timeline.currentTime?.toString()) - this.startTime) % this.interval) / this.interval;
    return v
  }
  showFlash() {
    if (flash.value) {
      flash.value.style.left = `calc(${this.getStatus() * 100}% - 18px)`
    }

    showFlash.value = true
    setTimeout(() => {
      showFlash.value = false
    }, 200)
  }
}
let ball = new Ball(Date.now(), 1000)

// let start = (time: number)=>{
//   show.value = true
//   startTime = Number(document.timeline.currentTime?.toString())
//   liveTime = time
//   startRun()
// }
// let startRun = ()=>{
//   ani = requestAnimationFrame((time: number)=>{
//     let interval = (time - startTime)
//     if (interval> liveTime){
//       return
//     }else{
//       let left = interval/liveTime;
//       if (dom.value){
//         dom.value.style.left = `calc(${left*100}% - 18px)`
//       }
//       if (left>0.99){
//         show.value = false
//         stop()
//         return
//       }
//       startRun()
//     }
//   })
// }
// let getStatus=():number=>{
//   return (Number(document.timeline.currentTime?.toString()) - startTime)/liveTime;
// }
// let stop=()=>{
//   if (show.value){
//     let left = getStatus()
//     showFlash.value = true
//     nextTick(()=>{
//       if (flash.value){
//         flash.value.style.left = `calc(${left*100}% - 18px)`
//         console.log(left)

//       }
//       setTimeout(()=>{
//         showFlash.value = false
//       },200)
//     })


//   }
//   emit('stop')
//   show.value = false
//   cancelAnimationFrame(ani)
// }
defineExpose({
  ball
})
</script>

<template>
  <div ref="dom" v-show="show" class="ball h-[18px] w-[18px] absolute left-0 rounded-full border"></div>

  <Transition>
    <div class="flash h-[18px] w-[18px] absolute left-0 rounded-full border" v-show="showFlash" ref="flash"></div>
  </Transition>

</template>

<style scoped>
.ball {
  background: linear-gradient(to bottom, #ff8513, #ff51009c);
  z-index: 1;
}

.read-the-docs {
  color: #888;
}

.v-enter-active,
.v-leave-active {
  transition: height 0.2s ease, width 0.2s ease, opacity 0.2s ease-out, color 0.2s ease;
}

.v-enter-from {
  opacity: 1 !important;
  height: 25px;
  width: 20px;
}

.v-enter-to {
  opacity: 0;
  height: 200px;
  width: 0px;
  background: #fff;
  transform: translateX(10px)
}

.flash {
  opacity: 0;
  background: #ffe600;
  /* transform: rotate(45deg); */
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto;
}
</style>
