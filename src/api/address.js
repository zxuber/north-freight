import request from './request'

const USE_MOCK = true

const MOCK_ADDRESSES = [
  { id: 'A001', contactName: '张三', contactPhone: '13800001234', province: '北京市', city: '北京市', district: '朝阳区', detail: '望京SOHO T1 15层', tag: '公司', type: '发货地址', isDefault: true },
  { id: 'A002', contactName: '张三', contactPhone: '13800001234', province: '河北省', city: '石家庄市', district: '长安区', detail: '中山东路100号物流园A区', tag: '仓库', type: '卸货地址', isDefault: false },
  { id: 'A003', contactName: '张三', contactPhone: '13800001234', province: '天津市', city: '天津市', district: '滨海新区', detail: '开发区第五大街22号', tag: '家', type: '发货地址', isDefault: false }
]

export function getAddressList(type) {
  if (USE_MOCK) {
    let list = [...MOCK_ADDRESSES]
    if (type) list = list.filter(a => a.type === type)
    return Promise.resolve(list)
  }
  return request({ url: '/api/v1/address/list', method: 'GET', data: { type } })
}

export function saveAddress(data) {
  if (USE_MOCK) {
    const addr = { id: 'A' + Date.now(), ...data }
    MOCK_ADDRESSES.unshift(addr)
    return Promise.resolve(addr)
  }
  return request({ url: '/api/v1/address', method: 'POST', data })
}

export function updateAddress(id, data) {
  if (USE_MOCK) {
    const idx = MOCK_ADDRESSES.findIndex(a => a.id === id)
    if (idx > -1) Object.assign(MOCK_ADDRESSES[idx], data)
    return Promise.resolve(MOCK_ADDRESSES[idx])
  }
  return request({ url: `/api/v1/address/${id}`, method: 'PUT', data })
}

export function deleteAddress(id) {
  if (USE_MOCK) {
    const idx = MOCK_ADDRESSES.findIndex(a => a.id === id)
    if (idx > -1) MOCK_ADDRESSES.splice(idx, 1)
    return Promise.resolve(true)
  }
  return request({ url: `/api/v1/address/${id}`, method: 'DELETE' })
}

export function setDefaultAddress(id) {
  if (USE_MOCK) {
    MOCK_ADDRESSES.forEach(a => { a.isDefault = a.id === id })
    return Promise.resolve(true)
  }
  return request({ url: `/api/v1/address/${id}/default`, method: 'PUT' })
}
