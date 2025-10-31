const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Mock Database
const products = [
  {
    id: 1,
    name: "Razer DeathAdder V3 Pro",
    category: "Mouse",
    price: 149.99,
    rating: 4.8,
    image: "https://via.placeholder.com/300x200/1e3a8a/ffffff?text=Gaming+Mouse",
    description: "Wireless gaming mouse with 30K DPI sensor and 70-hour battery life",
    specs: {
      dpi: "30,000 DPI",
      battery: "70 hours",
      weight: "63g",
      connectivity: "Wireless"
    }
  },
  {
    id: 2,
    name: "Corsair K100 RGB",
    category: "Keyboard",
    price: 229.99,
    rating: 4.9,
    image: "https://via.placeholder.com/300x200/1e3a8a/ffffff?text=Gaming+Keyboard",
    description: "Mechanical gaming keyboard with Cherry MX switches and RGB lighting",
    specs: {
      switches: "Cherry MX",
      layout: "Full-size",
      lighting: "RGB",
      connectivity: "USB-C"
    }
  },
  {
    id: 3,
    name: "SteelSeries Arctis Pro",
    category: "Headset",
    price: 179.99,
    rating: 4.7,
    image: "https://via.placeholder.com/300x200/1e3a8a/ffffff?text=Gaming+Headset",
    description: "Premium gaming headset with Hi-Res audio and ClearCast microphone",
    specs: {
      audio: "Hi-Res",
      microphone: "ClearCast",
      connectivity: "Wireless + Wired",
      battery: "20 hours"
    }
  },
  {
    id: 4,
    name: "ASUS ROG Swift PG279Q",
    category: "Monitor",
    price: 599.99,
    rating: 4.6,
    image: "https://via.placeholder.com/300x200/1e3a8a/ffffff?text=Gaming+Monitor",
    description: "27\" 1440p 165Hz IPS gaming monitor with G-Sync",
    specs: {
      resolution: "2560x1440",
      refresh: "165Hz",
      panel: "IPS",
      sync: "G-Sync"
    }
  },
  {
    id: 5,
    name: "Logitech G Pro X",
    category: "Mouse",
    price: 129.99,
    rating: 4.5,
    image: "https://via.placeholder.com/300x200/1e3a8a/ffffff?text=Gaming+Mouse",
    description: "Lightweight wireless gaming mouse with HERO sensor",
    specs: {
      dpi: "25,600 DPI",
      battery: "60 hours",
      weight: "63g",
      connectivity: "Wireless"
    }
  },
  {
    id: 6,
    name: "HyperX Alloy Origins",
    category: "Keyboard",
    price: 89.99,
    rating: 4.4,
    image: "https://via.placeholder.com/300x200/1e3a8a/ffffff?text=Gaming+Keyboard",
    description: "Compact mechanical keyboard with HyperX switches",
    specs: {
      switches: "HyperX Red",
      layout: "TKL",
      lighting: "RGB",
      connectivity: "USB-C"
    }
  }
];

