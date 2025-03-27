document.addEventListener('DOMContentLoaded', () => {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    const registerForm = document.getElementById('register-form');
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;
        
        try {
            const response = await fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            
            const data = await response.json();
            
            const responseDiv = document.getElementById('register-response');
            if (response.ok) {
                responseDiv.className = 'response success';
                responseDiv.textContent = data.message;
                registerForm.reset();
            } else {
                responseDiv.className = 'response error';
                responseDiv.textContent = data.message;
            }
        } catch (error) {
            console.error('Error:', error);
            document.getElementById('register-response').className = 'response error';
            document.getElementById('register-response').textContent = 'An error occurred';
        }
    });
    
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        
        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            
            const data = await response.json();
            
            const responseDiv = document.getElementById('login-response');
            if (response.ok) {
                responseDiv.className = 'response success';
                responseDiv.textContent = 'Login successful! Token saved.';
                loginForm.reset();
                
                localStorage.setItem('jwtToken', data.token);
            } else {
                responseDiv.className = 'response error';
                responseDiv.textContent = data.message;
            }
        } catch (error) {
            console.error('Error:', error);
            document.getElementById('login-response').className = 'response error';
            document.getElementById('login-response').textContent = 'An error occurred';
        }
    });
    
    const fetchProtectedBtn = document.getElementById('fetch-protected');
    fetchProtectedBtn.addEventListener('click', async () => {
        const token = localStorage.getItem('jwtToken');
        
        if (!token) {
            document.getElementById('protected-response').className = 'response error';
            document.getElementById('protected-response').textContent = 'No token found. Please login first.';
            return;
        }
        
        try {
            const response = await fetch('http://localhost:3000/protected', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            const data = await response.json();
            
            const responseDiv = document.getElementById('protected-response');
            if (response.ok) {
                responseDiv.className = 'response success';
                responseDiv.innerHTML = `
                    <p>${data.message}</p>
                    <p>User: ${data.user.username}</p>
                    <p>Token: <code>${data.token}</code></p>
                `;
            } else {
                responseDiv.className = 'response error';
                responseDiv.textContent = 'Access denied';
            }
        } catch (error) {
            console.error('Error:', error);
            document.getElementById('protected-response').className = 'response error';
            document.getElementById('protected-response').textContent = 'An error occurred';
        }
    });
});