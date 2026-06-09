<template>
  <view class="page">
    <view class="logo-area">
      <text class="logo-icon">🚛</text>
      <text class="logo-name">北方货运</text>
      <text class="logo-sub">货主端 · 整车拼车货运撮合平台</text>
    </view>

    <!-- 手机号登录 -->
    <view class="login-card">
      <view class="card-title">手机号登录</view>
      <view class="form-item">
        <input
          class="form-input"
          v-model="phone"
          type="number"
          maxlength="11"
          placeholder="请输入手机号"
        />
      </view>
      <view class="form-item form-item-row">
        <input
          class="form-input form-input-code"
          v-model="code"
          type="number"
          maxlength="6"
          placeholder="验证码"
        />
        <view class="code-btn" :class="{ disabled: counting }" @click="sendCode">
          <text v-if="!counting">获取验证码</text>
          <text v-else>{{ countdown }}s</text>
        </view>
      </view>
      <view class="btn-login" @click="doLogin">
        <text>登 录</text>
      </view>
    </view>

    <!-- 微信登录 -->
    <view class="wechat-area">
      <view class="divider-line">
        <view class="divider-bar"></view>
        <text class="divider-text">其他登录方式</text>
        <view class="divider-bar"></view>
      </view>
      <view class="wechat-btn" @click="wechatLogin">
        <text class="wechat-icon">💬</text>
        <text class="wechat-text">微信一键登录</text>
      </view>
    </view>

    <!-- 协议 -->
    <view class="agreement">
      <text class="agree-check" :class="{ on: agreed }" @click="agreed = !agreed">
        {{ agreed ? '✓' : '○' }}
      </text>
      <text class="agree-text">登录即表示同意</text>
      <text class="agree-link" @click="showTerms">《服务协议》</text>
      <text class="agree-text">和</text>
      <text class="agree-link" @click="showPrivacy">《隐私政策》</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { wechatLogin as wechatLoginApi, phoneLogin, sendCode as sendCodeApi } from '@/api/user'

const phone = ref('')
const code = ref('')
const agreed = ref(true)
const counting = ref(false)
const countdown = ref(60)
let timer = null

const sendCode = async () => {
  if (counting.value) return
  const phoneReg = /^1[3-9]\d{9}$/
  if (!phoneReg.test(phone.value)) {
    uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
    return
  }
  try {
    await sendCodeApi(phone.value)
    uni.showToast({ title: '验证码已发送', icon: 'success' })
    counting.value = true
    countdown.value = 60
    timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
        counting.value = false
      }
    }, 1000)
  } catch (e) {
    uni.showToast({ title: e.message || '发送失败', icon: 'none' })
  }
}

const doLogin = async () => {
  if (!agreed.value) {
    uni.showToast({ title: '请先同意服务协议', icon: 'none' })
    return
  }
  const phoneReg = /^1[3-9]\d{9}$/
  if (!phoneReg.test(phone.value)) {
    uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
    return
  }
  if (!code.value || code.value.length < 4) {
    uni.showToast({ title: '请输入验证码', icon: 'none' })
    return
  }
  try {
    const data = await phoneLogin(phone.value, code.value)
    uni.setStorageSync('token', data.token)
    uni.setStorageSync('userInfo', JSON.stringify(data.userInfo || {}))
    uni.switchTab({ url: '/pages/index/index' })
  } catch (e) {
    uni.showToast({ title: e.message || '登录失败', icon: 'none' })
  }
}

const wechatLogin = async () => {
  if (!agreed.value) {
    uni.showToast({ title: '请先同意服务协议', icon: 'none' })
    return
  }
  try {
    // #ifdef MP-WEIXIN
    const loginRes = await uni.login()
    if (!loginRes.code) {
      uni.showToast({ title: '微信授权失败', icon: 'none' })
      return
    }
    const data = await wechatLoginApi(loginRes.code)
    uni.setStorageSync('token', data.token)
    uni.setStorageSync('userInfo', JSON.stringify(data.userInfo || {}))
    uni.switchTab({ url: '/pages/index/index' })
    // #endif
  } catch (e) {
    uni.showToast({ title: e.message || '微信登录失败', icon: 'none' })
  }
}

const showTerms = () => {
  uni.showModal({
    title: '服务协议',
    content: '《运输服务协议》内容暂未配置，请线下查阅。',
    showCancel: false
  })
}

const showPrivacy = () => {
  uni.showModal({
    title: '隐私政策',
    content: '《隐私政策》内容暂未配置，请线下查阅。',
    showCancel: false
  })
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #F6F8F9;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 24px 40px;
}

.logo-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;
}
.logo-icon {
  font-size: 56px;
  margin-bottom: 12px;
}
.logo-name {
  font-size: 24px;
  font-weight: 700;
  color: #07C160;
  margin-bottom: 6px;
}
.logo-sub {
  font-size: 13px;
  color: #999;
}

.login-card {
  width: 100%;
  background: #fff;
  border-radius: 16px;
  padding: 24px 20px;
  box-shadow: 0 1px 8px rgba(0,0,0,0.04);
}
.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #1A1A1A;
  margin-bottom: 16px;
}
.form-item {
  margin-bottom: 14px;
}
.form-item-row {
  display: flex;
  gap: 12px;
  align-items: center;
}
.form-input {
  width: 100%;
  height: 48px;
  background: #F5F5F5;
  border-radius: 10px;
  padding: 0 14px;
  font-size: 15px;
  box-sizing: border-box;
}
.form-input-code {
  flex: 1;
}
.code-btn {
  flex-shrink: 0;
  padding: 0 18px;
  height: 48px;
  background: #E8F8EE;
  border-radius: 10px;
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #07C160;
  font-weight: 500;
}
.code-btn.disabled {
  background: #F0F0F0;
  color: #999;
}
.btn-login {
  width: 100%;
  height: 48px;
  background: #07C160;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #fff;
  font-weight: 600;
  margin-top: 6px;
}

.wechat-area {
  width: 100%;
  margin-top: 36px;
}
.divider-line {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.divider-bar {
  flex: 1;
  height: 1px;
  background: #E5E5E5;
}
.divider-text {
  font-size: 12px;
  color: #BBB;
  margin: 0 14px;
}
.wechat-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 48px;
  border: 1px solid #07C160;
  border-radius: 10px;
}
.wechat-icon {
  font-size: 20px;
}
.wechat-text {
  font-size: 15px;
  color: #07C160;
  font-weight: 500;
}

.agreement {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 40px;
}
.agree-check {
  font-size: 16px;
  color: #CCC;
  margin-right: 4px;
}
.agree-check.on {
  color: #07C160;
}
.agree-text {
  font-size: 12px;
  color: #999;
}
.agree-link {
  font-size: 12px;
  color: #07C160;
}
</style>
