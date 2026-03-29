<script setup lang="ts">
/**
 * What-Lunch 2.0
 * 高级感美食随机选择器
 */
import { ref, computed, onMounted, onUnmounted } from "vue";
import "./app.less";

// 组件
import AnimatedBackground from "./components/AnimatedBackground.vue";
import MapSelector from "./components/MapSelector.vue";

// 数据
import { foodsData, type FoodItem } from "./data/foods";

// 工具
import {
  getCurrentLocation,
  buildMapUrl,
  type MapPlatform,
} from "./utils/location";

// ==================== 状态 ====================

// 当前选中的食物
const currentFood = ref<FoodItem | null>(null);

// 是否正在随机
const isRandoming = ref(false);

// 随机次数
const randomCount = ref(1);

// 是否显示搜索按钮
const showSearchButton = ref(false);

// 是否显示地图选择器
const showMapSelector = ref(false);

// 用户位置
const userLocation = ref<{ latitude: number; longitude: number } | null>(null);

// 淡入淡出卡片列表
const fadeItems = ref<
  Array<{
    key: string;
    food: FoodItem;
    x: number;
    y: number;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    scale: number;
    rotation: number;
    duration: number;
    imageLoaded: boolean;
  }>
>([]);

// 图片预加载状态
const preloadedImages = ref<Set<string>>(new Set());

// 记录上一轮出现的食物，避免连续重复
// let lastFoodName = "";

// 粒子效果样式
function getParticleStyle(n: number) {
  const angle = (n / 30) * 360 + Math.random() * 20;
  const distance = 150 + Math.random() * 100;
  const delay = Math.random() * 0.2;
  const duration = 0.8 + Math.random() * 0.4;
  const size = 4 + Math.random() * 8;

  return {
    "--angle": `${angle}deg`,
    "--distance": `${distance}px`,
    "--delay": `${delay}s`,
    "--duration": `${duration}s`,
    "--size": `${size}px`,
  };
}

// ==================== 计算属性 ====================

// 按钮文案
const btnText = computed(() => {
  if (isRandoming.value) return "停止";
  if (randomCount.value === 1) return "开始";
  return "换一个";
});

// ==================== 方法 ====================

// 预加载所有图片
function preloadImages() {
  foodsData.forEach((food) => {
    if (food.image && !preloadedImages.value.has(food.image)) {
      const img = new Image();
      img.src = food.image;
      img.onload = () => {
        preloadedImages.value.add(food.image!);
      };
      img.onerror = () => {
        console.warn(`Failed to load image: ${food.image}`);
      };
    }
  });
}

// 卡片大小（占屏幕宽高的百分比）
const CARD_WIDTH = 18;
const CARD_HEIGHT = 25;

// 生成不重叠的位置
function generateNonOverlappingPosition(
  existingPositions: { x: number; y: number }[],
): { x: number; y: number } {
  const minX = 10;
  const maxX = 90 - CARD_WIDTH;
  const minY = 10;
  const maxY = 90 - CARD_HEIGHT;

  for (let attempts = 0; attempts < 30; attempts++) {
    const x = minX + Math.random() * (maxX - minX);
    const y = minY + Math.random() * (maxY - minY);

    let overlaps = false;
    for (const pos of existingPositions) {
      const dx = Math.abs(x - pos.x);
      const dy = Math.abs(y - pos.y);
      if (dx < CARD_WIDTH && dy < CARD_HEIGHT) {
        overlaps = true;
        break;
      }
    }

    if (!overlaps) {
      return { x, y };
    }
  }

  return {
    x: minX + Math.random() * (maxX - minX),
    y: minY + Math.random() * (maxY - minY),
  };
}

// 创建淡入淡出卡片 - 从边缘滑入
function createFadeItem(
  food: FoodItem,
  currentRound: number,
  position?: { x: number; y: number },
) {
  // 在页面中间区域随机位置显示（避免边缘）
  let endX: number, endY: number;

  if (position) {
    endX = position.x;
    endY = position.y;
  } else {
    // 目标位置在页面中间区域（20%-75%范围内，确保完全显示）
    endX = 20 + Math.random() * 55;
    endY = 20 + Math.random() * 55;
  }

  // 起始位置和结束位置一样，直接淡入淡出
  const startX = endX;
  const startY = endY;

  // 随机轻微旋转
  const rotation = (Math.random() - 0.5) * 20;

  return {
    key: `${food.name}-${Date.now()}-${currentRound}-${Math.random()}`,
    food,
    startX,
    startY,
    endX,
    endY,
    x: startX,
    y: startY,
    scale: 0.6 + Math.random() * 0.4,
    rotation: rotation,
    duration: 0.5 + Math.random() * 0.2, // 0.5-0.7秒，更短的动画
    imageLoaded: preloadedImages.value.has(food.image || ""),
  };
}

