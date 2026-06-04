import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import HomePage from './pages/HomePage'
import ProducersPage from './pages/ProducersPage'
import ProducerDetailPage from './pages/ProducerDetailPage'
import WinesPage from './pages/WinesPage'
import WineDetailPage from './pages/WineDetailPage'
import CartPage from './pages/CartPage'
import OrdersPage from './pages/OrdersPage'
import ContactPage from './pages/ContactPage'
import LoginPage from './pages/LoginPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminWines from './pages/admin/AdminWines'
import AdminWineForm from './pages/admin/AdminWineForm'
import AdminProducers from './pages/admin/AdminProducers'
import AdminProducerForm from './pages/admin/AdminProducerForm'
import AdminOrders from './pages/admin/AdminOrders'
import AdminTags from './pages/admin/AdminTags'
import AdminUsers from './pages/admin/AdminUsers'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/producers" element={<ProducersPage />} />
        <Route path="/producers/:id" element={<ProducerDetailPage />} />
        <Route path="/wines" element={<WinesPage />} />
        <Route path="/wines/:id" element={<WineDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/orders" element={
          <ProtectedRoute><OrdersPage /></ProtectedRoute>
        } />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/wines" element={<AdminRoute><AdminWines /></AdminRoute>} />
        <Route path="/admin/wines/new" element={<AdminRoute><AdminWineForm /></AdminRoute>} />
        <Route path="/admin/wines/:id/edit" element={<AdminRoute><AdminWineForm /></AdminRoute>} />
        <Route path="/admin/producers" element={<AdminRoute><AdminProducers /></AdminRoute>} />
        <Route path="/admin/producers/new" element={<AdminRoute><AdminProducerForm /></AdminRoute>} />
        <Route path="/admin/producers/:id/edit" element={<AdminRoute><AdminProducerForm /></AdminRoute>} />
        <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
        <Route path="/admin/tags" element={<AdminRoute><AdminTags /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
      </Route>
    </Routes>
  )
}
