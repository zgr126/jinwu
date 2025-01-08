<script setup lang="ts">
import { ref } from 'vue';
import { good, type Score } from './types';

let showFlash = ref(false)
let nowFlash = ref(0)
let show = (_good: good, lst: Score[])=>{
  showFlash.value = true
  switch(_good){
    case good.miss:
      nowFlash.value = 0
      break
    case good.ok:
      nowFlash.value = 1
      break
    case good.great:
      nowFlash.value = 2
      break
    case good.perfact:
      nowFlash.value = 3
      break
  }
  setTimeout(()=>{
    showFlash.value = false
  }, 600)
}
defineExpose({
  show
})
</script>

<template>
  <Transition name="good">
    <div class="good absolute bottom-[42%] left-[60%]" v-show="showFlash" ref="flash">
      <!-- <div v-if="nowFlash === 0">OK</div>
      <div v-if="nowFlash === 1">GREAT</div>
      <div v-if="nowFlash === 1">PERFACT!</div> -->
      <div class="ok" v-if="nowFlash === 1">OK</div>
      <div class="great" v-if="nowFlash === 2">GREAT</div>
      <div class="perfact" v-if="nowFlash === 3">PERFACT!</div>
      <div class="miss" v-if="nowFlash === 0">MISS</div>
    </div>
  </Transition>
  
</template>

<style scoped>
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
  font-size: 50px;
  text-shadow: 5px 5px 20px black;
}
.good >div{
  text-shadow: 0px 5px 3px black;
}

.good-enter-active{
  transition: transform 0.1s ease;
}

.good-enter-from{
  transform: scale(80%);
}
.good-enter-to{
  
  transform: scale(100%);
}
</style>