// 开始/停止随机
function toggleRandom() {
  if (isRandoming.value) {
    isRandoming.value = false;
    stopFading();
  } else {
    startRandom();
  }
}

// 开始随机
function startRandom() {
  // 检查次数限制
  if (randomCount.value >= 4) {
    alert("这么作，今天别吃了！");
    randomCount.value++;
    return;
  }

  randomCount.value++;
  isRandoming.value = true;
  showSearchButton.value = false;
  fadeItems.value = [];
  // lastFoodName = ""; // 重置，避免连续重复

  // 随机选择最终结果
  const targetIndex = Math.floor(Math.random() * foodsData.length);
  const targetFood = foodsData[targetIndex];

  // 淡入淡出阶段参数
  const totalRounds = 35; // 35轮，约35秒
  let currentRound = 0;

  // 记录最近出现过的食物（避免连续重复）
  const recentFoods: string[] = [];

  function fadeRound() {
    if (!isRandoming.value) return;

    currentRound++;

    // 随机选择食物，避免最近5次出现重复
    let food: FoodItem;
    let attempts = 0;
    do {
      if (currentRound > totalRounds * 0.5 && Math.random() > 0.3) {
        // 接近结束时增加目标食物的出现概率
        food = targetFood;
      } else {
        food = foodsData[Math.floor(Math.random() * foodsData.length)];
      }
      attempts++;
    } while (recentFoods.includes(food.name) && attempts < 20);

    // 记录这一轮的食物
    // lastFoodName = food.name;

    // 随机生成1-3个卡片
    const cardCount = 1 + Math.floor(Math.random() * 3);
    const items: typeof fadeItems.value = [];
    const existingPositions: { x: number; y: number }[] = [];
    const thisRoundFoods: string[] = [];

    for (let i = 0; i < cardCount; i++) {
      let cardFood: FoodItem;
      let foodAttempts = 0;
      do {
        if (currentRound > totalRounds * 0.5 && Math.random() > 0.3) {
          cardFood = targetFood;
        } else {
          cardFood = foodsData[Math.floor(Math.random() * foodsData.length)];
        }
        foodAttempts++;
      } while (
        (recentFoods.includes(cardFood.name) ||
          thisRoundFoods.includes(cardFood.name)) &&
        foodAttempts < 20
      );

      thisRoundFoods.push(cardFood.name);

      const position = generateNonOverlappingPosition(existingPositions);
      existingPositions.push(position);
      const newItem = createFadeItem(cardFood, currentRound, position);
      items.push(newItem);
    }

    for (const foodName of thisRoundFoods) {
      recentFoods.push(foodName);
      if (recentFoods.length > 5) {
        recentFoods.shift();
      }
    }

    // 分批添加卡片，带延迟
    items.forEach((item, index) => {
      const delay = 50 + Math.random() * 50;
      setTimeout(() => {
        fadeItems.value = [...fadeItems.value, item];
      }, delay * index);
    });

    // 同时更新 recentFoods 数组
    recentFoods.push(food.name);
    if (recentFoods.length > 5) {
      recentFoods.shift();
    }

    // 卡片持续时间 - 随机不固定（600ms-1400ms）
    const roundDuration = 600 + Math.random() * 800;

    if (currentRound >= totalRounds) {
      // 最后一轮，结束
      setTimeout(() => {
        revealFinal(targetFood);
      }, roundDuration);
    } else {
      // 进入下一轮，时间间隔也随机不固定
      setTimeout(() => {
        fadeItems.value = [];
        // 随机间隔后开始下一轮（50ms-300ms）
        setTimeout(fadeRound, 50 + Math.random() * 250);
      }, roundDuration - 200);
    }
  }

  // 延迟一点再开始，让用户看到"选择中..."
  setTimeout(fadeRound, 600);
}

