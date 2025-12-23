export function loadForm() {
return  `
        <div class="form-container">
            <div class="form-card">
                <div class="form-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M15 3H6C4.9 3 4 3.9 4 5V19C4 20.1 4.9 21 6 21H18C19.1 21 20 20.1 20 19V8L15 3Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M14 3V9H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <h2>GraphQL Profile</h2>
                <p>Sign in to view your profile and statistics</p>
                
                <form class="login-form" id="loginForm">
                    <div class="form-group">
                        <label for="username">Username or Email</label>
                        <input type="text" id="username" name="username" placeholder="Enter your username or email" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" name="password" placeholder="Enter your password" required>
                    </div>
                    
                    <div class="error-message" id="errorMessage"></div>
                    
                    <button type="submit" class="submit-btn" id="submitBtn">Sign In</button>
                </form>
            </div>
        </div>
    `;
}