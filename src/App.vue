<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import classNames from "classnames";
import "./app.less";

// 组件自动注册
import FlickerFont from "./components/FlickerFont.vue";

import { isMobile } from "./utils/platform";

// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
// import HelloWorld from './components/HelloWorld.vue'
import { ref, computed, reactive } from "vue";

const lunch = ref<string>(
  "馄饨 拉面 烩面 热干面 刀削面 油泼面 炸酱面 炒面 重庆小面 米线 酸辣粉 土豆粉 螺狮粉 凉皮… 川菜 麻辣香锅 火锅 酸菜鱼 烤串 披萨 烤鸭 汉堡 炸鸡 寿司 蟹黄包 煎饼果子 生煎 炒年糕",
);
const lunches = computed(() => {
  return lunch.value.trim().split(/\s+/);
});

// 属性和方法无需返回，直接使用，使用`ref`,`reactive`定义响应式数据；使用`computed`定义计算属性数据
// 是否正在随机食物
const isRandoming = ref<boolean>(false);
// 已经随机食物次数
const randomedCount = ref<number>(1);
// 正在随机食物定时器
const randomingTimer = ref<number>(0);
// 随机到的食物
const randomedLunch = ref<string>();

const link = computed(() =>
  isMobile()
    ? `https://m.dianping.com/shoplist/1/search?from=m_search&keyword=${randomedLunch.value}`
    : `https://www.dianping.com/search/keyword/203/0_${randomedLunch.value}`,
);

const flickerLunches = reactive<
  {
    uuid: string;
    name: string;
    top: number;
    left: number;
    fontSize: number;
    show: boolean;
  }[]
>([]);

function uuid() {
  return [8, 4, 4, 4, 12]
    .map((len) =>
      Math.random()
        .toString(16)
        .slice(2, len + 2),
    )
    .join("-");
}
// 开始/停止随机食物
const toggleRandomLunch = () => {
  // 开始随机食物
  if (!isRandoming.value) {
    if (randomedCount.value >= 4) {
      alert("这么作，今天别吃了！🐶");
      randomedCount.value++;
      return;
    }

    randomedCount.value++;
    randomingTimer.value = setInterval(() => {
      const filteredLunches = lunches.value.filter(
        (item: string) => item !== randomedLunch.value,
      );
      const name = filteredLunches[~~(Math.random() * filteredLunches.length)];
      randomedLunch.value = name;
      const flickerLunch = reactive({
        uuid: uuid(),
        name,
        top: ~~(
          Math.random() *
          window.document.documentElement.getBoundingClientRect().height
        ),
        left: ~~(
          Math.random() *
          (window.document.documentElement.getBoundingClientRect().width - 50)
        ),
        fontSize: ~~(Math.random() * (lunches.value.length - 14) + 14),
        show: false,
      });

      flickerLunches.push(flickerLunch);
      setTimeout(() => {
        flickerLunch.show = true;

        setTimeout(() => {
          flickerLunch.show = false;

          setTimeout(() => {
            const index = flickerLunches.indexOf(flickerLunch);
            flickerLunches.splice(index, 1);
          }, 1000);
        }, 1000);
      }, 0);
    }, 50) as any;
  } else {
    clearInterval(randomingTimer.value);
    randomingTimer.value = 0;
  }
  isRandoming.value = !isRandoming.value;
};

// 获得当前按钮的文案
const btnContent = computed(() => {
  if (isRandoming.value) {
    return "停止";
  }

  if (randomedCount.value === 1) {
    return "开始";
  }

  return "不喜欢，换一个";
});
</script>

<template>
  <div class="container">
    <textarea class="input textarea hidden" :value="lunch"></textarea>
    <div class="panel">
      <h1
        class="header"
        v-text="isRandoming ? '中午吃什么？吃什么？' : '中午吃什么，吃这个！'"
      ></h1>
      <h2 class="random-content">
        <a
          class="random-link"
          :href="link"
          v-text="randomedLunch"
          rel="noreferrer noopener"
        ></a>
      </h2>
      <button
        class="btn btn-default btn-start"
        :class="classNames({ 'v-hidden': randomedCount > 4 })"
        v-text="btnContent"
        @click="toggleRandomLunch"
      />
    </div>

    <transition
      name="fade"
      v-for="flickerLunch in flickerLunches"
      :key="flickerLunch.uuid"
    >
      <flicker-font
        v-show="flickerLunch.show"
        :top="flickerLunch.top"
        :left="flickerLunch.left"
        :font-size="flickerLunch.fontSize"
      >
        <span v-text="flickerLunch.name"></span>
      </flicker-font>
    </transition>
  </div>
</template>

<style lang="less" scoped>
:global(#app) {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--color-text-dark);
  height: 100%;
  width: 100%;
  background-color: var(--color-bg);
}

.container {
  height: 100%;
  width: 100%;
  position: relative;

  .panel {
    position: absolute;
    z-index: 2;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .header {
      margin-bottom: 50px;
      font-weight: 300;
      font-size: 2.5em;
    }
  }

  @media (max-width: 760px) {
    .panel {
      width: 90%;
      .header {
        font-size: 2.2em;
        text-align: center;
      }
    }
  }
}
.btn {
  display: inline-block;
  text-align: center;
  touch-action: manipulation;
  cursor: pointer;
  background-color: transparent;
  border: 1px solid transparent;
  outline: none;
  white-space: nowrap;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  position: relative;
  font-size: 14px;
  line-height: 22px;
  padding: 6px 16px;
  height: 36px;
  border-radius: 4px;
  transition: 0.3s;
}

.btn-default {
  color: var(--color-text);
  background-color: #fff;
  border-color: var(--color-border);

  &:hover {
    border-color: var(--color-border);
    background-color: var(--color-bg-light);
  }
}

.btn-start {
  color: var(--color-text-dark);
  background-color: transparent;
  border-color: var(--color-border);
  padding: 8px 46px;
  height: 38px;
}

.input {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-variant: tabular-nums;
  list-style: none;
  font-feature-settings: "tnum";
  position: relative;
  display: inline-block;
  width: 100%;
  height: 36px;
  padding: 6px 16px;
  color: var(--color-text-dark);
  font-size: 14px;
  line-height: 1.7;
  background-color: #fff;
  background-image: none;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  transition: all 0.3s;

  .textarea {
    max-width: 100%;
    height: auto;
    min-height: 36px;
    line-height: 1.7;
    vertical-align: bottom;
    transition:
      all 0.3s,
      height 0s;
  }

  &:focus {
    border-color: var(--color-primary);
    border-right-width: 1px !important;
    outline: 0;
    box-shadow: 0 0 0 0 var(--color-primary);
  }

  &:hover {
    border-color: var(--color-primary);
    border-right-width: 1px !important;
  }
}

.random-content {
  color: #ff9733;
  font-size: 2em;
  height: 40px;

  .random-link {
    color: #ff9733;
    text-decoration: none;
    cursor: pointer;
  }
}

.hidden {
  display: none;
}

.v-hidden {
  visibility: hidden;
}

// 过度进入时初始状态
.fade-enter-from {
  opacity: 0;
}

// 进入过度结束状态 & 过度结束离开初始状态
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}

// 过度结束状态
.fade-leave-to {
  opacity: 0;
}

// 过度动效
.fade-enter-active,
.fade-leave-active {
  transition: all 1s ease;
}
</style>
