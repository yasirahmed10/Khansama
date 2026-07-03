import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  res => res,
  async err => {
    if (err.response?.status === 401) {
      const refresh = localStorage.getItem('refresh_token')
      if (refresh) {
        try {
          const { data } = await axios.post('/api/auth/refresh', { refresh_token: refresh })
          localStorage.setItem('token', data.access_token)
          err.config.headers.Authorization = `Bearer ${data.access_token}`
          return api.request(err.config)
        } catch {
          localStorage.clear()
          window.location.href = '/login'
        }
      }
    }
    return Promise.reject(err)
  }
)

// Foods
export const foodsApi = {
  list: (params) => api.get('/foods', { params }),
  get: (slug) => api.get(`/foods/${slug}`),
  featured: () => api.get('/foods/featured'),
  bestsellers: () => api.get('/foods/bestsellers'),
  newArrivals: () => api.get('/foods/new-arrivals'),
  adminList: () => api.get('/foods/admin/all'),
  create: (data) => api.post('/foods/admin', data),
  update: (id, data) => api.put(`/foods/admin/${id}`, data),
  delete: (id) => api.delete(`/foods/admin/${id}`),
  addImage: (id, data) => api.post(`/foods/admin/${id}/images`, data),
}

// Categories
export const categoriesApi = {
  list: () => api.get('/categories'),
  adminList: () => api.get('/categories/admin/all'),
  create: (data) => api.post('/categories/admin', data),
  update: (id, data) => api.put(`/categories/admin/${id}`, data),
  delete: (id) => api.delete(`/categories/admin/${id}`),
}

// Orders
export const ordersApi = {
  create: (data) => api.post('/orders', data),
  track: (orderNumber) => api.get(`/orders/track/${orderNumber}`),
  validateCoupon: (data) => api.post('/orders/validate-coupon', data),
  adminList: (params) => api.get('/orders/admin/all', { params }),
  updateStatus: (id, data) => api.put(`/orders/admin/${id}/status`, data),
  stats: () => api.get('/orders/admin/stats'),
}

// Reservations
export const reservationsApi = {
  create: (data) => api.post('/reservations', data),
  adminList: (params) => api.get('/reservations/admin/all', { params }),
  update: (id, data) => api.put(`/reservations/admin/${id}`, data),
}

// Offers
export const offersApi = {
  list: () => api.get('/offers'),
  adminList: () => api.get('/offers/admin/all'),
  create: (data) => api.post('/offers/admin', data),
  update: (id, data) => api.put(`/offers/admin/${id}`, data),
  delete: (id) => api.delete(`/offers/admin/${id}`),
  listCoupons: () => api.get('/offers/admin/coupons'),
  createCoupon: (data) => api.post('/offers/admin/coupons', data),
  deleteCoupon: (id) => api.delete(`/offers/admin/coupons/${id}`),
}

// Gallery
export const galleryApi = {
  list: (album) => api.get('/gallery', { params: { album } }),
  albums: () => api.get('/gallery/albums'),
  upload: (formData) => api.post('/gallery/admin/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/gallery/admin/${id}`),
}

// Testimonials
export const testimonialsApi = {
  list: () => api.get('/testimonials'),
  submit: (data) => api.post('/testimonials', data),
  adminList: () => api.get('/testimonials/admin/all'),
  update: (id, data) => api.put(`/testimonials/admin/${id}`, data),
  delete: (id) => api.delete(`/testimonials/admin/${id}`),
}

// Homepage
export const homepageApi = {
  sections: () => api.get('/homepage/sections'),
  slides: () => api.get('/homepage/hero-slides'),
  adminSlides: () => api.get('/homepage/admin/slides'),
  createSlide: (data) => api.post('/homepage/admin/slides', data),
  updateSlide: (id, data) => api.put(`/homepage/admin/slides/${id}`, data),
  deleteSlide: (id) => api.delete(`/homepage/admin/slides/${id}`),
  updateSection: (key, data) => api.put(`/homepage/admin/sections/${key}`, data),
}

// Settings
export const settingsApi = {
  restaurant: () => api.get('/settings/restaurant'),
  website: () => api.get('/settings/website'),
  updateRestaurant: (data) => api.put('/settings/admin/restaurant', data),
  updateWebsite: (data) => api.put('/settings/admin/website', data),
}

// Media
export const mediaApi = {
  upload: (formData) => api.post('/media/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  library: (folder) => api.get('/media/library', { params: { folder } }),
  delete: (id) => api.delete(`/media/${id}`),
}

// Analytics
export const analyticsApi = {
  dashboard: () => api.get('/analytics/dashboard'),
}

// Auth
export const authApi = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  adminLogin: (data) => api.post('/auth/admin/login', data),
  me: () => api.get('/auth/me'),
}

// Contact
export const contactApi = {
  send: (data) => api.post('/contact', data),
}

// Newsletter
export const newsletterApi = {
  subscribe: (email) => api.post('/newsletter', { email }),
}

// Users
export const usersApi = {
  adminList: (params) => api.get('/users/admin/all', { params }),
  toggle: (id) => api.put(`/users/admin/${id}/toggle`),
  delete: (id) => api.delete(`/users/admin/${id}`),
}

export default api
