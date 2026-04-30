import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, 
  ShieldCheck, 
  Zap, 
  Truck, 
  Briefcase, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Factory, 
  Construction, 
  Settings, 
  Cpu, 
  Package, 
  BarChart3, 
  HardHat, 
  Lock, 
  Rocket, 
  Building2, 
  Users, 
  CheckCircle, 
  ExternalLink,
  Menu,
  X,
  Search,
  Filter,
  ArrowUpDown,
  Mail,
  Phone,
  MapPin,
  Quote,
  Diamond,
  FileText,
  Wrench,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Shirt,
  Footprints,
  Shield,
  AirVent,
  Glasses,
  Printer,
  Trophy,
  Anchor,
  Palette
} from 'lucide-react';
import Fuse from 'fuse.js';
import { products } from './data/products';
import { Page, Product } from './types';

// --- Components ---

const IconRenderer = ({ iconName, className = "" }: { iconName: string; className?: string }) => {
  const icons: Record<string, any> = {
    "Clothing": Shirt,
    "Safety Footwear": Footprints,
    "Hand Protection": Shield,
    "Respiratory Protection": AirVent,
    "Eye & Ear Protection": Glasses,
    "Head Protection": HardHat,
    "Fall Protection": Anchor,
    "Building Materials & Hardware": Wrench,
    "Printing Services": Printer,
    "Shields and Trophies": Trophy,
    "Signages": FileText,
    "Bird & Cat Food": Package,
    "Order Suppliers": Search,
    "Marine Paints": Palette,
    "Steel Wire Ropes": Settings,
    "Stationeries": FileText,
    "Miscellaneous Products": Package,
    "Fast Sourcing": Zap,
    "Verified": ShieldCheck,
    "Availability": Clock,
    "Enterprise": Briefcase,
    "Global": Globe,
    "Security": Lock,
    "Speed": Rocket,
    "Partnership": Users,
    "Quality": CheckCircle,
    "Compliance": FileText
  };

  const IconComponent = icons[iconName] || Package;
  return <IconComponent className={className} />;
};

const Spinner = () => (
  <div className="flex justify-center items-center py-10">
    <div className="w-10 h-10 border-4 border-[var(--border-subtle)] border-t-[var(--accent)] rounded-full animate-spin"></div>
  </div>
);

