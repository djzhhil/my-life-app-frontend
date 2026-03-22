<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app';
import { useUserStore } from '@/store/user';
import { useCategoryStore } from '@/store/category';

const userStore = useUserStore();
const categoryStore = useCategoryStore();

onLaunch(() => {
  console.log('App Launch');
  // 初始化用户信息（恢复登录状态）
  userStore.init();
});

onShow(() => {
  console.log('App Show');
});

onHide(() => {
  console.log('App Hide');
});
</script>

<style lang="scss">
/* 全局样式 */
page {
  background-color: #f5f5f5;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* 全局清除浮动 */
.clearfix::after {
  content: '';
  display: table;
  clear: both;
}

/* 全局文本省略 */
.text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 全局居中容器 */
.center-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>