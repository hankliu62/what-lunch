<script setup lang="ts">
/**
 * What-Lunch 2.0
 * 高级感美食随机选择器
 */
import { ref, computed, onMounted, onUnmounted } from "vue";
import "./app.less";

// 组件
import AnimatedBackground from "./components/AnimatedBackground.vue";
import FoodCard from "./components/FoodCard.vue";
import MapSelector from "./components/MapSelector.vue";

// 数据
import { getRandomFood, type FoodItem } from "./data/foods";

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

// 是否显示食物卡片
const isCardVisible = ref(false);

// 是否显示地图选择器
const showMapSelector = ref(false);

// 用户位置
const userLocation = ref<{ latitude: number; longitude: number } | null>(null);

// 随机定时器
let randomTimer: ReturnType<typeof setInterval> | null = null;

// ==================== 计算属性 ====================

// 按钮文案
const btnText = computed(() => {
  if (isRandoming.value) return "停止";
  if (randomCount.value === 1) return "开始";
  return "换一个";
});

// 是否显示搜索按钮
const showSearchButton = computed(() => {
  return !isRandoming.value && currentFood.value && randomCount.value > 1;
});

// ==================== 方法 ====================

// 开始/停止随机
function toggleRandom() {
  if (isRandoming.value) {
    stopRandom();
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
  isCardVisible.value = false;

  // 快速切换食物
  randomTimer = setInterval(() => {
    const food = getRandomFood();
    // 避免和当前食物重复
    if (food.name !== currentFood.value?.name) {
      currentFood.value = food;
    }
  }, 80);
}

// 停止随机
function stopRandom() {
  if (randomTimer) {
    clearInterval(randomTimer);
    randomTimer = null;
  }
  isRandoming.value = false;

  // 确保有选中的食物
  if (!currentFood.value) {
    currentFood.value = getRandomFood();
  }

  // 延迟显示卡片动画
  setTimeout(() => {
    isCardVisible.value = true;
  }, 100);
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
  // 初始化随机一个食物
  currentFood.value = getRandomFood();

  // 初始显示
  setTimeout(() => {
    isCardVisible.value = true;
  }, 300);
});

onUnmounted(() => {
  if (randomTimer) {
    clearInterval(randomTimer);
  }
});
</script>

<template>
  <div class="app">
    <!-- 背景动画 -->
    <AnimatedBackground />

    <!-- 主内容 -->
    <main class="main-content">
      <!-- 标题 -->
      <h1 class="app-title">
        {{ isRandoming ? "选啥好呢..." : "中午吃什么" }}
      </h1>

      <!-- 食物卡片 -->
      <FoodCard
        v-if="currentFood"
        :food-name="currentFood.name"
        :food-image="currentFood.image"
        :is-visible="isCardVisible"
      />

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

.main-content {
  position: relative;
  display: flex;
  padding: 40px 20px;
  min-height: 100vh;
  min-height: 100dvh;
  z-index: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 32px;
}

.app-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-align: center;
  color: rgb(255 255 255 / 70%);
}

.action-btn {
  border: none;
  border-radius: 50px;
  padding: 18px 56px;
  font-size: 1.2rem;
  font-weight: 600;
  letter-spacing: 0.05em;
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

@keyframes pulse-scale {
  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.05);
  }
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
    padding: 30px 16px;
    gap: 24px;
  }

  .app-title {
    font-size: 1.2rem;
  }

  .action-btn {
    padding: 16px 48px;
    font-size: 1.1rem;
  }

  .search-btn {
    padding: 12px 24px;
    font-size: 0.95rem;
  }
}

/* 减少动画 */
@media (prefers-reduced-motion: reduce) {
  .action-btn,
  .search-btn {
    transition: none;
  }

  .action-btn.is-randoming {
    animation: none;
  }
}
</style>
