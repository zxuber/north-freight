import request from './request'

const USE_MOCK = true

const MOCK_ORDERS = [
  {
    orderId: 'WL20260608001', waybillNo: 'NF20260608001', transportMode: '整车', vehicleType: '9.6米',
    cargoType: '建材', cargoWeight: '8.00', cargoVolume: '25.00', cargoCount: 120,
    senderCity: '北京', senderDistrict: '朝阳区', senderDetail: '望京SOHO T1',
    receiverCity: '石家庄', receiverDistrict: '长安区', receiverDetail: '中山东路100号物流园A区',
    distance: '286.50', estimatedPriceMin: '1500.00', estimatedPriceMax: '1800.00',
    quoteCount: 3, orderStatus: '待报价', payStatus: '未支付', createTime: '2026-06-08 08:30:00'
  },
  {
    orderId: 'WL20260607002', waybillNo: 'NF20260607002', transportMode: '拼车', vehicleType: '4.2米',
    cargoType: '家具', cargoWeight: '1.50', cargoVolume: '8.00', cargoCount: 5,
    senderCity: '天津', senderDistrict: '滨海新区', senderDetail: '开发区第五大街22号',
    receiverCity: '北京', receiverDistrict: '海淀区', receiverDetail: '中关村软件园二期',
    distance: '168.00', estimatedPriceMin: '600.00', estimatedPriceMax: '800.00',
    finalPrice: '750.00', quoteCount: 5, orderStatus: '运输中', payStatus: '已支付', createTime: '2026-06-07 14:00:00'
  },
  {
    orderId: 'WL20270606003', waybillNo: 'NF20260606003', transportMode: '整车', vehicleType: '13米',
    cargoType: '机械设备', cargoWeight: '18.00', cargoVolume: '50.00', cargoCount: 3,
    senderCity: '北京', senderDistrict: '大兴区', senderDetail: '亦庄经济开发区荣华路8号',
    receiverCity: '廊坊', receiverDistrict: '广阳区', receiverDetail: '广阳道188号',
    distance: '58.00', estimatedPriceMin: '800.00', estimatedPriceMax: '1000.00',
    finalPrice: '920.00', quoteCount: 2, orderStatus: '已签收', payStatus: '已结算', createTime: '2026-06-06 10:00:00'
  },
  {
    orderId: 'WL20260605004', waybillNo: 'NF20260605004', transportMode: '整车', vehicleType: '6.8米',
    cargoType: '农产品', cargoWeight: '5.00', cargoVolume: '15.00', cargoCount: 200,
    senderCity: '保定', senderDistrict: '莲池区', senderDetail: '长城南大街888号农贸市场',
    receiverCity: '石家庄', receiverDistrict: '裕华区', receiverDetail: '建华大街123号',
    distance: '145.00', estimatedPriceMin: '650.00', estimatedPriceMax: '850.00',
    finalPrice: '700.00', quoteCount: 1, orderStatus: '已完成', payStatus: '已结算', createTime: '2026-06-05 09:00:00'
  },
  {
    orderId: 'WL20260604005', waybillNo: 'NF20260604005', transportMode: '拼车', vehicleType: '4.2米',
    cargoType: '搬家物品', cargoWeight: '2.00', cargoVolume: '10.00', cargoCount: 15,
    senderCity: '北京', senderDistrict: '通州区', senderDetail: '新华西街60号',
    receiverCity: '北京', receiverDistrict: '丰台区', receiverDetail: '丰台南路100号',
    distance: '35.00', estimatedPriceMin: '300.00', estimatedPriceMax: '450.00',
    quoteCount: 4, orderStatus: '待装货', payStatus: '已支付', createTime: '2026-06-04 16:00:00'
  }
]

const STATUS_TABS = ['全部', '待报价', '待装货', '运输中', '已签收', '已完成', '已取消']

export function createOrder(data) {
  return request({ url: '/api/v1/order', method: 'POST', data })
}

export function getOrderList(params) {
  if (USE_MOCK) {
    let list = [...MOCK_ORDERS]
    if (params.status && params.status !== '全部') list = list.filter(o => o.orderStatus === params.status)
    if (params.keyword) {
      const kw = params.keyword.toLowerCase()
      list = list.filter(o => o.waybillNo.toLowerCase().includes(kw) || o.senderCity.includes(kw) || o.receiverCity.includes(kw))
    }
    const p = params.page || 1; const ps = params.pageSize || 10
    const total = list.length
    return Promise.resolve({ records: list.slice((p - 1) * ps, p * ps), total, page: p, pageSize: ps })
  }
  return request({ url: '/api/v1/order/list', method: 'GET', data: params })
}

export function getOrderDetail(orderId) {
  if (USE_MOCK) {
    const order = MOCK_ORDERS.find(o => o.orderId === orderId)
    return Promise.resolve(order || null)
  }
  return request({ url: `/api/v1/order/${orderId}`, method: 'GET' })
}

export function cancelOrder(orderId) {
  return request({ url: `/api/v1/order/${orderId}/cancel`, method: 'POST' })
}

export function getOrderCountByStatus() {
  if (USE_MOCK) {
    const counts = {}
    STATUS_TABS.forEach(s => { counts[s] = s === '全部' ? MOCK_ORDERS.length : MOCK_ORDERS.filter(o => o.orderStatus === s).length })
    return Promise.resolve(counts)
  }
  return request({ url: '/api/v1/order/count-by-status', method: 'GET' })
}
