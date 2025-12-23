const API_BASE = 'https://learn.zone01oujda.ma/api';

export async function login(credentials) {
    const encoded = btoa(`${credentials.username}:${credentials.password}`);
    
    try {
        const response = await fetch(`${API_BASE}/auth/signin`, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${encoded}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Invalid credentials');
        }

        const jwt = await response.text();
        const cleanToken = jwt.replace(/"/g, '').trim();
        localStorage.setItem('jwt', cleanToken);
        return cleanToken;
    } catch (error) {
        throw new Error('Login failed: ' + error.message);
    }
}

export function logout() {
    localStorage.removeItem('jwt');
    localStorage.removeItem('userData');
}

export function getToken() {
    return localStorage.getItem('jwt');
}

export function isAuthenticated() {
    return !!getToken();
}

export async function graphqlQuery(query, variables = {}) {
    const token = getToken();
    if (!token) throw new Error('Not authenticated');

    try {
        const response = await fetch('https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query, variables })
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        if (result.errors) {
            throw new Error(result.errors[0].message);
        }
        return result.data;
    } catch (error) {
        console.error('GraphQL Error:', error);
        if (error.message.includes('JWT') || error.message.includes('auth')) {
            logout();
        }
        throw error;
    }
}