import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'

import Home from '../pages/Home'
import Help from '../pages/Help'
import Shop from '../pages/customer/Shop'
import Recycle from '../pages/customer/Recycle'
import Cart from '../pages/customer/Cart'
import WishList from '../pages/customer/WishList'
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

const AppRoutes = () => {
  return (
    <Router>
      <Layout>
      <ScrollToTop />
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/recycle' element={<Recycle />} />
            <Route path='/shop' element={<Shop />} />
            <Route path='/help' element={<Help />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/favorites' element={<WishList />} />
            <Route path='/wallet' element={<Wallet />} />
            <Route path='/product/:id' element={<ProductOverview />} />
            <Route path='/orders' element={<OrderHistory />} />
            <Route path='/orders/:id' element={<OrderSummary />} />
            <Route path='/pickups' element={<PickupHistory />} />
            <Route path='/cprofile' element={<CustomerProfile />} />
            <Route path='/pform' element={<ProductForm />} />
            <Route path='/dashboard' element={<Dashboard />}></Route>
        </Routes>
        </Layout>
    </Router>
  )
}

export default AppRoutes