let fadeTimer: ReturnType<typeof setTimeout> | null = null;

function stopFading() {
  if (fadeTimer) {
    clearTimeout(fadeTimer);
    fadeTimer = null;
  }
  fadeItems.value = [];
}

// 粒子效果
const showParticles = ref(false);

function revealFinal(food: FoodItem) {
  fadeItems.value = [];

  // 先显示粒子爆发效果
  showParticles.value = true;

  // 粒子爆发后显示最终结果
  setTimeout(() => {
    currentFood.value = food;
    isRandoming.value = false;

    // 隐藏粒子
    setTimeout(() => {
      showParticles.value = false;
    }, 1000);

    // 显示搜索按钮
    if (randomCount.value > 1) {
      setTimeout(() => {
        showSearchButton.value = true;
      }, 800);
    }
  }, 300);
}

// 打开地图选择器
function openMapSelector() {
  showMapSelector.value = true;
}

// 选择地图平台
async function handleMapSelect(platform: string) {
  if (!currentFood.value) return;

  showMapSelector.value = false;

  try {
    // 尝试获取位置
    if (!userLocation.value) {
      try {
        userLocation.value = await getCurrentLocation();
      } catch {
        // 获取位置失败，继续使用不带位置的 URL
      }
    }

    // 构建 URL
    const url = buildMapUrl(
      platform as MapPlatform,
      currentFood.value.name,
      userLocation.value ?? undefined,
    );

    // 打开链接
    window.open(url, "_blank", "noopener,noreferrer");
  } catch (error) {
    console.error("打开地图失败:", error);
  }
}

// ==================== 生命周期 ====================

onMounted(() => {
  // 不再初始化随机食物，等待用户点击选择
  // 预加载所有图片
  preloadImages();
});

onUnmounted(() => {
  stopFading();
});
</script>

<template>
  <div class="app">
    <!-- 背景动画 -->
    <AnimatedBackground />

    <!-- 全局淡入淡出卡片层 -->
    <div v-if="isRandoming" class="global-fade-layer">
      <TransitionGroup name="fade-card" tag="div" class="fade-container">
        <div
          v-for="item in fadeItems"
          :key="item.key"
          class="fade-card"
          :class="{ 'is-loaded': item.imageLoaded }"
          :style="{
            left: `${item.x}%`,
            top: `${item.y}%`,
            '--start-x': `${item.startX}%`,
            '--start-y': `${item.startY}%`,
            '--end-x': `${item.endX}%`,
            '--end-y': `${item.endY}%`,
            transform: `translate(-50%, -50%) scale(${item.scale}) rotate(${item.rotation}deg)`,
            animationDuration: `${item.duration}s`,
          }"
        >
          <div class="card-glow"></div>
          <div class="card-image-wrapper">
            <img
              v-if="item.food.image"
              :src="item.food.image"
              :alt="item.food.name"
              class="fade-image"
              @load="item.imageLoaded = true"
            />
            <div v-if="!item.imageLoaded" class="image-placeholder">
              <span class="placeholder-icon">🍜</span>
            </div>
          </div>
          <div class="fade-name">{{ item.food.name }}</div>
        </div>
      </TransitionGroup>

      <!-- 最终揭示粒子爆发 -->
      <div v-if="showParticles" class="particle-burst">
        <div
          v-for="n in 30"
          :key="n"
          class="burst-particle"
          :style="getParticleStyle(n)"
        ></div>
      </div>
    </div>

    <!-- 主内容 -->
    <main class="main-content">
      <!-- 标题 -->
      <h1 class="app-title">
        <span v-if="isRandoming" class="title-scanning">🔍 AI分析中...</span>
        <span v-else-if="!currentFood" class="title-wait">🎯 今日吃什么？</span>
        <span v-else class="title-result">✨ {{ currentFood.name }}</span>
      </h1>

      <!-- 当前食物展示 -->
      <Transition name="food-reveal" mode="out-in">
        <!-- 初始界面 - 未选择食物 -->
        <div v-if="!currentFood && !isRandoming" class="initial-state">
          <div class="initial-icon">🍴</div>
          <div class="initial-text">点击按钮开始选择</div>
        </div>
        <!-- 随机选择中的动画 -->
        <div v-else-if="isRandoming" class="selecting-indicator">
          <div class="pulse-ring"></div>
          <span>选择中...</span>
        </div>
        <!-- 显示最终结果 -->
        <div
          v-else-if="currentFood"
          :key="currentFood.name"
          class="current-food"
        >
          <img
            v-if="currentFood.image"
            :src="currentFood.image"
            :alt="currentFood.name"
            class="food-image"
            loading="lazy"
          />
          <div class="food-name">{{ currentFood.name }}</div>
        </div>
      </Transition>

      <!-- 主按钮 -->
      <button
        class="action-btn"
        :class="{ 'is-randoming': isRandoming }"
        @click="toggleRandom"
      >
        {{ btnText }}
      </button>

      <!-- 搜索按钮 -->
      <Transition name="fade">
        <button
          v-if="showSearchButton"
          class="search-btn"
          @click="openMapSelector"
        >
          <span>去附近找找</span>
          <svg
            class="search-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </button>
      </Transition>
    </main>

    <!-- 地图选择器 -->
    <MapSelector
      :is-visible="showMapSelector"
      @close="showMapSelector = false"
      @select="handleMapSelect"
    />
  </div>
