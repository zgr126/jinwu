<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import ball from './ball.vue'
import showGood from './showGood.vue';
import { useRoute, } from "vue-router";
import { good, Score, type Song } from './types';
import score from './score.vue';
import * as seedrandom from "seedrandom"
import calc from './calc.vue'

const route = useRoute()
let nan = route.query.nan as unknown as number
defineProps<{ msg: string }>()

let src = ref('/下雨天.mp4')
let _video = ref()
let video = _video.value as HTMLVideoElement
let _ball = ref<InstanceType<typeof ball> | null>(null);
let _showGood = ref<InstanceType<typeof showGood> | null>(null);
let _score = ref<InstanceType<typeof score> | null>(null);
let _calc = ref<InstanceType<typeof calc> | null>(null);
onMounted(() => {
  let _song = localStorage.getItem('song') as string
  let song = JSON.parse(_song) as Song
  console.log(song)
  console.log(song.nan[nan])
  src.value = song.url
  video.src = song.url
  video.addEventListener('loadeddata', () => {

    game.begin(song)
    game.gameTime = Number(document.timeline.currentTime?.toString())
    video.play()
  })
})
onBeforeUnmount(() => {
  game.closeAll()
  game.clear()
})
// setTimeout(()=>{
//   video.pause()
// },200)


class Game {
  startTime: number = Number(document.timeline.currentTime?.toString())
  nowForm = ref<number[]>([])
  checkIndex = ref<number>(0)
  nan = ref<number>(0)
  scoreLst: Score[] = []
  song: Song | null = null
  playTimeout: number = 0
  ballTimeout: number = 0
  playInterval: number = 0
  endTimeout: number = 0
  show = ref(false)
  rng: seedrandom.PRNG | null = null
  willEnd: boolean = false
  gameTime: number = 0 // 游戏时间
  timeoutLst: number[] = []
  constructor() {
    this.nowForm.value = []

  }
  setNow(length: number) {
    this.checkIndex.value = 0
    let nowLst = Array.from({ length }, () => Math.floor(Math.random() * 4))
    console.log(nowLst)
    this.nowForm.value = nowLst
  }
  newGroup() {
    // if (_ball.value){
    //   _ball.value.start(this.song?.rpm as number)
    // }
    let level = this.song?.nan[nan]
    let ll = 1
    if (level && this.rng) {
      ll = this.rng() * (level?.randomSize[1] - level?.randomSize[0] + 1) + level?.randomSize[0]
    }
    this.setNow(ll)
    this.ballTimeout = setTimeout(() => {
      if (this.nowForm.value.length !== 0) {
        _showGood.value?.show(good.miss, this.scoreLst)
        this.scoreLst.push(new Score(0, good.miss, this.nowForm.value.length))
      }
      this.clearNow()
    }, this.getBpmTime() * 1.2)
  }
  playAudio(str: string) {
    switch (str) {
      case 's':
        str = '/success.mp3'
        break
      case 'c':
        str = '/click.mp3'
        break
      case 'e':
        str = '/error.mp3'
        break
      case 'm':
        str = '/error.mp3'
        break
    }
    let audio = new Audio()
    audio.src = str
    audio.addEventListener('ended', function () {
      audio.src = ''
      audio.load();   // 重新加载元素，以释放资源
      audio.remove(); // 如果音频元素被添加到了DOM中，从DOM中移除
    });
    audio.play()
  }
  clearNow() {

    this.nowForm.value = []
    this.checkIndex.value = 0
  }
  checkArrow(id: number): number {
    if (this.nowForm.value.length <= this.checkIndex.value) {
      return 0
    }
    if (this.nowForm.value[this.checkIndex.value] === id) {
      console.log('ok')
      this.checkIndex.value++
      return 1
    } else {
      this.playAudio('e')
      console.log('not ok')
      console.log(this.nowForm.value[this.checkIndex.value], id)
      this.checkIndex.value = 0
    }
    return -1
  }
  calcScore(int: number | undefined) {
    if (int === undefined) {
      return good.miss
    }
    if (int < 0.9 && int > 0.7) {
      return good.perfact
    }
    if (int < 9.5 && int > 0.5) {
      return good.great
    }
    if (int < 1 && int > 0) {
      return good.ok
    }
    return good.miss
  }
  score() {
    if (this.nowForm.value.length == 0) {
      return
    }
    // 完成
    if (this.nowForm.value.length <= this.checkIndex.value) {
      let value = _ball.value?.ball.getStatus()
      _ball.value?.ball.showFlash()


      if (value) {
        let g = this.calcScore(value)
        this.scoreLst.push(new Score(value, g, this.nowForm.value.length))
        _showGood.value?.show(g, this.scoreLst)
        _score.value?.show(this.scoreLst)
      }
      this.clearNow()
      this.playAudio('s')
    }
  }
  checkKey(e: KeyboardEvent) {
    this.playAudio('c')
    switch (e.key) {
      case 'ArrowLeft':
        this.checkArrow(2)
        break
      case 'ArrowRight':
        this.checkArrow(0)
        break
      case 'ArrowUp':
        this.checkArrow(3)
        break
      case 'ArrowDown':
        this.checkArrow(1)
        break
      case ' ':
        this.score()
        break
    }
  }
  start() {

    this.newGroup()
    this.playInterval = setInterval(() => {
      if (this.willEnd) {
        this.willEnd = false
        this.stop()
        return
      }
      this.newGroup()
    }, this.getBpmTime() * 2)
  }
  getBpmTime() {
    let level = this.song?.nan[nan]
    if (level) {
      return 60 / level.bpm * 1000
    }
    return 1000
  }

