<template>
  <view class="confetti-container">
    <canvas
      :canvas-id="canvasId"
      :id="canvasId"
      class="confetti-canvas"
      :style="canvasStyle"
    ></canvas>
  </view>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue';

const props = defineProps({
  canvasId: {
    type: String,
    default: 'confetti',
  },
  duration: {
    type: Number,
    default: 3000, // 3 秒
  },
  particleCount: {
    type: Number,
    default: 100, // 粒子数量
  },
  width: {
    type: Number,
    default: 750, // 屏幕宽度
  },
  height: {
    type: Number,
    default: 1334, // 屏幕高度
  },
});

const isVisible = ref(false);
let ctx: any = null;
let particles: any[] = [];
let animationFrameId: number = 0;
let timeoutId: number = 0;

// 粒子类
class Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  speedX: number;
  speedY: number;
  gravity: number;
  rotation: number;
  rotationSpeed: number;

  constructor(x: number, y: number, color: string) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 8 + 4; // 4-12rpx
    this.color = color;
    this.speedX = (Math.random() - 0.5) * 10;
    this.speedY = -Math.random() * 15 - 5;
    this.gravity = 0.5;
    this.rotation = Math.random() * 360;
    this.rotationSpeed = (Math.random() - 0.5) * 10;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.speedY += this.gravity;
    this.rotation += this.rotationSpeed;
  }

  draw(context: any) {
    context.save();
    context.translate(this.x, this.y);
    context.rotate((this.rotation * Math.PI) / 180);
    context.fillStyle = this.color;
    context.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    context.restore();
  }
}

// 颜色数组
const colors = [
  '#ff6b6b', '#51cf66', '#339af0', '#fcc419',
  '#9775fa', '#228be6', '#fa5252', '#40c057',
  '#15aabf', '#862e9c', '#e03131', '#12b886',
];

// 初始化画布
function initCanvas() {
  const query = uni.createSelectorQuery();
  query.select(`#${props.canvasId}`)
    .fields({ node: true, size: true })
    .exec((res) => {
      if (res[0]) {
        const canvas = res[0].node;
        ctx = canvas.getContext('2d');
        canvas.width = props.width;
        canvas.height = props.height;
      }
    });
}

// 创建粒子
function createParticles() {
  particles = [];
  for (let i = 0; i < props.particleCount; i++) {
    const x = Math.random() * props.width;
    const y = -20; // 从屏幕上方开始
    const color = colors[Math.floor(Math.random() * colors.length)];
    particles.push(new Particle(x, y, color));
  }
}

// 动画循环
function animate() {
  if (!ctx) return;

  ctx.clearRect(0, 0, props.width, props.height);

  particles.forEach((particle) => {
    particle.update();
    particle.draw(ctx);
  });

  // 移除屏幕外的粒子
  particles = particles.filter((p) => p.y < props.height + 20);

  if (particles.length > 0) {
    animationFrameId = requestAnimationFrame(animate);
  }
}

// 触发彩带
function play() {
  if (isVisible.value) return;

  isVisible.value = true;

  // 等待画布初始化
  uni.nextTick(() => {
    initCanvas();

    setTimeout(() => {
      createParticles();
      animate();

      // 清理
      timeoutId = setTimeout(() => {
        cancelAnimationFrame(animationFrameId);
        isVisible.value = false;
        particles = [];
        if (ctx) {
          ctx.clearRect(0, 0, props.width, props.height);
        }
      }, props.duration);
    }, 100);
  });
}

// 暴露方法
defineExpose({
  play,
});

onUnmounted(() => {
  cancelAnimationFrame(animationFrameId);
  clearTimeout(timeoutId);
});

const canvasStyle = {
  width: `${props.width}rpx`,
  height: `${props.height}rpx`,
};
</script>

<style lang="scss" scoped>
.confetti-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
}

.confetti-canvas {
  display: block;
}
</style>
