import { loadForm } from './form.js';
import { login, logout, graphqlQuery, isAuthenticated } from './auth.js';
import { loadDashboard } from './dashboard.js';
import { queries } from './getdata.js';
import { loadfailchars, createSkillChart } from './chars.js';

export function main() {
    if (isAuthenticated()) {
        showDashboard();
        return;
    }
    
    document.body.innerHTML = loadForm();
    
    const form = document.getElementById('loginForm');
    form.addEventListener('submit', async (event) => {
        event.preventDefault()
        
        const username = document.getElementById('username').value
        const password = document.getElementById('password').value
        
        try {
            await login({ username, password })
            showDashboard()
        } catch (error) {
            const errorDiv = document.getElementById('errorMessage');
            errorDiv.textContent = 'Invalid username or password';
        }
    });
}

async function showDashboard() {
    try {
        document.body.innerHTML = loadDashboard();
        
        const [userResult, xpResult, progressResult, auditResult, level, skillsResult] = await Promise.all([
            graphqlQuery(queries.user),
            graphqlQuery(queries.xp),
            graphqlQuery(queries.progress),
            graphqlQuery(queries.audit),
            graphqlQuery(queries.level),
            graphqlQuery(queries.skills)
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
        
       
        document.querySelector('.chart-container').innerHTML = `<h4>Audit Performance</h4>${loadfailchars(failCount, successCount)}`;
        document.querySelectorAll('.chart-container')[1].innerHTML = `<h4>Skills Performance</h4>${createSkillChart(skillsResult.transaction)}`;
        
        // Setup logout
        document.querySelector('.logout-btn').addEventListener('click', () => {
            logout();
            main();
        });
        
    } catch (error) {
        console.error('Dashboard failed:', error.message);
        logout();
        main();
    }
}

main();