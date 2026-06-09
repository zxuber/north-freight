<template>
  <view class="page">
    <view class="amount-card">
      <text class="amount-label">应付金额</text>
      <text class="amount-num">¥{{ amount }}</text>
    </view>
    <view class="pay-card">
      <text class="pay-title">选择支付方式</text>
      <view class="pay-option" :class="{ on: method === 'wechat' }" @click="method = 'wechat'">
        <text class="pay-icon">💚</text>
        <text class="pay-name">微信支付</text>
        <text class="pay-check" v-if="method === 'wechat'">✓</text>
      </view>
      <view class="pay-option" :class="{ on: method === 'balance' }" @click="method = 'balance'">
        <text class="pay-icon">💰</text>
        <text class="pay-name">余额支付（余额 ¥0.00）</text>
        <text class="pay-check" v-if="method === 'balance'">✓</text>
      </view>
    </view>
    <view class="pay-btn" @click="doPay">确认支付 ¥{{ amount }}</view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
const amount = ref('228')
const method = ref('wechat')
const doPay = () => {
  uni.showToast({ title: '支付成功', icon: 'success' })
  setTimeout(() => {
    uni.switchTab({ url: '/pages/order-list/index' })
  }, 1000)
}
</script>

<style lang="scss" scoped>
.page { min-height:100vh; background:#F6F8F9; padding:16px; }
.amount-card { background:#fff; border-radius:14px; padding:30px; text-align:center; margin-bottom:14px; }
.amount-label { font-size:14px; color:#999; }
.amount-num { font-size:40px; font-weight:800; color:#FF3141; display:block; margin-top:8px; }
.pay-card { background:#fff; border-radius:14px; padding:16px; }
.pay-title { font-size:15px; font-weight:600; margin-bottom:12px; }
.pay-option { display:flex; align-items:center; padding:14px 0; border-bottom:1px solid #F5F5F5; gap:10px; }
.pay-option.on { color:#07C160; }
.pay-icon { font-size:24px; }
.pay-name { flex:1; font-size:15px; }
.pay-check { color:#07C160; font-weight:700; font-size:18px; }
.pay-btn { margin-top:20px; background:#07C160; color:#fff; text-align:center; padding:16px; border-radius:14px; font-size:17px; font-weight:600; }
</style>
