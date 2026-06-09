<template>
<view class="page">
  <!-- ========== 车型 + 地址统一模块 ========== -->
  <view class="hero-card">
    <view class="hero-top">
      <text class="hero-vehicle">{{ selectedVehicle }}</text>
      <text class="hero-change" @click="showVehicleSheet = true">换车 ›</text>
    </view>
    <view class="hero-sep"></view>
    <!-- 装货地 -->
    <view class="hero-addr" @click="pickAddress('load')">
      <view class="ha-dot g"></view>
      <view class="ha-body">
        <text class="ha-label">装货地</text>
        <text class="ha-detail">{{ loadAddr.detail || '点击选择装货地址' }}</text>
        <view class="ha-contact-info" v-if="loadContact.name">
          <text class="ha-contact-info-name">{{ loadContact.name }}</text>
          <text class="ha-contact-info-phone">{{ loadContact.phone }}</text>
        </view>
      </view>
      <view class="ha-contact" @click.stop="pickContact('load')">
        <text class="ha-contact-name">{{ loadContact.name || '选联系人' }}</text>
        <text class="ha-contact-phone" v-if="loadContact.phone">{{ loadContact.phone }}</text>
      </view>
    </view>
    <!-- 交换按钮 -->
    <view class="hero-swap" @click="swapAddress">⇅ 交换起终点</view>
    <!-- 卸货地 -->
    <view class="hero-addr" @click="pickAddress('unload')">
      <view class="ha-dot r"></view>
      <view class="ha-body">
        <text class="ha-label">卸货地</text>
        <text class="ha-detail">{{ unloadAddr.detail || '点击选择卸货地址' }}</text>
        <view class="ha-contact-info" v-if="unloadContact.name">
          <text class="ha-contact-info-name">{{ unloadContact.name }}</text>
          <text class="ha-contact-info-phone">{{ unloadContact.phone }}</text>
        </view>
      </view>
      <view class="ha-contact" @click.stop="pickContact('unload')">
        <text class="ha-contact-name">{{ unloadContact.name || '选联系人' }}</text>
        <text class="ha-contact-phone" v-if="unloadContact.phone">{{ unloadContact.phone }}</text>
      </view>
    </view>
    <!-- 途径地 -->
    <view class="hero-waypoint" @click="addWaypoint">
      <text class="hwp-text">＋ 途径地</text>
    </view>
  </view>

  <!-- ========== 用车时间 ========== -->
  <view class="card">
    <view class="row-between">
      <text class="row-label">用车时间</text>
    </view>
    <view class="time-row">
      <view class="t-btn" :class="{ on: useTime === 'now' }" @click="useNow">现在用车</view>
      <view class="t-btn" :class="{ on: useTime === 'book' }" @click="showBookSheet = true">
        {{ useTime === 'book' ? bookLabel : '预约用车' }}
      </view>
    </view>
  </view>

  <!-- ========== 价格 ========== -->
  <view class="card price-card">
    <view class="price-left">
      <text class="price-type">普快</text>
      <text class="price-sub">不着急、更省钱</text>
    </view>
    <text class="price-num">¥{{ computedPrice }}</text>
  </view>

  <!-- ========== 可选项 ========== -->
  <view class="card">
    <view class="opt-row">
      <view class="opt" @click="showInvoiceSheet = true">
        <text class="opt-label">开票</text>
        <text class="opt-val">{{ invoiceType }}</text>
      </view>
      <view class="opt" :class="{ on: options.receipt }" @click="options.receipt = !options.receipt">
        <text class="opt-label">回单</text>
        <text class="opt-val">{{ options.receipt ? '需要' : '不需要' }}</text>
      </view>
    </view>
    <view class="opt-row">
      <view class="opt" :class="{ on: options.carry }" @click="showCarrySheet = true">
        <text class="opt-label">搬运</text>
        <text class="opt-val">{{ options.carry ? carryType : '不需要' }}</text>
      </view>
      <view class="opt" :class="{ on: options.returnTrip }" @click="options.returnTrip = !options.returnTrip">
        <text class="opt-label">返程</text>
        <text class="opt-val">{{ options.returnTrip ? '+40%附加费' : '不需要' }}</text>
      </view>
    </view>
    <view class="opt-divider"></view>
    <view class="opt-row-single" @click="showRemarkSheet = true">
      <text class="opt-label">用车备注</text>
      <text class="opt-val">{{ remark || '选填' }}</text>
    </view>
    <view class="opt-row-single" @click="showFollowSheet = true">
      <text class="opt-label">是否跟车</text>
      <text class="opt-val">{{ followCar ? '跟车' : '不跟车' }}</text>
    </view>
    <view class="opt-row-single" @click="showPaySheet = true">
      <text class="opt-label">支付方式</text>
      <text class="opt-val">{{ payMethodLabel }}</text>
    </view>
    <view class="opt-row-single" @click="showDriverSheet = true">
      <text class="opt-label">选择司机</text>
      <text class="opt-val">{{ selectedDriver }}</text>
    </view>
    <view class="opt-row-single" @click="showOrderContactSheet = true">
      <text class="opt-label">下单联系人</text>
      <text class="opt-val">{{ orderContactPhone || loadContact.phone || '未设置' }}</text>
    </view>
  </view>

  <!-- 底部 -->
  <view class="footer-bar">
    <text class="footer-price">¥{{ computedPrice }}</text>
    <view class="footer-btn" @click="showConfirmSheet = true">确认用车</view>
  </view>

  <!-- ======= 半窗们 ======= -->
  <u-popup :show="showVehicleSheet" mode="bottom" :round="true" @close="showVehicleSheet=false">
    <view class="sheet">
      <view class="sheet-head"><text class="sheet-title">请选择车辆</text></view>
      <scroll-view scroll-y class="sheet-body">
        <view class="v-opt" v-for="v in vehicleOptions" :key="v.name" @click="selectVehicle(v.name)">
          <view class="v-icon">🚛</view>
          <view class="v-mid"><text class="v-name">{{ v.name }}</text><text class="v-spec">荷载{{ v.load }} 体积{{ v.vol }} 厢长{{ v.len }}</text></view>
          <view class="v-right"><text class="v-start">¥{{ v.price }}起</text><text class="v-check" v-if="selectedVehicle === v.name">✓</text></view>
        </view>
      </scroll-view>
    </view>
  </u-popup>

  <u-popup :show="showBookSheet" mode="bottom" :round="true" @close="showBookSheet=false">
    <view class="sheet">
      <view class="sheet-head"><text class="sheet-title">选择用车时间</text></view>
      <view class="date-tabs">
        <view class="date-tab" v-for="d in dateTabs" :key="d.label" :class="{ on: d.on }" @click="pickDate(d)">{{ d.label }} {{ d.dateStr }}</view>
      </view>
      <scroll-view scroll-y class="sheet-body time-grid">
        <view class="time-slot" v-for="t in timeSlots" :key="t" :class="{ selected: bookTime === t }" @click="selectBookTime(t)">{{ t }}</view>
      </scroll-view>
    </view>
  </u-popup>

  <u-popup :show="showInvoiceSheet" mode="bottom" :round="true" @close="showInvoiceSheet=false">
    <view class="sheet"><view class="sheet-head"><text class="sheet-title">发票类型</text></view>
      <view class="radio-list">
        <view class="radio-item" :class="{ on: invoiceType==='不开票' }" @click="invoiceType='不开票';showInvoiceSheet=false">不开票</view>
        <view class="radio-item" :class="{ on: invoiceType==='专票' }" @click="invoiceType='专票';showInvoiceSheet=false">专票（需要企业认证）</view>
      </view>
    </view>
  </u-popup>

  <u-popup :show="showCarrySheet" mode="bottom" :round="true" @close="showCarrySheet=false">
    <view class="sheet"><view class="sheet-head"><text class="sheet-title">搬运方式</text></view>
      <view class="radio-list">
        <view class="radio-item" :class="{ on: carryType==='平台计价（推荐）' }" @click="carryType='平台计价（推荐）';options.carry=true;showCarrySheet=false">平台计价（推荐）</view>
        <view class="radio-item" :class="{ on: carryType==='费用与司机协商' }" @click="carryType='费用与司机协商';options.carry=true;showCarrySheet=false">费用与司机协商</view>
        <view class="radio-item" :class="{ on: carryType==='我来出价' }" @click="carryType='我来出价';options.carry=true;showCarrySheet=false">我来出价</view>
      </view>
    </view>
  </u-popup>

  <u-popup :show="showRemarkSheet" mode="bottom" :round="true" @close="showRemarkSheet=false">
    <view class="sheet"><view class="sheet-head"><text class="sheet-title">用车备注</text></view>
      <view class="sheet-body"><textarea class="remark-input" v-model="remark" placeholder="请输入备注信息"/>
        <view class="remark-presets"><view class="preset-tag" v-for="p in remarkPresets" :key="p" @click="remark = remark ? remark+' '+p : p">{{ p }}</view></view>
      </view>
    </view>
  </u-popup>

  <u-popup :show="showFollowSheet" mode="bottom" :round="true" @close="showFollowSheet=false">
    <view class="sheet"><view class="sheet-head"><text class="sheet-title">是否跟车</text></view>
      <view class="radio-list">
        <view class="radio-item" :class="{ on: !followCar }" @click="followCar=false;showFollowSheet=false">不跟车</view>
        <view class="radio-item" :class="{ on: followCar }" @click="followCar=true;showFollowSheet=false">跟车</view>
      </view>
    </view>
  </u-popup>

  <u-popup :show="showPaySheet" mode="bottom" :round="true" @close="showPaySheet=false">
    <view class="sheet"><view class="sheet-head"><text class="sheet-title">支付方式</text><text class="sheet-price">¥{{ computedPrice }}</text></view>
      <view class="radio-list">
        <view class="radio-item" :class="{ on: payMethod==='prepay' }" @click="payMethod='prepay';showPaySheet=false">预付</view>
        <view class="radio-item" :class="{ on: payMethod==='cod_self' }" @click="payMethod='cod_self';showPaySheet=false">我到付</view>
        <view class="radio-item" :class="{ on: payMethod==='cod_receiver' }" @click="payMethod='cod_receiver';showPaySheet=false">收货人到付</view>
      </view>
    </view>
  </u-popup>

  <u-popup :show="showDriverSheet" mode="bottom" :round="true" @close="showDriverSheet=false">
    <view class="sheet"><view class="sheet-head"><text class="sheet-title">选择司机</text></view>
      <view class="radio-list">
        <view class="radio-item" :class="{ on: selectedDriver==='系统自动匹配' }" @click="selectedDriver='系统自动匹配';showDriverSheet=false">系统自动匹配（推荐）</view>
        <view class="radio-item" :class="{ on: selectedDriver==='张师傅 ★4.8' }" @click="selectedDriver='张师傅 ★4.8';showDriverSheet=false">张师傅 ★4.8 京A·12345</view>
        <view class="radio-item" :class="{ on: selectedDriver==='李师傅 ★4.5' }" @click="selectedDriver='李师傅 ★4.5';showDriverSheet=false">李师傅 ★4.5 京B·67890</view>
      </view>
    </view>
  </u-popup>

  <u-popup :show="showOrderContactSheet" mode="bottom" :round="true" @close="showOrderContactSheet=false">
    <view class="sheet"><view class="sheet-head"><text class="sheet-title">下单联系人</text></view>
      <view class="sheet-body">
        <view class="form-item"><text class="form-label">姓名</text><input class="form-input" v-model="orderContactName" placeholder="请输入姓名"/></view>
        <view class="form-item"><text class="form-label">联系电话</text><input class="form-input" v-model="orderContactPhone" type="number" maxlength="11" placeholder="请输入手机号"/></view>
        <view class="btn-confirm" @click="showOrderContactSheet=false">确认</view>
      </view>
    </view>
  </u-popup>

  <u-popup :show="showConfirmSheet" mode="bottom" :round="true" @close="showConfirmSheet=false">
    <view class="sheet"><view class="sheet-head"><text class="sheet-title">确认用车时间</text></view>
      <view class="radio-list">
        <view class="radio-item" :class="{ on: confirmTime==='now' }" @click="confirmTime='now'">立即用车</view>
        <view class="radio-item" :class="{ on: confirmTime===bookLabel }" @click="confirmTime=bookLabel" v-if="useTime==='book'">{{ bookLabel }}</view>
      </view>
      <view class="btn-confirm" @click="doConfirm">确认</view>
    </view>
  </u-popup>
