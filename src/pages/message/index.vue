<template>
<view class="page">
  <!-- 分类 -->
  <view class="cat-tabs">
    <view class="cat-tab" v-for="c in categories" :key="c.value" :class="{on:activeCat===c.value}" @click="switchCat(c.value)">
      <text>{{ c.label }}</text>
      <text v-if="unread[c.value]" class="cat-badge">{{ unread[c.value] > 99 ? '99+' : unread[c.value] }}</text>
    </view>
  </view>

  <!-- 消息列表 -->
  <scroll-view class="list" scroll-y :refresher-enabled="true" :refresher-triggered="refreshing" @refresherrefresh="onRefresh" @scrolltolower="onMore">
    <view v-if="msgList.length > 0">
      <view class="msg-item" v-for="m in msgList" :key="m.id" @click="goDetail(m)">
        <view class="msg-icon-box" :class="'cat-'+m.category">
          <text class="msg-icon">{{ m.category==='order'?'📦':m.category==='system'?'🔔':'🎉' }}</text>
        </view>
        <view class="msg-body">
          <view class="msg-top">
            <text class="msg-title">{{ m.title }}</text>
            <view v-if="!m.isRead" class="msg-dot"></view>
          </view>
          <text class="msg-preview">{{ m.content }}</text>
        </view>
        <text class="msg-time">{{ fmtTime(m.createTime) }}</text>
      </view>
      <view v-if="loading" class="load-tip">加载中...</view>
    </view>
    <view v-else-if="!loading" class="empty">
      <text class="empty-icon">🔔</text>
      <text class="empty-text">暂无消息</text>
    </view>
  </scroll-view>
</view>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getMessageList, getUnreadCount } from '@/api/message'

const categories = [
  { label: '订单通知', value: 'order' },
  { label: '系统通知', value: 'system' },
  { label: '优惠活动', value: 'promotion' }
]
const activeCat = ref('order')
const msgList = ref([])
const unread = reactive({ order: 0, system: 0, promotion: 0 })
const page = ref(1)
const loading = ref(false)
const refreshing = ref(false)

onShow(() => { page.value = 1; msgList.value = []; fetchUnread(); fetchList() })

function switchCat(c) { activeCat.value = c; page.value = 1; msgList.value = []; fetchList() }
async function fetchUnread() {
  try { const d = await getUnreadCount(); Object.assign(unread, d) } catch {}
}
async function fetchList() {
  if (loading.value) return
  loading.value = true
  try {
    const res = await getMessageList({ category: activeCat.value, page: page.value, pageSize: 20 })
    msgList.value = page.value === 1 ? res.records : [...msgList.value, ...res.records]
  } catch { uni.showToast({ title: 'load fail', icon: 'none' }) }
  finally { loading.value = false; refreshing.value = false }
}
function onRefresh() { refreshing.value = true; page.value = 1; fetchList(); fetchUnread() }
function onMore() { if (!loading.value) { page.value++; fetchList() } }
function goDetail(m) { uni.navigateTo({ url: '/pages/message-detail/index?id=' + m.id }) }
function fmtTime(t) {
  if (!t) return ''
  var d = new Date(t.replace(/-/g, '/')); var n = new Date(); var diff = n - d
  if (diff < 6e4) return '刚刚'
  if (diff < 36e5) return Math.floor(diff/6e4) + '分钟前'
  if (diff < 864e5) return Math.floor(diff/36e5) + '小时前'
  if (diff < 1728e5) return '昨天'
  return t.substring(5,10)
}
</script>

<style>
.page { display:flex; flex-direction:column; min-height:100vh; background:#F5F5F5; }

.cat-tabs { display:flex; background:#fff; padding:8px 16px; gap:8px; flex-shrink:0; }
.cat-tab { flex:1; display:flex; align-items:center; justify-content:center; padding:10px 0; border-radius:8px; font-size:14px; color:#999; background:#F5F5F5; position:relative; }
.cat-tab.on { color:#07C160; background:#E8F8EE; font-weight:600; }
.cat-badge { font-size:10px; background:#FF3141; color:#fff; padding:1px 6px; border-radius:10px; margin-left:4px; }

.list { flex:1; }
.msg-item { display:flex; align-items:flex-start; padding:14px 16px; background:#fff; margin-bottom:1px; gap:10px; }
.msg-icon-box { width:44px; height:44px; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.cat-order { background:#E8F4FF; }
.cat-system { background:#FFF3E8; }
.cat-promotion { background:#FFE8EC; }
.msg-icon { font-size:20px; }
.msg-body { flex:1; min-width:0; }
.msg-top { display:flex; align-items:center; gap:6px; }
.msg-title { font-size:15px; color:#1A1A1A; font-weight:500; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.msg-dot { width:8px; height:8px; border-radius:50%; background:#FF3141; flex-shrink:0; }
.msg-preview { font-size:13px; color:#BBB; display:-webkit-box; -webkit-box-orient:vertical; -webkit-line-clamp:2; overflow:hidden; margin-top:4px; }
.msg-time { font-size:11px; color:#CCC; flex-shrink:0; padding-top:3px; }

.empty { display:flex; flex-direction:column; align-items:center; padding:80px 0; }
.empty-icon { font-size:48px; opacity:0.3; }
.empty-text { font-size:14px; color:#BBB; margin-top:12px; }
.load-tip { text-align:center; padding:20px; font-size:13px; color:#CCC; }
</style>
