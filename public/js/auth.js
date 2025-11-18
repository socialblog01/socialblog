const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const tabLogin = document.getElementById('tab-login');
const tabRegister = document.getElementById('tab-register');

// Tab Switching
tabLogin.onclick = () => {
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
    tabLogin.classList.add('active');
    tabRegister.classList.remove('active');
};

tabRegister.onclick = () => {
    registerForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
    tabRegister.classList.add('active');
    tabLogin.classList.remove('active');
};

// Login Handler
loginForm.onsubmit = async (e) => {
    e.preventDefault();
    const username = document.getElementById('login-user').value;
    const password = document.getElementById('login-pass').value;
    const msg = document.getElementById('login-msg');

    msg.textContent = 'Logging in...';

    try {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();

        if (res.ok) {
            // Store user data for UI (Cookie handles actual auth)
            localStorage.setItem('user', JSON.stringify(data.user));
            window.location.href = '/';
        } else {
            msg.textContent = data.error || 'Login failed';
        }
    } catch (err) {
        msg.textContent = 'Network error.';
    }
};

// Register Handler
registerForm.onsubmit = async (e) => {
    e.preventDefault();
    const username = document.getElementById('reg-user').value;
    const password = document.getElementById('reg-pass').value;
    const msg = document.getElementById('reg-msg');

    msg.textContent = 'Creating account...';

    try {
        const res = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        if (res.ok) {
            alert('Account created! Please log in.');
            tabLogin.click();
            msg.textContent = '';
        } else {
            const data = await res.json();
            msg.textContent = data.error || 'Registration failed';
        }
    } catch (err) {
        msg.textContent = 'Network error.';
    }
};
