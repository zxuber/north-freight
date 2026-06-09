<template>
  <view class="page-container">
    <!-- 顶部定位栏 -->
    <view class="header">
      <view class="header-loc" @click="showCityPicker = true">
        <text class="header-city">{{ currentCity }}</text>
        <text class="header-arrow">▾</text>
      </view>
      <view class="header-actions">
        <text class="header-icon" @click="goMore">⋯</text>
        <text class="header-icon" @click="refreshLocation">⟳</text>
      </view>
    </view>

    <!-- 整车/拼车扁长开关 -->
    <view class="mode-bar">
      <view class="mode-switch">
        <view class="mode-option" :class="{ on: transportMode === '整车' }" @click="switchMode('整车')">
          <text class="mode-text">整车</text>
        </view>
        <view class="mode-option" :class="{ on: transportMode === '拼车' }" @click="switchMode('拼车')">
          <text class="mode-text">拼车</text>
        </view>
      </view>
    </view>

    <!-- 车型选择（整车模式） -->
    <view class="vehicle-section" v-if="transportMode === '整车'">
      <view class="vehicle-scroll-row">
        <scroll-view scroll-x class="vehicle-scroll" :show-scrollbar="false">
          <view class="vehicle-tags">
            <view
              class="vehicle-tag"
              v-for="v in vehicleTypes"
              :key="v"
              :class="{ selected: selectedVehicle === v }"
              @click="selectVehicle(v)"
            >
              <text>{{ v }}</text>
            </view>
          </view>
        </scroll-view>
        <view class="vehicle-more-fixed" @click="goMoreVehicles">
          <text>更多</text>
        </view>
      </view>

      <!-- 车辆尺寸示意图 -->
      <view class="vehicle-schema" v-if="selectedVehicle">
        <view class="schema-header">
          <text class="schema-name">{{ selectedVehicle }}</text>
          <text class="schema-size">{{ currentVehicle.length }}m × {{ currentVehicle.width }}m × {{ currentVehicle.height }}m</text>
        </view>
        <view class="schema-drawing">
          <view class="schema-car" :style="{ width: schemaWidth + 'px', height: schemaHeight + 'px' }">
            <view class="schema-cab">
              <text class="schema-tag">驾驶室</text>
            </view>
            <view class="schema-box" :style="{ width: schemaCargo + 'px' }">
              <text class="schema-tag">货箱</text>
            </view>
          </view>
          <view class="schema-total-length">
            <text>{{ currentVehicle.length }}m</text>
          </view>
        </view>
        <view class="schema-dims">
          <text>{{ currentVehicle.length }}m(长) × {{ currentVehicle.width }}m(宽) × {{ currentVehicle.height }}m(高)</text>
        </view>
      </view>
    </view>

    <!-- 拼车占位 -->
    <view class="vehicle-section" v-else>
      <view class="placeholder-card">
        <text class="placeholder-text">拼车功能即将上线，敬请期待</text>
      </view>
    </view>

    <!-- 装卸货地址区 -->
    <view class="address-card">
      <view class="addr-row" @click="goPickLoad">
        <view class="addr-dot addr-dot-start"></view>
        <view class="addr-content">
          <text class="addr-label">装货地</text>
          <text class="addr-value">{{ loadAddress || '请选择装货地址' }}</text>
          <view class="addr-contact-info" v-if="loadContactName">
            <text class="addr-contact-name">{{ loadContactName }}</text>
            <text class="addr-contact-phone">{{ loadContactPhone }}</text>
          </view>
        </view>
        <text class="addr-contact" @click.stop="goContacts('load')">选择联系人 ›</text>
      </view>
      <view class="addr-divider"></view>
      <view class="addr-row" @click="goPickUnload">
        <view class="addr-dot addr-dot-end"></view>
        <view class="addr-content">
          <text class="addr-label">卸货地</text>
          <text class="addr-value">{{ unloadAddress || '请选择卸货地址' }}</text>
          <view class="addr-contact-info" v-if="unloadContactName">
            <text class="addr-contact-name">{{ unloadContactName }}</text>
            <text class="addr-contact-phone">{{ unloadContactPhone }}</text>
          </view>
        </view>
        <text class="addr-contact" @click.stop="goContacts('unload')">选择联系人 ›</text>
      </view>
    </view>


    <!-- 快捷操作 -->
    <view class="quick-row">
      <view class="quick-item" @click="quickResend">快速重发</view>
      <view class="quick-item" @click="addWaypoint">添加途经点</view>
    </view>

    <!-- 服务保障 -->
    <view class="guarantees">
      <view class="guarantee-item">
        <text class="g-icon">✓</text>
        <text class="g-text">免费送100万货运保险</text>
      </view>
      <view class="guarantee-item">
        <text class="g-icon">✓</text>
        <text class="g-text">100%回单</text>
      </view>
      <view class="guarantee-item">
        <text class="g-icon">✓</text>
        <text class="g-text">正规发票</text>
      </view>
    </view>

    <!-- 快捷入口 -->
    <view class="entry-grid">
      <view class="entry-item" v-for="item in entries" :key="item.name">
        <view class="entry-icon-box" :style="{ background: item.bg }">
          <text class="entry-emoji">{{ item.icon }}</text>
        </view>
        <text class="entry-name">{{ item.name }}</text>
      </view>
    </view>

    <!-- 推广区 -->
    <view class="promo-area">
      <view class="promo-main">
        <view class="promo-main-tag">常见疑问答疑</view>
        <view class="promo-main-sub">遇到问题点这里</view>
        <view class="promo-main-btn">去查看</view>
      </view>
      <view class="promo-side">
        <view class="promo-side-item">
          <text class="promo-side-title">省省农场</text>
          <text class="promo-side-sub">免费领奖品 ›</text>
        </view>
        <view class="promo-side-item">
          <text class="promo-side-title">大额运费补贴</text>
          <text class="promo-side-sub">立即领取 ›</text>
        </view>
      </view>
    </view>

    <!-- 城市选择器 -->
    <u-popup :show="showCityPicker" mode="bottom" @close="showCityPicker = false" :round="true">
      <view class="picker-wrap">
        <view class="picker-head">
          <text class="picker-title">选择城市</text>
          <text class="picker-close" @click="showCityPicker = false">✕</text>
        </view>
        <view class="picker-search">
          <input class="picker-input" v-model="citySearch" placeholder="搜索城市名" @input="filterCities" />
        </view>
        <scroll-view scroll-y class="picker-list">
          <view
            class="picker-item"
            v-for="city in filteredCities"
            :key="city"
            :class="{ current: city === currentCity }"
            @click="selectCity(city)"
          >
            <text>{{ city }}</text>
            <text v-if="city === currentCity" class="picker-check">✓</text>
          </view>
        </scroll-view>
      </view>
    </u-popup>
  </view>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const showCityPicker = ref(false)