</view>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const selectedVehicle = ref('微面')
const showVehicleSheet = ref(false)
const useTime = ref('now')
const showBookSheet = ref(false)
const bookTime = ref('')
const remark = ref('')
const showRemarkSheet = ref(false)
const followCar = ref(false)
const showFollowSheet = ref(false)
const payMethod = ref('prepay')
const showPaySheet = ref(false)
const selectedDriver = ref('系统自动匹配')
const showDriverSheet = ref(false)
const orderContactName = ref('')
const orderContactPhone = ref('')
const showOrderContactSheet = ref(false)
const showConfirmSheet = ref(false)
const confirmTime = ref('now')
const showInvoiceSheet = ref(false)
const invoiceType = ref('不开票')
const showCarrySheet = ref(false)
const carryType = ref('平台计价（推荐）')
const options = ref({ receipt: false, carry: false, returnTrip: false })

const loadAddr = ref({ detail: '北京市朝阳区望京SOHO' })
const unloadAddr = ref({ detail: '' })
const loadContact = ref({ name: '王建国', phone: '138****1234' })
const unloadContact = ref({ name: '', phone: '' })

const remarkPresets = ['搭把手', '需要小推车', '需要搬运工', '有电梯', '无电梯']
const vehicleOptions = [
  { name:'微面',load:'0.5~0.8吨',vol:'2.4~4方',len:'1.8~2.4米',price:88},
  { name:'小面',load:'0.8~1.2吨',vol:'3~5方',len:'2.4~3.0米',price:108},
  { name:'中面',load:'1.5~2吨',vol:'5~8方',len:'3.0~3.8米',price:138},
  { name:'小货',load:'2~3吨',vol:'8~12方',len:'3.8~4.2米',price:168},
  { name:'4.2米',load:'3~5吨',vol:'12~18方',len:'4.2米',price:228},
  { name:'6.8米',load:'8~12吨',vol:'30~40方',len:'6.8米',price:388},
  { name:'9.6米',load:'12~18吨',vol:'45~55方',len:'9.6米',price:588},
]
const basePrice = computed(() => { const v = vehicleOptions.find(x=>x.name===selectedVehicle.value); return v?v.price:88 })
const computedPrice = computed(() => { let p=basePrice.value; if(options.value.returnTrip) p=Math.round(p*1.4); return p })
const payMethodLabel = computed(() => payMethod.value==='prepay'?'预付':payMethod.value==='cod_self'?'我到付':'收货人到付')
const bookLabel = computed(() => bookTime.value || '预约用车')

