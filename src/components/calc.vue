<script setup lang="ts">
import { ref } from 'vue';
import { good, Song, type Score } from './types';
import aaaa from './A.vue'
import { useRouter } from "vue-router"

const router = useRouter()

let showBox = ref(false)
let showFlash = ref(false)

let allscore = ref(0)
let num = ref(0)
let perfact = ref(0)
let great = ref(0)
let ok = ref(0)
let miss = ref(0)
let combo = ref(0)
let score = ref('D')

let show = (lst: Score[], song: Song, f: number, nan: number) => {
  showBox.value = true

  allscore.value = f
  console.log(lst)
  lst.map(score => {
    switch (score.good) {
      case good.perfact:
        perfact.value++
        break
      case good.great:
        great.value++
        break
      case good.ok:
        ok.value++
        break
      case good.miss:
        miss.value++
        break
    }
    num.value += 1
  })
  combo.value = maxConsecutivePositiveNumbers(lst)

  score.value = 'D'
  if (miss.value / num.value < 0.3) score.value = 'C'
  if (miss.value / num.value < 0.2 && combo.value > 10) score.value = 'B'
  if (miss.value / num.value < 0.1 && combo.value > 10) score.value = 'A'
  if (miss.value < 10 && combo.value > 15) score.value = 'S'
  if (miss.value < 5 && combo.value > 15) score.value = 'SS'
  if (miss.value < 3 && combo.value > 20 && perfact.value / num.value > 0.7) score.value = 'SSS'
  // if (num.value < 30) score.value = 'D'
  setTimeout(() => {
    showFlash.value = true
  }, 1000)

  // 设置记录
  let game = {
    time: new Date().getTime(),
    score: allscore.value,
    combo: combo.value,
    miss: miss.value,
    perfact: perfact.value,
    num: num.value,
    great: great.value,
    ok: ok.value,
    len: lst.reduce((a, b) => a + b.len, 0),
    calc: score.value,
    songName: song.name,
    songNan: song.nan[nan].level
  }
  let history = JSON.parse(localStorage.getItem('history') || '[]')
  history.push(game)
  localStorage.setItem('history', JSON.stringify(history))

  let betterHistory = JSON.parse(localStorage.getItem('betterHistory') || '[]')
  let index = betterHistory.findIndex((v: any) => v.songNan == nan && v.songName == song.name)
  if (index == -1) {
    betterHistory.push(game)
    localStorage.setItem('betterHistory', JSON.stringify(betterHistory))
  } else {
    betterHistory.splice(index, 1, game)
  }
}

function maxConsecutivePositiveNumbers(arr: Score[]): number {
  let maxCount = 0;
  let currentCount = 0;

  for (let i = 0; i < arr.length; i++) {
    if (arr[i].good != good.miss) {
      currentCount++;
      maxCount = Math.max(maxCount, currentCount);
    } else {
      currentCount = 0;
    }
  }

  return maxCount;
}
function returnBtn() {
  router.go(-1)
}
defineExpose({
  show
})
</script>

<template>
  <Transition name="scoreBox">
    <div class="goodBox absolute top-0 left-0 w-[100vw] h-[100vh] " v-show="showBox" ref="flash">
      <div class="good">
        <div class="zongfen">总分：{{ allscore }}</div>
        <div>一共：{{ num }}</div>
        <div>perfact: {{ perfact }}</div>
        <div>great: {{ great }}</div>
        <div>ok: {{ ok }}</div>
        <div>miss: {{ miss }}</div>
        <div>最大combo: {{ combo }}</div>
        <Transition name="scoreA">
          <div v-show="showFlash" class="absolute top-[30%] left-[60%]">
            <aaaa class="" :value="score" :size="200"></aaaa>
          </div>
        </Transition>
      </div>
      <div class="returnBtn" @click="returnBtn">返回</div>

    </div>
  </Transition>

</template>

<style scoped>
.returnBtn {
  padding: 10px;
  border: solid 1px #fff;
  margin-top: 50px;
  width: 300px;
  margin-left: auto;
  margin-right: auto;
  cursor: pointer;
}

.goodBox {
  padding: 200px;
  font-size: 30px;
  color: #fff;
  z-index: 9999;
  background: #0000008e;
  text-align: center;
  /* font-family: 'COLLEGEFREAKS'; */
}

.zongfen {
  font-size: 60px;
}

.good {
  display: inline-block;
  text-align: left;
}

.good>div {
  text-shadow: 0px 5px 3px black;
}

.scoreBox-enter-active {
  transition: opacity 1s ease;
}

.scoreBox-enter-from {
  opacity: 0;
}

.scoreBox-enter-to {
  opacity: 1;
}

.scoreA-enter-active {
  transition: transform 0.2s ease;
}

.scoreA-enter-from {
  transform: scale(60%);
}

.scoreA-enter-to {
  transform: scale(100%);
}
</style>
