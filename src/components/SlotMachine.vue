<template>
  <div class="slot-machine" :class="{ 'is-spinning': isSpinning }">
    <!-- 顶部装饰 -->
    <div class="slot-decoration top">
      <div class="slot-light left"></div>
      <div class="slot-frame"></div>
      <div class="slot-light right"></div>
    </div>

    <!-- 滚动区域 -->
    <div class="slot-reel-container">
      <!-- 模糊遮罩 -->
      <div class="slot-blur top"></div>
      <div class="slot-blur bottom"></div>

      <!-- 滚动列 -->
      <div class="slot-reel" ref="reelRef">
        <TransitionGroup name="spin" tag="div" class="slot-items">
          <div
            v-for="(food, index) in visibleFoods"
            :key="`${food.name}-${index}`"
            class="slot-item"
            :class="{ 'is-center': index === centerIndex }"
          >
            <img
              v-if="food.image"
              :src="food.image"
              :alt="food.name"
              class="slot-item-image"
              loading="lazy"
            />
            <span class="slot-item-name">{{ food.name }}</span>
          </div>
        </TransitionGroup>
      </div>

      <!-- 中心指示器 -->
      <div class="slot-indicator">
        <div class="indicator-line top"></div>
        <div class="indicator-line bottom"></div>
        <div class="center-glow"></div>
      </div>
    </div>

    <!-- 底部装饰 -->
    <div class="slot-decoration bottom">
      <div class="slot-light left"></div>
      <div class="slot-frame"></div>
      <div class="slot-light right"></div>
    </div>

    <!-- 粒子效果 -->
    <div v-if="isSpinning" class="slot-particles">
      <div
        v-for="n in 20"
        :key="n"
        class="particle"
        :style="getParticleStyle(n)"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from "vue";
import type { FoodItem } from "../data/foods";

interface Props {
  foods: FoodItem[];
  isSpinning?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isSpinning: false,
});

const emit = defineEmits<{
  (e: "spin-end", food: FoodItem): void;
}>();

const reelRef = ref<HTMLElement | null>(null);
const currentIndex = ref(0);
const spinSpeed = ref(50); // ms per frame

// 显示的食物列表（循环）
const visibleFoods = computed(() => {
  const result: typeof props.foods = [];
  const len = props.foods.length;

  // 显示当前食物及前后各几个
  for (let i = -2; i <= 2; i++) {
    const idx = (currentIndex.value + i + len) % len;
    result.push(props.foods[idx]);
  }

  return result;
});

const centerIndex = 2; // 中心位置索引

// 随机定时器
let spinTimer: ReturnType<typeof setInterval> | null = null;
let decelerationTimer: ReturnType<typeof setTimeout> | null = null;

// 生成粒子样式
function getParticleStyle(index: number) {
  const angle = (index / 20) * 360;
  const delay = Math.random() * 0.5;
  const duration = 1 + Math.random() * 0.5;
  const size = 4 + Math.random() * 8;

  return {
    "--angle": `${angle}deg`,
    "--delay": `${delay}s`,
    "--duration": `${duration}s`,
    "--size": `${size}px`,
  };
}

// 开始滚动
function startSpin() {
  if (spinTimer) return;

  // 初始速度
  spinSpeed.value = 30;

  spinTimer = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % props.foods.length;

    // 逐渐减速
    if (spinSpeed.value < 200) {
      spinSpeed.value += 2;
    }
  }, spinSpeed.value);

  // 开始减速
  startDeceleration();
}

// 减速逻辑
function startDeceleration() {
  if (decelerationTimer) {
    clearTimeout(decelerationTimer);
  }

  // 随机延迟后开始减速
  const delay = 1500 + Math.random() * 1500;

  decelerationTimer = setTimeout(() => {
    // 逐渐减速并停止
    slowDown();
  }, delay);
}

// 减速停止
function slowDown() {
  if (!spinTimer) return;

  // 清除快速滚动
  clearInterval(spinTimer);
  spinTimer = null;

  // 选择最终结果
  const targetIndex = Math.floor(Math.random() * props.foods.length);

  // 动画滚动到最终位置
  animateToTarget(targetIndex);
}

