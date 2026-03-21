<template>
  <view class="create-container">
    <view class="form-section">
      <!-- 标题 -->
      <view class="form-item">
        <view class="form-item__label">任务标题</view>
        <view class="form-item__input">
          <textarea
            v-model="form.title"
            placeholder="输入任务标题（1-100字符）"
            :maxlength="100"
            class="textarea"
          />
        </view>
      </view>

      <!-- 描述 -->
      <view class="form-item">
        <view class="form-item__label">任务描述</view>
        <view class="form-item__input">
          <textarea
            v-model="form.description"
            placeholder="输入任务描述（可选，0-500字符）"
            :maxlength="500"
            class="textarea"
          />
        </view>
      </view>

      <!-- 分类 -->
      <view class="form-item">
        <view class="form-item__label">任务分类</view>
        <view class="form-item__selector">
          <view
            v-for="cat in categories"
            :key="cat.value"
            class="selector-item"
            :class="{ active: form.category === cat.value }"
            :style="{ borderColor: form.category === cat.value ? cat.color : '' }"
            @click="handleCategorySelect(cat.value)"
          >
            <text class="selector-item__icon">{{ cat.icon }}</text>
            <text class="selector-item__label">{{ cat.label }}</text>
          </view>
        </view>
      </view>

      <!-- 优先级 -->
      <view class="form-item">
        <view class="form-item__label">优先级</view>
        <view class="form-item__selector">
          <view
            v-for="prio in priorities"
            :key="prio.value"
            class="selector-item--simple"
            :class="{ active: form.priority === prio.value }"
            @click="handlePrioritySelect(prio.value)"
          >
            <text>{{ prio.label }}</text>
          </view>
        </view>
      </view>

      <!-- 截止日期 -->
      <view class="form-item">
        <view class="form-item__label">截止日期</view>
        <view class="form-item__input" @click="showDatePicker">
          <view class="input">
            <text v-if="form.dueDate" class="input__text">{{ form.dueDate }}</text>
            <text v-else class="input__placeholder">选择截止日期（可选）</text>
            <text class="input__arrow">›</text>
          </view>
        </view>
      </view>

      <!-- 经验值奖励 -->
      <view class="form-item">
        <view class="form-item__label">EXP 奖励</view>
        <view class="form-item__input">
          <view class="input">
            <text class="input__icon">⚡</text>
            <input
              v-model.number="form.expReward"
              type="number"
              placeholder="1-10000"
              class="input__field"
            />
          </view>
        </view>
      </view>

      <!-- 金币奖励 -->
      <view class="form-item">
        <view class="form-item__label">金币奖励</view>
        <view class="form-item__input">
          <view class="input">
            <text class="input__icon">💎</text>
            <input
              v-model.number="form.coinReward"
              type="number"
              placeholder="1-10000"
              class="input__field"
            />
          </view>
        </view>
      </view>
    </view>

    <!-- 创建按钮 -->
    <view class="submit-section">
      <button class="submit-btn" @click="handleSubmit">创建任务</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { TaskCreateDTO, TaskCategory, TaskPriority } from '@/types/api';
import { TASK_CATEGORY_NAMES, TASK_CATEGORY_ICONS, TASK_CATEGORY_COLORS } from '@/types/api';
import { useTaskStore } from '@/store/task';

const taskStore = useTaskStore();

// 表单数据
const form = ref<TaskCreateDTO>({
  title: '',
  description: '',
  category: TaskCategory.GENERAL,
  priority: TaskPriority.MEDIUM,
  dueDate: '',
  expReward: 10,
  coinReward: 10,
});

// 分类选项
const categories = [
  { value: TaskCategory.GENERAL, label: TASK_CATEGORY_NAMES[TaskCategory.GENERAL], icon: TASK_CATEGORY_ICONS[TaskCategory.GENERAL], color: TASK_CATEGORY_COLORS[TaskCategory.GENERAL] },
  { value: TaskCategory.STUDY, label: TASK_CATEGORY_NAMES[TaskCategory.STUDY], icon: TASK_CATEGORY_ICONS[TaskCategory.STUDY], color: TASK_CATEGORY_COLORS[TaskCategory.STUDY] },
  { value: TaskCategory.WORK, label: TASK_CATEGORY_NAMES[TaskCategory.WORK], icon: TASK_CATEGORY_ICONS[TaskCategory.WORK], color: TASK_CATEGORY_COLORS[TaskCategory.WORK] },
  { value: TaskCategory.EXERCISE, label: TASK_CATEGORY_NAMES[TaskCategory.EXERCISE], icon: TASK_CATEGORY_ICONS[TaskCategory.EXERCISE], color: TASK_CATEGORY_COLORS[TaskCategory.EXERCISE] },
  { value: TaskCategory.LIFE, label: TASK_CATEGORY_NAMES[TaskCategory.LIFE], icon: TASK_CATEGORY_ICONS[TaskCategory.LIFE], color: TASK_CATEGORY_COLORS[TaskCategory.LIFE] },
  { value: TaskCategory.CREATIVE, label: TASK_CATEGORY_NAMES[TaskCategory.CREATIVE], icon: TASK_CATEGORY_ICONS[TaskCategory.CREATIVE], color: TASK_CATEGORY_COLORS[TaskCategory.CREATIVE] },
];

