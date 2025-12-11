import { Auth } from './auth.js';
import { loadForm } from './form.js';
import { loadDashboard } from './dashboard.js';

class App {
    constructor() {
        this.init();
    }

    init() {
        if (Auth.isAuthenticated()) {
            this.showDashboard();
        } else {
            this.showLogin();
        }
    }

    showLogin() {
        document.body.innerHTML = loadForm();
        this.setupLoginForm();
    }

    async showDashboard() {
        try {
            const userData = await this.fetchUserData();
            document.body.innerHTML = loadDashboard();
            this.populateDashboard(userData);
            this.setupLogout();
        } catch (error) {
            console.error('Failed to load dashboard:', error);
            Auth.logout();
            this.showLogin();
        }
    }

    setupLoginForm() {
        const form = document.getElementById('loginForm');
        const errorDiv = document.getElementById('errorMessage');
        const submitBtn = document.getElementById('submitBtn');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            submitBtn.textContent = 'Signing In...';
            submitBtn.disabled = true;
            errorDiv.textContent = '';

            try {
                await Auth.login({ username, password });
                this.showDashboard();
            } catch (error) {
                errorDiv.textContent = error.message;
            } finally {
                submitBtn.textContent = 'Sign In';
                submitBtn.disabled = false;
            }
        });
    }

    setupLogout() {
        const logoutBtn = document.querySelector('.logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                Auth.logout();
                this.showLogin();
            });
        }
    }

    async fetchUserData() {
        const userQuery = `{
            user {
                id
                login
                email
                auditRatio
                Level: attrs(path: "level")
            }
        }`;

        const xpQuery = `{
            transaction(where: {type: {_eq: "xp"}}) {
                amount
                createdAt
                path
            }
        }`;

        const progressQuery = `{
            progress(where: {grade: {_gte: 1}, object: {type: {_eq: "project"}}}) {
                id
                path
            }
        }`;

        const levelQuery = `{
            transaction(where: {type: {_eq: "level"}, event: {object: {name: {_eq: "Module"}}}}, order_by: {amount: desc}, limit: 1) {
                amount
            }
        }`;

        const skillsQuery = `{
            transaction(where: {type: {_like: "skill_%"}}, distinct_on: type, order_by: {type: asc, amount: desc}) {
                type
                amount
            }
        }`;

        const auditQuery = `{
            user {
                auditRatio
                auditsAssigned
                audits_aggregate(where: {closureType: {_eq: succeeded}}) {
                    aggregate {
                        count
                    }
                }
                failed_audits: audits_aggregate(where: {closureType: {_eq: failed}}) {
                    aggregate {
                        count
                    }
                }
            }
        }`;

        const [userResult, xpResult, progressResult, levelResult, skillsResult, auditResult] = await Promise.all([
            Auth.graphqlQuery(userQuery),
            Auth.graphqlQuery(xpQuery),
            Auth.graphqlQuery(progressQuery),
            Auth.graphqlQuery(levelQuery),
            Auth.graphqlQuery(skillsQuery),
            Auth.graphqlQuery(auditQuery)
        ]);

        return {
            user: userResult.user[0],
            transactions: xpResult.transaction,
            progress: progressResult.progress,
            levelData: levelResult.transaction,
            skills: skillsResult.transaction,
            auditData: auditResult.user[0]
        };
    }

    populateDashboard(data) {
        // Calculate XP only from projects shown in the list (excluding piscines)
        const projectXP = data.transactions
            .filter(t => !t.path || (!t.path.includes('piscine-go') && !t.path.includes('piscine-js/')))
            .reduce((sum, t) => sum + t.amount, 0);
        
        // Count completed projects (excluding piscines)
        const completedProjects = data.progress
            .filter(p => !p.path.includes('piscine-go') && !p.path.includes('piscine-js/'))
            .length;
        
        // Get user level from transaction amount
        let level = 0;
        if (data.levelData && data.levelData.length > 0) {
            level = data.levelData[0].amount || 0;
        }
        
        // Update user info
        document.querySelector('.user-details h3').textContent = data.user.login;
        document.querySelector('.user-details span').textContent = `Level ${level}`;
        document.querySelector('.user-avatar span').textContent = data.user.login[0].toUpperCase();
        
        // Update stats
        const statValues = document.querySelectorAll('.stat-value');
        if (statValues[0]) statValues[0].textContent = projectXP.toLocaleString();
        if (statValues[1]) statValues[1].textContent = data.user.auditRatio?.toFixed(2) || '0.00';
        if (statValues[2]) statValues[2].textContent = completedProjects;
        
        // Update user information section
        const fullName = `${data.user.attrs?.firstName || ''} ${data.user.attrs?.lastName || ''}`.trim() || data.user.login;
        
        const infoItems = document.querySelectorAll('.info-item p');
        if (infoItems[0]) infoItems[0].textContent = fullName;
        if (infoItems[1]) infoItems[1].textContent = `Level ${level}`;
        if (infoItems[2]) infoItems[2].textContent = data.user.email || 'N/A';
        
        // Create project XP list
        this.createProjectList(data.transactions);
        
        // Create skills chart
        this.createSkillsChart(data.skills);
        
        // Create audit chart
        this.createAuditChart(data.auditData);
    }

    createProjectList(transactions) {
        // Filter out piscines and sort by date (latest first)
        const filteredTransactions = transactions
            .filter(t => !t.path || (!t.path.includes('piscine-go') && !t.path.includes('piscine-js/')))
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        const chartContainer = document.querySelector('.chart-container');
        if (!chartContainer) return;

        const projectList = `
            <div class="project-list">
                ${filteredTransactions.map(t => {
                    const projectName = t.object?.name || t.path.split('/').pop() || 'Unknown';
                    const date = new Date(t.createdAt).toLocaleDateString();
                    return `
                        <div class="project-item">
                            <div class="project-info">
                                <span class="project-name">${projectName}</span>
                                <span class="project-date">${date}</span>
                            </div>
                            <span class="project-xp">${t.amount.toLocaleString()} XP</span>
                        </div>
                    `;
                }).join('')}
            </div>
        `;

        chartContainer.innerHTML = projectList;
    }

    createSkillsChart(skills) {
        const secondChartContainer = document.querySelectorAll('.chart-section')[1];
        if (!secondChartContainer || !skills || skills.length === 0) return;

        const barHeight = 30;
        const spacing = 15;
        const chartHeight = skills.length * (barHeight + spacing) + 80;

        const skillsChart = `
            <h3>Skills Performance</h3>
            <div class="skills-container">
                <svg width="100%" height="${chartHeight}" viewBox="0 0 600 ${chartHeight}">
                    ${skills.map((skill, i) => {
                        const skillName = skill.type.replace('skill_', '').replace('_', ' ');
                        const barWidth = (skill.amount / 100) * 400;
                        const y = i * (barHeight + spacing) + 30;
                        
                        return `
                            <!-- Background bar -->
                            <rect x="150" y="${y}" width="400" height="${barHeight}" 
                                  fill="#e8f0fe" rx="15" ry="15" stroke="#dadce0" stroke-width="1"/>
                            
                            <!-- Progress bar -->
                            <rect x="150" y="${y}" width="${barWidth}" height="${barHeight}" 
                                  fill="url(#skillGradient)" rx="15" ry="15"/>
                            
                            <!-- Skill name -->
                            <text x="140" y="${y + 20}" text-anchor="end" font-size="14" font-weight="500" fill="#333">
                                ${skillName}
                            </text>
                            
                            <!-- Skill value -->
                            <text x="570" y="${y + 20}" font-size="14" font-weight="bold" fill="#4285f4">
                                ${skill.amount}%
                            </text>
                        `;
                    }).join('')}
                    
                    <!-- Gradient definition -->
                    <defs>
                        <linearGradient id="skillGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" style="stop-color:#4285f4;stop-opacity:0.8" />
                            <stop offset="100%" style="stop-color:#1a73e8;stop-opacity:1" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
        `;

        secondChartContainer.innerHTML = skillsChart;
    }

    createAuditChart(auditData) {
        const thirdChartContainer = document.querySelectorAll('.chart-section')[2];
        if (!thirdChartContainer || !auditData) return;

        const successCount = auditData.audits_aggregate.aggregate.count;
        const failCount = auditData.failed_audits.aggregate.count;
        const totalAudits = successCount + failCount;
        
        if (totalAudits === 0) return;

        const successPercentage = ((successCount / totalAudits) * 100).toFixed(0);
        const failPercentage = ((failCount / totalAudits) * 100).toFixed(0);
        
        const successAngle = (successCount / totalAudits) * 360;
        const failAngle = (failCount / totalAudits) * 360;

        const auditChart = `
            <h3>Audit Performance</h3>
            <div class="audit-container">
                <svg width="100%" height="300" viewBox="0 0 400 300">
                    <!-- Donut chart -->
                    <g transform="translate(200,150)">
                        <!-- Success arc -->
                        <path d="M 0,-80 A 80,80 0 ${successAngle > 180 ? 1 : 0},1 ${80 * Math.sin(successAngle * Math.PI / 180)},${-80 * Math.cos(successAngle * Math.PI / 180)} L ${50 * Math.sin(successAngle * Math.PI / 180)},${-50 * Math.cos(successAngle * Math.PI / 180)} A 50,50 0 ${successAngle > 180 ? 1 : 0},0 0,-50 Z" 
                              fill="#10b981" stroke="white" stroke-width="2"/>
                        
                        <!-- Fail arc -->
                        <path d="M ${80 * Math.sin(successAngle * Math.PI / 180)},${-80 * Math.cos(successAngle * Math.PI / 180)} A 80,80 0 ${failAngle > 180 ? 1 : 0},1 0,-80 L 0,-50 A 50,50 0 ${failAngle > 180 ? 1 : 0},0 ${50 * Math.sin(successAngle * Math.PI / 180)},${-50 * Math.cos(successAngle * Math.PI / 180)} Z" 
                              fill="#ef4444" stroke="white" stroke-width="2"/>
                        
                        <!-- Center text -->
                        <text x="0" y="-5" text-anchor="middle" font-size="18" font-weight="bold" fill="#333">
                            ${totalAudits} audits
                        </text>
                        <text x="0" y="15" text-anchor="middle" font-size="12" fill="#666">
                            Total
                        </text>
                    </g>
                    
                    <!-- Legend -->
                    <g transform="translate(50,250)">
                        <rect x="0" y="0" width="12" height="12" fill="#10b981"/>
                        <text x="20" y="10" font-size="14" fill="#333">Success Rate: ${successPercentage}%</text>
                        
                        <rect x="180" y="0" width="12" height="12" fill="#ef4444"/>
                        <text x="200" y="10" font-size="14" fill="#333">Fail Rate: ${failPercentage}%</text>
                    </g>
                </svg>
            </div>
        `;

        thirdChartContainer.innerHTML = auditChart;
    }
}

new App();