const now = new Date()
const dateTabs = ref([
  { label:'今天',dateStr:`${now.getMonth()+1}/${now.getDate()}`,on:true,offset:0 },
  { label:'明天',dateStr:`${now.getMonth()+1}/${now.getDate()+1}`,on:false,offset:1 },
  { label:'后天',dateStr:`${now.getMonth()+1}/${now.getDate()+2}`,on:false,offset:2 },
])
const selectedDateOffset = ref(0)
const timeSlots = ref([])
const genTimeSlots = () => {
  const h=now.getHours(),slots=[]
  const start=selectedDateOffset.value===0?h+1:6
  for(let i=start;i<24;i++) slots.push(`${String(i).padStart(2,'0')}:00~${String(i+1).padStart(2,'0')}:00`)
  timeSlots.value=slots
}
genTimeSlots()
const pickDate = (d) => { dateTabs.value.forEach(x=>x.on=false); d.on=true; selectedDateOffset.value=d.offset; genTimeSlots() }
const selectBookTime = (t) => { bookTime.value=t; useTime.value='book'; showBookSheet.value=false }
const useNow = () => { useTime.value='now'; bookTime.value='' }
const selectVehicle = (v) => { selectedVehicle.value=v; showVehicleSheet.value=false }
const swapAddress = () => {
  const ta={...loadAddr.value}, tc={...loadContact.value}
  loadAddr.value={...unloadAddr.value}; loadContact.value={...unloadContact.value}
  unloadAddr.value=ta; unloadContact.value=tc
}
const pickAddress = () => uni.showToast({ title:'地图选地址开发中', icon:'none' })
const activeContactType = ref(null)

