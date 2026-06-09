<template>
<view class="page">
  <!-- 搜索栏 -->
  <view class="search-bar">
    <view class="search-box">
      <text class="search-icon">&#x1F50D;</text>
      <input class="search-input" v-model="keyword" placeholder="搜索运单号/城市" confirm-type="search" @confirm="doSearch" />
      <text v-if="keyword" class="search-clear" @click="keyword='';doSearch()">&#x2715;</text>
    </view>
  </view>

  <!-- 发货单/收货单 切换 -->
  <view class="type-tabs">
    <view class="type-tab" :class="{on:orderType==='send'}" @click="switchType('send')">发货单</view>
    <view class="type-tab" :class="{on:orderType==='receive'}" @click="switchType('receive')">收货单</view>
  </view>

  <!-- 状态筛选 -->
  <scroll-view class="status-row" scroll-x :show-scrollbar="false">
    <view class="status-tag" v-for="s in statusTabs" :key="s" :class="{on:activeStatus===s}" @click="switchStatus(s)">
      <text>{{ s }}</text>
      <text v-if="statusCounts[s]" class="status-num">{{ statusCounts[s] }}</text>
    </view>
  </scroll-view>

  <!-- 运单列表 -->
  <scroll-view class="list-area" scroll-y :refresher-enabled="true" :refresher-triggered="refreshing" @refresherrefresh="onRefresh" @scrolltolower="onLoadMore">
    <view v-if="orderType==='receive'" class="empty-box">
      <text class="empty-text">收货单功能即将上线</text>
    </view>
    <block v-else>
      <view v-if="orderList.length > 0">
        <view class="order-card" v-for="order in orderList" :key="order.orderId" @click="goDetail(order)">
          <view class="card-top">
            <text class="card-no">{{ order.waybillNo }}</text>
            <text class="card-status" :style="{color:statusColor(order.orderStatus),background:statusBg(order.orderStatus)}">{{ order.orderStatus }}</text>
          </view>
          <view class="card-route">
            <view class="route-node">
              <view class="route-dot start"></view>
              <text class="route-city">{{ order.senderCity }}{{ order.senderDistrict }}</text>
            </view>
            <text class="route-dist">{{ order.distance }}km</text>
            <view class="route-node">
              <view class="route-dot end"></view>
              <text class="route-city">{{ order.receiverCity }}{{ order.receiverDistrict }}</text>
            </view>
          </view>
          <view class="card-tags">
            <text class="card-tag">{{ order.transportMode }}</text>
            <text class="card-tag">{{ order.vehicleType }}</text>
            <text class="card-tag">{{ order.cargoType }}</text>
            <text class="card-tag">{{ order.cargoWeight }}吨</text>
          </view>
          <view class="card-bottom">
            <text class="card-price">¥{{ order.finalPrice || order.estimatedPriceMin }}<text v-if="!order.finalPrice" class="card-price-range">~{{ order.estimatedPriceMax }}</text></text>
            <text class="card-time">{{ order.createTime.substring(5,16) }}</text>
          </view>
        </view>
        <view v-if="loading" class="loading-text">加载中...</view>
        <view v-else-if="noMore" class="loading-text">没有更多了</view>
      </view>
      <view v-else-if="!loading" class="empty-box">
        <text class="empty-icon">&#x1F4E6;</text>
        <text class="empty-text">暂无运单</text>
        <view class="empty-btn" @click="goHome">去下单</view>
      </view>
    </block>
  </scroll-view>
</view>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getOrderList, getOrderCountByStatus } from '@/api/order'

const ORDER_STATUS_COLORS = {
  '待报价': { color: '#FF8F1F', bg: '#FFF3E8' },
  '待装货': { color: '#1677FF', bg: '#E8F4FF' },
  '运输中': { color: '#1677FF', bg: '#E8F4FF' },
  '已签收': { color: '#07C160', bg: '#E8F8EE' },
  '已完成': { color: '#999', bg: '#F5F5F5' },
  '已取消': { color: '#999', bg: '#F5F5F5' }
}
function statusColor(s) { return (ORDER_STATUS_COLORS[s] || {color:'#999'}).color }
function statusBg(s) { return (ORDER_STATUS_COLORS[s] || {bg:'#F5F5F5'}).bg }

const statusTabs = ['全部', '待报价', '待装货', '运输中', '已签收', '已完成', '已取消']
const activeStatus = ref('全部')
const orderType = ref('send')
const keyword = ref('')
const orderList = ref([])
const statusCounts = reactive({})
const page = ref(1)
const loading = ref(false)
const refreshing = ref(false)
const noMore = ref(false)

onShow(() => { page.value = 1; orderList.value = []; fetchCounts(); fetchList() })

