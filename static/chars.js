export function loadfailchars(fails, success) {
    const total = fails + success;
    const failHeight = total > 0 ? (fails / total) * 300 : 0;
    const successHeight = total > 0 ? (success / total) * 300 : 0;
    const failY = 320 - failHeight;
    const successY = 320 - successHeight;
    
    return `
    <svg width="600" height="400" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect x="0" y="0" width="600" height="400" fill="#ffffff"/>

  <!-- Axes -->
  <line x1="80" y1="40" x2="80" y2="320" stroke="#333" stroke-width="3"/>
  <line x1="80" y1="320" x2="520" y2="320" stroke="#333" stroke-width="3"/>

  <!-- Failures bar (red) -->
  <rect x="160" y="${failY}" width="100" height="${failHeight}" fill="#e53935"/>
  <text x="210" y="350" text-anchor="middle" font-size="16" fill="#333">
    Fails
  </text>

  <!-- Success bar (green) -->
  <rect x="340" y="${successY}" width="100" height="${successHeight}" fill="#43a047"/>
  <text x="390" y="350" text-anchor="middle" font-size="16" fill="#333">
    Success
  </text>

  <!-- Values -->
  <text x="210" y="${failY - 15}" text-anchor="middle" font-size="18" fill="#e53935">
    ${fails}
  </text>
  <text x="390" y="${successY - 15}" text-anchor="middle" font-size="18" fill="#43a047">
    ${success}
  </text>
</svg>
`

}