const citySearch = ref('')
const currentCity = ref('北京')
const transportMode = ref('整车')
const loadAddress = ref('')
const unloadAddress = ref('')
const loadContactName = ref('')
const loadContactPhone = ref('')
const unloadContactName = ref('')
const unloadContactPhone = ref('')

const vehicleTypes = ref([
  '微面','小面','中面','小货','4.2米','5.2米','6.8米','7.6米','9.6米','13米','17.5米','3.8米'
])
const selectedVehicle = ref('微面')

const vehicleSpecs = {
  '微面':  { length:2.6, width:1.3, height:1.2 },
  '小面':  { length:3.0, width:1.4, height:1.3 },
  '中面':  { length:3.5, width:1.6, height:1.5 },
  '小货':  { length:4.2, width:1.8, height:1.8 },
  '4.2米': { length:4.2, width:2.1, height:2.0 },
  '5.2米': { length:5.2, width:2.2, height:2.1 },
  '6.8米': { length:6.8, width:2.4, height:2.4 },
  '7.6米': { length:7.6, width:2.4, height:2.5 },
  '9.6米': { length:9.6, width:2.4, height:2.5 },
  '13米':  { length:13.0, width:2.5, height:2.7 },
  '17.5米':{ length:17.5, width:3.0, height:2.8 },
  '3.8米': { length:3.8, width:1.9, height:1.9 }
}

