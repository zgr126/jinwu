<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps({
  value: String,
  size: Number
});
</script>

<template>
  <div class="font" :style="{ fontSize: size + 'px' }">
    <div class="D" v-if="value === 'D'">D</div>
    <div class="C" v-if="value === 'C'">C</div>
    <div class="B" v-if="value === 'B'">B</div>
    <div class="A" v-if="value === 'A'">A</div>
    <div class="S" v-if="value === 'S'">S</div>
    <div class="SS" v-if="value === 'SS'">SS</div>
    <div class="SSS" v-if="value === 'SSS'">SSS</div>
  </div>

</template>

<style scoped>
.font {
  font-size: 50px;
  font-family: 'COLLEGEFREAKS';
}

.D {
  color: #8f04a1;
}

.C {
  color: #003ada;
}

.B {
  color: #008a29;
}

.A {
  color: #971302;
}

.S {
  color: #ffee00;
}

.SS {
  color: #fbff00;
}

.SSS {
  color: #ffea00;
}
</style>
