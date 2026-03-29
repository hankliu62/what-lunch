<template>
  <div class="slot-machine-ultra" :class="{ 'is-spinning': isSpinning }">
    <!-- 外层光晕 -->
    <div class="outer-glow"></div>

    <!-- 顶部装饰架 -->
    <div class="slot-frame-top">
      <div class="frame-bar">
        <div class="led-strip">
          <span
            v-for="n in 30"
            :key="n"
            class="led"
            :style="{ animationDelay: `${n * 0.05}s` }"
          ></span>
        </div>
      </div>
      <div class="frame-corners">
        <div class="corner top-left"></div>
        <div class="corner top-right"></div>
      </div>
    </div>

    <!-- 结果展示区 -->
    <div class="result-chamber">
      <div
        v-if="finalFood"
        class="final-card"
        :class="{ 'is-revealed': showFinal }"
      >
        <img
          v-if="finalFood.image"
          :src="finalFood.image"
          :alt="finalFood.name"
          class="final-image"
          loading="lazy"
        />
        <div class="final-name">{{ finalFood.name }}</div>
      </div>
      <div v-else class="placeholder">
        <span class="placeholder-text">点击开始</span>
      </div>
    </div>

    <!-- 底部装饰架 -->
    <div class="slot-frame-bottom">
      <div class="frame-bar">
        <div class="led-strip reverse">
          <span
            v-for="n in 30"
            :key="n"
            class="led"
            :style="{ animationDelay: `${n * 0.05}s` }"
          ></span>
        </div>
      </div>
      <div class="frame-corners">
        <div class="corner bottom-left"></div>
        <div class="corner bottom-right"></div>
      </div>
    </div>

    <!-- 粒子爆发层 - 结果揭示时 -->
    <div v-if="showFinal" class="particle-field">
      <div
        v-for="n in 40"
        :key="n"
        class="spark"
        :style="getSparkStyle(n)"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { FoodItem } from "../data/foods";

interface Props {
  foods: FoodItem[];
  isSpinning?: boolean;
}

withDefaults(defineProps<Props>(), {
  isSpinning: false,
});

// const emit = defineEmits<{
//   (e: "spin-end", food: FoodItem): void;
// }>();

const finalFood = ref<FoodItem | null>(null);
const showFinal = ref(false);

function getSparkStyle(n: number) {
  const angle = (n / 40) * 360 + Math.random() * 30;
  const distance = 100 + Math.random() * 150;
  const delay = Math.random() * 0.3;
  const duration = 0.5 + Math.random() * 0.5;
  const size = 3 + Math.random() * 6;

  return {
    "--angle": `${angle}deg`,
    "--distance": `${distance}px`,
    "--delay": `${delay}s`,
    "--duration": `${duration}s`,
    "--size": `${size}px`,
  };
}

// 暴露方法给父组件
defineExpose({
  setFinalFood: (food: FoodItem) => {
    finalFood.value = food;
    setTimeout(() => {
      showFinal.value = true;
    }, 100);
  },
  reset: () => {
    showFinal.value = false;
    finalFood.value = null;
  },
});
</script>

<style scoped>
.slot-machine-ultra {
  position: relative;
  margin: 0 auto;
  padding: 20px;
  width: 100%;
  max-width: 600px;
}

.outer-glow {
  position: absolute;
  pointer-events: none;
  background: radial-gradient(
    ellipse at center,
    rgb(255 200 50 / 15%) 0%,
    rgb(255 150 50 / 8%) 40%,
    transparent 70%
  );
  z-index: 0;
  inset: -40px;
}

.slot-frame-top,
.slot-frame-bottom {
  position: relative;
  z-index: 10;
}

