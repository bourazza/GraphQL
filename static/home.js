export function reloadHome(){
const navbar =document.createElement('nav')
navbar.className = 'navbar'
document.body.append(navbar)
const useravatar =document.createElement('div')
useravatar.className = 'useravatar'
useravatar.innerHTML = `<img src="../templet/imgs/user.png" alt="User Avatar">
<div>
<h1>Zaki@gmail.com</h1>
<p>36</p>
</div>`
const logout = document.createElement('div')
const button = document.createElement('button')
button.className = 'logout-btn'

button.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
        viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="m16 17 5-5-5-5"></path>
        <path d="M21 12H9"></path>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    </svg>
    <span>Logout</span>
`;

logout.append(button);
useravatar.className = 'useravatar'

navbar.append(useravatar)
navbar.append(logout)








const continer = document.createElement('div')
continer.className='continer'




const userinfo =document.createElement('div')
userinfo.className = 'userinfo'
const TotalXP=document.createElement('div')
TotalXP.className = 'TotalXP'
TotalXP.innerHTML=`
<div class="icon-container">
    <svg xmlns="http://www.w3.org/2000/svg"
     width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" 
     stroke-linejoin="round" class="lucide lucide-trending-up" aria-hidden="true">
     <path d="M16 7h6v6"></path><path d="m22 7-8.5 8.5-5-5L2 17"></path></svg>
</div>
 <div class="data">
 <h3>Total XP</h3>
 <p>38,448</p>
 </div>
`




const AuditRatio =document.createElement('div')
AuditRatio.className = 'AuditRatio'
AuditRatio.innerHTML=`
<div class="icon-container">
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
 stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
  class="lucide lucide-award w-5 h-5 text-green-600" aria-hidden="true">
  <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"></path><circle cx="12" cy="8" r="6"></circle></svg>
</div>
 <div class="data">
 <h3>Audit Ratio</h3>
 <p>3,6</p>
 </div>
`





const ProjectsCompleted =document.createElement('div')
ProjectsCompleted.className = 'ProjectsCompleted'

ProjectsCompleted.innerHTML=`
<div class="icon-container">
<div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg"
 width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" 
 stroke-linejoin="round" class="lucide lucide-target w-5 h-5 text-purple-600" aria-hidden="true">
 <circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2">
 </circle></svg></div>
  </div>
 <div class="data">
 <h3>Projects Completed</h3>
 <p>10</p>
 </div>
`




userinfo.append(TotalXP)
userinfo.append(AuditRatio)
userinfo.append(ProjectsCompleted)


continer.append(userinfo)
const userData =document.createElement('div')
userData.className = 'userData'
continer.append(userData)

const userProgres =document.createElement('div')
userProgres.className = 'userProgres'

continer.append(userProgres)

const userRetio =document.createElement('div')
userRetio.className = 'userRetio'

continer.append(userRetio)

const projectXp =document.createElement('div')
projectXp.className = 'projectXp'

continer.append(projectXp)
document.body.append(continer)


}