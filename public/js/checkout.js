document.addEventListener('DOMContentLoaded', function() {
    const paymentCard = document.getElementById('payment-card');
    const paymentBoleto = document.getElementById('payment-boleto');
    const paymentPix = document.getElementById('payment-pix');
    const cardDetails = document.getElementById('card-details');
    const boletoDetails = document.getElementById('boleto-details');
    const pixDetails = document.getElementById('pix-details');
    const boletoCode = document.getElementById('boleto-code');
    const pixKey = document.getElementById('pix-key');
    const pixQrCode = document.getElementById('pix-qr-code');
    const createAccountCheckbox = document.getElementById('create-account');
    const passwordFields = document.getElementById('password-fields');
    const form = document.getElementById('checkout-form');
    const alertContainer = document.getElementById('alert-container');

    // Função para gerar um código de boleto falso
    function generateBoletoCode() {
        return '23793.38128 60082.677139 66003.996498 1 89440000010000';
    }

    // Função para gerar uma chave e QR code Pix falso
    function generatePixDetails() {
        return {
            key: '123e4567-e89b-12d3-a456-426614174000',
            qrCode: 'https://via.placeholder.com/150' // Placeholder para QR Code
        };
    }

    // Mostrar campos com base na seleção de pagamento
    paymentCard.addEventListener('change', function() {
        cardDetails.classList.remove('d-none');
        boletoDetails.classList.add('d-none');
        pixDetails.classList.add('d-none');
    });

    paymentBoleto.addEventListener('change', function() {
        cardDetails.classList.add('d-none');
        boletoDetails.classList.remove('d-none');
        pixDetails.classList.add('d-none');
        boletoCode.textContent = generateBoletoCode();
    });

    paymentPix.addEventListener('change', function() {
        cardDetails.classList.add('d-none');
        boletoDetails.classList.add('d-none');
        pixDetails.classList.remove('d-none');
        const pixData = generatePixDetails();
        pixKey.textContent = pixData.key;
        pixQrCode.src = pixData.qrCode;
    });

    createAccountCheckbox.addEventListener('change', function() {
        if (this.checked) {
            passwordFields.classList.remove('d-none');
            document.getElementById('password').required = true;
            document.getElementById('confirm-password').required = true;
        } else {
            passwordFields.classList.add('d-none');
            document.getElementById('password').required = false;
            document.getElementById('confirm-password').required = false;
        }
    });

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        // Limpar mensagens de alerta
        alertContainer.classList.add('d-none');
        alertContainer.innerHTML = '';

        // Validação de campos obrigatórios
        const requiredFields = [
            'first-name',
            'last-name',
            'address',
            'number',
            'cep',
            'email'
        ];

        let hasErrors = false;

        // Verificar campos obrigatórios
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (!field.value.trim()) {
                hasErrors = true;
                field.classList.add('is-invalid');
            } else {
                field.classList.remove('is-invalid');
            }
        });

        if (hasErrors) {
            showAlert('Por favor, preencha todos os campos marcados com asteriscos.');
            return;
        }

        // Validação de email
        const emailField = document.getElementById('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value)) {
            hasErrors = true;
            showAlert('Por favor, insira um email válido.');
            emailField.classList.add('is-invalid');
        } else {
            emailField.classList.remove('is-invalid');
        }

        // Validação de telefone
        const phoneField = document.getElementById('phone');
        if (phoneField.value && phoneField.value.length < 10) {
            hasErrors = true;
            showAlert('O telefone deve ter pelo menos 10 caracteres.');
            phoneField.classList.add('is-invalid');
        } else {
            phoneField.classList.remove('is-invalid');
        }

        // Validação de CEP
        const cepField = document.getElementById('cep');
        if (cepField.value.length !== 8) {
            hasErrors = true;
            showAlert('O CEP deve ter 8 caracteres.');
            cepField.classList.add('is-invalid');
        } else {
            cepField.classList.remove('is-invalid');
        }

        if (createAccountCheckbox.checked) {
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            // Validar senha
            const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
            if (!passwordRegex.test(password)) {
                hasErrors = true;
                showAlert('A senha deve conter no mínimo 6 caracteres, incluindo uma letra maiúscula e um caractere especial.');
                document.getElementById('password').classList.add('is-invalid');
            } else {
                document.getElementById('password').classList.remove('is-invalid');
            }

            if (password !== confirmPassword) {
                hasErrors = true;
                showAlert('As senhas não coincidem.');
                document.getElementById('confirm-password').classList.add('is-invalid');
            } else {
                document.getElementById('confirm-password').classList.remove('is-invalid');
            }
        }

        if (!document.getElementById('terms').checked) {
            showAlert('Você deve concordar com os termos e condições.');
            return;
        }

        // Verificar os campos de pagamento com cartão se a opção for selecionada
        let paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
        if (paymentMethod === 'card') {
            paymentMethod = 'credit_card';
            const cardFields = ['card-number', 'card-expiry', 'card-cvc'];
            cardFields.forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (!field.value.trim()) {
                    hasErrors = true;
                    field.classList.add('is-invalid');
                } else {
                    field.classList.remove('is-invalid');
                }
            });

            if (hasErrors) {
                showAlert('Por favor, preencha todos os campos obrigatórios e corrija os erros.');
                return;
            }
        }

        // Se não houver erros, processar o formulário
        const userId = 1; // Supondo um usuário com id 1
        const formData = {
            userId: userId,
            firstName: document.getElementById('first-name').value,
            lastName: document.getElementById('last-name').value,
            address: document.getElementById('address').value,
            number: document.getElementById('number').value,
            cep: document.getElementById('cep').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            paymentMethod: paymentMethod,
            createAccount: createAccountCheckbox.checked,
        };

        if (formData.createAccount) {
            formData.password = document.getElementById('password').value;
        }

        if (formData.paymentMethod === 'credit_card') {
            formData.cardNumber = document.getElementById('card-number').value;
            formData.cardExpiry = document.getElementById('card-expiry').value;
            formData.cardCvc = document.getElementById('card-cvc').value;
        } else if (formData.paymentMethod === 'boleto') {
            formData.boletoCode = boletoCode.textContent;
        } else if (formData.paymentMethod === 'pix') {
            formData.pixKey = pixKey.textContent;
        }

        fetch('/api/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao finalizar pedido');
            }
            return response.json();
        })
        .then(data => {
            // Redirecionar para a página de status do pedido
            window.location.href = `/status.html?orderId=${data.id}`;
        })
        .catch(error => console.error('Erro ao finalizar pedido:', error));
    });

    // Função para exibir alertas
    function showAlert(message) {
        alertContainer.classList.remove('d-none');
        alertContainer.innerHTML = `<p>${message}</p>`;
        window.scrollTo(0, 0); // Rolagem para o topo ao exibir alertas
    }
});