const currentVehicle = computed(() => vehicleSpecs[selectedVehicle.value] || vehicleSpecs['微面'])
const schemaWidth = computed(() => Math.min(currentVehicle.value.length * 18, 240))
const schemaHeight = computed(() => Math.min(currentVehicle.value.height * 22, 90))
const schemaCargo = computed(() => schemaWidth.value * 0.6)

const entries = ref([
  { name: '服务标准', icon: '📋', bg: '#E8F8EE' },
  { name: '关注公众号', icon: '💬', bg: '#E8F8EE' },
  { name: '意见反馈', icon: '✏️', bg: '#FFF3E8' },
  { name: '回单服务', icon: '📄', bg: '#FFF3E8' }
])

const allCities = [
  '北京','上海','广州','深圳','杭州','成都','武汉','南京','重庆','天津',
  '苏州','西安','长沙','郑州','青岛','东莞','宁波','佛山','合肥','无锡',
  '沈阳','大连','厦门','福州','济南','昆明','贵阳','南宁','哈尔滨','长春','石家庄','太原'
]
const filteredCities = computed(() => {
  if (!citySearch.value) return allCities
  return allCities.filter(c => c.includes(citySearch.value))
})

const switchMode = (m) => { transportMode.value = m }
const selectCity = (c) => { currentCity.value = c; showCityPicker.value = false; citySearch.value = '' }
const refreshLocation = () => { uni.showToast({ title: '定位已刷新', icon: 'success' }) }
const goMore = () => {}
const goPickLoad = () => {
  uni.navigateTo({ url: '/pages/address-list/index?type=load' })
}
const goPickUnload = () => {
  uni.navigateTo({ url: '/pages/address-list/index?type=unload' })
}
const activeContactType = ref(null)

const goContacts = (type) => {
  activeContactType.value = type
  uni.navigateTo({ url: '/pages/contacts/index?type=' + type })
}

const handleContactSelected = (item) => {
  if (activeContactType.value === 'load') {
    loadContactName.value = item.name
    loadContactPhone.value = item.phone
  } else if (activeContactType.value === 'unload') {
    unloadContactName.value = item.name
    unloadContactPhone.value = item.phone
  }
  activeContactType.value = null
}

const handleAddressSelected = (data) => {
  if (data.type === 'load') {
    loadAddress.value = data.detail || data.label
  } else if (data.type === 'unload') {
    unloadAddress.value = data.detail || data.label
  }
}

onMounted(() => {
  uni.$on('contactSelected', handleContactSelected)
  uni.$on('addressSelected', handleAddressSelected)
})

onUnmounted(() => {
  uni.$off('contactSelected', handleContactSelected)
  uni.$off('addressSelected', handleAddressSelected)
})
const selectVehicle = (v) => { selectedVehicle.value = v }
const goMoreVehicles = () => { uni.navigateTo({ url: '/pages/vehicle-intro/index?type=' + selectedVehicle.value }) }

// 四个条件全满足时自动跳转确认订单页
let autoNavigated = false
watch(
  () => [loadAddress.value, loadContactName.value, unloadAddress.value, unloadContactName.value],
  ([la, lc, ua, uc]) => {
    if (la && lc && ua && uc && !autoNavigated) {
      autoNavigated = true
      uni.navigateTo({ url: '/pages/order-confirm/index' })
    }
  }
)
const quickResend = () => { uni.showToast({ title: '快速重发开发中', icon: 'none' }) }
const addWaypoint = () => { uni.showToast({ title: '途经点开发中', icon: 'none' }) }
</script>

