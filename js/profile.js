// Profile Page Functionality for Bestro Gaming
class ProfileManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        // Check authentication first
        if (!this.checkAuthentication()) {
            return;
        }
        
        this.loadUserData();
        this.setupEventListeners();
        this.loadProfileData();
    }

    // Check if user is authenticated
    checkAuthentication() {
        const user = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (!user || !token) {
            // User is not authenticated, redirect to login
            this.showMessage('Please login to access your profile', 'error');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
            return false;
        }
        
        return true;
    }

    // Load current user data
    loadUserData() {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                this.currentUser = JSON.parse(storedUser);
                this.updateProfileHeader();
            } catch (error) {
                console.error('Error parsing user data:', error);
                this.showMessage('Error loading user data', 'error');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
                return;
            }
        } else {
            // No user data found, redirect to login
            this.showMessage('Please login to access your profile', 'error');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
            return;
        }
    }

    // Update profile header with user information
    updateProfileHeader() {
        if (!this.currentUser) return;

        document.getElementById('profile-name').textContent = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
        document.getElementById('profile-email').textContent = this.currentUser.email;
        document.getElementById('profile-role').textContent = this.currentUser.role || 'User';
        
        // Update form fields
        document.getElementById('edit-first-name').value = this.currentUser.firstName || '';
        document.getElementById('edit-last-name').value = this.currentUser.lastName || '';
        document.getElementById('edit-phone').value = this.currentUser.phone || '';
        document.getElementById('edit-address').value = this.currentUser.address || '';
        document.getElementById('current-email').value = this.currentUser.email || '';
    }

    // Setup event listeners
    setupEventListeners() {
        // Tab switching
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
        });

        // Form submissions
        const changePasswordForm = document.getElementById('change-password-form');
        if (changePasswordForm) {
            changePasswordForm.addEventListener('submit', (e) => this.handleChangePassword(e));
        }

        const changeEmailForm = document.getElementById('change-email-form');
        if (changeEmailForm) {
            changeEmailForm.addEventListener('submit', (e) => this.handleChangeEmail(e));
        }

        const profileForm = document.getElementById('profile-form');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => this.handleProfileUpdate(e));
        }

        // Delete account button
        const deleteAccountBtn = document.getElementById('delete-account-btn');
        if (deleteAccountBtn) {
            deleteAccountBtn.addEventListener('click', () => this.handleDeleteAccount());
        }

        // Security toggles
        const twoFactorToggle = document.getElementById('2fa-toggle');
        if (twoFactorToggle) {
            twoFactorToggle.addEventListener('change', (e) => this.handleTwoFactorToggle(e));
        }

        const loginNotificationsToggle = document.getElementById('login-notifications');
        if (loginNotificationsToggle) {
            loginNotificationsToggle.addEventListener('change', (e) => this.handleLoginNotificationsToggle(e));
        }

        // Notification toggles
        const orderNotificationsToggle = document.getElementById('order-notifications');
        if (orderNotificationsToggle) {
            orderNotificationsToggle.addEventListener('change', (e) => this.handleOrderNotificationsToggle(e));
        }

        const promoNotificationsToggle = document.getElementById('promo-notifications');
        if (promoNotificationsToggle) {
            promoNotificationsToggle.addEventListener('change', (e) => this.handlePromoNotificationsToggle(e));
        }

        const newsletterToggle = document.getElementById('newsletter-notifications');
        if (newsletterToggle) {
            newsletterToggle.addEventListener('change', (e) => this.handleNewsletterToggle(e));
        }
    }

    // Switch between tabs
    switchTab(tabName) {
        // Hide all tab content
        const tabContents = document.querySelectorAll('.tab-content');
        tabContents.forEach(content => content.classList.remove('active'));

        // Remove active class from all tab buttons
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => btn.classList.remove('active'));

        // Show selected tab content
        const selectedContent = document.getElementById(`${tabName}-content`);
        if (selectedContent) {
            selectedContent.classList.add('active');
        }

        // Add active class to selected tab button
        const selectedBtn = document.querySelector(`[data-tab="${tabName}"]`);
        if (selectedBtn) {
            selectedBtn.classList.add('active');
        }

        // Load specific tab data
        this.loadTabData(tabName);
    }

    // Load data for specific tabs
    loadTabData(tabName) {
        switch (tabName) {
            case 'overview':
                this.loadOverviewData();
                break;
            case 'orders':
                this.loadOrdersData();
                break;
            case 'payments':
                this.loadPaymentsData();
                break;
            case 'security':
                this.loadSecurityData();
                break;
            case 'settings':
                this.loadSettingsData();
                break;
        }
    }

    // Load overview data
    loadOverviewData() {
        // Load user statistics
        this.loadUserStats();
        // Load recent activity
        this.loadRecentActivity();
    }

    // Load user statistics
    loadUserStats() {
        // Get user data from localStorage
        const userData = this.currentUser;
        
        // Get orders and payments data from cart (if exists)
        const cart = JSON.parse(localStorage.getItem('gamingCart') || '[]');
        const userOrders = cart.filter(item => item.userId === userData.id || !item.userId); // Include items without userId for demo
        
        // Calculate totals
        const totalOrders = userOrders.length;
        const totalSpent = userOrders.reduce((sum, order) => sum + (parseFloat(order.price) || 0), 0);
        
        // Update statistics with proper formatting
        const totalOrdersElement = document.getElementById('total-orders');
        const totalSpentElement = document.getElementById('total-spent');
        const memberSinceElement = document.getElementById('member-since');
        const lastLoginElement = document.getElementById('last-login');
        
        if (totalOrdersElement) {
            totalOrdersElement.textContent = totalOrders;
        }
        
        if (totalSpentElement) {
            totalSpentElement.textContent = totalSpent > 0 ? `$${totalSpent.toFixed(2)}` : '$0.00';
        }
        
        // Format member since date properly
        if (memberSinceElement) {
            if (userData.createdAt) {
                try {
                    const createdDate = new Date(userData.createdAt);
                    if (!isNaN(createdDate.getTime())) {
                        memberSinceElement.textContent = createdDate.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        });
                    } else {
                        memberSinceElement.textContent = 'Today';
                    }
                } catch (error) {
                    console.error('Error parsing created date:', error);
                    memberSinceElement.textContent = 'Today';
                }
            } else {
                memberSinceElement.textContent = 'Today';
            }
        }
        
        // Format last login date properly
        if (lastLoginElement) {
            const lastLogin = localStorage.getItem('last_login');
            if (lastLogin && lastLogin !== 'Today') {
                try {
                    const loginDate = new Date(lastLogin);
                    if (!isNaN(loginDate.getTime())) {
                        lastLoginElement.textContent = loginDate.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        });
                    } else {
                        lastLoginElement.textContent = 'Today';
                    }
                } catch (error) {
                    console.error('Error parsing last login date:', error);
                    lastLoginElement.textContent = 'Today';
                }
            } else {
                lastLoginElement.textContent = 'Today';
            }
        }
        
        // Add some demo data for better user experience
        if (totalOrders === 0) {
            // Show some demo statistics for new users
            if (totalOrdersElement) totalOrdersElement.textContent = '0';
            if (totalSpentElement) totalSpentElement.textContent = '$0.00';
        }
        
        // Ensure all statistics are properly formatted and aligned
        this.formatStatistics();
    }

    // Format statistics for better display
    formatStatistics() {
        const statNumbers = document.querySelectorAll('.stat-number');
        const statLabels = document.querySelectorAll('.stat-label');
        
        // Ensure all numbers are properly formatted
        statNumbers.forEach(number => {
            if (number.textContent.includes('$')) {
                // Format currency
                const value = parseFloat(number.textContent.replace('$', ''));
                if (!isNaN(value)) {
                    number.textContent = `$${value.toFixed(2)}`;
                }
            } else if (number.textContent.includes('/')) {
                // Format dates
                try {
                    const date = new Date(number.textContent);
                    if (!isNaN(date.getTime())) {
                        number.textContent = date.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        });
                    }
                } catch (error) {
                    // Keep original text if date parsing fails
                }
            }
        });
        
        // Ensure all labels are properly formatted
        statLabels.forEach(label => {
            label.textContent = label.textContent.trim();
        });
    }

    // Load recent activity
    loadRecentActivity() {
        const activityList = document.getElementById('recent-activity');
        if (!activityList) return;

        // Get real activity data from localStorage
        const activities = JSON.parse(localStorage.getItem('user_activities') || '[]');

        // Clear existing activities
        activityList.innerHTML = '';

        if (activities.length === 0) {
            // Show only account creation activity if no other activities
            const activityItem = document.createElement('div');
            activityItem.className = 'activity-item';
            activityItem.innerHTML = `
                <i class="fas fa-user-plus"></i>
                <span>Account created successfully</span>
                <small>Just now</small>
            `;
            activityList.appendChild(activityItem);
        } else {
            // Add real activities
            activities.forEach(activity => {
                const activityItem = document.createElement('div');
                activityItem.className = 'activity-item';
                activityItem.innerHTML = `
                    <i class="${activity.icon}"></i>
                    <span>${activity.text}</span>
                    <small>${activity.time}</small>
                `;
                activityList.appendChild(activityItem);
            });
        }
    }

    // Load orders data
    loadOrdersData() {
        const ordersList = document.getElementById('orders-list');
        if (!ordersList) return;

        // Get orders from cart (if exists)
        const cart = JSON.parse(localStorage.getItem('gamingCart') || '[]');
        const userOrders = cart.filter(item => item.userId === this.currentUser.id || !item.userId); // Include items without userId for demo

        if (userOrders.length === 0) {
            ordersList.innerHTML = `
                <div class="no-orders">
                    <i class="fas fa-shopping-bag"></i>
                    <p>No orders yet</p>
                    <a href="products.html" class="btn btn-primary">Start Shopping</a>
                </div>
            `;
        } else {
            // Display orders
            this.displayOrders(userOrders);
        }
    }

    // Display orders
    displayOrders(orders) {
        const ordersList = document.getElementById('orders-list');
        if (!ordersList) return;

        ordersList.innerHTML = '';

        orders.forEach((order, index) => {
            const orderItem = document.createElement('div');
            orderItem.className = 'order-item';
            orderItem.innerHTML = `
                <div class="order-header">
                    <h4>Order #${order.id || `DEMO-${index + 1}`}</h4>
                    <span class="order-status ${order.status || 'pending'}">${order.status || 'Pending'}</span>
                </div>
                <div class="order-details">
                    <p>Date: ${new Date().toLocaleDateString()}</p>
                    <p>Total: $${order.price || 0}</p>
                    <p>Item: ${order.name || 'Custom PC'}</p>
                </div>
            `;
            ordersList.appendChild(orderItem);
        });
    }

    // Load payments data
    loadPaymentsData() {
        const paymentsList = document.getElementById('payments-list');
        if (!paymentsList) return;

        // Get payments from cart (if exists)
        const cart = JSON.parse(localStorage.getItem('gamingCart') || '[]');
        const userPayments = cart.filter(item => item.userId === this.currentUser.id || !item.userId); // Include items without userId for demo

        if (userPayments.length === 0) {
            paymentsList.innerHTML = `
                <div class="no-payments">
                    <i class="fas fa-credit-card"></i>
                    <p>No payment history yet</p>
                </div>
            `;
        } else {
            // Display payments
            this.displayPayments(userPayments);
        }
    }

    // Display payments
    displayPayments(payments) {
        const paymentsList = document.getElementById('payments-list');
        if (!paymentsList) return;

        paymentsList.innerHTML = '';

        payments.forEach((payment, index) => {
            const paymentItem = document.createElement('div');
            paymentItem.className = 'payment-item';
            paymentItem.innerHTML = `
                <div class="payment-header">
                    <h4>Payment #${payment.id || `DEMO-${index + 1}`}</h4>
                    <span class="payment-amount">$${payment.price || 0}</span>
                </div>
                <div class="payment-details">
                    <p>Date: ${new Date().toLocaleDateString()}</p>
                    <p>Method: Credit Card</p>
                    <p>Item: ${payment.name || 'Custom PC'}</p>
                </div>
            `;
            paymentsList.appendChild(paymentItem);
        });
    }

    // Load security data
    loadSecurityData() {
        // Load security preferences from localStorage
        const twoFactorEnabled = localStorage.getItem('2fa_enabled') === 'true';
        const loginNotificationsEnabled = localStorage.getItem('login_notifications') !== 'false';

        // Update toggles
        const twoFactorToggle = document.getElementById('2fa-toggle');
        if (twoFactorToggle) {
            twoFactorToggle.checked = twoFactorEnabled;
        }

        const loginNotificationsToggle = document.getElementById('login-notifications');
        if (loginNotificationsToggle) {
            loginNotificationsToggle.checked = loginNotificationsEnabled;
        }
    }

    // Load settings data
    loadSettingsData() {
        // Load notification preferences from localStorage
        const orderNotifications = localStorage.getItem('order_notifications') !== 'false';
        const promoNotifications = localStorage.getItem('promo_notifications') === 'true';
        const newsletterNotifications = localStorage.getItem('newsletter_notifications') === 'true';

        // Update toggles
        const orderNotificationsToggle = document.getElementById('order-notifications');
        if (orderNotificationsToggle) {
            orderNotificationsToggle.checked = orderNotifications;
        }

        const promoNotificationsToggle = document.getElementById('promo-notifications');
        if (promoNotificationsToggle) {
            promoNotificationsToggle.checked = promoNotifications;
        }

        const newsletterToggle = document.getElementById('newsletter-notifications');
        if (newsletterToggle) {
            newsletterToggle.checked = newsletterNotifications;
        }
    }

    // Handle password change
    async handleChangePassword(e) {
        e.preventDefault();
        
        const form = e.target;
        const currentPassword = form.currentPassword.value;
        const newPassword = form.newPassword.value;
        const confirmPassword = form.confirmNewPassword.value;

        // Validation
        if (newPassword !== confirmPassword) {
            this.showMessage('New passwords do not match', 'error');
            return;
        }

        if (newPassword.length < 6) {
            this.showMessage('Password must be at least 6 characters long', 'error');
            return;
        }

        try {
            // Update user data in localStorage
            this.currentUser.password = newPassword; // In real app, this would be hashed
            localStorage.setItem('user', JSON.stringify(this.currentUser));
            
            // Also update in users list if exists
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const userIndex = users.findIndex(u => u.id === this.currentUser.id);
            if (userIndex !== -1) {
                users[userIndex].password = newPassword;
                localStorage.setItem('users', JSON.stringify(users));
            }
            
            // Add to recent activity
            this.addActivity('Password changed successfully', 'fas fa-key');
            
            this.showMessage('Password changed successfully', 'success');
            form.reset();
            
        } catch (error) {
            this.showMessage('Failed to change password', 'error');
        }
    }

    // Handle email change
    async handleChangeEmail(e) {
        e.preventDefault();
        
        const form = e.target;
        const newEmail = form.newEmail.value;
        const password = form.emailPassword.value;

        // Validation
        if (!newEmail || !password) {
            this.showMessage('Please fill in all fields', 'error');
            return;
        }

        try {
            // Update user data in localStorage
            this.currentUser.email = newEmail;
            localStorage.setItem('user', JSON.stringify(this.currentUser));
            
            // Also update in users list if exists
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const userIndex = users.findIndex(u => u.id === this.currentUser.id);
            if (userIndex !== -1) {
                users[userIndex].email = newEmail;
                localStorage.setItem('users', JSON.stringify(users));
            }
            
            // Update profile header
            this.updateProfileHeader();
            
            // Add to recent activity
            this.addActivity('Email changed successfully', 'fas fa-envelope');
            
            this.showMessage('Email changed successfully', 'success');
            form.reset();
            
        } catch (error) {
            this.showMessage('Failed to change email', 'error');
        }
    }

    // Handle profile update
    async handleProfileUpdate(e) {
        e.preventDefault();
        
        const form = e.target;
        const firstName = form.firstName.value;
        const lastName = form.lastName.value;
        const phone = form.phone.value;
        const address = form.address.value;

        try {
            // Update user data in localStorage
            this.currentUser.firstName = firstName;
            this.currentUser.lastName = lastName;
            this.currentUser.phone = phone;
            this.currentUser.address = address;
            
            localStorage.setItem('user', JSON.stringify(this.currentUser));
            
            // Also update in users list if exists
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const userIndex = users.findIndex(u => u.id === this.currentUser.id);
            if (userIndex !== -1) {
                users[userIndex] = { ...users[userIndex], ...this.currentUser };
                localStorage.setItem('users', JSON.stringify(users));
            }
            
            // Update profile header
            this.updateProfileHeader();
            
            // Add to recent activity
            this.addActivity('Profile information updated', 'fas fa-user-edit');
            
            this.showMessage('Profile updated successfully', 'success');
            
        } catch (error) {
            this.showMessage('Failed to update profile', 'error');
        }
    }

    // Handle delete account
    handleDeleteAccount() {
        if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            // Clear user data
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            
            // Remove from users list if exists
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const updatedUsers = users.filter(u => u.id !== this.currentUser.id);
            localStorage.setItem('users', JSON.stringify(updatedUsers));
            
            // Clear cart if exists
            localStorage.removeItem('gamingCart');
            
            this.showMessage('Account deleted successfully', 'success');
            
            // Redirect to home page
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        }
    }

    // Handle two-factor authentication toggle
    handleTwoFactorToggle(e) {
        const enabled = e.target.checked;
        localStorage.setItem('2fa_enabled', enabled);
        
        if (enabled) {
            this.showMessage('Two-factor authentication enabled', 'success');
        } else {
            this.showMessage('Two-factor authentication disabled', 'info');
        }
    }

    // Handle login notifications toggle
    handleLoginNotificationsToggle(e) {
        const enabled = e.target.checked;
        localStorage.setItem('login_notifications', enabled);
    }

    // Handle order notifications toggle
    handleOrderNotificationsToggle(e) {
        const enabled = e.target.checked;
        localStorage.setItem('order_notifications', enabled);
    }

    // Handle promotional notifications toggle
    handlePromoNotificationsToggle(e) {
        const enabled = e.target.checked;
        localStorage.setItem('promo_notifications', enabled);
    }

    // Handle newsletter toggle
    handleNewsletterToggle(e) {
        const enabled = e.target.checked;
        localStorage.setItem('newsletter_notifications', enabled);
    }

    // Add activity to recent activity list
    addActivity(text, icon) {
        const activityList = document.getElementById('recent-activity');
        if (!activityList) return;

        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        activityItem.innerHTML = `
            <i class="${icon}"></i>
            <span>${text}</span>
            <small>Just now</small>
        `;

        // Insert at the top
        activityList.insertBefore(activityItem, activityList.firstChild);
        
        // Remove old activities if more than 5
        const activities = activityList.querySelectorAll('.activity-item');
        if (activities.length > 5) {
            activities[activities.length - 1].remove();
        }
    }

    // Show message
    showMessage(message, type) {
        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        // Add to page
        document.body.appendChild(messageDiv);

        // Show message
        setTimeout(() => messageDiv.classList.add('show'), 100);

        // Remove message after 5 seconds
        setTimeout(() => {
            messageDiv.classList.remove('show');
            setTimeout(() => messageDiv.remove(), 300);
        }, 5000);
    }

    // Load profile data
    loadProfileData() {
        // Load initial data for overview tab
        this.loadOverviewData();
    }
}

// Initialize profile manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.profileManager = new ProfileManager();
});

// Add message styles
const messageStyles = document.createElement('style');
messageStyles.textContent = `
    .message {
        position: fixed;
        top: 100px;
        right: 20px;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border-radius: 10px;
        padding: 15px 20px;
        color: white;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .message.show {
        transform: translateX(0);
    }

    .message-success {
        border-color: #10b981;
        background: rgba(16, 185, 129, 0.2);
    }

    .message-error {
        border-color: #ef4444;
        background: rgba(239, 68, 68, 0.2);
    }

    .message-info {
        border-color: #3b82f6;
        background: rgba(59, 130, 246, 0.2);
    }

    .message i {
        font-size: 1.2rem;
    }

    .message-success i {
        color: #10b981;
    }

    .message-error i {
        color: #ef4444;
    }

    .message-info i {
        color: #3b82f6;
    }
`;
document.head.appendChild(messageStyles); 