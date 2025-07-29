import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom'

import Home from '../pages/Home'
import Help from '../pages/Help'
import Shop from '../pages/customer/Shop'
import Recycle from '../pages/customer/Recycle'
import Cart from '../pages/customer/Cart'
import ProductOverview from '../pages/customer/ProductOverview'
import ScrollToTop from './ScrollToTop'
import Layout from '../components/Layout'
import Wallet from '../pages/customer/Wallet'
import OrderHistory from '../pages/customer/OrderHistory'
import OrderSummary from '../pages/customer/OrderSummary'
import PickupHistory from '../pages/customer/PickupHistory'
import CustomerProfile from '../pages/customer/CustomerProfile'
import ProductForm from '../pages/admin/ProductForm'
import Dashboard from '../pages/admin/Dashboard'
import Orders from '../pages/admin/Orders'
import AdminLayout from '../pages/admin/AdminLayout'
import ProtectedRoute from './ProtectedRoute';
import Pickups from '../pages/admin/Pickups'

const AppRoutes = () => {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Routes using main Layout */}

        <Route element={<Layout />}>
          <Route path='/' element={<Home />} />
          <Route path='/help' element={<Help />} />
          <Route path='/shop' element={<Shop />} />
          <Route path='/product/:id' element={<ProductOverview />} />
              <Route
                element={
                  <ProtectedRoute>
                    <Outlet />
                  </ProtectedRoute>
                }
              >
                <Route path='/recycle' element={<Recycle />} />
                <Route path='/cart' element={<Cart />} />
                <Route path='/wallet' element={<Wallet />} />
                <Route path='/orders' element={<OrderHistory />} />
                <Route path='/orders/:id' element={<OrderSummary />} />
                <Route path='/pickups' element={<PickupHistory />} />
                <Route path='/cprofile' element={<CustomerProfile />} />
              </Route>
          </Route>


        <Route element={<AdminLayout />}>
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/allorders' element={<Orders />} />
          <Route path='/allpickups' element={<Pickups />} />
          <Route path='/pform' element={<ProductForm />} />
        </Route>

      </Routes>
    </Router>
  )
}

export default AppRoutes