// 动画滚动到目标
function animateToTarget(targetIndex: number) {
  const steps =
    (targetIndex - currentIndex.value + props.foods.length) %
    props.foods.length;
  let step = 0;
  let speed = 80;

  const interval = setInterval(() => {
    step++;
    currentIndex.value = (currentIndex.value + 1) % props.foods.length;

    // 逐渐减速
    if (step > steps * 0.7) {
      speed += 15;
    }

    if (step >= steps) {
      clearInterval(interval);
      // 最终选中
      currentIndex.value = targetIndex;
      // 触发完成事件
      emit("spin-end", props.foods[targetIndex]);
    }
  }, speed);
}

// 监听 isSpinning 变化
watch(
  () => props.isSpinning,
  (newVal) => {
    if (newVal) {
      startSpin();
    }
  },
);

// 清理
onUnmounted(() => {
  if (spinTimer) clearInterval(spinTimer);
  if (decelerationTimer) clearTimeout(decelerationTimer);
});
</script>

<style scoped>
.slot-machine {
  position: relative;
  margin: 0 auto;
  width: 100%;
  max-width: 500px;
}

/* 顶部装饰 */
.slot-decoration {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 0;
}

.slot-decoration.bottom {
  transform: rotate(180deg);
}

.slot-frame {
  border-radius: 3px;
  width: 100%;
  height: 6px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgb(255 215 0 / 80%) 20%,
    rgb(255 215 0 / 100%) 50%,
    rgb(255 215 0 / 80%) 80%,
    transparent 100%
  );
  box-shadow:
    0 0 10px rgb(255 215 0 / 50%),
    0 0 20px rgb(255 215 0 / 30%);
}

.slot-light {
  border-radius: 50%;
  width: 12px;
  height: 12px;
  background: radial-gradient(circle, #fff 0%, #ffd700 50%, #ff8c00 100%);
  box-shadow:
    0 0 8px #ffd700,
    0 0 16px #ffd700;
  animation: glow 1.5s ease-in-out infinite;
}

.slot-light.left {
  animation-delay: 0s;
}

.slot-light.right {
  animation-delay: 0.75s;
}

@keyframes glow {
  0%,
  100% {
    opacity: 0.6;
    transform: scale(0.9);
  }

  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}

/* 滚动容器 */
.slot-reel-container {
  position: relative;
  height: 280px;
  background: linear-gradient(
    180deg,
    rgb(20 20 30 / 90%) 0%,
    rgb(30 30 50 / 95%) 50%,
    rgb(20 20 30 / 90%) 100%
  );
  overflow: hidden;
  border-left: 2px solid rgb(255 215 0 / 30%);
  border-right: 2px solid rgb(255 215 0 / 30%);
}

/* 模糊遮罩 */
.slot-blur {
  position: absolute;
  right: 0;
  left: 0;
  height: 60px;
  pointer-events: none;
  z-index: 10;
}

.slot-blur.top {
  top: 0;
  background: linear-gradient(
    180deg,
    rgb(20 20 30 / 100%) 0%,
    rgb(20 20 30 / 0%) 100%
  );
}

.slot-blur.bottom {
  bottom: 0;
  background: linear-gradient(
    0deg,
    rgb(20 20 30 / 100%) 0%,
    rgb(20 20 30 / 0%) 100%
  );
}

/* 滚动列 */
.slot-reel {
  position: relative;
  height: 100%;
}

.slot-items {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 8px;
}

/* 单个食物项 */
.slot-item {
  display: flex;
  border: 1px solid rgb(255 255 255 / 5%);
  border-radius: 16px;
  padding: 16px 24px;
  opacity: 0.4;
  transform: scale(0.85);
  background: rgb(255 255 255 / 3%);
  flex-direction: column;
  align-items: center;
  gap: 12px;
  transition:
    transform 0.3s ease,
    opacity 0.3s ease,
    background 0.3s ease;
}

.slot-item.is-center {
  opacity: 1;
  transform: scale(1);
  background: rgb(255 215 0 / 8%);
  border-color: rgb(255 215 0 / 30%);
  box-shadow:
    0 0 30px rgb(255 215 0 / 20%),
    inset 0 0 30px rgb(255 215 0 / 5%);
}

.slot-item-image {
  border-radius: 12px;
  width: 100px;
  height: 75px;
  object-fit: cover;
  box-shadow: 0 4px 12px rgb(0 0 0 / 30%);
}

.slot-item-name {
  font-size: 1.4rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgb(0 0 0 / 30%);
  color: rgb(255 255 255 / 60%);
  transition: all 0.3s ease;
}

.slot-item.is-center .slot-item-name {
  font-size: 1.8rem;
  text-shadow:
    0 0 10px rgb(255 215 0 / 50%),
    0 2px 4px rgb(0 0 0 / 30%);
  color: #ffd700;
}

/* 中心指示器 */
.slot-indicator {
  position: absolute;
  top: 50%;
  right: 0;
  left: 0;
  pointer-events: none;
  transform: translateY(-50%);
  z-index: 20;
}

.indicator-line {
  position: absolute;
  right: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgb(255 215 0 / 80%) 30%,
    rgb(255 215 0 / 100%) 50%,
    rgb(255 215 0 / 80%) 70%,
    transparent 100%
  );
}

