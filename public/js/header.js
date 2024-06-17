document.addEventListener('DOMContentLoaded', function() {
    fetch('/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header').innerHTML = data;
            updateCartCount(1); // Supondo userId 1
            checkLoginStatus();
        });

    function checkLoginStatus() {
        const user = sessionStorage.getItem('user');
        const accountLink = document.getElementById('account-link');

        if (user) {
            accountLink.href = '/dashboard.html';
        } else {
            accountLink.href = '/login.html';
        }
    }

    function logout() {
        sessionStorage.removeItem('user');
        window.location.href = '/login.html';
    }
});