function switchType(t) { orderType.value = t; page.value = 1; orderList.value = []; fetchList() }
function switchStatus(s) { activeStatus.value = s; page.value = 1; orderList.value = []; fetchList() }
function doSearch() { page.value = 1; orderList.value = []; fetchList() }

async function fetchCounts() {
  try { const counts = await getOrderCountByStatus(); Object.assign(statusCounts, counts) } catch {}
}
async function fetchList() {
  if (loading.value) return
  loading.value = true
  try {
    const res = await getOrderList({ page: page.value, pageSize: 10, status: activeStatus.value, keyword: keyword.value })
    const { records, total } = res
    orderList.value = page.value === 1 ? records : [...orderList.value, ...records]
    noMore.value = orderList.value.length >= total
  } catch { uni.showToast({ title: '加载失败', icon: 'none' }) }
  finally { loading.value = false; refreshing.value = false }
}
function onRefresh() { refreshing.value = true; page.value = 1; fetchList(); fetchCounts() }
function onLoadMore() { if (!loading.value && !noMore.value) { page.value++; fetchList() } }
function goDetail(order) { uni.navigateTo({ url: '/pages/order-detail/index?id=' + order.orderId }) }
function goHome() { uni.switchTab({ url: '/pages/index/index' }) }
</script>

<style>
.page { display:flex; flex-direction:column; min-height:100vh; background:#F5F5F5; }

/* 搜索 */
.search-bar { padding:12px 16px; background:#fff; }
.search-box { display:flex; align-items:center; background:#F5F5F5; border-radius:20px; padding:0 14px; height:38px; }
.search-icon { font-size:16px; margin-right:8px; }
.search-input { flex:1; font-size:14px; color:#1A1A1A; }
.search-clear { font-size:16px; color:#CCC; padding:4px; }

/* 类型切换 */
.type-tabs { display:flex; background:#fff; padding:0 16px; border-bottom:1px solid #F0F0F0; }
.type-tab { flex:1; text-align:center; padding:12px 0; font-size:15px; color:#999; position:relative; }
.type-tab.on { color:#1A1A1A; font-weight:600; }
.type-tab.on::after { content:''; position:absolute; bottom:0; left:50%; transform:translateX(-50%); width:28px; height:3px; background:#07C160; border-radius:2px; }

/* 状态 */
.status-row { background:#fff; white-space:nowrap; padding:8px 16px; flex-shrink:0; }
.status-tag { display:inline-flex; align-items:center; padding:6px 14px; border-radius:16px; font-size:13px; color:#999; background:#F5F5F5; margin-right:8px; }
.status-tag.on { color:#07C160; background:#E8F8EE; font-weight:600; }
.status-num { font-size:11px; background:#07C160; color:#fff; padding:1px 6px; border-radius:10px; margin-left:4px; min-width:18px; text-align:center; }

/* 列表 */
.list-area { flex:1; padding:10px 16px 0; }
.order-card { background:#fff; border-radius:12px; padding:14px; margin-bottom:10px; box-shadow:0 1px 4px rgba(0,0,0,0.04); }
.card-top { display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; }
.card-no { font-size:13px; color:#666; }
.card-status { font-size:11px; padding:3px 8px; border-radius:4px; }
.card-route { display:flex; align-items:center; margin-bottom:10px; }
.route-node { flex:1; display:flex; align-items:center; gap:6px; min-width:0; }
.route-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
.route-dot.start { background:#07C160; }
.route-dot.end { background:#FF3141; }
.route-city { font-size:14px; color:#1A1A1A; font-weight:500; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.route-dist { font-size:11px; color:#BBB; width:70px; text-align:center; flex-shrink:0; }
.card-tags { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:10px; padding-bottom:10px; border-bottom:1px solid #F8F8F8; }
.card-tag { font-size:11px; color:#999; background:#F5F5F5; padding:2px 8px; border-radius:3px; }
.card-bottom { display:flex; justify-content:space-between; align-items:baseline; }
.card-price { font-size:18px; color:#FF3141; font-weight:700; }
.card-price-range { font-size:12px; color:#CCC; font-weight:400; }
.card-time { font-size:11px; color:#CCC; }

.empty-box { display:flex; flex-direction:column; align-items:center; padding:80px 0; }
.empty-icon { font-size:48px; opacity:0.3; }
.empty-text { font-size:14px; color:#BBB; margin-top:12px; }
.empty-btn { margin-top:16px; padding:8px 32px; background:#07C160; color:#fff; border-radius:20px; font-size:14px; }
.loading-text { text-align:center; padding:20px; font-size:13px; color:#CCC; }
</style>
