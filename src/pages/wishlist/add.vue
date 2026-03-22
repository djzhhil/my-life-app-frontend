<template>
  <view class="add-wishlist-page">
    <view class="form-container">
      <!-- 标题 -->
      <view class="form-item">
        <view class="label">心愿标题 <text class="required">*</text></view>
        <input 
          class="input" 
          v-model="form.title" 
          placeholder="请输入心愿标题" 
          maxlength="50"
        />
      </view>

      <!-- 描述 -->
      <view class="form-item">
        <view class="label">描述（可选）</view>
        <textarea 
          class="textarea" 
          v-model="form.description" 
          placeholder="请输入心愿描述" 
          maxlength="200"
          :show-count="false"
        />
      </view>

      <!-- 目标金额 -->
      <view class="form-item">
        <view class="label">目标金额 <text class="required">*</text></view>
        <view class="amount-input-wrapper">
          <text class="currency-symbol">¥</text>
          <input 
            class="input amount-input" 
            type="digit" 
            v-model="form.targetAmount" 
            placeholder="请输入目标金额"
          />
        </view>
      </view>

      <!-- 优先级 -->
      <view class="form-item">
        <view class="label">优先级</view>
        <view class="priority-selector">
          <view 
            class="priority-option" 
            :class="{ active: form.priority === 1 }"
            @click="form.priority = 1"
          >
            <text class="priority-icon">🔴</text>
            <text>高</text>
          </view>
          <view 
            class="priority-option" 
            :class="{ active: form.priority === 2 }"
            @click="form.priority = 2"
          >
            <text class="priority-icon">🟡</text>
            <text>中</text>
          </view>
          <view 
            class="priority-option" 
            :class="{ active: form.priority === 3 }"
            @click="form.priority = 3"
          >
            <text class="priority-icon">🟢</text>
            <text>低</text>
          </view>
        </view>
      </view>

      <!-- 目标日期 -->
      <view class="form-item">
        <view class="label">目标日期</view>
        <picker 
          mode="date" 
          :value="form.targetDate" 
          @change="onDateChange"
        >
          <view class="picker-trigger" v-if="form.targetDate">
            {{ form.targetDate }}
          </view>
          <view class="picker-trigger placeholder" v-else>
            请选择目标日期
          </view>
        </picker>
      </view>

      <!-- 图标选择 -->
      <view class="form-item">
        <view class="label">图标（可选）</view>
        <view class="icon-selector">
          <view 
            v-for="icon in iconOptions" 
            :key="icon"
            class="icon-option"
            :class="{ active: form.icon === icon }"
            @click="form.icon = icon"
          >
            {{ icon }}
          </view>
        </view>
      </view>

      <!-- 颜色选择 -->
      <view class="form-item">
        <view class="label">颜色（可选）</view>
        <view class="color-selector">
          <view 
            v-for="color in colorOptions" 
            :key="color"
            class="color-option"
            :class="{ active: form.color === color }"
            :style="{ backgroundColor: color }"
            @click="form.color = color"
          ></view>
        </view>
      </view>
    </view>

    <!-- 提交按钮 -->
    <view class="submit-section">
      <button 
        class="submit-btn" 
        :disabled="!canSubmit || submitting"
        @click="handleSubmit"
      >
        {{ submitting ? '创建中...' : '创建心愿' }}
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useWishlistStore } from '@/store/wishlist'

const store = useWishlistStore()
const submitting = ref(false)

const form = reactive({
  title: '',
  description: '',
  targetAmount: '',
  priority: 2,
  targetDate: '',
  icon: '🎯',
  color: '#667eea'
})

const iconOptions = ['🎯', '🚀', '💰', '🏖️', '🚗', '🏠', '📱', '💻', '🎮', '📚', '🎁', '✨']
const colorOptions = ['#667eea', '#764ba2', '#ff6b6b', '#fcc419', '#51cf66', '#20c997', '#868e96']

