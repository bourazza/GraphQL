export function loadfailchars(fails, success) {
    const total = fails + success;
    const failHeight = total > 0 ? (fails / total) * 300 : 0;
    const successHeight = total > 0 ? (success / total) * 300 : 0;
    const failY = 320 - failHeight;
    const successY = 320 - successHeight;
    
    return `
    <svg width="600" height="400" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="600" height="400" fill="#ffffff"/>

  <line x1="80" y1="40" x2="80" y2="320" stroke="#333" stroke-width="3"/>
  <line x1="80" y1="320" x2="520" y2="320" stroke="#333" stroke-width="3"/>

  <rect x="160" y="${failY}" width="100" height="${failHeight}" fill="#e53935"/>
  <text x="210" y="350" text-anchor="middle" font-size="16" fill="#333">
    Fails
  </text>

  <rect x="340" y="${successY}" width="100" height="${successHeight}" fill="#43a047"/>
  <text x="390" y="350" text-anchor="middle" font-size="16" fill="#333">
    Success
  </text>

  <text x="210" y="${failY - 15}" text-anchor="middle" font-size="18" fill="#e53935">
    ${fails}
  </text>
  <text x="390" y="${successY - 15}" text-anchor="middle" font-size="18" fill="#43a047">
    ${success}
  </text>
</svg>
`

}

export function createSkillChart(skills) {
    if (!skills || skills.length === 0) return '';
    
    const barHeight = 30;
    const spacing = 15;
    const chartHeight = skills.length * (barHeight + spacing) + 80;
    
    return `
    <svg width="100%" height="${chartHeight}" viewBox="0 0 600 ${chartHeight}" xmlns="http://www.w3.org/2000/svg">
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
                      fill="#4285f4" rx="15" ry="15"/>
                
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
    </svg>
    `;
}