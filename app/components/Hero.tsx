'use client';

import Link from 'next/link';

export default function Hero() {
  return (
    <section id="home" className="hero">
      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-title">Ultimate Gaming Experience</h1>
          <p className="hero-subtitle">
            Discover premium PC accessories that elevate your gaming to the next level. 
            From high-performance mice to crystal-clear headsets, we have everything you need.
          </p>
          <div className="hero-buttons">
            <Link href="/products" className="btn btn-primary">
              Shop Now
            </Link>
            <Link href="/custom-build" className="btn btn-secondary">
              Custom Build
            </Link>
          </div>
        </div>
        
        <div className="hero-visual">
          <div className="floating-card">
            <i className="fas fa-microchip"></i>
            <span>RTX 4090</span>
          </div>
          <div className="floating-card">
            <i className="fas fa-memory"></i>
            <span>32GB DDR5</span>
          </div>
          <div className="floating-card">
            <i className="fas fa-hdd"></i>
            <span>2TB NVMe</span>
          </div>
        </div>
      </div>
      
      <div className="hero-background">
        <div className="grid-overlay"></div>
        <div className="particles"></div>
      </div>
    </section>
  );
} 