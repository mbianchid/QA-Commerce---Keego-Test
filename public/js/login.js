document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
        .then(response => response.json())
        .then(user => {
            if (user.error) {
                throw new Error(user.error);
            }

            // Armazena os dados do usuário no sessionStorage
            sessionStorage.setItem('user', JSON.stringify({ id: user.id, name: user.name }));
            window.location.href = '/dashboard.html'; // Redireciona para o dashboard após o login
        })
        .catch(error => {
            document.getElementById('error-message').textContent = `Erro ao autenticar: ${error.message}`;
        });
    });
});
