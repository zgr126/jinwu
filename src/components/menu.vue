<template>
  <div class="waveWrapper waveAnimation">
    <div class="waveWrapperInner bgTop">
      <div class="wave waveTop" style="background-image: url('http://front-end-noobs.com/jecko/img/wave-top.png')"></div>
    </div>
    <div class="waveWrapperInner bgMiddle">
      <div class="wave waveMiddle" style="background-image: url('http://front-end-noobs.com/jecko/img/wave-mid.png')"></div>
    </div>
    <div class="waveWrapperInner bgBottom">
      <div class="wave waveBottom" style="background-image: url('http://front-end-noobs.com/jecko/img/wave-bot.png')"></div>
    </div>
  </div>
  <div v-if="!selectOne" class="absolute top-0 left-0 h-full w-full z-[100]">
    <div class="box h-full">
      <div v-for="(song,index) in songLst" :key="index" class="song" @click="selectOneH(song)">
        <img :src="song.imgUrl" :alt="song.name" class="">
        <div class="">{{ song.name }}</div>
        
      </div>
    </div>
  </div>
  <div v-if="selectOne" class="one absolute top-0 left-0 h-full w-full z-[101]">
    <div @click="cancel" class="absolute top-10px left-10px top-[10px] border">返回</div>
    <img class="oneImg" :src="selectOne.imgUrl" :alt="selectOne.name" >
    <div class="labelBox absolute top-[100px] left-[430px]">
      <div class="oneL">{{ selectOne.name }}</div>
    </div>
    <!-- <div class="videoBox absolute right-0 top-0 w-[50%] h-[50%]">
      <video id="video" :src="selectOne.url" muted></video>
    </div> -->
    <div class="nanBox flex">
      <div v-for="(nan , _index) in selectOne.nan">
        <div v-if="_index == 0" class="nan1" @click="start(_index)">{{nan.level}}</div>
        <div v-if="_index == 1" class="nan2" @click="start(_index)">{{nan.level}}</div>
        <div v-if="_index == 2" class="nan3" @click="start(_index)">{{nan.level}}</div>
        <div v-if="_index == 3" class="nan4" @click="start(_index)">EX</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { nextTick, ref } from 'vue';
import { Song, Level } from './types';
import songs from './songs.json'

const router = useRouter()

let songLst = ref<Song[]>([])
let selectOne = ref<Song|null>(null)
let makeNan = (song: Song)=>{

  let bpm  = song.bpm
  if (bpm>120)bpm /=2
  if (bpm<60)bpm *=2
  // 84 就为 60/84 = 0.71 ，0.71*2 = 1.42 一周期
  bpm /=2
  // bpm = 60
  // bpm目前范围30-60
  let simple = new Level()
  simple.bpm = bpm
  let d = 6/(60/bpm)
  let m = Math.floor(d)
  simple.randomSize.push(m-1)
  simple.randomSize.push(m+1>9?9:m+1)
  simple.level = Math.round((m-3)/10*7)+3

  let mid = new Level()
  mid.bpm = bpm
  let md = 9/(60/bpm)
  let mm = Math.floor(md)
  mid.randomSize.push(mm-1)
  mid.randomSize.push(mm+1>9?9:mm+1)
  mid.level = Math.round((mm-3)/10*7)+3

  let hard = new Level()
  hard.bpm = bpm*1.5
  let hd = (12/1.5)/(60/hard.bpm)
  let hm = Math.floor(hd)
  hard.randomSize.push(hm-1)
  hard.randomSize.push(hm+1>9?9:hm+1)
  hard.level = Math.round((hd-3)/10*7)+3

  let ex = new Level()
  ex.bpm = bpm*1.5
  let ed = (14/1.5)/(60/ex.bpm)
  let em = Math.floor(ed)
  ex.randomSize.push(em-1)
  ex.randomSize.push(em+1>9?9:em+1)
  ex.level = Math.round((ed-3)/10*7)+3
  // simple.randomSize = 
  
  // let l = new Level()
  // l.level = 3
  // l.Lst = []

  // let l = new Level()
  // l.level = 3
  // l.Lst = []

  // let l = new Level()
  // l.level = 3
  // l.Lst = []

  song.nan.push(
    simple,mid,hard,ex
  )
}