// 优先级选项
const priorities = [
  { value: TaskPriority.HIGH, label: '高' },
  { value: TaskPriority.MEDIUM, label: '中' },
  { value: TaskPriority.LOW, label: '低' },
];

function handleCategorySelect(category: number) {
  form.value.category = category;
}

function handlePrioritySelect(priority: number) {
  form.value.priority = priority;
}

function showDatePicker() {
  uni.showModal({
    title: '提示',
    content: '日期选择器功能待实现',
    showCancel: false,
  });
}

async function handleSubmit() {
  // 验证
  if (!form.value.title.trim()) {
    uni.showToast({ title: '请输入任务标题', icon: 'none' });
    return;
  }

  if (form.value.title.trim().length < 1 || form.value.title.trim().length > 100) {
    uni.showToast({ title: '标题长度应为1-100字符', icon: 'none' });
    return;
  }

  if (form.value.expReward < 1 || form.value.expReward > 10000) {
    uni.showToast({ title: 'EXP奖励应为1-10000', icon: 'none' });
    return;
  }

  if (form.value.coinReward < 1 || form.value.coinReward > 10000) {
    uni.showToast({ title: '金币奖励应为1-10000', icon: 'none' });
    return;
  }

  uni.showLoading({ title: '创建中...' });

  try {
    await taskStore.createTask(form.value);
    uni.hideLoading();
    uni.showToast({ title: '创建成功', icon: 'success' });
    setTimeout(() => {
      uni.navigateBack();
    }, 1500);
  } catch (error) {
    uni.hideLoading();
    uni.showToast({ title: '创建失败', icon: 'none' });
  }
}
</script>

<style lang="scss" scoped>
.create-container {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20rpx;
  padding-bottom: 120rpx;
}

.form-section {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.form-item {
  margin-bottom: 32rpx;

  &:last-child {
    margin-bottom: 0;
  }

  &__label {
    font-size: 28rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 12rpx;
  }

  &__input {
    border-radius: 12rpx;
    border: 2rpx solid #e9ecef;
    overflow: hidden;

    .textarea {
      width: 100%;
      min-height: 120rpx;
      padding: 20rpx;
      font-size: 28rpx;
      line-height: 1.6;
    }

    .input {
      display: flex;
      align-items: center;
      padding: 20rpx;
      font-size: 28rpx;

      &__icon {
        margin-right: 8rpx;
      }

      &__field {
        flex: 1;
        font-size: 28rpx;
      }

      &__text {
        flex: 1;
        color: #333;
      }

      &__placeholder {
        flex: 1;
        color: #999;
      }

      &__arrow {
        color: #999;
        font-size: 48rpx;
      }
    }
  }

  &__selector {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;

    .selector-item {
      display: flex;
      align-items: center;
      padding: 12rpx 20rpx;
      border-radius: 24rpx;
      border: 2rpx solid #e9ecef;
      background: #f8f9fa;
      font-size: 24rpx;
      color: #666;
      transition: all 0.3s;

      &.active {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-color: transparent;
        color: #fff;
      }

      &__icon {
        margin-right: 4rpx;
      }
    }

    .selector-item--simple {
      padding: 12rpx 32rpx;
      border-radius: 24rpx;
      border: 2rpx solid #e9ecef;
      background: #f8f9fa;
      font-size: 24rpx;
      color: #666;
      transition: all 0.3s;

      &.active {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-color: transparent;
        color: #fff;
      }
    }
  }
}

.submit-section {
  margin-top: 32rpx;
}

.submit-btn {
  width: 100%;
  height: 96rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 48rpx;
  color: #fff;
  font-size: 32rpx;
  font-weight: 600;
  border: none;
  box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.4);

  &::after {
    border: none;
  }
}
</style>