const components = {
  cpu: [
    {
      id: "cpu1",
      name: "Intel Core i9-13900K",
      price: 569.99,
      image: "https://via.placeholder.com/200x150/1e3a8a/ffffff?text=Intel+i9",
      specs: {
        cores: "24 cores",
        threads: "32 threads",
        boost: "5.8GHz",
        tdp: "253W"
      }
    },
    {
      id: "cpu2",
      name: "AMD Ryzen 9 7950X",
      price: 699.99,
      image: "https://via.placeholder.com/200x150/1e3a8a/ffffff?text=AMD+7950X",
      specs: {
        cores: "16 cores",
        threads: "32 threads",
        boost: "5.7GHz",
        tdp: "170W"
      }
    },
    {
      id: "cpu3",
      name: "Intel Core i7-13700K",
      price: 399.99,
      image: "https://via.placeholder.com/200x150/1e3a8a/ffffff?text=Intel+i7",
      specs: {
        cores: "16 cores",
        threads: "24 threads",
        boost: "5.4GHz",
        tdp: "253W"
      }
    }
  ],
  gpu: [
    {
      id: "gpu1",
      name: "NVIDIA RTX 4090",
      price: 1599.99,
      image: "https://via.placeholder.com/200x150/1e3a8a/ffffff?text=RTX+4090",
      specs: {
        memory: "24GB GDDR6X",
        boost: "2.52GHz",
        tdp: "450W",
        features: "Ray Tracing, DLSS 3.0"
      }
    },
    {
      id: "gpu2",
      name: "AMD RX 7900 XTX",
      price: 999.99,
      image: "https://via.placeholder.com/200x150/1e3a8a/ffffff?text=RX+7900",
      specs: {
        memory: "24GB GDDR6",
        boost: "2.5GHz",
        tdp: "355W",
        features: "FSR 3.0, Ray Tracing"
      }
    },
    {
      id: "gpu3",
      name: "NVIDIA RTX 4080",
      price: 1199.99,
      image: "https://via.placeholder.com/200x150/1e3a8a/ffffff?text=RTX+4080",
      specs: {
        memory: "16GB GDDR6X",
        boost: "2.51GHz",
        tdp: "320W",
        features: "Ray Tracing, DLSS 3.0"
      }
    }
  ],
  ram: [
    {
      id: "ram1",
      name: "32GB DDR5-6000",
      price: 199.99,
      image: "https://via.placeholder.com/200x150/1e3a8a/ffffff?text=32GB+DDR5",
      specs: {
        capacity: "32GB",
        speed: "6000MHz",
        latency: "CL36",
        modules: "2x16GB"
      }
    },
    {
      id: "ram2",
      name: "64GB DDR5-6000",
      price: 399.99,
      image: "https://via.placeholder.com/200x150/1e3a8a/ffffff?text=64GB+DDR5",
      specs: {
        capacity: "64GB",
        speed: "6000MHz",
        latency: "CL36",
        modules: "2x32GB"
      }
    },
    {
      id: "ram3",
      name: "16GB DDR5-6000",
      price: 99.99,
      image: "https://via.placeholder.com/200x150/1e3a8a/ffffff?text=16GB+DDR5",
      specs: {
        capacity: "16GB",
        speed: "6000MHz",
        latency: "CL36",
        modules: "2x8GB"
      }
    }
  ],
  storage: [
    {
      id: "storage1",
      name: "2TB NVMe SSD",
      price: 199.99,
      image: "https://via.placeholder.com/200x150/1e3a8a/ffffff?text=2TB+NVMe",
      specs: {
        capacity: "2TB",
        interface: "PCIe 4.0",
        read: "7000MB/s",
        write: "5300MB/s"
      }
    },
    {
      id: "storage2",
      name: "4TB NVMe SSD",
      price: 399.99,
      image: "https://via.placeholder.com/200x150/1e3a8a/ffffff?text=4TB+NVMe",
      specs: {
        capacity: "4TB",
        interface: "PCIe 4.0",
        read: "7000MB/s",
        write: "5300MB/s"
      }
    },
    {
      id: "storage3",
      name: "1TB NVMe SSD",
      price: 99.99,
      image: "https://via.placeholder.com/200x150/1e3a8a/ffffff?text=1TB+NVMe",
      specs: {
        capacity: "1TB",
        interface: "PCIe 4.0",
        read: "7000MB/s",
        write: "5300MB/s"
      }
    }
  ]
};

// Routes
app.get('/api/products', (req, res) => {
  const { category } = req.query;
  if (category) {
    const filtered = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    res.json(filtered);
  } else {
    res.json(products);
  }
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

app.get('/api/components', (req, res) => {
  res.json(components);
});

app.get('/api/components/:type', (req, res) => {
  const type = req.params.type.toLowerCase();
  if (components[type]) {
    res.json(components[type]);
  } else {
    res.status(404).json({ message: 'Component type not found' });
  }
});

app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  
  // Simulate sending email
  console.log('Contact form submission:', { name, email, subject, message });
  
  res.json({ 
    message: 'Message sent successfully! We\'ll get back to you soon.',
    timestamp: new Date().toISOString()
  });
});

app.post('/api/build-pc', (req, res) => {
  const { cpu, gpu, ram, storage } = req.body;
  
  if (!cpu || !gpu || !ram || !storage) {
    return res.status(400).json({ message: 'All components are required' });
  }
  
  // Calculate total price
  const totalPrice = cpu.price + gpu.price + ram.price + storage.price;
  
  // Determine performance tier
  let performance = 'Basic';
  if (totalPrice >= 3000) performance = 'Ultra 4K Gaming';
  else if (totalPrice >= 2000) performance = 'High 1440p Gaming';
  else if (totalPrice >= 1000) performance = 'Medium 1080p Gaming';
  
  res.json({
    message: 'PC Build created successfully!',
    build: { cpu, gpu, ram, storage },
    totalPrice: totalPrice.toFixed(2),
    performance,
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Gaming PC Store Backend running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
}); 