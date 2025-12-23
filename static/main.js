import { loadForm } from './form.js';
import { login, graphqlQuery } from './auth.js';
import { loadDashboard } from './dashboard.js';
import { queries } from './getdata.js';

export function main() {
    document.body.innerHTML = loadForm();
    
    const form = document.getElementById('loginForm');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        try {
            await login({ username, password });
            document.body.innerHTML = loadDashboard();
            
            // Fetch all data
            const [userResult, xpResult, progressResult, auditResult] = await Promise.all([
                graphqlQuery(queries.user),
                graphqlQuery(queries.xp),
                graphqlQuery(queries.progress),
                graphqlQuery(queries.audit)
            ]);
            
            const user = userResult.user[0];
            const totalXP = xpResult.transaction.reduce((sum, t) => sum + t.amount, 0);
            const completedProjects = progressResult.progress.length;
            const auditRatio = auditResult.user[0].auditRatio;
            
            // Set avatar image
            document.querySelector('.user-avatar img').src = user.avatarUrl || '';
            
            // Update navbar (header)
            document.querySelector('.user-details h3').textContent = user.login;
            document.querySelector('.user-details span').textContent = `Level ${user.Level || 0}`;
            
            // Update user info card
            document.querySelectorAll('.info-item p')[0].textContent = user.login;
            document.querySelectorAll('.info-item p')[1].textContent = `Level ${user.Level || 0}`;
            document.querySelectorAll('.info-item p')[2].textContent = user.email || 'N/A';
            
            // Update stats
            document.querySelectorAll('.stat-value')[0].textContent = totalXP.toLocaleString();
            document.querySelectorAll('.stat-value')[1].textContent = auditRatio.toFixed(2);
            document.querySelectorAll('.stat-value')[2].textContent = completedProjects;
            
        } catch (error) {
            console.error('Login failed:', error.message);
        }
    });
}

main();