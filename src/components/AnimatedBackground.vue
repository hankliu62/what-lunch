<template>
  <div class="animated-background">
    <div class="gradient-orb orb-1"></div>
    <div class="gradient-orb orb-2"></div>
    <div class="gradient-orb orb-3"></div>
    <div class="noise-overlay"></div>
  </div>
</template>

<script setup lang="ts">
// Background animation component with floating gradient orbs
</script>

<style scoped>
.animated-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%);
  overflow: hidden;
  z-index: 0;
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  opacity: 0.5;
  filter: blur(80px);
  animation: float 20s ease-in-out infinite;
  will-change: transform;
}

.orb-1 {
  top: -200px;
  left: -200px;
  width: 600px;
  height: 600px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  animation-delay: 0s;
}

.orb-2 {
  right: -150px;
  bottom: -150px;
  width: 500px;
  height: 500px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  animation-delay: -7s;
}

.orb-3 {
  top: 50%;
  left: 50%;
  width: 400px;
  height: 400px;
  transform: translate(-50%, -50%);
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  animation-delay: -14s;
}

.noise-overlay {
  position: absolute;
  pointer-events: none;
  opacity: 0.03;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
}

@keyframes float {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }

  25% {
    transform: translate(50px, -50px) scale(1.05);
  }

  50% {
    transform: translate(0, -100px) scale(1);
  }

  75% {
    transform: translate(-50px, -50px) scale(0.95);
  }
}

/* Respect reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  .gradient-orb {
    animation: none;
  }
}
</style>