  stop() {
    console.log('stop')
    if (_ball.value) {
      _ball.value.ball.willEnd = true
    }

    clearInterval(this.playInterval)
    clearTimeout(this.playTimeout)
    clearTimeout(this.ballTimeout)
    clearTimeout(this.endTimeout)
    setTimeout(() => {
      this.show.value = false
      if (this.song) {
        let time = this.song?.time - this.song?.endTime
        if (time > 5 * 1000) time = 5000
        setTimeout(() => {
          this.closeAll()
        }, time)
      }

    }, this.getBpmTime() + 1000)
  }
  //  清场结算
  closeAll() {
    this.timeoutLst.map(e => {
      clearTimeout(e)
    })
    if (!video.paused) {
      video.pause()
      _score.value?.hide()
      let Score = _score.value?.getScore()
      _calc.value?.show(this.scoreLst, this.song as Song, Score as number, nan)
    }
  }
  clear() {
    console.log('clear')
    if (_ball.value) {
      _ball.value.ball.willEnd = true
    }
    clearInterval(this.playInterval)
    clearTimeout(this.playTimeout)
    clearTimeout(this.ballTimeout)
    clearTimeout(this.endTimeout)
    console.log('clear over')
  }
  setpStop() {
    if (_ball.value) {
      _ball.value.ball.willEnd = true
    }
    clearInterval(this.playInterval)
    clearTimeout(this.playTimeout)
    setTimeout(() => {
      this.show.value = false
    }, this.getBpmTime() + 1000)
  }
  play(song: Song, isFirst: boolean) {
    this.startTime = Number(document.timeline.currentTime?.toString())
    this.song = song
    // 使用示例
    const seed = this.song.name + this.song.startTime + this.song.bpm + this.song.endTime;
    this.rng = seedrandom.alea(seed);

    this.playTimeout = setTimeout(() => {
      this.playTimeout = setTimeout(() => {
        _ball.value?.ball.setValue(song.startTime, this.getBpmTime())
        _ball.value?.ball.startRun()
        _ball.value?.ball.show()
        this.playTimeout = setTimeout(() => {
          this.start()
        }, this.getBpmTime() * 0.8)
      }, 1001)
      console.log('start')
      console.log(this.song?.name)
      console.log('bpm:', this.song?.bpm, ' time:', this.getBpmTime())

      this.show.value = true
    }, isFirst ? song.startTime - this.getBpmTime() * 1.8 - 1001 : 0)
    // song.startTime*1000-song.rpm/10*2

  }
  begin(song: Song) {
    this.play(song, true)
    console.log('play')
    song.stepTime.map((item, index) => {
      let v = 0
      if (index % 2 == 1) {
        v = setTimeout(() => {
          this.play(song, false)
          console.log('play')
        }, item - this.getBpmTime() * 1.8 - 1001)

      } else {
        v = setTimeout(() => {
          this.setpStop()
          console.log('stop')
        }, item - this.getBpmTime() * 1.8 - 1001)

      }
      this.timeoutLst.push(v)
    })
    this.endTimeout = setTimeout(() => {
      // if (this.nowForm.value.length > 0){
      this.willEnd = true
      // }
    }, song.endTime)
  }
}
let game = new Game()
let _game = ref<Game>(game)


let stopBall = () => {
  // game.nowForm.value = []
}

window.onkeydown = (e) => {
  game.checkKey(e)

}


</script>

