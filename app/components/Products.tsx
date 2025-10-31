'use client';

import { useState, useEffect } from 'react';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
  image: string;
  description: string;
  specs: Record<string, string>;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const url = selectedCategory === 'all' 
        ? 'http://localhost:5000/api/products'
        : `http://localhost:5000/api/products?category=${selectedCategory}`;
      
      const response = await fetch(url);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fallback to mock data if API is not available
      setProducts([
        {
          id: 1,
          name: "Razer DeathAdder V3 Pro",
          category: "Mouse",
          price: 149.99,
          rating: 4.8,
          image: "https://via.placeholder.com/300x200/1e3a8a/ffffff?text=Gaming+Mouse",
          description: "Wireless gaming mouse with 30K DPI sensor",
          specs: { dpi: "30,000 DPI", battery: "70 hours" }
        },
        {
          id: 2,
          name: "Corsair K100 RGB",
          category: "Keyboard",
          price: 229.99,
          rating: 4.9,
          image: "https://via.placeholder.com/300x200/1e3a8a/ffffff?text=Gaming+Keyboard",
          description: "Mechanical gaming keyboard with Cherry MX switches",
          specs: { switches: "Cherry MX", layout: "Full-size" }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', 'Mouse', 'Keyboard', 'Headset', 'Monitor'];

  const addToCart = (product: Product) => {
    // Show notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = `${product.name} added to cart!`;
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: var(--neon-blue);
      color: white;
      padding: 15px 20px;
      border-radius: 10px;
      z-index: 10000;
      animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  };

  if (loading) {
    return (
      <section id="products" className="products">
        <div className="container">
          <h2 className="section-title">Featured Products</h2>
          <div className="loading-skeleton">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton-image"></div>
                <div className="skeleton-content">
                  <div className="skeleton-title"></div>
                  <div className="skeleton-text"></div>
                  <div className="skeleton-price"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="products">
      <div className="container">
        <h2 className="section-title">Featured Products</h2>
        
        <div className="category-filter">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
            >
              {category === 'all' ? 'All Products' : category}
            </button>
          ))}
        </div>

        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img src={product.image} alt={product.name} />
                <div className="product-overlay">
                  <button 
                    className="add-to-cart"
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-price">${product.price}</div>
                <div className="product-rating">
                  {[...Array(5)].map((_, i) => (
                    <i 
                      key={i} 
                      className={`fas fa-star ${i < Math.floor(product.rating) ? 'filled' : ''}`}
                    ></i>
                  ))}
                  <span>({product.rating})</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 