<template>
  <view class="wishlist-detail">
    <!-- 心愿信息卡片 -->
    <view class="detail-card">
      <view class="card-header">
        <view class="icon-wrapper" :style="{ backgroundColor: wishlist?.color || '#667eea' }">
          <text class="icon">{{ wishlist?.icon || '🎯' }}</text>
        </view>
        <view class="title-section">
          <text class="title">{{ wishlist?.title }}</text>
          <view class="tags">
            <text class="tag priority" :class="'priority-' + wishlist?.priority">
              {{ priorityText }}
            </text>
            <text class="tag status" :class="'status-' + wishlist?.status">
              {{ statusText }}
            </text>
          </view>
        </view>
      </view>
      
      <view class="description" v-if="wishlist?.description">
        <text>{{ wishlist.description }}</text>
      </view>
      
      <view class="progress-section">
        <ProgressBar 
          :progress="progress" 
          :size="120"
          :strokeWidth="8"
          :color="'#667eea'"
        />
        <view class="amount-info">
          <text class="current-amount">¥{{ wishlist?.currentAmount || 0 }}</text>
          <text class="target-amount">/ ¥{{ wishlist?.targetAmount || 0 }}</text>
        </view>
        <text class="progress-text">{{ progress }}%</text>
      </view>
      
      <view class="target-date" v-if="wishlist?.targetDate">
        <text>目标日期：{{ formatDate(wishlist.targetDate) }}</text>
      </view>
    </view>

    <!-- 操作按钮 -->
    <view class="action-buttons">
      <button class="action-btn deposit" @click="handleDeposit">
        存入金币
      </button>
      <button 
        class="action-btn complete" 
        v-if="canComplete"
        @click="handleComplete"
      >
        完成心愿
      </button>
      <button class="action-btn abandon" v-if="wishlist?.status === 0" @click="handleAbandon">
        放弃心愿
      </button>
    </view>

    <!-- 存钱记录 -->
    <view class="records-section">
      <view class="section-title">存钱记录</view>
      <DepositRecord :records="deposits" />
    </view>

    <!-- Loading -->
    <view class="loading-mask" v-if="loading">
      <view class="loading-spinner"></view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useWishlistStore } from '@/store/wishlist'
import DepositRecord from '@/components/DepositRecord.vue'

const store = useWishlistStore()
const wishlistId = ref<number | null>(null)
const loading = ref(false)

// 监控 loading 状态变化
watch(loading, (newVal, oldVal) => {
  console.log(`🟠🟠🟠 loading 状态变化: ${oldVal} → ${newVal} 🟠🟠🟠`)
})

// 每5秒打印一次 loading 状态
setInterval(() => {
  console.log(`⏰ [${new Date().toISOString()}] 当前 loading 状态: ${loading.value}`)
}, 5000)

const wishlist = computed(() => store.currentWishlist)
const deposits = computed(() => store.deposits)

const progress = computed(() => {
  if (!wishlist.value || wishlist.value.targetAmount <= 0) return 0
  return Math.min(100, Math.round((wishlist.value.currentAmount / wishlist.value.targetAmount) * 100))
})

const canComplete = computed(() => {
  return wishlist.value && wishlist.value.status === 0 && wishlist.value.currentAmount >= wishlist.value.targetAmount
})

const priorityText = computed(() => {
  const map = { 1: '高', 2: '中', 3: '低' }
  return wishlist.value ? map[wishlist.value.priority as keyof typeof map] || '中' : '中'
})

const statusText = computed(() => {
  const map = { 0: '进行中', 1: '已实现', 2: '已放弃' }
  return wishlist.value ? map[wishlist.value.status as keyof typeof map] || '进行中' : '进行中'
})

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('zh-CN')
}