</template>

<style scoped>
.app {
  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
  overflow-x: hidden;
}

/* 全局淡入淡出卡片层 - 作为背景 */
.global-fade-layer {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.fade-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.fade-card {
  position: absolute;
  display: flex;
  border: 3px solid rgb(0 255 255 / 50%);
  border-radius: 24px;
  padding: 28px 36px;
  opacity: 0.85;
  background: linear-gradient(
    135deg,
    rgb(0 20 40 / 85%) 0%,
    rgb(0 40 60 / 75%) 50%,
    rgb(0 20 40 / 85%) 100%
  );
  flex-direction: column;
  align-items: center;
  gap: 16px;
  box-shadow:
    0 0 30px rgb(0 255 255 / 40%),
    0 0 60px rgb(0 200 255 / 20%),
    0 0 100px rgb(0 150 255 / 10%),
    inset 0 0 40px rgb(0 255 255 / 5%),
    inset 0 0 60px rgb(0 100 200 / 3%);
  backdrop-filter: blur(20px);

  /* 纯淡入淡出动画 - 无滑入效果 */
  animation:
    fade-in-out 0.6s ease-in-out forwards,
    border-glow 0.8s ease-in-out infinite alternate;
}

@keyframes fade-in-out {
  0% {
    opacity: 0;
    filter: blur(10px);
    transform: translate(-50%, -50%) rotateY(90deg) scale(0.5);
  }

  15% {
    opacity: 1;
    filter: blur(0);
    transform: translate(-50%, -50%) rotateY(0deg) scale(1);
  }

  85% {
    opacity: 1;
    filter: blur(0);
    transform: translate(-50%, -50%) rotateY(0deg) scale(1);
  }

  100% {
    opacity: 0;
    filter: blur(10px);
    transform: translate(-50%, -50%) rotateY(-90deg) scale(0.5);
  }
}

.card-glow {
  position: absolute;
  pointer-events: none;
  background: radial-gradient(
    ellipse at center,
    rgb(255 215 0 / 20%) 0%,
    transparent 70%
  );
  inset: -20px;
  animation: glow-pulse 1.5s ease-in-out infinite;
}

@keyframes glow-pulse {
  0%,
  100% {
    opacity: 0.3;
    transform: scale(1);
  }

  50% {
    opacity: 0.5;
    transform: scale(1.1);
  }
}

@keyframes glow-pulse {
  0%,
  100% {
    opacity: 0.5;
    transform: scale(1);
  }

  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}

.card-image-wrapper {
  position: relative;
  border: 2px solid rgb(255 215 0 / 40%);
  border-radius: 16px;
  width: 200px;
  height: 150px;
  opacity: 0.8;
  overflow: hidden;
  box-shadow: 0 8px 32px rgb(0 0 0 / 40%);
}

.fade-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.fade-card.is-loaded .fade-image {
  opacity: 1;
}

.image-placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(255 255 255 / 10%);
}

.placeholder-icon {
  font-size: 3.5rem;
}

.fade-name {
  font-size: 1.6rem;
  font-weight: 800;
  text-shadow: 0 2px 12px rgb(0 0 0 / 80%);
  white-space: nowrap;
  color: rgb(255 255 255 / 70%);
}