let start = (index:number)=>{
  localStorage.setItem('song', JSON.stringify(selectOne.value))
  router.push({
    name: 'start',
    query:{
      nan: index
    }
  })
}
let selectOneH = (song:Song)=>{
  selectOne.value = song
  // nextTick(()=>{
  //   let video = document.getElementById('video') as HTMLVideoElement
  //   video.currentTime = 10
  //   video.play()
  // })
}
songs.song.map(e=>{
  let value = new Song()
  value.name = e.name
  value.highTime = e.highTime
  value.url = e.url
  value.imgUrl = e.imgUrl
  value.time = e.time
  value.startTime = e.startTime
  value.endTime = e.endTime
  value.bpm = e.bpm
  makeNan(value)
  songLst.value.push(value)
})
selectOne.value = songLst.value[0]

let cancel = ()=>{
  selectOne.value = null
}
</script>

<style scoped>
.nanBox{
  padding-top: 30px;
}
.nanBox >div div{
  height: 50px;
  width: 200px;
  border: solid 1px #666;
  margin: 10px;
  text-align: center;
  cursor: pointer;
}
.nan1{
  background: #b1eea2;
}
.nan2{
  background: #f7e7b1;
}
.nan3{
  background: #f7b1b1;
}
.nan4{
  background: #b1b1ee;
}
.one{
  padding: 100px;
  font-size: 30px;
}
.one .oneL{
  margin-bottom: 10px;
}
.one .oneImg{
  max-height: 300px;
  max-width: 300px;
  border: solid 1px #666;
}


.box{
  padding: 100px;
  overflow: auto;
  flex-wrap: wrap;
  justify-content: space-between;
  align-content: flex-start;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
  justify-items: start;
  text-align: center;
  
}
.box >div{
  cursor: pointer;
}
.box >div:hover{
  box-shadow: 3px 3px 3px #333;
}
.song{
  width: 200px;
  height: 250px;
  border: solid 1px #333;
  margin: 10px;
  background: #ffffff;
}















@keyframes move_wave {
    0% {
        transform: translateX(0) translateZ(0) scaleY(1)
    }
    50% {
        transform: translateX(-25%) translateZ(0) scaleY(0.55)
    }
    100% {
        transform: translateX(-50%) translateZ(0) scaleY(1)
    }
}
.waveWrapper {
    overflow: hidden;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    margin: auto;
}
.waveWrapperInner {
    position: absolute;
    width: 100%;
    overflow: hidden;
    height: 100%;
    bottom: -1px;
    background-image: linear-gradient(to top, #dfdfdf 20%, #ffffff 80%);
}
.bgTop {
    z-index: 15;
    opacity: 0.5;
}
.bgMiddle {
    z-index: 10;
    opacity: 0.75;
}
.bgBottom {
    z-index: 5;
}
.wave {
    position: absolute;
    left: 0;
    width: 200%;
    height: 100%;
    background-repeat: repeat no-repeat;
    background-position: 0 bottom;
    transform-origin: center bottom;
}
.waveTop {
    background-size: 50% 100px;
}
.waveAnimation .waveTop {
  animation: move-wave 3s;
   -webkit-animation: move-wave 3s;
   -webkit-animation-delay: 1s;
   animation-delay: 1s;
}
.waveMiddle {
    background-size: 50% 120px;
}
.waveAnimation .waveMiddle {
    animation: move_wave 10s linear infinite;
}
.waveBottom {
    background-size: 50% 100px;
}
.waveAnimation .waveBottom {
    animation: move_wave 15s linear infinite;
}
</style>