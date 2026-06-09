<template>
<view class="page">
  <!-- 状态头 -->
  <view class="header">
    <text class="h-status" :style="{color:stColor,background:stBg}">{{ order.orderStatus }}</text>
    <text class="h-no">{{ order.waybillNo }}</text>
    <text class="h-tip" v-if="order.orderStatus==='待报价'">已有 {{ order.quoteCount }} 位司机报价</text>
    <text class="h-tip" v-else-if="order.orderStatus==='运输中'">货物正在运输中</text>
  </view>

  <!-- 路线 -->
  <view class="card">
    <text class="card-title">路线信息</text>
    <view class="route">
      <view class="r-node">
        <view class="r-dot s"></view>
        <view class="r-body"><text class="r-label">发货地</text><text class="r-addr">{{ order.senderCity }} {{ order.senderDistrict }}</text><text class="r-detail">{{ order.senderDetail || '-' }}</text></view>
      </view>
      <view class="r-line"><text class="r-dist">{{ order.distance }}km</text></view>
      <view class="r-node">
        <view class="r-dot e"></view>
        <view class="r-body"><text class="r-label">收货地</text><text class="r-addr">{{ order.receiverCity }} {{ order.receiverDistrict }}</text><text class="r-detail">{{ order.receiverDetail || '-' }}</text></view>
      </view>
    </view>
  </view>

  <!-- 货物 -->
  <view class="card">
    <text class="card-title">货物信息</text>
    <view class="grid">
      <view class="gi"><text class="gi-k">运输方式</text><text class="gi-v">{{ order.transportMode }}</text></view>
      <view class="gi"><text class="gi-k">车型要求</text><text class="gi-v">{{ order.vehicleType }}</text></view>
      <view class="gi"><text class="gi-k">货物类型</text><text class="gi-v">{{ order.cargoType }}</text></view>
      <view class="gi"><text class="gi-k">货物重量</text><text class="gi-v">{{ order.cargoWeight }} 吨</text></view>
      <view class="gi"><text class="gi-k">货物体积</text><text class="gi-v">{{ order.cargoVolume }} m³</text></view>
      <view class="gi"><text class="gi-k">货物数量</text><text class="gi-v">{{ order.cargoCount }} 件</text></view>
    </view>
  </view>

  <!-- 费用 -->
  <view class="card">
    <text class="card-title">费用信息</text>
    <view class="fee-box">
      <text class="fee-label">{{ order.finalPrice ? '成交价格' : '预估价格' }}</text>
      <text class="fee-amount">¥{{ order.finalPrice || order.estimatedPriceMin }}<text v-if="!order.finalPrice" class="fee-range">~{{ order.estimatedPriceMax }}</text></text>
    </view>
  </view>

  <!-- 运单信息 -->
  <view class="card">
    <text class="card-title">运单信息</text>
    <view class="info-row"><text class="ik">运单编号</text><text class="iv" selectable>{{ order.waybillNo }}</text></view>
    <view class="info-row"><text class="ik">下单时间</text><text class="iv">{{ order.createTime }}</text></view>
    <view class="info-row"><text class="ik">支付状态</text><text class="iv" :style="{color:order.payStatus==='已支付'||order.payStatus==='已结算'?'#07C160':'#FF8F1F'}">{{ order.payStatus }}</text></view>
  </view>

  <!-- 底部按钮 -->
  <view class="bottom" v-if="showBtns">
    <view v-if="order.orderStatus==='待报价'" class="btn btn-danger" @click="cancelOrder">取消运单</view>
    <view v-if="order.orderStatus==='运输中'" class="btn btn-outline" @click="contact">&#x1F4DE; 联系司机</view>
    <view v-if="order.orderStatus==='已签收'" class="btn btn-primary" @click="confirm">确认收货</view>
  </view>
</view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getOrderDetail } from '@/api/order'

const STATUS_MAP = {
  '待报价':{color:'#FF8F1F',bg:'#FFF3E8'},'待装货':{color:'#1677FF',bg:'#E8F4FF'},
  '运输中':{color:'#1677FF',bg:'#E8F4FF'},'已签收':{color:'#07C160',bg:'#E8F8EE'},
  '已完成':{color:'#999',bg:'#F5F5F5'},'已取消':{color:'#999',bg:'#F5F5F5'}
}

