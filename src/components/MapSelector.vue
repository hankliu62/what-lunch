<template>
  <Teleport to="body">
    <Transition name="slide-up">
      <div
        v-if="isVisible"
        class="map-selector-overlay"
        @click.self="$emit('close')"
      >
        <div class="map-selector-panel" role="dialog" aria-label="选择地图应用">
          <div class="panel-handle"></div>
          <h3 class="panel-title">选择地图应用</h3>
          <div class="map-apps">
            <button
              v-for="app in mapApps"
              :key="app.id"
              class="map-app-btn"
              :aria-label="`使用 ${app.name} 搜索`"
              @click="$emit('select', app.id)"
            >
              <div class="app-icon-wrapper">
                <img
                  :src="app.icon"
                  :alt="app.name"
                  class="app-icon"
                  loading="lazy"
                />
              </div>
              <span class="app-name">{{ app.name }}</span>
            </button>
          </div>
          <p class="panel-hint">将在浏览器中打开地图搜索</p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
interface MapApp {
  id: string;
  name: string;
  icon: string;
}

defineProps<{
  isVisible: boolean;
}>();

defineEmits<{
  (e: "close"): void;
  (e: "select", platform: string): void;
}>();

const mapApps: MapApp[] = [
  {
    id: "dianping",
    name: "大众点评",
    icon: "/icons/dianping.svg",
  },
  {
    id: "baidu",
    name: "百度地图",
    icon: "/icons/baidu.svg",
  },
  {
    id: "amap",
    name: "高德地图",
    icon: "/icons/amap.svg",
  },
  {
    id: "tencent",
    name: "腾讯地图",
    icon: "/icons/tencent.svg",
  },
];
</script>

<style scoped>
.map-selector-overlay {
  position: fixed;
  display: flex;
  background: rgb(0 0 0 / 60%);
  z-index: 1000;
  inset: 0;
  backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
  align-items: flex-end;
  justify-content: center;
}

.map-selector-panel {
  border: 1px solid rgb(255 255 255 / 10%);
  border-radius: 28px 28px 0 0;
  padding: 12px 24px 40px;
  width: 100%;
  max-width: 480px;
  background: linear-gradient(
    180deg,
    rgb(40 40 55 / 98%) 0%,
    rgb(30 30 45 / 98%) 100%
  );
  backdrop-filter: blur(40px);
  backdrop-filter: blur(40px);
  border-bottom: none;
  box-shadow: 0 -10px 40px rgb(0 0 0 / 30%);
}

.panel-handle {
  margin: 0 auto 20px;
  border-radius: 2px;
  width: 40px;
  height: 4px;
  background: rgb(255 255 255 / 30%);
}

.panel-title {
  margin-bottom: 24px;
  font-size: 1.2rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-align: center;
  color: #fff;
}

.map-apps {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.map-app-btn {
  display: flex;
  border: 1px solid rgb(255 255 255 / 10%);
  border-radius: 16px;
  padding: 20px 12px;
  background: rgb(255 255 255 / 5%);
  cursor: pointer;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  transition:
    all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
    transform 0.2s ease;
}

.map-app-btn:hover {
  transform: translateY(-4px);
  background: rgb(255 255 255 / 12%);
  border-color: rgb(255 255 255 / 20%);
}

.map-app-btn:active {
  transform: translateY(-2px) scale(0.98);
}

.app-icon-wrapper {
  display: flex;
  border-radius: 14px;
  width: 56px;
  height: 56px;
  background: rgb(255 255 255 / 10%);
  overflow: hidden;
  align-items: center;
  justify-content: center;
  transition: transform 0.25s ease;
}

.map-app-btn:hover .app-icon-wrapper {
  transform: scale(1.05);
}

.app-icon {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.app-name {
  font-size: 0.85rem;
  font-weight: 500;
  color: rgb(255 255 255 / 90%);
}

.panel-hint {
  margin-top: 20px;
  font-size: 0.8rem;
  text-align: center;
  color: rgb(255 255 255 / 40%);
}

/* Transition animations */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.35s cubic-bezier(0.32, 0.72, 0, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
}

.slide-up-enter-from .map-selector-panel,
.slide-up-leave-to .map-selector-panel {
  transform: translateY(100%);
}

.slide-up-enter-to,
.slide-up-leave-from {
  opacity: 1;
}

.slide-up-enter-to .map-selector-panel,
.slide-up-leave-from .map-selector-panel {
  transform: translateY(0);
}

/* Mobile responsive */
@media (width <= 380px) {
  .map-apps {
    gap: 8px;
  }

  .map-app-btn {
    padding: 16px 8px;
  }

  .app-icon-wrapper {
    width: 48px;
    height: 48px;
  }

  .app-name {
    font-size: 0.75rem;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .slide-up-enter-active,
  .slide-up-leave-active {
    transition: opacity 0.2s ease;
  }

  .slide-up-enter-from .map-selector-panel,
  .slide-up-leave-to .map-selector-panel {
    transform: none;
  }

  .map-app-btn,
  .app-icon-wrapper {
    transition: none;
  }
}
</style>
