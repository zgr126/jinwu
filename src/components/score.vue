<script setup lang="ts">
import { ref } from 'vue';
import { good, type Score } from './types';

let nowScore = ref(0)
let showScore = ref(true)
let showFlash = ref(false)
let nowCombo = ref(0)
let getScore = ()=>{
  return nowScore.value
}
let show = (lst: Score[])=>{
  // 找combo
  let combo = 0
  let id = lst.reverse().findIndex(e=>{
    return e.good == good.miss
  })

  if (id == -1){
    combo = lst.length
  }else{
    combo = id
  }
  nowCombo.value = combo
  console.log(combo)
  if (id != 0 && combo % 10 == 0){
    showFlash.value = true
    setTimeout(()=>{
      showFlash.value = false
    }, 3000)
  }

  
  let comboA = 1
  if (combo>10)comboA = 1.2
  if (combo>20)comboA = 1.3
  if (combo>30)comboA = 1.4
  if (combo>40)comboA = 1.5


  let now = lst.reverse()[0]
  let scoreP = 0
  if (now.good == good.perfact) scoreP = 300
  if (now.good == good.great) scoreP = 200
  if (now.good == good.ok) scoreP = 100
  if (now.good == good.miss) scoreP = 0
  nowScore.value += scoreP * now.len * comboA
  
  
}

let hide = function(){
  showScore.value = false
}
defineExpose({
  show, getScore, hide
})
</script>

<template>
  <div class="nowScore absolute top-[20%] right-[30%]" ref="score" v-show="showScore">
    {{ nowScore }}
  </div>
  <Transition name="score">
    <div class="good absolute top-[30%] left-[60%]" v-show="showFlash" ref="flash">
      <!-- <div v-if="nowFlash === 0">OK</div>
      <div v-if="nowFlash === 1">GREAT</div>
      <div v-if="nowFlash === 1">PERFACT!</div> -->
      <div class="perfact" >Combo ×{{ nowCombo }}!!!</div>
    </div>
  </Transition>
  
</template>

<style scoped>
.nowScore{
  font-size: 70px;
  font-family: 'COLLEGEFREAKS';
  text-shadow: 0px 5px 3px black;
  color: #fff;
}
.ok{
  color: #02a2ff
}
.great{
  color: #00ff00;
}
.perfact{
  color: #fbff00;
}
.miss{
  color: #bdbdbd;

}
.good{
  font-family: 'COLLEGEFREAKS';
  font-size: 60px;
  text-shadow: 5px 5px 20px black;
}
.good >div{
  text-shadow: 0px 5px 3px black;
}

.score-enter-active{
  transition: transform 0.1s ease;
}

.score-enter-from{
  transform: scale(80%);
}
.score-enter-to{
  
  transform: scale(100%);
}
</style>
