<template>
<view class="page">
  <!-- 用户头部 -->
  <view class="user-header">
    <view class="u-bg"></view>
    <view class="u-info">
      <view class="u-avatar">
        <text class="u-avatar-text">&#x1F464;</text>
      </view>
      <view class="u-text">
        <text class="u-name">货主张三</text>
        <text class="u-phone">138****5678</text>
      </view>
      <text class="u-arrow">&#x203A;</text>
    </view>
  </view>

  <!-- 钱包 -->
  <view class="wallet">
    <view class="w-item">
      <text class="w-label">账户余额</text>
      <text class="w-value">¥1280.50</text>
    </view>
    <view class="w-div"></view>
    <view class="w-item">
      <text class="w-label">优惠券</text>
      <text class="w-value coupon">3 张</text>
    </view>
  </view>

  <!-- 菜单 -->
  <view class="menu-group">
    <view class="menu-item" @click="goPage('/pages/address-list/index')">
      <view class="mi-left"><text class="mi-icon">&#x1F4CD;</text><text class="mi-label">地址管理</text></view>
      <text class="mi-arrow">&#x203A;</text>
    </view>
    <view class="menu-item" @click="goPage('/pages/contacts/index')">
      <view class="mi-left"><text class="mi-icon">&#x1F465;</text><text class="mi-label">常用联系人</text></view>
      <text class="mi-arrow">&#x203A;</text>
    </view>
    <view class="menu-item" @click="goPage('/pages/vehicle-intro/index')">
      <view class="mi-left"><text class="mi-icon">&#x1F69A;</text><text class="mi-label">车辆介绍</text></view>
      <text class="mi-arrow">&#x203A;</text>
    </view>
  </view>

  <view class="menu-group">
    <view class="menu-item" @click="showAbout">
      <view class="mi-left"><text class="mi-icon">&#x2139;&#xFE0F;</text><text class="mi-label">关于我们</text></view>
      <text class="mi-arrow">&#x203A;</text>
    </view>
    <view class="menu-item" @click="handleLogout">
      <view class="mi-left"><text class="mi-icon">&#x1F6AA;</text><text class="mi-label" style="color:#FF3141;">退出登录</text></view>
      <text class="mi-arrow">&#x203A;</text>
    </view>
  </view>

  <text class="version">北方货运 V1.0.0</text>
</view>
</template>

<script setup>
function goPage(url) { uni.navigateTo({ url }) }
function showAbout() {
  uni.showModal({ title:'关于北方货运', content:'北方货运平台 V1.0.0\n专注京津冀货运撮合服务\n\n货主找车快 · 司机有货拉', showCancel:false, confirmText:'知道了' })
}
function handleLogout() {
  uni.showModal({ title:'退出登录', content:'确定要退出吗？', confirmColor:'#FF3141',
    success:function(r) {
      if (r.confirm) { uni.removeStorageSync('token'); uni.removeStorageSync('userInfo'); uni.switchTab({ url:'/pages/index/index' }) }
    }
  })
}
</script>

<style>
.page { min-height:100vh; background:#F5F5F5; }

.user-header { position:relative; padding:40px 16px 20px; overflow:hidden; }
.u-bg { position:absolute; top:0; left:0; right:0; bottom:0; background:linear-gradient(135deg,#07C160,#06AD56); border-radius:0 0 20px 20px; }
.u-info { position:relative; display:flex; align-items:center; gap:14px; }
.u-avatar { width:64px; height:64px; border-radius:50%; background:rgba(255,255,255,0.2); display:flex; align-items:center; justify-content:center; border:2px solid rgba(255,255,255,0.4); }
.u-avatar-text { font-size:32px; opacity:0.6; }
.u-text { flex:1; }
.u-name { font-size:20px; color:#fff; font-weight:600; display:block; }
.u-phone { font-size:13px; color:rgba(255,255,255,0.8); display:block; margin-top:4px; }
.u-arrow { font-size:24px; color:rgba(255,255,255,0.5); }

.wallet { display:flex; background:#fff; margin:-10px 16px 10px; border-radius:12px; padding:18px; box-shadow:0 1px 6px rgba(0,0,0,0.04); position:relative; z-index:1; }
.w-item { flex:1; text-align:center; }
.w-label { font-size:12px; color:#999; display:block; }
.w-value { font-size:20px; color:#1A1A1A; font-weight:600; display:block; margin-top:6px; }
.w-value.coupon { color:#FF8F1F; }
.w-div { width:1px; background:#F0F0F0; }

.menu-group { background:#fff; margin:10px 16px; border-radius:12px; overflow:hidden; box-shadow:0 1px 4px rgba(0,0,0,0.04); }
.menu-item { display:flex; align-items:center; justify-content:space-between; padding:16px; border-bottom:1px solid #F8F8F8; }
.menu-item:last-child { border-bottom:none; }
.mi-left { display:flex; align-items:center; gap:10px; }
.mi-icon { font-size:18px; }
.mi-label { font-size:15px; color:#1A1A1A; }
.mi-arrow { font-size:20px; color:#CCC; }

.version { display:block; text-align:center; padding:20px; font-size:12px; color:#CCC; }
</style>
