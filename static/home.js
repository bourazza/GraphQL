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
const logout =document.createElement('div')
const button =document.createElement('button')
button.className = 'logout-btn'
logout.append(button)
button.textContent = 'Logout'
useravatar.className = 'useravatar'

navbar.append(useravatar)
navbar.append(logout)









const userData =document.createElement('div')
userData.className = 'userData'
document.body.append(userData)



const userinfo =document.createElement('div')
userinfo.className = 'userinfo'

document.body.append(userinfo)

const userProgres =document.createElement('div')
userProgres.className = 'userProgres'

document.body.append(userProgres)

const userRetio =document.createElement('div')
userRetio.className = 'userRetio'

document.body.append(userRetio)

const projectXp =document.createElement('div')
projectXp.className = 'projectXp'

document.body.append(projectXp)


}