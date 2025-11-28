
import { reloadHome } from './home.js';

export function reloadforme() {
    const continer =document.createElement('div')
    continer.className = 'continer'
    //  document.getElementsByClassName('continer')[0];
    
    // // Clear container
    // continer.innerHTML = '';
    
    // Create icon container
    const iconContainer = document.createElement('div');
    iconContainer.className = 'icon-container';
    iconContainer.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
        </svg>
    `;
    
    // Create heading
    const heading = document.createElement('h1');
    heading.textContent = 'GraphQL Profile';
    
    // Create subtitle
    const subtitle = document.createElement('p');
    subtitle.className = 'subtitle';
    subtitle.textContent = 'Sign in to view your profile and statistics';
    
    // Create form
    const form = document.createElement('form');
    
    // Create username form group
    const usernameGroup = document.createElement('div');
    usernameGroup.className = 'form-group';
    
    const usernameLabel = document.createElement('label');
    usernameLabel.setAttribute('for', 'username');
    usernameLabel.textContent = 'Username or Email';
    
    const usernameInput = document.createElement('input');
    usernameInput.id = 'username';
    usernameInput.name = 'username';
    usernameInput.type = 'text';
    usernameInput.placeholder = 'Enter your username or email';
    
    usernameGroup.appendChild(usernameLabel);
    usernameGroup.appendChild(usernameInput);
    
    // Create password form group
    const passwordGroup = document.createElement('div');
    passwordGroup.className = 'form-group';
    
    const passwordLabel = document.createElement('label');
    passwordLabel.setAttribute('for', 'password');
    passwordLabel.textContent = 'Password';
    
    const passwordInput = document.createElement('input');
    passwordInput.id = 'password';
    passwordInput.name = 'password';
    passwordInput.type = 'password';
    passwordInput.placeholder = 'Enter your password';
    
    passwordGroup.appendChild(passwordLabel);
    passwordGroup.appendChild(passwordInput);
    
    // Create submit button
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Sign In';
    
    // Append form elements
    form.appendChild(usernameGroup);
    form.appendChild(passwordGroup);
    form.appendChild(submitButton);
    
    // Add form submit event listener
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = usernameInput.value;
        const password = passwordInput.value;
        await loginfeatch(username, password);
    });
    
    // Append all elements to container
    continer.appendChild(iconContainer);
    continer.appendChild(heading);
    continer.appendChild(subtitle);
    continer.appendChild(form);
    document.body.appendChild(continer);
    
    // Create help icon if it doesn't exist
    if (!document.querySelector('.help-icon')) {
        const helpIcon = document.createElement('div');
        helpIcon.className = 'help-icon';
        helpIcon.textContent = '?';
        document.body.appendChild(helpIcon);
    }
}

async function loginfeatch(username, password) {
  const token01=      btoa(`${username}:${password}`)

    const urldata= await fetch("https://learn.zone01oujda.ma/api/auth/signin",{
        method : "POST",
        headers :{
                   "Authorization": `Basic ${token01}`

        },
       
    })
    
    if (!urldata.ok) {
        console.log("Login failed:", urldata.status);
        return;
    }
    
    const jwt = await urldata.json();
    console.log("JWT token:", btoa(jwt));
    console.log("JWT token:", jwt);
    localStorage.setItem('jwt', jwt);
    
    
    if (jwt.includes('error')) {
        console.log("Authentication failed:", jwt);
        return;
    }
    const query = `
    {
      user {
        id
        login
        email
        totalUp
        totalDown
        auditRatio
        level
        transactions(where: {type: {_eq: "xp"}}) {
          amount
          createdAt
          path
        }
        progresses {
          grade
          path
          createdAt
          object {
            name
            type
          }
        }
        results {
          grade
          path
          createdAt
          object {
            name
            type
          }
        }
      }
    }
  `;

  const graphResponse = await fetch("https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql", {
    method: "POST",
    headers: {
      
       "Content-Type": "application/json",
      "Authorization": `Bearer ${jwt}`
    },
    body: JSON.stringify({ query })
  });

  const data = await graphResponse.json();
  console.log("GraphQL data:", data);
  
  if (data.data && data.data.user) {
    console.log("login success");
    const continer = document.getElementsByClassName('continer')[0];
    continer.innerHTML = '';
    continer.className = '';
    const helpIcon = document.querySelector('.help-icon');
    if (helpIcon) helpIcon.remove();
    reloadHome();
  }
}
