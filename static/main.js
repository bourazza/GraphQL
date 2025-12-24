import { loadForm } from './form.js';
import { login, graphqlQuery } from './auth.js';
import { loadDashboard } from './dashboard.js';
import { queries } from './getdata.js';
import { loadfailchars } from './chars.js';

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
            
            
            const [userResult, xpResult, progressResult, auditResult, level] = await Promise.all([
                graphqlQuery(queries.user),
                graphqlQuery(queries.xp),
                graphqlQuery(queries.progress),
                graphqlQuery(queries.audit),
                graphqlQuery(queries.level)
            ]);
            
            const user = userResult.user[0];
            const totalXP = xpResult.transaction.reduce((sum, t) => sum + t.amount, 0);
            const completedProjects = progressResult.progress.length;
            const auditRatio = auditResult.user[0].auditRatio;
            
            const userLevel = level.transaction[0]?.amount || 0;
            
            document.querySelector('.user-avatar img').src = user.avatarUrl || '';
            
            document.querySelector('.user-details h3').textContent = user.login;
            
            document.querySelectorAll('.info-item p')[0].textContent = user.login;
            document.querySelector('.user-level').textContent = `Level ${userLevel}`;
            document.querySelectorAll('.info-item p')[1].textContent = user.email || 'N/A';
            
            const successCount = auditResult.user[0].audits_aggregate.aggregate.count;
            const failCount = auditResult.user[0].failed_audits.aggregate.count;
            
            document.querySelectorAll('.stat-value')[0].textContent = totalXP.toLocaleString();
            document.querySelectorAll('.stat-value')[1].textContent = auditRatio.toFixed(2);
            document.querySelectorAll('.stat-value')[2].textContent = completedProjects;
            
            // Display chart
            document.querySelector('.chart-container').innerHTML = `<h4>Audit Performance</h4>${loadfailchars(failCount, successCount)}`;
            
        } catch (error) {
            console.error('Login failed:', error.message);
        }
    });
}

main();
