<script setup lang="ts">
let history = JSON.parse(localStorage.getItem('history') || '[]')
let betterHistory = JSON.parse(localStorage.getItem('betterHistory') || '[]')
import { ref } from "vue"
import { useRouter } from "vue-router"
import aaaa from './A.vue'
let his = ref(history)
let better = ref(betterHistory)
const router = useRouter()
let returnBtn = () => {
  router.go(-1)
}
let s = () => {
  return better.value.reduce((a: number = 0, item: any) => {
    console.log(item.calc)
    if (item.calc == 'S' || item.calc == 'SS' || item.calc == 'SS') {
      return a + 1
    } else {
      return a
    }
  }, 0) || '0'
}
let a = () => {
  return better.value.reduce((a = 0, item: any) => {
    if (item.calc == 'S' || item.calc == 'SS' || item.calc == 'SS' || item.calc == 'A') {
      return a + 1
    }
  }) || '0'
}
let showEx = () => {
  return better.value.reduce((a = 0, item: any) => {
    if (item.songNan >= 8) {
      return a + 1
    }
  }) || '0'
}
</script>

<template>
  <div class="goodBox absolute top-0 left-0 w-[100vw] h-[100vh] " ref="flash">
    <div class="good">
      <div class="zongfen">游戏次数：{{ his.length }}</div>
      <div>获得S评分数量：{{ s() }}</div>
      <div>获得A以及A以上评分数量: {{ a() }}</div>
      <div v-if="showEx() > 0">见过EX次数：{{ showEx() }}</div>

      <!-- <aaaa class="aa" :value="'S'" :size="80"></aaaa>
      <aaaa class="aa" :value="'S'" :size="80"></aaaa>
      <aaaa class="aa" :value="'S'" :size="80"></aaaa>
      <aaaa class="aa" :value="'S'" :size="80"></aaaa>
      <aaaa class="aa" :value="'S'" :size="80"></aaaa> -->
    </div>
    <div class="returnBtn" @click="returnBtn">返回</div>

  </div>

</template>

<style scoped>
.aa {
  display: inline-block;
}

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
