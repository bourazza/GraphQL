export function reloadforme(){
    const continer = document.getElementsByClassName('continer')[0]

    const form = document.createElement('form')
    const usernameInput = document.createElement('input')
    usernameInput.name="username"
    usernameInput.type = "text"
    const passwordInput =document.createElement('input')
    passwordInput.name = "password"
    passwordInput.type = "password"
    const submitbuton = document.createElement('button')
    form.appendChild(usernameInput)
    form.appendChild(passwordInput)
    form.appendChild(submitbuton)
    continer.appendChild(form)

}

async function loginfeatch(username, password) {
    const urldata= await fetch("https://learn.zone01oujda.ma/api/auth/signin",{
        method : "post",
        headers :{
                  "Content-Type": "application/json"

        },
        body: JSON.stringify({
      username: username,
      password: password
    })
    })
     const jwt = await urldata.text(); // Zone01 returns JWT as plain text
  console.log("JWT token:", jwt);
    const query = `
    {
      user {
        id
        login
        email
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
}
