import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Toaster } from 'react-hot-toast';

// Layout & Core
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';

// Customer Pages
import Home from './pages/Home';
import Menu from './pages/Menu';
import FoodDetail from './pages/FoodDetail';
import Cart from './pages/Cart';
import Reservation from './pages/Reservation';
import Gallery from './pages/Gallery';
import Offers from './pages/Offers';
import About from './pages/About';
import Contact from './pages/Contact';
import OrderStatus from './pages/OrderStatus';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import FoodManager from './pages/admin/FoodManager';
import CategoryManager from './pages/admin/CategoryManager';
import OrderManager from './pages/admin/OrderManager';
import ReservationManager from './pages/admin/ReservationManager';
import RestaurantSettings from './pages/admin/RestaurantSettings';
import GalleryManager from './pages/admin/GalleryManager';
import ReviewManager from './pages/admin/ReviewManager';

const AdminRoute = ({ children }) => {
  const { admin, loading } = useAuth();
  if (loading) return null;
  return admin ? children : <Navigate to="/admin/login" replace />;
};

const AppContent = () => {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Conditionally hide customer navbar/footer inside admin screens */}
      {window.location.pathname.startsWith('/admin') ? null : (
        <Navbar onCartClick={() => setCartOpen(true)} />
      )}
      
      <main className="flex-grow">
        <Routes>
          {/* Customer Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/food/:slug" element={<FoodDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/reservation" element={<Reservation />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/order-track/:number" element={<OrderStatus />} />
          <Route path="/login" element={<Login />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminRoute><Dashboard /></AdminRoute>} />
          <Route path="/admin/foods" element={<AdminRoute><FoodManager /></AdminRoute>} />
          <Route path="/admin/categories" element={<AdminRoute><CategoryManager /></AdminRoute>} />
          <Route path="/admin/orders" element={<AdminRoute><OrderManager /></AdminRoute>} />
          <Route path="/admin/reservations" element={<AdminRoute><ReservationManager /></AdminRoute>} />
          <Route path="/admin/gallery" element={<AdminRoute><GalleryManager /></AdminRoute>} />
          <Route path="/admin/reviews" element={<AdminRoute><ReviewManager /></AdminRoute>} />
          <Route path="/admin/settings" element={<AdminRoute><RestaurantSettings /></AdminRoute>} />

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {window.location.pathname.startsWith('/admin') ? null : <Footer />}

      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <Toaster position="bottom-right" toastOptions={{ style: { background: '#1e1410', color: '#fff', border: '1px solid rgba(201,168,76,0.3)' } }} />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