<style lang="scss" scoped>
.page-container { min-height: 100vh; background: #F6F8F9; padding-bottom: 20px; }

/* 顶部 */
.header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 14px 16px 10px;
}
.header-loc { display: flex; align-items: baseline; gap: 4px; }
.header-city { font-size: 22px; font-weight: 700; color: #1A1A1A; }
.header-arrow { font-size: 14px; color: #999; }
.header-actions { display: flex; gap: 20px; }
.header-icon { font-size: 20px; color: #666; }

/* 扁长开关 */
.mode-bar { padding: 0 16px 12px; }
.mode-switch {
  display: flex;
  background: #E8E8E8;
  border-radius: 22px;
  padding: 4px;
}
.mode-option {
  flex: 1;
  text-align: center;
  padding: 10px 0;
  border-radius: 19px;
  transition: all 0.2s;
  &.on {
    background: #fff;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    .mode-text { color: #07C160; font-weight: 600; }
  }
}
.mode-text { font-size: 15px; color: #999; }

/* 车型列表 */
.vehicle-section { padding: 0 0 12px; }
/* 横向滑动车型标签 */
.vehicle-scroll-row {
  display: flex;
  align-items: center;
  padding: 0 0 0 16px;
}
.vehicle-scroll {
  flex: 1;
  white-space: nowrap;
}
.vehicle-tags {
  display: flex;
  gap: 8px;
  padding: 4px 0;
}
.vehicle-tag {
  flex-shrink: 0;
  padding: 8px 16px;
  border-radius: 18px;
  background: #fff;
  font-size: 13px;
  color: #666;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  transition: all 0.2s;
}
.vehicle-tag.selected {
  background: #07C160;
  color: #fff;
}
.vehicle-more-fixed {
  flex-shrink: 0;
  padding: 8px 12px;
  margin: 0 12px;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  font-size: 13px;
  color: #07C160;
  font-weight: 600;
}
/* 车辆示意图 */
.vehicle-schema {
  margin: 12px 16px 0;
  background: #fff;
  border-radius: 14px;
  padding: 16px;
  box-shadow: 0 1px 6px rgba(0,0,0,0.03);
}
.schema-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.schema-name {
  font-size: 16px;
  font-weight: 700;
  color: #07C160;
}
.schema-size {
  font-size: 12px;
  color: #999;
}
.schema-drawing {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.schema-car {
  display: flex;
  border: 3px solid #07C160;
  border-radius: 6px 6px 3px 3px;
  overflow: hidden;
}
.schema-cab {
  width: 28%;
  background: #D4F1E4;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 2px solid #07C160;
}
.schema-box {
  flex: 1;
  background: #E8F8EE;
  display: flex;
  align-items: center;
  justify-content: center;
}
.schema-tag {
  font-size: 10px;
  color: #07C160;
}
.schema-total-length {
  margin-top: 6px;
  font-size: 13px;
  color: #666;
}
.schema-dims {
  text-align: center;
  margin-top: 8px;
  font-size: 12px;
  color: #999;
}

/* 拼车占位 */
.placeholder-card {
  background: #fff; border-radius: 14px; padding: 40px; text-align: center;
  box-shadow: 0 1px 8px rgba(0,0,0,0.04);
}
.placeholder-text { font-size: 14px; color: #bbb; }

/* 地址卡片 */
.address-card { margin: 0 16px 12px; background: #fff; border-radius: 14px; padding: 4px 0; box-shadow: 0 1px 8px rgba(0,0,0,0.04); }
.addr-row { display: flex; align-items: center; padding: 14px 16px; }
.addr-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; margin-right: 12px; }
.addr-dot-start { background: #07C160; }
.addr-dot-end { background: #FF3141; }
.addr-content { flex: 1; display: flex; flex-direction: column; gap: 2px; }
.addr-label { font-size: 11px; color: #999; }
.addr-value { font-size: 15px; color: #1A1A1A; }
.addr-contact-info { display: flex; align-items: center; gap: 8px; margin-top: 4px; }
.addr-contact-name { font-size: 13px; color: #07C160; font-weight: 500; }
.addr-contact-phone { font-size: 12px; color: #999; }
.addr-contact { font-size: 13px; color: #07C160; flex-shrink: 0; padding: 6px 12px; border: 1px solid #07C160; border-radius: 16px; }
.addr-divider { margin: 0 16px 0 38px; border-top: 1px dashed #E5E5E5; }

/* 快捷 */
.quick-row { display: flex; gap: 12px; margin: 0 16px 14px; }
.quick-item { font-size: 13px; color: #07C160; background: rgba(7,193,96,0.08); padding: 10px 18px; border-radius: 20px; }

/* 保障 */
.guarantees { margin: 0 16px 14px; background: #fff; border-radius: 14px; padding: 14px 18px; box-shadow: 0 1px 6px rgba(0,0,0,0.03); }
.guarantee-item { display: flex; align-items: center; gap: 10px; padding: 5px 0; }
.g-icon { color: #07C160; font-weight: 700; font-size: 16px; }
.g-text { font-size: 13px; color: #555; }

/* 入口 */
.entry-grid { display: flex; margin: 0 16px 14px; background: #fff; border-radius: 14px; padding: 16px 0; box-shadow: 0 1px 6px rgba(0,0,0,0.03); }
.entry-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 8px; }
.entry-icon-box { width: 44px; height: 44px; border-radius: 14px; display: flex; align-items: center; justify-content: center; }
.entry-emoji { font-size: 22px; }
.entry-name { font-size: 11px; color: #777; }

/* 推广 */
.promo-area { display: flex; gap: 10px; margin: 0 16px; }
.promo-main { flex: 1; background: linear-gradient(160deg, #E8F8EE, #D0F0DD); border-radius: 14px; padding: 16px; display: flex; flex-direction: column; gap: 6px; }
.promo-main-tag { font-size: 15px; font-weight: 700; color: #1A1A1A; }
.promo-main-sub { font-size: 12px; color: #777; }
.promo-main-btn { align-self: flex-start; font-size: 12px; color: #fff; background: #FF8F1F; padding: 6px 16px; border-radius: 14px; margin-top: 4px; }
.promo-side { flex: 1; display: flex; flex-direction: column; gap: 10px; }
.promo-side-item { flex: 1; background: linear-gradient(160deg, #FFF4EB, #FFE8D6); border-radius: 14px; padding: 12px 14px; display: flex; flex-direction: column; justify-content: center; gap: 4px; }
.promo-side-title { font-size: 14px; font-weight: 700; color: #1A1A1A; }
.promo-side-sub { font-size: 11px; color: #999; }

/* 城市选择器 */
.picker-wrap { padding-bottom: env(safe-area-inset-bottom); }
.picker-head { display: flex; justify-content: space-between; align-items: center; padding: 16px; border-bottom: 1px solid #F0F0F0; }
.picker-title { font-size: 17px; font-weight: 600; }
.picker-close { font-size: 18px; color: #999; }
.picker-search { padding: 12px 16px; }
.picker-input { width: 100%; height: 38px; background: #F5F5F5; border-radius: 19px; padding: 0 16px; font-size: 14px; box-sizing: border-box; }
.picker-list { max-height: 55vh; }
.picker-item { display: flex; justify-content: space-between; padding: 15px 16px; border-bottom: 1px solid #F8F8F8; font-size: 16px; }
.picker-item.current { color: #07C160; }
.picker-check { color: #07C160; font-weight: 700; }
</style>
