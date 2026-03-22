<template>
  <div class="food-card" :class="{ 'is-visible': isVisible }">
    <div class="food-image-container">
      <img
        :src="foodImage"
        :alt="foodName"
        class="food-image"
        loading="eager"
      />
      <div class="food-image-overlay"></div>
      <div class="food-image-shimmer"></div>
    </div>
    <div class="food-name-container">
      <h1 class="food-name">{{ foodName }}</h1>
      <div class="food-name-glow"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  foodName: string;
  foodImage: string;
  isVisible?: boolean;
}

withDefaults(defineProps<Props>(), {
  isVisible: false,
});
</script>

<style scoped>
.food-card {
  position: relative;
  border-radius: 24px;
  width: 100%;
  max-width: 420px;
  opacity: 0;
  transform: scale(0.8) translateY(20px);
  overflow: hidden;
  aspect-ratio: 4/3;
  transition:
    opacity 0.6s cubic-bezier(0.34, 1.56, 0.64, 1),
    transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow:
    0 4px 6px rgb(0 0 0 / 10%),
    0 20px 50px rgb(0 0 0 / 40%),
    0 0 0 1px rgb(255 255 255 / 10%) inset;
}

.food-card.is-visible {
  opacity: 1;
  transform: scale(1) translateY(0);
}

.food-image-container {
  position: absolute;
  inset: 0;
}

.food-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.food-card:hover .food-image {
  transform: scale(1.05);
}

.food-image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgb(0 0 0 / 10%) 0%,
    rgb(0 0 0 / 30%) 50%,
    rgb(0 0 0 / 80%) 100%
  );
}

.food-image-shimmer {
  position: absolute;
  transform: translateX(-100%);
  background: linear-gradient(
    110deg,
    transparent 20%,
    rgb(255 255 255 / 10%) 40%,
    rgb(255 255 255 / 20%) 50%,
    rgb(255 255 255 / 10%) 60%,
    transparent 80%
  );
  inset: 0;
  animation: shimmer 3s infinite;
}

.food-name-container {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 32px 24px;
  text-align: center;
  z-index: 2;
}

.food-name {
  position: relative;
  margin: 0;
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-shadow:
    0 2px 4px rgb(0 0 0 / 30%),
    0 4px 20px rgb(0 0 0 / 50%);
  color: #fff;
  z-index: 1;
}

.food-name-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200%;
  height: 200%;
  pointer-events: none;
  transform: translate(-50%, -50%);
  background: radial-gradient(
    circle at center,
    rgb(255 107 107 / 50%) 0%,
    rgb(254 202 87 / 30%) 30%,
    transparent 70%
  );
  z-index: 0;
  animation: pulse-glow 2s ease-in-out infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(100%);
  }
}

@keyframes pulse-glow {
  0%,
  100% {
    opacity: 0.6;
    transform: translate(-50%, -50%) scale(1);
  }

  50% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.1);
  }
}

/* Responsive */
@media (width <= 480px) {
  .food-card {
    border-radius: 20px;
    max-width: 100%;
  }

  .food-name {
    font-size: 2rem;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .food-image-shimmer {
    animation: none;
  }

  .food-name-glow {
    animation: none;
  }

  .food-card,
  .food-image {
    transition: none;
  }
}
</style>
