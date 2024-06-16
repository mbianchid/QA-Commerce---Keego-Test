document.addEventListener('DOMContentLoaded', function () {
    fetch('/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header').innerHTML = data;
            updateCartCount(1); // Supondo userId 1
            checkLoginStatus();
        });

    function checkLoginStatus() {
        const user = JSON.parse(sessionStorage.getItem('user'));
        if (user) {
            document.getElementById('login-link').classList.add('d-none');
            const logoutLink = document.createElement('li');
            logoutLink.className = 'nav-item';
            logoutLink.innerHTML = `<a class="nav-link" href="#" id="logout-link">LOGOUT</a>`;
            document.querySelector('.navbar-nav').appendChild(logoutLink);
            logoutLink.addEventListener('click', logout);
        }
    }

    function logout() {
        sessionStorage.removeItem('user');
        window.location.href = '/login.html';
    }
});