const Modal = ({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 md:p-10">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl rounded-sm"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-2xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors z-10"
          >
            <X size={24} />
          </button>
          {children}
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const Logo = ({ className = "", iconSize = 24, textClass = "text-[18px]", onClick }: { className?: string; iconSize?: number; textClass?: string; onClick?: () => void }) => (
  <div className={`flex items-center gap-3 group cursor-pointer ${className}`} onClick={onClick}>
    <div className="relative flex items-center justify-center">
      <div className="absolute inset-0 bg-[var(--accent)] opacity-10 rounded-full blur-xl group-hover:opacity-20 transition-opacity duration-500" />
      <div className="relative w-12 h-12 flex items-center justify-center">
        <div className="absolute inset-0 bg-linear-to-tr from-[var(--ink)] to-[var(--ibm-gray-70)] rotate-45 rounded-xl shadow-2xl group-hover:rotate-90 transition-transform duration-700" />
        <div className="relative flex items-center justify-center">
          <Diamond className="text-[var(--accent)] fill-[var(--accent)]" size={iconSize} />
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            <div className="w-[1px] h-full bg-white/20 rotate-45 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          </div>
        </div>
      </div>
    </div>
    <div className="flex flex-col leading-none">
      <div className="flex items-baseline gap-1">
        <span className={`${textClass} font-black tracking-tighter uppercase text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors duration-300`}>
          Logos
        </span>
        <span className="text-[10px] font-bold text-[var(--accent)] tracking-[0.2em] uppercase opacity-80">Intl</span>
      </div>
      <span className="text-[9px] font-medium text-[var(--text-secondary)] uppercase tracking-[0.3em] mt-1 italic">General Trading Sharjah</span>
    </div>
  </div>
);

const Header = ({ currentPage, onPageChange }: { currentPage: Page; onPageChange: (page: Page) => void }) => (
  <header className="sticky top-0 z-[1000] bg-[var(--bg-primary)] border-b border-[var(--border-subtle)] backdrop-blur-xl bg-white/98">
    <nav className="max-w-[1600px] mx-auto flex justify-between items-center px-10 h-[70px]">
      <Logo onClick={() => onPageChange('home')} />
      <ul className="flex list-none gap-12 items-center">
        <li>
          <button 
            onClick={() => onPageChange('home')}
            className={`text-[13px] font-medium cursor-pointer relative transition-colors duration-200 hover:text-[var(--accent)] ${currentPage === 'home' ? 'text-[var(--accent)] after:w-full' : 'text-[var(--text-primary)] after:w-0'} after:content-[''] after:absolute after:h-[2px] after:bottom-[-6px] after:left-0 after:bg-[var(--accent)] after:transition-[width] after:duration-200 hover:after:w-full`}
          >
            Home
          </button>
        </li>
        <li>
          <button 
            onClick={() => onPageChange('products')}
            className={`text-[13px] font-medium cursor-pointer relative transition-colors duration-200 hover:text-[var(--accent)] ${currentPage === 'products' ? 'text-[var(--accent)] after:w-full' : 'text-[var(--text-primary)] after:w-0'} after:content-[''] after:absolute after:h-[2px] after:bottom-[-6px] after:left-0 after:bg-[var(--accent)] after:transition-[width] after:duration-200 hover:after:w-full`}
          >
            Solutions
          </button>
        </li>
        <li>
          <button 
            onClick={() => onPageChange('services')}
            className={`text-[13px] font-medium cursor-pointer relative transition-colors duration-200 hover:text-[var(--accent)] ${currentPage === 'services' ? 'text-[var(--accent)] after:w-full' : 'text-[var(--text-primary)] after:w-0'} after:content-[''] after:absolute after:h-[2px] after:bottom-[-6px] after:left-0 after:bg-[var(--accent)] after:transition-[width] after:duration-200 hover:after:w-full`}
          >
            Services
          </button>
        </li>
        <li>
          <button 
            onClick={() => onPageChange('contact')}
            className={`text-[13px] font-medium cursor-pointer relative transition-colors duration-200 hover:text-[var(--accent)] ${currentPage === 'contact' ? 'text-[var(--accent)] after:w-full' : 'text-[var(--text-primary)] after:w-0'} after:content-[''] after:absolute after:h-[2px] after:bottom-[-6px] after:left-0 after:bg-[var(--accent)] after:transition-[width] after:duration-200 hover:after:w-full`}
          >
            Contact
          </button>
        </li>
        <button className="bg-[var(--accent-dark)] text-white px-6 py-2.5 text-[13px] font-semibold cursor-pointer transition-all duration-200 hover:bg-[var(--accent)]" onClick={() => onPageChange('products')}>
          Explore Products
        </button>
      </ul>
    </nav>
  </header>
);

const Footer = ({ onPageChange }: { onPageChange: (page: Page) => void }) => (
  <footer className="bg-[var(--ibm-gray-70)] text-[var(--bg-primary)] px-10 pt-20 pb-12 border-t border-white/10">
    <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-15 mb-15">
        <div className="footer-section">
          <h4 className="text-[13px] font-semibold mb-5 uppercase tracking-wider">Logos International</h4>
          <p className="text-[13px] text-white/65 leading-relaxed font-light">
            Multiple products trading company based in Sharjah, U.A.E. Supplying PPE, Hardware, and Printing Services across the GCC.
          </p>
        </div>
      <div className="footer-section">
        <h4 className="text-[13px] font-semibold mb-5 uppercase tracking-wider">Solutions</h4>
        <ul className="list-none space-y-3">
          <li><button onClick={() => onPageChange('products')} className="text-white/65 hover:text-[var(--ibm-blue-light)] text-[13px] font-light transition-colors duration-200">Industrial Supplies</button></li>
          <li><button onClick={() => onPageChange('products')} className="text-white/65 hover:text-[var(--ibm-blue-light)] text-[13px] font-light transition-colors duration-200">Building Materials</button></li>
          <li><button onClick={() => onPageChange('services')} className="text-white/65 hover:text-[var(--ibm-blue-light)] text-[13px] font-light transition-colors duration-200">Our Services</button></li>
          <li><button onClick={() => onPageChange('products')} className="text-white/65 hover:text-[var(--ibm-blue-light)] text-[13px] font-light transition-colors duration-200">B2B Partnerships</button></li>
        </ul>
      </div>
      <div className="footer-section">
        <h4 className="text-[13px] font-semibold mb-5 uppercase tracking-wider">Company</h4>
        <ul className="list-none space-y-3">
          <li><button onClick={() => onPageChange('contact')} className="text-white/65 hover:text-[var(--ibm-blue-light)] text-[13px] font-light transition-colors duration-200">Contact</button></li>
          <li><button onClick={() => onPageChange('privacy')} className="text-white/65 hover:text-[var(--ibm-blue-light)] text-[13px] font-light transition-colors duration-200">Privacy Policy</button></li>
          <li><button onClick={() => onPageChange('terms')} className="text-white/65 hover:text-[var(--ibm-blue-light)] text-[13px] font-light transition-colors duration-200">Terms of Service</button></li>
        </ul>
      </div>
      <div className="footer-section">
        <h4 className="text-[13px] font-semibold mb-5 uppercase tracking-wider">Connect</h4>
        <ul className="list-none space-y-3">
          <li><a href="#" className="text-white/65 hover:text-[var(--ibm-blue-light)] text-[13px] font-light transition-colors duration-200">WhatsApp Business</a></li>
          <li><a href="#" className="text-white/65 hover:text-[var(--ibm-blue-light)] text-[13px] font-light transition-colors duration-200">Telegram</a></li>
          <li><a href="#" className="text-white/65 hover:text-[var(--ibm-blue-light)] text-[13px] font-light transition-colors duration-200">Email</a></li>
          <li><a href="#" className="text-white/65 hover:text-[var(--ibm-blue-light)] text-[13px] font-light transition-colors duration-200">Phone</a></li>
        </ul>
      </div>
    </div>
    <div className="max-w-[1600px] mx-auto border-t border-white/10 pt-10 flex flex-col md:flex-row justify-between items-center gap-5">
      <Logo iconSize={18} textClass="text-[16px]" onClick={() => onPageChange('home')} className="invert brightness-200" />
      <div className="text-[12px] text-white/45 font-light">© 2026 Logos International. All rights reserved. UAE Trade License.</div>
    </div>
  </footer>
);

const HomePage: React.FC<{ onPageChange: (page: Page) => void }> = ({ onPageChange }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.5 }}
  >
    <section className="max-w-[1600px] mx-auto px-10 py-[120px] grid grid-cols-1 lg:grid-cols-2 items-center gap-20">
      <div className="hero-content">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent)]/10 text-[var(--accent)] rounded-full text-[12px] font-bold uppercase tracking-widest mb-6">
          <Globe size={14} /> Based in Sharjah, U.A.E. | Serving UAE & GCC
        </div>
        <h1 className="text-[60px] font-light leading-[1.15] mb-8 text-[var(--text-primary)] tracking-tight">
          Multiple <span className="text-[var(--accent)] font-semibold">Products Trading</span> Company in Sharjah
        </h1>
        <p className="text-[18px] text-[var(--text-secondary)] mb-10 leading-relaxed max-w-[550px] font-light">
          Logos International is a multiple products trading company based at Sharjah, U.A.E. It’s a commercial business that buys products and sells it to customers. We handle a wide range of products in the fields of Personal Protective Equipment (PPE), Health and safety requisites, Medical Consumables, Hardware, Uniforms and Printing Services.
        </p>
        <div className="flex flex-wrap gap-4">
          <button className="btn-primary flex items-center gap-2" onClick={() => onPageChange('products')}>Explore Catalog <ArrowRight size={18} /></button>
          <button className="btn-secondary flex items-center gap-2">
            <FileText size={18} /> Download profile
          </button>
        </div>
      </div>
      <div className="hero-visual relative">
        <div className="aspect-[4/3] rounded-sm overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border-subtle)] relative shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1200&h=900" 
            alt="Logos International Logistics Hub" 
            className="w-full h-full object-cover grayscale-[0.2] hover:scale-105 transition-transform duration-700" 
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-linear-to-t from-[var(--accent-dark)]/40 to-transparent pointer-events-none" />
          <div className="absolute bottom-8 left-8 right-8">
            <div className="flex items-center gap-4 text-white">
              <div className="w-12 h-12 bg-[var(--accent)] flex items-center justify-center rounded-lg">
                <Truck className="animate-pulse" size={24} />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest opacity-80">Supply Chain Excellence</p>
                <p className="text-[18px] font-medium">Strategic GCC Distribution</p>
              </div>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[var(--accent)]/5 rounded-full blur-3xl -z-1" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-[var(--accent)]/10 rounded-full blur-3xl -z-1" />
      </div>
    </section>

    <section className="bg-[var(--bg-secondary)] px-10 py-[120px]">
      <div className="max-w-[1600px] mx-auto">
        <h2 className="text-[48px] font-light mb-10 text-[var(--text-primary)] tracking-tight leading-tight">Strategic Advantages in GCC Trading</h2>
        <p className="text-[18px] text-[var(--text-secondary)] mb-6 leading-relaxed font-light max-w-[900px]">
          Logos International operates a robust commercial model, buying high-quality industrial and safety gear in bulk to supply projects across the UAE and GCC. Our Sharjah base provides optimal logistics connectivity to all seven emirates and neighboring countries like Saudi Arabia and Oman.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mt-15">
          <div className="card group hover:border-[var(--accent)] transition-all">
            <IconRenderer iconName="Fast Sourcing" className="w-12 h-12 text-[var(--accent)] mb-6" />
            <h3 className="text-[18px] font-semibold mb-4 text-[var(--text-primary)]">Fast Sourcing</h3>
            <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed font-light">Rapid procurement through our extensive network of vetted global suppliers, minimizing lead times for critical projects.</p>
          </div>
          <div className="card group hover:border-[var(--accent)] transition-all">
            <IconRenderer iconName="Verified" className="w-12 h-12 text-[var(--accent)] mb-6" />
            <h3 className="text-[18px] font-semibold mb-4 text-[var(--text-primary)]">Verified & Licensed</h3>
            <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed font-light">Fully compliant with UAE trade regulations. We handle all documentation, ensuring every product meets local standards.</p>
          </div>
          <div className="card group hover:border-[var(--accent)] transition-all">
            <IconRenderer iconName="Availability" className="w-12 h-12 text-[var(--accent)] mb-6" />
            <h3 className="text-[18px] font-semibold mb-4 text-[var(--text-primary)]">24/7 Availability</h3>
            <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed font-light">Our logistics hub operates around the clock to support emergency sourcing and urgent delivery requirements across the Emirates.</p>
          </div>
          <div className="card group hover:border-[var(--accent)] transition-all">
            <IconRenderer iconName="Enterprise" className="w-12 h-12 text-[var(--accent)] mb-6" />
            <h3 className="text-[18px] font-semibold mb-4 text-[var(--text-primary)]">Enterprise Solutions</h3>
            <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed font-light">Tailored procurement strategies for large-scale developments, providing volume discounts and dedicated account management.</p>
          </div>
        </div>

        <div className="mt-20 border-t border-[var(--border-subtle)] pt-20">
          <h3 className="text-[11px] font-bold uppercase text-[var(--accent)] mb-10 tracking-[0.4em] text-center">Authorized Trading Partners & Quality Brands</h3>
          <div className="flex flex-wrap justify-center items-center gap-15 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="text-[28px] font-black tracking-tighter hover:text-[var(--accent)] cursor-default">VAULTEX</div>
            <div className="text-[28px] font-black tracking-tighter hover:text-[var(--accent)] cursor-default">3M</div>
            <div className="text-[28px] font-black tracking-tighter hover:text-[var(--accent)] cursor-default">HONEYWELL</div>
            <div className="text-[28px] font-black tracking-tighter hover:text-[var(--accent)] cursor-default">ANSELL</div>
            <div className="text-[28px] font-black tracking-tighter hover:text-[var(--accent)] cursor-default">U-POWER</div>
            <div className="text-[28px] font-black tracking-tighter hover:text-[var(--accent)] cursor-default">DELTA PLUS</div>
            <div className="text-[28px] font-black tracking-tighter hover:text-[var(--accent)] cursor-default">KISWIRE</div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 mt-20">
          <div className="bg-[var(--bg-secondary)] p-10 text-center border border-[var(--border-subtle)]">
            <div className="text-[48px] font-bold text-[var(--accent)] mb-2">250+</div>
            <div className="text-[15px] text-[var(--text-secondary)] font-light">Products in Catalog</div>
          </div>
          <div className="bg-[var(--bg-secondary)] p-10 text-center border border-[var(--border-subtle)]">
            <div className="text-[48px] font-bold text-[var(--accent)] mb-2">500+</div>
            <div className="text-[15px] text-[var(--text-secondary)] font-light">Active Suppliers</div>
          </div>
          <div className="bg-[var(--bg-secondary)] p-10 text-center border border-[var(--border-subtle)]">
            <div className="text-[48px] font-bold text-[var(--accent)] mb-2">15+</div>
            <div className="text-[15px] text-[var(--text-secondary)] font-light">Years Experience</div>
          </div>
          <div className="bg-[var(--bg-secondary)] p-10 text-center border border-[var(--border-subtle)]">
            <div className="text-[48px] font-bold text-[var(--accent)] mb-2">24/7</div>
            <div className="text-[15px] text-[var(--text-secondary)] font-light">Customer Support</div>
          </div>
        </div>
      </div>
    </section>

    <section className="max-w-[1600px] mx-auto px-10 py-[120px]">
      <h2 className="text-[48px] font-light mb-10 text-[var(--text-primary)] tracking-tight leading-tight">Our Core Product Segments</h2>
      <p className="text-[18px] text-[var(--text-secondary)] mb-6 leading-relaxed font-light max-w-[900px]">
        Logos International handles a diverse range of products. From essential PPE and medical consumables to specialized industrial hardware and premium printing services, we provide verified quality for every client.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-15 text-left">
        <div className="card group">
          <div className="aspect-video mb-6 overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
            <img 
              src="https://images.unsplash.com/photo-1623945417954-4682333857e4?auto=format&fit=crop&q=80&w=800&h=450" 
              alt="Clothing & Uniforms" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-[var(--accent)]/10 flex items-center justify-center">
              <Shirt className="text-[var(--accent)]" size={20} />
            </div>
            <h3 className="text-[18px] font-semibold text-[var(--text-primary)]">Clothing & Uniforms</h3>
          </div>
          <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed font-light">T-Shirts, Cargo Pants, Cotton/FR Coveralls, 2pc Uniforms, High-Visibility Vests, and professional Lab Coats.</p>
        </div>

        <div className="card group">
          <div className="aspect-video mb-6 overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
            <img 
              src="https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&q=80&w=800&h=450" 
              alt="Safety Footwear" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-[var(--accent)]/10 flex items-center justify-center">
              <Footprints className="text-[var(--accent)]" size={20} />
            </div>
            <h3 className="text-[18px] font-semibold text-[var(--text-primary)] text-left">Safety Footwear</h3>
          </div>
          <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed font-light text-left">Comprehensive range includes non-metal/metal safety shoes, welder boots, gumboots, and executive safety footwear.</p>
        </div>

        <div className="card group">
          <div className="aspect-video mb-6 overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
            <img 
              src="https://images.unsplash.com/photo-1597448827232-73642d681287?auto=format&fit=crop&q=80&w=800&h=450" 
              alt="Hand & Respiratory" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-[var(--accent)]/10 flex items-center justify-center">
              <Shield className="text-[var(--accent)]" size={20} />
            </div>
            <h3 className="text-[18px] font-semibold text-[var(--text-primary)]">Hand & Respiratory</h3>
          </div>
          <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed font-light">Nitrile, Chemical, and Welding gloves. Full range of respiratory protection including N95 and Full-Face masks.</p>
        </div>

        <div className="card group">
          <div className="aspect-video mb-6 overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
            <img 
              src="https://images.unsplash.com/photo-1589118949245-7d38baf380d6?auto=format&fit=crop&q=80&w=800&h=450" 
              alt="Eye, Ear & Head" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-[var(--accent)]/10 flex items-center justify-center">
              <Glasses className="text-[var(--accent)]" size={20} />
            </div>
            <h3 className="text-[18px] font-semibold text-[var(--text-primary)]">Eye, Ear & Head</h3>
          </div>
          <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed font-light">Safety goggles, spectacles, face shields, and ear muffs. Helmets in metal and fiber with ratchet options.</p>
        </div>

        <div className="card group">
          <div className="aspect-video mb-6 overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
            <img 
              src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=800&h=450" 
              alt="Industrial & Hardware" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-[var(--accent)]/10 flex items-center justify-center">
              <Settings className="text-[var(--accent)]" size={20} />
            </div>
            <h3 className="text-[18px] font-semibold text-[var(--text-primary)]">Industrial & Hardware</h3>
          </div>
          <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed font-light">Building materials, industrial hardware, stationeries, and Kiswire steel wire ropes for construction and marine use.</p>
        </div>

        <div className="card group">
          <div className="aspect-video mb-6 overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
            <img 
              src="https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=800&h=450" 
              alt="Printing & Services" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-[var(--accent)]/10 flex items-center justify-center">
              <Printer className="text-[var(--accent)]" size={20} />
            </div>
            <h3 className="text-[18px] font-semibold text-[var(--text-primary)]">Printing & Services</h3>
          </div>
          <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed font-light">Full branding solutions: DTF, Embroidery, Sublimation, Screen, and Offset printing. Plus signages and trophies.</p>
        </div>
      </div>
    </section>

    <section className="bg-[var(--bg-secondary)] px-10 py-[120px]">
      <div className="max-w-[1600px] mx-auto">
        <h2 className="text-[48px] font-light mb-10 text-[var(--text-primary)] tracking-tight leading-tight">Trust, Quality & Excellence</h2>
        <p className="text-[18px] text-[var(--text-secondary)] mb-6 leading-relaxed font-light max-w-[900px]">
          Every product in our catalog has been vetted through our rigorous quality assurance process. We partner only with verified suppliers who meet international standards. Your satisfaction is our priority.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mt-15">
          <div className="card">
            <div className="w-12 h-12 bg-white flex items-center justify-center mb-6">
              <CheckCircle2 className="text-[var(--accent)]" size={24} />
            </div>
            <h3 className="text-[18px] font-semibold mb-4 text-[var(--text-primary)]">Quality Verified</h3>
            <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed font-light">All suppliers undergo strict vetting. Products meet UAE regulations and international ISO standards.</p>
          </div>
          <div className="card">
            <div className="w-12 h-12 bg-white flex items-center justify-center mb-6">
              <FileText className="text-[var(--accent)]" size={24} />
            </div>
            <h3 className="text-[18px] font-semibold mb-4 text-[var(--text-primary)]">Compliance & Documentation</h3>
            <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed font-light">Complete documentation, certificates, and compliance records provided with every order.</p>
          </div>
          <div className="card">
            <div className="w-12 h-12 bg-white flex items-center justify-center mb-6">
              <Users className="text-[var(--accent)]" size={24} />
            </div>
            <h3 className="text-[18px] font-semibold mb-4 text-[var(--text-primary)]">Long-term Partnerships</h3>
            <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed font-light">We build lasting relationships with our suppliers and clients. Your repeat business is valued and rewarded.</p>
          </div>
          <div className="card">
            <div className="w-12 h-12 bg-white flex items-center justify-center mb-6">
              <Globe className="text-[var(--accent)]" size={24} />
            </div>
            <h3 className="text-[18px] font-semibold mb-4 text-[var(--text-primary)]">Global Standards</h3>
            <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed font-light">Products sourced from suppliers who meet international quality certifications and best practices.</p>
          </div>
        </div>
      </div>
    </section>

    <section className="bg-[var(--bg-secondary)] px-10 py-[120px] border-t border-[var(--border-subtle)]">
      <div className="max-w-[1600px] mx-auto">
        <h2 className="text-[48px] font-light mb-10 text-[var(--text-primary)] tracking-tight leading-tight">What Our Partners Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="bg-white p-10 border border-[var(--border-subtle)]">
            <Quote className="text-[var(--accent)] mb-6 opacity-20" size={40} />
            <p className="text-[16px] text-[var(--text-secondary)] italic mb-8 font-light leading-relaxed">
              "Logos International has been our primary sourcing partner for over 5 years. Their proximity to DXB and deep understanding of UAE regulations make them indispensable for our large-scale construction projects in Dubai."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center font-bold text-[var(--accent)]">JD</div>
              <div>
                <div className="text-[14px] font-semibold text-[var(--text-primary)]">John Doe</div>
                <div className="text-[12px] text-[var(--text-secondary)]">Procurement Director, ConstructCo</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-10 border border-[var(--border-subtle)]">
            <Quote className="text-[var(--accent)] mb-6 opacity-20" size={40} />
            <p className="text-[16px] text-[var(--text-secondary)] italic mb-8 font-light leading-relaxed">
              "The speed at which they can source specialized mechanical equipment is unmatched. We often have urgent requirements for our logistics fleet, and Logos always delivers on time with full compliance documentation."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center font-bold text-[var(--accent)]">AS</div>
              <div>
                <div className="text-[14px] font-semibold text-[var(--text-primary)]">Ahmed Salem</div>
                <div className="text-[12px] text-[var(--text-secondary)]">Operations Manager, Global Logistics</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-10 border border-[var(--border-subtle)]">
            <Quote className="text-[var(--accent)] mb-6 opacity-20" size={40} />
            <p className="text-[16px] text-[var(--text-secondary)] italic mb-8 font-light leading-relaxed">
              "Reliability and transparency are the hallmarks of Logos International. Their catalog is extensive, but it's their personalized service and commitment to quality that keeps us coming back for every new development."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center font-bold text-[var(--accent)]">MK</div>
              <div>
                <div className="text-[14px] font-semibold text-[var(--text-primary)]">Maria Khan</div>
                <div className="text-[12px] text-[var(--text-secondary)]">CEO, Desert Builders</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="bg-[var(--bg-primary)] px-10 py-[120px] border-t border-[var(--border-subtle)]">
      <div className="max-w-[1600px] mx-auto">
        <h2 className="text-[48px] font-light mb-10 text-[var(--text-primary)] tracking-tight leading-tight">Global Sourcing Network & GEO Strategy</h2>
        <p className="text-[18px] text-[var(--text-secondary)] mb-12 leading-relaxed font-light max-w-[900px]">
          Our GEO-strategic positioning in Dubai allows us to bridge the gap between Eastern manufacturing hubs and Western quality standards. We leverage the UAE's world-class infrastructure to provide a seamless flow of industrial goods across the globe.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="w-12 h-12 bg-[var(--bg-secondary)] flex items-center justify-center shrink-0">
                <Globe className="text-[var(--accent)]" size={24} />
              </div>
              <div>
                <h4 className="text-[18px] font-semibold mb-2">East-West Corridor</h4>
                <p className="text-[14px] text-[var(--text-secondary)] font-light">Optimized logistics routes connecting China, India, and Southeast Asia with the Middle East and Europe.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="w-12 h-12 bg-[var(--bg-secondary)] flex items-center justify-center shrink-0">
                <Truck className="text-[var(--accent)]" size={24} />
              </div>
              <div>
                <h4 className="text-[18px] font-semibold mb-2">Multi-Modal Logistics</h4>
                <p className="text-[14px] text-[var(--text-secondary)] font-light">Seamless integration of sea, air, and land transport to ensure the most efficient delivery for every product type.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="w-12 h-12 bg-[var(--bg-secondary)] flex items-center justify-center shrink-0">
                <ShieldCheck className="text-[var(--accent)]" size={24} />
              </div>
              <div>
                <h4 className="text-[18px] font-semibold mb-2">Local Expertise, Global Reach</h4>
                <p className="text-[14px] text-[var(--text-secondary)] font-light">Deep understanding of UAE customs and regulations combined with a global network of vetted suppliers.</p>
              </div>
            </div>
          </div>
          <div className="bg-[var(--bg-secondary)] aspect-square flex items-center justify-center border border-[var(--border-subtle)] relative overflow-hidden group">
            <div className="absolute inset-0 bg-linear-to-br from-[var(--accent)]/5 to-transparent" />
            <Globe className="text-[var(--accent)] opacity-10 group-hover:scale-110 transition-transform duration-[5000ms]" size={400} />
            <div className="relative z-10 text-center p-10">
              <div className="text-[64px] font-bold text-[var(--accent)] mb-2">50+</div>
              <div className="text-[14px] uppercase tracking-widest font-bold text-[var(--text-primary)]">Countries Reached</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="bg-[var(--ink)] text-white px-10 py-[120px]">
      <div className="max-w-[1600px] mx-auto">
        <h2 className="text-[48px] font-light mb-10 tracking-tight leading-tight">AEO: All-Encompassing Operations</h2>
        <p className="text-[18px] text-gray-400 mb-15 leading-relaxed font-light max-w-[900px]">
          Our AEO framework ensures that every aspect of your procurement and supply chain is managed with precision. From initial inquiry to final site delivery, we provide a holistic service that covers quality, compliance, and efficiency.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="p-10 border border-white/10 hover:border-[var(--accent)] transition-colors">
            <h3 className="text-[24px] font-bold mb-6">End-to-End Management</h3>
            <p className="text-[15px] text-gray-400 font-light leading-relaxed">We take full responsibility for the supply chain, allowing you to focus on your core business operations while we handle the complexities of global trading.</p>
          </div>
          <div className="p-10 border border-white/10 hover:border-[var(--accent)] transition-colors">
            <h3 className="text-[24px] font-bold mb-6">Compliance Assurance</h3>
            <p className="text-[15px] text-gray-400 font-light leading-relaxed">Every shipment is verified against local and international standards, with full documentation provided to ensure smooth customs clearance and site acceptance.</p>
          </div>
          <div className="p-10 border border-white/10 hover:border-[var(--accent)] transition-colors">
            <h3 className="text-[24px] font-bold mb-6">Strategic Partnership</h3>
            <p className="text-[15px] text-gray-400 font-light leading-relaxed">We act as an extension of your procurement team, providing market insights and strategic sourcing advice to optimize your project costs.</p>
          </div>
        </div>
      </div>
    </section>

    <section className="px-10 py-[120px] bg-[var(--bg-secondary)] border-t border-[var(--border-subtle)]">
      <div className="max-w-[1600px] mx-auto">
        <h2 className="text-[48px] font-light mb-10 text-[var(--text-primary)] tracking-tight leading-tight">Service Areas & Regional Coverage</h2>
        <p className="text-[18px] text-[var(--text-secondary)] mb-12 leading-relaxed font-light max-w-[900px]">
          Logos International is strategically positioned to serve the entire United Arab Emirates and the broader GCC region. Our logistics hub in Dubai enables rapid deployment of industrial and construction supplies to key economic zones.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="flex flex-col gap-4">
            <div className="text-[var(--accent)] font-bold text-[14px] uppercase tracking-widest">Dubai (DXB Hub)</div>
            <p className="text-[14px] text-[var(--text-secondary)] font-light leading-relaxed">Serving Al Garhoud, Deira, Jebel Ali Free Zone (JAFZA), Dubai South, and all major construction sites across the city.</p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="text-[var(--accent)] font-bold text-[14px] uppercase tracking-widest">Abu Dhabi</div>
            <p className="text-[14px] text-[var(--text-secondary)] font-light leading-relaxed">Providing mission-critical supplies to Mussafah Industrial Area, Khalifa Industrial Zone (KIZAD), and oil & gas projects.</p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="text-[var(--accent)] font-bold text-[14px] uppercase tracking-widest">Sharjah & Northern Emirates</div>
            <p className="text-[14px] text-[var(--text-secondary)] font-light leading-relaxed">Efficient delivery to Sharjah Industrial Areas, Ajman, Umm Al Quwain, Ras Al Khaimah, and Fujairah's maritime hub.</p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="text-[var(--accent)] font-bold text-[14px] uppercase tracking-widest">GCC Regional Export</div>
            <p className="text-[14px] text-[var(--text-secondary)] font-light leading-relaxed">Leveraging Dubai's world-class infrastructure for re-export services to Saudi Arabia, Oman, Kuwait, and Qatar.</p>
          </div>
        </div>
      </div>
    </section>

    <section className="bg-[var(--bg-primary)] px-10 py-[120px] border-t border-[var(--border-subtle)]">
      <div className="max-w-[1600px] mx-auto">
        <h2 className="text-[48px] font-light mb-12 text-[var(--text-primary)] tracking-tight leading-tight">Trading FAQ</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-12">
          <div>
            <h3 className="text-[18px] font-semibold mb-4 text-[var(--text-primary)]">Where is Logos International based?</h3>
            <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed font-light">We are headquartered in Sharjah, U.A.E., providing us with a strategic base to serve all Seven Emirates and the GCC nations with ease.</p>
          </div>
          <div>
            <h3 className="text-[18px] font-semibold mb-4 text-[var(--text-primary)]">What is your core business model?</h3>
            <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed font-light">We are a commercial trading business that buys specialized products in bulk from international manufacturers and sells them directly to industrial, construction, and corporate clients.</p>
          </div>
          <div>
            <h3 className="text-[18px] font-semibold mb-4 text-[var(--text-primary)]">Can you provide customized uniforms?</h3>
            <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed font-light">Yes, we offer comprehensive customization through our printing services branch, including DTF, embroidery, and screen printing for coveralls, t-shirts, and medical scrubs.</p>
          </div>
          <div>
            <h3 className="text-[18px] font-semibold mb-4 text-[var(--text-primary)]">Do you handle international exports?</h3>
            <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed font-light">We manage the entire supply chain, from global procurement and sea/air freight to local warehousing and site delivery. Our proximity to DXB and Jebel Ali Port ensures efficient handling of large-scale shipments.</p>
          </div>
        </div>
      </div>
    </section>

    <section className="max-w-[1600px] mx-auto px-10 py-[120px]">
      <h2 className="text-[48px] font-light mb-10 text-[var(--text-primary)] tracking-tight leading-tight">Ready to Work Together?</h2>
      <p className="text-[18px] text-[var(--text-secondary)] mb-6 leading-relaxed font-light max-w-[900px]">
        Browse our 250+ products, get instant quotes, and start sourcing from Logos International today. Our team is ready to support your business growth with tailored solutions and expert logistics.
      </p>
      <div className="flex flex-wrap gap-4 mt-10">
        <button className="btn-primary" onClick={() => onPageChange('products')}>Browse 250+ Products</button>
        <button className="btn-secondary" onClick={() => onPageChange('contact')}>Contact Our Team</button>
      </div>
    </section>

    <section className="bg-[var(--accent-dark)] text-white px-10 py-[80px]">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="max-w-[600px]">
          <h2 className="text-[32px] font-light mb-4 tracking-tight">Stay Updated</h2>
          <p className="text-[16px] text-white/70 font-light">Subscribe to our newsletter for the latest product updates, industry news, and exclusive offers from Logos International.</p>
        </div>
        <form 
          className="flex w-full md:w-auto gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            const email = (e.target as any).email.value;
            console.log('Newsletter signup:', email);
            alert('Thank you for subscribing!');
            (e.target as any).reset();
          }}
        >
          <input 
            type="email" 
            name="email"
            placeholder="Enter your email address" 
            required
            className="flex-1 md:w-[350px] p-4 bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-white transition-colors"
          />
          <button type="submit" className="bg-white text-[var(--accent-dark)] px-8 py-4 font-bold hover:bg-gray-100 transition-colors cursor-pointer">Subscribe</button>
        </form>
      </div>
    </section>
  </motion.div>
);

const ProductsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [selectedProductDetails, setSelectedProductDetails] = useState<Product | null>(null);

  // Fuse.js for fuzzy search
  const fuse = useMemo(() => new Fuse(products, {
    keys: ['name', 'category', 'description'],
    threshold: 0.3,
  }), []);

  const filteredAndSortedProducts = useMemo(() => {
    let result = searchTerm 
      ? fuse.search(searchTerm).map(r => r.item)
      : products;

    // Filter by category
    if (categoryFilter) {
      result = result.filter(p => p.category === categoryFilter);
    }

    // Filter by price
    if (priceFilter) {
      result = result.filter(p => {
        if (priceFilter === '0-1000') return p.price < 1000;
        if (priceFilter === '1000-5000') return p.price >= 1000 && p.price < 5000;
        if (priceFilter === '5000-10000') return p.price >= 5000 && p.price < 10000;
        if (priceFilter === '10000+') return p.price >= 10000;
        return true;
      });
    }

    // Sort
    result = [...result].sort((a, b) => {
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return 0;
    });

    return result;
  }, [searchTerm, categoryFilter, priceFilter, sortBy, fuse]);

  // Simulate loading when filters change
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [searchTerm, categoryFilter, priceFilter, sortBy]);

  const toggleProductSelection = (id: number) => {
    setSelectedProducts(prev => 
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  const handleRequestQuote = () => {
    const selectedNames = products
      .filter(p => selectedProducts.includes(p.id))
      .map(p => p.name)
      .join(', ');
    
    if (selectedProducts.length === 0) {
      alert("Please select at least one product to request a quote.");
      return;
    }

    const subject = encodeURIComponent(`Quote Request for ${selectedProducts.length} items`);
    const body = encodeURIComponent(`I would like to request a quote for the following items:\n\n${selectedNames}\n\nPlease contact me with pricing and availability.`);
    window.location.href = `mailto:info@logos.ae?subject=${subject}&body=${body}`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen"
    >
      <div className="max-w-[1600px] mx-auto px-10 pt-20 pb-15">
        <h1 className="text-[56px] font-light mb-5 text-[var(--text-primary)] tracking-tight">Products & Catalog</h1>
        <p className="text-[18px] text-[var(--text-secondary)] font-light">
          Explore our comprehensive catalog of 250+ products across multiple categories. Use filters and search to find exactly what you need.
        </p>
      </div>

      <div className="max-w-[1600px] mx-auto px-10 pb-10 flex flex-col md:flex-row gap-6 flex-wrap items-center sticky top-[60px] bg-white/90 backdrop-blur-md z-50 py-4 border-b border-[var(--border-subtle)]">
        <div className="flex-1 min-w-[250px] w-full">
          <input 
            type="text" 
            placeholder="Search products (fuzzy search enabled)..." 
            className="w-full p-3 border border-[var(--border-subtle)] focus:outline-none focus:border-[var(--accent)] focus:ring-3 focus:ring-[rgba(15,98,254,0.1)] transition-all duration-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4 items-center flex-wrap">
          <div className="flex gap-2 items-center">
            <label htmlFor="category-filter" className="text-[11px] font-bold uppercase text-[var(--text-primary)]">Category:</label>
            <select 
              id="category-filter"
              aria-label="Filter products by category"
              className="p-2 border border-[var(--border-subtle)] bg-white cursor-pointer focus:outline-none focus:border-[var(--accent)] transition-all duration-200 text-[12px]"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Clothing">Clothing & Uniforms</option>
              <option value="Safety Footwear">Safety Footwear</option>
              <option value="Hand Protection">Hand Protection</option>
              <option value="Respiratory Protection">Respiratory Protection</option>
              <option value="Eye & Ear Protection">Eye & Ear Protection</option>
              <option value="Head Protection">Head Protection</option>
              <option value="Fall Protection">Fall Protection</option>
              <option value="Building Materials & Hardware">Hardware & Building</option>
              <option value="Printing Services">Printing Services</option>
              <option value="Shields and Trophies">Shields & Trophies</option>
              <option value="Signages">Signages</option>
              <option value="Bird & Cat Food">Pet Food & Accessories</option>
              <option value="Marine Paints">Marine Paints</option>
              <option value="Steel Wire Ropes">Steel Wire Ropes</option>
              <option value="Miscellaneous Products">Miscellaneous</option>
            </select>
          </div>
          <div className="flex gap-2 items-center">
            <label htmlFor="price-filter" className="text-[11px] font-bold uppercase text-[var(--text-primary)]">Price:</label>
            <select 
              id="price-filter"
              aria-label="Filter products by price range"
              className="p-2 border border-[var(--border-subtle)] bg-white cursor-pointer focus:outline-none focus:border-[var(--accent)] transition-all duration-200 text-[12px]"
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
            >
              <option value="">All Prices</option>
              <option value="0-1000">Under AED 1,000</option>
              <option value="1000-5000">AED 1,000 - 5,000</option>
              <option value="5000-10000">AED 5,000 - 10,000</option>
              <option value="10000+">AED 10,000+</option>
            </select>
          </div>
          <div className="flex gap-2 items-center">
            <label htmlFor="sort-by" className="text-[11px] font-bold uppercase text-[var(--text-primary)]">Sort:</label>
            <select 
              id="sort-by"
              aria-label="Sort products by name or price"
              className="p-2 border border-[var(--border-subtle)] bg-white cursor-pointer focus:outline-none focus:border-[var(--accent)] transition-all duration-200 text-[12px]"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="price-asc">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
            </select>
          </div>
        </div>
        {selectedProducts.length > 0 && (
          <motion.button 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={handleRequestQuote}
            className="bg-[var(--accent)] text-white px-6 py-3 text-[13px] font-bold shadow-lg hover:bg-[var(--accent-dark)] transition-all"
          >
            Request Quote ({selectedProducts.length})
          </motion.button>
        )}
      </div>

      <div className="max-w-[1600px] mx-auto px-10 pb-[120px] mt-10">
        {isLoading ? (
          <Spinner />
        ) : filteredAndSortedProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredAndSortedProducts.map(product => (
              <div 
                key={product.id} 
                className={`group relative bg-[var(--bg-primary)] border ${selectedProducts.includes(product.id) ? 'border-[var(--accent)] ring-2 ring-[var(--accent)]/10' : 'border-[var(--border-subtle)]'} overflow-hidden transition-all duration-200 hover:shadow-xl flex flex-col cursor-pointer`}
                onClick={() => setSelectedProductDetails(product)}
              >
                <div className="absolute top-3 left-3 z-10" onClick={(e) => e.stopPropagation()}>
                  <input 
                    type="checkbox" 
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => toggleProductSelection(product.id)}
                    className="w-5 h-5 accent-[var(--accent)] cursor-pointer"
                  />
                </div>
                <div className="w-full h-[200px] bg-linear-to-br from-[var(--bg-secondary)] to-white flex items-center justify-center text-[60px] text-[var(--accent)] font-light group-hover:scale-105 transition-transform duration-500 relative overflow-hidden">
                  <img 
                    src={(() => {
                      const mapping: Record<string, string> = {
                        "Clothing": "https://images.unsplash.com/photo-1623945417954-4682333857e4?auto=format&fit=crop&q=80&w=400&h=300",
                        "Safety Footwear": "https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&q=80&w=400&h=300",
                        "Hand Protection": "https://images.unsplash.com/photo-1597448827232-73642d681287?auto=format&fit=crop&q=80&w=400&h=300",
                        "Hardware & Building": "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=400&h=300",
                        "Printing Services": "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=400&h=300",
                        "Signages": "https://images.unsplash.com/photo-1572535423190-67f668fc7254?auto=format&fit=crop&q=80&w=400&h=300",
                        "Respiratory Protection": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400&h=300",
                        "Head Protection": "https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&q=80&w=400&h=300",
                      };
                      return mapping[product.category] || `https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=400&h=300`;
                    })()}
                    alt={product.name}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:opacity-100 opacity-80 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-[var(--accent)]/5 group-hover:bg-transparent transition-colors" />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="text-[11px] font-semibold uppercase text-[var(--accent)] mb-2 tracking-wider">{product.category}</div>
                  <div className="text-[16px] font-semibold text-[var(--text-primary)] mb-2 leading-tight">{product.name}</div>
                  <div className="text-[13px] text-[var(--text-secondary)] leading-relaxed mb-4 flex-1 font-light line-clamp-2">
                    {product.description || "High-quality product with verified sourcing and quality assurance."}
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-[var(--border-subtle)]">
                    <div className="text-[14px] font-semibold text-[var(--accent)]">AED {product.price.toLocaleString()}</div>
                    <div className="text-[11px] font-bold text-[var(--accent)] uppercase opacity-0 group-hover:opacity-100 transition-opacity">View Details →</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-[var(--text-secondary)]">
            <h2 className="text-2xl font-light mb-2">No products found</h2>
            <p>Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>

      <section className="bg-[var(--bg-secondary)] px-10 py-[120px] border-t border-[var(--border-subtle)]">
        <div className="max-w-[1600px] mx-auto">
          <h2 className="text-[48px] font-light mb-10 text-[var(--text-primary)] tracking-tight leading-tight">Our Sourcing Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="flex gap-6">
              <div className="text-[32px] font-bold text-[var(--accent)] opacity-20">01</div>
              <div>
                <h3 className="text-[18px] font-semibold mb-4 text-[var(--text-primary)]">Inquiry & Analysis</h3>
                <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed font-light">We analyze your specific requirements and technical specifications to identify the best sourcing strategy.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="text-[32px] font-bold text-[var(--accent)] opacity-20">02</div>
              <div>
                <h3 className="text-[18px] font-semibold mb-4 text-[var(--text-primary)]">Supplier Vetting</h3>
                <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed font-light">Our team evaluates multiple verified suppliers to ensure quality, compliance, and competitive pricing.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="text-[32px] font-bold text-[var(--accent)] opacity-20">03</div>
              <div>
                <h3 className="text-[18px] font-semibold mb-4 text-[var(--text-primary)]">Quality Control</h3>
                <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed font-light">Every order undergoes rigorous inspection and documentation verification before shipment.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="text-[32px] font-bold text-[var(--accent)] opacity-20">04</div>
              <div>
                <h3 className="text-[18px] font-semibold mb-4 text-[var(--text-primary)]">Logistics & Delivery</h3>
                <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed font-light">We manage the entire logistics chain, ensuring safe and timely delivery to your specified location in the UAE.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Modal isOpen={!!selectedProductDetails} onClose={() => setSelectedProductDetails(null)}>
        {selectedProductDetails && (
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 bg-[var(--bg-secondary)] flex items-center justify-center min-h-[300px] md:min-h-[500px] text-[120px] relative overflow-hidden">
              <img 
                src={(() => {
                  const mapping: Record<string, string> = {
                    "Clothing": "https://images.unsplash.com/photo-1623945417954-4682333857e4?auto=format&fit=crop&q=80&w=800&h=600",
                    "Safety Footwear": "https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&q=80&w=800&h=600",
                    "Hand Protection": "https://images.unsplash.com/photo-1597448827232-73642d681287?auto=format&fit=crop&q=80&w=800&h=600",
                    "Hardware & Building": "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=800&h=600",
                    "Printing Services": "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=800&h=600",
                  };
                  return mapping[selectedProductDetails.category] || `https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=800&h=600`;
                })()}
                alt={selectedProductDetails.name}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover grayscale-[0.2]"
              />
              <div className="absolute inset-0 bg-linear-to-br from-[var(--accent)]/10 to-transparent" />
            </div>
            <div className="w-full md:w-1/2 p-10 flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div className="text-[12px] font-bold uppercase text-[var(--accent)] tracking-[0.2em]">{selectedProductDetails.category}</div>
                {selectedProductDetails.specifications?.["Standards"] && (
                  <div className="bg-[var(--accent)]/10 text-[var(--accent)] px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-sm border border-[var(--accent)]/20">
                    {selectedProductDetails.specifications["Standards"]}
                  </div>
                )}
              </div>
              <h2 className="text-[32px] font-light text-[var(--text-primary)] mb-6 leading-tight tracking-tight">{selectedProductDetails.name}</h2>
              <div className="text-[24px] font-semibold text-[var(--accent)] mb-8">AED {selectedProductDetails.price.toLocaleString()}</div>
              
              <div className="mb-8">
                <h3 className="text-[14px] font-bold uppercase text-[var(--text-primary)] mb-3 tracking-wider">Description</h3>
                <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed font-light">
                  {selectedProductDetails.fullDescription || selectedProductDetails.description || "This premium product is sourced from our verified global network, ensuring the highest standards of quality and reliability for your industrial or commercial needs. All our items come with full documentation and compliance certifications as required by UAE regulations."}
                </p>
              </div>

              {selectedProductDetails.specifications && (
                <div className="mb-8">
                  <h3 className="text-[14px] font-bold uppercase text-[var(--text-primary)] mb-3 tracking-wider">Specifications</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(selectedProductDetails.specifications).map(([key, value]) => (
                      <div key={key} className="border-b border-[var(--border-subtle)] pb-2">
                        <div className="text-[11px] text-[var(--text-secondary)] uppercase font-bold">{key}</div>
                        <div className="text-[14px] text-[var(--text-primary)] font-medium">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-auto pt-8 border-t border-[var(--border-subtle)] flex gap-4">
                <button 
                  onClick={() => {
                    toggleProductSelection(selectedProductDetails.id);
                    setSelectedProductDetails(null);
                  }}
                  className={`flex-1 py-4 text-[13px] font-bold transition-all ${selectedProducts.includes(selectedProductDetails.id) ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-[var(--accent)] text-white hover:bg-[var(--accent-dark)]'}`}
                >
                  {selectedProducts.includes(selectedProductDetails.id) ? 'Remove from Quote' : 'Add to Quote Request'}
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  );
};

const ServicesPage: React.FC<{ onPageChange: (page: Page) => void }> = ({ onPageChange }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="pt-[100px]"
  >
    <section className="px-10 py-[120px] bg-[var(--ink)] text-white text-center">
      <div className="max-w-[1600px] mx-auto">
        <h1 className="text-[6vw] font-bold leading-none tracking-tighter uppercase mb-8">
          Our <span className="text-[var(--accent)]">Services</span>
        </h1>
        <p className="text-[20px] text-gray-400 max-w-[800px] mx-auto font-light leading-relaxed">
          Beyond supplying products, we provide comprehensive solutions that empower your business to scale efficiently and securely in the UAE market.
        </p>
      </div>
    </section>

    <section className="px-10 py-[120px] bg-white">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <div className="p-10 border border-[var(--border-subtle)] hover:border-[var(--accent)] transition-all group relative overflow-hidden bg-white">
          <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 bg-[var(--accent)]/5 rounded-full blur-2xl group-hover:bg-[var(--accent)]/10 transition-all" />
          <div className="w-16 h-16 bg-[var(--bg-secondary)] flex items-center justify-center mb-8 group-hover:bg-[var(--accent)] transition-colors">
            <Globe className="text-[var(--accent)] group-hover:text-white transition-colors" size={32} />
          </div>
          <h3 className="text-[24px] font-bold mb-4">Global Strategic Sourcing</h3>
          <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed font-light mb-8">We identify and vet manufacturers worldwide to find the best balance of quality and cost for your specific needs.</p>
          <div className="h-[200px] mb-8 overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
            <img 
              src="https://images.unsplash.com/photo-1454165833767-027ffea9e77b?auto=format&fit=crop&q=80&w=800&h=450" 
              alt="Strategic Sourcing" 
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
              referrerPolicy="no-referrer"
            />
          </div>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-[14px] text-[var(--text-primary)]"><CheckCircle2 size={16} className="text-[var(--accent)]" /> Supplier Audits</li>
            <li className="flex items-center gap-3 text-[14px] text-[var(--text-primary)]"><CheckCircle2 size={16} className="text-[var(--accent)]" /> Price Negotiation</li>
            <li className="flex items-center gap-3 text-[14px] text-[var(--text-primary)]"><CheckCircle2 size={16} className="text-[var(--accent)]" /> Sample Verification</li>
          </ul>
        </div>

        <div className="p-10 border border-[var(--border-subtle)] hover:border-[var(--accent)] transition-all group relative overflow-hidden bg-white">
          <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 bg-[var(--accent)]/5 rounded-full blur-2xl group-hover:bg-[var(--accent)]/10 transition-all" />
          <div className="w-16 h-16 bg-[var(--bg-secondary)] flex items-center justify-center mb-8 group-hover:bg-[var(--accent)] transition-colors">
            <ShieldCheck className="text-[var(--accent)] group-hover:text-white transition-colors" size={32} />
          </div>
          <h3 className="text-[24px] font-bold mb-4">Quality Control</h3>
          <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed font-light mb-8">Our team performs on-site inspections and laboratory testing to ensure every shipment meets international standards.</p>
          <div className="h-[200px] mb-8 overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
            <img 
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800&h=450" 
              alt="Quality Control" 
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
              referrerPolicy="no-referrer"
            />
          </div>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-[14px] text-[var(--text-primary)]"><CheckCircle2 size={16} className="text-[var(--accent)]" /> Pre-shipment Inspection</li>
            <li className="flex items-center gap-3 text-[14px] text-[var(--text-primary)]"><CheckCircle2 size={16} className="text-[var(--accent)]" /> Material Testing</li>
            <li className="flex items-center gap-3 text-[14px] text-[var(--text-primary)]"><CheckCircle2 size={16} className="text-[var(--accent)]" /> Compliance Certification</li>
          </ul>
        </div>

        <div className="p-10 border border-[var(--border-subtle)] hover:border-[var(--accent)] transition-all group relative overflow-hidden bg-white">
          <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 bg-[var(--accent)]/5 rounded-full blur-2xl group-hover:bg-[var(--accent)]/10 transition-all" />
          <div className="w-16 h-16 bg-[var(--bg-secondary)] flex items-center justify-center mb-8 group-hover:bg-[var(--accent)] transition-colors">
            <Truck className="text-[var(--accent)] group-hover:text-white transition-colors" size={32} />
          </div>
          <h3 className="text-[24px] font-bold mb-4">End-to-End Logistics</h3>
          <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed font-light mb-8">From the factory floor to your warehouse in the UAE, we manage the entire transportation and customs process.</p>
          <div className="h-[200px] mb-8 overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
            <img 
              src="https://images.unsplash.com/photo-1494412574743-019475a77671?auto=format&fit=crop&q=80&w=800&h=450" 
              alt="Logistics" 
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
              referrerPolicy="no-referrer"
            />
          </div>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-[14px] text-[var(--text-primary)]"><CheckCircle2 size={16} className="text-[var(--accent)]" /> Freight Forwarding</li>
            <li className="flex items-center gap-3 text-[14px] text-[var(--text-primary)]"><CheckCircle2 size={16} className="text-[var(--accent)]" /> Customs Clearance</li>
            <li className="flex items-center gap-3 text-[14px] text-[var(--text-primary)]"><CheckCircle2 size={16} className="text-[var(--accent)]" /> Warehousing</li>
          </ul>
        </div>

        <div className="p-10 border border-[var(--border-subtle)] hover:border-[var(--accent)] transition-all group relative overflow-hidden bg-white">
          <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 bg-[var(--accent)]/5 rounded-full blur-2xl group-hover:bg-[var(--accent)]/10 transition-all" />
          <div className="w-16 h-16 bg-[var(--bg-secondary)] flex items-center justify-center mb-8 group-hover:bg-[var(--accent)] transition-colors">
            <Printer className="text-[var(--accent)] group-hover:text-white transition-colors" size={32} />
          </div>
          <h3 className="text-[24px] font-bold mb-4">Branding & Printing</h3>
          <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed font-light mb-8">Professional in-house customization for all your corporate and industrial apparel through advanced printing technologies.</p>
          <div className="h-[200px] mb-8 overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
            <img 
              src="https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=800&h=450" 
              alt="Branding" 
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
              referrerPolicy="no-referrer"
            />
          </div>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-[14px] text-[var(--text-primary)]"><CheckCircle2 size={16} className="text-[var(--accent)]" /> DTF & Screen Printing</li>
            <li className="flex items-center gap-3 text-[14px] text-[var(--text-primary)]"><CheckCircle2 size={16} className="text-[var(--accent)]" /> Multi-color Embroidery</li>
            <li className="flex items-center gap-3 text-[14px] text-[var(--text-primary)]"><CheckCircle2 size={16} className="text-[var(--accent)]" /> Sublimation & Heat Press</li>
          </ul>
        </div>

        <div className="p-10 border border-[var(--border-subtle)] hover:border-[var(--accent)] transition-all group relative overflow-hidden bg-white">
          <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 bg-[var(--accent)]/5 rounded-full blur-2xl group-hover:bg-[var(--accent)]/10 transition-all" />
          <div className="w-16 h-16 bg-[var(--bg-secondary)] flex items-center justify-center mb-8 group-hover:bg-[var(--accent)] transition-colors">
            <Shirt className="text-[var(--accent)] group-hover:text-white transition-colors" size={32} />
          </div>
          <h3 className="text-[24px] font-bold mb-4">Custom Uniform Synthesis</h3>
          <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed font-light mb-8">End-to-end design and manufacturing of industrial coveralls, lab coats, and corporate uniforms tailored to your size and safety specs.</p>
          <div className="h-[200px] mb-8 overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
            <img 
              src="https://images.unsplash.com/photo-1623945417954-4682333857e4?auto=format&fit=crop&q=80&w=800&h=450" 
              alt="Custom Uniforms" 
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
              referrerPolicy="no-referrer"
            />
          </div>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-[14px] text-[var(--text-primary)]"><CheckCircle2 size={16} className="text-[var(--accent)]" /> Pattern Design</li>
            <li className="flex items-center gap-3 text-[14px] text-[var(--text-primary)]"><CheckCircle2 size={16} className="text-[var(--accent)]" /> Material Selection</li>
            <li className="flex items-center gap-3 text-[14px] text-[var(--text-primary)]"><CheckCircle2 size={16} className="text-[var(--accent)]" /> Bulk Production</li>
          </ul>
        </div>

        <div className="p-10 border border-[var(--border-subtle)] hover:border-[var(--accent)] transition-all group relative overflow-hidden bg-white">
          <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 bg-[var(--accent)]/5 rounded-full blur-2xl group-hover:bg-[var(--accent)]/10 transition-all" />
          <div className="w-16 h-16 bg-[var(--bg-secondary)] flex items-center justify-center mb-8 group-hover:bg-[var(--accent)] transition-colors">
            <Briefcase className="text-[var(--accent)] group-hover:text-white transition-colors" size={32} />
          </div>
          <h3 className="text-[24px] font-bold mb-4">Trading & Procurement</h3>
          <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed font-light mb-8">We act as your dedicated procurement office, handling all negotiations and purchases from global brands for your projects.</p>
          <div className="h-[200px] mb-8 overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
            <img 
              src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=800&h=450" 
              alt="Procurement" 
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
              referrerPolicy="no-referrer"
            />
          </div>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-[14px] text-[var(--text-primary)]"><CheckCircle2 size={16} className="text-[var(--accent)]" /> Market Analysis</li>
            <li className="flex items-center gap-3 text-[14px] text-[var(--text-primary)]"><CheckCircle2 size={16} className="text-[var(--accent)]" /> Bulk Purchasing</li>
            <li className="flex items-center gap-3 text-[14px] text-[var(--text-primary)]"><CheckCircle2 size={16} className="text-[var(--accent)]" /> Inventory Management</li>
          </ul>
        </div>
      </div>
    </section>

    <section className="bg-[var(--bg-secondary)] px-10 py-[120px]">
      <div className="max-w-[1600px] mx-auto text-center">
        <h2 className="text-[48px] font-light mb-10 text-[var(--text-primary)] tracking-tight leading-tight">
          Ready to Optimize Your <span className="font-bold">Supply Chain?</span>
        </h2>
        <button 
          onClick={() => onPageChange('contact')}
          className="px-12 py-6 bg-[var(--accent)] text-white font-bold uppercase tracking-[0.2em] hover:bg-[var(--ink)] transition-all duration-300"
        >
          Schedule a Consultation
        </button>
      </div>
    </section>
  </motion.div>
);

const ContactPage: React.FC = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <section className="max-w-[1600px] mx-auto px-10 py-[120px]">
      <h2 className="text-[48px] font-light mb-10 text-[var(--text-primary)] tracking-tight leading-tight">Get in Touch</h2>
      <p className="text-[18px] text-[var(--text-secondary)] mb-6 leading-relaxed font-light">
        Ready to partner with Logos International? Our team is here to discuss your supply and trading needs. Contact us today.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-15">
        <div className="card">
          <div className="w-16 h-16 bg-[var(--bg-secondary)] flex items-center justify-center mb-6">
            <MapPin className="text-[var(--accent)]" size={32} />
          </div>
          <h3 className="text-[18px] font-semibold mb-4 text-[var(--text-primary)]">Address</h3>
          <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed font-light">Sharjah Industrial Area<br />Sharjah, United Arab Emirates</p>
        </div>

        <div className="card">
          <div className="w-16 h-16 bg-[var(--bg-secondary)] flex items-center justify-center mb-6">
            <Phone className="text-[var(--accent)]" size={32} />
          </div>
          <h3 className="text-[18px] font-semibold mb-4 text-[var(--text-primary)]">Phone</h3>
          <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed font-light"><a href="tel:+971" className="hover:text-[var(--accent)] transition-colors">+971 [Contact Number]</a></p>
        </div>

        <div className="card">
          <div className="w-16 h-16 bg-[var(--bg-secondary)] flex items-center justify-center mb-6">
            <Mail className="text-[var(--accent)]" size={32} />
          </div>
          <h3 className="text-[18px] font-semibold mb-4 text-[var(--text-primary)]">Email</h3>
          <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed font-light"><a href="mailto:info@logos.ae" className="hover:text-[var(--accent)] transition-colors">info@logos.ae</a></p>
        </div>

        <div className="card">
          <div className="w-16 h-16 bg-[var(--bg-secondary)] flex items-center justify-center mb-6">
            <Quote className="text-[var(--accent)]" size={32} />
          </div>
          <h3 className="text-[18px] font-semibold mb-4 text-[var(--text-primary)]">WhatsApp</h3>
          <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed font-light"><a href="https://wa.me/971" className="hover:text-[var(--accent)] transition-colors">Message us directly</a></p>
        </div>

        <div className="card">
          <div className="w-16 h-16 bg-[var(--bg-secondary)] flex items-center justify-center mb-6">
            <Clock className="text-[var(--accent)]" size={32} />
          </div>
          <h3 className="text-[18px] font-semibold mb-4 text-[var(--text-primary)]">Hours</h3>
          <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed font-light">Available 24/7<br />for urgent inquiries</p>
        </div>

        <div className="card">
          <div className="w-16 h-16 bg-[var(--bg-secondary)] flex items-center justify-center mb-6">
            <Briefcase className="text-[var(--accent)]" size={32} />
          </div>
          <h3 className="text-[18px] font-semibold mb-4 text-[var(--text-primary)]">Services</h3>
          <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed font-light">Sourcing • Logistics<br />General Trading</p>
        </div>
      </div>

      <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div>
          <h3 className="text-[24px] font-light mb-8 text-[var(--text-primary)]">Send us a Message</h3>
          <form 
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const data = Object.fromEntries(formData.entries());
              console.log('Contact form submission:', data);
              alert('Message sent successfully! We will get back to you shortly.');
              (e.target as HTMLFormElement).reset();
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Your Name</label>
                <input type="text" id="name" name="name" required className="p-4 border border-[var(--border-subtle)] focus:outline-none focus:border-[var(--accent)] transition-colors" />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Email Address</label>
                <input type="email" id="email" name="email" required className="p-4 border border-[var(--border-subtle)] focus:outline-none focus:border-[var(--accent)] transition-colors" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="subject" className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Subject</label>
              <input type="text" id="subject" name="subject" required className="p-4 border border-[var(--border-subtle)] focus:outline-none focus:border-[var(--accent)] transition-colors" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="text-[11px] font-bold uppercase text-[var(--text-secondary)]">Message</label>
              <textarea id="message" name="message" rows={6} required className="p-4 border border-[var(--border-subtle)] focus:outline-none focus:border-[var(--accent)] transition-colors resize-none"></textarea>
            </div>
            <button type="submit" className="btn-primary w-full md:w-auto">Send Message</button>
          </form>
        </div>
        <div className="bg-[var(--bg-secondary)] p-10 flex flex-col justify-center">
          <h3 className="text-[24px] font-light mb-6 text-[var(--text-primary)]">Visit Our Office</h3>
          <p className="text-[15px] text-[var(--text-secondary)] mb-8 font-light leading-relaxed">
            Our strategic location near Dubai International Airport (DXB) allows us to coordinate logistics and distribution with unmatched efficiency. We welcome visitors for scheduled meetings and product demonstrations.
          </p>
          <div className="aspect-video bg-gray-200 flex items-center justify-center text-[var(--text-secondary)] font-light border border-[var(--border-subtle)]">
            [ Interactive Map Placeholder ]
          </div>
        </div>
      </div>
    </section>
  </motion.div>
);

const PrivacyPage: React.FC = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="max-w-[1000px] mx-auto px-10 py-[120px]"
  >
    <h1 className="text-[48px] font-light mb-10 text-[var(--text-primary)] tracking-tight">Privacy Policy</h1>
    <div className="prose prose-slate max-w-none text-[var(--text-secondary)] font-light leading-relaxed space-y-8">
      <p className="text-lg">Last updated: March 30, 2026</p>
      <p>At Logos International, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy outlines how we collect, use, disclose, and safeguard your data when you visit our website or engage with our trading and supply services in the United Arab Emirates.</p>
      
      <section>
        <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">1. Information Collection</h2>
        <p>We collect information that you voluntarily provide to us, including but not limited to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Contact details (name, email address, phone number, physical address).</li>
          <li>Business information (company name, trade license details, industry).</li>
          <li>Transaction data (purchase history, quote requests, payment information).</li>
          <li>Digital identifiers (IP address, browser type, cookies).</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">2. Use of Information</h2>
        <p>Your information is used to facilitate our business operations, including:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Processing and fulfilling your orders and quote requests.</li>
          <li>Providing customer support and responding to inquiries.</li>
          <li>Complying with UAE legal and regulatory requirements for general trading.</li>
          <li>Improving our website functionality and user experience.</li>
          <li>Sending relevant marketing communications (with your consent).</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">3. Data Sharing and Disclosure</h2>
        <p>We do not sell your personal information. We may share data with trusted third parties only when necessary to provide our services, such as logistics partners, customs authorities, or financial institutions. All third parties are required to maintain the confidentiality of your data.</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">4. Data Security</h2>
        <p>We implement robust security measures, including encryption and secure servers, to protect your data from unauthorized access, loss, or misuse. However, no method of transmission over the internet is 100% secure.</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">5. Your Rights</h2>
        <p>You have the right to access, correct, or request the deletion of your personal information. To exercise these rights, please contact us at info@logos.ae.</p>
      </section>
    </div>
  </motion.div>
);

const TermsPage: React.FC = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="max-w-[1000px] mx-auto px-10 py-[120px]"
  >
    <h1 className="text-[48px] font-light mb-10 text-[var(--text-primary)] tracking-tight">Terms of Service</h1>
    <div className="prose prose-slate max-w-none text-[var(--text-secondary)] font-light leading-relaxed space-y-8">
      <p className="text-lg">Last updated: March 30, 2026</p>
      <p>Welcome to Logos International. By accessing our website and using our services, you agree to comply with and be bound by the following Terms of Service. Please read them carefully.</p>

      <section>
        <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">1. Acceptance of Terms</h2>
        <p>By using this website, you represent that you are at least 18 years of age and have the legal authority to enter into these terms on behalf of yourself or your organization.</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">2. Trading and Supply Services</h2>
        <p>All quotes provided through our platform are subject to final confirmation based on current market availability and logistics costs. Logos International reserves the right to modify pricing or availability without prior notice until a formal agreement is signed.</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">3. User Obligations</h2>
        <p>You agree to provide accurate and complete information when requesting quotes or contacting us. You are prohibited from using our website for any fraudulent or illegal activities.</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">4. Intellectual Property</h2>
        <p>The content, logos, graphics, and design of this website are the exclusive property of Logos International. Unauthorized use or reproduction is strictly prohibited.</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">5. Governing Law</h2>
        <p>These terms are governed by and construed in accordance with the laws of the United Arab Emirates. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of Sharjah.</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">6. Contact Information</h2>
        <p>If you have any questions regarding these Terms of Service, please contact us at info@logos.ae.</p>
      </section>
    </div>
  </motion.div>
);

// --- Main App ---

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  // Handle scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header currentPage={currentPage} onPageChange={setCurrentPage} />
      
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {currentPage === 'home' && <HomePage key="home" onPageChange={setCurrentPage} />}
          {currentPage === 'products' && <ProductsPage key="products" />}
          {currentPage === 'services' && <ServicesPage key="services" onPageChange={setCurrentPage} />}
          {currentPage === 'contact' && <ContactPage key="contact" />}
          {currentPage === 'privacy' && <PrivacyPage key="privacy" />}
          {currentPage === 'terms' && <TermsPage key="terms" />}
        </AnimatePresence>
      </main>

      <Footer onPageChange={setCurrentPage} />
    </div>
  );
}
