import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import {
  CITY_CENTER, categoryById, categories, defaultSettings, orders as seedOrders,
  smsCampaigns as seedCampaigns, workers as seedWorkers,
} from './data/mockData'
import { useRealtime } from './hooks/useRealtime'

const AppContext = createContext(null)

const clientPool = [
  'Nilufar Aliyeva', 'Kamol Ergashev', 'Sevara Xolmatova', 'Botir Qodirov',
  'Madina Sharipova', 'Oybek Tursunov', 'Feruza Islomova', 'Jahongir Mirzayev',
]
const problemPool = [
  'Rozetka ishlamayapti', 'Kran oqmoqda', 'Konditsioner sovutmayapti',
  'Eshik qulfi buzildi', 'Kir yuvish mashinasi ishlamayapti', 'Kvartira tozalash',
]

let nextOrderNo = 4821

export function AppProvider({ children }) {
  const [workers, setWorkers] = useState(seedWorkers)
  const [orders, setOrders] = useState(seedOrders)
  const [campaigns, setCampaigns] = useState(seedCampaigns)
  const [settings, setSettings] = useState(defaultSettings)
  const [liveEnabled, setLiveEnabled] = useState(true)
  const [toast, setToast] = useState(null)

  const notify = useCallback((message, tone = 'brand') => {
    setToast({ message, tone, id: Date.now() })
    setTimeout(() => setToast((t) => (t && Date.now() - t.id >= 3000 ? null : t)), 3200)
  }, [])

  /* --- real-vaqt taqlidi: ustalar siljiydi, vaqti-vaqti bilan yangi buyurtma keladi --- */
  const tick = useCallback(() => {
    setWorkers((prev) => prev.map((w) => (
      w.status !== 'online' ? w : {
        ...w,
        lat: w.lat + (Math.random() - 0.5) * 0.0016,
        lng: w.lng + (Math.random() - 0.5) * 0.0022,
      }
    )))

    if (Math.random() > 0.55) {
      setOrders((prev) => {
        const cat = categories[Math.floor(Math.random() * categories.length)]
        const price = Math.round((cat.basePrice * (0.9 + Math.random())) / 5000) * 5000
        const order = {
          id: `#${nextOrderNo++}`,
          clientName: clientPool[Math.floor(Math.random() * clientPool.length)],
          clientPhone: '+998 90 000-00-00',
          workerId: null,
          workerName: null,
          categoryId: cat.id,
          problem: problemPool[Math.floor(Math.random() * problemPool.length)],
          district: 'Navoiy markazi',
          status: 'new',
          price,
          commission: Math.round(price * (settings.commissionRate / 100)),
          rating: null,
          createdAt: new Date().toISOString(),
          responseSec: null,
          lat: CITY_CENTER.lat + (Math.random() - 0.5) * 0.05,
          lng: CITY_CENTER.lng + (Math.random() - 0.5) * 0.07,
          isNew: true,
        }
        return [order, ...prev]
      })
    }
  }, [settings.commissionRate])

  const { connected, lastEventAt } = useRealtime({ enabled: liveEnabled, onTick: tick })

  /* ----------------------------------------------------------------- amallar */

  const setWorkerStatus = useCallback((id, status) => {
    setWorkers((prev) => prev.map((w) => (w.id === id ? { ...w, status } : w)))
    notify(status === 'blocked' ? 'Usta bloklandi' : 'Usta holati yangilandi')
  }, [notify])

  const toggleVerified = useCallback((id) => {
    setWorkers((prev) => prev.map((w) => (w.id === id ? { ...w, verified: !w.verified } : w)))
    notify('Tekshiruv holati o‘zgartirildi')
  }, [notify])

  const setOrderStatus = useCallback((id, status) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status, isNew: false } : o)))
    notify(status === 'cancelled' ? 'Buyurtma bekor qilindi' : 'Buyurtma holati yangilandi')
  }, [notify])

  const assignWorker = useCallback((orderId, workerId) => {
    const worker = workers.find((w) => w.id === workerId)
    if (!worker) return
    setOrders((prev) => prev.map((o) => (
      o.id === orderId
        ? { ...o, workerId, workerName: worker.name, status: 'accepted', isNew: false, responseSec: 0 }
        : o
    )))
    notify(`Buyurtma ${worker.name}ga biriktirildi`)
  }, [workers, notify])

  const addCampaign = useCallback((campaign) => {
    setCampaigns((prev) => [{ ...campaign, id: Date.now() }, ...prev])
    notify('SMS kampaniya navbatga qo‘yildi')
  }, [notify])

  const saveSettings = useCallback((next) => {
    setSettings(next)
    notify('Sozlamalar saqlandi', 'emerald')
  }, [notify])

  /* ---------------------------------------------------- hosila ko'rsatkichlar */

  const stats = useMemo(() => {
    const completed = orders.filter((o) => o.status === 'completed')
    const cancelled = orders.filter((o) => o.status === 'cancelled')
    const active = orders.filter((o) => ['new', 'accepted', 'on_way', 'in_progress'].includes(o.status))
    const revenue = completed.reduce((s, o) => s + o.commission, 0)
    const gmv = completed.reduce((s, o) => s + o.price, 0)
    const rated = completed.filter((o) => o.rating != null)
    const responded = orders.filter((o) => o.responseSec != null)
    return {
      totalOrders: orders.length,
      completed: completed.length,
      cancelled: cancelled.length,
      active: active.length,
      revenue,
      gmv,
      avgCheck: completed.length ? gmv / completed.length : 0,
      avgRating: rated.length ? rated.reduce((s, o) => s + o.rating, 0) / rated.length : 0,
      completionRate: orders.length ? (completed.length / (completed.length + cancelled.length || 1)) * 100 : 0,
      avgResponseSec: responded.length ? responded.reduce((s, o) => s + o.responseSec, 0) / responded.length : 0,
      onlineWorkers: workers.filter((w) => w.status === 'online').length,
      totalWorkers: workers.filter((w) => w.status !== 'blocked').length,
      pendingVerification: workers.filter((w) => !w.verified && w.status !== 'blocked').length,
    }
  }, [orders, workers])

  /** Kategoriya kesimidagi buyurtma va daromad — grafiklar uchun. */
  const byCategory = useMemo(() => categories.map((c) => {
    const list = orders.filter((o) => o.categoryId === c.id)
    const done = list.filter((o) => o.status === 'completed')
    return {
      id: c.id,
      name: c.name,
      color: c.color,
      orders: list.length,
      revenue: done.reduce((s, o) => s + o.commission, 0),
    }
  }).sort((a, b) => b.orders - a.orders), [orders])

  const value = {
    workers, orders, campaigns, settings, stats, byCategory,
    categoryById, connected, lastEventAt, liveEnabled, setLiveEnabled,
    setWorkerStatus, toggleVerified, setOrderStatus, assignWorker,
    addCampaign, saveSettings, toast, notify,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp faqat <AppProvider> ichida ishlatiladi')
  return ctx
}