.indicator-line.top {
  top: -30px;
}

.indicator-line.bottom {
  bottom: -30px;
}

.center-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 120%;
  height: 120%;
  pointer-events: none;
  transform: translate(-50%, -50%);
  background: radial-gradient(
    ellipse at center,
    rgb(255 215 0 / 15%) 0%,
    transparent 60%
  );
}

/* 粒子效果 */
.slot-particles {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  pointer-events: none;
  transform: translate(-50%, -50%);
  z-index: 30;
}

.particle {
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
    rgb(255 215 0 / 50%) 50%,
    transparent 100%
  );
  animation: particle-burst var(--duration) ease-out var(--delay) infinite;
}

@keyframes particle-burst {
  0% {
    opacity: 1;
    transform: translate(-50%, -50%) rotate(var(--angle)) translateY(0);
  }

  100% {
    opacity: 0;
    transform: translate(-50%, -50%) rotate(var(--angle)) translateY(-150px);
  }
}

/* 滚动动画 */
.spin-enter-active {
  animation: spin-in 0.2s ease-out;
}

.spin-leave-active {
  animation: spin-out 0.2s ease-in;
}

@keyframes spin-in {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.9);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes spin-out {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }

  to {
    opacity: 0;
    transform: translateY(-30px) scale(0.9);
  }
}

/* 滚动状态样式 */
.slot-machine.is-spinning .slot-item {
  animation: item-shake 0.1s ease-in-out infinite;
}

.slot-machine.is-spinning .slot-item.is-center {
  animation: item-glow 0.3s ease-in-out infinite;
}

@keyframes item-shake {
  0%,
  100% {
    transform: scale(0.85) translateX(0);
  }

  25% {
    transform: scale(0.85) translateX(-2px);
  }

  75% {
    transform: scale(0.85) translateX(2px);
  }
}

@keyframes item-glow {
  0%,
  100% {
    box-shadow:
      0 0 20px rgb(255 215 0 / 30%),
      inset 0 0 20px rgb(255 215 0 / 5%);
  }

  50% {
    box-shadow:
      0 0 40px rgb(255 215 0 / 50%),
      inset 0 0 40px rgb(255 215 0 / 10%);
  }
}

/* 减少动画 */
@media (prefers-reduced-motion: reduce) {
  .slot-light,
  .particle,
  .slot-item,
  .spin-enter-active,
  .spin-leave-active {
    animation: none;
  }

  .slot-machine.is-spinning .slot-item {
    animation: none;
  }

  .slot-machine.is-spinning .slot-item.is-center {
    animation: none;
  }
}

/* 响应式 */
@media (width <= 480px) {
  .slot-reel-container {
    height: 240px;
  }

  .slot-item-image {
    width: 80px;
    height: 60px;
  }

  .slot-item-name {
    font-size: 1.2rem;
  }

  .slot-item.is-center .slot-item-name {
    font-size: 1.5rem;
  }
}
</style>
