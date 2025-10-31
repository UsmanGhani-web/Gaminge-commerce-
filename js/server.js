const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// Database file path
const dbPath = path.join(__dirname, 'data', 'users.json');

// Ensure data directory exists
const ensureDataDir = () => {
    const dataDir = path.dirname(dbPath);
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
};

// Read users from JSON file
const readUsers = () => {
    try {
        if (fs.existsSync(dbPath)) {
            const data = fs.readFileSync(dbPath, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Error reading users:', error);
    }
    return { users: [] };
};

// Write users to JSON file
const writeUsers = (users) => {
    try {
        ensureDataDir();
        fs.writeFileSync(dbPath, JSON.stringify(users, null, 2));
    } catch (error) {
        console.error('Error writing users:', error);
    }
};

// Initialize default admin user if database is empty
const initializeDatabase = () => {
    const { users } = readUsers();
    if (users.length === 0) {
        const defaultUsers = [
            {
                id: '1',
                firstName: 'Admin',
                lastName: 'User',
                email: 'admin@gamingtechpro.com',
                password: 'admin123', // In production, this should be hashed
                createdAt: new Date().toISOString(),
                role: 'admin'
            }
        ];
        writeUsers({ users: defaultUsers });
        console.log('Database initialized with default admin user');
    }
};

// Routes

// Get all users (for admin purposes)
app.get('/api/users', (req, res) => {
    try {
        const { users } = readUsers();
        // Don't send passwords
        const safeUsers = users.map(user => {
            const { password, ...safeUser } = user;
            return safeUser;
        });
        res.json({ users: safeUsers });
    } catch (error) {
        res.status(500).json({ message: 'Error reading users' });
    }
});

// User registration
app.post('/api/auth/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        // Validation
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        // Check if user already exists
        const { users } = readUsers();
        const existingUser = users.find(user => user.email === email);
        
        if (existingUser) {
            return res.status(409).json({ message: 'User with this email already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create new user
        const newUser = {
            id: Date.now().toString(),
            firstName,
            lastName,
            email,
            password: hashedPassword,
            createdAt: new Date().toISOString(),
            role: 'user'
        };

        // Add user to database
        users.push(newUser);
        writeUsers({ users });

        // Return success (without password)
        const { password: _, ...userWithoutPassword } = newUser;
        
        res.status(201).json({ 
            message: 'User registered successfully',
            user: userWithoutPassword
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// User login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find user
        const { users } = readUsers();
        const user = users.find(u => u.email === email);
        
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: user.id, 
                email: user.email,
                role: user.role 
            },
            process.env.JWT_SECRET || 'your-secret-key-change-in-production',
            { expiresIn: '7d' }
        );

        // Return user data and token (without password)
        const { password: _, ...userWithoutPassword } = user;
        
        res.json({
            message: 'Login successful',
            user: userWithoutPassword,
            token
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Verify JWT token
app.post('/api/auth/verify', (req, res) => {
    try {
        const { token } = req.body;
        
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');
        res.json({ valid: true, user: decoded });
    } catch (error) {
        res.status(401).json({ valid: false, message: 'Invalid token' });
    }
});

// Serve the main pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'register.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Open http://localhost:${PORT} in your browser`);
    initializeDatabase();
}); 