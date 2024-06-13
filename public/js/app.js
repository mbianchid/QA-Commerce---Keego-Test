document.addEventListener('DOMContentLoaded', function() {
    const userId = 1; // Supondo um usuário com id 1
    fetch('/api/produtos')
        .then(response => response.json())
        .then(products => {
            const productList = document.getElementById('product-list');

            // Limpar a lista de produtos antes de adicionar novos
            productList.innerHTML = '';

            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                productCard.innerHTML = `
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <p>Price: $${product.price}</p>
                    <img src="${product.image}" alt="${product.name}" />
                    <label for="quantity-${product.id}">Quantidade:</label>
                    <input type="number" id="quantity-${product.id}" value="1" min="1" />
                    <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                `;
                productList.appendChild(productCard);
            });

            // Adicionar evento de clique para os botões "Add to Cart"
            document.querySelectorAll('.add-to-cart').forEach(button => {
                button.addEventListener('click', function() {
                    const productId = this.dataset.id;
                    const quantity = document.getElementById(`quantity-${productId}`).value;
                    fetch('/api/carrinho', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ userId: 1, productId: productId, quantity: parseInt(quantity, 10) })
                    })
                    .then(response => response.json())
                    .then(data => {
                        alert('Produto adicionado ao carrinho!');
                        // Atualizar o contador do carrinho
                        updateCartCount(userId);
                    })
                    .catch(error => console.error('Erro ao adicionar produto ao carrinho:', error));
                });
            });
        })
        .catch(error => console.error('Erro ao buscar produtos:', error));
});

// Função para atualizar o contador do carrinho
function updateCartCount(userId) {
    fetch(`/api/carrinho/${userId}`)
        .then(response => response.json())
        .then(cartItems => {
            const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
            document.getElementById('cart-count').textContent = cartCount;
        })
        .catch(error => console.error('Erro ao atualizar o contador do carrinho:', error));
}
