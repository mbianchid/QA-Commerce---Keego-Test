document.addEventListener('DOMContentLoaded', function() {
    const userId = 1; // Supondo um usuário com id 1
    const shippingFee = 19.90; // Valor fixo do frete

    loadCart(userId);

    // Função para carregar o carrinho
    function loadCart(userId) {
        fetch(`/api/carrinho/${userId}`)
            .then(response => response.json())
            .then(cartItems => {
                const cartList = document.getElementById('cart-list');
                const totalProductsElement = document.getElementById('total-products');
                const shippingFeeElement = document.getElementById('shipping-fee');
                const totalWithShippingElement = document.getElementById('total-with-shipping');

                // Limpar a lista de produtos antes de adicionar novos
                cartList.innerHTML = '';

                let totalProducts = 0;

                cartItems.forEach(item => {
                    const cartItem = document.createElement('div');
                    cartItem.className = 'cart-item';
                    cartItem.innerHTML = `
                        <h3>${item.name}</h3>
                        <p>Price: R$${(item.price).toFixed(2)}</p>
                        <p>Quantity: ${item.quantity}</p>
                        <p>Total: R$${(item.price * item.quantity).toFixed(2)}</p>
                        <button class="remove-from-cart" data-product-id="${item.productId}">Remover</button>
                    `;
                    cartList.appendChild(cartItem);

                    // Acumular o total dos produtos
                    totalProducts += item.price * item.quantity;
                });

                // Atualizar os totais no DOM
                totalProductsElement.innerHTML = `Total de Produtos: R$${totalProducts.toFixed(2)}`;
                shippingFeeElement.innerHTML = `Frete: R$${shippingFee.toFixed(2)}`;
                totalWithShippingElement.innerHTML = `Total com Frete: R$${(totalProducts + shippingFee).toFixed(2)}`;

                // Adicionar evento de clique para os botões "Remover"
                document.querySelectorAll('.remove-from-cart').forEach(button => {
                    button.addEventListener('click', function() {
                        const productId = this.dataset.productId;
                        console.log('Removendo produto com ID:', productId); // Para depuração

                        fetch(`/api/carrinho/${userId}/${productId}`, {
                            method: 'DELETE',
                        })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Erro ao remover produto');
                            }
                            return response.json();
                        })
                        .then(data => {
                            alert('Produto removido do carrinho!');
                            // Atualizar a lista de produtos no carrinho sem recarregar a página
                            loadCart(userId);
                        })
                        .catch(error => {
                            console.error('Erro ao remover produto do carrinho:', error);
                        });
                    });
                });
            })
            .catch(error => console.error('Erro ao buscar produtos no carrinho:', error));
    }
});
