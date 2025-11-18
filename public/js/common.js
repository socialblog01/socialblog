// Check if user is logged in via LocalStorage (Backend handles actual security via HttpOnly Cookie)
const getUser = () => {
    try {
        return JSON.parse(localStorage.getItem('user'));
    } catch {
        return null;
    }
};

const updateNav = () => {
    const user = getUser();
    const guestNav = document.getElementById('nav-guest');
    const userNav = document.getElementById('nav-user');
    const usernameDisplay = document.getElementById('username-display');

    if (user) {
        guestNav.classList.add('hidden');
        userNav.classList.remove('hidden');
        usernameDisplay.textContent = user.username;
    } else {
        guestNav.classList.remove('hidden');
        userNav.classList.add('hidden');
    }
};

// Global Logout
async function logout() {
    try {
        await fetch('/api/logout'); // Clear cookie on server
        localStorage.removeItem('user'); // Clear local state
        window.location.href = '/';
    } catch (err) {
        console.error('Logout failed', err);
    }
}

// Run on page load
document.addEventListener('DOMContentLoaded', updateNav);
