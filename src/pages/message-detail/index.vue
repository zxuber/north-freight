<template>
<view class="page">
  <view v-if="msg" class="card">
    <text class="d-title">{{ msg.title }}</text>
    <text class="d-time">{{ msg.createTime }}</text>
    <view class="d-divider"></view>
    <text class="d-content">{{ msg.content }}</text>
    <view v-if="msg.orderId" class="d-link" @click="goOrder">
      <text class="d-link-label">关联运单</text>
      <text class="d-link-id">{{ msg.orderId }} ›</text>
    </view>
  </view>
  <view v-else-if="!loading" class="empty">
    <text class="empty-text">消息不存在</text>
  </view>
</view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getMessageDetail } from '@/api/message'

const msg = ref(null)
const loading = ref(false)

onLoad(function(opts) {
  if (opts && opts.id) {
    loading.value = true
    getMessageDetail(opts.id).then(function(m) { msg.value = m }).catch(function() {}).finally(function() { loading.value = false })
  }
})

function goOrder() {
  if (msg.value && msg.value.orderId) {
    uni.navigateTo({ url: '/pages/order-detail/index?id=' + msg.value.orderId })
  }
}
</script>

<style>
.page { min-height:100vh; background:#F5F5F5; }
.card { background:#fff; margin:10px 16px; border-radius:12px; padding:20px; box-shadow:0 1px 4px rgba(0,0,0,0.04); }
.d-title { font-size:18px; color:#1A1A1A; font-weight:600; display:block; margin-bottom:8px; }
.d-time { font-size:12px; color:#BBB; }
.d-divider { height:1px; background:#F0F0F0; margin:16px 0; }
.d-content { font-size:15px; color:#666; line-height:1.8; }
.d-link { margin-top:16px; padding:14px; background:#F5F5F5; border-radius:8px; display:flex; justify-content:space-between; align-items:center; }
.d-link-label { font-size:13px; color:#999; }
.d-link-id { font-size:14px; color:#07C160; font-weight:500; }
.empty { display:flex; justify-content:center; padding:80px 0; }
.empty-text { font-size:14px; color:#BBB; }
</style>
