<template>
  <view class="page">
    <view class="list">
      <view
        class="card"
        v-for="(item, i) in addresses"
        :key="i"
        @click="select(item)"
      >
        <view class="card-left">
          <text class="card-name">{{ item.name }}</text>
        </view>
        <view class="card-right">
          <text class="card-detail">{{ item.city }} {{ item.district }} {{ item.detail }}</text>
          <text class="card-tag" v-if="item.tag">{{ item.tag }}</text>
        </view>
        <view class="card-check" v-if="selectedId === item.id">✓</view>
      </view>

      <view class="empty" v-if="addresses.length === 0">
        <text class="empty-icon">📍</text>
        <text class="empty-text">暂无地址</text>
        <text class="empty-sub">请先添加常用地址</text>
      </view>
    </view>

    <view class="footer">
      <view class="btn-add" @click="goAdd">＋ 新增地址</view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

let pickType = 'load'
const selectedId = ref('')

const addresses = ref([
  { id: '1', name: '望京SOHO', city: '北京', district: '朝阳区', detail: '望京SOHO T1 15层', tag: '公司' },
  { id: '2', name: '槐安东路仓库', city: '石家庄', district: '裕华区', detail: '槐安东路136号', tag: '仓库' },
  { id: '3', name: '中关村软件园', city: '北京', district: '海淀区', detail: '中关村软件园二期A座', tag: '家' },
  { id: '4', name: '滨海物流园', city: '天津', district: '滨海新区', detail: '保税区物流园3号库', tag: '仓库' }
])

onLoad((options) => {
  pickType = options?.type || 'load'
})

const select = (item) => {
  // 只传地址数据，不耦合联系人信息
  uni.$emit('addressSelected', {
    type: pickType,
    label: item.name,
    detail: item.city + item.district + item.detail
  })
  uni.navigateBack()
}

const goAdd = () => {
  uni.navigateTo({ url: '/pages/address-edit/index' })
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #F6F8F9;
  padding-bottom: 90px;
}
.list {
  padding: 12px 16px;
}
.card {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 14px;
  padding: 16px;
  margin-bottom: 10px;
  box-shadow: 0 1px 6px rgba(0,0,0,0.03);
}
.card-left {
  width: 100px;
  flex-shrink: 0;
}
.card-name {
  font-size: 16px;
  font-weight: 600;
  color: #1A1A1A;
}
.card-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-left: 12px;
}
.card-detail {
  font-size: 14px;
  color: #333;
}
.card-tag {
  align-self: flex-start;
  font-size: 11px;
  color: #07C160;
  background: #E8F8EE;
  padding: 2px 8px;
  border-radius: 8px;
}
.card-check {
  font-size: 18px;
  color: #07C160;
  font-weight: 700;
  flex-shrink: 0;
  margin-left: 8px;
}
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 0;
}
.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}
.empty-text {
  font-size: 16px;
  color: #999;
}
.empty-sub {
  font-size: 13px;
  color: #bbb;
  margin-top: 6px;
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
}
.btn-add {
  background: #07C160;
  color: #fff;
  text-align: center;
  padding: 14px;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 600;
}
</style>
