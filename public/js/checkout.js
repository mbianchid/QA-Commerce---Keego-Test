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
    const form = document.getElementById('checkout-form');

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

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        if (!document.getElementById('terms').checked) {
            alert('Você deve concordar com os termos e condições.');
            return;
        }

        const userId = 1; // Supondo um usuário com id 1
        const totalPrice = 60 + 19.90; // Calcular o preço total baseado nos produtos do carrinho e frete

        const formData = {
            userId: userId,
            firstName: document.getElementById('first-name').value,
            lastName: document.getElementById('last-name').value,
            address: document.getElementById('address').value,
            number: document.getElementById('number').value,
            cep: document.getElementById('cep').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            paymentMethod: document.querySelector('input[name="payment-method"]:checked').value,
            totalPrice: totalPrice,
        };

        if (formData.paymentMethod === 'card') {
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
            alert('Pedido finalizado com sucesso!');
            // Redirecionar para a página de status do pedido
            window.location.href = `/status.html?orderId=${data.id}`;
        })
        .catch(error => console.error('Erro ao finalizar pedido:', error));
    });
});