.frame-bar {
  border-radius: 6px;
  height: 12px;
  background: linear-gradient(180deg, #ffd700 0%, #ff8c00 50%, #ffd700 100%);
  box-shadow:
    0 0 20px rgb(255 215 0 / 60%),
    0 0 40px rgb(255 150 0 / 40%),
    inset 0 2px 4px rgb(255 255 255 / 50%);
}

.led-strip {
  display: flex;
  justify-content: space-between;
  padding: 2px 10px;
  gap: 4px;
}

.led-strip.reverse {
  flex-direction: row-reverse;
}

.led {
  border-radius: 50%;
  width: 8px;
  height: 8px;
  background: #fff;
  box-shadow: 0 0 8px #ffd700;
  animation: led-blink 0.5s ease-in-out infinite alternate;
}

@keyframes led-blink {
  0% {
    opacity: 0.4;
    transform: scale(0.8);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.frame-corners {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.corner {
  position: absolute;
  border: 3px solid #ffd700;
  width: 24px;
  height: 24px;
  box-shadow: 0 0 10px rgb(255 215 0 / 50%);
}

.corner.top-left {
  top: -4px;
  left: -4px;
  border-right: none;
  border-bottom: none;
}

.corner.top-right {
  top: -4px;
  right: -4px;
  border-left: none;
  border-bottom: none;
}

.corner.bottom-left {
  bottom: -4px;
  left: -4px;
  border-right: none;
  border-top: none;
}

.corner.bottom-right {
  right: -4px;
  bottom: -4px;
  border-left: none;
  border-top: none;
}

/* 结果展示区 */
.result-chamber {
  position: relative;
  display: flex;
  border: 3px solid;
  width: 100%;
  height: 280px;
  background: linear-gradient(
    180deg,
    rgb(20 15 30 / 98%) 0%,
    rgb(30 25 45 / 100%) 20%,
    rgb(40 30 60 / 100%) 50%,
    rgb(30 25 45 / 100%) 80%,
    rgb(20 15 30 / 98%) 100%
  );
  overflow: hidden;
  align-items: center;
  justify-content: center;
  border-image: linear-gradient(180deg, #ffd700, #ff8c00, #ffd700) 1;
  box-shadow:
    inset 0 0 60px rgb(255 200 50 / 10%),
    0 0 30px rgb(255 150 0 / 30%);
}

.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-text {
  font-size: 1.2rem;
  letter-spacing: 0.1em;
  color: rgb(255 255 255 / 30%);
}

/* 最终显示的卡片 */
.final-card {
  display: flex;
  border: 3px solid rgb(255 215 0 / 30%);
  border-radius: 20px;
  padding: 24px 40px;
  opacity: 0;
  transform: scale(0.5);
  background: rgb(255 215 0 / 8%);
  flex-direction: column;
  align-items: center;
  gap: 16px;
  box-shadow:
    0 0 40px rgb(255 200 50 / 30%),
    0 0 80px rgb(255 150 0 / 20%),
    inset 0 0 30px rgb(255 200 50 / 10%);
}

.final-card.is-revealed {
  animation: final-reveal 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes final-reveal {
  0% {
    opacity: 0;
    transform: scale(0.5) rotate(-5deg);
  }

  50% {
    transform: scale(1.1) rotate(2deg);
  }

  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}

.final-image {
  border: 2px solid rgb(255 215 0 / 30%);
  border-radius: 16px;
  width: 160px;
  height: 120px;
  object-fit: cover;
  box-shadow: 0 8px 32px rgb(0 0 0 / 60%);
}

.final-name {
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-shadow:
    0 0 20px rgb(255 215 0 / 80%),
    0 0 40px rgb(255 150 0 / 50%),
    0 2px 8px rgb(0 0 0 / 50%);
  color: #ffd700;
}

/* 粒子效果 */
.particle-field {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  pointer-events: none;
  transform: translate(-50%, -50%);
  z-index: 30;
}

.spark {
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  width: var(--size);
  height: var(--size);
  opacity: 0;
  background: radial-gradient(
    circle,
    #ffd700 0%,
    #ff8c00 40%,
    transparent 100%
  );
  animation: spark-burst var(--duration) ease-out var(--delay) infinite;
}

@keyframes spark-burst {
  0% {
    opacity: 1;
    transform: translate(-50%, -50%) rotate(var(--angle)) translateY(0) scale(1);
  }

  100% {
    opacity: 0;
    transform: translate(-50%, -50%) rotate(var(--angle))
      translateY(calc(var(--distance) * -1)) scale(0);
  }
}

@media (width <= 640px) {
  .slot-machine-ultra {
    padding: 10px;
  }

  .result-chamber {
    height: 240px;
  }

  .final-image {
    width: 120px;
    height: 90px;
  }

  .final-name {
    font-size: 1.5rem;
  }

  .slot-frame-top .frame-bar,
  .slot-frame-bottom .frame-bar {
    height: 8px;
  }

  .led {
    width: 6px;
    height: 6px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .led,
  .spark,
  .final-card {
    animation: none !important;
  }

  .final-card {
    transition: none;
  }
}
</style>