const fetchData = async () => {
  console.log('🟡🟡🟡 fetchData 开始 🟡🟡🟡')
  console.log('🟡 当前 loading:', loading.value)
  console.log('🟡 wishlistId.value:', wishlistId.value)

  if (!wishlistId.value) {
    console.warn('🟡 wishlistId 为空，fetchData 跳过')
    return
  }

  loading.value = true
  console.log('🟡 loading 设为 true')

  try {
    console.log('🟡 准备调用 fetchWishlistDetail')
    await store.fetchWishlistDetail(wishlistId.value)
    console.log('🟡 fetchWishlistDetail 完成')

    console.log('🟡 准备调用 fetchDeposits')
    await store.fetchDeposits(wishlistId.value)
    console.log('🟡 fetchDeposits 完成')
  } catch (error) {
    console.error('🟡❌❌ fetchData 失败 ❌❌🟡')
    console.error('错误:', error)
    console.error('错误信息:', error?.message)
  } finally {
    loading.value = false
    console.log('🟡 loading 设为 false')
    console.log('🟡🟡🟡 fetchData 结束 🟡🟡🟡')
  }
}

const handleDeposit = () => {
  console.log('🟢🟢🟢 handleDeposit 被调用！！！🟢🟢🟢')
  console.log('🟢 wishlistId:', wishlistId.value)
  console.log('🟢 当前时间:', new Date().toISOString())

  // 最简单的测试：先不调用 showModal，直接弹一个 toast
  uni.showToast({ title: '按钮点击了！', icon: 'none' })

  // 使用 uni.showModal 配合临时输入框的方式
  // 因为 editable 属性在某些平台可能不支持
  let inputValue = ''

  console.log('🟢 准备调用 uni.showModal')

  uni.showModal({
    title: '存入金币',
    editable: true,
    placeholderText: '请输入存入金额',
    success: async (res) => {
      console.log('🟢🟢🟢 uni.showModal success callback 被调用！！！🟢🟢🟢')
      console.log('🟢 res:', res)
      console.log('🟢 res.confirm:', res.confirm)
      console.log('🟢 res.content:', res.content)
      console.log('🟢 res.cancel:', res.cancel)

      uni.showToast({ title: 'Modal success 被调用', icon: 'none' })

      if (res.confirm) {
        // 某些平台下 res.content 可能不正确，尝试多种方式获取输入值
        const content = res.content || res.tap?.content || res.edit?.content || ''

        console.log('💰 用户输入:', content)
        console.log('💰 完整 res:', res)

        const amount = parseFloat(content)

        console.log('💰 解析后的金额:', amount)

        if (isNaN(amount) || amount <= 0) {
          console.warn('💰 金额无效:', amount,isNaN(amount), amount <= 0)
          uni.showToast({ title: '请输入有效金额', icon: 'none' })
          return
        }

        if (!wishlistId.value) {
          console.error('💰 wishlistId 为空')
          uni.showToast({ title: '数据异常', icon: 'none' })
          return
        }

        console.log('💰 准备调用 store.makeDeposit:', { wishlistId: wishlistId.value, amount })

        try {
          await store.makeDeposit({ wishlistId: wishlistId.value, amount })

          console.log('💰 makeDeposit 执行成功')

          uni.showToast({ title: '存入成功', icon: 'success' })

          await fetchData()
        } catch (error) {
          console.error('💰💰💰 存入失败 💰💰💰')
          console.error('错误:', error)
          console.error('错误信息:', error?.message || '未知错误')
          uni.showToast({ title: '存入失败: ' + (error?.message || '未知错误'), icon: 'none' })
        }
      } else {
        console.log('🟢 用户点击了取消')
      }
    },
    fail: (err) => {
      console.error('💰 Modal 调用失败:', err)
      uni.showToast({ title: '弹窗失败', icon: 'none' })
    },
    complete: () => {
      console.log('🟢 uni.showModal complete callback 被调用')
    }
  })
}

const handleComplete = async () => {
  uni.showModal({
    title: '确认完成',
    content: '确定要完成这个心愿吗？',
    success: async (res) => {
      if (res.confirm && wishlistId.value) {
        try {
          await store.completeWishlist(wishlistId.value)
          uni.showToast({ title: '已完成', icon: 'success' })
          setTimeout(() => uni.navigateBack(), 1500)
        } catch (error) {
          uni.showToast({ title: '操作失败', icon: 'none' })
        }
      }
    }
  })
}

