import request from './request'

const USE_MOCK = true

const MOCK_USER = {
  userId: 'U20260606001', phone: '138****5678', nickname: '货主张三',
  avatarUrl: '', realName: '张三', verifyStatus: 'PASSED', balance: '1280.50', couponCount: 3
}
const MOCK_TOKEN = 'mock-jwt-token-2026'

export function wechatLogin(code) {
  if (USE_MOCK) {
    uni.setStorageSync('token', MOCK_TOKEN)
    uni.setStorageSync('userInfo', JSON.stringify(MOCK_USER))
    return Promise.resolve({ token: MOCK_TOKEN, isNewUser: false, userInfo: MOCK_USER })
  }
  return request({ url: '/api/v1/user/login/wechat', method: 'POST', data: { code } })
}

export function phoneLogin(phone, code) {
  if (USE_MOCK) {
    uni.setStorageSync('token', MOCK_TOKEN)
    uni.setStorageSync('userInfo', JSON.stringify({ ...MOCK_USER, phone }))
    return Promise.resolve({ token: MOCK_TOKEN, isNewUser: false, userInfo: { ...MOCK_USER, phone } })
  }
  return request({ url: '/api/v1/user/login', method: 'POST', data: { phone, code } })
}

export function sendCode(phone) {
  if (USE_MOCK) return Promise.resolve(true)
  return request({ url: '/api/v1/user/send-code', method: 'POST', data: { phone } })
}

export function getUserInfo() {
  if (USE_MOCK) return Promise.resolve(MOCK_USER)
  return request({ url: '/api/v1/user/info', method: 'GET' })
}

export function updateUserInfo(data) {
  if (USE_MOCK) { Object.assign(MOCK_USER, data); return Promise.resolve(MOCK_USER) }
  return request({ url: '/api/v1/user/info', method: 'PUT', data })
}
