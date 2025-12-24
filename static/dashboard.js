export function loadDashboard() {
    return `
        <div class="dashboard">
            <header class="dashboard-header">
                <div class="user-info">
                    <div class="user-avatar">
                       <img src="" alt="User Avatar">
                    </div>
                    <div class="user-details">
                        <h3>dupaxor@mailinator.com</h3>
                    </div>
                </div>
                <button class="logout-btn">Logout</button>
            </header>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon blue">📈</div>
                    <div class="stat-content">
                        <h4>Total XP</h4>
                        <span class="stat-value">39,411</span>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon green">🎯</div>
                    <div class="stat-content">
                        <h4>Audit Ratio</h4>
                        <span class="stat-value">0.88</span>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon purple">✅</div>
                    <div class="stat-content">
                        <h4>Projects Completed</h4>
                        <span class="stat-value">10</span>
                    </div>
                </div>
            </div>

            <div class="content-grid">
                <div class="user-info-card">
                    <h3>User Information</h3>
                    <div class="info-item">
                        <span class="info-icon">👤</span>
                        <div>
                            <strong>Username</strong>
                            <p>dupaxor@mailinator.com</p>
                        </div>
                    </div>
                    <div class="info-item">
                        <span class="info-icon">#</span>
                        <div>
                            <strong>Level</strong>
                            <span class="user-level">Level 39</span>
                        </div>
                    </div>
                    <div class="info-item">
                        <span class="info-icon">✉️</span>
                        <div>
                            <strong>Email</strong>
                            <p>dupaxor@mailinator.com@example.com</p>
                        </div>
                    </div>
                </div>

                <div class="chart-section">
                    <h3>Statistics</h3>
                    <div class="chart-container">
                        <h4>XP Progress Over Time</h4>
                        
                    </div>
                </div>
            </div>

            <div class="chart-section">
                <h3>Analytics</h3>
                <div class="chart-container">
                    <h4>Performance Metrics</h4>
                   
                </div>
            </div>
            
        </div>
    `;
}