const order = ref({ orderId:'',waybillNo:'',orderStatus:'',transportMode:'',vehicleType:'',cargoType:'',cargoWeight:'0',cargoVolume:'0',cargoCount:0,senderCity:'',senderDistrict:'',senderDetail:'',receiverCity:'',receiverDistrict:'',receiverDetail:'',distance:'0',estimatedPriceMin:'0',estimatedPriceMax:'0',finalPrice:'',quoteCount:0,payStatus:'',createTime:'' })

const stColor = computed(function(){ return (STATUS_MAP[order.value.orderStatus]||{}).color||'#999' })
const stBg = computed(function(){ return (STATUS_MAP[order.value.orderStatus]||{}).bg||'#F5F5F5' })
const showBtns = computed(function(){ return ['待报价','运输中','已签收'].indexOf(order.value.orderStatus) > -1 })

onLoad(function(opts) {
  if (opts && opts.id) {
    getOrderDetail(opts.id).then(function(o) { if (o) order.value = o }).catch(function() {})
  }
})

function cancelOrder() {
  uni.showModal({ title:'取消运单', content:'确定要取消吗？', confirmColor:'#FF3141',
    success:function(r) { if (r.confirm) { uni.showToast({ title:'已取消', icon:'success' }); setTimeout(function() { uni.navigateBack() }, 800) } }
  })
}
function confirm() {
  uni.showModal({ title:'确认收货', content:'货物已完好收到？', confirmColor:'#07C160',
    success:function(r) { if (r.confirm) { uni.showToast({ title:'收货确认成功', icon:'success' }); setTimeout(function() { uni.navigateBack() }, 800) } }
  })
}
function contact() { uni.showToast({ title:'司机电话：138****9012', icon:'none', duration:2000 }) }
</script>

<style>
.page { min-height:100vh; background:#F5F5F5; padding-bottom:80px; }

.header { background:linear-gradient(135deg,#07C160,#06AD56); padding:24px 16px 18px; color:#fff; }
.h-status { font-size:12px; padding:3px 10px; border-radius:4px; }
.h-no { display:block; font-size:13px; opacity:0.8; margin-top:8px; }
.h-tip { display:block; font-size:13px; opacity:0.85; margin-top:6px; }

.card { background:#fff; margin:10px 16px; border-radius:12px; padding:16px; box-shadow:0 1px 4px rgba(0,0,0,0.04); }
.card-title { font-size:15px; font-weight:600; color:#1A1A1A; display:block; margin-bottom:10px; }

.route {}
.r-node { display:flex; align-items:flex-start; gap:10px; }
.r-dot { width:10px; height:10px; border-radius:50%; margin-top:6px; flex-shrink:0; }
.r-dot.s { background:#07C160; } .r-dot.e { background:#FF3141; }
.r-body { flex:1; min-width:0; }
.r-label { font-size:11px; color:#999; display:block; }
.r-addr { font-size:15px; color:#1A1A1A; font-weight:500; display:block; margin-top:2px; }
.r-detail { font-size:13px; color:#999; display:block; margin-top:2px; }
.r-line { padding:6px 0 6px 26px; }
.r-dist { font-size:11px; color:#BBB; }

.grid { display:flex; flex-wrap:wrap; }
.gi { width:50%; padding:6px 0; }
.gi-k { font-size:12px; color:#999; display:block; }
.gi-v { font-size:14px; color:#1A1A1A; font-weight:500; display:block; margin-top:2px; }

.fee-box { background:#F5F5F5; border-radius:6px; padding:14px; }
.fee-label { font-size:13px; color:#999; display:block; }
.fee-amount { font-size:22px; color:#FF3141; font-weight:700; display:block; margin-top:4px; }
.fee-range { font-size:16px; color:#CCC; font-weight:400; }

.info-row { display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid #F8F8F8; }
.info-row:last-child { border-bottom:none; }
.ik { font-size:13px; color:#999; }
.iv { font-size:13px; color:#1A1A1A; }

.bottom { position:fixed; bottom:0; left:0; right:0; background:#fff; padding:12px 16px; padding-bottom:calc(12px + env(safe-area-inset-bottom)); display:flex; justify-content:flex-end; gap:10px; box-shadow:0 -2px 8px rgba(0,0,0,0.06); }
.btn { font-size:14px; padding:10px 24px; border-radius:20px; }
.btn-primary { background:#07C160; color:#fff; }
.btn-danger { background:#FF3141; color:#fff; }
.btn-outline { background:transparent; color:#07C160; border:1px solid #07C160; }
</style>
