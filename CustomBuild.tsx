'use client';

import { useState, useEffect } from 'react';

interface Component {
  id: string;
  name: string;
  price: number;
  image: string;
  specs: Record<string, string>;
}

interface Build {
  cpu: Component | null;
  gpu: Component | null;
  ram: Component | null;
  storage: Component | null;
}

export default function CustomBuild() {
  const [components, setComponents] = useState<Record<string, Component[]>>({});
  const [selectedBuild, setSelectedBuild] = useState<Build>({
    cpu: null,
    gpu: null,
    ram: null,
    storage: null
  });
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
            specs: { cores: "24 cores", boost: "5.8GHz" }
          }
        ],
        gpu: [
          {
            id: "gpu1",
            name: "NVIDIA RTX 4090",
            price: 1599.99,
            image: "https://via.placeholder.com/200x150/1e3a8a/ffffff?text=RTX+4090",
            specs: { memory: "24GB GDDR6X", boost: "2.52GHz" }
          }
        ],
        ram: [
          {
            id: "ram1",
            name: "32GB DDR5-6000",
            price: 199.99,
            image: "https://via.placeholder.com/200x150/1e3a8a/ffffff?text=32GB+DDR5",
            specs: { capacity: "32GB", speed: "6000MHz" }
          }
        ],
        storage: [
          {
            id: "storage1",
            name: "2TB NVMe SSD",
            price: 199.99,
            image: "https://via.placeholder.com/200x150/1e3a8a/ffffff?text=2TB+NVMe",
            specs: { capacity: "2TB", interface: "PCIe 4.0" }
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const selectComponent = (type: keyof Build, component: Component) => {
    setSelectedBuild(prev => ({
      ...prev,
      [type]: component
    }));
  };

  const calculateTotalPrice = () => {
    return Object.values(selectedBuild).reduce((total, component) => {
      return total + (component?.price || 0);
    }, 0);
  };

  const getPerformanceTier = (totalPrice: number) => {
    if (totalPrice >= 3000) return 'Ultra 4K Gaming';
    if (totalPrice >= 2000) return 'High 1440p Gaming';
    if (totalPrice >= 1000) return 'Medium 1080p Gaming';
    return 'Basic Gaming';
  };

  const buildPC = async () => {
    if (!selectedBuild.cpu || !selectedBuild.gpu || !selectedBuild.ram || !selectedBuild.storage) {
      alert('Please select all components before building your PC!');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/build-pc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedBuild),
      });

      const result = await response.json();
      alert(`PC Build created successfully!\nTotal Price: $${result.totalPrice}\nPerformance: ${result.performance}`);
    } catch (error) {
      console.error('Error building PC:', error);
      const totalPrice = calculateTotalPrice();
      const performance = getPerformanceTier(totalPrice);
      alert(`PC Build created successfully!\nTotal Price: $${totalPrice.toFixed(2)}\nPerformance: ${performance}`);
    }
  };

  if (loading) {
    return (
      <section id="custom-build" className="custom-build">
        <div className="container">
          <h2 className="section-title">Custom PC Builder</h2>
          <div className="loading-skeleton">
            <div className="skeleton-builder"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="custom-build" className="custom-build">
      <div className="container">
        <h2 className="section-title">Custom PC Builder</h2>
        
        <div className="builder-container">
          <div className="builder-sidebar">
            <h3>Select Components</h3>
            
            <div className="component-category">
              <h4>Processor (CPU)</h4>
              <select 
                onChange={(e) => {
                  const component = components.cpu?.find(c => c.id === e.target.value);
                  selectComponent('cpu', component || null);
                }}
                value={selectedBuild.cpu?.id || ''}
              >
                <option value="">Select CPU</option>
                {components.cpu?.map(component => (
                  <option key={component.id} value={component.id}>
                    {component.name} - ${component.price}
                  </option>
                ))}
              </select>
            </div>

            <div className="component-category">
              <h4>Graphics Card (GPU)</h4>
              <select 
                onChange={(e) => {
                  const component = components.gpu?.find(c => c.id === e.target.value);
                  selectComponent('gpu', component || null);
                }}
                value={selectedBuild.gpu?.id || ''}
              >
                <option value="">Select GPU</option>
                {components.gpu?.map(component => (
                  <option key={component.id} value={component.id}>
                    {component.name} - ${component.price}
                  </option>
                ))}
              </select>
            </div>

            <div className="component-category">
              <h4>Memory (RAM)</h4>
              <select 
                onChange={(e) => {
                  const component = components.ram?.find(c => c.id === e.target.value);
                  selectComponent('ram', component || null);
                }}
                value={selectedBuild.ram?.id || ''}
              >
                <option value="">Select RAM</option>
                {components.ram?.map(component => (
                  <option key={component.id} value={component.id}>
                    {component.name} - ${component.price}
                  </option>
                ))}
              </select>
            </div>

            <div className="component-category">
              <h4>Storage</h4>
              <select 
                onChange={(e) => {
                  const component = components.storage?.find(c => c.id === e.target.value);
                  selectComponent('storage', component || null);
                }}
                value={selectedBuild.storage?.id || ''}
              >
                <option value="">Select Storage</option>
                {components.storage?.map(component => (
                  <option key={component.id} value={component.id}>
                    {component.name} - ${component.price}
                  </option>
                ))}
              </select>
            </div>

            <button 
              className="btn btn-primary build-pc-btn"
              onClick={buildPC}
              disabled={!selectedBuild.cpu || !selectedBuild.gpu || !selectedBuild.ram || !selectedBuild.storage}
            >
              Build PC
            </button>
          </div>

          <div className="builder-preview">
            <div className="pc-case">
              <div className="case-fans">
                <div className="fan"></div>
                <div className="fan"></div>
                <div className="fan"></div>
              </div>
              <div className="gpu-slot"></div>
              <div className="cpu-slot"></div>
              <div className="ram-slots">
                <div className="ram-stick"></div>
                <div className="ram-stick"></div>
              </div>
            </div>
            
            <div className="specs-display">
              <h4>Total Price: ${calculateTotalPrice().toFixed(2)}</h4>
              <p>Estimated Performance: {getPerformanceTier(calculateTotalPrice())}</p>
              
              {selectedBuild.cpu && (
                <div className="selected-component">
                  <strong>CPU:</strong> {selectedBuild.cpu.name}
                </div>
              )}
              {selectedBuild.gpu && (
                <div className="selected-component">
                  <strong>GPU:</strong> {selectedBuild.gpu.name}
                </div>
              )}
              {selectedBuild.ram && (
                <div className="selected-component">
                  <strong>RAM:</strong> {selectedBuild.ram.name}
                </div>
              )}
              {selectedBuild.storage && (
                <div className="selected-component">
                  <strong>Storage:</strong> {selectedBuild.storage.name}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 