const canSubmit = computed(() => {
  return form.title.trim() && form.targetAmount && parseFloat(form.targetAmount) > 0
})

const onDateChange = (e: any) => {
  form.targetDate = e.detail.value
}

const handleSubmit = async () => {
  if (!canSubmit.value || submitting.value) return
  
  submitting.value = true
  try {
    await store.createWishlist({
      title: form.title,
      description: form.description,
      targetAmount: parseFloat(form.targetAmount),
      priority: form.priority,
      targetDate: form.targetDate || undefined,
      icon: form.icon,
      color: form.color
    })
    uni.showToast({ title: '创建成功', icon: 'success' })
    setTimeout(() => uni.navigateBack(), 1500)
  } catch (error) {
    uni.showToast({ title: '创建失败', icon: 'none' })
  } finally {
    submitting.value = false
  }
}
</script>

<style lang="scss" scoped>
.add-wishlist-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 200rpx;
}

.form-container {
  background: #fff;
  padding: 30rpx;
  margin: 20rpx;
  border-radius: 24rpx;
}

.form-item {
  margin-bottom: 40rpx;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  .label {
    font-size: 28rpx;
    font-weight: 500;
    color: #333;
    margin-bottom: 16rpx;
    
    .required {
      color: #ff6b6b;
    }
  }
  
  .input {
    width: 100%;
    height: 88rpx;
    padding: 0 30rpx;
    background: #f8f9fa;
    border-radius: 16rpx;
    font-size: 30rpx;
    color: #333;
    
    &:focus {
      background: #fff;
      outline: 2rpx solid #667eea;
    }
  }
  
  .textarea {
    width: 100%;
    height: 160rpx;
    padding: 20rpx 30rpx;
    background: #f8f9fa;
    border-radius: 16rpx;
    font-size: 30rpx;
    color: #333;
    box-sizing: border-box;
  }
  
  .amount-input-wrapper {
    position: relative;
    
    .currency-symbol {
      position: absolute;
      left: 30rpx;
      top: 50%;
      transform: translateY(-50%);
      font-size: 36rpx;
      font-weight: bold;
      color: #333;
    }
    
    .amount-input {
      padding-left: 60rpx;
    }
  }
  
  .priority-selector {
    display: flex;
    gap: 20rpx;
    
    .priority-option {
      flex: 1;
      height: 88rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10rpx;
      background: #f8f9fa;
      border-radius: 16rpx;
      font-size: 28rpx;
      color: #666;
      transition: all 0.2s;
      
      &.active {
        background: #667eea;
        color: #fff;
      }
      
      .priority-icon {
        font-size: 32rpx;
      }
    }
  }
  
  .picker-trigger {
    width: 100%;
    height: 88rpx;
    line-height: 88rpx;
    padding: 0 30rpx;
    background: #f8f9fa;
    border-radius: 16rpx;
    font-size: 30rpx;
    color: #333;
    
    &.placeholder {
      color: #adb5bd;
    }
  }
  
  .icon-selector {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;
    
    .icon-option {
      width: 80rpx;
      height: 80rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f8f9fa;
      border-radius: 16rpx;
      font-size: 40rpx;
      transition: all 0.2s;
      
      &.active {
        background: #667eea;
        transform: scale(1.1);
      }
    }
  }
  
  .color-selector {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;
    
    .color-option {
      width: 60rpx;
      height: 60rpx;
      border-radius: 50%;
      transition: all 0.2s;
      
      &.active {
        transform: scale(1.2);
        box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.2);
      }
    }
  }
}

.submit-section {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 30rpx;
  background: #fff;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
  
  .submit-btn {
    width: 100%;
    height: 88rpx;
    line-height: 88rpx;
    text-align: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 44rpx;
    color: #fff;
    font-size: 32rpx;
    font-weight: 500;
    border: none;
    
    &:disabled {
      opacity: 0.6;
    }
    
    &:active:not(:disabled) {
      opacity: 0.9;
    }
  }
}
</style>