'use client';

import { useState, useEffect } from 'react';

interface Component {
  id: string;
  name: string;
  price: number;
  image: string;
  specs: Record<string, string>;
}

export default function Components() {
  const [components, setComponents] = useState<Record<string, Component[]>>({});
  const [activeTab, setActiveTab] = useState('cpu');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComponents();
  }, []);

  const fetchComponents = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/components');
      const data = await response.json();
      setComponents(data);
    } catch (error) {
      console.error('Error fetching components:', error);
      // Fallback data
      setComponents({
        cpu: [
          {
            id: "cpu1",
            name: "Intel Core i9-13900K",
            price: 569.99,
            image: "https://via.placeholder.com/200x150/1e3a8a/ffffff?text=Intel+i9",
            specs: { cores: "24 cores", boost: "5.8GHz", tdp: "253W" }
          },
          {
            id: "cpu2",
            name: "AMD Ryzen 9 7950X",
            price: 699.99,
            image: "https://via.placeholder.com/200x150/1e3a8a/ffffff?text=AMD+7950X",
            specs: { cores: "16 cores", boost: "5.7GHz", tdp: "170W" }
          }
        ],
        gpu: [
          {
            id: "gpu1",
            name: "NVIDIA RTX 4090",
            price: 1599.99,
            image: "https://via.placeholder.com/200x150/1e3a8a/ffffff?text=RTX+4090",
            specs: { memory: "24GB GDDR6X", boost: "2.52GHz", tdp: "450W" }
          },
          {
            id: "gpu2",
            name: "AMD RX 7900 XTX",
            price: 999.99,
            image: "https://via.placeholder.com/200x150/1e3a8a/ffffff?text=RX+7900",
            specs: { memory: "24GB GDDR6", boost: "2.5GHz", tdp: "355W" }
          }
        ],
        ram: [
          {
            id: "ram1",
            name: "32GB DDR5-6000",
            price: 199.99,
            image: "https://via.placeholder.com/200x150/1e3a8a/ffffff?text=32GB+DDR5",
            specs: { capacity: "32GB", speed: "6000MHz", latency: "CL36" }
          },
          {
            id: "ram2",
            name: "64GB DDR5-6000",
            price: 399.99,
            image: "https://via.placeholder.com/200x150/1e3a8a/ffffff?text=64GB+DDR5",
            specs: { capacity: "64GB", speed: "6000MHz", latency: "CL36" }
          }
        ],
        storage: [
          {
            id: "storage1",
            name: "2TB NVMe SSD",
            price: 199.99,
            image: "https://via.placeholder.com/200x150/1e3a8a/ffffff?text=2TB+NVMe",
            specs: { capacity: "2TB", interface: "PCIe 4.0", read: "7000MB/s" }
          },
          {
            id: "storage2",
            name: "4TB NVMe SSD",
            price: 399.99,
            image: "https://via.placeholder.com/200x150/1e3a8a/ffffff?text=4TB+NVMe",
            specs: { capacity: "4TB", interface: "PCIe 4.0", read: "7000MB/s" }
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'cpu', label: 'CPU', icon: 'fas fa-microchip' },
    { id: 'gpu', label: 'GPU', icon: 'fas fa-tv' },
    { id: 'ram', label: 'RAM', icon: 'fas fa-memory' },
    { id: 'storage', label: 'Storage', icon: 'fas fa-hdd' }
  ];

  if (loading) {
    return (
      <section id="components" className="components">
        <div className="container">
          <h2 className="section-title">PC Components</h2>
          <div className="loading-skeleton">
            <div className="skeleton-tabs"></div>
            <div className="skeleton-components"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="components" className="components">
      <div className="container">
        <h2 className="section-title">PC Components</h2>
        
        <div className="components-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            >
              <i className={tab.icon}></i>
              {tab.label}
            </button>
          ))}
        </div>
        
        <div className="tab-content active">
          <div className="components-grid">
            {components[activeTab]?.map((component) => (
              <div key={component.id} className="component-item">
                <img src={component.image} alt={component.name} />
                <h3>{component.name}</h3>
                <div className="component-specs">
                  {Object.entries(component.specs).map(([key, value]) => (
                    <div key={key} className="spec-item">
                      <span className="spec-label">{key}:</span>
                      <span className="spec-value">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="component-price">${component.price}</div>
                <button className="btn btn-secondary">Add to Build</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 