/* 粒子爆发效果 */
.particle-burst {
  position: fixed;
  top: 50%;
  left: 50%;
  pointer-events: none;
  transform: translate(-50%, -50%);
  z-index: 200;
}

.burst-particle {
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  width: var(--size);
  height: var(--size);
  background: radial-gradient(
    circle,
    #ffd700 0%,
    #ff8c00 50%,
    transparent 100%
  );
  animation: burst-out var(--duration) ease-out var(--delay) forwards;
}

@keyframes burst-out {
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

/* Transition animations */
.fade-card-enter-active,
.fade-card-leave-active {
  transition:
    opacity 0.5s ease,
    transform 0.5s ease;
}

.fade-card-enter-from {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.3);
}

.fade-card-leave-to {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.2);
}

/* 主内容区域 */
.main-content {
  position: relative;
  display: flex;
  padding: 60px 20px;
  min-height: 100vh;
  min-height: 100dvh;
  z-index: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 40px;
}

.app-title {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-align: center;
  text-shadow: none;
  filter: drop-shadow(0 0 20px rgb(0 245 255 / 50%));
  background: linear-gradient(
    90deg,
    #00f5ff 0%,
    #00d4ff 25%,
    #7b2cbf 50%,
    #00d4ff 75%,
    #00f5ff 100%
  );
  color: #fff;
  background-size: 200% auto;
  background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: title-shimmer 3s linear infinite;
}

.title-wait {
  animation: title-pulse 2s ease-in-out infinite;
}

.title-result {
  animation: title-glow 1.5s ease-in-out infinite alternate;
}

.title-scanning {
  animation: title-scan 1s ease-in-out infinite;
}

@keyframes title-shimmer {
  0% {
    background-position: 0% center;
  }

  100% {
    background-position: 200% center;
  }
}

@keyframes title-pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }

  50% {
    opacity: 0.8;
    transform: scale(1.02);
  }
}

@keyframes title-glow {
  0% {
    filter: drop-shadow(0 0 20px rgb(0 245 255 / 50%));
  }

  100% {
    filter: drop-shadow(0 0 40px rgb(123 44 191 / 80%));
  }
}

@keyframes title-scan {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.6;
  }
}

/* 当前食物展示 */
.current-food {
  display: flex;
  border: 2px solid rgb(255 215 0 / 30%);
  border-radius: 24px;
  padding: 30px 50px;
  background: rgb(255 255 255 / 8%);
  flex-direction: column;
  align-items: center;
  gap: 20px;
  box-shadow:
    0 0 40px rgb(255 200 50 / 30%),
    0 0 80px rgb(255 150 0 / 15%),
    inset 0 0 30px rgb(255 255 255 / 5%);
  backdrop-filter: blur(10px);
  animation: final-reveal-appear 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes final-reveal-appear {
  0% {
    opacity: 0;
    transform: scale(0.3) rotate(-10deg);
  }

  50% {
    transform: scale(1.15) rotate(3deg);
  }

  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}

.food-image {
  border: 3px solid rgb(255 215 0 / 40%);
  border-radius: 18px;
  width: 180px;
  height: 135px;
  object-fit: cover;
  box-shadow: 0 10px 40px rgb(0 0 0 / 60%);
}

.food-name {
  font-size: 2.2rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-shadow:
    0 0 20px rgb(255 215 0 / 80%),
    0 0 40px rgb(255 150 0 / 50%),
    0 2px 8px rgb(0 0 0 / 50%);
  color: #ffd700;
}

/* 初始状态 */
.initial-state {
  display: flex;
  border: 1px solid rgb(0 245 255 / 30%);
  border-radius: 24px;
  padding: 50px 40px;
  background: linear-gradient(
    135deg,
    rgb(0 245 255 / 10%) 0%,
    rgb(123 44 191 / 10%) 100%
  );
  flex-direction: column;
  align-items: center;
  gap: 24px;
  backdrop-filter: blur(10px);
  box-shadow:
    0 0 30px rgb(0 245 255 / 20%),
    inset 0 0 30px rgb(0 245 255 / 5%);
}

.initial-icon {
  font-size: 5rem;
  animation: tech-float 2.5s ease-in-out infinite;
  filter: drop-shadow(0 0 20px rgb(0 245 255 / 60%));
}

.initial-text {
  font-size: 1.1rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgb(0 245 255 / 80%);
}

@keyframes tech-float {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }

  25% {
    transform: translateY(-8px) rotate(2deg);
  }

  50% {
    transform: translateY(0) rotate(0deg);
  }

  75% {
    transform: translateY(-4px) rotate(-2deg);
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }
}

