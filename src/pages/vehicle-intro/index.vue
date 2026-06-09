<template>
  <view class="page">
    <!-- 车型标题 -->
    <view class="hero">
      <text class="hero-name">{{ vehicle.name }}</text>
      <text class="hero-price">最低 {{ vehicle.price }} 起步</text>
    </view>

    <!-- 尺寸示意图 -->
    <view class="section">
      <view class="section-title">车身尺寸</view>
      <view class="dim-card">
        <view class="dim-row">
          <view class="dim-item">
            <text class="dim-val">{{ vehicle.length }}m</text>
            <text class="dim-label">长</text>
          </view>
          <view class="dim-item">
            <text class="dim-val">{{ vehicle.width }}m</text>
            <text class="dim-label">宽</text>
          </view>
          <view class="dim-item">
            <text class="dim-val">{{ vehicle.height }}m</text>
            <text class="dim-label">高</text>
          </view>
        </view>
        <!-- 小车示意图 -->
        <view class="car-schema">
          <view class="schema-body" :style="{ width: schemaWidth + 'px', height: schemaHeight + 'px' }">
            <view class="schema-roof">
              <text class="schema-label">驾驶室</text>
            </view>
            <view class="schema-cargo" :style="{ width: schemaCargo + 'px' }">
              <text class="schema-label">货箱</text>
            </view>
          </view>
          <view class="schema-bottom">
            <text class="schema-total">{{ vehicle.length }}m</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 实景参考 -->
    <view class="section">
      <view class="section-title">车型实景</view>
      <view class="photo-card">
        <view class="photo-placeholder">
          <text class="photo-emoji">🚛</text>
          <text class="photo-hint">{{ vehicle.name }}实景参考图</text>
        </view>
      </view>
    </view>

    <!-- 建议装载 -->
    <view class="section">
      <view class="section-title">建议装载 {{ vehicle.loadDesc }}</view>
      <view class="ref-grid">
        <view class="ref-item" v-for="item in loadRefs" :key="item.name">
          <view class="ref-icon-box">
            <text class="ref-emoji">{{ item.icon }}</text>
          </view>
          <text class="ref-name">{{ item.name }}</text>
          <text class="ref-desc">{{ item.desc }}</text>
        </view>
      </view>
    </view>

    <!-- 底部下单按钮 -->
    <view class="footer">
      <view class="footer-price">
        <text class="footer-price-label">最低</text>
        <text class="footer-price-val">¥{{ vehicle.price }}</text>
        <text class="footer-price-label">起步</text>
      </view>
      <view class="footer-btn" @click="useVehicle">用{{ vehicle.name }}下单</view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const vehicles = {
  '微面':  { name:'微面',  length:2.6, width:1.3, height:1.2, price:'88',  loadDesc:'1.5吨/2方以内' },
  '小面':  { name:'小面',  length:3.0, width:1.4, height:1.3, price:'108', loadDesc:'2吨/3方以内' },
  '中面':  { name:'中面',  length:3.5, width:1.6, height:1.5, price:'138', loadDesc:'3吨/5方以内' },
  '小货':  { name:'小货',  length:4.2, width:1.8, height:1.8, price:'168', loadDesc:'5吨/8方以内' },
  '4.2米': { name:'4.2米', length:4.2, width:2.1, height:2.0, price:'228', loadDesc:'8吨/15方以内' },
  '5.2米': { name:'5.2米', length:5.2, width:2.2, height:2.1, price:'288', loadDesc:'10吨/20方以内' },
  '6.8米': { name:'6.8米', length:6.8, width:2.4, height:2.4, price:'388', loadDesc:'15吨/35方以内' },
  '7.6米': { name:'7.6米', length:7.6, width:2.4, height:2.5, price:'458', loadDesc:'18吨/42方以内' },
  '9.6米': { name:'9.6米', length:9.6, width:2.4, height:2.5, price:'588', loadDesc:'22吨/55方以内' },
  '13米':  { name:'13米',  length:13.0, width:2.5, height:2.7, price:'888', loadDesc:'30吨/75方以内' },
  '17.5米':{ name:'17.5米', length:17.5, width:3.0, height:2.8, price:'1288',loadDesc:'35吨/120方以内' },
  '3.8米': { name:'3.8米', length:3.8, width:1.9, height:1.9, price:'208', loadDesc:'6吨/12方以内' },
}

