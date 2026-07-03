import React from 'react';
import { Award, ShieldCheck, Heart, Coffee } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="pt-28 pb-20 bg-dark min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center mb-16">
          <p className="section-eyebrow">A Legacy in Bhopal</p>
          <h1 className="font-display text-gold text-3xl sm:text-5xl font-black uppercase mt-2 tracking-wider">Our Story</h1>
        </div>

        {/* Story details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-20">
          <div className="flex flex-col gap-6">
            <h2 className="font-display text-gold text-lg font-bold uppercase tracking-widest pb-2 border-b border-gold/10">The Khansama Legend</h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              In the royal courts of old India, the **Khansama** was more than just a chef. They were the master creators of culinary experiences, guarding secret recipes of spice mixtures, slow-cooking techniques, and wood-fire grills.
            </p>
            <p className="text-sm text-gray-300 leading-relaxed">
              We started **Khansama of Bhopal** with a simple dream: to keep the culinary arts of the royal Mughal kitchens alive while catering to the modern, late-night food culture of Bhopal. Nestled on Ahmedabad Palace Rd in Kohefiza, we bring thick gravies, soft naan breads, and perfectly grilled tandoori skewers to food lovers.
            </p>
          </div>
          <div className="h-[340px] rounded-2xl overflow-hidden border border-gold/20 shadow-xl">
            <img src="/uploads/gallery/hero.png" alt="Khansama food preparation" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Vision, Mission, Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-dark-card border border-gold/15 p-8 rounded-2xl">
            <Award className="w-8 h-8 text-gold mb-4" />
            <h3 className="font-display text-white text-base font-bold uppercase tracking-wider mb-3">Our Vision</h3>
            <p className="text-xs text-gray-400 leading-relaxed">To become Bhopal's premier destination for authentic late-night Mughal fast food, recognized for preserving ancient recipes with premium modern quality.</p>
          </div>
          <div className="bg-dark-card border border-gold/15 p-8 rounded-2xl">
            <ShieldCheck className="w-8 h-8 text-gold mb-4" />
            <h3 className="font-display text-white text-base font-bold uppercase tracking-wider mb-3">Our Mission</h3>
            <p className="text-xs text-gray-400 leading-relaxed">To serve fresh, authentic, and hygienic food late into the night, using hand-ground spices and organic ingredients to ensure maximum customer satisfaction.</p>
          </div>
          <div className="bg-dark-card border border-gold/15 p-8 rounded-2xl">
            <Heart className="w-8 h-8 text-gold mb-4" />
            <h3 className="font-display text-white text-base font-bold uppercase tracking-wider mb-3">Our Values</h3>
            <p className="text-xs text-gray-400 leading-relaxed">Honesty in pricing, integrity in sourcing meat, preservation of culinary heritage, and friendly local service to the Bhopal community.</p>
          </div>
        </div>



      </div>
    </div>
  );
};

export default AboutPage;