const handleAbandon = () => {
  uni.showModal({
    title: '确认放弃',
    content: '确定要放弃这个心愿吗？此操作不可恢复。',
    success: async (res) => {
      if (res.confirm && wishlistId.value) {
        try {
          await store.abandonWishlist(wishlistId.value)
          uni.showToast({ title: '已放弃', icon: 'success' })
          setTimeout(() => uni.navigateBack(), 1500)
        } catch (error) {
          uni.showToast({ title: '操作失败', icon: 'none' })
        }
      }
    }
  })
}

onLoad((options) => {
  console.log('🟢🟢🟢 onLoad 被调用 🟢🟢🟢')
  console.log('🟢 options:', options)
  console.log('🟢 当前时间:', new Date().toISOString())

  const id = options.id

  console.log('🟢 获取到的 id:', id)
  console.log('🟢 当前 wishlistId:', wishlistId.value)
  console.log('🟢 当前 loading:', loading.value)

  if (id) {
    wishlistId.value = parseInt(id)
    console.log('🟢 设置 wishlistId 为:', wishlistId.value)
    fetchData()
  } else {
    console.warn('🟢 id 为空，跳转回列表页')
    uni.showToast({
      title: '请从列表页选择心愿',
      icon: 'none',
      duration: 1500
    })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  }

  console.log('🟢🟢🟢 onLoad 结束 🟢🟢🟢')
})
</script>

<style lang="scss" scoped>
.wishlist-detail {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20rpx;
  padding-bottom: 200rpx;
}

.detail-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 24rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  
  .card-header {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;
    
    .icon-wrapper {
      width: 100rpx;
      height: 100rpx;
      border-radius: 24rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 20rpx;
      
      .icon {
        font-size: 50rpx;
      }
    }
    
    .title-section {
      flex: 1;
      
      .title {
        font-size: 36rpx;
        font-weight: bold;
        color: #fff;
        margin-bottom: 10rpx;
        display: block;
      }
      
      .tags {
        display: flex;
        gap: 10rpx;
        
        .tag {
          font-size: 22rpx;
          padding: 6rpx 16rpx;
          border-radius: 8rpx;
          
          &.priority-1 {
            background: #ff6b6b;
          }
          &.priority-2 {
            background: #fcc419;
            color: #333;
          }
          &.priority-3 {
            background: #51cf66;
          }
          
          &.status-0 {
            background: rgba(255, 255, 255, 0.2);
          }
          &.status-1 {
            background: #51cf66;
          }
          &.status-2 {
            background: #868e96;
          }
        }
      }
    }
  }
  
  .description {
    font-size: 28rpx;
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 30rpx;
    line-height: 1.6;
  }
  
  .progress-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 30rpx 0;
    
    .amount-info {
      margin-top: 20rpx;
      
      .current-amount {
        font-size: 48rpx;
        font-weight: bold;
        color: #ffd43b;
      }
      
      .target-amount {
        font-size: 28rpx;
        color: rgba(255, 255, 255, 0.7);
      }
    }
    
    .progress-text {
      font-size: 32rpx;
      font-weight: bold;
      color: #fff;
      margin-top: 10rpx;
    }
  }
  
  .target-date {
    font-size: 26rpx;
    color: rgba(255, 255, 255, 0.7);
    text-align: center;
  }
}

.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
  margin-bottom: 30rpx;
  
  .action-btn {
    flex: 1;
    min-width: 200rpx;
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
    border-radius: 40rpx;
    font-size: 28rpx;
    border: none;
    
    &.deposit {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #fff;
    }
    
    &.complete {
      background: #51cf66;
      color: #fff;
    }
    
    &.abandon {
      background: #ff6b6b;
      color: #fff;
    }
  }
}

.records-section {
  background: #fff;
  border-radius: 24rpx;
  padding: 30rpx;
  
  .section-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 20rpx;
  }
}

.loading-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 0, 0, 0.7);  /* 🔴 调试用：红色背景，如果遮挡按钮就能看到 */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  
  .loading-spinner {
    width: 60rpx;
    height: 60rpx;
    border: 6rpx solid #fff;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>