const pickContact = (type) => {
  activeContactType.value = type
  uni.navigateTo({ url: '/pages/contacts/index?type=' + type })
}
const handleContactSelected = (item) => {
  if (activeContactType.value === 'load') {
    loadContact.value = { name: item.name, phone: item.phone }
  } else if (activeContactType.value === 'unload') {
    unloadContact.value = { name: item.name, phone: item.phone }
  }
  activeContactType.value = null
}

onMounted(() => {
  uni.$on('contactSelected', handleContactSelected)
})

onUnmounted(() => {
  uni.$off('contactSelected', handleContactSelected)
})

const addWaypoint = () => uni.showToast({ title:'途径地开发中', icon:'none' })
const doConfirm = () => {
  showConfirmSheet.value=false
  uni.showModal({ title:'服务协议', content:'请阅读并同意《运输服务协议》《隐私政策》相关内容。', confirmText:'已阅读并同意', success:(res)=>{ if(res.confirm) uni.navigateTo({ url:'/pages/payment/index' }) } })
}
</script>

<style lang="scss" scoped>
.page { min-height:100vh; background:#F6F8F9; padding-bottom:90px; }

/* ========== 车型+地址 统一模块 ========== */
.hero-card {
  margin:12px 14px;
  background: linear-gradient(160deg, #E8F8EE, #D4F1E4);
  border-radius:18px;
  padding:18px;
}
.hero-top { display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; }
.hero-vehicle { font-size:28px; font-weight:800; color:#07C160; letter-spacing:2px; }
.hero-change { font-size:13px; color:#07C160; padding:4px 12px; background:rgba(7,193,96,0.12); border-radius:12px; }
.hero-sep { border-top:1px dashed rgba(7,193,96,0.25); margin-bottom:14px; }
.hero-addr { display:flex; align-items:center; padding:10px 0; }
.ha-dot { width:12px; height:12px; border-radius:50%; flex-shrink:0; margin-right:12px; }
.ha-dot.g { background:#07C160; }
.ha-dot.r { background:#FF5A5F; }
.ha-body { flex:1; }
.ha-label { font-size:11px; color:#666; display:block; }
.ha-detail { font-size:15px; color:#1A1A1A; font-weight:500; }
.ha-contact-info { display:flex; align-items:center; gap:6px; margin-top:4px; }
.ha-contact-info-name { font-size:13px; color:#07C160; font-weight:500; }
.ha-contact-info-phone { font-size:12px; color:#999; }
.ha-contact { padding:5px 10px; background:#fff; border-radius:14px; font-size:12px; color:#07C160; flex-shrink:0; text-align:center; }
.ha-contact-name { font-size:12px; }
.ha-contact-phone { font-size:10px; color:#999; display:block; }
.hero-swap { text-align:center; padding:8px 0; font-size:13px; color:#07C160; font-weight:500; }
.hero-waypoint { padding-top:8px; }
.hwp-text { font-size:13px; color:#07C160; padding:6px 14px; background:rgba(7,193,96,0.1); border-radius:14px; display:inline-block; }

/* ========== 卡片 ========== */
.card { margin:10px 14px; background:#fff; border-radius:14px; padding:16px; box-shadow:0 1px 4px rgba(0,0,0,0.03); }
.row-between { display:flex; justify-content:space-between; align-items:center; }
.row-label { font-size:14px; color:#888; }

/* 时间 */
.time-row { display:flex; gap:10px; margin-top:10px; }
.t-btn { flex:1; text-align:center; padding:12px; border-radius:10px; background:#F5F5F5; font-size:14px; color:#999; }
.t-btn.on { background:#07C160; color:#fff; font-weight:600; }

/* 价格 */
.price-card { display:flex; justify-content:space-between; align-items:center; }
.price-left { display:flex; flex-direction:column; }
.price-type { font-size:18px; font-weight:700; color:#1A1A1A; }
.price-sub { font-size:11px; color:#999; margin-top:2px; }
.price-num { font-size:24px; font-weight:800; color:#FF5A5F; }

/* 选项 */
.opt-row { display:flex; gap:12px; margin-bottom:10px; }
.opt-row-single { display:flex; justify-content:space-between; padding:12px 0; border-top:1px solid #F5F5F5; }
.opt { flex:1; display:flex; justify-content:space-between; padding:10px; background:#F8F8F8; border-radius:10px; }
.opt.on { background:#E8F8EE; }
.opt-label { font-size:13px; color:#666; }
.opt-val { font-size:13px; color:#1A1A1A; }
.opt-divider { border-top:1px solid #F5F5F5; margin:6px 0; }

/* 半窗 */
.sheet { padding-bottom:env(safe-area-inset-bottom); }
.sheet-head { display:flex; justify-content:space-between; align-items:center; padding:16px; border-bottom:1px solid #F0F0F0; }
.sheet-title { font-size:17px; font-weight:600; }
.sheet-price { font-size:18px; font-weight:800; color:#FF5A5F; }
.sheet-body { padding:12px 16px; max-height:55vh; }
.v-opt { display:flex; align-items:center; padding:14px 0; border-bottom:1px solid #F5F5F5; gap:10px; }
.v-icon { font-size:32px; width:48px; text-align:center; }
.v-mid { flex:1; }
.v-name { font-size:15px; font-weight:600; }
.v-spec { font-size:11px; color:#999; margin-top:2px; display:block; }
.v-right { text-align:right; }
.v-start { font-size:14px; color:#FF5A5F; font-weight:600; }
.v-check { color:#07C160; font-size:20px; font-weight:700; display:block; }
.date-tabs { display:flex; padding:12px 16px; gap:10px; }
.date-tab { flex:1; text-align:center; padding:10px; border-radius:10px; background:#F5F5F5; font-size:13px; color:#666; }
.date-tab.on { background:#07C160; color:#fff; }
.time-grid { display:flex; flex-wrap:wrap; gap:8px; padding:12px 16px; }
.time-slot { padding:10px 14px; background:#F5F5F5; border-radius:8px; font-size:13px; color:#666; }
.time-slot.selected { background:#07C160; color:#fff; }
.radio-list { padding:8px 0; }
.radio-item { padding:15px 16px; font-size:15px; border-bottom:1px solid #F5F5F5; color:#333; }
.radio-item.on { color:#07C160; font-weight:600; }
.remark-input { width:100%; height:80px; background:#F5F5F5; border-radius:8px; padding:12px; font-size:14px; box-sizing:border-box; }
.remark-presets { display:flex; flex-wrap:wrap; gap:8px; margin-top:12px; }
.preset-tag { padding:8px 14px; background:#E8F8EE; border-radius:16px; font-size:13px; color:#07C160; }
.form-item { margin-bottom:12px; }
.form-label { font-size:13px; color:#999; display:block; margin-bottom:4px; }
.form-input { width:100%; padding:10px; background:#F5F5F5; border-radius:8px; font-size:15px; box-sizing:border-box; }
.btn-confirm { margin:12px 0; background:#07C160; color:#fff; text-align:center; padding:14px; border-radius:12px; font-size:16px; font-weight:600; }
.footer-bar { position:fixed; bottom:0; left:0; right:0; padding:12px 16px; padding-bottom:calc(12px + env(safe-area-inset-bottom)); background:#fff; border-top:1px solid #F0F0F0; display:flex; align-items:center; gap:12px; }
.footer-price { font-size:20px; font-weight:800; color:#FF5A5F; }
.footer-btn { flex:1; background:#07C160; color:#fff; text-align:center; padding:14px; border-radius:12px; font-size:16px; font-weight:600; }
</style>