/* 选择中指示器 */
.selecting-indicator {
  display: flex;
  font-size: 1.1rem;
  letter-spacing: 0.1em;
  color: rgb(255 255 255 / 60%);
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.pulse-ring {
  border: 3px solid rgb(255 215 0 / 40%);
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: pulse-ring 1.5s ease-out infinite;
}

@keyframes pulse-ring {
  0% {
    opacity: 1;
    transform: scale(0.8);
  }

  100% {
    opacity: 0;
    transform: scale(1.5);
  }
}

/* 食物揭示动画 - 简化，因为已经有专门的动画 */
.food-reveal-enter-active {
  transition: opacity 0.4s ease;
}

.food-reveal-leave-active {
  transition: opacity 0.2s ease;
}

.food-reveal-enter-from,
.food-reveal-leave-to {
  opacity: 0;
}

/* 按钮样式 */
.action-btn {
  border: none;
  border-radius: 50px;
  padding: 20px 64px;
  font-size: 1.3rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%);
  color: #fff;
  cursor: pointer;
  transition:
    transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.3s ease;
  box-shadow:
    0 4px 20px rgb(255 107 107 / 40%),
    0 0 0 0 rgb(255 107 107 / 40%);
}

.action-btn:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow:
    0 8px 30px rgb(255 107 107 / 50%),
    0 0 0 4px rgb(255 107 107 / 20%);
}

.action-btn:active {
  transform: translateY(-1px) scale(0.98);
}

.action-btn.is-randoming {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  animation: pulse-scale 0.5s ease-in-out infinite;
  box-shadow:
    0 4px 20px rgb(102 126 234 / 40%),
    0 0 0 0 rgb(102 126 234 / 40%);
}

.action-btn.is-randoming:hover {
  transform: translateY(-2px);
  box-shadow:
    0 6px 25px rgb(102 126 234 / 50%),
    0 0 0 4px rgb(102 126 234 / 20%);
}

@keyframes pulse-scale {
  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.05);
  }
}

/* 搜索按钮 */
.search-btn {
  display: flex;
  border: 1px solid rgb(255 255 255 / 15%);
  border-radius: 50px;
  padding: 14px 28px;
  font-size: 1rem;
  font-weight: 500;
  background: rgb(255 255 255 / 8%);
  color: rgb(255 255 255 / 85%);
  cursor: pointer;
  align-items: center;
  gap: 10px;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  backdrop-filter: blur(10px);
}

.search-btn:hover {
  transform: translateY(-3px);
  background: rgb(255 255 255 / 12%);
  border-color: rgb(255 255 255 / 25%);
  box-shadow: 0 10px 30px rgb(0 0 0 / 20%);
}

.search-btn:active {
  transform: translateY(-1px);
}

.search-icon {
  width: 20px;
  height: 20px;
}

/* 淡入淡出动画 */
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.4s ease,
    transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* 响应式 */
@media (width <= 480px) {
  .main-content {
    padding: 40px 16px;
    gap: 30px;
  }

  .app-title {
    font-size: 1.4rem;
  }

  .current-food {
    padding: 20px 30px;
  }

  .food-image {
    width: 140px;
    height: 105px;
  }

  .food-name {
    font-size: 1.6rem;
  }

  .action-btn {
    padding: 16px 48px;
    font-size: 1.1rem;
  }

  .search-btn {
    padding: 12px 24px;
    font-size: 0.95rem;
  }

  .fade-card {
    padding: 18px 24px;
  }

  .card-image-wrapper {
    width: 150px;
    height: 112px;
  }

  .fade-name {
    font-size: 1.2rem;
  }
}

/* 减少动画 */
@media (prefers-reduced-motion: reduce) {
  .action-btn,
  .search-btn,
  .fade-card,
  .current-food,
  .pulse-ring {
    transition: none;
    animation: none !important;
  }
}
</style>
