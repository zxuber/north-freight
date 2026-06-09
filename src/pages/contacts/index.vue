<template>
  <view class="page">
    <view class="list">
      <view
        class="card"
        v-for="(item, i) in contacts"
        :key="i"
        @click="select(item)"
      >
        <view class="card-info">
          <text class="card-name">{{ item.name }}</text>
          <text class="card-phone">{{ item.phone }}</text>
          <text class="card-addr">{{ item.city }} {{ item.detail }}</text>
        </view>
        <view class="card-img" v-if="item.photo">
          <image :src="item.photo" mode="aspectFill" class="card-photo" />
        </view>
      </view>

      <view class="empty" v-if="contacts.length === 0">
        <text class="empty-icon">📋</text>
        <text class="empty-text">暂无常用联系人</text>
        <text class="empty-sub">添加联系人后，发单时可直接选择</text>
      </view>
    </view>

    <view class="footer">
      <view class="btn-add" @click="goAdd">＋ 新增联系人</view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const contacts = ref([
  { name: '王建国', phone: '138****1234', city: '北京', detail: '朝阳区望京SOHO T1 15层', photo: '' },
  { name: '李明', phone: '139****5678', city: '石家庄', detail: '裕华区槐安东路136号', photo: '' }
])

const contactType = ref('load')

onMounted(() => {
  const pages = getCurrentPages()
  const current = pages[pages.length - 1]
  if (current && current.$page) {
    const opts = current.$page.options || {}
    contactType.value = opts.type || 'load'
  }
})

const select = (item) => {
  uni.$emit('contactSelected', { ...item, contactType: contactType.value })
  uni.navigateBack()
}

const goAdd = () => {
  uni.navigateTo({ url: '/pages/contacts-edit/index' })
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
  justify-content: space-between;
  background: #fff;
  border-radius: 14px;
  padding: 16px;
  margin-bottom: 10px;
  box-shadow: 0 1px 6px rgba(0,0,0,0.03);
}
.card-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.card-name {
  font-size: 16px;
  font-weight: 600;
  color: #1A1A1A;
}
.card-phone {
  font-size: 14px;
  color: #07C160;
}
.card-addr {
  font-size: 13px;
  color: #999;
  margin-top: 2px;
}
.card-img {
  width: 56px;
  height: 56px;
  border-radius: 10px;
  overflow: hidden;
  flex-shrink: 0;
  margin-left: 12px;
  background: #F0F0F0;
}
.card-photo {
  width: 100%;
  height: 100%;
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
