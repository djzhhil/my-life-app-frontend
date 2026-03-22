import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as api from '@/api/wishlist'
import type { Wishlist, WishlistCreateDTO, Deposit, DepositDTO } from '@/api/wishlist'

export const useWishlistStore = defineStore('wishlist', () => {
  // 状态
  const wishlists = ref<Wishlist[]>([])
  const deposits = ref<Deposit[]>([])
  const currentWishlistId = ref<number | null>(null)
  const loading = ref(false)

  // 计算属性
  const activeWishlists = computed(() => wishlists.value.filter(w => w.status === 0) )
  const completedWishlists = computed(() => wishlists.value.filter(w => w.status === 1) )
  const abandonedWishlists = computed(() => wishlists.value.filter(w => w.status === 2) )
  const currentWishlist = computed(() => wishlists.value.find(w => w.id === currentWishlistId.value) )
  const highPriorityWishlists = computed(() => wishlists.value.filter(w => w.priority === 1) )
  const mediumPriorityWishlists = computed(() => wishlists.value.filter(w => w.priority === 2) )
  const lowPriorityWishlists = computed(() => wishlists.value.filter(w => w.priority === 3) )

  // Actions
  async function fetchWishlists(params?: { status?: number; priority?: number }) {
    loading.value = true
    try {
      const data = await api.listWishlists(params)
      wishlists.value = data
      return data
    } catch (error) {
      console.error('获取心愿列表失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function createWishlist(data: WishlistCreateDTO) {
    loading.value = true
    try {
      const wishlist = await api.createWishlist(data)
      wishlists.value.push(wishlist)
      return wishlist
    } catch (error) {
      console.error('创建心愿失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function updateWishlist(id: number, data: WishlistCreateDTO) {
    loading.value = true
    try {
      const wishlist = await api.updateWishlist(id, data)
      const index = wishlists.value.findIndex(w => w.id === id)
      if (index !== -1) {
        wishlists.value[index] = wishlist
      }
      return wishlist
    } catch (error) {
      console.error('更新心愿失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function deleteWishlist(id: number) {
    loading.value = true
    try {
      await api.deleteWishlist(id)
      const index = wishlists.value.findIndex(w => w.id === id)
      if (index !== -1) {
        wishlists.value.splice(index, 1)
      }
    } catch (error) {
      console.error('删除心愿失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function completeWishlist(id: number) {
    loading.value = true
    try {
      await api.completeWishlist(id)
      const wishlist = wishlists.value.find(w => w.id === id)
      if (wishlist) {
        wishlist.status = 1
        wishlist.completedAt = new Date().toISOString()
      }
    } catch (error) {
      console.error('完成心愿失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function abandonWishlist(id: number) {
    loading.value = true
    try {
      await api.abandonWishlist(id)
      const wishlist = wishlists.value.find(w => w.id === id)
      if (wishlist) {
        wishlist.status = 2
      }
    } catch (error) {
      console.error('放弃心愿失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function fetchDeposits(wishlistId: number) {
    loading.value = true
    try {
      const data = await api.getDeposits(wishlistId)
      deposits.value = data
      return data
    } catch (error) {
      console.error('获取存钱记录失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function fetchWishlistDetail(wishlistId: number) {
    loading.value = true
    try {
      const data = await api.getWishlistDetail(wishlistId)
      // 查找并更新或添加到列表
      const index = wishlists.value.findIndex(w => w.id === wishlistId)
      if (index !== -1) {
        wishlists.value[index] = data
      } else {
        wishlists.value.push(data)
      }
      setCurrentWishlistId(wishlistId)
      return data
    } catch (error) {
      console.error('获取心愿详情失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function makeDeposit(data: DepositDTO) {
    loading.value = true
    try {
      await api.deposit(data)
      const wishlist = wishlists.value.find(w => w.id === data.wishlistId)
      if (wishlist) {
        // 确保类型是数字
        const current = typeof wishlist.currentAmount === 'string'
          ? parseFloat(wishlist.currentAmount)
          : (wishlist.currentAmount || 0)
        wishlist.currentAmount = current + data.amount
      }
      // 刷新存钱记录
      if (currentWishlistId.value === data.wishlistId) {
        await fetchDeposits(data.wishlistId)
      }
    } catch (error) {
      console.error('存入金币失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  function setCurrentWishlistId(id: number | null) {
    currentWishlistId.value = id
  }

  function clearDeposits() {
    deposits.value = []
  }

  return {
    // 状态
    wishlists,
    deposits,
    currentWishlistId,
    loading,
    // 计算属性
    activeWishlists,
    completedWishlists,
    abandonedWishlists,
    currentWishlist,
    highPriorityWishlists,
    mediumPriorityWishlists,
    lowPriorityWishlists,
    // Actions
    fetchWishlists,
    fetchWishlistDetail,
    createWishlist,
    updateWishlist,
    deleteWishlist,
    completeWishlist,
    abandonWishlist,
    fetchDeposits,
    makeDeposit,
    setCurrentWishlistId,
    clearDeposits
  }
})