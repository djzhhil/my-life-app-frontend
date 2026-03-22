<template>
  <view class="wishlist-page">
    <!-- 筛选栏 -->
    <view class="filter-bar">
      <view class="filter-item" :class="{ active: statusFilter === -1 }" @click="setStatusFilter(-1)">
        <text>全部</text>
      </view>
      <view class="filter-item" :class="{ active: statusFilter === 0 }" @click="setStatusFilter(0)">
        <text>进行中</text>
      </view>
      <view class="filter-item" :class="{ active: statusFilter === 1 }" @click="setStatusFilter(1)">
        <text>已实现</text>
      </view>
      <view class="filter-item" :class="{ active: statusFilter === 2 }" @click="setStatusFilter(2)">
        <text>已放弃</text>
      </view>
    </view>

    <!-- 心愿列表 -->
    <scroll-view scroll-y class="wishlist-container" @scrolltolower="loadMore">
      <view class="wishlist-content" v-if="filteredWishlists.length > 0">
        <WishlistCard
          v-for="item in filteredWishlists"
          :key="item.id"
          :item="item"
          @click="goToDetail"
          @deposit="handleDeposit"
        />
      </view>
      
      <!-- 空状态 -->
      <view class="empty-state" v-else>
        <text class="empty-icon">📝</text>
        <text class="empty-text">还没有心愿，去添加一个吧！</text>
        <button class="add-btn" @click="goToAdd">添加心愿</button>
      </view>
    </scroll-view>

    <!-- FAB 添加按钮 -->
    <view class="fab" @click="goToAdd">
      <text class="fab-icon">+</text>
    </view>

    <!-- Loading -->
    <view class="loading-mask" v-if="loading">
      <view class="loading-spinner"></view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useWishlistStore } from '@/store/wishlist'
import type { Wishlist } from '@/api/wishlist'
import WishlistCard from '@/components/WishlistCard.vue'

const store = useWishlistStore()
const statusFilter = ref(-1)
const loading = ref(false)

const filteredWishlists = computed(() => {
  let lists = store.wishlists
  if (statusFilter.value !== -1) {
    lists = lists.filter(w => w.status === statusFilter.value)
  }
  return lists
})

const setStatusFilter = (status: number) => {
  statusFilter.value = status
}

const fetchData = async () => {
  loading.value = true
  try {
    await store.fetchWishlists()
  } catch (error) {
    console.error('获取心愿列表失败:', error)
  } finally {
    loading.value = false
  }
}

const loadMore = () => {
  // 加载更多逻辑
}

const goToDetail = (item: Wishlist) => {
  uni.navigateTo({
    url: `/pages/wishlist/detail?id=${item.id}`
  })
}

const goToAdd = () => {
  uni.navigateTo({
    url: '/pages/wishlist/add'
  })
}

const handleDeposit = (item: Wishlist) => {
  // 弹出存钱弹窗
  uni.showModal({
    title: '存入金币',
    editable: true,
    placeholderText: '请输入存入金额',
    success: async (res) => {
      if (res.confirm && res.content) {
        const amount = parseFloat(res.content)
        if (isNaN(amount) || amount <= 0) {
          uni.showToast({ title: '请输入有效金额', icon: 'none' })
          return
        }
        try {
          await store.deposit({ wishlistId: item.id, amount })
          uni.showToast({ title: '存入成功', icon: 'success' })
        } catch (error) {
          uni.showToast({ title: '存入失败', icon: 'none' })
        }
      }
    }
  })
}

onMounted(() => {
  fetchData()
})
</script>

<style lang="scss" scoped>
.wishlist-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 120rpx;
}

.filter-bar {
  display: flex;
  background: #fff;
  padding: 20rpx;
  position: sticky;
  top: 0;
  z-index: 10;
  
  .filter-item {
    flex: 1;
    text-align: center;
    padding: 16rpx 0;
    font-size: 28rpx;
    color: #666;
    border-radius: 8rpx;
    margin: 0 10rpx;
    
    &.active {
      background: #667eea;
      color: #fff;
    }
  }
}

.wishlist-container {
  height: calc(100vh - 100rpx);
}

.wishlist-content {
  padding: 20rpx;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;
  
  .empty-icon {
    font-size: 100rpx;
    margin-bottom: 30rpx;
  }
  
  .empty-text {
    font-size: 28rpx;
    color: #999;
    margin-bottom: 40rpx;
  }
  
  .add-btn {
    width: 300rpx;
    height: 80rpx;
    line-height: 80rpx;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 40rpx;
    color: #fff;
    font-size: 30rpx;
    border: none;
  }
}

.fab {
  position: fixed;
  right: 40rpx;
  bottom: 100rpx;
  width: 100rpx;
  height: 100rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 20rpx rgba(102, 126, 234, 0.4);
  
  .fab-icon {
    font-size: 60rpx;
    color: #fff;
    font-weight: bold;
  }
}

.loading-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
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