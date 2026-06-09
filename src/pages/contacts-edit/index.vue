<template>
  <view class="page">
    <view class="form">
      <view class="form-item">
        <text class="form-label">姓名</text>
        <input class="form-input" v-model="form.name" placeholder="请输入联系人姓名" />
      </view>
      <view class="form-item">
        <text class="form-label">联系电话</text>
        <input class="form-input" v-model="form.phone" type="number" maxlength="11" placeholder="请输入手机号" />
      </view>
      <view class="form-item" @click="goAddress">
        <text class="form-label">地址位置</text>
        <view class="form-value-row">
          <text class="form-value" :class="{ placeholder: !form.address }">{{ form.address || '请选择地址' }}</text>
          <text class="form-arrow">›</text>
        </view>
      </view>
      <view class="form-item form-photo">
        <text class="form-label">门头照</text>
        <view class="photo-area" @click="choosePhoto">
          <image v-if="form.photo" :src="form.photo" mode="aspectFill" class="photo-img" />
          <view v-else class="photo-placeholder">
            <text class="photo-icon">📷</text>
            <text class="photo-hint">点击拍照或从相册选择</text>
          </view>
        </view>
      </view>
    </view>

    <view class="footer">
      <view class="btn-save" @click="save">保存</view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue'

const form = reactive({
  name: '',
  phone: '',
  address: '',
  photo: ''
})

const goAddress = () => {
  uni.showToast({ title: '地址选择开发中', icon: 'none' })
}

const choosePhoto = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['camera', 'album'],
    success: (res) => {
      form.photo = res.tempFilePaths[0]
    }
  })
}

const save = () => {
  if (!form.name) { uni.showToast({ title: '请输入姓名', icon: 'none' }); return }
  if (!form.phone || form.phone.length < 11) { uni.showToast({ title: '请输入正确的手机号', icon: 'none' }); return }
  uni.showToast({ title: '保存成功', icon: 'success' })
  setTimeout(() => { uni.navigateBack() }, 800)
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #F6F8F9;
  padding-bottom: 90px;
}
.form {
  padding: 12px 16px;
}
.form-item {
  background: #fff;
  border-radius: 14px;
  padding: 16px;
  margin-bottom: 10px;
  box-shadow: 0 1px 6px rgba(0,0,0,0.03);
}
.form-label {
  font-size: 13px;
  color: #999;
  margin-bottom: 8px;
  display: block;
}
.form-input {
  width: 100%;
  font-size: 16px;
  padding: 4px 0;
  box-sizing: border-box;
}
.form-value-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.form-value {
  font-size: 16px;
  color: #1A1A1A;
}
.form-value.placeholder {
  color: #ccc;
}
.form-arrow {
  font-size: 20px;
  color: #ccc;
}
.form-photo {
  padding-bottom: 20px;
}
.photo-area {
  margin-top: 8px;
  width: 100%;
  height: 160px;
  border-radius: 12px;
  overflow: hidden;
}
.photo-img {
  width: 100%;
  height: 100%;
}
.photo-placeholder {
  width: 100%;
  height: 100%;
  background: #F5F5F5;
  border: 2px dashed #E0E0E0;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.photo-icon {
  font-size: 36px;
}
.photo-hint {
  font-size: 13px;
  color: #bbb;
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
.btn-save {
  background: #07C160;
  color: #fff;
  text-align: center;
  padding: 14px;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 600;
}
</style>
