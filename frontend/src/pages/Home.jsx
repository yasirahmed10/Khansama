import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import { Flame, Clock, Award, Users, ChevronRight, MessageSquare, Star, ArrowRight } from 'lucide-react';
import { foodsApi, categoriesApi, testimonialsApi, settingsApi } from '../services/api';
import FoodCard from '../components/FoodCard';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

const Home = () => {
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [categories, setCategories] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    settingsApi.restaurant().then(({ data }) => setRestaurant(data)).catch(err => console.error(err));
    categoriesApi.list().then(({ data }) => setCategories(data)).catch(err => console.error(err));
    foodsApi.bestsellers().then(({ data }) => setBestsellers(data)).catch(err => console.error(err));
    foodsApi.newArrivals().then(({ data }) => setNewArrivals(data)).catch(err => console.error(err));
    testimonialsApi.list().then(({ data }) => setTestimonials(data)).catch(err => console.error(err));
  }, []);

  const slides = [
    {
      title: "Royal Mughal Flavours",
      subtitle: "Experience Bhopal's legendary night kitchen serving authentic recipes since inception.",
      image: "/uploads/gallery/hero.png",
      ctaText: "Order Late Night",
      ctaUrl: "/menu"
    },
    {
      title: "Creamy Butter Chicken",
      subtitle: "Slow-cooked tandoori chicken simmered in rich cream, tomato paste, and fenugreek.",
      image: "/uploads/gallery/butter_chicken.png",
      ctaText: "Order Bestseller",
      ctaUrl: "/menu"
    }
  ];

  return (
    <div className="pt-20">
      
      {/* ── HERO BANNER SLIDER ── */}
      <section className="relative h-[85vh] min-h-[500px]">
        <Swiper
          modules={[Autoplay, EffectFade, Pagination]}
          effect={'fade'}
          fadeEffect={{ crossFade: true }}
          loop={true}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          className="h-full w-full"
        >
          {slides.map((slide, idx) => (
            <SwiperSlide key={idx} className="relative h-full w-full flex items-center">
              <div className="absolute inset-0 bg-black/65 z-10"></div>
              <img src={slide.image} alt={slide.title} className="absolute inset-0 w-full h-full object-cover" />
              <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center items-center text-center">
                <p className="section-eyebrow mb-4">Est. in the Heart of Kohefiza</p>
                <h1 className="font-display text-gold text-4xl sm:text-6xl font-extrabold uppercase mb-6 tracking-wide leading-tight">
                  {slide.title}
                </h1>
                <p className="text-gray-300 text-sm sm:text-lg max-w-2xl mb-8 leading-relaxed">
                  {slide.subtitle}
                </p>
                <div className="flex gap-4">
                  <Link to={slide.ctaUrl} className="btn-primary">{slide.ctaText}</Link>
                  <Link to="/reservation" className="btn-outline">Book Table</Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* ── CATEGORIES ROW ── */}
      <section className="py-16 bg-dark-mid border-b border-gold/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <p className="section-eyebrow">Explore Our Cuisine</p>
              <h2 className="section-title mt-1">Browse Categories</h2>
            </div>
            <Link to="/menu" className="text-sm text-gold hover:underline flex items-center gap-1">
              View All Menu <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-6">
            {categories.map(cat => (
              <div 
                key={cat.id} 
                onClick={() => navigate(`/menu?category=${cat.id}`)}
                className="bg-dark-card border border-gold/10 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:border-gold/50 hover:shadow-[0_0_15px_rgba(201,168,76,0.1)] transition"
              >
                <div className="w-16 h-16 rounded-full overflow-hidden bg-dark mb-3 flex items-center justify-center border border-gold/15">
                  <img src={cat.image_url || '/uploads/gallery/placeholder.png'} alt={cat.name} className="w-full h-full object-cover" />
                </div>
                <h4 className="text-sm font-semibold text-white tracking-wide">{cat.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BEST SELLERS ── */}
      <section className="py-20 bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="section-eyebrow">Royal Specialties</p>
              <h2 className="section-title mt-1">Our Bestselling Dishes</h2>
            </div>
            <Link to="/menu?filter=bestseller" className="text-sm text-gold hover:underline flex items-center gap-1">
              All Bestsellers <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {bestsellers.slice(0, 4).map(food => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT RESTAURANT ── */}
      <section className="py-24 bg-dark-mid border-y border-gold/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="absolute inset-0 border border-gold/20 rounded-2xl transform translate-x-4 translate-y-4 -z-10"></div>
            <img src="/uploads/gallery/hero.png" alt="Khansama Kitchen" className="w-full h-[400px] object-cover rounded-2xl border border-gold/30 shadow-2xl" />
            <div className="absolute -bottom-6 -right-6 bg-gold text-dark p-6 rounded-2xl hidden sm:block shadow-xl max-w-xs">
              <span className="font-display font-extrabold text-3xl">4.6 ★</span>
              <p className="text-xs font-bold uppercase tracking-wider mt-1 text-dark/80">Top Rated Late Night Fast Food Outlet in Bhopal</p>
            </div>
          </div>
          
          <div className="flex flex-col gap-6">
            <p className="section-eyebrow">A Bhopal Heritage</p>
            <h2 className="section-title">A Legacy of <br /><span className="text-gold">Mughal Culinary Arts</span></h2>
            <p className="text-gray-300 leading-relaxed text-sm">
              Born in the historic lanes of Kohefiza, Bhopal, <strong>Khansama</strong> draws its inspiration from the royal cooks of the Mughal court. We specialize in bringing authentic, heavy spices, creamy gravies, and perfectly grilled tandoori starters to those who crave royal flavours late into the night.
            </p>
            <p className="text-gray-300 leading-relaxed text-sm">
              We operate exclusively in the evenings, from 6 PM to 2 AM, providing hot, fresh dine-in, drive-through pickup, and quick delivery directly to your home.
            </p>
            <div className="grid grid-cols-3 gap-6 mt-4">
              <div>
                <span className="font-display text-gold text-2xl font-bold">100%</span>
                <p className="text-xs text-gray-500 uppercase mt-1">Halal Meats</p>
              </div>
              <div>
                <span className="font-display text-gold text-2xl font-bold">19+</span>
                <p className="text-xs text-gray-500 uppercase mt-1">Google Reviews</p>
              </div>
              <div>
                <span className="font-display text-gold text-2xl font-bold">2 AM</span>
                <p className="text-xs text-gray-500 uppercase mt-1">Midnight Service</p>
              </div>
            </div>
            <div className="mt-4">
              <Link to="/about" className="btn-primary inline-flex items-center gap-2">Learn Our Story <ArrowRight className="w-4 h-4" /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── NEW ARRIVALS ── */}
      <section className="py-20 bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="section-eyebrow">Fresh Out of Tandoor</p>
              <h2 className="section-title mt-1">New Arrivals</h2>
            </div>
            <Link to="/menu?filter=new" className="text-sm text-gold hover:underline flex items-center gap-1">
              All New Additions <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {newArrivals.slice(0, 4).map(food => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      {testimonials.length > 0 && (
        <section className="py-20 bg-dark-mid border-t border-gold/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="section-eyebrow">Royal Guests</p>
              <h2 className="section-title mt-1">What People Say</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map(item => (
                <div key={item.id} className="bg-dark-card border border-gold/10 p-8 rounded-2xl flex flex-col justify-between h-full hover:border-gold/30 transition">
                  <div>
                    <div className="flex gap-1 text-gold mb-4">
                      {Array.from({ length: item.rating }).map((_, idx) => <Star key={idx} className="w-4 h-4 fill-current" />)}
                    </div>
                    <p className="text-gray-300 italic text-sm leading-relaxed mb-6">"{item.review}"</p>
                  </div>
                  <div className="flex items-center gap-3 pt-4 border-t border-gold/10">
                    <div className="w-10 h-10 rounded-full bg-gold text-dark font-black flex items-center justify-center text-sm uppercase">
                      {item.name[0]}
                    </div>
                    <div>
                      <strong className="text-sm text-white block">{item.name}</strong>
                      <span className="text-xs text-gray-500">Google Reviewer</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── RESERVATION CTA ── */}
      <section className="relative py-24 bg-dark flex items-center">
        <div className="absolute inset-0 bg-black/75 z-10"></div>
        <img src="/uploads/gallery/hero.png" alt="Table Booking Background" className="absolute inset-0 w-full h-full object-cover" />
        <div className="relative z-20 max-w-4xl mx-auto px-4 text-center">
          <p className="section-eyebrow">Dine In Style</p>
          <h2 className="font-display text-gold text-3xl sm:text-5xl font-extrabold uppercase mt-2 mb-6">Secure Your Royal Seat</h2>
          <p className="text-gray-300 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
            Planning a celebration or a family dinner? Avoid the waiting queues and secure your table layout in advance. Indoor and outdoor seating configurations available.
          </p>
          <Link to="/reservation" className="btn-primary px-8 py-3.5 text-sm uppercase tracking-wider">Book Table Now</Link>
        </div>
      </section>

      {/* ── CONTACT & MAP ── */}
      <section className="py-20 bg-dark-mid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="flex flex-col justify-center gap-6">
            <p className="section-eyebrow">Get in Touch</p>
            <h2 className="section-title">Locate Us</h2>
            <p className="text-gray-400 leading-relaxed text-sm">
              We are located on the active Ahmedabad Palace Rd, in the center of Kohefiza, Bhopal. Reach out for bulk orders, catering inquiries, or reservations.
            </p>
            <div className="space-y-4 mt-2">
              <div className="flex gap-4 items-start">
                <span className="text-gold text-lg">📍</span>
                <p className="text-sm text-gray-300">Ahmedabad Palace Rd, Kohefiza, Bhopal, MP 462001</p>
              </div>
              <div className="flex gap-4 items-center">
                <span className="text-gold text-lg">📞</span>
                <p className="text-sm text-gray-300 font-bold">078289 98497</p>
              </div>
              <div className="flex gap-4 items-center">
                <span className="text-gold text-lg">✉️</span>
                <p className="text-sm text-gray-300">orders@khansama.com</p>
              </div>
            </div>
            <div className="flex gap-4 mt-4">
              <a href="tel:07828998497" className="btn-primary py-2.5 text-xs uppercase">Call to Order</a>
              <a href="https://maps.app.goo.gl/MFC7gJxtCaNEma2k8" target="_blank" rel="noopener noreferrer" className="btn-outline py-2.5 text-xs uppercase">Get Directions</a>
            </div>
          </div>
          <div className="h-[380px] rounded-2xl overflow-hidden border border-gold/20 shadow-xl">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3667.8!2d77.3748362!3d23.262112!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397c425e72000001%3A0x1234!2sKhansama+of+Bhopal!5e0!3m2!1sen!2sin!4v1234567890" 
              width="100%" 
              height="100%" 
              style={{ border: 0, filter: 'grayscale(0.7) invert(0.9) hue-rotate(180deg)' }} 
              allowFullScreen="" 
              loading="lazy" 
              title="Khansama Location Map"
            />
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