<template>
  <div class="h-full w-full bg-black">
    <video ref="video" :src="src" class="h-full w-full" webkit-playsinline="true" playsinline="true"
      x5-video-player-type='h5-page'></video>
    <Transition name="box">
      <div v-show="_game.show"
        class="keyboard absolute bottom-[30%] left-0 right-0 bg-[#00000088] h-[60px] w-[465px] rounded-full m-auto">
        <div class="inputbox h-full w-full  border-solid border-2 border-black rounded-full">
          <div class="flex h-full w-full justify-center items-center border-solid border border-white rounded-full">
            <div v-for="(item, index) of _game.nowForm" :key="index"
              :class="{ isOk: index < _game.checkIndex, arrow0: item == 0, arrow1: item == 1, arrow2: item == 2, arrow3: item == 3 }">
              <div class="border border-white rounded-full m-1 bg-gradient-to-r from-cyan-500 to-blue-500"
                :class="{ 'from-green-500': index < _game.checkIndex, 'to-green-600': index < _game.checkIndex }">
                <svg t="1734621948561" class="icon h-[40px] w-[40px]" viewBox="100 0 1024 1024" version="1.1"
                  xmlns="http://www.w3.org/2000/svg" p-id="22616" id="mx_n_1734621948561"
                  data-spm-anchor-id="a313x.search_index.0.i10.6e8f3a81Jbme8S"
                  xmlns:xlink="http://www.w3.org/1999/xlink" width="300" height="300">
                  <g>
                    <path
                      d="M529.066667 162.133333c-25.6 34.133333-17.066667 76.8 8.533333 110.933334L691.2 426.666667H300c-42.667 0-85.333333 34.133333-85.333333 85.333333v8.533333c8.533333 42.666667 42.666667 76.8 85.333333 76.8h403.2L546.133333 750.933333c-34.133333 34.133333-34.133333 85.333333 0 119.466667s85.333333 34.133333 119.466667 0l290.133333-298.666667c34.133333-34.133333 34.133333-85.333333 0-119.466666L657.066667 153.6c-34.133333-34.133333-85.333333-34.133333-128 8.533333z"
                      p-id="22617" fill="#ffffff" data-spm-anchor-id="a313x.search_index.0.i9.6e8f3a81Jbme8S"
                      class="selected">
                    </path>
                  </g>
                </svg>
              </div>

              <Transition>
                <div v-if="index < _game.checkIndex" class="w-[20px] h-[20px] bg-[#00000088] keydown"></div>
              </Transition>
            </div>
          </div>

        </div>

        <div class="jindu absolute bottom-[70px]  right-2 h-[20px] w-[200px] rounded-full border">
          <ball ref="_ball" @stop="stopBall"></ball>

          <div class="flash absolute h-full w-[30%] right-[5%]"></div>
        </div>
      </div>
    </Transition>


  </div>
  <div>
    <showGood ref="_showGood"></showGood>
    <score ref="_score"></score>
    <calc ref="_calc"></calc>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}

.arrow0 {
  transform: rotate(0deg);
}

.arrow1 {
  transform: rotate(90deg);
}

.arrow2 {
  transform: rotate(180deg);
}

.arrow3 {
  transform: rotate(270deg);
}

.isOk path {
  /* fill: #00c4ff; */
}

.box-enter-active,
.box-leave-active {
  transition: opacity 0.5s ease;
}

.box-enter-from {
  opacity: 0;
}

.box-leave-to {
  opacity: 1;
}

.box-leave-from {
  opacity: 1;
}

.box-leave-to {
  opacity: 0;

}

.v-enter-active,
.v-leave-active {
  transition: height 0.2s ease, width 0.2s ease, opacity 0.2s ease;
}

.v-enter-from {
  opacity: 1 !important;
  height: 0px;
  width: 0px;
}

.v-enter-to {
  opacity: 0;
  height: 70px;
  width: 70px;
}



.keydown {
  opacity: 0;
  transform: rotate(45deg);
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
}

.jindu {
  background: linear-gradient(to right, #ffffff00 50px, rgba(194, 241, 255, 0.829) 85%, rgba(255, 255, 255, 0));
}

.jindu .flash {
  background: linear-gradient(to right, #ffffff00, rgb(255, 255, 255), rgba(255, 255, 255, 0));
  animation-name: scaleXAnimation;
  /* 引用动画名称 */
  animation-duration: 0.4s;
  /* 动画持续时间 */
  animation-iteration-count: infinite;
  /* 无限循环动画 */
  animation-timing-function: ease-in-out;
  /* 动画的缓动函数，使动画更平滑 */
}

@keyframes scaleXAnimation {

  0%,
  100% {
    transform: scaleX(1);
    /* 动画开始和结束时的X轴缩放比例为1 */
  }

  50% {
    transform: scaleX(0.5);
    /* 动画中间时的X轴缩放比例为2 */
  }
}
</style>
