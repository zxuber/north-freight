import request from './request'

const USE_MOCK = true

const MOCK_MESSAGES = [
  { id: 'MSG001', category: 'order', title: '运单待装货提醒', content: '您的运单 NF20260608001 已有司机接单，请尽快安排装货。司机预计1小时后到达装货地址，请保持电话畅通。', isRead: false, orderId: 'WL20260608001', createTime: '2026-06-08 10:30:00' },
  { id: 'MSG002', category: 'order', title: '新报价通知', content: '您的运单 NF20260608001 收到一条新报价，报价金额 ¥1,650.00，请及时查看并确认。', isRead: false, orderId: 'WL20260608001', createTime: '2026-06-08 09:15:00' },
  { id: 'MSG003', category: 'order', title: '货物已签收', content: '您的运单 NF20260606003 货物已由收货方签收，请确认收货。', isRead: true, orderId: 'WL20270606003', createTime: '2026-06-07 16:00:00' },
  { id: 'MSG004', category: 'order', title: '运输完成', content: '您的运单 NF20260605004 已完成运输，感谢使用北方货运平台。', isRead: true, orderId: 'WL20260605004', createTime: '2026-06-06 12:00:00' },
  { id: 'MSG005', category: 'system', title: '平台服务协议更新', content: '北方货运平台用户服务协议已于2026年6月1日更新，主要更新了数据隐私保护相关条款，请您仔细阅读。更新内容涉及：个人信息收集范围调整、第三方数据共享说明、用户权利保障机制。如继续使用平台服务，即视为同意更新后的协议。', isRead: false, orderId: '', createTime: '2026-06-05 09:00:00' },
  { id: 'MSG006', category: 'system', title: '实名认证审核通过', content: '您的实名认证已审核通过，现在可以正常使用全部功能。', isRead: true, orderId: '', createTime: '2026-06-04 14:30:00' },
  { id: 'MSG007', category: 'promotion', title: '新用户首单立减50元', content: '即日起至6月30日，新用户下单满300元立减50元，每个用户限参与一次。', isRead: false, orderId: '', createTime: '2026-06-03 10:00:00' },
  { id: 'MSG008', category: 'promotion', title: '六月运费补贴活动', content: '六月整车运输享95折优惠，拼车运输满5单送1单，快来参与吧！', isRead: true, orderId: '', createTime: '2026-06-01 08:00:00' }
]

export function getMessageList(params) {
  if (USE_MOCK) {
    let list = [...MOCK_MESSAGES]
    if (params.category && params.category !== 'all') list = list.filter(m => m.category === params.category)
    const p = params.page || 1; const ps = params.pageSize || 20
    return Promise.resolve({ records: list.slice((p - 1) * ps, p * ps), total: list.length })
  }
  return request({ url: '/api/v1/message/list', method: 'GET', data: params })
}

export function getUnreadCount() {
  if (USE_MOCK) {
    return Promise.resolve({
      total: MOCK_MESSAGES.filter(m => !m.isRead).length,
      order: MOCK_MESSAGES.filter(m => m.category === 'order' && !m.isRead).length,
      system: MOCK_MESSAGES.filter(m => m.category === 'system' && !m.isRead).length,
      promotion: MOCK_MESSAGES.filter(m => m.category === 'promotion' && !m.isRead).length
    })
  }
  return request({ url: '/api/v1/message/unread', method: 'GET' })
}

export function getMessageDetail(id) {
  if (USE_MOCK) {
    const msg = MOCK_MESSAGES.find(m => m.id === id)
    if (msg) msg.isRead = true
    return Promise.resolve(msg || null)
  }
  return request({ url: `/api/v1/message/${id}`, method: 'GET' })
}
