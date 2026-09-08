import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { AppProvider } from './store'
import Dashboard from './pages/Dashboard'
import Orders from './pages/Orders'
import Workers from './pages/Workers'
import MapPage from './pages/MapPage'
import Analytics from './pages/Analytics'
import Sms from './pages/Sms'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <AppProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="buyurtmalar" element={<Orders />} />
          <Route path="ustalar" element={<Workers />} />
          <Route path="xarita" element={<MapPage />} />
          <Route path="analitika" element={<Analytics />} />
          <Route path="sms" element={<Sms />} />
          <Route path="sozlamalar" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AppProvider>
  )
}