const vehicle = ref(vehicles['微面'])

const schemaWidth = computed(() => Math.min(vehicle.value.length * 18, 240))
const schemaHeight = computed(() => Math.min(vehicle.value.height * 22, 100))
const schemaCargo = computed(() => schemaWidth.value * 0.6)

const loadRefs = ref([
  { name:'小型冰箱',   desc:'≤90L',     icon:'🧊' },
  { name:'小型洗衣机', desc:'家用型',    icon:'🫧' },
  { name:'微波炉',     desc:'标准尺寸',  icon:'📡' },
  { name:'床头柜',     desc:'单个',      icon:'🪵' },
])

onLoad((options) => {
  const type = options?.type || '微面'
  if (vehicles[type]) {
    vehicle.value = vehicles[type]
  }
  uni.setNavigationBarTitle({ title: vehicle.value.name + ' · 车辆介绍' })
})

const useVehicle = () => {
  uni.setStorageSync('selectedVehicle', vehicle.value.name)
  uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #F6F8F9;
  padding-bottom: 100px;
}
.hero {
  background: linear-gradient(135deg, #07C160, #06AD56);
  padding: 28px 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}
.hero-name {
  font-size: 24px;
  font-weight: 700;
  color: #fff;
}
.hero-price {
  font-size: 13px;
  color: rgba(255,255,255,0.85);
  background: rgba(0,0,0,0.15);
  padding: 4px 12px;
  border-radius: 12px;
}
.section {
  margin: 14px 16px 0;
}
.section-title {
  font-size: 15px;
  font-weight: 600;
  color: #1A1A1A;
  margin-bottom: 10px;
}
.dim-card {
  background: #fff;
  border-radius: 14px;
  padding: 16px;
  box-shadow: 0 1px 6px rgba(0,0,0,0.03);
}
.dim-row {
  display: flex;
  justify-content: space-around;
  padding-bottom: 16px;
  border-bottom: 1px solid #F0F0F0;
  margin-bottom: 16px;
}
.dim-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}
.dim-val {
  font-size: 20px;
  font-weight: 700;
  color: #07C160;
}
.dim-label {
  font-size: 12px;
  color: #999;
}
.car-schema {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.schema-body {
  display: flex;
  border: 3px solid #07C160;
  border-radius: 8px 8px 4px 4px;
  overflow: hidden;
}
.schema-roof {
  width: 30%;
  background: #D4F1E4;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 2px solid #07C160;
}
.schema-cargo {
  flex: 1;
  background: #E8F8EE;
  display: flex;
  align-items: center;
  justify-content: center;
}
.schema-label {
  font-size: 10px;
  color: #07C160;
}
.schema-bottom {
  margin-top: 6px;
}
.schema-total {
  font-size: 13px;
  color: #666;
}
.photo-card {
  background: #fff;
  border-radius: 14px;
  padding: 16px;
  box-shadow: 0 1px 6px rgba(0,0,0,0.03);
}
.photo-placeholder {
  height: 160px;
  background: #F5F5F5;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.photo-emoji {
  font-size: 48px;
}
.photo-hint {
  font-size: 13px;
  color: #bbb;
}
.ref-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.ref-item {
  width: calc(50% - 5px);
  background: #fff;
  border-radius: 12px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  box-shadow: 0 1px 6px rgba(0,0,0,0.03);
}
.ref-icon-box {
  width: 52px;
  height: 52px;
  background: #F6F8F9;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ref-emoji {
  font-size: 28px;
}
.ref-name {
  font-size: 14px;
  font-weight: 600;
  color: #1A1A1A;
}
.ref-desc {
  font-size: 11px;
  color: #999;
}
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 16px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
  background: #fff;
  border-top: 1px solid #F0F0F0;
  display: flex;
  align-items: center;
  gap: 12px;
}
.footer-price {
  display: flex;
  align-items: baseline;
  gap: 4px;
}
.footer-price-label {
  font-size: 12px;
  color: #999;
}
.footer-price-val {
  font-size: 22px;
  font-weight: 800;
  color: #FF3141;
}
.footer-btn {
  flex: 1;
  background: #07C160;
  color: #fff;
  text-align: center;
  padding: 14px;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 600;
}
</style>
